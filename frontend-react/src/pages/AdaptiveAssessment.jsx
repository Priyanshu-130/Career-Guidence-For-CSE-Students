import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Compass,
  Star,
  ExternalLink,
  Brain,
  ShieldCheck,
  Zap,
  Info,
  Check,
  Columns
} from 'lucide-react';

import {
  saveProfile,
  getNextQuestion,
  submitAnswer,
  getMastery,
  submitFeedback,
  saveSession
} from '../services/apiService';

import {
  initStudentEvidenceState,
  selectNextAdaptiveItem,
  updateEvidenceWithResponse,
  evaluateStoppingConditions,
  generateDomainShortlist,
  SELECTION_REASON_CODES
} from '../data/adaptive/adaptiveDomainCoordinator';

import {
  startingLevel,
  diagnosticScore,
  interestScores,
  behaviorSignals,
  domainMapping,
  storeFeedback
} from '../data/adaptive/adaptiveEngine';

import explainerCardsData from '../data/adaptive/explainerCards.json';
import domainMappingConfig from '../data/adaptive/domain_mapping_version.json';
import rulesConfig from '../data/adaptive/rules_version.json';
import itemBankData from '../data/adaptive/item_bank.json';
import domainsCatalogue from '../data/domains.json';

export default function AdaptiveAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const studentEmail = user?.email || 'guest_student@pathfinder.edu';

  // Master Step: 'profile' | 'diagnostic' | 'summary'
  const [step, setStep] = useState('profile');
  const [sessionId, setSessionId] = useState(() => `sess_${Math.random().toString(36).substring(2, 10)}`);

  // -----------------------------------------------------------------------
  // STEP 1: INTRO ONBOARDING PROFILE STATE
  // -----------------------------------------------------------------------
  const [semester, setSemester] = useState('1');
  const [codingExperience, setCodingExperience] = useState('none');
  const [seenLanguages, setSeenLanguages] = useState(['None yet']);
  const [thingsBuilt, setThingsBuilt] = useState(['Nothing yet — starting completely fresh']);
  const [interests, setInterests] = useState(['Artificial Intelligence', 'Software development']);
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState('none');

  // -----------------------------------------------------------------------
  // STEP 2: ADAPTIVE COORDINATOR RUNNING STATE
  // -----------------------------------------------------------------------
  const [coordinatorState, setCoordinatorState] = useState(null);
  const [activeDecision, setActiveDecision] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [hintRevealed, setHintRevealed] = useState(false);
  const [guidedEnjoyment, setGuidedEnjoyment] = useState(null); // 1-5
  const [guidedWillingness, setGuidedWillingness] = useState(null); // boolean | null
  const [selectedPendingOption, setSelectedPendingOption] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // -----------------------------------------------------------------------
  // STEP 3: SUMMARY & SHORTLIST STATE
  // -----------------------------------------------------------------------
  const [shortlistData, setShortlistData] = useState(null);
  const [hypothesisResult, setHypothesisResult] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Helper for toggle multi-select with exclusive "none" / "nothing" item
  const toggleWithExclusive = (setter, currentList, item, exclusiveItem) => {
    if (item === exclusiveItem) {
      setter([exclusiveItem]);
      return;
    }
    const filtered = currentList.filter(i => i !== exclusiveItem);
    if (filtered.includes(item)) {
      const remaining = filtered.filter(i => i !== item);
      setter(remaining.length === 0 ? [exclusiveItem] : remaining);
    } else {
      setter([...filtered, item]);
    }
  };

  // -----------------------------------------------------------------------
  // STEP 1 HANDLERS: ONBOARDING PROFILE SUBMISSION
  // -----------------------------------------------------------------------
  const handleProfileSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const isUnsure = interests.includes('Not sure yet') || 
                     interests.includes('I do not know yet') || 
                     interests.some(i => i.toLowerCase().includes('not know') || i.toLowerCase().includes('unsure'));

    const introProfile = {
      semester: parseInt(semester, 10) || 1,
      prior_programming_exposure: codingExperience,
      subjects_tools_explored: seenLanguages,
      projects_built: thingsBuilt,
      existing_career_interests: interests,
      is_unsure: isUnsure,
      preferred_language: preferredLanguage,
      accessibility_needs: accessibilityNeeds
    };

    // Initialize decoupled evidence state
    const initialEvidence = initStudentEvidenceState(introProfile, sessionId, studentEmail);
    setCoordinatorState(initialEvidence);

    // Save profile to backend
    try {
      await saveProfile({
        session_id: sessionId,
        student_email: studentEmail,
        intro_profile: introProfile,
        starter_answers: []
      });
    } catch (err) {
      console.warn('Backend saveProfile error (continuing in local mode):', err);
    }

    // Select initial adaptive item
    const firstDecision = selectNextAdaptiveItem(initialEvidence, itemBankData.questions, explainerCardsData.explainers);
    setActiveDecision(firstDecision);
    setQuestionStartTime(Date.now());
    setStep('diagnostic');
  };

  // -----------------------------------------------------------------------
  // STEP 2 HANDLERS: ADAPTIVE QUESTION & REFLECTION RESPONSE
  // -----------------------------------------------------------------------
  const handleAdaptiveAnswer = async (selectedOpt, directEnjoyment = null, directWillingness = null) => {
    if (!activeDecision || !activeDecision.item || submittingAnswer) return;
    setSubmittingAnswer(true);

    const q = activeDecision.item;
    const isIdk = selectedOpt.includes("I don't know") || selectedOpt.includes("haven't learned this yet");
    const isCorrect = (selectedOpt === q.answer || selectedOpt === q.correctOption) && !isIdk;

    let optScore = 3;
    if (selectedOpt.includes('(5)') || selectedOpt.toLowerCase().includes('strongly like')) optScore = 5;
    else if (selectedOpt.includes('(4)') || selectedOpt.toLowerCase().includes('like')) optScore = 4;
    else if (selectedOpt.includes('(2)') || selectedOpt.toLowerCase().includes('dislike')) optScore = 2;
    else if (selectedOpt.includes('(1)') || selectedOpt.toLowerCase().includes('strongly dislike')) optScore = 1;

    const timeSpent = Math.max(2, Math.round((Date.now() - questionStartTime) / 1000));
    const finalEnjoyment = directEnjoyment !== null ? directEnjoyment : guidedEnjoyment;
    const finalWillingness = directWillingness !== null ? directWillingness : guidedWillingness;

    const response = {
      question_id: q.id || q.question_id,
      question_type: q.question_type || q.category || 'interest',
      domain_tags: q.domain_tags || [q.domain || q.topic || 'ai'],
      selected_option_key: selectedOpt,
      selected_option_text: selectedOpt,
      option_score: optScore,
      is_correct: isCorrect,
      is_idk: isIdk,
      post_activity_enjoyment: finalEnjoyment,
      post_activity_willingness: finalWillingness,
      hint_used: hintRevealed,
      time_spent_seconds: timeSpent,
      selection_reason_code: activeDecision.selection_reason_code,
      evidence_gap_addressed: activeDecision.evidence_gap_addressed
    };

    const updatedState = updateEvidenceWithResponse(coordinatorState, response);
    setCoordinatorState(updatedState);

    // Persist attempt to backend (with metadata)
    try {
      await submitAnswer({
        session_id: sessionId,
        student_email: studentEmail,
        topic: response.domain_tags[0] || 'python',
        question_id: q.id || q.question_id,
        category: q.category || 'knowledge',
        answer: selectedOpt,
        correct: isCorrect,
        is_dont_know: isIdk,
        time_taken: timeSpent,
        selection_reason_code: activeDecision.selection_reason_code,
        evidence_gap_addressed: activeDecision.evidence_gap_addressed,
        post_activity_enjoyment: finalEnjoyment,
        post_activity_willingness: finalWillingness,
        hint_used: hintRevealed
      });
    } catch (err) {
      console.warn('submitAnswer backend notification:', err);
    }

    // Reset interaction state for next step
    setHintRevealed(false);
    setGuidedEnjoyment(null);
    setGuidedWillingness(null);
    setSelectedPendingOption(null);
    setQuestionStartTime(Date.now());
    setSubmittingAnswer(false);

    // Evaluate stopping conditions
    const stopCheck = evaluateStoppingConditions(updatedState, { min_questions: 6, max_questions: 12 });
    if (stopCheck.should_stop) {
      finishCoordinatorAssessment(updatedState);
    } else {
      const nextDecision = selectNextAdaptiveItem(updatedState, itemBankData.questions, explainerCardsData.explainers);
      if (!nextDecision) {
        finishCoordinatorAssessment(updatedState);
      } else {
        setActiveDecision(nextDecision);
      }
    }
  };

  // Continue from an Explainer Clarification card
  const handleAcknowledgeExplainer = () => {
    const nextDecision = selectNextAdaptiveItem(coordinatorState, itemBankData.questions, explainerCardsData.explainers);
    if (!nextDecision) {
      finishCoordinatorAssessment(coordinatorState);
    } else {
      setActiveDecision(nextDecision);
      setQuestionStartTime(Date.now());
    }
  };

  // -----------------------------------------------------------------------
  // STEP 3 HANDLERS: FINISH & GENERATE SHORTLIST
  // -----------------------------------------------------------------------
  const finishCoordinatorAssessment = async (finalState) => {
    const shortlist = generateDomainShortlist(finalState, domainsCatalogue);
    setShortlistData(shortlist);

    // Build RIASEC vector for backward-compatible hypothesis
    const riasecAnswers = (finalState.history || []).map(h => ({
      questionId: h.question_id,
      category: h.question_type,
      selectedAnswer: h.selected_option_text,
      score: h.post_activity_enjoyment ? h.post_activity_enjoyment : 3,
      selectedOptionScore: h.post_activity_enjoyment ? h.post_activity_enjoyment : 3,
      isCorrect: h.is_correct,
      isDontKnow: h.is_idk
    }));
    const riasec = interestScores(riasecAnswers);
    const behaviorAdj = behaviorSignals({ voluntaryRetries: 0 }, rulesConfig);
    const mapping = domainMapping(riasec, behaviorAdj, domainMappingConfig);
    setHypothesisResult(mapping);

    // Save session snapshot
    try {
      await saveSession({
        id: sessionId,
        student_email: studentEmail,
        intro_snapshot: finalState.onboarding_profile,
        routing_decision: { shortlist, domain_evidence: finalState.domain_evidence },
        status: 'completed'
      });
    } catch (err) {
      console.warn('saveSession backend notification:', err);
    }

    setStep('summary');
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackRating < 1 || feedbackRating > 5) return;
    try {
      await submitFeedback({
        result_id: sessionId,
        student_email: studentEmail,
        feels_right_rating: feedbackRating,
        optional_comment: feedbackComment
      });
    } catch (err) {
      console.warn('Feedback submit:', err);
    }
    setFeedbackSubmitted(true);
  };

  // =======================================================================
  // RENDER STEP 1: ONBOARDING INTAKE PROFILE
  // =======================================================================
  if (step === 'profile') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '2.5rem 1.5rem 6rem'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #D8DAD7',
            marginBottom: '3rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.8125rem'
          }}>
            <div style={{ color: '#646A73' }}>
              <Link to="/quiz" style={{ color: '#50545B', textDecoration: 'none' }}>Diagnostic Selection</Link>
              <span style={{ margin: '0 0.5rem', color: '#D8DAD7' }}>/</span>
              <span style={{ color: '#17191C', fontWeight: 600 }}>Adaptive Career Discovery</span>
            </div>
            <div style={{ color: '#E85D3F', fontWeight: 600 }}>
              STAGE 01 · INTAKE PROFILE
            </div>
          </div>

          <header style={{ marginBottom: '3rem' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E85D3F',
              marginBottom: '0.85rem'
            }}>
              STUDENT EXPLORATION ONBOARDING
            </div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1.25rem 0'
            }}>
              Discover Your Direction in Computer Science.
            </h1>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: '#50545B', margin: 0 }}>
              This is not an exam or a coding interview. Complete beginners can participate fully.
              Your answers help our agent select relevant scenarios and tailor introductory difficulty.
            </p>
          </header>

          <form onSubmit={handleProfileSubmit}>

            {/* SECTION 01: PROGRAMMING EXPOSURE */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>01</span>
                <span>// PROGRAMMING EXPOSURE</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 1.5rem 0' }}>
                How would you describe your previous programming exposure?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'none', title: 'Starting completely fresh', desc: 'No prior coding experience. Ready to explore from scratch.' },
                  { id: 'light_exploratory', title: 'Light / Exploratory', desc: 'Watched tutorials, tried block code (Scratch/Code.org), or simple HTML.' },
                  { id: 'moderate', title: 'Moderate coursework', desc: 'Familiar with basic programming constructs (loops, functions in C/C++/Python).' },
                  { id: 'substantial', title: 'Substantial practical building', desc: 'Comfortable writing scripts, apps, or full class projects.' }
                ].map(opt => {
                  const isChecked = codingExperience === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setCodingExperience(opt.id)}
                      style={{
                        padding: '1.5rem',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#17191C' }}>{opt.title}</div>
                        {isChecked && <Check size={16} color="#E85D3F" />}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.5 }}>{opt.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 02: SUBJECTS & TOOLS */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>02</span>
                <span>// SUBJECTS & TOOLS EXPLORED</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 0.5rem 0' }}>
                Which areas or tools have you encountered so far?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#50545B', margin: '0 0 1.5rem 0' }}>
                Select all that apply. Choose "None yet" if you are starting with a clean slate.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {[
                  'Python',
                  'Java',
                  'C / C++',
                  'HTML / CSS / JavaScript',
                  'Database / SQL',
                  'Logic Puzzles / Math',
                  'Arduino / Electronics',
                  'Linux / Terminal',
                  'None yet'
                ].map(area => {
                  const isChecked = seenLanguages.includes(area);
                  return (
                    <button
                      type="button"
                      key={area}
                      onClick={() => toggleWithExclusive(setSeenLanguages, seenLanguages, area, 'None yet')}
                      style={{
                        padding: '0.75rem 1.25rem',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        color: isChecked ? '#17191C' : '#50545B',
                        fontSize: '0.875rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 03: PROJECTS */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>03</span>
                <span>// PRACTICAL EXPERIMENTS</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 0.5rem 0' }}>
                What kind of projects have you tried building or experimenting with?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#50545B', margin: '0 0 1.5rem 0' }}>
                Self-reported activities calibrate context; they are never treated as formal examinations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {[
                  'Simple interactive game or animation',
                  'Personal web page or portfolio',
                  'Data analysis spreadsheet or graph',
                  'Robotics, circuit, or smart device',
                  'Nothing yet — starting completely fresh'
                ].map(item => {
                  const isChecked = thingsBuilt.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleWithExclusive(setThingsBuilt, thingsBuilt, item, 'Nothing yet — starting completely fresh')}
                      style={{
                        padding: '1rem 1.25rem',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: isChecked ? 700 : 500
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 04: EXISTING CAREER INTERESTS */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>04</span>
                <span>// INITIAL INTERESTS</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 0.5rem 0' }}>
                What domains or technologies sound intriguing right now?
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#50545B', margin: '0 0 1.5rem 0' }}>
                It is 100% fine if you do not know yet! You can select "I do not know yet" to explore all fields openly.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                {[
                  'Artificial Intelligence',
                  'Data Science',
                  'Web & App Development',
                  'Cybersecurity',
                  'Cloud Computing',
                  'IoT & Embedded Systems',
                  'Robotics & Automation',
                  'Hardware & Chip Architecture',
                  'Networking Systems',
                  'I do not know yet / Exploring all options'
                ].map(item => {
                  const isChecked = interests.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleWithExclusive(setInterests, interests, item, 'I do not know yet / Exploring all options')}
                      style={{
                        padding: '1rem 1.25rem',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: isChecked ? 700 : 500
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 05: ACADEMIC STANDING */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>05</span>
                <span>// ACADEMIC STANDING</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 1.25rem 0' }}>
                What semester or academic year are you currently in?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                {[
                  { id: '1', title: '1st Year (Sem 1–2)', desc: 'Foundations & Exploration' },
                  { id: '3', title: '2nd Year (Sem 3–4)', desc: 'Core CS & Data Structures' },
                  { id: '5', title: '3rd Year (Sem 5–6)', desc: 'Specializations & Electives' },
                  { id: '7', title: '4th Year (Sem 7–8)', desc: 'Capstones & Career Focus' }
                ].map(opt => {
                  const isChecked = semester === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSemester(opt.id)}
                      style={{
                        padding: '1rem',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#17191C', marginBottom: '0.25rem' }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#50545B' }}>{opt.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 06: ACCESSIBILITY & PREFERENCES */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DAD7',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '3rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#646A73',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem'
              }}>
                <span style={{ color: '#E85D3F', fontWeight: 700 }}>06</span>
                <span>// ACCESSIBILITY & DISPLAY</span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#17191C', margin: '0 0 1.25rem 0' }}>
                Do you have any reading or pacing preferences?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                {[
                  { id: 'none', label: 'Standard self-paced (Default)' },
                  { id: 'plain_language', label: 'Plain-language explanations' },
                  { id: 'high_contrast', label: 'High contrast text display' },
                  { id: 'extra_time', label: 'Relaxed unhurried exploration' }
                ].map(opt => {
                  const isChecked = accessibilityNeeds === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setAccessibilityNeeds(opt.id)}
                      style={{
                        padding: '1rem',
                        border: isChecked ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#FFF0EB' : '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: isChecked ? 700 : 500, fontSize: '0.875rem', color: '#17191C' }}>
                        {opt.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#17191C',
                  color: '#FFFFFF',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '1.25rem 3.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '520px'
                }}
              >
                <span>BEGIN ADAPTIVE DOMAIN EXPLORATION</span>
                <ArrowRight size={20} />
              </button>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73' }}>
                [DYNAMIC ADAPTIVE ENGINE · 9 CSE DOMAINS]
              </div>
            </div>

          </form>
        </div>
      </div>
    );
  }

  // =======================================================================
  // RENDER STEP 2: ADAPTIVE COORDINATOR RUNNER (EXPLORATION & CLARIFICATION)
  // =======================================================================
  if (step === 'diagnostic') {
    if (!activeDecision) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Calibrating next exploration task...</div>
        </div>
      );
    }

    const historyCount = coordinatorState?.history?.length || 0;
    const progressPct = Math.min(100, Math.round(((historyCount + 1) / 10) * 100));

    // CASE A: CLARIFICATION EXPLAINER CARD
    if (activeDecision.action_type === 'clarification') {
      const explainer = activeDecision.explainer || {};
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#F7F7F4',
          color: '#17191C',
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: '2.5rem 1.5rem 6rem'
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #3B82F6',
              padding: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1E40AF',
                backgroundColor: '#EFF6FF',
                padding: '0.35rem 0.75rem',
                marginBottom: '1.25rem'
              }}>
                <Info size={16} />
                <span>CLARIFYING EXPLAINER · NO PENALTY</span>
              </div>

              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '2rem',
                fontWeight: 800,
                color: '#17191C',
                margin: '0 0 1rem 0'
              }}>
                {explainer.title}
              </h2>

              <p style={{ fontSize: '1.0625rem', color: '#50545B', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                {explainer.summary}
              </p>

              {explainer.key_takeaways && (
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
                    KEY TAKEAWAYS:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', lineHeight: 1.6 }}>
                    {explainer.key_takeaways.map((point, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic', marginBottom: '2rem' }}>
                {activeDecision.reason_description}
              </p>

              <button
                type="button"
                onClick={handleAcknowledgeExplainer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#17191C',
                  color: '#FFFFFF',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '1rem 2.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>CONTINUE EXPLORATION</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // CASE B: STANDARD QUESTION OR GUIDED EXPERIENCE
    const q = activeDecision.item;
    const isGuided = q.question_type === 'guided_experience' || q.category === 'guided_activity';

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '2.5rem 1.5rem 6rem'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>

          {/* Stepper Progress & Agent Reason Banner */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: '#646A73'
            }}>
              <span>
                {q.category === 'interest' ? 'O*NET VOCATIONAL INTEREST PROBE' :
                 isGuided ? 'GUIDED DOMAIN EXPERIENCE LAB' : 'BEBRAS COMPUTATIONAL THINKING'}
              </span>
              <span>STEP {historyCount + 1} OF 10 · ADAPTIVE</span>
            </div>
            <div style={{ height: '4px', backgroundColor: '#D8DAD7', marginBottom: '1.25rem' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: '#E85D3F', transition: 'width 0.3s ease' }} />
            </div>

            {/* Explainable Agent Selection Reason */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderLeft: '4px solid #E85D3F',
              border: '1px solid #D8DAD7',
              borderLeftWidth: '4px',
              borderLeftColor: '#E85D3F',
              padding: '1rem 1.25rem',
              fontSize: '0.8125rem',
              lineHeight: 1.5
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700,
                color: '#E85D3F',
                fontSize: '0.6875rem',
                letterSpacing: '0.08em',
                marginBottom: '0.25rem'
              }}>
                AGENT REASONING // {activeDecision.selection_reason_code}
              </div>
              <div style={{ color: '#50545B' }}>
                {activeDecision.reason_description}
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#646A73',
              marginBottom: '1rem'
            }}>
              DOMAIN: {(q.domain_tags || ['GENERAL']).join(', ').toUpperCase()}
            </div>

            <h2 style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '1.35rem',
              lineHeight: 1.5,
              fontWeight: 700,
              color: '#17191C',
              marginBottom: '2rem',
              whiteSpace: 'pre-line'
            }}>
              {q.questionText}
            </h2>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {(q.options || []).map((opt, idx) => {
                const optText = typeof opt === 'string' ? opt : opt.text;
                const isDontKnowOpt = optText.includes("I don't know") || optText.includes("haven't learned this yet");
                const isSelected = selectedPendingOption === optText;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isGuided) {
                        setSelectedPendingOption(optText);
                      } else {
                        handleAdaptiveAnswer(optText);
                      }
                    }}
                    style={{
                      padding: '1.125rem 1.5rem',
                      border: isSelected ? '2px solid #E85D3F' : (isDontKnowOpt ? '1px dashed #D8DAD7' : '1px solid #D8DAD7'),
                      backgroundColor: isSelected ? '#FFF0EB' : (isDontKnowOpt ? '#F7F7F4' : '#FFFFFF'),
                      color: isDontKnowOpt ? '#646A73' : '#17191C',
                      fontStyle: isDontKnowOpt ? 'italic' : 'normal',
                      textAlign: 'left',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: isDontKnowOpt ? 'transparent' : '#17191C',
                      color: isDontKnowOpt ? '#646A73' : '#FFFFFF',
                      border: isDontKnowOpt ? '1px solid #D8DAD7' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {isDontKnowOpt ? '?' : String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Guided Experience Reflection Prompt */}
            {isGuided && selectedPendingOption && (
              <div style={{
                backgroundColor: '#FFF8F6',
                border: '1px solid #FCD9D1',
                padding: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#E85D3F', marginBottom: '0.75rem' }}>
                  EXPERIENCE REFLECTION // HOW DID THIS ACTIVITY FEEL?
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#17191C', marginBottom: '0.5rem' }}>
                    How much did you enjoy exploring this kind of problem?
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <button
                        type="button"
                        key={starNum}
                        onClick={() => setGuidedEnjoyment(starNum)}
                        style={{
                          padding: '0.5rem 0.85rem',
                          border: guidedEnjoyment === starNum ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                          backgroundColor: guidedEnjoyment === starNum ? '#E85D3F' : '#FFFFFF',
                          color: guidedEnjoyment === starNum ? '#FFFFFF' : '#17191C',
                          fontFamily: "'DM Mono', monospace",
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          cursor: 'pointer'
                        }}
                      >
                        {starNum} {starNum === 1 ? 'Star (Disliked)' : starNum === 5 ? 'Stars (Loved it!)' : 'Stars'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#17191C', marginBottom: '0.5rem' }}>
                    Would you like to try more activities in this domain?
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[
                      { val: true, label: 'Yes, definitely' },
                      { val: false, label: 'No, explore other areas' }
                    ].map(choice => (
                      <button
                        type="button"
                        key={String(choice.val)}
                        onClick={() => setGuidedWillingness(choice.val)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: guidedWillingness === choice.val ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                          backgroundColor: guidedWillingness === choice.val ? '#E85D3F' : '#FFFFFF',
                          color: guidedWillingness === choice.val ? '#FFFFFF' : '#17191C',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdaptiveAnswer(selectedPendingOption)}
                  style={{
                    backgroundColor: '#17191C',
                    color: '#FFFFFF',
                    padding: '0.85rem 1.75rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Response & Reflection
                </button>
              </div>
            )}

            {/* Hint Drawer */}
            {q.hint && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #F0F0EE', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setHintRevealed(!hintRevealed)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#646A73',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: 0
                  }}
                >
                  <HelpCircle size={15} />
                  <span>{hintRevealed ? 'Hide Hint' : 'Need a hint? (Does not affect evaluation)'}</span>
                </button>

                {hintRevealed && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    fontSize: '0.875rem',
                    color: '#92400E',
                    lineHeight: 1.5
                  }}>
                    <Sparkles size={14} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    {q.hint}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // =======================================================================
  // RENDER STEP 3: EXPLAINABLE DOMAIN SHORTLIST
  // =======================================================================
  if (step === 'summary') {
    const shortlist = shortlistData?.shortlist || [];

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '3rem 1.5rem 6rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#E85D3F',
              marginBottom: '0.5rem'
            }}>
              EXPLORATION SHORTLIST // EVIDENCE COMPILED
            </div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              Your Promising Career Domains
            </h1>
            <p style={{ color: '#50545B', fontSize: '1.0625rem', margin: 0 }}>
              This is a starting shortlist for exploration, not a permanent diagnosis or rigid verdict.
              Interest, task enjoyment, and prior exposure are evaluated independently.
            </p>
          </div>

          {/* Action Toolbar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <button
              type="button"
              onClick={() => setShowCompareModal(!showCompareModal)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Columns size={16} />
              <span>{showCompareModal ? 'Hide Comparison' : 'Compare Top 2 Domains Side-by-Side'}</span>
            </button>

            <Link
              to="/domains"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#17191C',
                textDecoration: 'none'
              }}
            >
              <Compass size={16} />
              <span>Explore All 9 Domains</span>
            </Link>

            <button
              type="button"
              onClick={() => setStep('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DAD7',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#646A73'
              }}
            >
              <RotateCcw size={16} />
              <span>This does not reflect me — Adjust profile</span>
            </button>
          </div>

          {/* SIDE-BY-SIDE COMPARISON MODAL */}
          {showCompareModal && shortlist.length >= 2 && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #17191C',
              padding: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#E85D3F', marginBottom: '1rem' }}>
                SIDE-BY-SIDE DOMAIN COMPARISON
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {[shortlist[0], shortlist[1]].map((d, idx) => (
                  <div key={d.domain_id} style={{ borderLeft: idx === 1 ? '1px solid #D8DAD7' : 'none', paddingLeft: idx === 1 ? '2rem' : '0' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73' }}>
                      OPTION {idx + 1}
                    </div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: '0.25rem 0 1rem 0' }}>
                      {d.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#50545B', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {d.why_worth_exploring}
                    </p>
                    <div style={{ fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                      <strong>Typical Roles:</strong> {d.roles.slice(0, 3).join(', ')}
                    </div>
                    <div style={{ fontSize: '0.8125rem' }}>
                      <strong>Key Tools:</strong> {d.tools.slice(0, 4).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHORTLIST CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3.5rem' }}>
            {shortlist.map((d, rankIdx) => (
              <div
                key={d.domain_id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: rankIdx === 0 ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                  padding: 'clamp(2rem, 4vw, 2.75rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{
                      display: 'inline-block',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      backgroundColor: rankIdx === 0 ? '#FFF0EB' : '#F7F7F4',
                      color: rankIdx === 0 ? '#E85D3F' : '#17191C',
                      marginBottom: '0.5rem'
                    }}>
                      RECOMMENDED EXPLORATION 0{rankIdx + 1}
                    </div>
                    <h2 style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '2rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#17191C',
                      margin: 0
                    }}>
                      {d.title}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '2rem', fontWeight: 800, color: '#E85D3F' }}>
                      {d.match_score}%
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', color: '#646A73' }}>
                      DISCOVERY FIT
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '1rem', color: '#50545B', lineHeight: 1.6, margin: 0 }}>
                  {d.why_worth_exploring}
                </p>

                {/* Decoupled Evidence Breakdown Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  backgroundColor: '#F8FAFC',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0'
                }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
                      STATED INTEREST EVIDENCE
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1E293B' }}>
                      {d.supporting_interest_evidence}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
                      ACTIVITY REFLECTION
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1E293B' }}>
                      {d.relevant_activity_reflections}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6875rem', fontWeight: 700, color: '#64748B', marginBottom: '0.25rem' }}>
                      CURRENT EXPOSURE
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1E293B' }}>
                      {d.current_exposure_knowledge}
                    </div>
                  </div>
                </div>

                {/* Key Unknowns */}
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#646A73', marginBottom: '0.4rem' }}>
                    IMPORTANT UNKNOWNS:
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#646A73', lineHeight: 1.5 }}>
                    {d.important_unknowns.join(' · ')}
                  </div>
                </div>

                {/* Recommended Next Experience */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#FFF8F6',
                  border: '1px solid #FCD9D1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <Zap size={18} color="#E85D3F" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: '0.875rem', color: '#17191C' }}>
                    <strong>Recommended Next Step:</strong> {d.recommended_next_experience}
                  </div>
                </div>

                {/* Confirm Direction Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/roadmap/${d.domain_id}`);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.85rem 1.75rem',
                      backgroundColor: '#17191C',
                      color: '#FFFFFF',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span>CHOOSE THIS DIRECTION & VIEW ROADMAP</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Feedback Section */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '2rem 2.5rem'
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color: '#E85D3F', marginBottom: '0.5rem' }}>
              ASSESSMENT RECALIBRATION // FEEDBACK
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#17191C', margin: '0 0 1rem 0' }}>
              Does this shortlist feel like an accurate reflection of what you want to explore?
            </h3>

            {!feedbackSubmitted ? (
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[1, 2, 3, 4, 5].map(ratingVal => (
                    <button
                      type="button"
                      key={ratingVal}
                      onClick={() => setFeedbackRating(ratingVal)}
                      style={{
                        padding: '0.65rem 1.15rem',
                        border: feedbackRating === ratingVal ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: feedbackRating === ratingVal ? '#E85D3F' : '#FFFFFF',
                        color: feedbackRating === ratingVal ? '#FFFFFF' : '#17191C',
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {ratingVal} {ratingVal === 1 ? '(Not at all)' : ratingVal === 5 ? '(Very accurate)' : ''}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Optional thoughts or domains you wished were highlighted..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #D8DAD7',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackRating === 0}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: feedbackRating === 0 ? '#D8DAD7' : '#17191C',
                    color: '#FFFFFF',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: feedbackRating === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Submit Calibration Feedback
                </button>
              </div>
            ) : (
              <div style={{ color: '#059669', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>Thank you! Your feedback has been stored for continuous calibration.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return null;
}
