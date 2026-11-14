/**
 * API Service for CSE PathFinder Adaptive Assessment
 *
 * Execution Hierarchy:
 *   Supabase -> Java / Backend REST -> LocalStorage (Offline Independent)
 *
 * Features:
 * - Full evidence history (append-only, never overwrite)
 * - Question bank shipped frontend-side for 100% offline flow
 * - Endpoints:
 *     POST /api/assess/profile
 *     GET  /api/assess/next-question
 *     POST /api/assess/answer
 *     GET  /api/assess/mastery/{email}
 *     GET  /api/assess/interests/{email}
 *     POST /api/assess/feedback
 * - Mode selection: 'supabase' | 'java' | 'localstorage' | 'auto'
 */

import bundledItemBank from '../data/adaptive/item_bank.json' with { type: 'json' };
import bundledRulesConfig from '../data/adaptive/rules_version.json' with { type: 'json' };
import bundledMappingConfig from '../data/adaptive/domain_mapping_version.json' with { type: 'json' };

import {
  startingLevel,
  diagnosticScore,
  nextQuestion,
  updateMastery,
  interestScores,
  behaviorSignals,
  domainMapping,
  storeFeedback
} from '../data/adaptive/adaptiveEngine.js';

// Memory fallback for localStorage in Node or environments without window.localStorage
class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

const storageEngine = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage : new MemoryStorage();

// Storage keys
const STORAGE_KEYS = {
  SESSIONS: 'cpath_assessment_sessions',
  ATTEMPTS: 'cpath_assessment_attempts',
  MASTERY: 'cpath_topic_mastery',
  INTERESTS: 'cpath_interest_scores',
  FEEDBACK: 'cpath_result_feedback',
  DOMAIN_ASSESSMENTS: 'cpath_domain_assessments',
  LATEST_RESULTS: 'cpath_latest_quiz_results'
};

function getStorageList(key) {
  try {
    const raw = storageEngine.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendStorageItem(key, item) {
  const list = getStorageList(key);
  list.push(item);
  storageEngine.setItem(key, JSON.stringify(list));
  return item;
}

let activeStorageMode = 'auto'; // 'supabase' | 'java' | 'localstorage' | 'auto'
let customBackendBaseUrl = null;
let customSupabaseClient = null;

export function setStorageMode(mode) {
  activeStorageMode = mode;
}

export function getStorageMode() {
  return activeStorageMode;
}

export function setBackendBaseUrl(url) {
  customBackendBaseUrl = url;
}

export function setMockSupabaseClient(client) {
  customSupabaseClient = client;
}

function getBackendUrl() {
  if (customBackendBaseUrl) return customBackendBaseUrl;
  if (typeof process !== 'undefined' && process.env?.VITE_API_URL) return process.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.includes(':5173') ? 'http://localhost:5000' : window.location.origin;
  }
  return 'http://localhost:5000';
}

function getSupabaseConfig() {
  if (customSupabaseClient) return { client: customSupabaseClient, isMock: true };
  const url = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
              (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_URL);
  const key = (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
              (typeof window !== 'undefined' && window.__ENV__?.VITE_SUPABASE_ANON_KEY);
  if (url && key) {
    return { url, key, isMock: false };
  }
  return null;
}

/**
 * Determine effective transport tier based on availability and configured mode.
 */
async function resolveTier(explicitMode = null) {
  const mode = explicitMode || activeStorageMode;
  if (mode !== 'auto') return mode;

  // 1. Supabase Tier
  const sb = getSupabaseConfig();
  if (sb) return 'supabase';

  // 2. Java / Backend Tier
  try {
    const res = await fetch(`${getBackendUrl()}/api/health`, { method: 'GET', signal: AbortSignal.timeout(1000) });
    if (res.ok) return 'java';
  } catch {
    // Backend unreachable
  }

  // 3. LocalStorage Tier (Offline)
  return 'localstorage';
}

// =========================================================================
// API HANDLERS IMPLEMENTATION
// =========================================================================

/**
 * POST /api/assess/profile
 */
export async function saveProfile(profileData, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = (profileData.student_email || '').toLowerCase().trim();
  const sessionId = profileData.session_id || `sess_${Math.random().toString(36).substring(2, 10)}`;

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.saveProfile) {
      return sb.client.saveProfile(profileData);
    }
  }

  if (tier === 'java') {
    const response = await fetch(`${getBackendUrl()}/api/assess/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profileData, session_id: sessionId, student_email: studentEmail })
    });
    if (response.ok) return await response.json();
  }

  // LocalStorage / Offline Flow
  const diag = diagnosticScore(profileData.starter_answers || [], bundledItemBank, bundledRulesConfig);
  const placements = startingLevel(profileData.intro_profile || {}, diag, bundledRulesConfig);

  const sessionRecord = {
    id: sessionId,
    student_email: studentEmail,
    intro_snapshot: profileData.intro_profile || {},
    routing_decision: {
      diagnostic: diag,
      placements,
      initial_topic: Object.keys(placements)[0] || 'python'
    },
    status: 'in_progress',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  appendStorageItem(STORAGE_KEYS.SESSIONS, sessionRecord);

  // Append initial topic_mastery records (never overwrite)
  for (const [topic, p] of Object.entries(placements)) {
    appendStorageItem(STORAGE_KEYS.MASTERY, {
      id: `mast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      session_id: sessionId,
      student_email: studentEmail,
      topic,
      level: p.level,
      confidence: 'low',
      evidence_count: 0,
      source: 'self_report',
      last_assessed_at: new Date().toISOString()
    });
  }

  return {
    status: 'success',
    tier: 'localstorage',
    session_id: sessionId,
    routing_decision: sessionRecord.routing_decision,
    topic_placements: placements
  };
}

