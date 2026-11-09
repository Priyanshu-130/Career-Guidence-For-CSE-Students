import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';
import { 
  initAgentSession, 
  agentNextQuestion, 
  computeFinalResults, 
  DOMAIN_METADATA,
  BEGINNER_EXPLAINERS 
} from '../data/adaptive/domainAdvisorAgent';
import { QUIZ_DATA } from '../data/questions';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Terminal, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Cpu, 
  Layers,
  HelpCircle,
  Lightbulb,
  Bot,
  BrainCircuit
} from 'lucide-react';

export default function QuizRunner() {
  const { track = 'beginner' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const TOTAL_TARGET_QUESTIONS = 25;

  // Track choice: 'beginner' | 'experienced' | 'software' | 'hardware'
  const routeType = (track === 'experienced' || track === 'hardware') ? 'experienced' : 'beginner';
  const [activeTrack, setActiveTrack] = useState(routeType);

  // AI Agent Guided Session - Instantly initialize on mount with Question 1
  const [agentSession, setAgentSession] = useState(() => initAgentSession(routeType, TOTAL_TARGET_QUESTIONS));
  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [showPlainEnglishHelper, setShowPlainEnglishHelper] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sync track when URL param changes
  useEffect(() => {
    const currentRoute = (track === 'experienced' || track === 'hardware') ? 'experienced' : 'beginner';
    if (currentRoute !== activeTrack) {
      setActiveTrack(currentRoute);
      setAgentSession(initAgentSession(currentRoute, TOTAL_TARGET_QUESTIONS));
      setSelectedOptionKey(null);
    }
  }, [track]);

  const handleTrackChange = (newTrack) => {
    const targetRoute = (newTrack === 'experienced' || newTrack === 'hardware') ? 'experienced' : 'beginner';
    setActiveTrack(targetRoute);
    setAgentSession(initAgentSession(targetRoute, TOTAL_TARGET_QUESTIONS));
    setSelectedOptionKey(null);
  };

  const handleSelectOption = (key) => {
    setSelectedOptionKey(key);
  };

  const handleNextStep = () => {
    if (!selectedOptionKey || !agentSession) return;

    // Pass the student's answer to the AI Agent to evaluate & adapt
    const nextSession = agentNextQuestion({
      currentSession: agentSession,
      selectedOptionKey
    });

    if (nextSession.isComplete) {
      finalizeResults(nextSession);
    } else {
      setAgentSession(nextSession);
      setSelectedOptionKey(null);
    }
  };

  const finalizeResults = async (completedSession) => {
    setLoading(true);

    const finalResults = computeFinalResults(completedSession);

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

    sessionStorage.setItem('quiz_results', JSON.stringify(finalResults));
    navigate('/results');
  };

  // -------------------------------------------------------------
  // ADAPTIVE AI AGENT QUESTION INTERFACE (ZERO-PREREQUISITE DOMAIN DISCOVERY)
  // -------------------------------------------------------------
  if (!agentSession || !agentSession.currentQuestion) return null;

  const currentQ = agentSession.currentQuestion;
  const currentStep = agentSession.currentStep;
  const totalQuestions = agentSession.totalTarget;

  // Options can be an object { A: '...', B: '...' } or array
  const optionsList = Array.isArray(currentQ.options)
    ? currentQ.options.map((opt, idx) => (typeof opt === 'string' ? { key: String.fromCharCode(65 + idx), text: opt } : opt))
    : Object.entries(currentQ.options).map(([key, text]) => ({ key, text }));

  // Leading domain info
  const leadingDomainMeta = agentSession.emergingLeader 
    ? DOMAIN_METADATA[agentSession.emergingLeader] 
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem 1.5rem 6rem'
    }}>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* 1. TOP STATUS & TELEMETRY BAR */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
              <span>EXIT</span>
            </button>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#E85D3F', fontWeight: 700 }}>
              {currentQ.category?.toUpperCase() || 'CAREER ALIGNMENT'}
            </span>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#50545B' }}>ROUTE:</span>
            <div style={{ display: 'inline-flex', gap: '4px' }}>
              {[
                { id: 'beginner', label: 'Route 1: Discovery' },
                { id: 'experienced', label: 'Route 2: Calibration' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTrackChange(id)}
                  style={{
                    border: activeTrack === id ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                    backgroundColor: activeTrack === id ? '#FFF0EB' : '#FFFFFF',
                    color: activeTrack === id ? '#E85D3F' : '#50545B',
                    padding: '2px 8px',
                    fontSize: '0.6875rem',
                    fontFamily: "'DM Mono', monospace",
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontWeight: activeTrack === id ? 700 : 500
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {leadingDomainMeta && (
              <span style={{ color: '#50545B' }}>
                LEADING TRAIT: <strong style={{ color: '#17191C' }}>{leadingDomainMeta.name.split('&')[0]}</strong>
              </span>
            )}
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#17191C', fontWeight: 700 }}>
              QUESTION {String(currentStep).padStart(2, '0')} OF {String(totalQuestions).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 2. PROGRESS STEPPER */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '2rem'
        }}>
          {Array.from({ length: totalQuestions }).map((_, idx) => {
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

        {/* 3. DYNAMIC AI AGENT REASONING BANNER */}
        {agentSession.agentReasoning && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#FFF0EB',
            borderLeft: '4px solid #E85D3F',
            border: '1px solid #D8DAD7',
            marginBottom: '2rem'
          }}>
            <Bot size={20} style={{ color: '#E85D3F', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#E85D3F',
                letterSpacing: '0.08em',
                marginBottom: '0.25rem'
              }}>
                AI ADVISOR ADAPTIVE SELECTION
              </div>
              <p style={{
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: '#17191C',
                margin: 0,
                fontFamily: "'Manrope', sans-serif"
              }}>
                {agentSession.agentReasoning}
              </p>
            </div>
          </div>
        )}

        {/* 4. MAIN QUESTION CONTROL PANEL */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D8DAD7',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '2.5rem'
        }}>
          
          {/* Header & Helper toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              color: '#646A73',
              letterSpacing: '0.06em'
            }}>
              SECTION: {currentQ.category || 'ORIENTATION'}
            </span>

            <button
              type="button"
              onClick={() => setShowPlainEnglishHelper(!showPlainEnglishHelper)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                border: '1px solid #D8DAD7',
                padding: '0.35rem 0.75rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.75rem',
                color: showPlainEnglishHelper ? '#E85D3F' : '#50545B',
                backgroundColor: showPlainEnglishHelper ? '#FFF0EB' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Lightbulb size={13} style={{ color: showPlainEnglishHelper ? '#E85D3F' : '#646A73' }} />
              <span>{showPlainEnglishHelper ? 'Hide Beginner Helper' : 'Explain Options in Plain English'}</span>
            </button>
          </div>

          {/* Source Attribution Tag */}
          {currentQ.provenance && (
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6875rem',
              color: '#646A73',
              marginBottom: '0.85rem'
            }}>
              <span style={{ color: '#E85D3F', fontWeight: 700 }}>[ATTRIBUTION:</span> {currentQ.provenance.source} · {currentQ.provenance.license}
              {currentQ.provenance.is_modified && <span> · Adapted</span>}
              <span style={{ color: '#E85D3F', fontWeight: 700 }}>]</span>
            </div>
          )}

          {/* Question Text */}
          <h2 style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
            fontWeight: 700,
            color: '#17191C',
            lineHeight: 1.5,
            marginBottom: '2.5rem'
          }}>
            {currentQ.q}
          </h2>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {optionsList.map((opt) => {
              const key = opt.key;
              const text = opt.text;
              const isChecked = selectedOptionKey === key;
              const explainer = BEGINNER_EXPLAINERS[key];
              const careerInsight = opt.careerMeaning || explainer?.description;

              return (
                <div
                  key={key}
                  onClick={() => handleSelectOption(key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.25rem 1.5rem',
                    border: isChecked 
                      ? '2px solid #E85D3F' 
                      : '1px solid #D8DAD7',
                    backgroundColor: isChecked 
                      ? '#FFF0EB' 
                      : '#FFFFFF',
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
                      e.currentTarget.style.borderColor = '#D8DAD7';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isChecked ? '1px solid #E85D3F' : '1px solid #D8DAD7',
                        backgroundColor: isChecked ? '#E85D3F' : '#F7F7F4',
                        color: isChecked ? '#FFFFFF' : '#17191C',
                        flexShrink: 0
                      }}>
                        {key}
                      </div>
                      <span style={{ 
                        fontFamily: "'Manrope', sans-serif", 
                        fontSize: '1rem',
                        fontWeight: isChecked ? 700 : 500,
                        lineHeight: 1.5,
                        color: '#17191C'
                      }}>
                        {text}
                      </span>
                    </div>

                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: `1px solid ${isChecked ? '#E85D3F' : '#D8DAD7'}`,
                      backgroundColor: isChecked ? '#E85D3F' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: '1rem'
                    }}>
                      {isChecked && <Check size={14} color="#FFFFFF" />}
                    </div>
                  </div>

                  {/* Career Meaning & Beginner Plain English Helper Card */}
                  {(showPlainEnglishHelper || isChecked) && careerInsight && (
                    <div style={{
                      marginTop: '0.85rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px dashed #D8DAD7',
                      fontSize: '0.8125rem',
                      color: '#50545B',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: '#E85D3F', fontFamily: "'DM Mono', monospace" }}>
                        Career Connection:
                      </strong>{' '}
                      {careerInsight}
                    </div>
                  )}

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
            SELECTION: {selectedOptionKey ? `OPTION [${selectedOptionKey}] CHOSEN` : 'PLEASE SELECT AN ANSWER'}
          </div>

          <button
            type="button"
            disabled={!selectedOptionKey || loading}
            onClick={handleNextStep}
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
              cursor: (!selectedOptionKey || loading) ? 'not-allowed' : 'pointer',
              opacity: (!selectedOptionKey || loading) ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedOptionKey && !loading) {
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
              {currentStep === totalQuestions 
                ? (loading ? 'ANALYZING DOMAIN AFFINITY...' : 'COMPLETE & VIEW CAREER OBSERVATORY REPORT') 
                : 'NEXT QUESTION'}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
