import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

import {
  saveProfile,
  getNextQuestion,
  submitAnswer,
  getMastery,
  submitFeedback,
  saveSession,
  getSession,
  clearLocalStorage
} from '../services/apiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rulesConfig = JSON.parse(
  readFileSync(join(__dirname, '../data/adaptive/rules_version.json'), 'utf-8')
);

const domainMappingConfig = JSON.parse(
  readFileSync(join(__dirname, '../data/adaptive/domain_mapping_version.json'), 'utf-8')
);

const itemBank = JSON.parse(
  readFileSync(join(__dirname, '../data/adaptive/item_bank.json'), 'utf-8')
);

// =========================================================================
// PHASE 4 END-TO-END FLOW TESTS
// =========================================================================

test('E2E Flow 1: Fresh student with zero knowledge', async () => {
  clearLocalStorage();
  const studentEmail = 'fresh_zero_student@college.edu';
  const sessionId = 'sess_e2e_fresh_01';

  // Step 1: Intro Profile Submission (Behavior-based: zero code, no languages seen)
  const introProfile = {
    codingExperience: 'none',
    seenLanguages: ['none'],
    thingsBuilt: ['Nothing yet — starting completely fresh!'],
    enjoyedSubjects: ['Art & Visual design'],
    toolsUsed: ['None yet'],
    topics: {
      python: 'none',
      sql: 'none',
      java: 'none'
    }
  };

  const initialSave = await saveProfile({
    session_id: sessionId,
    student_email: studentEmail,
    intro_profile: introProfile,
    starter_answers: []
  }, { mode: 'localstorage' });

  assert.equal(initialSave.status, 'success');
  assert.equal(initialSave.session_id, sessionId);

  // Step 2: Starter Diagnostic with weak logic (or zero exposure)
  const starterAnswers = [
    { questionId: 'diag_logic_comp_001', category: 'logic', isCorrect: false },
    { questionId: 'diag_pattern_002', category: 'logic', isCorrect: false },
    { questionId: 'diag_loop_rec_004', category: 'logic', isCorrect: true },
    { questionId: 'diag_step_order_005', category: 'logic', isCorrect: false }
  ];

  const diagResult = diagnosticScore(starterAnswers, itemBank, rulesConfig);
  assert.equal(diagResult.category, 'weak_logic');
  assert.equal(diagResult.recommendedStartingLevelForZeroExposure, 0);

  // Derive starting level with diagnostic
  const placements = startingLevel(introProfile.topics, diagResult, rulesConfig);
  assert.equal(placements.python.level, 0, 'Zero exposure + weak logic starts at Level 0 (explainer-first)');
  assert.equal(placements.python.source, 'self_report');
  assert.equal(placements.python.confidence, 'low');

  // Step 3: Ladder Runner at Level 0
  const q1Res = await getNextQuestion({
    email: studentEmail,
    topic: 'python',
    level: 0,
    session_id: sessionId
  }, { mode: 'localstorage' });

  assert.equal(q1Res.status, 'success');
  assert.equal(q1Res.explainer_first, true, 'Level 0 must activate explainer-first');
  assert.equal(q1Res.assigned_difficulty, 1);
  assert.ok(q1Res.question);

  // Student answers with "I don't know / haven't learned this yet"
  const ans1Res = await submitAnswer({
    session_id: sessionId,
    student_email: studentEmail,
    topic: 'python',
    question_id: q1Res.question.id,
    category: q1Res.question.category || 'knowledge',
    answer: "I don't know / haven't learned this yet",
    is_dont_know: true,
    correct: false,
    time_taken: 8.5
  }, { mode: 'localstorage' });

  assert.equal(ans1Res.status, 'success');
  assert.equal(ans1Res.new_level, 0, 'Does not drop below 0');

  // Next Question
  const q2Res = await getNextQuestion({
    email: studentEmail,
    topic: 'python',
    level: 0,
    session_id: sessionId
  }, { mode: 'localstorage' });

  assert.ok(q2Res.question);
  assert.notEqual(q2Res.question.id, q1Res.question.id, 'Must not repeat question');

  // Step 4: Summary & Interest Hypothesis
  const answersHistory = [
    { category: 'interest', riasec: 'A', selectedAnswer: 'Strongly Like (5)', selectedOptionScore: 5 },
    { category: 'interest', riasec: 'S', selectedAnswer: 'Like (4)', selectedOptionScore: 4 },
    { category: 'interest', riasec: 'R', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 },
    { category: 'interest', riasec: 'I', selectedAnswer: 'Unsure / Neutral (3)', selectedOptionScore: 3 },
    { category: 'interest', riasec: 'E', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 },
    { category: 'interest', riasec: 'C', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 }
  ];

  const riasec = interestScores(answersHistory);
  const behaviorAdj = behaviorSignals({ voluntaryRetries: 0 }, rulesConfig);
  const hypothesis = domainMapping(riasec, behaviorAdj, domainMappingConfig);

  assert.equal(hypothesis.mapping_version, 'hypothesis v1');
  assert.equal(hypothesis.singleVerdict, false);
  assert.equal(hypothesis.top3Domains.length, 3);
  assert.ok(hypothesis.note.includes('starting hypothesis based on your answers; it adjusts as you explore'));

  // High Artistic & Social yields Web / App / Design in top recommendations
  const domainKeys = hypothesis.top3Domains.map(d => d.key);
  assert.ok(domainKeys.includes('web_app_game') || domainKeys.includes('data_science') || domainKeys.includes('cloud_computing'));

  // Submit Feedback control: "Does this feel right? (1-5)"
  const feedbackRes = await submitFeedback({
    result_id: sessionId,
    student_email: studentEmail,
    feels_right_rating: 4,
    optional_comment: 'Good match for someone with design interest and no prior coding.'
  }, { mode: 'localstorage' });

  assert.equal(feedbackRes.status, 'success');

  // Verify reload
  const reloadedSession = await getSession(sessionId, studentEmail, { mode: 'localstorage' });
  assert.equal(reloadedSession.status, 'success');
  assert.equal(reloadedSession.session.student_email, studentEmail);
  assert.ok(reloadedSession.attempts.length >= 1);
});

