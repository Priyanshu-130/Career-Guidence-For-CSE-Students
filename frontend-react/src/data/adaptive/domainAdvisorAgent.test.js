import test from 'node:test';
import assert from 'node:assert/strict';
import adaptiveBank from './adaptiveQuestionBank.js';
import { 
  initAgentSession, 
  agentNextQuestion, 
  computeFinalResults, 
  DOMAIN_METADATA 
} from './domainAdvisorAgent.js';

test('Adaptive Question Bank: 100+ items and licensing attribution integrity', () => {
  const items = adaptiveBank.items || [];
  assert.ok(items.length >= 100, `Expected 100+ items, found ${items.length}`);
  assert.ok(adaptiveBank.summary.interest_work_preference_items >= 75, `Expected 75+ interest items, found ${adaptiveBank.summary.interest_work_preference_items}`);

  // Check every item for required metadata
  items.forEach(item => {
    assert.ok(item.id, 'Item must have an id');
    assert.ok(item.tier, `Item ${item.id} must have a tier`);
    assert.ok(item.provenance && item.provenance.source, `Item ${item.id} must have provenance source`);
    assert.ok(item.provenance.license, `Item ${item.id} must have provenance license`);
    assert.ok(item.prompt, `Item ${item.id} must have a prompt`);
    assert.ok(Array.isArray(item.options) && item.options.length >= 4, `Item ${item.id} must have at least 4 options`);
    
    // Check that modified O*NET items do not claim to be validated assessments
    if (item.tier === 'interest_onet') {
      assert.ok(item.provenance.is_modified, `O*NET item ${item.id} must be flagged as modified`);
    }
  });
});

test('Route 1 (Beginner): 25-step adaptive session with zero-prerequisite guarantee', () => {
  let session = initAgentSession('beginner', 25);
  assert.equal(session.routeType, 'beginner');
  assert.equal(session.totalTarget, 25);
  assert.equal(session.currentStep, 1);
  assert.ok(session.currentQuestion.q);
  assert.ok(session.currentQuestion.plainEnglishHelper);

  // Simulate 25 adaptive questions selecting AI/Data options
  for (let i = 1; i <= 25; i++) {
    assert.equal(session.isComplete, false, `Session should not complete prematurely at step ${i}`);
    session = agentNextQuestion({
      currentSession: session,
      selectedOptionKey: (i % 2 === 0) ? 'A' : 'B'
    });
  }

  assert.equal(session.isComplete, true);
  assert.equal(session.currentStep, 26);
  assert.equal(session.history.length, 25);

  const results = computeFinalResults(session);
  assert.ok(results.top_domain);
  assert.equal(results.shortlist.length, 3);
  assert.ok(results.uncertainty_index);
  assert.ok(results.evidence_ledger.whyItFits.length >= 2);
});

test('Route 2 (Experienced): Domain depth + decoupled readiness checks without interest penalty', () => {
  let session = initAgentSession('experienced', 25, 'security');
  assert.equal(session.routeType, 'experienced');

  // Deliberately pick option D (Security) on interest items, but pick wrong answer (B) on readiness checks
  for (let i = 1; i <= 25; i++) {
    const isPrereqItem = session.currentQuestion.tier === 'logic_bebras' || session.currentQuestion.tier === 'guided_micro_codeorg';
    const chosenKey = isPrereqItem ? 'B' : 'D'; // wrong answer on prereq item
    session = agentNextQuestion({
      currentSession: session,
      selectedOptionKey: chosenKey
    });
  }

  assert.equal(session.isComplete, true);
  const results = computeFinalResults(session);

  // DECOUPLING VERIFICATION: Security interest score must remain high despite wrong answers on prereqs!
  assert.equal(results.domain_id, 'security', 'Security must remain top domain despite logic errors');
  assert.ok(results.confidence_score >= 80, 'Confidence score should remain high based on clear interest affinity');
  assert.ok(results.evidence_ledger.cautionOpenQuestions.length > 0, 'Should include caution/open questions based on flagged gaps');
});

test('Anti-Echo-Chamber: Agent explores alternative domains and generates multi-candidate shortlist', () => {
  let session = initAgentSession('beginner', 25);

  // Even if user answers mostly option E (Cloud), shortlist must contain 3 distinct options
  for (let i = 1; i <= 25; i++) {
    session = agentNextQuestion({
      currentSession: session,
      selectedOptionKey: 'E'
    });
  }

  const results = computeFinalResults(session);
  assert.equal(results.shortlist.length, 3, 'Must output top 3 candidate domains');
  assert.equal(results.shortlist[0].rank, 1);
  assert.equal(results.shortlist[1].rank, 2);
  assert.equal(results.shortlist[2].rank, 3);
  
  // Verify distinct candidate domains
  const domainIds = results.shortlist.map(s => s.domainId);
  assert.equal(new Set(domainIds).size, 3, 'Shortlist must contain 3 distinct domains');
});

