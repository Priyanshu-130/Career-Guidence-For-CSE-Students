import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  validateItemBank,
  computeQuizMix,
  updateKnowledgeLadder,
  evaluateSignals,
  checkEvidenceSkip,
  startingLevel,
  diagnosticScore,
  nextQuestion,
  updateMastery,
  interestScores,
  behaviorSignals,
  domainMapping,
  storeFeedback
} from './adaptiveEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rulesConfig = JSON.parse(
  readFileSync(join(__dirname, 'rules_version.json'), 'utf-8')
);

const domainMappingConfig = JSON.parse(
  readFileSync(join(__dirname, 'domain_mapping_version.json'), 'utf-8')
);

const itemBank = JSON.parse(
  readFileSync(join(__dirname, 'item_bank.json'), 'utf-8')
);

test('Rules version config integrity', () => {
  assert.equal(rulesConfig.rules_version, '1.0.0');
  assert.ok(rulesConfig.quiz_mix.basic);
  assert.ok(rulesConfig.quiz_mix.medium);
  assert.ok(rulesConfig.quiz_mix.hard);
  assert.equal(rulesConfig.knowledge_ladder.consecutive_correct_to_promote, 2);
  assert.equal(rulesConfig.knowledge_ladder.consecutive_wrong_to_demote, 2);
});

test('Quiz Mix Calculator matches configured target percentages', () => {
  // Test basic mix: ~55% interest, ~25% logic, ~5% knowledge, ~15% guided activity
  const basicMix = computeQuizMix('basic', 20, rulesConfig);
  assert.equal(basicMix.interest, 11); // 55% of 20 = 11
  assert.equal(basicMix.logic, 5);     // 25% of 20 = 5
  assert.equal(basicMix.knowledge, 1); // 5% of 20 = 1
  assert.equal(basicMix.guided_activity, 3); // 15% of 20 = 3
  assert.equal(basicMix.interest + basicMix.logic + basicMix.knowledge + basicMix.guided_activity, 20);

  // Test medium mix: ~20% interest, ~15% logic, ~60% knowledge, ~5% guided activity
  const medMix = computeQuizMix('medium', 20, rulesConfig);
  assert.equal(medMix.interest, 4);    // 20%
  assert.equal(medMix.logic, 3);       // 15%
  assert.equal(medMix.knowledge, 12);  // 60%
  assert.equal(medMix.guided_activity, 1); // 5%
  assert.equal(medMix.interest + medMix.logic + medMix.knowledge + medMix.guided_activity, 20);

  // Test hard mix: ~10% interest, ~10% logic, ~75% knowledge, ~5% guided activity
  const hardMix = computeQuizMix('hard', 20, rulesConfig);
  assert.equal(hardMix.interest, 2);   // 10%
  assert.equal(hardMix.logic, 2);      // 10%
  assert.equal(hardMix.knowledge, 15); // 75%
  assert.equal(hardMix.guided_activity, 1); // 5%
  assert.equal(hardMix.interest + hardMix.logic + hardMix.knowledge + hardMix.guided_activity, 20);
});

test('Item bank validator strictly enforces schema, licensing and attribution', () => {
  const validSampleItem = {
    id: 'py_basic_001',
    topicId: 'python_fundamentals',
    type: 'knowledge',
    difficulty: 'basic',
    questionText: 'Which function outputs text to console in Python?',
    options: [
      { key: 'A', text: 'print()' },
      { key: 'B', text: 'echo()' },
      { key: 'C', text: 'System.out.println()' }
    ],
    correctOption: 'A',
    explanation: 'print() is the standard built-in output function.',
    source: 'O*NET Interest Profiler Adaptations',
    sourceUrl: 'https://www.onetcenter.org',
    license: 'USDOL Developer License',
    attributionText: 'Adapted from USDOL/ETA O*NET Career Exploration tools under Developer License.',
    modified: true
  };

  const allowedLicenses = rulesConfig.licenses.supported_licenses;
  const validRes = validateItemBank([validSampleItem], allowedLicenses);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.errors.length, 0);

  // Negative test: Missing attribution and unlicensed source
  const badItem = {
    id: 'bad_001',
    topicId: 'python_fundamentals',
    type: 'knowledge',
    difficulty: 'basic',
    questionText: 'Test question?',
    options: [{ key: 'A', text: 'One' }], // less than 2 options
    source: 'CodeHS Question Bank', // disallowed
    sourceUrl: '',
    license: 'Unknown License',
    attributionText: '',
    modified: 'not-a-bool'
  };

  const invalidRes = validateItemBank([badItem], allowedLicenses);
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.errors.some(e => e.includes('CodeHS')));
  assert.ok(invalidRes.errors.some(e => e.includes('at least 2 options')));
  assert.ok(invalidRes.errors.some(e => e.includes('License \'Unknown License\' is not in the list')));
});