test('E2E Flow 2: Student with Python experience', async () => {
  clearLocalStorage();
  const studentEmail = 'python_pro_student@college.edu';
  const sessionId = 'sess_e2e_python_02';

  // Step 1: Intro Profile Submission (Has written code, knows Python, built automation bot)
  const introProfile = {
    codingExperience: 'intermediate',
    seenLanguages: ['python'],
    thingsBuilt: ['Automation script or small bot', 'Data spreadsheet or tracker'],
    enjoyedSubjects: ['Math & Logic puzzles'],
    toolsUsed: ['VS Code', 'Jupyter / Google Colab'],
    topics: {
      python: 'intermediate',
      sql: 'none',
      java: 'none'
    }
  };

  await saveProfile({
    session_id: sessionId,
    student_email: studentEmail,
    intro_profile: introProfile,
    starter_answers: []
  }, { mode: 'localstorage' });

  // Step 2: Starter Diagnostic with strong logic
  const starterAnswers = [
    { questionId: 'diag_logic_comp_001', category: 'logic', isCorrect: true },
    { questionId: 'diag_pattern_002', category: 'logic', isCorrect: true },
    { questionId: 'diag_loop_rec_004', category: 'logic', isCorrect: true },
    { questionId: 'diag_step_order_005', category: 'logic', isCorrect: true }
  ];

  const diagResult = diagnosticScore(starterAnswers, itemBank, rulesConfig);
  assert.equal(diagResult.category, 'strong_logic');

  // Starting level calculation
  const placements = startingLevel(introProfile.topics, diagResult, rulesConfig);
  assert.equal(placements.python.level, 3, 'Python experience starts at Level 3 (Intermediate)');
  assert.equal(placements.sql.level, 1, 'Zero exposure SQL with strong logic starts at Level 1 (skips raw explainer)');

  // Step 3: Ladder Runner for Python starts directly at Difficulty 3
  const qPy1 = await getNextQuestion({
    email: studentEmail,
    topic: 'python',
    level: placements.python.level,
    session_id: sessionId
  }, { mode: 'localstorage' });

  assert.equal(qPy1.status, 'success');
  assert.equal(qPy1.assigned_difficulty, 3, 'Python starts at difficulty 3');
  assert.equal(qPy1.explainer_first, false);

  // Student answers Python intermediate question correctly
  const ansPy1 = await submitAnswer({
    session_id: sessionId,
    student_email: studentEmail,
    topic: 'python',
    question_id: qPy1.question.id,
    category: 'knowledge',
    answer: qPy1.question.answer,
    correct: true,
    time_taken: 11.2
  }, { mode: 'localstorage' });

  assert.equal(ansPy1.status, 'success');
  assert.equal(ansPy1.new_level, 3);

  // Second correct answer -> promotes to Level 4
  const qPy2 = await getNextQuestion({
    email: studentEmail,
    topic: 'python',
    level: 3,
    session_id: sessionId
  }, { mode: 'localstorage' });

  const ansPy2 = await submitAnswer({
    session_id: sessionId,
    student_email: studentEmail,
    topic: 'python',
    question_id: qPy2.question.id,
    category: 'knowledge',
    answer: qPy2.question.answer,
    correct: true,
    time_taken: 9.8
  }, { mode: 'localstorage' });

  assert.equal(ansPy2.transition_event, 'promote');
  assert.equal(ansPy2.new_level, 4, 'Promoted to Level 4 (Advanced Mastery)');
  assert.equal(ansPy2.confidence, 'medium');

  // Step 4: Summary & Interest Hypothesis (High Investigative / High Realistic)
  const answersHistory = [
    { category: 'interest', riasec: 'I', selectedAnswer: 'Strongly Like (5)', selectedOptionScore: 5 },
    { category: 'interest', riasec: 'R', selectedAnswer: 'Strongly Like (5)', selectedOptionScore: 5 },
    { category: 'interest', riasec: 'C', selectedAnswer: 'Like (4)', selectedOptionScore: 4 },
    { category: 'interest', riasec: 'E', selectedAnswer: 'Unsure / Neutral (3)', selectedOptionScore: 3 },
    { category: 'interest', riasec: 'A', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 },
    { category: 'interest', riasec: 'S', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 }
  ];

  const riasec = interestScores(answersHistory);
  const behaviorAdj = behaviorSignals({ voluntaryRetries: 2, domainId: '0', bonusPoints: 10 }, rulesConfig);
  const hypothesis = domainMapping(riasec, behaviorAdj, domainMappingConfig);

  assert.equal(hypothesis.mapping_version, 'hypothesis v1');
  assert.equal(hypothesis.singleVerdict, false);
  assert.equal(hypothesis.top3Domains.length, 3);
  
  // AI/ML or Data Science or Robotics ranks #1
  const topRankTitle = hypothesis.top3Domains[0].title;
  assert.ok(
    topRankTitle.includes('AI') || topRankTitle.includes('Robotics') || topRankTitle.includes('Data Science'),
    `Top domain was ${topRankTitle}`
  );

  // Submit Feedback control: "Does this feel right? (1-5)"
  const feedbackRes = await submitFeedback({
    result_id: sessionId,
    student_email: studentEmail,
    feels_right_rating: 5,
    optional_comment: 'Extremely accurate! Aligns perfectly with Python scripting and ML interest.'
  }, { mode: 'localstorage' });

  assert.equal(feedbackRes.status, 'success');

  // Check mastery data persistence
  const masteryRes = await getMastery(studentEmail, { mode: 'localstorage' });
  assert.equal(masteryRes.status, 'success');
  assert.equal(masteryRes.current_mastery.python.level, 4);
  assert.equal(masteryRes.history.filter(m => m.topic === 'python').length, 3, 'Maintains initial placement + 2 checkpoints');
  assert.equal(masteryRes.history.length, 5, 'Maintains full append-only history across all topics');
});


