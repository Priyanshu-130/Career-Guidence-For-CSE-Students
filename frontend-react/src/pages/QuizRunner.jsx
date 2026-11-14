import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';
import { 
  initAgentSession, 
  agentNextQuestion, 
  computeFinalResults, 
  DOMAIN_METADATA 
} from '../data/adaptive/domainAdvisorAgent';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';

export default function QuizRunner() {
  const { track = 'software' } = useParams();
  const location = useLocation();
  const passedState = location.state || {};

  // Track normalization: only 'software' or 'hardware'
  const activeTrack = (track === 'hardware' || passedState.track === 'hardware') ? 'hardware' : 'software';

  // Keying by activeTrack resets the inner session state cleanly when the route track changes.
  return (
    <QuizRunnerSession
      key={activeTrack}
      activeTrack={activeTrack}
      passedState={passedState}
    />
  );
}

function QuizRunnerSession({ activeTrack, passedState }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const TOTAL_TARGET_QUESTIONS = 25;

  // AI Agent Guided Session - Instantly initialize on mount with Question 1
  const [agentSession, setAgentSession] = useState(() => initAgentSession({
    track: activeTrack,
    semester: passedState.semester || '1-2',
    prerequisiteMode: passedState.prerequisiteMode || 'zero',
    declaredPrerequisites: passedState.declaredPrerequisites || [],
    domainFactors: passedState.domainFactors || {},
    customKnowledge: passedState.customKnowledge || '',
    totalTarget: TOTAL_TARGET_QUESTIONS
  }));

  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const recordAttemptToLocalStorage = ({ questionId, isCorrect, isDontKnow, isSkipped, selectedAnswer }) => {
    try {
      const raw = localStorage.getItem('cpath_assessment_attempts');
      const existing = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(existing) ? existing : [];
      list.push({
        questionId,
        isCorrect: Boolean(isCorrect),
        isDontKnow: Boolean(isDontKnow),
        isSkipped: Boolean(isSkipped),
        status: isSkipped ? 'skipped' : isDontKnow ? 'dont_know' : isCorrect ? 'correct' : 'answered',
        selectedAnswer,
        studentEmail: user?.email || 'guest_student@pathfinder.edu',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('cpath_assessment_attempts', JSON.stringify(list.slice(-500)));
    } catch (err) {
      console.warn('Could not store attempt in localStorage:', err);
    }
  };

  const advanceSession = (nextSession) => {
    if (nextSession.isComplete) {
      finalizeResults(nextSession);
    } else {
      setAgentSession(nextSession);
      setSelectedOptionKey(null);
    }
  };

  const handleSelectOption = (key) => {
    setSelectedOptionKey(key);
  };

  const handleNextStep = () => {
    if (!selectedOptionKey || !agentSession || loading) return;

    const currentQ = agentSession.currentQuestion;
    const chosenOpt = Array.isArray(currentQ?.options)
      ? currentQ.options.find(o => o.key === selectedOptionKey)
      : null;
    const optText = chosenOpt?.text || selectedOptionKey;
    const optIsDontKnow = Boolean(optText && /haven.t learned|haven.t explored|haven.t worked|haven.t built|don.t know/i.test(optText));

    recordAttemptToLocalStorage({
      questionId: currentQ?.id,
      isCorrect: Boolean(chosenOpt?.isCorrect),
      isDontKnow: optIsDontKnow,
      isSkipped: false,
      selectedAnswer: optText
    });

    const nextSession = agentNextQuestion({
      currentSession: agentSession,
      selectedOptionKey
    });

    advanceSession(nextSession);
  };

  const handleDontKnow = () => {
    if (!agentSession || loading) return;

    recordAttemptToLocalStorage({
      questionId: agentSession.currentQuestion?.id,
      isCorrect: false,
      isDontKnow: true,
      isSkipped: false,
      selectedAnswer: "I don't know / haven't learned this yet"
    });

    const nextSession = agentNextQuestion({
      currentSession: agentSession,
      selectedOptionKey: 'IDK',
      isDontKnow: true
    });

    advanceSession(nextSession);
  };

  const handleSkipQuestion = () => {
    if (!agentSession || loading) return;

    recordAttemptToLocalStorage({
      questionId: agentSession.currentQuestion?.id,
      isCorrect: false,
      isDontKnow: false,
      isSkipped: true,
      selectedAnswer: 'skipped'
    });

    const nextSession = agentNextQuestion({
      currentSession: agentSession,
      selectedOptionKey: 'SKIP',
      isSkipped: true
    });

    advanceSession(nextSession);
  };

  const finalizeResults = async (completedSession) => {
    setLoading(true);

    const finalResults = {
      ...computeFinalResults(completedSession),
      customKnowledge: passedState.customKnowledge || '',
      declaredPrerequisites: passedState.declaredPrerequisites || []
    };

    // Save to backend if authenticated
    if (user && !user.isGuest) {
      try {
        const apiUrl = getApiBaseUrl() + "/api/submit-result";
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_email: user.email,
            quiz_type: activeTrack,
            recommended_domain: finalResults.top_domain,
            confidence_score: finalResults.confidence_score,
            all_scores: finalResults.all_scores
          })
        });
      } catch (err) {
        console.error('Error submitting result to server:', err);
      }
    }

    const serialized = JSON.stringify(finalResults);
    sessionStorage.setItem('quiz_results', serialized);
    try {
      localStorage.setItem('cpath_latest_quiz_results', serialized);
    } catch (err) {
      console.warn('Could not persist offline result copy to localStorage:', err);
    }
    navigate('/results');
  };

  // Loading / Empty fallback
  if (!agentSession || !agentSession.currentQuestion) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-3)' }}>
        <div className="state-container" style={{ maxWidth: '420px', width: '100%' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
          <h2 className="state-title" style={{ fontSize: 'var(--text-xl)' }}>Preparing your assessment...</h2>
          <p className="state-description">Calibrating questions for your selected track.</p>
        </div>
      </div>
    );
  }

  const currentQ = agentSession.currentQuestion;
  const currentStep = agentSession.currentStep;
  const totalQuestions = agentSession.totalTarget;
  const progressPercent = Math.round((currentStep / totalQuestions) * 100);

  // Options can be an object { A: '...', B: '...' } or array
  const optionsList = Array.isArray(currentQ.options)
    ? currentQ.options.map((opt, idx) => (typeof opt === 'string' ? { key: String.fromCharCode(65 + idx), text: opt } : opt))
    : Object.entries(currentQ.options).map(([key, text]) => ({ key, text }));

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      padding: 'var(--space-4) var(--space-2) var(--space-8)'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>

        {/* 1. TOP HEADER: Simple Track & Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}>
          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="btn-ghost"
            style={{ padding: 'var(--space-1) var(--space-2)', minHeight: '36px', fontSize: 'var(--text-sm)' }}
          >
            <ArrowLeft size={16} />
            <span>Change Track</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{
              display: 'inline-block',
              padding: 'var(--space-0-5) var(--space-2)',
              backgroundColor: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {activeTrack} Track
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--color-text-2)'
            }}>
              Question {currentStep} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* 2. PROGRESS BAR */}
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin="1"
          aria-valuemax={totalQuestions}
          aria-label="Assessment progress"
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--color-border-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.25s ease'
          }} />
        </div>

        {/* 3. MAIN DISTRACTION-FREE QUESTION CARD */}
        <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {currentQ.reServed && (
            <div>
              <span style={{
                display: 'inline-block',
                padding: 'var(--space-0-5) var(--space-2)',
                backgroundColor: 'var(--color-accent-lt)',
                border: '1px solid var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-accent)'
              }}>
                Previously skipped — re-served once
              </span>
            </div>
          )}

          {/* Question Text */}
          <h2 style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.25rem, 3vw, 1.625rem)',
            fontWeight: 700,
            lineHeight: 1.4,
            textTransform: 'none',
            margin: 0,
            color: 'var(--color-text)'
          }}>
            {currentQ.q}
          </h2>

          {/* Plain English helper if present */}
          {currentQ.plainEnglishHelper && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-2)',
              backgroundColor: 'var(--color-bg-alt)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--color-accent)',
              margin: 0
            }}>
              💡 {currentQ.plainEnglishHelper}
            </p>
          )}

          {/* 4. LARGE TAPPABLE ANSWER BUTTONS */}
          <div
            role="radiogroup"
            aria-label="Answer options"
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
          >
            {optionsList.map((opt) => {
              const key = opt.key;
              const text = opt.text;
              const isChecked = selectedOptionKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={isChecked}
                  onClick={() => handleSelectOption(key)}
                  className={`quiz-option-btn ${isChecked ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1.5px solid ${isChecked ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      backgroundColor: isChecked ? 'var(--color-accent)' : 'var(--color-bg-alt)',
                      color: isChecked ? '#FFFFFF' : 'var(--color-text)',
                      borderRadius: 'var(--radius-sm)',
                      flexShrink: 0
                    }}>
                      {key}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: isChecked ? 600 : 400,
                      lineHeight: 1.5,
                      color: 'var(--color-text)'
                    }}>
                      {text}
                    </span>
                  </div>

                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${isChecked ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    backgroundColor: isChecked ? 'var(--color-accent)' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: 'var(--space-2)'
                  }}>
                    {isChecked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* 5. ACTION BAR: "I don't know" + "Skip question" + PRIMARY ACTION */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={loading}
              onClick={handleDontKnow}
              className="btn-secondary"
            >
              I don&apos;t know
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSkipQuestion}
              className="btn-ghost"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Skip question
            </button>
          </div>

          <button
            type="button"
            disabled={!selectedOptionKey || loading}
            onClick={handleNextStep}
            className="btn-primary"
            style={{ minWidth: '220px' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : currentStep === totalQuestions ? (
              <>
                <span>Complete Assessment</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
