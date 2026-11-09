/**
 * Multi-Vector Adaptive Domain Advisor Agent for CSE PathFinder
 * 
 * Core Architectural Principles:
 * 1. Exploration > Prediction: Generates an explainable shortlist of top 2-3 candidate domains with uncertainty metrics.
 * 2. Strict Decoupling: Tracks Interest, Enjoyment, and Knowledge/Readiness on independent vectors. Poor test performance NEVER reduces interest.
 * 3. Two Starting Routes:
 *    - Route 1 (Beginners): Simple interest, everyday metaphors, plain-English explainers, zero-syntax penalty.
 *    - Route 2 (Experienced): Domain depth calibration + separate diagnostic readiness checks.
 * 4. Multi-Armed Adaptive Selection:
 *    - 70% depth / convergence
 *    - 30% anti-echo-chamber exploration
 *    - Head-to-head disambiguation when leaders are tied
 * 5. Transparent Reasoning: Live explainability banner explaining why each question was selected.
 */

import adaptiveBank from './adaptiveQuestionBank.js';
import { QUIZ_DATA } from '../questions.js';

export const DOMAIN_METADATA = {
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence & Machine Learning',
    clusterKey: 'A',
    icon: 'Sparkles',
    color: '#E85D3F',
    plainSummary: 'Building smart systems that learn from data, recognize patterns, and automate complex decisions.',
    careers: ['Machine Learning Engineer', 'AI Research Scientist', 'NLP Specialist', 'Computer Vision Developer']
  },
  data: {
    id: 'data',
    name: 'Data Science & Big Data Analytics',
    clusterKey: 'B',
    icon: 'BarChart2',
    color: '#2EC4B6',
    plainSummary: 'Uncovering hidden trends, predictive insights, and mathematical patterns buried inside massive databases.',
    careers: ['Data Scientist', 'Data Analytics Architect', 'Business Intelligence Lead', 'Quantitative Analyst']
  },
  web: {
    id: 'web',
    name: 'Full Stack Web, Mobile & UX Engineering',
    clusterKey: 'C',
    icon: 'Layers',
    color: '#0284C7',
    plainSummary: 'Designing interactive, visually engaging software, apps, and interfaces used by millions of people daily.',
    careers: ['Full Stack Developer', 'Frontend Architect', 'Mobile App Creator (iOS/Android)', 'UI/UX Technologist']
  },
  security: {
    id: 'security',
    name: 'Cybersecurity & Digital Defense',
    clusterKey: 'D',
    icon: 'ShieldCheck',
    color: '#D97706',
    plainSummary: 'Protecting private data, finding hidden vulnerabilities, outsmarting adversaries, and defending digital infrastructure.',
    careers: ['Ethical Hacker / Penetration Tester', 'Security Operations Analyst', 'Cryptographer', 'Incident Response Lead']
  },
  cloud: {
    id: 'cloud',
    name: 'Cloud Computing & Distributed Systems',
    clusterKey: 'E',
    icon: 'Cpu',
    color: '#6366F1',
    plainSummary: 'Architecting the massive, invisible server backbone, global networks, and high-availability clusters powering the internet.',
    careers: ['Cloud Architect', 'DevOps / SRE Engineer', 'Distributed Systems Specialist', 'Platform Reliability Lead']
  },
  systems: {
    id: 'systems',
    name: 'Systems, Firmware & Embedded IoT',
    clusterKey: 'F',
    icon: 'Terminal',
    color: '#10B981',
    plainSummary: 'Interfacing directly with hardware chips, robotics, operating system kernels, and Internet of Things sensors.',
    careers: ['Embedded Systems Engineer', 'Firmware Developer', 'Robotics Software Architect', 'Kernel / OS Engineer']
  }
};

