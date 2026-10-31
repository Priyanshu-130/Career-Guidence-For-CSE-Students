import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CAREER_QUESTIONS, CAREER_PROFILES } from '../data/careerQuestions';
import { ChevronRight, ChevronLeft, RefreshCw, Sparkles, Target, Zap, Check } from 'lucide-react';

export default function CareerFinder() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(new Array(CAREER_QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [finalDomain, setFinalDomain] = useState(null);

  const progress = ((currentIdx + 1) / CAREER_QUESTIONS.length) * 100;

  const handleSelect = (optionIdx) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentIdx < CAREER_QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        calculateResult(newAnswers);
      }
    }, 250);
  };

  const calculateResult = (finalAnswers) => {
    const totals = {};
    Object.keys(CAREER_PROFILES).forEach(id => totals[id] = 0);

    finalAnswers.forEach((ansIdx, qIdx) => {
      if (ansIdx === null) return;
      const scores = CAREER_QUESTIONS[qIdx].options[ansIdx].scores;
      Object.entries(scores).forEach(([domain, score]) => {
        if (totals[domain] !== undefined) totals[domain] += score;
      });
    });

    let topDomainId = Object.keys(totals).reduce((a, b) => totals[a] > totals[b] ? a : b);
    setFinalDomain(CAREER_PROFILES[topDomainId]);
    setShowResult(true);
  };

  if (showResult && finalDomain) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F7F4',
        color: '#17191C',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '3rem 1.5rem 6rem'
      }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DAD7',
            padding: '4rem 2.5rem'
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#E85D3F',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              QUICK DIAGNOSTIC // VERDICT COMPILED
            </div>

            <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>{finalDomain.icon}</div>
            
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#17191C',
              margin: '0 0 1rem 0'
            }}>
              {finalDomain.name}
            </h1>

            <p style={{
              color: '#50545B',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              maxWidth: '620px',
              margin: '0 auto 3rem auto'
            }}>
              {finalDomain.description}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to={`/domain/${finalDomain.id}`} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#17191C',
                  color: '#FFFFFF',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '1rem 2.5rem',
                  textDecoration: 'none',
                  border: '1px solid #17191C',
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
                <span>EXPLORE THIS PATH</span>
                <ChevronRight size={18} />
              </Link>

              <button 
                onClick={() => { setShowResult(false); setCurrentIdx(0); setAnswers(new Array(CAREER_QUESTIONS.length).fill(null)); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#FFFFFF',
                  color: '#17191C',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '1rem 2rem',
                  border: '1px solid #D8DAD7',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#17191C';
                  e.currentTarget.style.backgroundColor = '#F8F8F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D8DAD7';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <RefreshCw size={16} />
                <span>RETAKE DIAGNOSTIC</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = CAREER_QUESTIONS[currentIdx];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F7F4',
      color: '#17191C',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem 1.5rem 6rem'
    }}>
      {/* Top progress track */}
      <div style={{ maxWidth: '920px', margin: '0 auto 2.5rem auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1rem',
          borderBottom: '1px solid #D8DAD7',
          marginBottom: '1rem',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.75rem',
          color: '#646A73'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#17191C' }}>
            <Zap size={14} style={{ color: '#E85D3F' }} />
            <span style={{ fontWeight: 700 }}>RAPID CAREER DIAGNOSTIC</span>
          </div>
          <div>
            QUESTION {currentIdx + 1} OF {CAREER_QUESTIONS.length}
          </div>
        </div>

        <div style={{ height: '4px', width: '100%', backgroundColor: '#E8EAE6' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            backgroundColor: '#E85D3F',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        
        {/* Question Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#E85D3F',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            QUESTION 0{currentIdx + 1} // SITUATIONAL PREFERENCE
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            lineHeight: 1.05,
            color: '#17191C',
            margin: 0
          }}>
            {currentQ.text}
          </h2>
        </div>

        {/* Option Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentIdx] === idx;
            return (
              <button 
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                style={{ 
                  padding: '2rem', 
                  textAlign: 'left',
                  border: isSelected ? '2px solid #E85D3F' : '1px solid #D8DAD7',
                  backgroundColor: isSelected ? '#FFF0EB' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#17191C';
                    e.currentTarget.style.backgroundColor = '#F8F8F6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = '#D8DAD7';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      textTransform: 'uppercase',
                      color: '#17191C'
                    }}>
                      {opt.title}
                    </div>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: `2px solid ${isSelected ? '#E85D3F' : '#D8DAD7'}`,
                      backgroundColor: isSelected ? '#E85D3F' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && <Check size={12} color="#FFFFFF" />}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.9375rem',
                    color: isSelected ? '#17191C' : '#50545B',
                    lineHeight: 1.6,
                    fontFamily: "'Manrope', sans-serif"
                  }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Back navigation */}
        <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button 
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#50545B',
              cursor: currentIdx === 0 ? 'default' : 'pointer',
              opacity: currentIdx === 0 ? 0 : 1,
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8125rem',
              fontWeight: 600,
              padding: '0.5rem 0'
            }}
          >
            <ChevronLeft size={16} />
            <span>PREVIOUS QUESTION</span>
          </button>
        </div>

      </div>
    </div>
  );
}