// =========================================================================
// ADAPTIVE DOMAIN DISCOVERY COORDINATOR TESTS
// =========================================================================

import {
  SUPPORTED_DOMAINS,
  DOMAIN_CLUSTERS,
  SELECTION_REASON_CODES,
  initStudentEvidenceState,
  calculateDomainScores,
  getVisitedClusters,
  selectNextAdaptiveItem,
  updateEvidenceWithResponse,
  evaluateStoppingConditions,
  generateDomainShortlist
} from '../data/adaptive/adaptiveDomainCoordinator.js';

const explainerCards = JSON.parse(
  readFileSync(join(__dirname, '../data/adaptive/explainerCards.json'), 'utf-8')
).explainers;

const domainsCatalogue = JSON.parse(
  readFileSync(join(__dirname, '../data/domains.json'), 'utf-8')
);

test('Coordinator: Exact 9 canonical domains mapped', () => {
  assert.equal(SUPPORTED_DOMAINS.length, 9);
  const ids = SUPPORTED_DOMAINS.map(d => d.id).sort();
  const expected = ['ai', 'cloud', 'data', 'iot', 'networking', 'robotics', 'security', 'vlsi', 'web'].sort();
  assert.deepEqual(ids, expected);
});

test('Coordinator: Decoupled evidence state initialized without rigid labels', () => {
  const profile = {
    semester: 2,
    prior_programming_exposure: 'none',
    subjects_tools_explored: [],
    projects_built: [],
    existing_career_interests: ['I do not know yet'],
    preferred_language: 'en',
    accessibility_needs: 'none'
  };

  const state = initStudentEvidenceState(profile, 'test_sess_01', 'student@test.edu');
  assert.equal(state.session_id, 'test_sess_01');
  assert.equal(state.history.length, 0);
  assert.equal(state.onboarding_profile.is_unsure, true);

  Object.values(state.domain_evidence).forEach(d => {
    assert.equal(d.stated_interest_score, 50);
    assert.equal(d.prior_exposure_level, 0);
    assert.equal(d.uncertainty, 1.0);
  });
});