/**
 * GET /api/assess/next-question
 */
export async function getNextQuestion(params, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = (params.email || '').toLowerCase().trim();
  const topic = params.topic || 'python';

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.getNextQuestion) {
      return sb.client.getNextQuestion(params);
    }
  }

  if (tier === 'java') {
    try {
      const url = new URL(`${getBackendUrl()}/api/assess/next-question`);
      url.searchParams.set('email', studentEmail);
      url.searchParams.set('topic', topic);
      if (params.session_id) url.searchParams.set('session_id', params.session_id);
      if (params.level !== undefined) url.searchParams.set('level', params.level);

      const response = await fetch(url.toString());
      if (response.ok) return await response.json();
    } catch {
      // Fall through to offline if Java backend fails
    }
  }

  // LocalStorage / Offline Flow with bundled question bank
  const attempts = getStorageList(STORAGE_KEYS.ATTEMPTS).filter(a => a.student_email === studentEmail);
  const askedIds = attempts.map(a => a.question_id);

  const masteryHistory = getStorageList(STORAGE_KEYS.MASTERY).filter(m => m.student_email === studentEmail && m.topic === topic);
  const latestMastery = masteryHistory.length > 0 ? masteryHistory[masteryHistory.length - 1] : null;

  const currentLevel = params.level !== undefined ? params.level : (latestMastery ? latestMastery.level : 1);

  const state = {
    topic,
    level: currentLevel,
    askedQuestionIds: askedIds,
    history: attempts,
    previousMistakes: attempts.filter(a => !a.correct)
  };

  const question = nextQuestion(state, bundledItemBank, bundledRulesConfig);

  return {
    status: question ? 'success' : 'exhausted',
    tier: 'localstorage',
    question,
    level: currentLevel,
    explainer_first: currentLevel === 0,
    assigned_difficulty: currentLevel === 0 ? 1 : Math.min(3, currentLevel)
  };
}

/**
 * POST /api/assess/answer
 */
