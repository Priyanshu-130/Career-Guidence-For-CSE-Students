import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function MiniQuiz({ questions, domainName }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        setShowResult(true);
      }
    }, 400);
  };

  const reset = () => {
    setCurrentIdx(0);
    setAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
  };

  if (showResult) {
    const score = answers.filter(a => a === true).length;
    const isFit = score >= 3;

    return (
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D8DAD7',
        padding: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          {isFit ? <CheckCircle2 size={64} color="#2EC4B6" /> : <HelpCircle size={64} color="#E85D3F" />}
        </div>
        <h3 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '2rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          marginBottom: '1rem',
          color: '#17191C'
        }}>
          {isFit ? `Great Fit for ${domainName}!` : `Exploring ${domainName}...`}
        </h3>
        <p style={{ color: '#50545B', fontSize: '1.0625rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          You scored {score} out of {questions.length}. {isFit 
            ? "Your interests and skills align strongly with this domain's requirements." 
            : "This domain might be a new area for you. Check out the prerequisites and roadmap to learn more!"}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            type="button"
            onClick={reset} 
            className="btn-secondary" 
            style={{ gap: '0.5rem', padding: '0.85rem 2rem' }}
          >
            <RefreshCw size={16} /> Retake
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #D8DAD7',
      padding: '3rem'
    }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E85D3F', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Aptitude Calibration</span>
          <span style={{ fontSize: '0.75rem', color: '#646A73', fontFamily: "'DM Mono', monospace" }}>{currentIdx + 1} OF {questions.length}</span>
        </div>
        <div style={{ width: '100%', height: '4px', backgroundColor: '#E8EAE6' }}>
          <div style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', backgroundColor: '#E85D3F', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <h4 style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: '1.35rem',
        fontWeight: 700,
        lineHeight: 1.4,
        color: '#17191C',
        marginBottom: '2.5rem'
      }}>
        {q.q}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          type="button"
          onClick={() => handleSelect(true)}
          className="btn-primary" 
          style={{ justifyContent: 'space-between', padding: '1.25rem 2rem' }}
        >
          <span>YES, DEFINITELY</span>
          <ArrowRight size={18} />
        </button>
        <button 
          type="button"
          onClick={() => handleSelect(false)}
          className="btn-secondary" 
          style={{ justifyContent: 'space-between', padding: '1.25rem 2rem' }}
        >
          <span>NOT REALLY</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
