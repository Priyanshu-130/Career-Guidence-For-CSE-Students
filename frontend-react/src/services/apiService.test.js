import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

import {
  saveProfile,
  getNextQuestion,
  submitAnswer,
  getMastery,
  getInterests,
  submitFeedback,
  saveSession,
  getSession,
  setStorageMode,
  setBackendBaseUrl,
  setMockSupabaseClient,
  clearLocalStorage
} from './apiService.js';

// =========================================================================
// SETUP TEST BACKEND SERVER FOR JAVA / REST API MODE
// =========================================================================

let backendServer = null;
let backendPort = null;
const backendDatabase = {
  sessions: new Map(),
  attempts: [],
  mastery: [],
  feedback: []
};

function startTestBackend() {
  return new Promise((resolve) => {
    backendServer = http.createServer((req, res) => {
      const url = new URL(req.url, `http://127.0.0.1:${backendPort}`);
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        let body = {};
        try { if (bodyStr) body = JSON.parse(bodyStr); } catch {}

        res.setHeader('Content-Type', 'application/json');

        // Health
        if (req.method === 'GET' && url.pathname === '/api/health') {
          res.writeHead(200);
          return res.end(JSON.stringify({ status: 'ok', message: 'Backend running' }));
        }

        // POST /api/assess/session
        if (req.method === 'POST' && url.pathname === '/api/assess/session') {
          backendDatabase.sessions.set(body.id, body);
          res.writeHead(200);
          return res.end(JSON.stringify({ status: 'success', session_id: body.id }));
        }

        // GET /api/assess/session/:id
        if (req.method === 'GET' && url.pathname.startsWith('/api/assess/session/')) {
          const id = decodeURIComponent(url.pathname.replace('/api/assess/session/', ''));
          const session = backendDatabase.sessions.get(id);
          if (session) {
            res.writeHead(200);
            return res.end(JSON.stringify({
              status: 'success',
              session,
              attempts: backendDatabase.attempts.filter(a => a.session_id === id),
              mastery: backendDatabase.mastery.filter(m => m.session_id === id)
            }));
          } else {
            res.writeHead(404);
            return res.end(JSON.stringify({ status: 'error', message: 'Session not found' }));
          }
        }

        // POST /api/assess/profile
        if (req.method === 'POST' && url.pathname === '/api/assess/profile') {
          const sessionId = body.session_id || `sess_srv_${Date.now()}`;
          backendDatabase.sessions.set(sessionId, {
            id: sessionId,
            student_email: body.student_email,
            intro_snapshot: body.intro_profile || {},
            routing_decision: { initial_topic: 'python' },
            status: 'in_progress'
          });
          res.writeHead(201);
          return res.end(JSON.stringify({ status: 'success', session_id: sessionId }));
        }

        // POST /api/assess/answer
        if (req.method === 'POST' && url.pathname === '/api/assess/answer') {
          // Append attempt (never overwrite)
          backendDatabase.attempts.push(body);
          // Append mastery (never overwrite)
          const newMastery = {
            session_id: body.session_id,
            student_email: body.student_email,
            topic: body.topic,
            level: body.correct ? 2 : 1,
            confidence: 'medium',
            evidence_count: backendDatabase.attempts.length,
            source: 'assessed',
            last_assessed_at: new Date().toISOString()
          };
          backendDatabase.mastery.push(newMastery);
          res.writeHead(200);
          return res.end(JSON.stringify({ status: 'success', new_level: newMastery.level, confidence: 'medium' }));
        }

        // GET /api/assess/mastery/:email
        if (req.method === 'GET' && url.pathname.startsWith('/api/assess/mastery/')) {
          const email = decodeURIComponent(url.pathname.replace('/api/assess/mastery/', ''));
          const userMastery = backendDatabase.mastery.filter(m => m.student_email === email);
          res.writeHead(200);
          return res.end(JSON.stringify({ status: 'success', history: userMastery }));
        }

        // POST /api/assess/feedback
        if (req.method === 'POST' && url.pathname === '/api/assess/feedback') {
          backendDatabase.feedback.push(body);
          res.writeHead(200);
          return res.end(JSON.stringify({ status: 'success', message: 'Feedback saved' }));
        }

        res.writeHead(404);
        res.end(JSON.stringify({ status: 'error', message: 'Route not found' }));
      });
    });

    backendServer.listen(0, '127.0.0.1', () => {
      backendPort = backendServer.address().port;
      setBackendBaseUrl(`http://127.0.0.1:${backendPort}`);
      resolve();
    });
  });
}