test('Coordinator Branch F: IDK response serves clarifying explainer without penalty', () => {
  const state = initStudentEvidenceState({
    prior_programming_exposure: 'none',
    existing_career_interests: ['I do not know yet']
  });

  const updated = updateEvidenceWithResponse(state, {
    question_id: 'diag_pattern_002',
    question_type: 'interest',
    domain_tags: ['data'],
    selected_option_key: 'idk',
    selected_option_text: "I don't know / haven't learned this yet",
    is_idk: true,
    time_spent_seconds: 12
  });

  const next = selectNextAdaptiveItem(updated, itemBank.questions, explainerCards);
  assert.ok(next);
  assert.equal(next.action_type, 'clarification');
  assert.equal(next.selection_reason_code, SELECTION_REASON_CODES.RESOLVE_AMBIGUITY_WITHOUT_PENALTY);
  assert.equal(next.evidence_gap_addressed, 'CLARIFY_UNFAMILIAR_CONCEPT');
});

test('Coordinator Branch C: High CT Performance + Low Enjoyment decouples aptitude from interest', () => {
  const state = initStudentEvidenceState({
    prior_programming_exposure: 'none'
  });

  const updated = updateEvidenceWithResponse(state, {
    question_id: 'bebras_graph_001',
    question_type: 'computational_thinking',
    domain_tags: ['networking'],
    selected_option_key: 'A',
    selected_option_text: 'A cannot send messages to C or D',
    is_correct: true,
    is_idk: false,
    post_activity_enjoyment: 1, // 1 out of 5 stars
    post_activity_willingness: false,
    time_spent_seconds: 35
  });

  const scores = calculateDomainScores(updated);
  assert.ok(scores.networking.composite_score < 45, 'Low enjoyment prevents score inflation despite correct solution');

  const next = selectNextAdaptiveItem(updated, itemBank.questions, explainerCards);
  assert.ok(next);
  assert.equal(next.selection_reason_code, SELECTION_REASON_CODES.DECOUPLE_APTITUDE_FROM_INTEREST);
  assert.notEqual(next.target_domain, 'networking');
});

