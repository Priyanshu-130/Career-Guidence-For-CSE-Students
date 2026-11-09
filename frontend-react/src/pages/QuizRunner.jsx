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
  const { track = 'software' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard stage: 'intro' | 'quiz' | 'submitting'
  const [stage, setStage] = useState('intro');

  // Track choice: 'software' | 'hardware' | 'general'
  const [activeTrack, setActiveTrack] = useState(track || 'software');

  // Step 1: Student Intro Profile
  const [studentBio, setStudentBio] = useState({
    experienceLevel: 'beginner',
    curiosityArea: 'Undecided / Exploring'
  });

  // Step 2: AI Agent Guided Session
  const TOTAL_TARGET_QUESTIONS = 10;
  const [agentSession, setAgentSession] = useState(null);
  const [selectedOptionKey, setSelectedOptionKey] = useState(null);
  const [showPlainEnglishHelper, setShowPlainEnglishHelper] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize the AI Agent Session when entering the quiz stage
  const startAgentSession = () => {
    const session = initAgentSession(activeTrack, TOTAL_TARGET_QUESTIONS);
    setAgentSession(session);
    setSelectedOptionKey(null);
    setStage('quiz');
  };

  const handleSelectOption = (key) => {
    setSelectedOptionKey(key);
  };

  const handleNextStep = () => {
    if (!selectedOptionKey || !agentSession) return;

    // Pass the student's answer to the AI Agent to evaluate & adapt
    const nextSession = agentNextQuestion({
      track: activeTrack,
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

    const finalResults = computeFinalResults(completedSession, activeTrack);

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
  // RENDER STAGE 1: ONBOARDING FOR CONFUSED BEGINNERS (VELLUM)
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/quiz" style={{ color: '#50545B', textDecoration: 'none' }}>Diagnostic Selection</Link>
              <span>/</span>
              <span style={{ color: '#17191C', fontWeight: 600 }}>Beginner Domain Guidance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E85D3F', fontWeight: 700 }}>
              <BrainCircuit size={16} />
              <span>AI CAREER AGENT ACTIVE</span>
            </div>
          </div>

          {/* Editorial Heading */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#E85D3F',
              marginBottom: '0.75rem'
            }}>
              ZERO-PREREQUISITE DOMAIN DISCOVERY
            </div>
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.75rem, 6vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.0,
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              Confused About Which CSE Domain Fits You?
            </h1>
            <p style={{ color: '#50545B', fontSize: '1.125rem', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
              You don’t need to know how to code yet. Our AI Career Guidance Agent will ask intuitive questions about your natural curiosity, problem-solving style, and interests to uncover your ideal Computer Science pathway.
            </p>
          </div>

          {/* 3 FOCUS TRACKS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}>
            
            {/* SOFTWARE TRACK */}
            <div 
              onClick={() => setActiveTrack('software')}
              style={{
                backgroundColor: activeTrack === 'software' ? '#FFF0EB' : '#FFFFFF',
                border: activeTrack === 'software' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700 }}>
                  TRACK 01
                </span>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: `2px solid ${activeTrack === 'software' ? '#E85D3F' : '#D8DAD7'}`,
                  backgroundColor: activeTrack === 'software' ? '#E85D3F' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTrack === 'software' && <Check size={12} color="#FFFFFF" />}
                </div>
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 0.5rem 0', color: '#17191C' }}>
                Software & Intelligence
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                Explores AI, Data Science, Web/App Development, Cybersecurity, and Cloud Systems.
              </p>
            </div>

            {/* HARDWARE TRACK */}
            <div 
              onClick={() => setActiveTrack('hardware')}
              style={{
                backgroundColor: activeTrack === 'hardware' ? '#FFF0EB' : '#FFFFFF',
                border: activeTrack === 'hardware' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700 }}>
                  TRACK 02
                </span>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: `2px solid ${activeTrack === 'hardware' ? '#E85D3F' : '#D8DAD7'}`,
                  backgroundColor: activeTrack === 'hardware' ? '#E85D3F' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTrack === 'hardware' && <Check size={12} color="#FFFFFF" />}
                </div>
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 0.5rem 0', color: '#17191C' }}>
                Hardware & Devices
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                Explores Internet of Things (IoT), Robotics, Chip Design (VLSI), and Embedded Systems.
              </p>
            </div>

            {/* GENERAL CSE TRACK */}
            <div 
              onClick={() => setActiveTrack('general')}
              style={{
                backgroundColor: activeTrack === 'general' ? '#FFF0EB' : '#FFFFFF',
                border: activeTrack === 'general' ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: '#E85D3F', fontWeight: 700 }}>
                  TRACK 03
                </span>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: `2px solid ${activeTrack === 'general' ? '#E85D3F' : '#D8DAD7'}`,
                  backgroundColor: activeTrack === 'general' ? '#E85D3F' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeTrack === 'general' && <Check size={12} color="#FFFFFF" />}
                </div>
              </div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 0.5rem 0', color: '#17191C' }}>
                Broad CSE Discovery
              </h3>
              <p style={{ color: '#50545B', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>
                Comprehensive evaluation across all modern software, hardware, and engineering domains.
              </p>
            </div>

          </div>

          {/* AI AGENT PROMISE CARD */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '2rem',
            marginBottom: '3rem',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              backgroundColor: '#FFF0EB',
              border: '1px solid #E85D3F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot size={22} style={{ color: '#E85D3F' }} />
            </div>
            <div>
              <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.35rem', fontWeight: 800, textTransform: 'uppercase', color: '#17191C', margin: '0 0 0.35rem 0' }}>
                How Your AI Advisor Works
              </h4>
              <p style={{ color: '#50545B', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                Every time you choose an option, our AI Agent analyzes which domain traits you value most. It will dynamically choose your <strong>next question</strong> to explore ties, deepen clarity, and guide you straight to the Computer Science specialization that matches who you are.
              </p>
            </div>
          </div>

          {/* Start button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={startAgentSession}
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
              <span>START AI GUIDED ASSESSMENT</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STAGE 2: ADAPTIVE AI AGENT QUESTION INTERFACE
  // -------------------------------------------------------------
  if (!agentSession || !agentSession.currentQuestion) return null;

  const currentQ = agentSession.currentQuestion;
  const currentStep = agentSession.currentStep;
  const totalQuestions = agentSession.totalTarget;

  // Options can be an object { A: '...', B: '...' } or array
  const optionsList = Array.isArray(currentQ.options)
    ? currentQ.options.map((text, idx) => ({ key: String.fromCharCode(65 + idx), text }))
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
              <span>EXIT</span>
            </button>
            <span style={{ color: '#D8DAD7' }}>|</span>
            <span style={{ color: '#E85D3F', fontWeight: 700 }}>
              {currentQ.category?.toUpperCase() || 'CAREER ALIGNMENT'}
            </span>
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
            {optionsList.map(({ key, text }) => {
              const isChecked = selectedOptionKey === key;
              const explainer = BEGINNER_EXPLAINERS[key];

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

                  {/* Beginner Plain English Helper Card (if toggled or selected) */}
                  {(showPlainEnglishHelper || isChecked) && explainer && (
                    <div style={{
                      marginTop: '0.85rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px dashed #D8DAD7',
                      fontSize: '0.8125rem',
                      color: '#50545B',
                      lineHeight: 1.5
                    }}>
                      <strong style={{ color: '#E85D3F', fontFamily: "'DM Mono', monospace" }}>
                        Connects to {explainer.title}:
                      </strong>{' '}
                      {explainer.description}
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
