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
  FEEDBACK: 'cpath_result_feedback'
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