test('Knowledge ladder promotes after 2 consecutive correct answers', () => {
  let state = {
    currentLevel: 'basic',
    consecutiveCorrect: 0,
    consecutiveWrong: 0
  };

  // Answer 1: Correct
  state = updateKnowledgeLadder(state, true, rulesConfig);
  assert.equal(state.currentLevel, 'basic');
  assert.equal(state.consecutiveCorrect, 1);
  assert.equal(state.transitionEvent, 'maintain');

  // Answer 2: Correct -> Promote to Medium
  state = updateKnowledgeLadder(state, true, rulesConfig);
  assert.equal(state.currentLevel, 'medium');
  assert.equal(state.consecutiveCorrect, 0);
  assert.equal(state.transitionEvent, 'promote');

  // Answer 3: Correct
  state = updateKnowledgeLadder(state, true, rulesConfig);
  assert.equal(state.consecutiveCorrect, 1);

  // Answer 4: Correct -> Promote to Hard
  state = updateKnowledgeLadder(state, true, rulesConfig);
  assert.equal(state.currentLevel, 'hard');
  assert.equal(state.transitionEvent, 'promote');

  // Once at Hard, further correct answers do not exceed max ladder
  state = updateKnowledgeLadder(state, true, rulesConfig);
  state = updateKnowledgeLadder(state, true, rulesConfig);
  assert.equal(state.currentLevel, 'hard');
});

test('Knowledge ladder demotes after 2 consecutive wrong answers and triggers explainer/prerequisite', () => {
  let state = {
    currentLevel: 'hard',
    consecutiveCorrect: 0,
    consecutiveWrong: 0
  };

  // Wrong 1
  state = updateKnowledgeLadder(state, false, rulesConfig);
  assert.equal(state.currentLevel, 'hard');
  assert.equal(state.consecutiveWrong, 1);
  assert.equal(state.triggerPrerequisite, false);

  // Wrong 2 -> Demote to Medium, triggers prerequisite flag & explainer
  state = updateKnowledgeLadder(state, false, rulesConfig);
  assert.equal(state.currentLevel, 'medium');
  assert.equal(state.consecutiveWrong, 0);
  assert.equal(state.transitionEvent, 'demote');
  assert.equal(state.triggerPrerequisite, true);
  assert.equal(state.showExplainer, true);
});

test('Signals separate knowledge accuracy from genuine interest engagement', () => {
  const mockResponses = [
    { itemType: 'knowledge', isCorrect: true, timeSpentSeconds: 12 },
    { itemType: 'knowledge', isCorrect: false, timeSpentSeconds: 25 },
    { itemType: 'logic', isCorrect: true, timeSpentSeconds: 40 },
    { itemType: 'interest', selectedOptionScore: 5, timeSpentSeconds: 8 },
    { itemType: 'interest', selectedOptionScore: 4, timeSpentSeconds: 10, isVoluntaryRetry: true }
  ];

  const signals = evaluateSignals(mockResponses);

  // Knowledge: 2 out of 3 correct (knowledge + logic) = 67%
  assert.equal(signals.knowledge.correctCount, 2);
  assert.equal(signals.knowledge.totalCount, 3);
  assert.equal(signals.knowledge.accuracy, 0.67);
  assert.equal(signals.knowledge.levelLabel, 'Foundational');

  // Interest: average (5 + 4)/2 = 4.5 + voluntary retry bonus (0.25) = 4.75
  assert.equal(signals.interest.itemsEvaluated, 2);
  assert.equal(signals.interest.normalizedScore, 4.75);
  assert.equal(signals.interest.levelLabel, 'High Curiosity');
  assert.equal(signals.interest.voluntaryRetries, 1);
});

