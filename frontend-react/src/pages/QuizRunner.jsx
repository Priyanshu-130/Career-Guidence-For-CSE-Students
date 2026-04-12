import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { ChevronRight, ChevronLeft, ArrowRight, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function QuizRunner() {
  const { track } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const data = QUIZ_DATA[track];

  useEffect(() => {
    if (!data) navigate('/quiz');
  }, [data, navigate]);

  if (!data) return null;

  const questions = data.questions;
  const progress = ((currentIdx + 1) / questions.length) * 100;

  // Calculate current section
  const sectionIdx = Math.floor(currentIdx / 10);
  const sections = ["Orientation", "Interests", "Aptitude"];
  const currentSection = sections[sectionIdx];

  const handleSelect = (optionKey) => {
    setAnswers({ ...answers, [currentIdx]: optionKey });
    // Auto-advance with a slight delay for better UX
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      }
    }, 200);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Logic to calculate scores based on clusters
    const scores = {};
    Object.keys(data.clusters).forEach(key => scores[key] = 0);
    
    Object.entries(answers).forEach(([qIdx, optionKey]) => {
      scores[optionKey] += 1;
    });

    let maxVal = -1;
    let topCluster = '';
    Object.entries(scores).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCluster = key;
      }
    });

    const processScores = {};
    Object.entries(scores).forEach(([key, val]) => {
       processScores[data.clusters[key].name] = val / (questions.length / Object.keys(data.clusters).length) * 4;
    });

    const resultsData = {
      track: track,
      top_domain: data.clusters[topCluster].name,
      domain_id: data.clusters[topCluster].id,
      match_percentage: (maxVal / (questions.length / Object.keys(data.clusters).length)) * 100, 
      scores: processScores
    };

    const studentRaw = sessionStorage.getItem("cse_student");
    if (studentRaw) {
      try {
        const student = JSON.parse(studentRaw);
        if (!student.isGuest) {
          await fetch("http://127.0.0.1:5000/api/submit-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              student_email: student.email,
              quiz_type: track,
              recommended_domain: resultsData.top_domain,
              domain_id: resultsData.domain_id,
              confidence_score: resultsData.match_percentage,
              all_scores: resultsData.scores
            })
          });
        }
      } catch (err) { console.error(err); }
    }

    sessionStorage.setItem("quiz_results", JSON.stringify(resultsData));
    navigate('/results');
  };

  const isLastQuestion = currentIdx === questions.length - 1;
  const canSubmit = Object.keys(answers).length === questions.length;

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      
      {/* Top Header Stepper */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
         <div className="content-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
               {sections.map((sec, idx) => (
                 <div key={sec} style={{ 
                   display: 'flex', alignItems: 'center', gap: '0.75rem', 
                   opacity: sectionIdx === idx ? 1 : 0.35, 
                   color: sectionIdx === idx ? 'var(--color-accent)' : 'var(--color-text-3)',
                   transition: 'var(--transition)'
                 }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', border: '1px solid currentColor',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sec}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Quiz Progress Line */}
      <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.03)', position: 'relative' }}>
        <div style={{ 
          height: '100%', width: `${progress}%`, background: 'var(--color-accent)',
          transition: 'width 0.4s ease',
          boxShadow: '0 0 15px var(--color-accent)'
        }}></div>
      </div>

      <div className="page-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', maxWidth: '900px', width: '100%', margin: '0 auto', paddingTop: '5vh' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem', width: '100%' }} className="animate-in">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--color-border)' }}>
            <Sparkles size={12} style={{ color: 'var(--color-accent)' }} /> 
            {track.toUpperCase()}: {currentSection} Diagnostic • {currentIdx + 1} / {questions.length}
          </div>
          <h2 style={{ fontSize: '2.5rem', lineHeight: 1.25, fontWeight: 700, maxWidth: '800px', margin: '0 auto' }}>
            {questions[currentIdx].q}
          </h2>
        </div>

        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {Object.entries(questions[currentIdx].options).map(([key, text]) => (
            <button 
              key={key} 
              onClick={() => handleSelect(key)}
              className="glass-card"
              style={{ 
                padding: '1.75rem', 
                textAlign: 'left', 
                fontSize: '1rem', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                border: answers[currentIdx] === key ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: answers[currentIdx] === key ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.015)',
                color: answers[currentIdx] === key ? '#fff' : 'var(--color-text-2)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                minWidth: '32px', height: '32px', borderRadius: '10px', 
                background: answers[currentIdx] === key ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 800
              }}>
                {key}
              </div>
              <span style={{ lineHeight: 1.5 }}>{text}</span>
            </button>
          ))}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5rem', paddingBottom: '3rem' }}>
          <button 
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="btn-ghost"
            style={{ opacity: currentIdx === 0 ? 0 : 0.8, background: 'transparent', border: 'none' }}
          >
            <ChevronLeft size={20} /> Previous Question
          </button>

          {isLastQuestion ? (
            <button 
              onClick={handleSubmit} 
              className="btn-primary" 
              disabled={!canSubmit || loading}
              style={{ padding: '1rem 3rem', fontSize: '1rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Generate Career Analysis <ArrowRight size={20} /></>}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-3)', fontWeight: 600 }}>
                {Math.round(progress)}% Complete
              </span>
              <button 
                onClick={() => setCurrentIdx(prev => prev + 1)}
                disabled={!answers[currentIdx]}
                className="btn-ghost"
                style={{ opacity: !answers[currentIdx] ? 0.3 : 1, width: '140px' }}
              >
                Skip <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {!canSubmit && isLastQuestion && (
          <div style={{ marginBottom: '4rem', padding: '1rem 2rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', color: '#fca5a5', fontSize: '0.875rem' }}>
             <AlertCircle size={18} /> Please answer all situational questions to unlock your trajectory report.
          </div>
        )}

      </div>
    </div>
  );
}