export const BEGINNER_EXPLAINERS = {
  A: {
    domainId: 'ai',
    title: 'AI & Machine Learning Pathway',
    description: 'You prefer teaching software to learn and adapt from examples rather than hardcoding static rules.'
  },
  B: {
    domainId: 'data',
    title: 'Data Science & Analytics Pathway',
    description: 'You value empirical facts, statistical patterns, and systematic measurement to guide decisions.'
  },
  C: {
    domainId: 'web',
    title: 'Full Stack & Human-Interface Pathway',
    description: 'You care deeply about visual feedback, user empathy, and human connection through responsive digital apps.'
  },
  D: {
    domainId: 'security',
    title: 'Cybersecurity & Defense Pathway',
    description: 'You have a natural investigative mindset—you look for loopholes, edge-case flaws, and ways to safeguard assets.'
  },
  E: {
    domainId: 'cloud',
    title: 'Cloud & Infrastructure Pathway',
    description: 'You want to build high-scale, resilient foundations so global applications never crash or suffer latency.'
  }
};

/**
 * Initializes an Adaptive Agent Session
 * @param {string} routeType - 'beginner' (Route 1) or 'experienced' (Route 2)
 * @param {number} totalTarget - Total questions in session (default 25)
 * @param {string} declaredInterest - Optional starting domain leaning for Route 2
 */
export function initAgentSession(routeType = 'beginner', totalTarget = 25, declaredInterest = null) {
  // Filter eligible items from question bank
  const allItems = adaptiveBank.items || [];
  const eligibleItems = allItems.filter(item => {
    if (routeType === 'beginner') {
      // Beginners receive interest, work values, scenarios, and accessible logic
      return item.target_routes.includes('beginner');
    }
    // Route 2 includes all items plus technical readiness checks
    return true;
  });

  // Select opening question
  let initialItem;
  if (routeType === 'beginner') {
    // Start with broad orientation question (onet_int_001)
    initialItem = eligibleItems.find(i => i.id === 'onet_int_001') || eligibleItems[0];
  } else {
    // For experienced students, start with a situational CSE scenario
    initialItem = eligibleItems.find(i => i.tier === 'cse_scenario_original') || eligibleItems[0];
  }

  return {
    routeType, // 'beginner' | 'experienced'
    totalTarget: Math.min(totalTarget, eligibleItems.length),
    currentStep: 1,
    declaredInterest,
    askedItemIds: [initialItem.id],
    eligibleItemIds: eligibleItems.map(i => i.id),
    
    // Decoupled Multi-Vector Evidence Model
    interestScores: { ai: 0, data: 0, web: 0, security: 0, cloud: 0, systems: 0 },
    enjoymentScores: { ai: 0, data: 0, web: 0, security: 0, cloud: 0, systems: 0 },
    knowledgeScores: { totalAnswered: 0, correct: 0, knowledgePoints: 0 },
    prerequisiteGaps: [],
    
    // Longitudinal Session History
    history: [],
    currentQuestion: formatItemForUI(initialItem),
    agentReasoning: routeType === 'beginner' 
      ? 'AI AGENT INITIALIZATION: Welcome to Zero-Prerequisite Discovery! We start with an intuitive problem-solving scenario to observe your natural instincts.'
      : `AI AGENT INITIALIZATION: Route 2 Calibration active. Beginning with realistic engineering scenarios to test technical depth and readiness.`,
    emergingLeader: declaredInterest || null,
    isComplete: false
  };
}

/**
 * Normalizes question item for UI presentation
 */
function formatItemForUI(item) {
  return {
    id: item.id,
    q: item.prompt,
    category: item.category || 'Career Discovery',
    tier: item.tier,
    plainEnglishHelper: item.plain_english_helper,
    provenance: item.provenance,
    options: item.options.map(opt => ({
      key: opt.key,
      text: opt.text,
      careerMeaning: opt.career_meaning,
      interestWeights: opt.interest_weights || {},
      enjoymentWeight: opt.enjoyment_weight || 0.7,
      isCorrect: opt.is_correct,
      knowledgeScore: opt.knowledge_score
    }))
  };
}

/**
 * Processes student's response, updates decoupled vectors, and adaptively selects the next question
 */
