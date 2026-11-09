/**
 * Domain Advisor AI Agent for CSE PathFinder
 * 
 * Purpose:
 * Designed specifically for beginners with ZERO coding or CS prerequisites.
 * Guides confused students through conversational, intuitive interest exploration.
 * Evaluates the student's answer to each question and dynamically selects the next
 * question to deepen the evaluation, resolve ties, and uncover their ideal CSE domain.
 */

import { QUIZ_DATA } from '../questions.js';

export const DOMAIN_METADATA = {
  ai: {
    name: 'Artificial Intelligence & Machine Learning',
    clusterKey: 'A',
    icon: 'Sparkles',
    color: '#E85D3F',
    plainSummary: 'Building smart systems that learn, recognize patterns, and automate intelligent decisions.',
    careers: ['AI Engineer', 'Machine Learning Specialist', 'NLP Researcher', 'Computer Vision Developer']
  },
  data: {
    name: 'Data Science & Big Data Analytics',
    clusterKey: 'B',
    icon: 'BarChart2',
    color: '#2EC4B6',
    plainSummary: 'Uncovering hidden stories, trends, and predictive insights buried inside massive collections of information.',
    careers: ['Data Scientist', 'Data Analyst', 'Business Intelligence Architect', 'Quantitative Researcher']
  },
  web: {
    name: 'Full Stack Web, Mobile & UX Engineering',
    clusterKey: 'C',
    icon: 'Layers',
    color: '#0284C7',
    plainSummary: 'Designing interactive, visually stunning websites, apps, and games that millions of people use every day.',
    careers: ['Frontend Developer', 'Full Stack Engineer', 'Mobile App Creator (iOS/Android)', 'UI/UX Technologist']
  },
  security: {
    name: 'Cybersecurity & Digital Defense',
    clusterKey: 'D',
    icon: 'ShieldCheck',
    color: '#D97706',
    plainSummary: 'Protecting private data, outsmarting hackers, finding hidden flaws, and defending digital infrastructure.',
    careers: ['Ethical Hacker / Penetration Tester', 'Security Analyst', 'Cryptographer', 'Incident Responder']
  },
  cloud: {
    name: 'Cloud Computing & Distributed Systems',
    clusterKey: 'E',
    icon: 'Cpu',
    color: '#6366F1',
    plainSummary: 'Architecting the massive, invisible server backbone and high-speed networks that power the entire global internet.',
    careers: ['Cloud Architect', 'DevOps / SRE Engineer', 'Distributed Systems Specialist', 'Network Infrastructure Lead']
  }
};

/**
 * Plain-English beginner translations for typical option choices
 */
export const BEGINNER_EXPLAINERS = {
  A: {
    domainId: 'ai',
    title: 'AI & Machine Learning Pathway',
    description: 'You like the idea of teaching software to think and improve by itself instead of manually writing every single rule.'
  },
  B: {
    domainId: 'data',
    title: 'Data Science & Analytics Pathway',
    description: 'You like looking at facts, statistics, and past trends to find the most logical, evidence-based answers.'
  },
  C: {
    domainId: 'web',
    title: 'Full Stack & Human-Computer Interface Pathway',
    description: 'You care deeply about how technology looks, feels, and connects with real humans in their everyday lives.'
  },
  D: {
    domainId: 'security',
    title: 'Cybersecurity & Digital Defense Pathway',
    description: 'You have a natural investigative skepticism — you instinctively look for loopholes, flaws, and ways to protect people.'
  },
  E: {
    domainId: 'cloud',
    title: 'Cloud Systems & Infrastructure Pathway',
    description: 'You want to build bulletproof, scalable foundations so systems run 24/7 without ever crashing or lagging.'
  }
};

/**
 * Initializes a new adaptive diagnostic session
 */