test('Prior mastery evidence allows skipping without reassessment unless expired', () => {
  const priorEvidence = {
    python_fundamentals: {
      level: 'medium',
      verifiedCorrectAtLevel: 4,
      lastAssessedTimestamp: new Date().toISOString()
    },
    sql_databases: {
      level: 'basic',
      verifiedCorrectAtLevel: 1,
      lastAssessedTimestamp: new Date().toISOString()
    },
    expired_topic: {
      level: 'hard',
      verifiedCorrectAtLevel: 5,
      // 40 days ago
      lastAssessedTimestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
    }
  };

  // Sufficient and fresh evidence -> Skip
  const skipRes = checkEvidenceSkip('python_fundamentals', priorEvidence, rulesConfig);
  assert.equal(skipRes.shouldSkip, true);
  assert.equal(skipRes.assignedLevel, 'medium');

  // Insufficient verified correct items -> Do not skip
  const noSkipRes = checkEvidenceSkip('sql_databases', priorEvidence, rulesConfig);
  assert.equal(noSkipRes.shouldSkip, false);

  // Expired evidence (> 30 days) -> Reassessment due
  const expiredRes = checkEvidenceSkip('expired_topic', priorEvidence, rulesConfig);
  assert.equal(expiredRes.shouldSkip, false);
  assert.ok(expiredRes.reason.includes('expired'));
});

// =========================================================================
// PHASE 2 SPECIFIC TESTS (a through h)
// =========================================================================

test('Test a: No experience -> Basic mix, explainer-first', () => {
  const introProfile = { python: 'none' };

  // Starting level: none with weak/no diagnostic logic -> level 0, source=self_report, confidence=low
  const placement = startingLevel(introProfile, null, rulesConfig);
  assert.equal(placement.python.level, 0);
  assert.equal(placement.python.source, 'self_report');
  assert.equal(placement.python.confidence, 'low');

  // Quiz mix for Level 0 is basic mix (high interest & logic, guided activity, low high-stakes knowledge)
  const mix = computeQuizMix(0, 10, rulesConfig);
  assert.ok(mix.interest >= 5); // 60% of 10 = 6
  assert.ok(mix.logic >= 2);

  // Question generation for level 0 activates explainer-first
  const question = nextQuestion({ topic: 'python', level: 0 }, itemBank, rulesConfig);
  assert.ok(question, 'Must return a question');
  assert.equal(question.explainerFirst, true);
  assert.ok(question.recommendedExplainerRef);
  assert.equal(question.assignedDifficulty, 1);
});

test('Test b: Python experience -> Python ladder starts higher', () => {
  const profileNoExp = { python: 'none' };
  const profileBasic = { python: 'basic' };
  const profileIntermediate = { python: 'intermediate' };

  const placementNoExp = startingLevel(profileNoExp, null, rulesConfig);
  const placementBasic = startingLevel(profileBasic, null, rulesConfig);
  const placementInter = startingLevel(profileIntermediate, null, rulesConfig);

  assert.equal(placementNoExp.python.level, 0);
  assert.equal(placementBasic.python.level, 2);
  assert.equal(placementInter.python.level, 3);

  // Python ladder with intermediate experience starts directly at difficulty 3
  const qInter = nextQuestion({ topic: 'python', level: placementInter.python.level }, itemBank, rulesConfig);
  const qNoExp = nextQuestion({ topic: 'python', level: placementNoExp.python.level }, itemBank, rulesConfig);

  assert.equal(qInter.difficulty, 3);
  assert.equal(qInter.explainerFirst, false);
  assert.equal(qNoExp.difficulty, 1);
  assert.equal(qNoExp.explainerFirst, true);
  assert.ok(qInter.difficulty > qNoExp.difficulty);
});

test('Test c: Knows Java, not SQL -> different sequences per topic', () => {
  const profile = { java: 'intermediate', sql: 'none' };
  const placement = startingLevel(profile, null, rulesConfig);

  assert.equal(placement.java.level, 3);
  assert.equal(placement.sql.level, 0);

  // Initial question for Java starts at Level 3
  const qJava = nextQuestion({ topic: 'java', level: placement.java.level }, itemBank, rulesConfig);
  assert.equal(qJava.topic, 'java');
  assert.equal(qJava.difficulty, 3);
  assert.equal(qJava.explainerFirst, false);

  // Initial question for SQL starts at Level 0 with explainer-first
  const qSql = nextQuestion({ topic: 'sql', level: placement.sql.level }, itemBank, rulesConfig);
  assert.equal(qSql.topic, 'sql');
  assert.equal(qSql.difficulty, 1);
  assert.equal(qSql.explainerFirst, true);

  // Different starting tracks and sequences per topic
  assert.notEqual(qJava.difficulty, qSql.difficulty);
  assert.notEqual(qJava.topic, qSql.topic);
});