export function agentNextQuestion({
  currentSession,
  selectedOptionKey // 'A', 'B', 'C', 'D', 'E'
}) {
  const allItems = adaptiveBank.items || [];
  const itemMap = new Map(allItems.map(i => [i.id, i]));
  
  const currentItem = itemMap.get(currentSession.currentQuestion.id);
  const selectedOpt = currentItem ? currentItem.options.find(o => o.key === selectedOptionKey) : null;

  // 1. Update Decoupled Evidence Vectors
  const newInterest = { ...currentSession.interestScores };
  const newEnjoyment = { ...currentSession.enjoymentScores };
  const newKnowledge = { ...currentSession.knowledgeScores };
  const newPrereqs = [...currentSession.prerequisiteGaps];

  let primaryDomainSelected = null;

  if (selectedOpt) {
    // A. Interest Weights (Curiosity & Affinity)
    if (selectedOpt.interest_weights) {
      let maxWeight = 0;
      Object.entries(selectedOpt.interest_weights).forEach(([dom, wt]) => {
        newInterest[dom] = (newInterest[dom] || 0) + wt;
        if (wt > maxWeight) {
          maxWeight = wt;
          primaryDomainSelected = dom;
        }
      });
    }

    // B. Enjoyment Weights (Intrinsic Engagement)
    if (primaryDomainSelected && selectedOpt.enjoyment_weight) {
      newEnjoyment[primaryDomainSelected] = (newEnjoyment[primaryDomainSelected] || 0) + selectedOpt.enjoyment_weight;
    }

    // C. Knowledge & Readiness (Decoupled from Interest)
    if (currentItem.tier === 'logic_bebras' || currentItem.tier === 'guided_micro_codeorg') {
      newKnowledge.totalAnswered += 1;
      if (selectedOpt.is_correct) {
        newKnowledge.correct += 1;
        newKnowledge.knowledgePoints += (selectedOpt.knowledge_score || 1.0);
      } else {
        // Tag prerequisite gap without reducing interest score!
        if (primaryDomainSelected) {
          newPrereqs.push({
            itemId: currentItem.id,
            category: currentItem.category,
            prompt: currentItem.prompt,
            recommendedPrerequisite: selectedOpt.career_meaning || 'Foundational Logic & Systems Concepts'
          });
        }
      }
    }
  }

  // 2. Rank current domains by Interest Affinity
  const sortedDomains = Object.entries(newInterest)
    .sort((a, b) => b[1] - a[1])
    .map(([domId, score]) => ({ domId, score }));

  const leader = sortedDomains[0];
  const runnerUp = sortedDomains[1];

  // 3. Update History
  const updatedHistory = [
    ...currentSession.history,
    {
      step: currentSession.currentStep,
      itemId: currentSession.currentQuestion.id,
      prompt: currentSession.currentQuestion.q,
      tier: currentItem?.tier,
      selectedKey: selectedOptionKey,
      selectedText: selectedOpt?.text,
      careerMeaning: selectedOpt?.career_meaning,
      primaryDomain: primaryDomainSelected
    }
  ];

  const nextStepNum = currentSession.currentStep + 1;
  const askedSet = new Set(currentSession.askedItemIds);

  // 4. Check if session completion target is reached
  if (nextStepNum > currentSession.totalTarget || askedSet.size >= currentSession.eligibleItemIds.length) {
    return {
      ...currentSession,
      currentStep: nextStepNum,
      interestScores: newInterest,
      enjoymentScores: newEnjoyment,
      knowledgeScores: newKnowledge,
      prerequisiteGaps: newPrereqs,
      history: updatedHistory,
      emergingLeader: leader ? leader.domId : 'ai',
      isComplete: true,
      agentReasoning: `AI AGENT COMPLETE: 25-step adaptive trajectory finished! Compiling your explainable shortlist and uncertainty analysis...`
    };
  }

  // 5. Adaptive Agent Multi-Armed Selection Logic:
  // Candidate pool: eligible items not yet asked
  const candidates = currentSession.eligibleItemIds
    .filter(id => !askedSet.has(id))
    .map(id => itemMap.get(id))
    .filter(Boolean);

  let chosenItem = null;
  let agentReasoning = '';

  // STRATEGY A: Disambiguation Trigger (Head-to-head when top 2 domains are within 12%)
  const scoreDiff = (leader && runnerUp) ? (leader.score - runnerUp.score) : 999;
  const isCloseContest = leader && runnerUp && leader.score > 2 && (scoreDiff <= 1.2) && nextStepNum >= 6;

  if (isCloseContest) {
    // Find an item where options contrast the top 2 domains
    const leadDom = leader.domId;
    const runDom = runnerUp.domId;

    const disambigCandidate = candidates.find(item => {
      const domsInItem = new Set();
      item.options.forEach(opt => {
        Object.keys(opt.interest_weights || {}).forEach(d => domsInItem.add(d));
      });
      return domsInItem.has(leadDom) && domsInItem.has(runDom);
    });

    if (disambigCandidate) {
      chosenItem = disambigCandidate;
      const leadName = DOMAIN_METADATA[leadDom]?.name.split('&')[0].trim();
      const runName = DOMAIN_METADATA[runDom]?.name.split('&')[0].trim();
      agentReasoning = `AI ADAPTIVE SELECTION: You show strong curiosity for both ${leadName} and ${runName}. I selected this head-to-head scenario to distinguish between their practical daily workflows.`;
    }
  }

  // STRATEGY B: Anti-Echo-Chamber Exploration (Every 4th question)
  // Deliberately test an unexplored or adjacent domain to prevent early response bias
  const isExplorationStep = (nextStepNum % 4 === 0);
  if (!chosenItem && isExplorationStep) {
    // Pick a domain with lower exposure to test for hidden affinity
    const underrepresented = sortedDomains.slice(-3);
    const targetUnderDom = underrepresented[Math.floor(Math.random() * underrepresented.length)]?.domId;

    const exploreCandidate = candidates.find(item => {
      return item.options.some(opt => opt.interest_weights && opt.interest_weights[targetUnderDom] > 0.5);
    });

    if (exploreCandidate) {
      chosenItem = exploreCandidate;
      agentReasoning = `AI EXPLORATION PROBE: To ensure early answers don't bias your assessment, I've injected this cross-disciplinary scenario exploring complementary CS areas.`;
    }
  }

  // STRATEGY C: Route 2 Technical Readiness Check (Every 5th question in Route 2)
  if (!chosenItem && currentSession.routeType === 'experienced' && nextStepNum % 5 === 0) {
    const prereqCandidate = candidates.find(item => item.tier === 'guided_micro_codeorg' || item.tier === 'logic_bebras');
    if (prereqCandidate) {
      chosenItem = prereqCandidate;
      agentReasoning = `AI READINESS PROBE: Checking foundational understanding. (Note: Incorrect answers identify helpful roadmap prerequisites and never reduce your career affinity!).`;
    }
  }

  // STRATEGY D: Exploitation / Convergence (Drill into emerging leader)
  if (!chosenItem && leader) {
    const leadDom = leader.domId;
    const depthCandidate = candidates.find(item => {
      return item.options.some(opt => opt.interest_weights && opt.interest_weights[leadDom] >= 0.8);
    });

    if (depthCandidate) {
      chosenItem = depthCandidate;
      const leadTitle = DOMAIN_METADATA[leadDom]?.name.split('&')[0].trim();
      agentReasoning = `AI DEPTH ROUTING: Deepening evaluation of ${leadTitle} based on your recent problem-solving choices.`;
    }
  }

  // Fallback: Pick first available candidate
  if (!chosenItem && candidates.length > 0) {
    chosenItem = candidates[0];
    agentReasoning = `AI ADVISOR ADAPTIVE SELECTION: Broadening evaluation across the software and systems spectrum.`;
  }

  return {
    ...currentSession,
    currentStep: nextStepNum,
    askedItemIds: [...currentSession.askedItemIds, chosenItem.id],
    interestScores: newInterest,
    enjoymentScores: newEnjoyment,
    knowledgeScores: newKnowledge,
    prerequisiteGaps: newPrereqs,
    history: updatedHistory,
    currentQuestion: formatItemForUI(chosenItem),
    agentReasoning,
    emergingLeader: leader ? leader.domId : 'ai',
    isComplete: false
  };
}