export function initAgentSession(track = 'software', totalTarget = 12) {
  const trackData = QUIZ_DATA[track] || QUIZ_DATA.software;
  const initialQuestion = trackData.questions[0];

  return {
    track,
    totalTarget,
    currentStep: 1,
    askedQuestionIndices: [0],
    domainScores: {
      ai: 0,
      data: 0,
      web: 0,
      security: 0,
      cloud: 0
    },
    clusterTotals: {},
    history: [],
    currentQuestion: initialQuestion,
    agentReasoning: 'AI AGENT INITIALIZATION: Welcome! I am your PathFinder Career Advisor. Let’s start with a foundational orientation question to see how your mind naturally approaches problem-solving.',
    emergingLeader: null,
    isComplete: false
  };
}

/**
 * Evaluates student answer and chooses the next question adaptively
 */
export function agentNextQuestion({
  track = 'software',
  currentSession,
  selectedOptionKey // 'A', 'B', 'C', 'D', 'E'
}) {
  const trackData = QUIZ_DATA[track] || QUIZ_DATA.software;
  const questions = trackData.questions;
  const clusters = trackData.clusters || {};

  // 1. Update domain affinities
  const updatedScores = { ...currentSession.domainScores };
  const updatedClusterTotals = { ...currentSession.clusterTotals };

  // Map option letter to domain ID
  const clusterMeta = clusters[selectedOptionKey] || {};
  const mappedDomain = clusterMeta.id || (
    selectedOptionKey === 'A' ? 'ai' :
    selectedOptionKey === 'B' ? 'data' :
    selectedOptionKey === 'C' ? 'web' :
    selectedOptionKey === 'D' ? 'security' : 'cloud'
  );

  updatedScores[mappedDomain] = (updatedScores[mappedDomain] || 0) + 1;
  updatedClusterTotals[selectedOptionKey] = (updatedClusterTotals[selectedOptionKey] || 0) + 1;

  // 2. Rank current domains
  const sortedDomains = Object.entries(updatedScores)
    .sort((a, b) => b[1] - a[1])
    .map(([domId, score]) => ({ domId, score }));

  const leader = sortedDomains[0];
  const runnerUp = sortedDomains[1];

  // Record answer history
  const updatedHistory = [
    ...currentSession.history,
    {
      step: currentSession.currentStep,
      question: currentSession.currentQuestion.q,
      selectedKey: selectedOptionKey,
      selectedText: currentSession.currentQuestion.options[selectedOptionKey],
      domain: mappedDomain
    }
  ];

  const nextStepNum = currentSession.currentStep + 1;
  const askedIndices = new Set(currentSession.askedQuestionIndices);

  // Check if diagnostic target reached
  if (nextStepNum > currentSession.totalTarget || askedIndices.size >= questions.length) {
    return {
      ...currentSession,
      currentStep: nextStepNum,
      domainScores: updatedScores,
      clusterTotals: updatedClusterTotals,
      history: updatedHistory,
      emergingLeader: leader.domId,
      isComplete: true,
      agentReasoning: `AI AGENT COMPLETE: Assessment finished! Your strongest affinity is ${DOMAIN_METADATA[leader.domId]?.name || leader.domId}. Synthesizing your personalized roadmap...`
    };
  }

  // 3. AI Agent Decision Logic for Next Question:
  let selectedNextIdx = -1;
  let decisionReason = '';

  // Rule A: Tie-breaker / Disambiguation between close leaders
  const isCloseContest = leader && runnerUp && (leader.score - runnerUp.score <= 1) && nextStepNum >= 4;

  if (isCloseContest) {
    // Look for an unasked question in "Applied Scenarios" or "Aptitude"
    // that contrasts different work styles
    for (let i = 0; i < questions.length; i++) {
      if (!askedIndices.has(i)) {
        const qCat = questions[i].category;
        if (qCat === 'Applied Scenarios' || qCat === 'Thinking Style' || qCat === 'Aptitude') {
          selectedNextIdx = i;
          break;
        }
      }
    }
    const leadName = DOMAIN_METADATA[leader.domId]?.name.split('&')[0].trim();
    const runnerName = DOMAIN_METADATA[runnerUp.domId]?.name.split('&')[0].trim();
    decisionReason = `AI AGENT ROUTING: You show compelling interest in both ${leadName} and ${runnerName}. I chose this next scenario question to see how you respond when these two perspectives interact in practice.`;
  }

  // Rule B: Deepen Exploration of Current Interest
  if (selectedNextIdx === -1) {
    // Try to find question in a category not yet explored or matching the preferred area
    const preferredCategories = nextStepNum <= 3 ? ['Interests', 'Orientation'] :
                                nextStepNum <= 7 ? ['Thinking Style', 'Aptitude'] :
                                ['Applied Scenarios', 'Interests'];

    for (const cat of preferredCategories) {
      for (let i = 0; i < questions.length; i++) {
        if (!askedIndices.has(i) && questions[i].category === cat) {
          selectedNextIdx = i;
          break;
        }
      }
      if (selectedNextIdx !== -1) break;
    }

    const domainTitle = DOMAIN_METADATA[mappedDomain]?.name.split('&')[0].trim() || 'this track';
    decisionReason = `AI AGENT INSIGHT: In your previous answer, you leaned towards ${domainTitle}. I have dynamically adapted your next question to explore your natural thinking style in that direction.`;
  }

  // Fallback: Pick any remaining unasked question
  if (selectedNextIdx === -1) {
    for (let i = 0; i < questions.length; i++) {
      if (!askedIndices.has(i)) {
        selectedNextIdx = i;
        break;
      }
    }
    decisionReason = `AI AGENT ROUTING: Exploring complementary strengths across the CSE ecosystem.`;
  }

  return {
    ...currentSession,
    currentStep: nextStepNum,
    askedQuestionIndices: [...currentSession.askedQuestionIndices, selectedNextIdx],
    domainScores: updatedScores,
    clusterTotals: updatedClusterTotals,
    history: updatedHistory,
    currentQuestion: questions[selectedNextIdx],
    agentReasoning: decisionReason,
    emergingLeader: leader.domId,
    isComplete: false
  };
}