test('Test d: Shows foundations -> deeper questions', () => {
  // User starts at foundational level 2
  let state = {
    topic: 'python',
    level: 2,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    askedQuestionIds: [],
    history: []
  };

  // First correct foundational answer
  state = updateMastery(state, { questionId: 'py_found_01', isCorrect: true }, rulesConfig);
  assert.equal(state.consecutiveCorrect, 1);
  assert.equal(state.level, 2);

  // Second consecutive correct answer -> promotes to level 3
  state = updateMastery(state, { questionId: 'py_found_02', isCorrect: true }, rulesConfig);
  assert.equal(state.level, 3);
  assert.equal(state.transitionEvent, 'promote');
  assert.equal(state.consecutiveCorrect, 0);

  // State now routes to deeper questions (difficulty 3)
  const deeperQuestion = nextQuestion(state, itemBank, rulesConfig);
  assert.equal(deeperQuestion.difficulty, 3);
  assert.equal(deeperQuestion.assignedDifficulty, 3);
});

test('Test e: Struggles at intermediate -> demoted with prerequisite guidance', () => {
  // User starts at intermediate level 3
  let state = {
    topic: 'sql',
    level: 3,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    askedQuestionIds: [],
    history: [],
    previousMistakes: []
  };

  // First wrong answer
  state = updateMastery(state, {
    questionId: 'sql_int_01',
    isCorrect: false,
    skills: ['joins', 'aggregation'],
    explainer_ref: 'exp_sql_joins'
  }, rulesConfig);
  assert.equal(state.level, 3);
  assert.equal(state.consecutiveWrong, 1);
  assert.equal(state.prerequisiteGuidance, false);

  // Second consecutive wrong answer -> demoted to Level 2
  state = updateMastery(state, {
    questionId: 'sql_int_02',
    isCorrect: false,
    skills: ['joins'],
    explainer_ref: 'exp_sql_joins'
  }, rulesConfig);

  assert.equal(state.level, 2);
  assert.equal(state.transitionEvent, 'demote');
  assert.equal(state.prerequisiteGuidance, true);
  assert.equal(state.showExplainer, true);
  assert.equal(state.previousMistakes.length, 2);

  // Next question receives prerequisite guidance at foundational difficulty
  const nextQ = nextQuestion(state, itemBank, rulesConfig);
  assert.ok(nextQ.difficulty <= 2, 'Difficulty should be dialed back to foundational/prerequisite');
});

test('Test f: Two different backgrounds -> different sequences', () => {
  const profileA = { python: 'intermediate', sql: 'none', java: 'none' };
  const profileB = { python: 'none', sql: 'intermediate', java: 'basic' };

  const startA = startingLevel(profileA, null, rulesConfig);
  const startB = startingLevel(profileB, null, rulesConfig);

  const topics = ['python', 'sql', 'java'];

  const sequenceA = topics.map(topic => {
    return nextQuestion({ topic, level: startA[topic].level }, itemBank, rulesConfig);
  });

  const sequenceB = topics.map(topic => {
    return nextQuestion({ topic, level: startB[topic].level }, itemBank, rulesConfig);
  });

  // Check Python: A has difficulty 3, B has difficulty 1
  assert.equal(sequenceA[0].difficulty, 3);
  assert.equal(sequenceB[0].difficulty, 1);

  // Check SQL: A has difficulty 1, B has difficulty 3
  assert.equal(sequenceA[1].difficulty, 1);
  assert.equal(sequenceB[1].difficulty, 3);

  // Check Java: A has difficulty 1, B has difficulty 2
  assert.equal(sequenceA[2].difficulty, 1);
  assert.equal(sequenceB[2].difficulty, 2);

  // The question IDs and difficulty sequences are completely differentiated
  assert.notDeepEqual(sequenceA.map(q => q.id), sequenceB.map(q => q.id));
});