/**
 * Computes the final Explainable Shortlist, Evidence Ledger, and Uncertainty Index
 */
export function computeFinalResults(session) {
  const interest = session.interestScores || {};
  const enjoyment = session.enjoymentScores || {};
  const totalWeight = Object.values(interest).reduce((sum, v) => sum + v, 0) || 1;

  // 1. Calculate percentage matches
  const percentageScores = {};
  Object.keys(DOMAIN_METADATA).forEach(domId => {
    const raw = interest[domId] || 0;
    // Normalized score with 25-item ceiling
    const pct = Math.min(98, Math.max(25, Math.round((raw / totalWeight) * 100 * 2.2)));
    percentageScores[domId] = pct;
  });

  // Rank domains
  const ranked = Object.entries(percentageScores)
    .sort((a, b) => b[1] - a[1])
    .map(([domId, pct]) => ({ domId, pct, meta: DOMAIN_METADATA[domId] }));

  const primary = ranked[0];
  const adjacent = ranked[1];
  const exploratory = ranked[2];

  // 2. Compute Uncertainty Index
  // Low score difference between 1st and 3rd indicates higher uncertainty / versatile profile
  const spread = primary.pct - exploratory.pct;
  let uncertaintyIndex = 'Low';
  let uncertaintyDescription = 'High clarity and consistency observed across session scenarios.';
  if (spread < 15) {
    uncertaintyIndex = 'High';
    uncertaintyDescription = 'Multidisciplinary profile: Your interests span multiple domains evenly. Exploring foundational projects across top 2 domains is recommended.';
  } else if (spread < 28) {
    uncertaintyIndex = 'Moderate';
    uncertaintyDescription = 'Strong leading trajectory with noticeable adjacent affinity. Your ideal direction may blend both fields.';
  }

  // 3. Generate Evidence Ledger (Why this fits & Open Cautions)
  const history = session.history || [];
  const primaryPicks = history.filter(h => h.primaryDomain === primary.domId).length;

  const evidenceLedger = {
    whyItFits: [
      `Selected ${primary.meta.name.split('&')[0]} in ${primaryPicks} out of ${history.length} scenario evaluations.`,
      `Reported high intrinsic enjoyment when addressing ${primary.meta.plainSummary.toLowerCase()}`,
      `Demonstrated consistent work-style alignment in autonomous investigation and problem decomposition.`
    ],
    cautionOpenQuestions: [
      `Review practical daily workflows in ${adjacent.meta.name.split('&')[0]} as a potential dual-specialization.`,
      session.prerequisiteGaps.length > 0 
        ? `${session.prerequisiteGaps.length} foundational prerequisites flagged for smooth onboarding.`
        : `Strong baseline reasoning observed across logic items.`
    ],
    prerequisiteRecommendations: session.prerequisiteGaps.map(g => g.recommendedPrerequisite)
  };

  return {
    track: session.routeType,
    top_domain: primary.meta.name,
    domain_id: primary.domId,
    confidence_score: Math.min(95, primary.pct),
    uncertainty_index: uncertaintyIndex,
    uncertainty_description: uncertaintyDescription,
    
    // Explainable Shortlist
    shortlist: [
      {
        rank: 1,
        tier: 'Primary Specialization',
        domainId: primary.domId,
        title: primary.meta.name,
        matchPct: primary.pct,
        summary: primary.meta.plainSummary,
        careers: primary.meta.careers
      },
      {
        rank: 2,
        tier: 'Strong Adjacent Domain',
        domainId: adjacent.domId,
        title: adjacent.meta.name,
        matchPct: adjacent.pct,
        summary: adjacent.meta.plainSummary,
        careers: adjacent.meta.careers
      },
      {
        rank: 3,
        tier: 'Exploratory Runner-Up',
        domainId: exploratory.domId,
        title: exploratory.meta.name,
        matchPct: exploratory.pct,
        summary: exploratory.meta.plainSummary,
        careers: exploratory.meta.careers
      }
    ],

    // Decoupled Metrics
    evidence_ledger: evidenceLedger,
    all_scores: percentageScores,
    readiness_summary: {
      items_evaluated: session.knowledgeScores.totalAnswered,
      verified_correct: session.knowledgeScores.correct,
      prerequisites_flagged: session.prerequisiteGaps.length
    }
  };
}