function stopTestBackend() {
  return new Promise(resolve => {
    if (backendServer) backendServer.close(resolve);
    else resolve();
  });
}

// =========================================================================
// MOCK SUPABASE CLIENT FOR SUPABASE TIER
// =========================================================================

const supabaseDatabase = {
  sessions: new Map(),
  attempts: [],
  mastery: [],
  feedback: []
};

const mockSupabaseClient = {
  saveSession: async (session) => {
    supabaseDatabase.sessions.set(session.id, session);
    return { status: 'success', tier: 'supabase', session_id: session.id };
  },
  getSession: async (sessionId, studentEmail) => {
    const session = supabaseDatabase.sessions.get(sessionId);
    if (!session) return { status: 'error', message: 'Session not found' };
    return {
      status: 'success',
      tier: 'supabase',
      session,
      attempts: supabaseDatabase.attempts.filter(a => a.session_id === sessionId),
      mastery: supabaseDatabase.mastery.filter(m => m.session_id === sessionId)
    };
  },
  saveProfile: async (profileData) => {
    const sessionId = profileData.session_id || `sess_sb_${Date.now()}`;
    const session = {
      id: sessionId,
      student_email: profileData.student_email,
      intro_snapshot: profileData.intro_profile,
      routing_decision: { tier: 'supabase' },
      status: 'in_progress'
    };
    supabaseDatabase.sessions.set(sessionId, session);
    return { status: 'success', tier: 'supabase', session_id: sessionId };
  },
  submitAnswer: async (ans) => {
    supabaseDatabase.attempts.push(ans);
    return { status: 'success', tier: 'supabase', new_level: 2, confidence: 'medium' };
  },
  getMastery: async (email) => {
    const history = supabaseDatabase.mastery.filter(m => m.student_email === email);
    return { status: 'success', tier: 'supabase', history };
  },
  submitFeedback: async (fb) => {
    supabaseDatabase.feedback.push(fb);
    return { status: 'success', tier: 'supabase', message: 'Feedback recorded' };
  }
};

setMockSupabaseClient(mockSupabaseClient);

// =========================================================================
// TEST SUITE: SAVE & RELOAD IN ALL THREE MODES
// =========================================================================

test.before(async () => {
  await startTestBackend();
});

test.after(async () => {
  await stopTestBackend();
});

test('Session Save and Reload in Mode 1: LocalStorage (Offline Independent)', async () => {
  clearLocalStorage();

  const testSession = {
    id: 'sess_local_101',
    student_email: 'offline_student@college.edu',
    intro_snapshot: { python: 'basic', java: 'none' },
    routing_decision: { start_topic: 'python', initial_difficulty: 2 },
    status: 'in_progress'
  };

  // 1. Save Session in LocalStorage mode
  const saveRes = await saveSession(testSession, { mode: 'localstorage' });
  assert.equal(saveRes.status, 'success');
  assert.equal(saveRes.tier, 'localstorage');
  assert.equal(saveRes.session_id, 'sess_local_101');

  // 2. Reload Session from LocalStorage mode
  const reloadRes = await getSession('sess_local_101', 'offline_student@college.edu', { mode: 'localstorage' });
  assert.equal(reloadRes.status, 'success');
  assert.equal(reloadRes.tier, 'localstorage');
  assert.equal(reloadRes.session.id, 'sess_local_101');
  assert.equal(reloadRes.session.student_email, 'offline_student@college.edu');
  assert.equal(reloadRes.session.intro_snapshot.python, 'basic');
  assert.ok(Array.isArray(reloadRes.attempts));
  assert.ok(Array.isArray(reloadRes.mastery));
});

test('Session Save and Reload in Mode 2: Java / REST Backend API', async () => {
  const testSession = {
    id: 'sess_java_202',
    student_email: 'backend_student@college.edu',
    intro_snapshot: { python: 'intermediate', sql: 'basic' },
    routing_decision: { start_topic: 'python', initial_difficulty: 3 },
    status: 'in_progress'
  };

  // 1. Save Session via Java / REST Backend
  const saveRes = await saveSession(testSession, { mode: 'java' });
  assert.equal(saveRes.status, 'success');
  assert.equal(saveRes.session_id, 'sess_java_202');

  // 2. Reload Session via Java / REST Backend
  const reloadRes = await getSession('sess_java_202', 'backend_student@college.edu', { mode: 'java' });
  assert.equal(reloadRes.status, 'success');
  assert.equal(reloadRes.session.id, 'sess_java_202');
  assert.equal(reloadRes.session.student_email, 'backend_student@college.edu');
  assert.equal(reloadRes.session.intro_snapshot.python, 'intermediate');
});