export async function submitAnswer(answerData, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = (answerData.student_email || '').toLowerCase().trim();
  const topic = answerData.topic || 'python';
  const isDontKnow = Boolean(answerData.is_dont_know || String(answerData.answer).includes("I don't know"));
  const correct = Boolean(answerData.correct) && !isDontKnow;

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.submitAnswer) {
      return sb.client.submitAnswer(answerData);
    }
  }

  if (tier === 'java') {
    try {
      const response = await fetch(`${getBackendUrl()}/api/assess/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answerData, student_email: studentEmail, correct, is_dont_know: isDontKnow })
      });
      if (response.ok) return await response.json();
    } catch {
      // Fall through to offline
    }
  }

  // LocalStorage / Offline Flow (Append attempt and append new mastery checkpoint)
  const attemptRecord = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    session_id: answerData.session_id || 'offline_sess',
    student_email: studentEmail,
    topic,
    question_id: answerData.question_id,
    category: answerData.category || 'knowledge',
    answer: answerData.answer,
    correct,
    time_taken: answerData.time_taken || 0.0,
    bank_version: answerData.bank_version || '1.0.0',
    rules_version: answerData.rules_version || '1.0.0',
    timestamp: new Date().toISOString()
  };
  appendStorageItem(STORAGE_KEYS.ATTEMPTS, attemptRecord);

  // Retrieve prior mastery
  const masteryHistory = getStorageList(STORAGE_KEYS.MASTERY).filter(m => m.student_email === studentEmail && m.topic === topic);
  const priorMastery = masteryHistory.length > 0 ? masteryHistory[masteryHistory.length - 1] : { level: 1, evidence_count: 0 };

  const recentAttempts = getStorageList(STORAGE_KEYS.ATTEMPTS)
    .filter(a => a.student_email === studentEmail && a.topic === topic)
    .slice(-2);

  let newLevel = priorMastery.level;
  let transitionEvent = 'maintain';
  let prerequisiteGuidance = false;

  if (correct && recentAttempts.length >= 2 && recentAttempts.every(a => a.correct)) {
    if (newLevel < 4) {
      newLevel += 1;
      transitionEvent = 'promote';
    }
  } else if (!correct && recentAttempts.length >= 2 && recentAttempts.every(a => !a.correct)) {
    if (newLevel > 0) {
      newLevel -= 1;
      transitionEvent = 'demote';
      prerequisiteGuidance = true;
    }
  } else if (isDontKnow && newLevel >= 2) {
    newLevel -= 1;
    transitionEvent = 'demote';
    prerequisiteGuidance = true;
  }

  const evidenceCount = priorMastery.evidence_count + 1;
  const confidence = evidenceCount >= 4 ? 'high' : (evidenceCount >= 2 ? 'medium' : 'low');

  const newMasteryRecord = {
    id: `mast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    session_id: answerData.session_id || 'offline_sess',
    student_email: studentEmail,
    topic,
    level: newLevel,
    confidence,
    evidence_count: evidenceCount,
    source: 'assessed',
    last_assessed_at: new Date().toISOString()
  };

  // NEVER OVERWRITE: append new row
  appendStorageItem(STORAGE_KEYS.MASTERY, newMasteryRecord);

  return {
    status: 'success',
    tier: 'localstorage',
    new_level: newLevel,
    confidence,
    evidence_count: evidenceCount,
    transition_event: transitionEvent,
    prerequisite_guidance: prerequisiteGuidance
  };
}

/**
 * GET /api/assess/mastery/{email}
 */
export async function getMastery(email, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = (email || '').toLowerCase().trim();

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.getMastery) {
      return sb.client.getMastery(email);
    }
  }

  if (tier === 'java') {
    try {
      const response = await fetch(`${getBackendUrl()}/api/assess/mastery/${encodeURIComponent(studentEmail)}`);
      if (response.ok) return await response.json();
    } catch {
      // Fall through to offline
    }
  }

  // LocalStorage / Offline Flow
  const allMastery = getStorageList(STORAGE_KEYS.MASTERY).filter(m => m.student_email === studentEmail);
  const currentMastery = {};
  for (const rec of allMastery) {
    // Last entry per topic is the current latest
    currentMastery[rec.topic] = rec;
  }

  return {
    status: 'success',
    tier: 'localstorage',
    current_mastery: currentMastery,
    history: allMastery
  };
}

/**
 * GET /api/assess/interests/{email}
 */
export async function getInterests(email, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = (email || '').toLowerCase().trim();

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.getInterests) {
      return sb.client.getInterests(email);
    }
  }

  if (tier === 'java') {
    try {
      const response = await fetch(`${getBackendUrl()}/api/assess/interests/${encodeURIComponent(studentEmail)}`);
      if (response.ok) return await response.json();
    } catch {
      // Fall through to offline
    }
  }

  // LocalStorage / Offline Flow
  const allInterests = getStorageList(STORAGE_KEYS.INTERESTS).filter(i => i.student_email === studentEmail);
  return {
    status: 'success',
    tier: 'localstorage',
    latest: allInterests.length > 0 ? allInterests[allInterests.length - 1] : null,
    history: allInterests
  };
}

/**
 * POST /api/assess/feedback
 */
