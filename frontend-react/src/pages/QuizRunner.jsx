import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';

export default function QuizRunner() {
  const { track } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const data = QUIZ_DATA[track] || QUIZ_DATA['software'];

  useEffect(() => {
    if (!data) {
      navigate('/quiz');
    }
  }, [data, navigate]);

  useEffect(() => {
    setSelectedOption(answers[currentIdx] || null);
  }, [currentIdx, answers]);

  if (!data) return null;

  const questions = data.questions || [];
  const currentQ = questions[currentIdx] || { q: '', options: {} };
  const progress = Math.round(((currentIdx + 1) / questions.length) * 100);

  const sections = data.sections || ["Orientation", "Interests", "Aptitude", "Thinking Style", "Applied Scenarios"];
  const questionsPerSection = questions.length / sections.length;
  const sectionIdx = Math.min(sections.length - 1, Math.floor(currentIdx / questionsPerSection));
  const currentSection = sections[sectionIdx];

  const handleSelect = (key) => {
    setSelectedOption(key);
    setAnswers(prev => ({ ...prev, [currentIdx]: key }));
  };

  const handleNext = () => {
    if (!selectedOption) return;
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalAnswers = { ...answers, [currentIdx]: selectedOption };

    const scores = {};
    if (data.clusters) {
      Object.keys(data.clusters).forEach(key => scores[key] = 0);
    }
    
    Object.entries(finalAnswers).forEach(([qIdx, optionKey]) => {
      if (scores[optionKey] !== undefined) {
        scores[optionKey] += 1;
      }
    });

    let maxVal = -1;
    let topCluster = Object.keys(data.clusters || {})[0] || 'A';
    Object.entries(scores).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCluster = key;
      }
    });

    const processScores = {};
    if (data.clusters) {
      Object.entries(scores).forEach(([key, val]) => {
         const name = data.clusters[key]?.name || key;
         processScores[name] = Math.round((val / questions.length) * 100);
      });
    }

    const topClusterObj = data.clusters?.[topCluster] || { name: 'Software Track', id: 'software' };

    const resultsData = {
      track: track,
      top_domain: topClusterObj.name,
      domain_id: topClusterObj.id,
      match_percentage: Math.round((maxVal / questions.length) * 100),
      scores: processScores,
      raw_scores: scores
    };

    if (user && !user.isGuest) {
      try {
        await fetch(`${getApiBaseUrl()}/api/submit-result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_email: user.email,
            quiz_type: track,
            recommended_domain: resultsData.top_domain,
            domain_id: resultsData.domain_id,
            confidence_score: resultsData.match_percentage,
            all_scores: resultsData.scores
          })
        });
      } catch (err) {
        console.error("Error submitting result to server:", err);
      }
    }

    sessionStorage.setItem("quiz_results", JSON.stringify(resultsData));
    navigate('/results');
  };

  const isLastQuestion = currentIdx === questions.length - 1;
  const estMins = Math.ceil((questions.length - currentIdx) * 0.4);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col pb-16">
      
      {/* Top Header Stepper */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-outline-variant/30 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          
          <button 
            type="button"
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Exit Assessment</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-primary/10 text-primary rounded-full">
              {track.toUpperCase()} TRACK
            </span>
            <span className="text-xs font-semibold text-on-surface-variant">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high h-1.5 mt-3">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-8">
        
        {/* Section Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs font-medium text-on-surface-variant">
          <span className="uppercase tracking-wider font-semibold text-primary">
            {currentSection} ({sectionIdx + 1}/{sections.length})
          </span>
          <span>~{estMins} min{estMins > 1 ? 's' : ''} remaining</span>
        </div>

        {/* Question Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 mb-8">
          <div className="inline-block px-3 py-1 bg-surface-container text-xs font-semibold text-secondary rounded-lg mb-3">
            {currentQ.category || currentSection}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface leading-snug">
            {currentQ.q}
          </h2>
          <p className="text-xs text-on-surface-variant mt-2">
            Select the option that best reflects your preference.
          </p>
        </div>

        {/* Clean Option List */}
        <div className="flex flex-col gap-3 mb-10">
          {Object.entries(currentQ.options).map(([key, text]) => {
            const isChecked = selectedOption === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(key)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-primary text-on-primary border-primary shadow-md'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                    isChecked ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary'
                  }`}>
                    {key}
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {text}
                  </span>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isChecked ? 'bg-white text-primary' : 'border border-outline-variant/40 text-transparent'
                }`}>
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-6 py-3 rounded-xl border border-outline-variant/30 font-semibold text-sm text-on-surface hover:bg-surface-container disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption || loading}
            className="px-8 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-container shadow-md disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            <span>{isLastQuestion ? (loading ? 'Analyzing...' : 'Complete & View Results') : 'Next Question'}</span>
            <span className="material-symbols-outlined text-[18px]">
              {isLastQuestion ? 'analytics' : 'arrow_forward'}
            </span>
          </button>
        </div>

      </main>
    </div>
  );
}
