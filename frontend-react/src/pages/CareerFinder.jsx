import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CAREER_QUESTIONS, CAREER_PROFILES } from '../data/careerQuestions';
import { ChevronRight, ChevronLeft, RefreshCw, Sparkles, Target, Zap } from 'lucide-react';

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
      <div className="page-wrapper content-container animate-in" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className="glass-card" style={{ padding: '5rem 3rem', background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.1), transparent), var(--color-card)', maxWidth: '800px', margin: '0 auto' }}>
          <div className="page-label" style={{ marginBottom: '2rem' }}>Quick Diagnostic Result</div>
          <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>{finalDomain.icon}</div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>{finalDomain.name}</h2>
          <p style={{ color: 'var(--color-text-2)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
            {finalDomain.description}
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to={`/domain/${finalDomain.id}`} className="btn-primary" style={{ padding: '1.25rem 3rem' }}>Explore This Path <ChevronRight size={20} /></Link>
            <button onClick={() => { setShowResult(false); setCurrentIdx(0); setAnswers(new Array(CAREER_QUESTIONS.length).fill(null)); }} className="btn-ghost" style={{ padding: '1.25rem 2rem' }}>
              <RefreshCw size={18} /> Retake Diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = CAREER_QUESTIONS[currentIdx];

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', flexDirection: 'column' }}>
       <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
        <div style={{ 
          height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, var(--color-accent), var(--color-purple))',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}></div>
      </div>

      <div className="page-wrapper content-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem', width: '100%' }} className="animate-in">
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Zap size={14} /> Quick Analysis • Question {currentIdx + 1} of {CAREER_QUESTIONS.length}
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, maxWidth: '800px', margin: '0 auto' }}>{currentQ.text}</h2>
        </div>

        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {currentQ.options.map((opt, idx) => (
            <button 
              key={idx}
              onClick={() => handleSelect(idx)}
              className="glass-card"
              style={{ 
                padding: '2rem', 
                textAlign: 'left',
                border: answers[currentIdx] === idx ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: answers[currentIdx] === idx ? 'var(--color-accent-lt)' : 'rgba(255,255,255,0.02)',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem', color: answers[currentIdx] === idx ? '#fff' : 'var(--color-text)' }}>{opt.title}</div>
              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-3)', lineHeight: 1.5 }}>{opt.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: '5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button 
             onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
             disabled={currentIdx === 0}
             className="btn-ghost"
             style={{ opacity: currentIdx === 0 ? 0 : 0.6, border: 'none' }}
          >
            <ChevronLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