/**
 * Calculates final results and percentages for the Results dashboard
 */
export function computeFinalResults(session, track = 'software') {
  const trackData = QUIZ_DATA[track] || QUIZ_DATA.software;
  const clusters = trackData.clusters || {};
  const totalAnswers = session.history.length || 1;

  const domainScores = session.domainScores;
  const sorted = Object.entries(domainScores)
    .sort((a, b) => b[1] - a[1]);

  const topDomainId = sorted[0][0];
  const topDomainInfo = DOMAIN_METADATA[topDomainId] || { name: 'Artificial Intelligence', color: '#E85D3F' };

  // Generate percentages across all 5 domains
  const processScores = {};
  const matchPercentages = {};

  Object.entries(DOMAIN_METADATA).forEach(([dId, meta]) => {
    const rawCount = domainScores[dId] || 0;
    // Base percentage proportional to chosen answers, boosted to a 40-95% realistic match scale
    const pct = Math.min(95, Math.max(35, Math.round((rawCount / totalAnswers) * 60 + 35)));
    processScores[meta.name] = pct;
    matchPercentages[dId] = pct;
  });

  // Ensure top domain has highest score
  const topPct = Math.max(...Object.values(processScores));

  return {
    track,
    top_domain: topDomainInfo.name,
    domain_id: topDomainId,
    confidence_score: topPct,
    match_percentage: topPct,
    scores: processScores,
    all_scores: processScores,
    domainScores,
    history: session.history,
    agentSummary: `Based on your ${totalAnswers} choices, our AI Agent identified ${topDomainInfo.name} as your natural sweet spot. Your choices demonstrate strong alignment with: ${topDomainInfo.plainSummary}`
  };
}
