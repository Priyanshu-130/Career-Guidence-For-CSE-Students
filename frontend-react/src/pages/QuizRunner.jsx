import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/roadmapHelper';
import { useAuth } from '../context/AuthContext';
import { getAdaptiveQuestion, QUIZ_STRUCTURE } from '../data/adaptive/adaptiveRouter';
import { domainMapping } from '../data/adaptive/adaptiveEngine';
import domainMappingConfig from '../data/adaptive/domain_mapping_version.json';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  TrendingUp, 
  Compass, 
  ShieldCheck, 
  Zap, 
  Bot,
  Brain,
  Award,
  Layers,
  Activity
} from 'lucide-react';

export default function QuizRunner() {
  const { track } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard state: 'intro' | 'quiz' | 'submitting'
  const [stage, setStage] = useState('intro');

  // Step 1: Student Intro Profile
  const [introProfile, setIntroProfile] = useState({
    semester: 3,
    experienceLevel: 'beginner', // 'zero' | 'beginner' | 'intermediate' | 'experienced'
    preferredArea: 'AI, ML & Data Science',
    codingConfidence: 'Exploring foundations'
  });

  // Step 2: Adaptive Quiz Running State
  const TOTAL_QUESTIONS = QUIZ_STRUCTURE.TOTAL_QUESTIONS; // 21 total: 6 logic, 10 interest, 5 guided
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [agentReasoning, setAgentReasoning] = useState('');
  const [categoryLabel, setCategoryLabel] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [askedIds, setAskedIds] = useState([]);
  const [currentLadderLevel, setCurrentLadderLevel] = useState(2);
  const [loading, setLoading] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Initial question load upon entering quiz stage
  const startAdaptiveSession = () => {
    let startLvl = 2;
    if (introProfile.experienceLevel === 'zero') startLvl = 1;
    else if (introProfile.experienceLevel === 'intermediate') startLvl = 3;
    else if (introProfile.experienceLevel === 'experienced') startLvl = 4;
    setCurrentLadderLevel(startLvl);

    const initial = getAdaptiveQuestion({
      stepNumber: 1,
      previousAnswers: {},
      studentIntro: introProfile,
      askedQuestionIds: [],
      currentLadderLevel: startLvl
    });

    if (initial) {
      setCurrentQuestion(initial.question);
      setAgentReasoning(initial.reasoning);
      setCategoryLabel(initial.categoryLabel);
      setCurrentLadderLevel(initial.targetDifficulty);
      setAskedIds([initial.question.id]);
      setQuestionStartTime(Date.now());
      setStage('quiz');
    }
  };

  const handleSelectOption = (optText) => {
    setSelectedOption(optText);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const isDontKnow = selectedOption.includes("I don't know");
    const isCorrect = currentQuestion.category === 'interest' 
      ? true 
      : (!isDontKnow && selectedOption === currentQuestion.answer);

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        answer: selectedOption,
        isCorrect,
        isDontKnow,
        timeTaken,
        riasec: currentQuestion.riasec || null
      }
    };
    setAnswers(updatedAnswers);

    if (currentStep < TOTAL_QUESTIONS) {
      const nextStepNum = currentStep + 1;
      const nextResult = getAdaptiveQuestion({
        stepNumber: nextStepNum,
        previousAnswers: updatedAnswers,
        studentIntro: introProfile,
        askedQuestionIds: askedIds,
        currentLadderLevel: currentLadderLevel
      });

      if (nextResult) {
        setCurrentQuestion(nextResult.question);
        setAgentReasoning(nextResult.reasoning);
        setCategoryLabel(nextResult.categoryLabel);
        setCurrentLadderLevel(nextResult.targetDifficulty);
        setAskedIds(prev => [...prev, nextResult.question.id]);
        setSelectedOption(null);
        setCurrentStep(nextStepNum);
        setQuestionStartTime(Date.now());
      }
    } else {
      finalizeAndSubmitResults(updatedAnswers);
    }
  };

  const finalizeAndSubmitResults = async (finalAnswers) => {
    setLoading(true);

    // 1. Calculate RIASEC Vector from 10 O*NET Interest Questions
    const riasecScores = { R: 40, I: 50, A: 40, S: 40, E: 40, C: 40 };
    Object.values(finalAnswers).forEach(ans => {
      if (ans.category === 'interest' && ans.riasec) {
        const opt = ans.answer || '';
        let weight = 60;
        if (opt.includes('(5)') || opt.includes('Strongly Like')) weight = 95;
        else if (opt.includes('(4)') || opt.includes('Like')) weight = 80;
        else if (opt.includes('(3)') || opt.includes('Neutral')) weight = 50;
        else if (opt.includes('(2)') || opt.includes('Dislike')) weight = 30;
        else if (opt.includes('(1)')) weight = 15;
        riasecScores[ans.riasec] = Math.min(100, Math.round((riasecScores[ans.riasec] + weight) / 2));
      }
    });

    // 2. Behavioral adjustment from Bebras Logic and Code.org Guided Activities
    let correctCount = 0;
    let guidedCompleted = 0;
    Object.values(finalAnswers).forEach(ans => {
      if (ans.category === 'logic' && ans.isCorrect) correctCount++;
      if (ans.category === 'guided_activity' && ans.isCorrect) guidedCompleted++;
    });

    // Derive Domain Recommendations using pure O*NET Euclidean formula
    const behaviorSignals = {
      domainAdjustments: {
        ai: Math.min(15, correctCount * 2),
        web: Math.min(15, guidedCompleted * 3),
        security: Math.min(15, correctCount * 2)
      }
    };

    const hypothesis = domainMapping(riasecScores, behaviorSignals, domainMappingConfig);
    const topDomain = hypothesis.top3Domains[0] || { title: 'AI, ML & Deep Learning', score: 88, id: 'ai' };

    // Format scores object for Results page
    const processScores = {};
    hypothesis.allDomains.forEach(d => {
      processScores[d.title] = Math.round(d.score);
    });

    const resultsData = {
      track: track || 'software',
      top_domain: topDomain.title,
      domain_id: topDomain.id,
      match_percentage: topDomain.score,
      scores: processScores,
      all_scores: processScores,
      raw_scores: riasecScores,
      hypothesis
    };

    // Save to server if authenticated
    if (user && !user.isGuest) {
      try {
        const apiUrl = getApiBaseUrl() + "/api/submit-result";
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_email: user.email,
            quiz_type: track || 'software',
            recommended_domain: topDomain.title,
            confidence_score: topDomain.score,
            all_scores: processScores
          })
        });
      } catch (err) {
        console.error('Error submitting result to server:', err);
      }
    }

    sessionStorage.setItem('quiz_results', JSON.stringify(resultsData));
    navigate('/results');
  };

  // -------------------------------------------------------------
  // RENDER STAGE 1: INTRO PROFILE ONBOARDING
  // -------------------------------------------------------------
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center py-12 px-4 animate-in">
        <div className="max-w-xl w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-10 shadow-lg">
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit mb-4">
            <Bot size={15} /> 21-Question Adaptive Diagnostic Agent
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
            Personalize Your Assessment
          </h1>
          <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
            Your assessment sequence adapts dynamically across three verified academic components:
          </p>

          {/* Breakdown cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-lg font-black text-primary">6</div>
              <div className="text-[11px] font-bold text-on-surface">Bebras Puzzles</div>
              <div className="text-[10px] text-on-surface-variant">Logic & Graph</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-lg font-black text-accent">10</div>
              <div className="text-[11px] font-bold text-on-surface">O*NET Interests</div>
              <div className="text-[10px] text-on-surface-variant">RIASEC Profiler</div>
            </div>
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30">
              <div className="text-lg font-black text-success">5</div>
              <div className="text-[11px] font-bold text-on-surface">Code.org Labs</div>
              <div className="text-[10px] text-on-surface-variant">Guided Career</div>
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-8">
            {/* Semester */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Current Semester
              </label>
              <select
                value={introProfile.semester}
                onChange={(e) => setIntroProfile({ ...introProfile, semester: Number(e.target.value) })}
                className="w-full p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm font-semibold focus:outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s} (B.Tech CSE)</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Prior Coding Background
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'zero', label: 'Zero Prior Coding', desc: 'Explainer & logic first' },
                  { id: 'beginner', label: 'Beginner', desc: 'Variables & conditions' },
                  { id: 'intermediate', label: 'Intermediate', desc: 'Built projects & loops' },
                  { id: 'experienced', label: 'Advanced', desc: 'DSA & software design' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setIntroProfile({ ...introProfile, experienceLevel: lvl.id })}
                    className={`p-3.5 text-left rounded-xl border transition-all ${
                      introProfile.experienceLevel === lvl.id
                        ? 'border-primary bg-primary/10 text-primary font-bold'
                        : 'border-outline-variant/30 hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className="text-sm font-bold">{lvl.label}</div>
                    <div className="text-xs text-on-surface-variant opacity-80">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Area of Interest */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Preferred Area for Deep-Dive
              </label>
              <select
                value={introProfile.preferredArea}
                onChange={(e) => setIntroProfile({ ...introProfile, preferredArea: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm font-semibold focus:outline-none focus:border-primary"
              >
                <option value="AI, ML & Data Science">Artificial Intelligence, ML & Data Science</option>
                <option value="Full Stack & Cloud Systems">Web Development, APIs & Cloud Systems</option>
                <option value="Cybersecurity & Networks">Cybersecurity, Networking & Systems</option>
                <option value="Open to Discovery">Undecided / Exploring Broad Options</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={startAdaptiveSession}
            className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-base hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Start 21-Question Diagnostic</span>
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER STAGE 2: ADAPTIVE QUESTION RUNNER
  // -------------------------------------------------------------
  if (!currentQuestion) return null;

  const progressPct = Math.round((currentStep / TOTAL_QUESTIONS) * 100);

  // Section milestone indicator
  let currentPhase = 'Phase 1: Bebras Logic';
  if (currentStep > QUIZ_STRUCTURE.LOGIC_COUNT && currentStep <= (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'Phase 2: O*NET Career Interests';
  } else if (currentStep > (QUIZ_STRUCTURE.LOGIC_COUNT + QUIZ_STRUCTURE.INTEREST_COUNT)) {
    currentPhase = 'Phase 3: Code.org Guided Labs';
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col pb-16 animate-in">
      
      {/* Top Header Stepper */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-outline-variant/30 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Exit
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-extrabold text-primary">
              {currentPhase}
            </span>
            <span className="text-xs font-bold text-on-surface-variant">
              Q{currentStep} of {TOTAL_QUESTIONS}
            </span>
          </div>

          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant">
            Level {currentQuestion.difficulty || 1} / 4
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-container h-1 mt-3">
          <div 
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 pt-8 w-full flex-1 flex flex-col justify-center">
        
        {/* Agent Routing Reasoning Pill */}
        {agentReasoning && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Bot size={16} className="flex-shrink-0" />
            <span>{agentReasoning}</span>
          </div>
        )}

        {/* Source Citation Badge */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium mb-3">
          <ShieldCheck size={14} className="text-primary" />
          <span>Verified Source: {currentQuestion.source}</span>
          <span className="opacity-40">•</span>
          <span className="font-mono text-[10px] bg-surface-container px-2 py-0.5 rounded">
            {currentQuestion.license}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface leading-relaxed whitespace-pre-line">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 mb-10">
          {currentQuestion.options.map((optText, optIdx) => {
            const isChecked = selectedOption === optText;
            const isIdk = optText.includes("I don't know");

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optText)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-4 ${
                  isChecked
                    ? 'bg-primary text-on-primary border-primary shadow-md'
                    : isIdk
                    ? 'bg-surface-container/60 text-on-surface-variant border-dashed border-outline-variant/40 hover:border-primary/50'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                    isChecked ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {optText}
                  </span>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isChecked ? 'bg-white text-primary' : 'border border-outline-variant/40 text-transparent'
                }`}>
                  <CheckCircle2 size={16} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation / Next Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            disabled={!selectedOption || loading}
            onClick={handleNextQuestion}
            className="px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-container shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>{currentStep === TOTAL_QUESTIONS ? (loading ? 'Analyzing...' : 'Complete & View Results') : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </main>

    </div>
  );
}