export async function submitFeedback(feedbackData, options = {}) {
  const tier = await resolveTier(options.mode);
  const rating = Number(feedbackData.feels_right_rating);

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.submitFeedback) {
      return sb.client.submitFeedback(feedbackData);
    }
  }

  if (tier === 'java') {
    try {
      const response = await fetch(`${getBackendUrl()}/api/assess/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      if (response.ok) return await response.json();
    } catch {
      // Fall through to offline
    }
  }

  // LocalStorage / Offline Flow
  const feedbackRecord = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    result_id: feedbackData.result_id || 'unknown',
    student_email: (feedbackData.student_email || '').toLowerCase().trim(),
    feels_right_rating: rating,
    optional_comment: feedbackData.optional_comment || '',
    timestamp: new Date().toISOString()
  };
  appendStorageItem(STORAGE_KEYS.FEEDBACK, feedbackRecord);

  return {
    status: 'success',
    tier: 'localstorage',
    message: 'Feedback recorded successfully'
  };
}

/**
 * Save full session snapshot across Supabase, Java/Backend, or LocalStorage.
 */
export async function saveSession(sessionData, options = {}) {
  const tier = await resolveTier(options.mode);
  const sessionId = sessionData.id || `sess_${Math.random().toString(36).substring(2, 10)}`;
  const record = {
    id: sessionId,
    student_email: (sessionData.student_email || '').toLowerCase().trim(),
    intro_snapshot: sessionData.intro_snapshot || {},
    routing_decision: sessionData.routing_decision || {},
    status: sessionData.status || 'in_progress',
    created_at: sessionData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.saveSession) {
      return sb.client.saveSession(record);
    }
  }

  if (tier === 'java') {
    const response = await fetch(`${getBackendUrl()}/api/assess/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (response.ok) return await response.json();
  }

  // LocalStorage (Upsert by ID without wiping prior sessions)
  const sessions = getStorageList(STORAGE_KEYS.SESSIONS);
  const existingIdx = sessions.findIndex(s => s.id === sessionId);
  if (existingIdx >= 0) {
    sessions[existingIdx] = record;
    storageEngine.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } else {
    appendStorageItem(STORAGE_KEYS.SESSIONS, record);
  }

  return {
    status: 'success',
    tier: 'localstorage',
    session_id: sessionId
  };
}

/**
 * Reload assessment session across Supabase, Java/Backend, or LocalStorage.
 */
export async function getSession(sessionId, email = null, options = {}) {
  const tier = await resolveTier(options.mode);
  const studentEmail = email ? email.toLowerCase().trim() : null;

  if (tier === 'supabase') {
    const sb = getSupabaseConfig();
    if (sb.isMock && sb.client.getSession) {
      return sb.client.getSession(sessionId, studentEmail);
    }
  }

  if (tier === 'java') {
    const response = await fetch(`${getBackendUrl()}/api/assess/session/${encodeURIComponent(sessionId)}`);
    if (response.ok) return await response.json();
  }

  // LocalStorage
  const sessions = getStorageList(STORAGE_KEYS.SESSIONS);
  const session = sessions.find(s => s.id === sessionId || (studentEmail && s.student_email === studentEmail));
  if (!session) {
    return { status: 'error', message: 'Session not found' };
  }

  const attempts = getStorageList(STORAGE_KEYS.ATTEMPTS).filter(a => a.session_id === session.id);
  const mastery = getStorageList(STORAGE_KEYS.MASTERY).filter(m => m.session_id === session.id);

  return {
    status: 'success',
    tier: 'localstorage',
    session,
    attempts,
    mastery
  };
}

/**
 * Clear test data from local storage engine.
 */
export function clearLocalStorage() {
  for (const k of Object.values(STORAGE_KEYS)) {
    storageEngine.removeItem(k);
  }
}



/**

 * Domain-Specific Assessment & Roadmap Persistence Methods

 */

export async function saveDomainAssessment(data, options = {}) {

  const tier = await resolveTier(options.mode);

  const email = (data.student_email || '').toLowerCase().trim();

  const domainId = data.domain_id;



  if (tier === 'java' || tier === 'auto') {

    try {

      const response = await fetch(getBackendUrl() + '/api/domain-assessment/save', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(data)

      });

      if (response.ok) {

        const json = await response.json();

        appendOrUpdateDomainAssessmentLocal(data);

        return json;

      }

    } catch (e) {

      console.warn('Backend saveDomainAssessment failed, using LocalStorage:', e);

    }

  }



  appendOrUpdateDomainAssessmentLocal(data);

  return { status: 'success', tier: 'localstorage', domain_id: domainId };

}



function appendOrUpdateDomainAssessmentLocal(data) {

  const list = getStorageList(STORAGE_KEYS.DOMAIN_ASSESSMENTS);

  const email = (data.student_email || '').toLowerCase().trim();

  const domainId = data.domain_id;

  const filtered = list.filter(item => !(item.student_email === email && item.domain_id === domainId));

  filtered.push({

    ...data,

    created_at: new Date().toISOString()

  });

  storageEngine.setItem(STORAGE_KEYS.DOMAIN_ASSESSMENTS, JSON.stringify(filtered));

}



export async function getDomainAssessment(email, domainId, options = {}) {

  const tier = await resolveTier(options.mode);

  const cleanEmail = (email || '').toLowerCase().trim();



  if (tier === 'java' || tier === 'auto') {

    try {

      const response = await fetch(getBackendUrl() + '/api/domain-assessment/' + encodeURIComponent(cleanEmail) + '/' + encodeURIComponent(domainId));

      if (response.ok) return await response.json();

    } catch (e) {

      console.warn('Backend getDomainAssessment failed, using LocalStorage:', e);

    }

  }



  const list = getStorageList(STORAGE_KEYS.DOMAIN_ASSESSMENTS);

  const item = list.find(d => (d.student_email === cleanEmail || cleanEmail.includes('guest')) && d.domain_id === domainId);

  if (item) {

    return {

      status: 'success',

      tier: 'localstorage',

      assessment: item

    };

  }

  return { status: 'not_found', message: 'No assessment found for domain ' + domainId };

}



export async function getAllDomainAssessments(email, options = {}) {

  const tier = await resolveTier(options.mode);

  const cleanEmail = (email || '').toLowerCase().trim();



  if (tier === 'java' || tier === 'auto') {

    try {

      const response = await fetch(getBackendUrl() + '/api/domain-assessments/' + encodeURIComponent(cleanEmail));

      if (response.ok) return await response.json();

    } catch (e) {

      console.warn('Backend getAllDomainAssessments failed, using LocalStorage:', e);

    }

  }



  const list = getStorageList(STORAGE_KEYS.DOMAIN_ASSESSMENTS);

  const matches = list.filter(d => d.student_email === cleanEmail || cleanEmail.includes('guest'));

  return {

    status: 'success',

    tier: 'localstorage',

    assessments: matches

  };

}