test('Test g: High Python score does not change RIASEC scores', () => {
  const commonInterestAnswers = [
    { category: 'interest', riasec: 'R', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 },
    { category: 'interest', riasec: 'I', selectedAnswer: 'Strongly Like (5)', selectedOptionScore: 5 },
    { category: 'interest', riasec: 'A', selectedAnswer: 'Like (4)', selectedOptionScore: 4 },
    { category: 'interest', riasec: 'S', selectedAnswer: 'Unsure / Neutral (3)', selectedOptionScore: 3 },
    { category: 'interest', riasec: 'E', selectedAnswer: 'Dislike (2)', selectedOptionScore: 2 },
    { category: 'interest', riasec: 'C', selectedAnswer: 'Like (4)', selectedOptionScore: 4 }
  ];

  // User 1: Perfect 100% on Python knowledge
  const user1Responses = [
    ...commonInterestAnswers,
    { category: 'knowledge', topic: 'python', isCorrect: true, questionId: 'py_01' },
    { category: 'knowledge', topic: 'python', isCorrect: true, questionId: 'py_02' },
    { category: 'knowledge', topic: 'python', isCorrect: true, questionId: 'py_03' }
  ];

  // User 2: Failed 0% on Python knowledge
  const user2Responses = [
    ...commonInterestAnswers,
    { category: 'knowledge', topic: 'python', isCorrect: false, questionId: 'py_01' },
    { category: 'knowledge', topic: 'python', isCorrect: false, questionId: 'py_02' },
    { category: 'knowledge', topic: 'python', isCorrect: false, questionId: 'py_03' }
  ];

  const riasec1 = interestScores(user1Responses);
  const riasec2 = interestScores(user2Responses);

  // High Python score has strictly zero effect on RIASEC interest scores
  assert.deepEqual(riasec1, riasec2);
  assert.equal(riasec1.I, 100.0); // 5/5 -> 100%
  assert.equal(riasec1.R, 25.0);  // 2/5 -> 25%
  assert.equal(riasec1.A, 75.0);  // 4/5 -> 75%
});

test('Test h: Promotion, demotion, reassessment, "I don\'t know", behavior cap', () => {
  // 1. Promotion: 2 consecutive correct promotes
  let state = { level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] };
  state = updateMastery(state, true, rulesConfig);
  assert.equal(state.level, 1);
  state = updateMastery(state, true, rulesConfig);
  assert.equal(state.level, 2);
  assert.equal(state.transitionEvent, 'promote');

  // 2. Demotion: 2 consecutive wrong demotes
  state = updateMastery(state, false, rulesConfig);
  assert.equal(state.level, 2);
  state = updateMastery(state, false, rulesConfig);
  assert.equal(state.level, 1);
  assert.equal(state.transitionEvent, 'demote');

  // 3. Reassessment: Expired evidence triggers reassessment instead of skip
  const freshEvidence = {
    python: { level: 3, verifiedCorrectAtLevel: 4, lastAssessedTimestamp: new Date().toISOString() }
  };
  const expiredEvidence = {
    python: { level: 3, verifiedCorrectAtLevel: 4, lastAssessedTimestamp: new Date(Date.now() - 35 * 86400000).toISOString() }
  };

  const freshCheck = checkEvidenceSkip('python', freshEvidence, rulesConfig);
  assert.equal(freshCheck.shouldSkip, true);

  const expiredCheck = checkEvidenceSkip('python', expiredEvidence, rulesConfig);
  assert.equal(expiredCheck.shouldSkip, false);
  assert.equal(expiredCheck.needsReassessment, true);

  // 4. "I don't know" handling:
  // When answering "I don't know" at intermediate level, non-punitively indicates boundary,
  // demotes to foundational, and sets confidence to medium/high
  let intState = { level: 3, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] };
  const dontKnowAns = {
    questionId: 'py_adv_01',
    selectedOption: "I don't know / haven't learned this yet",
    isDontKnow: true
  };
  intState = updateMastery(intState, dontKnowAns, rulesConfig);
  assert.equal(intState.level, 2, 'Demoted cleanly without crash');
  assert.equal(intState.prerequisiteGuidance, true);
  assert.equal(intState.confidence, 'medium');

  // 5. Behavior cap & Domain Mapping:
  // Generate extreme behavior signals (e.g. +60 bonus points)
  const extremeBehaviorEvent = {
    domainId: '0',
    voluntaryExploration: true,
    bonusPoints: 60
  };
  const behaviorSignalsResult = behaviorSignals(extremeBehaviorEvent, rulesConfig);
  assert.equal(behaviorSignalsResult.domainAdjustments['0'], 20, 'Domain adjustment must be capped at +20%');

  // 6. Domain Mapping Heuristic ("hypothesis v1")
  const userRiasec = { R: 60, I: 95, A: 30, S: 25, E: 40, C: 70 };
  const mappingResult = domainMapping(userRiasec, behaviorSignalsResult, domainMappingConfig);

  assert.equal(mappingResult.mapping_version, 'hypothesis v1');
  assert.equal(mappingResult.status, 'hypothesis');
  assert.equal(mappingResult.singleVerdict, false, 'Never outputs a single final verdict');
  assert.equal(mappingResult.top3Domains.length, 3, 'Always outputs top 3 domains');
  assert.ok(mappingResult.note.includes('starting hypothesis based on your answers; it adjusts as you explore'));

  // AI/ML domain adjustment in final calculation was strictly capped
  const aiDomain = mappingResult.top3Domains.find(d => d.id === '0');
  assert.ok(aiDomain);
  assert.equal(aiDomain.behaviorAdjustment, 20);

  // 7. Feedback control: "Does this feel right? (1-5)"
  const validFeedback = storeFeedback(mappingResult, 4, 'Very accurate suggestions');
  assert.equal(validFeedback.rating, 4);
  assert.equal(validFeedback.hypothesis_version, 'hypothesis v1');
  assert.equal(validFeedback.top_domains.length, 3);

  assert.throws(() => {
    storeFeedback(mappingResult, 6);
  }, /Feedback rating must be an integer between 1 and 5/);
});