test('Hardware Engineering Track: adaptive session evaluates hardware domains and verified prerequisites', () => {
  let session = initAgentSession({
    track: 'hardware',
    prerequisiteMode: 'prerequisites',
    declaredPrerequisites: ['electronics', 'digital_logic'],
    totalTarget: 20
  });

  assert.equal(session.track, 'hardware');
  assert.equal(session.prerequisiteMode, 'prerequisites');
  assert.ok(session.strategyAnalysis.strategyName.includes('Calibration'));
  assert.ok(session.eligibleItemIds.length >= 20);

  // Run 20 questions picking hardware options
  for (let i = 1; i <= 20; i++) {
    session = agentNextQuestion({
      currentSession: session,
      selectedOptionKey: (i % 2 === 0) ? 'A' : 'C'
    });
  }

  assert.equal(session.isComplete, true);
  const results = computeFinalResults(session);
  assert.equal(results.track, 'hardware');
  assert.equal(results.shortlist.length, 3);
  assert.ok(['iot', 'robotics', 'vlsi', 'networking'].includes(results.domain_id));
  assert.ok(results.prerequisiteProfile.declaredCount === 2);
});

test('Division of Responsibility & Dual Scores: 95% Interest + 10% Knowledge recommends AI/ML without disqualification', () => {
  // Beginner student starting with zero prerequisites
  let session = initAgentSession({
    track: 'software',
    prerequisiteMode: 'zero',
    totalTarget: 25
  });

  assert.equal(session.prerequisiteMode, 'zero');
  assert.equal(session.strategyAnalysis.strategyName, 'Zero-Prerequisite Intuitive Discovery Strategy');

  // Answer consistently picking AI/ML interest scenarios (option A)
  for (let i = 1; i <= 25; i++) {
    session = agentNextQuestion({
      currentSession: session,
      selectedOptionKey: 'A'
    });
  }

  assert.equal(session.isComplete, true);
  const results = computeFinalResults(session);

  // 1. Top recommendation MUST BE AI/ML despite beginner zero-knowledge!
  assert.equal(results.domain_id, 'ai');
  assert.ok(results.top_domain.includes('Artificial Intelligence'));

  // 2. Both separate scores MUST be tracked for every domain:
  assert.ok(results.domainInterestScores);
  assert.ok(results.domainKnowledgeScores);

  const aiProfile = results.domainProfiles.find(d => d.domainId === 'ai');
  assert.ok(aiProfile);
  assert.ok(aiProfile.interestScore >= 85, `Expected high interest score >= 85%, got ${aiProfile.interestScore}%`);
  assert.equal(aiProfile.knowledgeScore, 10, 'Expected beginner knowledge score to be 10% (starting fresh)');
  
  // 3. Shortlist primary item contains both scores
  assert.equal(results.shortlist[0].domainId, 'ai');
  assert.equal(results.shortlist[0].interestScore, aiProfile.interestScore);
  assert.equal(results.shortlist[0].knowledgeScore, 10);
});

