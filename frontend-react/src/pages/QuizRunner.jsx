import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';
import { getAdaptiveQuestion, QUIZ_STRUCTURE } from '../data/adaptive/adaptiveRouter';
import { domainMapping } from '../data/adaptive/adaptiveEngine';
import domainMappingConfig from '../data/adaptive/domain_mapping_version.json';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Terminal, 
  Activity, 
  Crosshair, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function QuizRunner() {
  const { track } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard stage: 'intro' | 'quiz' | 'submitting'
  const [stage, setStage] = useState('intro');

  // Track choice: 'beginner' (Track 1) | 'prereq' (Track 2)
  const [selectedTrack, setSelectedTrack] = useState('beginner');

  // Step 1: Student Intro Profile
  const [introProfile, setIntroProfile] = useState({
    semester: 3,
    experienceLevel: 'beginner', // 'zero' | 'beginner' | 'intermediate' | 'experienced'
    preferredArea: 'AI, ML & Data Science',
    codingConfidence: 'Exploring foundations'
  });

  // Step 2: Adaptive Quiz Running State
  const TOTAL_QUESTIONS = QUIZ_STRUCTURE.TOTAL_QUESTIONS; // 21 total: 6 logic, 10 interest, 5 guided
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [agentReasoning, setAgentReasoning] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [askedIds, setAskedIds] = useState([]);
  const [currentLadderLevel, setCurrentLadderLevel] = useState(2);
  const [loading, setLoading] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Initial question load upon entering quiz stage
  const startAdaptiveSession = () => {
    let startLvl = 2;
    if (selectedTrack === 'beginner') {
      startLvl = introProfile.experienceLevel === 'zero' ? 1 : 2;
    } else {
      startLvl = introProfile.experienceLevel === 'experienced' ? 4 : 3;
    }
    setCurrentLadderLevel(startLvl);

    const initial = getAdaptiveQuestion({
      stepNumber: 1,
      previousAnswers: {},
      studentIntro: { ...introProfile, track: selectedTrack },
      askedQuestionIds: [],
      currentLadderLevel: startLvl
    });

    if (initial) {
      setCurrentQuestion(initial.question);
      setAgentReasoning(initial.reasoning);
      setCategoryLabel(initial.categoryLabel);
      setCurrentLadderLevel(initial.targetDifficulty);
      setAskedIds([initial.question.id]);
      setQuestionStartTime(Date.now());
      setStage('quiz');
    }
  };

  const handleSelectOption = (optText) => {
    setSelectedOption(optText);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const isDontKnow = selectedOption.includes("I don't know");
    const isCorrect = currentQuestion.category === 'interest' 
      ? true 
      : (!isDontKnow && selectedOption === currentQuestion.answer);

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        answer: selectedOption,
        isCorrect,
        isDontKnow,
        timeTaken,
        riasec: currentQuestion.riasec || null
      }
    };
    setAnswers(updatedAnswers);

    if (currentStep < TOTAL_QUESTIONS) {
      const nextStepNum = currentStep + 1;
      const nextResult = getAdaptiveQuestion({
        stepNumber: nextStepNum,
        previousAnswers: updatedAnswers,
        studentIntro: { ...introProfile, track: selectedTrack },
        askedQuestionIds: askedIds,
        currentLadderLevel: currentLadderLevel
      });

      if (nextResult) {
        setCurrentQuestion(nextResult.question);
        setAgentReasoning(nextResult.reasoning);
        setCategoryLabel(nextResult.categoryLabel);
        setCurrentLadderLevel(nextResult.targetDifficulty);
        setAskedIds(prev => [...prev, nextResult.question.id]);
        setSelectedOption(null);
        setCurrentStep(nextStepNum);
        setQuestionStartTime(Date.now());
      }
    } else {
      finalizeAndSubmitResults(updatedAnswers);
    }
  };

  const finalizeAndSubmitResults = async (finalAnswers) => {
    setLoading(true);

    // 1. Calculate RIASEC Vector from 10 O*NET Interest Questions
    const riasecScores = { R: 40, I: 50, A: 40, S: 40, E: 40, C: 40 };
    Object.values(finalAnswers).forEach(ans => {
      if (ans.category === 'interest' && ans.riasec) {
        const opt = ans.answer || '';
        let weight = 60;
        if (opt.includes('(5)') || opt.includes('Strongly Like')) weight = 95;
        else if (opt.includes('(4)') || opt.includes('Like')) weight = 80;
        else if (opt.includes('(3)') || opt.includes('Neutral')) weight = 50;
        else if (opt.includes('(2)') || opt.includes('Dislike')) weight = 30;
        else if (opt.includes('(1)')) weight = 15;
        riasecScores[ans.riasec] = Math.min(100, Math.round((riasecScores[ans.riasec] + weight) / 2));
      }
    });

    // 2. Behavioral adjustment from Bebras Logic and Code.org Guided Activities
    let correctCount = 0;
    let guidedCompleted = 0;
    Object.values(finalAnswers).forEach(ans => {
      if (ans.category === 'logic' && ans.isCorrect) correctCount++;
      if (ans.category === 'guided_activity' && ans.isCorrect) guidedCompleted++;
    });

    // Derive Domain Recommendations using pure O*NET Euclidean formula
    const behaviorSignals = {
      domainAdjustments: {
        ai: Math.min(15, correctCount * 2),
        web: Math.min(15, guidedCompleted * 3),
        security: Math.min(15, correctCount * 2)
      }
    };

    const hypothesis = domainMapping(riasecScores, behaviorSignals, domainMappingConfig);
    const topDomain = hypothesis.top3Domains[0] || { title: 'AI, ML & Deep Learning', score: 88, id: 'ai' };

    // Format scores object for Results page
    const processScores = {};
    hypothesis.allDomains.forEach(d => {
      processScores[d.title] = Math.round(d.score);
    });

    const resultsData = {
      track: selectedTrack,
      top_domain: topDomain.title,
      domain_id: topDomain.id,
      match_percentage: topDomain.score,
      scores: processScores,
      all_scores: processScores,
      raw_scores: riasecScores,
      hypothesis
    };

    // Save to server if authenticated
    if (user && !user.isGuest) {
      try {
        const apiUrl = getApiBaseUrl() + "/api/submit-result";
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_email: user.email,
            quiz_type: selectedTrack,
            recommended_domain: topDomain.title,
            confidence_score: topDomain.score,
            all_scores: processScores
          })
        });
      } catch (err) {
        console.error('Error submitting result to server:', err);
      }
    }

    sessionStorage.setItem('quiz_results', JSON.stringify(resultsData));
    navigate('/results');
  };

  // -------------------------------------------------------------
  // RENDER STAGE 1: TWO-PATHWAY ONBOARDING (VELLUM EDITORIAL)
  // -------------------------------------------------------------
  if (stage === 'intro') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '2.5rem 1.5rem 6rem'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          
          {/* Top minimal signpost */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #D8DAD7',
            paddingBottom: '1.25rem',
            marginBottom: '3rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.8125rem',
            color: '#646A73'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#17191C' }}>
              <Link to="/quiz" style={{ color: '#50545B', textDecoration: 'none' }}>Diagnostic Selection</Link>
              <span style={{ color: '#D8DAD7' }}>/</span>
              <span style={{ fontWeight: 600 }}>Track Calibration</span>
            </div>
            <div style={{ color: '#E85D3F', fontWeight: 600 }}>SEQUENCE: 21-STEP ADAPTIVE</div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E85D3F',
              marginBottom: '0.75rem'
            }}>
              STUDENT INITIALIZATION
            </div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              Choose Your Assessment Pathway
            </h1>
            <p style={{ color: '#50545B', fontSize: '1.125rem', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
              Select the diagnostic trajectory that reflects your current academic background. The diagnostic engine adapts its evaluation sequence in real-time.
            </p>
          </div>

          {/* 2 DISTINCT PATHWAYS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            
            {/* TRACK 1: BEGINNER / ZERO-KNOWLEDGE */}
            <div 
              onClick={() => setSelectedTrack('beginner')}
              style={{
                backgroundColor: selectedTrack === 'beginner' ? '#FFF0EB' : '#FFFFFF',
                border: selectedTrack === 'beginner' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: selectedTrack === 'beginner' ? '#E85D3F' : '#646A73'
                  }}>
                    TRACK 01 // FOUNDATIONS
                  </div>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: `2px solid ${selectedTrack === 'beginner' ? '#E85D3F' : '#D8DAD7'}`,
                    backgroundColor: selectedTrack === 'beginner' ? '#E85D3F' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedTrack === 'beginner' && <Check size={12} color="#FFFFFF" />}
                  </div>
                </div>

                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#17191C',
                  margin: '0 0 0.75rem 0'
                }}>
                  Beginner / Exploratory
                </h2>
                <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Designed for Semesters 1–3 or students with zero prior coding experience. Explores computational thinking, natural problem-solving patterns, and career curiosity.
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#50545B',
                borderTop: '1px solid #D8DAD7',
                paddingTop: '1rem'
              }}>
                <div>• BEBRAS LOGIC & PATTERNS (Difficulty 1-2)</div>
                <div>• O*NET RIASEC CAREER INTERESTS</div>
                <div>• GUIDED EXPLORATORY SCENARIOS</div>
              </div>
            </div>

            {/* TRACK 2: PREREQUISITE-AWARE */}
            <div 
              onClick={() => setSelectedTrack('prereq')}
              style={{
                backgroundColor: selectedTrack === 'prereq' ? '#FFF0EB' : '#FFFFFF',
                border: selectedTrack === 'prereq' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: selectedTrack === 'prereq' ? '#E85D3F' : '#646A73'
                  }}>
                    TRACK 02 // TECHNICAL SPECIALIST
                  </div>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: `2px solid ${selectedTrack === 'prereq' ? '#E85D3F' : '#D8DAD7'}`,
                    backgroundColor: selectedTrack === 'prereq' ? '#E85D3F' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {selectedTrack === 'prereq' && <Check size={12} color="#FFFFFF" />}
                  </div>
                </div>

                <h2 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#17191C',
                  margin: '0 0 0.75rem 0'
                }}>
                  Prerequisite-Aware
                </h2>
                <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Designed for Semesters 3–8 with familiarity in C++, Python, or Java. Evaluates systems architecture, algorithmic complexity, database tradeoffs, and code traces.
                </p>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: '#50545B',
                borderTop: '1px solid #D8DAD7',
                paddingTop: '1rem'
              }}>
                <div>• SYSTEM CODE TRACE & DSA (Difficulty 2-4)</div>
                <div>• OCCUPATIONAL SPECIALIZATION MAPPING</div>
                <div>• REAL-WORLD ARCHITECTURE TRADEOFFS</div>
              </div>
            </div>

          </div>

          {/* Profile Details Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '2rem 2.25rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: '#646A73',
              letterSpacing: '0.08em',
              marginBottom: '1.25rem'
            }}>
              STUDENT METADATA CALIBRATION
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Semester */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#17191C', fontWeight: 600, marginBottom: '0.5rem' }}>
                  CURRENT SEMESTER
                </label>
                <select
                  value={introProfile.semester}
                  onChange={(e) => setIntroProfile({ ...introProfile, semester: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DAD7',
                    color: '#17191C',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.875rem'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s} (B.Tech CSE)</option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#17191C', fontWeight: 600, marginBottom: '0.5rem' }}>
                  PRIOR CODING EXPOSURE
                </label>
                <select
                  value={introProfile.experienceLevel}
                  onChange={(e) => setIntroProfile({ ...introProfile, experienceLevel: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DAD7',
                    color: '#17191C',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="zero">Zero Prior Coding (Foundational)</option>
                  <option value="beginner">Beginner (Basic conditionals & variables)</option>
                  <option value="intermediate">Intermediate (Loops, functions, projects)</option>
                  <option value="experienced">Advanced (Data structures & design)</option>
                </select>
              </div>

              {/* Target Area */}
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#17191C', fontWeight: 600, marginBottom: '0.5rem' }}>
                  INITIAL FIELD OF CURIOSITY
                </label>
                <select
                  value={introProfile.preferredArea}
                  onChange={(e) => setIntroProfile({ ...introProfile, preferredArea: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D8DAD7',
                    color: '#17191C',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="AI, ML & Data Science">AI, Machine Learning & Data</option>
                  <option value="Full Stack & Cloud Systems">Web, Distributed & Cloud Systems</option>
                  <option value="Cybersecurity & Networks">Cybersecurity & Networking</option>
                  <option value="Open to Discovery">Undecided / Broad Discovery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Start button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={startAdaptiveSession}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#17191C',
                color: '#FFFFFF',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '1.125rem 2.5rem',
                border: '1px solid #17191C',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E85D3F';
                e.currentTarget.style.borderColor = '#E85D3F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#17191C';
                e.currentTarget.style.borderColor = '#17191C';
              }}
            >
              <span>INITIALIZE ASSESSMENT SEQUENCE</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STAGE 2: EXPERIMENTAL CONTROL QUESTION INTERFACE (VELLUM)
  // -------------------------------------------------------------
  if (!currentQuestion) return null;

  let currentPhase = 'BEBRAS LOGIC';
  if (currentStep > QUIZ_STRUCTURE.LOGIC_COUNT && currentStep <= (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'O*NET INTEREST PROFILER';
  } else if (currentStep > (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'CODE.ORG GUIDED LAB';
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* 1. TOP EXPERIMENTAL CONTROL BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          border: '1px solid #D8DAD7',
          backgroundColor: '#FFFFFF',
          marginBottom: '2rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              type="button"
              onClick={() => navigate('/quiz')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#50545B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: 0,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={14} />
              <span>EXIT LAB</span>
            </button>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#E85D3F', fontWeight: 700 }}>{currentPhase}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ color: '#17191C', fontWeight: 700 }}>
              STEP [{String(currentStep).padStart(2, '0')} / {String(TOTAL_QUESTIONS).padStart(2, '0')}]
            </span>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#50545B' }}>
              DIFFICULTY: LEVEL 0{currentQuestion.difficulty || 1}
            </span>
          </div>
        </div>

        {/* 2. MINIMAL STEP PROGRESSION TICK */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '2rem'
        }}>
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => {
            const stepNum = idx + 1;
            const isPassed = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div 
                key={idx}
                style={{
                  flex: 1,
                  height: isCurrent ? '4px' : '2px',
                  backgroundColor: isPassed 
                    ? '#E85D3F' 
                    : isCurrent 
                    ? '#17191C' 
                    : '#D8DAD7',
                  transition: 'all 0.2s ease'
                }}
              />
            );
          })}
        </div>

        {/* 3. AGENT REASONING TELEMETRY READOUT */}
        {agentReasoning && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#FFF0EB',
            borderLeft: '3px solid #E85D3F',
            border: '1px solid #D8DAD7',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: '#17191C',
            marginBottom: '2rem'
          }}>
            <Terminal size={14} style={{ color: '#E85D3F', flexShrink: 0 }} />
            <span>ROUTER REASONING: {agentReasoning}</span>
          </div>
        )}

        {/* 4. MAIN QUESTION CONTROL PANEL */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '2.5rem'
        }}>
          
          {/* Source citation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            color: '#646A73',
            marginBottom: '1.5rem'
          }}>
            <ShieldCheck size={14} style={{ color: '#2EC4B6' }} />
            <span>VERIFIED SOURCE: {currentQuestion.source}</span>
            <span>·</span>
            <span>{currentQuestion.license}</span>
          </div>

          {/* Question Text: Jet Black */}
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
            fontWeight: 700,
            color: '#17191C',
            lineHeight: 1.5,
            marginBottom: '2.5rem',
            whiteSpace: 'pre-line'
          }}>
            {currentQuestion.questionText}
          </h2>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {currentQuestion.options.map((optText, optIdx) => {
              const isChecked = selectedOption === optText;
              const isIdk = optText.includes("I don't know");
              const letter = isIdk ? '?' : String.fromCharCode(65 + optIdx);

              return (
                <div
                  key={optIdx}
                  onClick={() => handleSelectOption(optText)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    border: isChecked 
                      ? '2px solid #E85D3F' 
                      : isIdk 
                      ? '1px dashed #D8DAD7' 
                      : '1px solid #D8DAD7',
                    backgroundColor: isChecked 
                      ? '#FFF0EB' 
                      : isIdk 
                      ? '#F7F7F4' 
                      : '#FFFFFF',
                    color: isIdk ? '#646A73' : '#17191C',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) {
                      e.currentTarget.style.borderColor = '#17191C';
                      e.currentTarget.style.backgroundColor = '#F8F8F6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) {
                      e.currentTarget.style.borderColor = isIdk ? '#D8DAD7' : '#D8DAD7';
                      e.currentTarget.style.backgroundColor = isIdk ? '#F7F7F4' : '#FFFFFF';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isChecked ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                      backgroundColor: isChecked ? '#E85D3F' : (isIdk ? 'transparent' : '#F7F7F4'),
                      color: isChecked ? '#FFFFFF' : (isIdk ? '#646A73' : '#17191C')
                    }}>
                      {letter}
                    </div>
                    <span style={{ 
                      fontFamily: "'Manrope', sans-serif", 
                      fontSize: '1rem',
                      fontWeight: isChecked ? 700 : 500,
                      lineHeight: 1.5
                    }}>
                      {optText}
                    </span>
                  </div>

                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: `1px solid ${isChecked ? '#E85D3F' : '#D8DAD7'}`,
                    backgroundColor: isChecked ? '#E85D3F' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isChecked && <Check size={12} color="#FFFFFF" />}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 5. BOTTOM NAVIGATION BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#646A73' }}>
            SELECTION: {selectedOption ? 'REGISTERED' : 'PENDING INPUT'}
          </div>

          <button
            type="button"
            disabled={!selectedOption || loading}
            onClick={handleNextQuestion}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#17191C',
              color: '#FFFFFF',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '1rem 2.5rem',
              border: '1px solid #17191C',
              cursor: (!selectedOption || loading) ? 'not-allowed' : 'pointer',
              opacity: (!selectedOption || loading) ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedOption && !loading) {
                e.currentTarget.style.backgroundColor = '#E85D3F';
                e.currentTarget.style.borderColor = '#E85D3F';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#17191C';
              e.currentTarget.style.borderColor = '#17191C';
            }}
          >
            <span>
              {currentStep === TOTAL_QUESTIONS 
                ? (loading ? 'PROCESSING TELEMETRY...' : 'COMPLETE & VIEW OBSERVATORY REPORT') 
                : 'NEXT TASK'}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
