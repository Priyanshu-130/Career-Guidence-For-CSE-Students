import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QUIZ_DATA } from '../data/questions';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';

const OPTION_META = {
  A: {
    icon: 'memory',
    code: 'OPTION 01 • ARCHITECTURE & CORE',
    signals: ['AI/ML', 'Algorithms', 'Core Systems']
  },
  B: {
    icon: 'network_node',
    code: 'OPTION 02 • PATTERNS & ANALYTICS',
    signals: ['Data Science', 'Analytics', 'Modeling']
  },
  C: {
    icon: 'devices',
    code: 'OPTION 03 • PRODUCT & UX',
    signals: ['Full Stack', 'Frontend', 'Product Dev']
  },
  D: {
    icon: 'security',
    code: 'OPTION 04 • DEFENSE & SECURITY',
    signals: ['Cyber Security', 'Ethical Hacking', 'SecOps']
  },
  E: {
    icon: 'cloud_sync',
    code: 'OPTION 05 • CLOUD & INFRASTRUCTURE',
    signals: ['Cloud Eng', 'DevOps', 'Scale Architecture']
  },
  F: {
    icon: 'developer_board',
    code: 'OPTION 06 • EMBEDDED & HARDWARE',
    signals: ['IoT', 'Microcontrollers', 'Robotics']
  },
  G: {
    icon: 'token',
    code: 'OPTION 07 • DECENTRALIZED & WEB3',
    signals: ['Blockchain', 'Cryptography', 'Smart Contracts']
  }
};