export async function saveDomainSelection(email, primaryDomain, secondaryDomains = [], options = {}) {

  const tier = await resolveTier(options.mode);

  const cleanEmail = (email || '').toLowerCase().trim();

  const payload = {

    student_email: cleanEmail,

    primary_domain: primaryDomain,

    secondary_domains: secondaryDomains

  };



  if (tier === 'java' || tier === 'auto') {

    try {

      const response = await fetch(getBackendUrl() + '/api/domain-selection/save', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(payload)

      });

      if (response.ok) {

        saveDomainSelectionLocal(payload);

        return await response.json();

      }

    } catch (e) {

      console.warn('Backend saveDomainSelection failed, using LocalStorage:', e);

    }

  }



  saveDomainSelectionLocal(payload);

  return { status: 'success', tier: 'localstorage', primary_domain: primaryDomain };

}



function saveDomainSelectionLocal(payload) {

  const list = getStorageList(STORAGE_KEYS.DOMAIN_SELECTIONS);

  const filtered = list.filter(s => s.student_email !== payload.student_email);

  filtered.push({

    ...payload,

    updated_at: new Date().toISOString()

  });

  storageEngine.setItem(STORAGE_KEYS.DOMAIN_SELECTIONS, JSON.stringify(filtered));

}



export async function getDomainSelection(email, options = {}) {

  const tier = await resolveTier(options.mode);

  const cleanEmail = (email || '').toLowerCase().trim();



  if (tier === 'java' || tier === 'auto') {

    try {

      const response = await fetch(getBackendUrl() + '/api/domain-selection/' + encodeURIComponent(cleanEmail));

      if (response.ok) return await response.json();

    } catch (e) {

      console.warn('Backend getDomainSelection failed, using LocalStorage:', e);

    }

  }



  const list = getStorageList(STORAGE_KEYS.DOMAIN_SELECTIONS);

  const match = list.find(s => s.student_email === cleanEmail || cleanEmail.includes('guest'));

  if (match) {

    return {

      status: 'success',

      tier: 'localstorage',

      selection: match

    };

  }

  return { status: 'not_found', message: 'No domain selection found' };

}