test('Diagnostic score separates zero exposure + strong logic from weak logic', () => {
  const strongAnswers = [
    { questionId: 'diag_logic_comp_001', category: 'logic', isCorrect: true },
    { questionId: 'diag_pattern_002', category: 'logic', isCorrect: true },
    { questionId: 'diag_loop_rec_004', category: 'logic', isCorrect: true },
    { questionId: 'diag_step_order_005', category: 'logic', isCorrect: false }
  ];

  const weakAnswers = [
    { questionId: 'diag_logic_comp_001', category: 'logic', isCorrect: false },
    { questionId: 'diag_pattern_002', category: 'logic', isCorrect: false },
    { questionId: 'diag_loop_rec_004', category: 'logic', isCorrect: true },
    { questionId: 'diag_step_order_005', category: 'logic', isCorrect: false }
  ];

  const strongRes = diagnosticScore(strongAnswers, itemBank, rulesConfig);
  assert.equal(strongRes.category, 'strong_logic');
  assert.equal(strongRes.recommendedStartingLevelForZeroExposure, 1);

  const weakRes = diagnosticScore(weakAnswers, itemBank, rulesConfig);
  assert.equal(weakRes.category, 'weak_logic');
  assert.equal(weakRes.recommendedStartingLevelForZeroExposure, 0);

  // With strong logic, startingLevel maps none -> 1
  const strongProfile = startingLevel({ python: 'none' }, strongRes, rulesConfig);
  assert.equal(strongProfile.python.level, 1);

  // With weak logic, startingLevel maps none -> 0
  const weakProfile = startingLevel({ python: 'none' }, weakRes, rulesConfig);
  assert.equal(weakProfile.python.level, 0);
});

