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
