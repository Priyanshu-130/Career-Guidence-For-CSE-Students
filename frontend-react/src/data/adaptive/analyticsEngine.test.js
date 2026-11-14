import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  explainResult,
  computeItemAnalytics,
  updateQuestionStatus
} from './analyticsEngine.js';

import { DEMO_SCENARIOS } from './demoScenarios.js';
import { domainMapping } from './adaptiveEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const itemBank = JSON.parse(readFileSync(join(__dirname, 'item_bank.json'), 'utf-8')).questions;
const mappingConfig = JSON.parse(readFileSync(join(__dirname, 'domain_mapping_version.json'), 'utf-8'));

test('Explainability engine generates complete breakdown for all 6 demo scenarios', () => {
  assert.equal(DEMO_SCENARIOS.length, 6);

  DEMO_SCENARIOS.forEach(scenario => {
    // Generate domain hypothesis from RIASEC
    const hypothesis = domainMapping(scenario.riasecVector, null, mappingConfig);

    const sessionPayload = {
      studentEmail: scenario.student.email,
      studentProfile: scenario.student,
      diagnosticResults: scenario.diagnosticResults,
      attempts: scenario.attempts,
      mastery: scenario.mastery,
      hypothesisResult: hypothesis,
      behaviorEvents: scenario.behaviorEvents
    };

    const explanation = explainResult(sessionPayload);

    // Assert integrity of explanation output
    assert.equal(explanation.studentEmail, scenario.student.email);
    assert.ok(explanation.domainExplanations.length <= 3);
    assert.ok(explanation.domainExplanations.length > 0);
    assert.ok(explanation.domainExplanations[0].derivationFormula.includes('Fit'));

    // Check topic explanations
    const topicKeys = Object.keys(explanation.topicExplanations);
    assert.ok(topicKeys.length > 0, `Scenario ${scenario.id} should have topic explanations.`);

    topicKeys.forEach(t => {
      const exp = explanation.topicExplanations[t];
      assert.ok(exp.summaryText.includes('derived from your initial starting placement'));
      assert.ok(exp.totalQuestionsAnswered > 0);
    });
  });
});

test('Item analytics calculates facility, IDK rate, and flags abnormal items', () => {
  const mockAttempts = [
    // Item 1: High pass rate (too easy)
    { question_id: 'py_k_006', student_email: 's1', correct: true, is_dont_know: false, time_taken: 5 },
    { question_id: 'py_k_006', student_email: 's2', correct: true, is_dont_know: false, time_taken: 4 },
    { question_id: 'py_k_006', student_email: 's3', correct: true, is_dont_know: false, time_taken: 6 },
    { question_id: 'py_k_006', student_email: 's4', correct: true, is_dont_know: false, time_taken: 5 },

    // Item 2: High IDK rate
    { question_id: 'sql_k_012', student_email: 's1', correct: false, is_dont_know: true, answer: "I don't know / haven't learned this yet", time_taken: 3 },
    { question_id: 'sql_k_012', student_email: 's2', correct: false, is_dont_know: true, answer: "I don't know / haven't learned this yet", time_taken: 4 },
    { question_id: 'sql_k_012', student_email: 's3', correct: false, is_dont_know: true, answer: "I don't know / haven't learned this yet", time_taken: 5 },
    { question_id: 'sql_k_012', student_email: 's4', correct: true, is_dont_know: false, time_taken: 20 },

    // Item 3: Low pass rate (too hard)
    { question_id: 'java_k_017', student_email: 's1', correct: false, is_dont_know: false, time_taken: 25 },
    { question_id: 'java_k_017', student_email: 's2', correct: false, is_dont_know: false, time_taken: 30 },
    { question_id: 'java_k_017', student_email: 's3', correct: false, is_dont_know: false, time_taken: 32 },
    { question_id: 'java_k_017', student_email: 's4', correct: false, is_dont_know: false, time_taken: 28 }
  ];

  const analytics = computeItemAnalytics(itemBank, mockAttempts);
  assert.ok(analytics.length === itemBank.length);

  const easyItem = analytics.find(a => a.questionId === 'py_k_006');
  assert.equal(easyItem.facility, 1.0);
  assert.ok(easyItem.flags.includes('too_easy'));

  const idkItem = analytics.find(a => a.questionId === 'sql_k_012');
  assert.equal(idkItem.idkRate, 0.75);
  assert.ok(idkItem.flags.includes('high_idk_rate'));

  const hardItem = analytics.find(a => a.questionId === 'java_k_017');
  assert.equal(hardItem.facility, 0.0);
  assert.ok(hardItem.flags.includes('too_hard'));
});

test('Admin can inspect, flag, and retire a defective item', () => {
  const targetId = 'py_k_020';
  const original = itemBank.find(q => q.id === targetId);
  assert.equal(original.status, 'approved');

  const { updatedBank, updatedItem } = updateQuestionStatus(
    itemBank,
    targetId,
    'retired',
    'Retired by curriculum administrator: analytics reported confusing distractor wording.'
  );

  assert.equal(updatedItem.status, 'retired');
  assert.ok(updatedItem.status_change_note.includes('confusing distractor'));

  const retiredInBank = updatedBank.find(q => q.id === targetId);
  assert.equal(retiredInBank.status, 'retired');
});

test('Phase 3 Skip: computeItemAnalytics computes skipRate and explainResult logs skipped items without breaking streaks', () => {
  const mockAttempts = [
    { question_id: 'py_k_008', student_email: 's1', correct: true, is_skipped: false, time_taken: 10 },
    { question_id: 'py_k_008', student_email: 's2', correct: false, is_skipped: true, status: 'skipped', answer: 'skipped', time_taken: 3 },
    { question_id: 'py_k_008', student_email: 's3', correct: true, is_skipped: false, time_taken: 12 },
    { question_id: 'py_k_008', student_email: 's4', correct: false, is_skipped: false, answer: 'wrong', time_taken: 18 }
  ];

  const analytics = computeItemAnalytics(itemBank, mockAttempts);
  const py8 = analytics.find(a => a.questionId === 'py_k_008');
  assert.ok(py8);
  assert.equal(py8.skipRate, 0.25);
  assert.equal(py8.skippedCount, 1);
  assert.equal(py8.facility, 0.5);

  const explanation = explainResult({
    studentEmail: 'skip.test@pathfinder.edu',
    studentProfile: { topicExperience: { python: 'basic' } },
    attempts: [
      { question_id: 'py_k_001', topic: 'python', correct: true, time_taken: 8 },
      { question_id: 'py_k_002', topic: 'python', correct: false, is_skipped: true, status: 'skipped', answer: 'skipped', time_taken: 2 },
      { question_id: 'py_k_003', topic: 'python', correct: true, time_taken: 9 }
    ],
    mastery: { python: { level: 3, confidence: 'medium' } }
  });

  const pyExp = explanation.topicExplanations.python;
  assert.equal(pyExp.skippedCount, 1);
  assert.equal(pyExp.correctCount, 2);
  assert.ok(pyExp.ladderTransitions.some(t => t.includes('Skipped (status: "skipped")')));
  assert.ok(pyExp.ladderTransitions.some(t => t.includes('Second consecutive correct answer triggered level promotion')));
});