test('Phase 3 Skip: Skip does not change promotion or demotion streak and is logged as "skipped"', () => {
  // 1. Knowledge ladder compatibility wrapper
  let ladder = { currentLevel: 'basic', consecutiveCorrect: 0, consecutiveWrong: 0 };
  ladder = updateKnowledgeLadder(ladder, true, rulesConfig);
  assert.equal(ladder.consecutiveCorrect, 1);

  ladder = updateKnowledgeLadder(ladder, 'skip', rulesConfig);
  assert.equal(ladder.currentLevel, 'basic');
  assert.equal(ladder.consecutiveCorrect, 1, 'Skip must preserve consecutiveCorrect');
  assert.equal(ladder.consecutiveWrong, 0, 'Skip must preserve consecutiveWrong');
  assert.equal(ladder.transitionEvent, 'skipped');

  ladder = updateKnowledgeLadder(ladder, true, rulesConfig);
  assert.equal(ladder.currentLevel, 'medium', '1 correct -> skip -> 1 correct promotes');

  ladder = updateKnowledgeLadder(ladder, false, rulesConfig);
  assert.equal(ladder.consecutiveWrong, 1);

  ladder = updateKnowledgeLadder(ladder, { isSkipped: true }, rulesConfig);
  assert.equal(ladder.consecutiveWrong, 1, 'Skip must preserve consecutiveWrong');
  assert.equal(ladder.currentLevel, 'medium');

  ladder = updateKnowledgeLadder(ladder, false, rulesConfig);
  assert.equal(ladder.currentLevel, 'basic', '1 wrong -> skip -> 1 wrong demotes');
  assert.equal(ladder.showExplainer, true);

  // 2. Topic-level updateMastery preserves streaks and logs 'skipped'
  let state = {
    topic: 'python',
    level: 2,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    askedQuestionIds: [],
    history: [],
    previousMistakes: []
  };

  state = updateMastery(state, { questionId: 'py_01', isCorrect: true }, rulesConfig);
  state = updateMastery(state, { questionId: 'py_02', isSkipped: true }, rulesConfig);
  assert.equal(state.level, 2);
  assert.equal(state.consecutiveCorrect, 1);
  assert.equal(state.consecutiveWrong, 0);
  assert.equal(state.transitionEvent, 'skipped');
  assert.equal(state.previousMistakes.length, 0, 'Skipped items must not be logged as mistakes');
  assert.equal(state.history[state.history.length - 1].status, 'skipped');

  state = updateMastery(state, { questionId: 'py_03', isCorrect: true }, rulesConfig);
  assert.equal(state.level, 3, 'Should promote cleanly across a skip');

  state = updateMastery(state, { questionId: 'py_04', isCorrect: false, skills: ['loops'] }, rulesConfig);
  state = updateMastery(state, { questionId: 'py_05', action: 'skip' }, rulesConfig);
  assert.equal(state.consecutiveWrong, 1);
  state = updateMastery(state, { questionId: 'py_06', isCorrect: false, skills: ['loops'] }, rulesConfig);
  assert.equal(state.level, 2, 'Should demote cleanly across a skip');
  assert.equal(state.showExplainer, true);
});

test('Phase 3 Skip: nextQuestion re-serves skipped items at most once near the end and respects 25-item cap', () => {
  const syntheticBank = Array.from({ length: 30 }, (_, idx) => ({
    id: `syn_${String(idx + 1).padStart(2, '0')}`,
    topic: 'python',
    type: 'knowledge',
    difficulty: 2,
    status: 'approved',
    questionText: `Question ${idx + 1}`,
    options: [
      { key: 'A', text: 'Right' },
      { key: 'B', text: 'Wrong' }
    ],
    correctOption: 'A'
  }));

  let state = {
    topic: 'python',
    level: 2,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    askedQuestionIds: [],
    history: [],
    previousMistakes: [],
    maxQuestions: 25
  };

  const servedIds = [];
  const reServedIds = [];

  for (let step = 1; step <= 25; step++) {
    const q = nextQuestion(state, syntheticBank, rulesConfig);
    assert.ok(q, `Step ${step} must return a question`);
    servedIds.push(q.id);
    if (q.reServed) {
      reServedIds.push(q.id);
    }

    const askedQuestionIds = q.reServed ? state.askedQuestionIds : [...state.askedQuestionIds, q.id];
    const shouldSkip = step === 1 || step === 2 || (q.reServed && step === 24);
    state = updateMastery(
      { ...state, askedQuestionIds },
      shouldSkip
        ? { questionId: q.id, isSkipped: true, reServed: Boolean(q.reServed) }
        : { questionId: q.id, isCorrect: true, reServed: Boolean(q.reServed) },
      rulesConfig
    );
  }

  // After 25 questions, nextQuestion must return null (25-item cap enforced)
  assert.equal(nextQuestion(state, syntheticBank, rulesConfig), null);
  assert.equal(servedIds.length, 25);
  assert.deepEqual(reServedIds, ['syn_01', 'syn_02']);

  // No item served more than twice
  const counts = {};
  servedIds.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
    assert.ok(counts[id] <= 2, `Item ${id} was served ${counts[id]} times`);
  });
});
