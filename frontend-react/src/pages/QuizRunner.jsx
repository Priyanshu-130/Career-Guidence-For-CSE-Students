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
  // RENDER STAGE 1: TWO-PATHWAY ONBOARDING
  // -------------------------------------------------------------
  if (stage === 'intro') {
    return (
      <div className="page-wrapper content-container animate-in" style={{ maxWidth: '960px', margin: '0 auto', paddingTop: '2rem' }}>
        
        {/* Top observatory signpost */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--color-text-3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ivory)' }}>
            <Crosshair size={14} style={{ color: 'var(--color-accent)' }} />
            <span>GRAVITY LAB // CALIBRATION PROTOCOL</span>
          </div>
          <div>SEQUENCE: 21-STEP ADAPTIVE</div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="mono-tag" style={{ marginBottom: '0.5rem' }}>STUDENT INITIALIZATION</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 1rem 0' }}>
            Choose Your Assessment Pathway
          </h1>
          <p style={{ color: 'var(--color-text-2)', fontSize: '1.0625rem', maxWidth: '720px', margin: 0 }}>
            Select the diagnostic trajectory that reflects your current academic journey. The diagnostic engine adapts its evaluation sequence in real-time.
          </p>
        </div>

        {/* 2 DISTINCT PATHWAYS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* TRACK 1: BEGINNER / ZERO-KNOWLEDGE */}
          <div 
            onClick={() => setSelectedTrack('beginner')}
            className="observatory-panel"
            style={{
              padding: '2.25rem',
              cursor: 'pointer',
              borderColor: selectedTrack === 'beginner' ? 'var(--color-accent)' : 'var(--color-border)',
              background: selectedTrack === 'beginner' ? 'rgba(235, 94, 65, 0.05)' : 'var(--color-card)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="mono-tag" style={{ color: selectedTrack === 'beginner' ? 'var(--color-accent)' : 'var(--color-text-3)' }}>
                TRACK 01 // FOUNDATIONS
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                border: `2px solid ${selectedTrack === 'beginner' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: selectedTrack === 'beginner' ? 'var(--color-accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedTrack === 'beginner' && <Check size={12} style={{ color: '#000' }} />}
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Beginner / Exploratory
            </h2>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Designed for Semesters 1–3 or students with zero prior coding experience. Explores computational thinking, natural problem-solving patterns, and career curiosity.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-2)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
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
            className="observatory-panel"
            style={{
              padding: '2.25rem',
              cursor: 'pointer',
              borderColor: selectedTrack === 'prereq' ? 'var(--color-accent)' : 'var(--color-border)',
              background: selectedTrack === 'prereq' ? 'rgba(235, 94, 65, 0.05)' : 'var(--color-card)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="mono-tag" style={{ color: selectedTrack === 'prereq' ? 'var(--color-accent)' : 'var(--color-text-3)' }}>
                TRACK 02 // TECHNICAL SPECIALIST
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                border: `2px solid ${selectedTrack === 'prereq' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: selectedTrack === 'prereq' ? 'var(--color-accent)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedTrack === 'prereq' && <Check size={12} style={{ color: '#000' }} />}
              </div>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              Prerequisite-Aware
            </h2>
            <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Designed for Semesters 3–8 with familiarity in C++, Python, or Java. Evaluates systems architecture, algorithmic complexity, database tradeoffs, and code traces.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-2)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1rem'
            }}>
              <div>• SYSTEM CODE TRACE & DSA (Difficulty 2-4)</div>
              <div>• OCCUPATIONAL SPECIALIZATION MAPPING</div>
              <div>• REAL-WORLD ARCHITECTURE TRADEOFFS</div>
            </div>
          </div>

        </div>

        {/* Profile Details Form */}
        <div className="observatory-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <div className="mono-tag" style={{ marginBottom: '1.25rem' }}>STUDENT METADATA TELEMETRY</div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Semester */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-3)', marginBottom: '0.5rem' }}>
                CURRENT SEMESTER
              </label>
              <select
                value={introProfile.semester}
                onChange={(e) => setIntroProfile({ ...introProfile, semester: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-mono)',
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
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-3)', marginBottom: '0.5rem' }}>
                PRIOR PROGRAMMING EXPOSURE
              </label>
              <select
                value={introProfile.experienceLevel}
                onChange={(e) => setIntroProfile({ ...introProfile, experienceLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-mono)',
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
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-3)', marginBottom: '0.5rem' }}>
                INITIAL FIELD OF CURIOSITY
              </label>
              <select
                value={introProfile.preferredArea}
                onChange={(e) => setIntroProfile({ ...introProfile, preferredArea: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-ivory)',
                  fontFamily: 'var(--font-mono)',
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
            className="btn-primary"
            style={{
              padding: '1.1rem 2.5rem',
              fontSize: '1.125rem'
            }}
          >
            <span>INITIALIZE ASSESSMENT SEQUENCE</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STAGE 2: EXPERIMENTAL CONTROL QUESTION INTERFACE
  // -------------------------------------------------------------
  if (!currentQuestion) return null;

  let currentPhase = 'BEBRAS LOGIC';
  if (currentStep > QUIZ_STRUCTURE.LOGIC_COUNT && currentStep <= (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'O*NET INTEREST PROFILER';
  } else if (currentStep > (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'CODE.ORG GUIDED LAB';
  }

  return (
    <div className="page-wrapper content-container animate-in" style={{ maxWidth: '960px', margin: '0 auto', paddingTop: '1.5rem', paddingBottom: '6rem' }}>
      
      {/* 1. TOP EXPERIMENTAL CONTROL BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        border: '1px solid var(--color-border)',
        background: 'rgba(16, 21, 36, 0.45)',
        marginBottom: '2.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        letterSpacing: '0.08em'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            type="button"
            onClick={() => navigate('/quiz')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
          >
            <ArrowLeft size={14} />
            <span>EXIT LAB</span>
          </button>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{currentPhase}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ color: 'var(--color-ivory)', fontWeight: 700 }}>
            STEP [{String(currentStep).padStart(2, '0')} / {String(TOTAL_QUESTIONS).padStart(2, '0')}]
          </span>
          <span style={{ color: 'var(--color-border)' }}>|</span>
          <span style={{ color: 'var(--color-text-3)' }}>
            DIFFICULTY: LEVEL 0{currentQuestion.difficulty || 1}
          </span>
        </div>
      </div>

      {/* 2. MINIMAL STEP PROGRESSION TICK */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '2.5rem'
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
                background: isPassed 
                  ? 'var(--color-accent)' 
                  : isCurrent 
                  ? 'var(--color-ivory)' 
                  : 'rgba(255, 255, 255, 0.08)',
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
          background: 'rgba(235, 94, 65, 0.06)',
          borderLeft: '3px solid var(--color-accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--color-text-2)',
          marginBottom: '2rem'
        }}>
          <Terminal size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>ROUTER REASONING: {agentReasoning}</span>
        </div>
      )}

      {/* 4. MAIN QUESTION CONTROL PANEL */}
      <div className="observatory-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        
        {/* Source citation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-3)',
          marginBottom: '1.5rem'
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
          <span>VERIFIED SOURCE: {currentQuestion.source}</span>
          <span>·</span>
          <span>{currentQuestion.license}</span>
        </div>

        {/* Question Text */}
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
          fontWeight: 700,
          color: 'var(--color-ivory)',
          lineHeight: 1.4,
          marginBottom: '2.5rem',
          whiteSpace: 'pre-line'
        }}>
          {currentQuestion.questionText}
        </h2>

        {/* Options Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestion.options.map((optText, optIdx) => {
            const isChecked = selectedOption === optText;
            const isIdk = optText.includes("I don't know");
            const letter = String.fromCharCode(65 + optIdx);

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
                    ? '1px solid var(--color-ivory)' 
                    : isIdk 
                    ? '1px dashed rgba(255, 255, 255, 0.15)' 
                    : '1px solid var(--color-border)',
                  background: isChecked 
                    ? 'var(--color-ivory)' 
                    : isIdk 
                    ? 'rgba(16, 21, 36, 0.3)' 
                    : 'rgba(16, 21, 36, 0.65)',
                  color: isChecked ? '#06080E' : 'var(--color-ivory)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isChecked ? '1px solid #06080E' : '1px solid var(--color-border)',
                    background: isChecked ? '#06080E' : 'transparent',
                    color: isChecked ? 'var(--color-ivory)' : 'var(--color-accent)'
                  }}>
                    {letter}
                  </div>
                  <span style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '1rem',
                    fontWeight: isChecked ? 600 : 400,
                    lineHeight: 1.5
                  }}>
                    {optText}
                  </span>
                </div>

                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `1px solid ${isChecked ? '#06080E' : 'rgba(255, 255, 255, 0.2)'}`,
                  background: isChecked ? '#06080E' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={12} style={{ color: 'var(--color-ivory)' }} />}
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-3)' }}>
          SELECTION: {selectedOption ? 'REGISTERED' : 'PENDING INPUT'}
        </div>

        <button
          type="button"
          disabled={!selectedOption || loading}
          onClick={handleNextQuestion}
          className="btn-primary"
          style={{
            padding: '1rem 2.25rem',
            opacity: (!selectedOption || loading) ? 0.35 : 1,
            pointerEvents: (!selectedOption || loading) ? 'none' : 'auto'
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
  );
}