test('Session Save and Reload in Mode 3: Supabase Cloud Tier', async () => {
  const testSession = {
    id: 'sess_sb_303',
    student_email: 'cloud_student@college.edu',
    intro_snapshot: { python: 'advanced', web: 'basic' },
    routing_decision: { start_topic: 'python', initial_difficulty: 4 },
    status: 'in_progress'
  };

  // 1. Save Session in Supabase mode
  const saveRes = await saveSession(testSession, { mode: 'supabase' });
  assert.equal(saveRes.status, 'success');
  assert.equal(saveRes.tier, 'supabase');
  assert.equal(saveRes.session_id, 'sess_sb_303');

  // 2. Reload Session in Supabase mode
  const reloadRes = await getSession('sess_sb_303', 'cloud_student@college.edu', { mode: 'supabase' });
  assert.equal(reloadRes.status, 'success');
  assert.equal(reloadRes.tier, 'supabase');
  assert.equal(reloadRes.session.id, 'sess_sb_303');
  assert.equal(reloadRes.session.student_email, 'cloud_student@college.edu');
  assert.equal(reloadRes.session.intro_snapshot.python, 'advanced');
});

test('Question bank is bundled frontend-side for full offline flow', async () => {
  clearLocalStorage();

  // Test that getNextQuestion works completely offline with bundled item bank
  const nextQRes = await getNextQuestion({
    email: 'offline_user@test.org',
    topic: 'python',
    level: 1
  }, { mode: 'localstorage' });

  assert.equal(nextQRes.status, 'success');
  assert.equal(nextQRes.tier, 'localstorage');
  assert.ok(nextQRes.question, 'Must retrieve question from local bundled bank');
  assert.equal(nextQRes.question.topic, 'python');
  assert.ok(nextQRes.question.options.length >= 2);
});

test('Full evidence history is append-only and never overwrites prior records', async () => {
  clearLocalStorage();
  const email = 'audit_student@college.edu';
  const sessionId = 'sess_audit_404';

  // Attempt 1: First answer
  await submitAnswer({
    session_id: sessionId,
    student_email: email,
    topic: 'python',
    question_id: 'py_k_01',
    correct: true,
    time_taken: 15.0
  }, { mode: 'localstorage' });

  // Attempt 2: Second answer
  await submitAnswer({
    session_id: sessionId,
    student_email: email,
    topic: 'python',
    question_id: 'py_k_02',
    correct: true,
    time_taken: 12.0
  }, { mode: 'localstorage' });

  // Attempt 3: Third answer (wrong)
  await submitAnswer({
    session_id: sessionId,
    student_email: email,
    topic: 'python',
    question_id: 'py_k_03',
    correct: false,
    time_taken: 28.0
  }, { mode: 'localstorage' });

  // Fetch full mastery audit log
  const masteryRes = await getMastery(email, { mode: 'localstorage' });
  assert.equal(masteryRes.status, 'success');

  // Verify full history has preserved all 3 checkpoints (NEVER OVERWRITTEN)
  assert.equal(masteryRes.history.length, 3, 'Must maintain full append-only audit trail');
  assert.equal(masteryRes.history[0].evidence_count, 1);
  assert.equal(masteryRes.history[1].evidence_count, 2);
  assert.equal(masteryRes.history[2].evidence_count, 3);

  // Latest snapshot reflects current level
  assert.ok(masteryRes.current_mastery.python);
  assert.equal(masteryRes.current_mastery.python.evidence_count, 3);
});

test('Feedback collection stores 1-5 rating without data loss', async () => {
  clearLocalStorage();

  const feedbackRes = await submitFeedback({
    result_id: 'res_999',
    student_email: 'feedback_user@college.edu',
    feels_right_rating: 5,
    optional_comment: 'Accurately matched my interests'
  }, { mode: 'localstorage' });

  assert.equal(feedbackRes.status, 'success');
  assert.equal(feedbackRes.tier, 'localstorage');

  // Invalid rating rejection
  await assert.rejects(async () => {
    await submitFeedback({
      result_id: 'res_999',
      student_email: 'feedback_user@college.edu',
      feels_right_rating: 0 // out of bounds
    }, { mode: 'localstorage' });
  }, /Rating must be between 1 and 5/);
});