test('Phase 3 Skip: Skip does not change promotion/demotion streak or scores, logs "skipped"', () => {
  let session = initAgentSession({
    track: 'software',
    prerequisiteMode: 'prerequisites',
    totalTarget: 25
  });

  const baselineInterest = { ...session.interestScores };
  const makeVerifQuestion = (id) => {
    const raw = session.allItemsMap.get(id);
    assert.ok(raw, `Missing verification item ${id}`);
    return {
      id: raw.id,
      q: raw.prompt,
      tier: raw.tier,
      options: raw.options.map(o => ({ key: o.key, text: o.text, isCorrect: o.is_correct }))
    };
  };

  // 1. Answer sw_check_001 correctly -> consecutiveCorrect = 1, level stays 2
  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_001') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
  assert.equal(session.consecutiveCorrect, 1);
  assert.equal(session.consecutiveWrong, 0);
  assert.equal(session.currentLadderLevel, 2);

  // 2. Skip sw_check_002 -> streak and scores must stay unchanged, logged as 'skipped'
  const interestBeforeSkip = { ...session.interestScores };
  const knowledgeBeforeSkip = { ...session.knowledgeScores };
  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_002') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'SKIP', isSkipped: true });

  assert.equal(session.consecutiveCorrect, 1, 'Skip must not reset or increment consecutiveCorrect');
  assert.equal(session.consecutiveWrong, 0, 'Skip must not affect consecutiveWrong');
  assert.equal(session.currentLadderLevel, 2, 'Skip must not alter ladder level');
  assert.deepEqual(session.interestScores, interestBeforeSkip, 'Skip must not alter interestScores');
  assert.equal(session.knowledgeScores.totalAnswered, knowledgeBeforeSkip.totalAnswered, 'Skip must not alter totalAnswered');

  const skipLog = session.history[session.history.length - 1];
  assert.equal(skipLog.status, 'skipped');
  assert.equal(skipLog.isSkipped, true);
  assert.equal(skipLog.isCorrect, null);

  // 3. Answer sw_check_003 correctly -> 2nd consecutive correct promotes level 2 -> 3
  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_003') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
  assert.equal(session.currentLadderLevel, 3, 'Should promote after 1 correct -> skip -> 1 correct');
  assert.equal(session.consecutiveCorrect, 0);

  // 4. Wrong answer -> skip -> wrong answer still demotes 3 -> 2
  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_004') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'B' });
  assert.equal(session.consecutiveWrong, 1);

  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_005') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'SKIP', isSkipped: true });
  assert.equal(session.consecutiveWrong, 1, 'Skip must not reset consecutiveWrong');
  assert.equal(session.currentLadderLevel, 3);

  session = { ...session, currentQuestion: makeVerifQuestion('sw_check_006') };
  session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'B' });
  assert.equal(session.currentLadderLevel, 2, 'Should demote after 1 wrong -> skip -> 1 wrong');
  assert.ok(baselineInterest, 'Baseline interest initialized');
});

test('Phase 3 Skip: Skipped items re-serve at most once near the end and respect the 25-item cap', () => {
  let session = initAgentSession({
    track: 'software',
    prerequisiteMode: 'zero',
    totalTarget: 25
  });

  const firstThreeSkippedIds = [];

  for (let step = 1; step <= 25; step++) {
    assert.equal(session.isComplete, false, `Should not end before step 25 (at step ${step})`);
    if (step <= 3) {
      firstThreeSkippedIds.push(session.currentQuestion.id);
      session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'SKIP', isSkipped: true });
    } else if (session.currentQuestion.reServed && step === 23) {
      // Skip the first re-served item a second time to verify it is NOT re-served a 3rd time
      session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'SKIP', isSkipped: true });
    } else {
      session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
    }
  }

  assert.equal(session.isComplete, true);
  assert.equal(session.history.length, 25, 'Total items must strictly equal the 25-item cap');

  // Verify the 3 skipped items were re-served near the end (steps 23, 24, 25)
  const reServedEntries = session.history.filter(h => h.reServed);
  assert.equal(reServedEntries.length, 3);
  assert.deepEqual(
    reServedEntries.map(h => h.itemId),
    firstThreeSkippedIds
  );

  // Verify every itemId appears at most twice (served once + re-served at most once)
  const counts = {};
  session.history.forEach(h => {
    counts[h.itemId] = (counts[h.itemId] || 0) + 1;
    assert.ok(counts[h.itemId] <= 2, `Item ${h.itemId} was served ${counts[h.itemId]} times (max 2 allowed)`);
  });

  // Verify audit trail logs skipped status
  const results = computeFinalResults(session);
  assert.equal(results.readiness_summary.skipped_count, 4);
  assert.equal(results.auditTrail.filter(e => e.status === 'skipped').length, 4);
});

test('Phase 3 Skip: Skipping every question still stops strictly at the 25-item cap and never re-serves an item twice', () => {
  let session = initAgentSession({
    track: 'software',
    prerequisiteMode: 'zero',
    totalTarget: 25
  });

  let guard = 0;
  while (!session.isComplete && guard < 40) {
    session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'SKIP', isSkipped: true });
    guard += 1;
  }

  assert.equal(session.isComplete, true);
  assert.equal(session.history.length, 25, '25-item cap strictly respected when skipping all items');

  const counts = {};
  session.history.forEach(h => {
    counts[h.itemId] = (counts[h.itemId] || 0) + 1;
    assert.ok(counts[h.itemId] <= 2, `Item ${h.itemId} appeared ${counts[h.itemId]} times`);
    assert.equal(h.status, 'skipped');
  });

  const results = computeFinalResults(session);
  assert.equal(results.readiness_summary.skipped_count, 25);
});