const OFFLINE_DOMAIN_FALLBACKS = {
  ai: {
    domain_label: 'AI/ML/DL',
    top_predictions: [
      { domain_label: 'AI/ML/DL', canonical_domain_id: 'ai', confidence_pct: 68.4 },
      { domain_label: 'Data Science', canonical_domain_id: 'data', confidence_pct: 19.2 },
      { domain_label: 'Software Engineering', canonical_domain_id: 'web', confidence_pct: 8.1 }
    ],
    market_insights: {
      total_openings: 6591,
      fresher_friendly_count: 1536,
      fresher_friendly_ratio_pct: 23.3,
      median_salary_lpa: 15.0,
      salary_range_lpa: '₹10.0 – ₹25.0 LPA',
      top_hiring_hubs: [
        { city: 'Remote', count: 839 },
        { city: 'Noida', count: 802 },
        { city: 'Mumbai', count: 783 },
        { city: 'Bangalore', count: 772 },
        { city: 'Chennai', count: 747 }
      ]
    },
    benchmark_skills: ['Python', 'Machine Learning', 'Artificial Intelligence', 'Generative AI', 'NLP', 'TensorFlow', 'PyTorch', 'SQL', 'Deep Learning', 'Scikit-learn', 'Pandas', 'AWS', 'Docker', 'Git', 'REST API'],
    job_listings: [
      { job_title: 'Applied ML Engineer (Fresher / Junior)', company_name: 'FinTech Labs India', primary_city: 'Bangalore', salary_display: '₹12.0 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' },
      { job_title: 'Junior Machine Learning Engineer', company_name: 'Analytics India Corp', primary_city: 'Hyderabad', salary_display: '₹9.5 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' }
    ]
  },
  data: {
    domain_label: 'Data Science',
    top_predictions: [
      { domain_label: 'Data Science', canonical_domain_id: 'data', confidence_pct: 64.5 },
      { domain_label: 'Business Intelligence', canonical_domain_id: 'data', confidence_pct: 21.0 },
      { domain_label: 'AI/ML/DL', canonical_domain_id: 'ai', confidence_pct: 10.4 }
    ],
    market_insights: {
      total_openings: 2936,
      fresher_friendly_count: 591,
      fresher_friendly_ratio_pct: 20.1,
      median_salary_lpa: 7.6,
      salary_range_lpa: '₹5.7 – ₹14.0 LPA',
      top_hiring_hubs: [
        { city: 'Bangalore', count: 817 },
        { city: 'Mumbai', count: 793 },
        { city: 'Noida', count: 159 },
        { city: 'Hyderabad', count: 146 },
        { city: 'Chennai', count: 132 }
      ]
    },
    benchmark_skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'NumPy', 'Scikit-learn', 'ETL', 'AWS', 'Spark', 'Git'],
    job_listings: [
      { job_title: 'Junior Data Scientist', company_name: 'Decision Science Labs', primary_city: 'Bangalore', salary_display: '₹8.5 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' },
      { job_title: 'Data Analyst (Entry Level)', company_name: 'FinServe Tech', primary_city: 'Mumbai', salary_display: '₹6.5 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' }
    ]
  },
  web: {
    domain_label: 'Software Engineering',
    top_predictions: [
      { domain_label: 'Software Engineering', canonical_domain_id: 'web', confidence_pct: 71.2 },
      { domain_label: 'Product Management', canonical_domain_id: 'web', confidence_pct: 15.8 },
      { domain_label: 'Cloud & DevOps', canonical_domain_id: 'cloud', confidence_pct: 8.5 }
    ],
    market_insights: {
      total_openings: 1646,
      fresher_friendly_count: 342,
      fresher_friendly_ratio_pct: 20.8,
      median_salary_lpa: 8.2,
      salary_range_lpa: '₹4.8 – ₹14.5 LPA',
      top_hiring_hubs: [
        { city: 'Bangalore', count: 520 },
        { city: 'Hyderabad', count: 290 },
        { city: 'Pune', count: 245 },
        { city: 'Mumbai', count: 210 },
        { city: 'Gurgaon', count: 185 }
      ]
    },
    benchmark_skills: ['JavaScript', 'React', 'SQL', 'Java', 'Python', 'TypeScript', 'Node.js', 'REST API', 'Git', 'HTML/CSS', 'Docker', 'AWS', 'Agile', 'Microservices', 'PostgreSQL'],
    job_listings: [
      { job_title: 'Associate Software Engineer (React / Node)', company_name: 'CloudScale India', primary_city: 'Bangalore', salary_display: '₹8.0 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.glassdoor.co.in' },
      { job_title: 'Full Stack Developer - Fresher', company_name: 'ProductCraft Labs', primary_city: 'Pune', salary_display: '₹6.5 LPA', is_fresher_friendly: true, experience_raw: '0-1 Yrs', job_url: 'https://www.glassdoor.co.in' }
    ]
  },
  security: {
    domain_label: 'Cyber Security',
    top_predictions: [
      { domain_label: 'Cyber Security', canonical_domain_id: 'security', confidence_pct: 74.0 },
      { domain_label: 'Information Technology', canonical_domain_id: 'systems', confidence_pct: 14.5 },
      { domain_label: 'Cloud & DevOps', canonical_domain_id: 'cloud', confidence_pct: 7.2 }
    ],
    market_insights: {
      total_openings: 849,
      fresher_friendly_count: 165,
      fresher_friendly_ratio_pct: 19.4,
      median_salary_lpa: 7.5,
      salary_range_lpa: '₹4.5 – ₹13.0 LPA',
      top_hiring_hubs: [
        { city: 'Bangalore', count: 270 },
        { city: 'Mumbai', count: 155 },
        { city: 'Pune', count: 130 },
        { city: 'Hyderabad', count: 120 },
        { city: 'Chennai', count: 95 }
      ]
    },
    benchmark_skills: ['Cybersecurity', 'Network Security', 'SIEM', 'Linux', 'Python', 'OWASP', 'Firewalls', 'IAM', 'Cryptography', 'TCP/IP', 'AWS', 'Vulnerability Assessment', 'SOC', 'Networking', 'Git'],
    job_listings: [
      { job_title: 'SOC Analyst (Entry Level)', company_name: 'SecOps Defense India', primary_city: 'Bangalore', salary_display: '₹6.2 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.glassdoor.co.in' },
      { job_title: 'Junior Cybersecurity Engineer', company_name: 'TrustShield Systems', primary_city: 'Hyderabad', salary_display: '₹7.5 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.glassdoor.co.in' }
    ]
  },
  cloud: {
    domain_label: 'Cloud & DevOps',
    top_predictions: [
      { domain_label: 'Cloud & DevOps', canonical_domain_id: 'cloud', confidence_pct: 72.5 },
      { domain_label: 'Information Technology', canonical_domain_id: 'systems', confidence_pct: 16.0 },
      { domain_label: 'Software Engineering', canonical_domain_id: 'web', confidence_pct: 8.0 }
    ],
    market_insights: {
      total_openings: 2344,
      fresher_friendly_count: 410,
      fresher_friendly_ratio_pct: 17.5,
      median_salary_lpa: 11.0,
      salary_range_lpa: '₹6.5 – ₹18.0 LPA',
      top_hiring_hubs: [
        { city: 'Bangalore', count: 640 },
        { city: 'Hyderabad', count: 380 },
        { city: 'Pune', count: 350 },
        { city: 'Mumbai', count: 320 },
        { city: 'Chennai', count: 290 }
      ]
    },
    benchmark_skills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform', 'CI/CD', 'Python', 'Azure', 'GCP', 'Git', 'SQL', 'Networking', 'Microservices', 'Agile', 'PostgreSQL'],
    job_listings: [
      { job_title: 'Junior Cloud & DevOps Engineer', company_name: 'InfraGrid India', primary_city: 'Bangalore', salary_display: '₹8.5 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' },
      { job_title: 'Associate Site Reliability Engineer', company_name: 'PlatformOps Solutions', primary_city: 'Pune', salary_display: '₹7.8 LPA', is_fresher_friendly: true, experience_raw: '0-2 Yrs', job_url: 'https://www.naukri.com' }
    ]
  }
};