test('Coordinator Branch D: Low Performance + High Enjoyment keeps domain open with foundations', () => {
  const state = initStudentEvidenceState({
    prior_programming_exposure: 'none'
  });

  const updated = updateEvidenceWithResponse(state, {
    question_id: 'guided_robotics_001',
    question_type: 'computational_thinking',
    domain_tags: ['robotics'],
    selected_option_key: 'B',
    selected_option_text: 'Steer Right by turning off the right wheel',
    is_correct: false,
    is_idk: false,
    post_activity_enjoyment: 5, // Loved it!
    post_activity_willingness: true,
    time_spent_seconds: 40
  });

  const next = selectNextAdaptiveItem(updated, itemBank.questions, explainerCards);
  assert.ok(next);
  assert.equal(next.selection_reason_code, SELECTION_REASON_CODES.SUPPORT_ENTHUSIASM_WITH_FOUNDATIONS);
  assert.equal(next.target_domain, 'robotics');
});

test('Coordinator Preference Change: Buzzword AI preference smoothly pivots to Web on real reflection', () => {
  let state = initStudentEvidenceState({
    existing_career_interests: ['ai'],
    prior_programming_exposure: 'none'
  });

  // Step 1: Real data lab -> Student gives low enjoyment reflection
  state = updateEvidenceWithResponse(state, {
    question_id: 'act_codeorg_data_001',
    question_type: 'guided_experience',
    domain_tags: ['ai', 'data'],
    selected_option_text: 'Filter the dataset',
    is_correct: true,
    is_idk: false,
    post_activity_enjoyment: 2,
    post_activity_willingness: false
  });

  // Step 2: Explores Web UI interaction -> Student gives high enjoyment reflection
  state = updateEvidenceWithResponse(state, {
    question_id: 'act_codeorg_applab_002',
    question_type: 'guided_experience',
    domain_tags: ['web'],
    selected_option_text: 'Store completion locally immediately',
    is_correct: true,
    is_idk: false,
    post_activity_enjoyment: 5,
    post_activity_willingness: true
  });

  // Step 3: Explores Cloud/Security cluster
  state = updateEvidenceWithResponse(state, {
    question_id: 'act_codeorg_sec_003',
    question_type: 'guided_experience',
    domain_tags: ['security'],
    selected_option_text: 'It encrypts passwords and session cookies',
    is_correct: true,
    is_idk: false,
    post_activity_enjoyment: 3
  });

  // Step 4: Work preference comparison
  state = updateEvidenceWithResponse(state, {
    question_id: 'comp_tradeoff_web_iot_002',
    question_type: 'interest',
    domain_tags: ['web'],
    selected_option_text: 'On a sleek screen with buttons, responsive layouts, and smooth animations (Web & App focus)',
    option_score: 5,
    is_idk: false,
    post_activity_enjoyment: 5
  });

  const scores = calculateDomainScores(state);
  assert.ok(scores.web.composite_score > scores.ai.composite_score, 'Web development surpasses AI after genuine reflection');

  const shortlistResult = generateDomainShortlist(state, domainsCatalogue);
  assert.equal(shortlistResult.is_shortlist, true);
  assert.equal(shortlistResult.never_single_verdict, true);
  assert.equal(shortlistResult.shortlist[0].domain_id, 'web');
  assert.ok(shortlistResult.shortlist[0].relevant_activity_reflections.includes('High engagement'));
  assert.ok(shortlistResult.shortlist[0].current_exposure_knowledge.includes('Zero prior technical exposure'));
  assert.equal(shortlistResult.student_actions.length, 4);
});
