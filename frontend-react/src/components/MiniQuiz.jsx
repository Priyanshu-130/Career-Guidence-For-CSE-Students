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
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          {isFit ? <CheckCircle2 size={64} color="var(--color-success)" /> : <HelpCircle size={64} color="var(--color-accent)" />}
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
          {isFit ? `Great Fit for ${domainName}!` : `Exploring ${domainName}...`}
        </h3>
        <p style={{ color: 'var(--color-text-2)', marginBottom: '2.5rem' }}>
          You scored {score} out of {questions.length}. {isFit 
            ? "Your interests and skills align strongly with this domain's requirements." 
            : "This domain might be a new area for you. Check out the prerequisites and roadmap to learn more!"}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={reset} className="btn-ghost" style={{ gap: '0.5rem' }}>
            <RefreshCw size={18} /> Retake
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="glass-card" style={{ padding: '3rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>Aptitude Check</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-3)' }}>{currentIdx + 1} of {questions.length}</span>
        </div>
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
          <div style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--color-accent)', transition: 'width 0.3s' }}></div>
        </div>
      </div>

      <h4 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '2.5rem' }}>{q.q}</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={() => handleSelect(true)}
          className="btn-primary" 
          style={{ justifyContent: 'space-between', padding: '1.25rem 2rem' }}
        >
          Yes, definitely <ArrowRight size={20} />
        </button>
        <button 
          onClick={() => handleSelect(false)}
          className="btn-ghost" 
          style={{ justifyContent: 'space-between', padding: '1.25rem 2rem' }}
        >
          Not really <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