const SKILL_ALIAS_MAP = {
  python: 'Python',
  py: 'Python',
  sql: 'SQL',
  java: 'Java',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  react: 'React',
  'react.js': 'React',
  reactjs: 'React',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  node: 'Node.js',
  'c++': 'C++',
  aws: 'AWS',
  'amazon web services': 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  'google cloud': 'GCP',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  k8s: 'Kubernetes',
  terraform: 'Terraform',
  linux: 'Linux',
  unix: 'Linux',
  git: 'Git',
  github: 'Git',
  'ci/cd': 'CI/CD',
  jenkins: 'CI/CD',
  'rest api': 'REST API',
  'restful api': 'REST API',
  microservices: 'Microservices',
  'machine learning': 'Machine Learning',
  ml: 'Machine Learning',
  'deep learning': 'Deep Learning',
  dl: 'Deep Learning',
  dsa: 'Data Structures & Algorithms',
  tensorflow: 'TensorFlow',
  pytorch: 'PyTorch',
  'generative ai': 'Generative AI',
  genai: 'Generative AI',
  llm: 'Generative AI',
  nlp: 'NLP',
  'natural language processing': 'NLP',
  'data analysis': 'Data Analysis',
  'data analytics': 'Data Analytics',
  'data visualization': 'Data Visualization',
  'power bi': 'Power BI',
  powerbi: 'Power BI',
  tableau: 'Tableau',
  excel: 'Excel',
  pandas: 'Pandas',
  numpy: 'NumPy',
  'scikit-learn': 'Scikit-learn',
  sklearn: 'Scikit-learn',
  spark: 'Spark',
  pyspark: 'PySpark',
  etl: 'ETL',
  snowflake: 'Snowflake',
  mongodb: 'MongoDB',
  nosql: 'NoSQL',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  cybersecurity: 'Cybersecurity',
  'cyber security': 'Cybersecurity',
  'information security': 'Cybersecurity',
  'network security': 'Network Security',
  firewalls: 'Firewalls',
  siem: 'SIEM',
  soc: 'SOC',
  iam: 'IAM',
  owasp: 'OWASP',
  'penetration testing': 'Penetration Testing',
  vulnerability: 'Vulnerability Assessment',
  cryptography: 'Cryptography',
  'tcp/ip': 'TCP/IP',
  networking: 'Networking',
  agile: 'Agile',
  scrum: 'Scrum',
  jira: 'Jira',
  figma: 'Figma',
  roadmap: 'Product Roadmap',
  itil: 'ITIL',
  html: 'HTML/CSS',
  css: 'HTML/CSS',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  'spring boot': 'Spring Boot',
  springboot: 'Spring Boot',
};

function tokenizeSkillWords(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .split(/[\s,&-]+/)
    .filter(Boolean);
}

function matchSkillsAgainstBenchmarks(lowerInputs, benchmarkSkills) {
  const studentCanonSet = new Set();
  const studentEntryTokenSets = [];

  lowerInputs.forEach((rawInput) => {
    const low = String(rawInput || '').trim().toLowerCase();
    if (!low) return;
    studentCanonSet.add(low);
    const tokenSet = new Set(tokenizeSkillWords(low));
    const canon = SKILL_ALIAS_MAP[low]?.toLowerCase();
    if (canon) {
      studentCanonSet.add(canon);
      tokenizeSkillWords(canon).forEach((t) => tokenSet.add(t));
    }
    studentEntryTokenSets.push(tokenSet);
  });

  const matched = [];
  const missing = [];

  benchmarkSkills.forEach((sk) => {
    const req = String(sk || '').trim().toLowerCase();
    const reqCanon = SKILL_ALIAS_MAP[req]?.toLowerCase();

    let isMatch =
      studentCanonSet.has(req) || Boolean(reqCanon && studentCanonSet.has(reqCanon));

    if (!isMatch && req.includes('/')) {
      const parts = req
        .split('/')
        .map((p) => p.trim())
        .filter(Boolean);
      isMatch = parts.some(
        (part) =>
          studentCanonSet.has(part) ||
          studentEntryTokenSets.some((tSet) => tSet.has(part))
      );
    }

    if (!isMatch) {
      const reqTokens = tokenizeSkillWords(req);
      isMatch =
        reqTokens.length > 0 &&
        studentEntryTokenSets.some((tSet) => reqTokens.every((t) => tSet.has(t)));
    }

    if (isMatch) matched.push(sk);
    else missing.push(sk);
  });

  return { matched, missing };
}