export default function QuizRunner() {
  const { track } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const data = QUIZ_DATA[track];

  useEffect(() => {
    if (!data) navigate('/quiz');
  }, [data, navigate]);

  if (!data) return null;

  const questions = data.questions;
  const progress = Math.round(((currentIdx + 1) / questions.length) * 100);

  const sections = data.sections || ["Orientation", "Interests", "Aptitude", "Thinking Style", "Applied Scenarios"];
  const questionsPerSection = questions.length / sections.length;
  const sectionIdx = Math.min(sections.length - 1, Math.floor(currentIdx / questionsPerSection));
  const currentSection = sections[sectionIdx];

  const handleSelect = (optionKey) => {
    setAnswers({ ...answers, [currentIdx]: optionKey });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const scores = {};
    Object.keys(data.clusters).forEach(key => scores[key] = 0);
    
    Object.entries(answers).forEach(([qIdx, optionKey]) => {
      if (scores[optionKey] !== undefined) {
        scores[optionKey] += 1;
      }
    });

    let maxVal = -1;
    let topCluster = Object.keys(data.clusters)[0];
    Object.entries(scores).forEach(([key, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCluster = key;
      }
    });

    const processScores = {};
    Object.entries(scores).forEach(([key, val]) => {
       processScores[data.clusters[key].name] = (val / questions.length) * 4;
    });

    const resultsData = {
      track: track,
      top_domain: data.clusters[topCluster].name,
      domain_id: data.clusters[topCluster].id,
      match_percentage: Math.min(98, Math.max(65, Math.round((maxVal / questions.length) * 100) + 15)), 
      scores: processScores,
      raw_scores: scores
    };

    const studentRaw = sessionStorage.getItem("cse_student");
    if (studentRaw) {
      try {
        const student = JSON.parse(studentRaw);
        if (!student.isGuest) {
          await fetch(`${getApiBaseUrl()}/api/submit-result`, {
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
  const currentQ = questions[currentIdx];
  const selectedOption = answers[currentIdx];

  // User Initials
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  // Remaining time estimate
  const remainingQuestions = questions.length - (currentIdx + 1);
  const estMins = Math.max(1, Math.ceil(remainingQuestions * 0.4));

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      {/* Fixed Sticky Header from Stitch Design */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-space-sm flex items-center justify-between gap-space-sm max-w-6xl mx-auto">
          <div className="flex items-center gap-space-xs min-w-0 flex-1">
            <button 
              aria-label="Go Back" 
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              onClick={() => navigate('/quiz')}
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight truncate leading-tight pl-space-xs">
              Active Diagnostic Session • {track.toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0 pr-space-xs">
            <div className="w-11 h-11 flex items-center justify-center rounded-full transition-all">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-code-sm text-label-code-sm font-bold ring-2 ring-primary-container/40">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe px-margin bg-surface flex-grow max-w-4xl mx-auto">
        <div className="flex flex-col w-full pb-12">
          
          {/* Top Diagnostic Meta Bar */}
          <section className="flex flex-col gap-space-sm pt-space-xs mb-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-code-sm text-label-code-sm text-on-surface-variant tracking-wider uppercase">
                  Question {String(currentIdx + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-0.5 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-secondary">tune</span>
                <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">Adaptive AI Assessment</span>
              </div>
            </div>

            {/* Segmented Interactive Progress Track */}
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden p-[1px]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-secondary-container via-primary to-primary-container transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-code-sm text-label-code-sm">Progress: {progress}%</span>
              <span className="font-label-code-sm text-label-code-sm font-semibold text-primary">
                ~{estMins} min{estMins > 1 ? 's' : ''} remaining
              </span>
            </div>
          </section>

          {/* Module Badge & Context Header */}
          <section className="mb-space-lg">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low rounded-lg mb-space-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
              <span className="font-label-code-sm text-label-code-sm text-on-surface-variant uppercase tracking-wide">
                Module {String(sectionIdx + 1).padStart(2, '0')} • {currentSection}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-snug">
              Diagnostic Module: {currentSection} & Affinity Matrix
            </h2>
          </section>

          {/* Main Question Card with Decorative Ambient Glow */}
          <section className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-sm mb-space-lg overflow-hidden border border-outline-variant/40">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 font-label-code-sm text-label-code-sm px-space-sm py-1 bg-surface-container text-on-surface-variant rounded-md shadow-sm">
                  <span className="material-symbols-outlined text-[13px] text-secondary">alt_route</span>
                  {currentQ.category || 'Engineering Trait Evaluation'}
                </span>
              </div>
              <p className="font-headline-md text-headline-md text-on-surface font-semibold pt-space-xs leading-relaxed">
                {currentQ.q}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Select the option that aligns most naturally with your problem-solving instinct and analytical drive.
              </p>
            </div>
          </section>

          {/* Interactive Option Cards Form */}
          <form className="flex flex-col gap-space-md mb-space-xl" onSubmit={(e) => e.preventDefault()}>
            {Object.entries(currentQ.options).map(([key, text]) => {
              const meta = OPTION_META[key] || {
                icon: 'view_list',
                code: `OPTION ${key}`,
                signals: [track.toUpperCase(), 'Specialization']
              };
              const isChecked = selectedOption === key;

              return (
                <label 
                  key={key} 
                  onClick={() => handleSelect(key)}
                  className="group relative block cursor-pointer transition-all duration-200 active:scale-[0.99]"
                >
                  <input 
                    type="radio" 
                    name="career_focus" 
                    value={key} 
                    checked={isChecked}
                    onChange={() => {}}
                    className="peer sr-only"
                  />
                  <div className={`relative flex flex-col gap-space-xs p-space-md rounded-xl transition-all duration-200 border ${
                    isChecked 
                      ? 'bg-primary-container text-on-primary shadow-md border-primary-container' 
                      : 'bg-surface-container-lowest text-on-surface shadow-sm hover:border-primary/50 border-outline-variant/30'
                  }`}>
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm flex-shrink-0 ${
                          isChecked 
                            ? 'bg-surface-container-lowest text-primary' 
                            : 'bg-surface-container text-secondary'
                        }`}>
                          <span className="material-symbols-outlined text-[22px]">{meta.icon}</span>
                        </div>
                        <div>
                          <span className={`font-label-code-sm text-label-code-sm uppercase tracking-wider ${
                            isChecked ? 'text-on-primary/80' : 'text-on-surface-variant'
                          }`}>
                            {meta.code}
                          </span>
                          <h3 className="font-headline-md text-headline-md font-bold leading-tight mt-0.5">
                            {text.length > 60 ? text.substring(0, 58) + '...' : text}
                          </h3>
                        </div>
                      </div>

                      {/* Monospace Checkmark Indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5 ${
                        isChecked 
                          ? 'bg-surface-container-lowest text-primary' 
                          : 'bg-surface-container text-transparent'
                      }`}>
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                    </div>

                    <p className={`font-body-md text-body-md opacity-90 pl-12 pr-2 leading-relaxed ${
                      isChecked ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}>
                      {text}
                    </p>

                  </div>
                </label>
              );
            })}
          </form>


          {/* Navigation Action Footer */}
          <footer className="flex flex-col gap-space-md pt-space-xs mb-space-lg">
            <div className="flex items-center gap-space-md">
              {/* Previous Question Button */}
              <button 
                type="button"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="w-1/3 h-12 flex items-center justify-center gap-space-xs rounded-xl bg-surface-container text-on-surface font-headline-md text-headline-md active:scale-95 transition-all shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>Back</span>
              </button>

              {/* Save & Continue CTA */}
              <button 
                type="button"
                onClick={handleNext}
                disabled={!selectedOption || loading}
                className="flex-1 h-12 flex items-center justify-center gap-space-xs rounded-xl bg-primary text-on-primary font-headline-md text-headline-md active:scale-95 transition-all shadow-md hover:bg-primary-container disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>{isLastQuestion ? (loading ? 'Analyzing...' : 'Generate Trajectory Analysis') : 'Save & Continue'}</span>
                <span className="material-symbols-outlined text-[20px]">
                  {isLastQuestion ? 'analytics' : 'arrow_forward'}
                </span>
              </button>
            </div>

            {/* Subtle Skip Link */}
            <div className="flex justify-center items-center">
              <button 
                type="button"
                onClick={() => handleNext()}
                className="font-label-code-md text-label-code-md text-on-surface-variant hover:text-on-surface flex items-center gap-1 active:opacity-75 transition-colors py-space-xs"
              >
                <span>Skip this question for now</span>
                <span className="material-symbols-outlined text-[16px]">fast_forward</span>
              </button>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