function buildOfflinePrediction(skillsText, preferredDomain = 'ai', options = {}) {
  const forcePreferredPrimary = Boolean(options.forcePreferredPrimary);
  const fallbackKey = OFFLINE_DOMAIN_FALLBACKS[preferredDomain] ? preferredDomain : 'ai';
  const inputSkills = String(skillsText || '')
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const lowerInputs = inputSkills.map((s) => s.toLowerCase());

  const scoredDomains = Object.entries(OFFLINE_DOMAIN_FALLBACKS).map(([key, entry]) => {
    const { matched, missing } = matchSkillsAgainstBenchmarks(lowerInputs, entry.benchmark_skills);
    let weightedScore = 0;
    matched.forEach((sk) => {
      const idx = entry.benchmark_skills.indexOf(sk);
      weightedScore += 1 + Math.max(0, 15 - idx) * 0.08;
    });
    if (key === fallbackKey) weightedScore += 0.25;
    return {
      key,
      entry,
      matched,
      missing,
      rawScore: weightedScore,
      matchCount: matched.length,
    };
  });

  const hasAnyMatches = scoredDomains.some((d) => d.matchCount > 0);
  const rankedDomains = [...scoredDomains].sort((a, b) => b.rawScore - a.rawScore);

  const primaryItem =
    forcePreferredPrimary || !hasAnyMatches
      ? scoredDomains.find((d) => d.key === fallbackKey) || rankedDomains[0]
      : rankedDomains[0];

  const topPredictions =
    !forcePreferredPrimary && hasAnyMatches
      ? (() => {
          const top3 = rankedDomains.slice(0, 3);
          const total = top3.reduce((acc, item) => acc + Math.max(item.rawScore, 0.4), 0);
          return top3.map((item) => ({
            domain_label: item.entry.domain_label,
            canonical_domain_id: item.key,
            confidence_pct: Number(((Math.max(item.rawScore, 0.4) / total) * 100).toFixed(1)),
          }));
        })()
      : primaryItem.entry.top_predictions;

  const base = primaryItem.entry;
  const { matched, missing } = primaryItem;
  let readiness = Math.round((matched.length / base.benchmark_skills.length) * 100);
  if (inputSkills.length > 0 && readiness === 0) readiness = 10;

  return {
    status: 'success',
    source: 'offline_fallback',
    input_skills: inputSkills,
    primary_domain: base.domain_label,
    domain_label: base.domain_label,
    canonical_domain_id: primaryItem.key,
    top_predictions: topPredictions,
    market_insights: base.market_insights,
    skill_gap: {
      readiness_score_pct: Math.min(100, readiness),
      matched_count: matched.length,
      total_benchmark_skills: base.benchmark_skills.length,
      matched_skills: matched,
      missing_skills_top3: missing.slice(0, 3),
      top_15_domain_skills: base.benchmark_skills.map((skill, i) => ({
        skill,
        mentions: 500 - i * 25,
        demand_pct: Math.max(10, 65 - i * 3),
      })),
    },
    job_listings: base.job_listings,
  };
}

/**
 * Run ML domain prediction and Indian tech job market analysis via /api/predict-domain.
 */
export async function predictDomainAndMarket({ skills = '', preferredDomain = 'ai' } = {}) {
  try {
    const response = await fetch(getBackendUrl() + '/api/predict-domain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skills,
        preferred_domain: preferredDomain,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        return { ...data, source: 'ml_backend' };
      }
    }
  } catch (e) {
    console.warn('Backend predict-domain unavailable, using offline market snapshot:', e);
  }
  return buildOfflinePrediction(skills, preferredDomain);
}

/**
 * Fetch 2026 Indian job market insights and listings for a specific domain ID.
 */
export async function getDomainMarketInsights(domainId, skills = '') {
  const cleanId = String(domainId || 'ai').trim().toLowerCase();
  try {
    const url = new URL(`${getBackendUrl()}/api/market-insights/${encodeURIComponent(cleanId)}`);
    if (skills && String(skills).trim()) {
      url.searchParams.set('skills', String(skills).trim());
    }
    const response = await fetch(url.toString());
    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        return { ...data, source: 'ml_backend' };
      }
    }
  } catch (e) {
    console.warn('Backend market-insights unavailable, using offline snapshot:', e);
  }
  return buildOfflinePrediction(skills, cleanId, { forcePreferredPrimary: true });
}


