import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  RECOMMENDATION_CONFIG,
  getDemandTrendScore,
  computeRiasecEuclideanMatch,
  scoreDomainCandidate,
  recommendSingleDomain,
  buildPhase6RecommendationFromSession,
} from './recommendationEngine.js';
import {
  initAgentSession,
  agentNextQuestion,
  computeFinalResults,
} from './domainAdvisorAgent.js';
import { explainResult } from './analyticsEngine.js';
import { domainMapping } from './adaptiveEngine.js';
import domainMappingConfig from './domain_mapping_version.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Phase 6 config enforces 0.4 / 0.3 / 0.3 weights and Rising/Stable/Saturated/Declining trend scores', () => {
  assert.deepEqual(RECOMMENDATION_CONFIG.weights, {
    riasec: 0.4,
    readiness: 0.3,
    market_demand: 0.3,
  });

  assert.equal(getDemandTrendScore('Rising'), 1.0);
  assert.equal(getDemandTrendScore('Stable'), 0.7);
  assert.equal(getDemandTrendScore('Saturated'), 0.4);
  assert.equal(getDemandTrendScore('Saturated at entry level'), 0.4);
  assert.equal(getDemandTrendScore('Declining'), 0.2);

  // Supports config overrides cleanly
  const customConfig = {
    weights: { riasec: 0.5, readiness: 0.25, market_demand: 0.25 },
    demand_trend_scores: { Rising: 0.9, Stable: 0.6, Saturated: 0.3, Declining: 0.1 },
  };
  assert.equal(getDemandTrendScore('Rising', customConfig), 0.9);
  assert.equal(getDemandTrendScore('Declining', customConfig), 0.1);
});

test('Phase 6 Euclidean RIASEC distance and weighted scoring formula', () => {
  const exactVector = { R: 65, I: 95, A: 35, S: 25, E: 40, C: 70 };
  const exactMatch = computeRiasecEuclideanMatch(exactVector, exactVector);
  assert.equal(exactMatch.distance, 0);
  assert.equal(exactMatch.score, 1);
  assert.equal(exactMatch.scorePct, 100);

  const farVector = { R: 0, I: 0, A: 100, S: 100, E: 100, C: 0 };
  const farMatch = computeRiasecEuclideanMatch(farVector, exactVector);
  assert.ok(farMatch.distance > 0);
  assert.ok(farMatch.score > 0 && farMatch.score < 1);

  // Formula: 0.4 * 0.8 + 0.3 * 0.5 + 0.3 * 1.0 = 0.77 (77.0%)
  const scored = scoreDomainCandidate({
    domainId: 'ai',
    title: 'AI & ML',
    riasecScore: 0.8,
    readinessScore: 0.5,
    demandTrend: 'Rising',
  });
  assert.equal(scored.finalScore, 0.77);
  assert.equal(scored.finalScorePct, 77.0);
  assert.equal(scored.contributions.riasec, 0.32);
  assert.equal(scored.contributions.readiness, 0.15);
  assert.equal(scored.contributions.market_demand, 0.3);

  // Custom weights override changes the resulting weighted score
  const reweighted = scoreDomainCandidate(
    {
      domainId: 'ai',
      title: 'AI & ML',
      riasecScore: 0.8,
      readinessScore: 0.5,
      demandTrend: 'Declining',
    },
    {
      weights: { riasec: 0.2, readiness: 0.2, market_demand: 0.6 },
      demand_trend_scores: RECOMMENDATION_CONFIG.demand_trend_scores,
    }
  );
  // 0.2 * 0.8 + 0.2 * 0.5 + 0.6 * 0.2 = 0.16 + 0.10 + 0.12 = 0.38
  assert.equal(reweighted.finalScore, 0.38);
  assert.equal(reweighted.finalScorePct, 38.0);
});

test('Phase 6 tie-breaking is deterministic: higher RIASEC match wins regardless of input order', () => {
  // Both candidates yield exact finalScore = 0.57 under default 0.4 / 0.3 / 0.3 weights:
  // web:   0.4 * 0.9 + 0.3 * 0.5 + 0.3 * 0.2 (Declining) = 0.36 + 0.15 + 0.06 = 0.57
  // cloud: 0.4 * 0.6 + 0.3 * 0.1 + 0.3 * 1.0 (Rising)    = 0.24 + 0.03 + 0.30 = 0.57
  const candidateWeb = {
    domainId: 'web',
    title: 'Full Stack Web',
    riasecScore: 0.9,
    readinessScore: 0.5,
    demandTrend: 'Declining',
  };
  const candidateCloud = {
    domainId: 'cloud',
    title: 'Cloud & DevOps',
    riasecScore: 0.6,
    readinessScore: 0.1,
    demandTrend: 'Rising',
  };

  const resultOrder1 = recommendSingleDomain([candidateWeb, candidateCloud]);
  const resultOrder2 = recommendSingleDomain([candidateCloud, candidateWeb]);

  assert.equal(resultOrder1.topDomain.domainId, 'web');
  assert.equal(resultOrder2.topDomain.domainId, 'web');
  assert.equal(resultOrder1.topDomain.finalScore, 0.57);
  assert.equal(resultOrder2.topDomain.finalScore, 0.57);
  assert.equal(resultOrder1.whyThisOne.length, 3);
  assert.equal(resultOrder1.lowerRankedDomains.length, 1);
  assert.equal(resultOrder1.lowerRankedDomains[0].domainId, 'cloud');
  assert.match(resultOrder1.lowerRankedDomains[0].whyRankedLower, /tie-breaker.*RIASEC/i);
});

test('Phase 6 integration with DiagnosticAgent, explainResult, and Results.jsx structure', () => {
  let session = initAgentSession({
    track: 'software',
    prerequisiteMode: 'zero',
    totalTarget: 25,
  });

  for (let i = 0; i < 25; i += 1) {
    session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
  }

  const finalResults = computeFinalResults(session);
  assert.equal(finalResults.domain_id, 'ai');
  assert.ok(typeof finalResults.final_score === 'number' && finalResults.final_score > 0);
  assert.ok(Array.isArray(finalResults.why_this_one));
  assert.ok(finalResults.why_this_one.length >= 1 && finalResults.why_this_one.length <= 3);
  assert.ok(Array.isArray(finalResults.lower_ranked_domains) && finalResults.lower_ranked_domains.length >= 4);
  assert.ok(finalResults.evidence_ledger.whyItFits.length <= 3);

  // Verify buildPhase6RecommendationFromSession also handles stored fallback summaries
  const reconstructed = buildPhase6RecommendationFromSession({
    track: 'software',
    all_scores: { A: 90, B: 60, C: 40, D: 30, E: 35 },
    adaptiveMastery: { python: { level: 3 }, bebras_logic: { level: 3 } },
  });
  assert.equal(reconstructed.topDomain.domainId, 'ai');
  assert.ok(reconstructed.whyThisOne.length <= 3);

  // Verify explainResult includes score breakdown and why other domains ranked lower
  const hypothesis = domainMapping(
    { R: 65, I: 95, A: 35, S: 25, E: 40, C: 70 },
    null,
    domainMappingConfig
  );
  const explanation = explainResult({
    studentEmail: 'phase6@test.edu',
    hypothesisResult: hypothesis,
    mastery: { python: { level: 3 }, sql: { level: 2 } },
  });

  assert.ok(explanation.phase6Evaluation);
  assert.equal(explanation.phase6Evaluation.topDomain.domainId, 'ai');
  assert.ok(explanation.phase6Evaluation.lowerRankedDomains.length > 0);
  assert.ok(explanation.phase6Evaluation.lowerRankedDomains[0].whyRankedLower.length > 0);

  // Static checks on Results.jsx
  const resultsSource = fs.readFileSync(
    path.resolve(__dirname, '../../pages/Results.jsx'),
    'utf8'
  );
  assert.match(resultsSource, /Why this one/);
  assert.match(resultsSource, /\.slice\(0,\s*3\)/);
  assert.match(resultsSource, /to=\{`\/domain\/\$\{topDomain\.domainId\}`\}/);
  assert.match(resultsSource, /Explain my result/);
  assert.match(resultsSource, /id="explain-score-breakdown"/);
  assert.match(resultsSource, /id="explain-lower-ranked-domains"/);
  assert.equal(resultsSource.includes('shortlist.map'), false);
  assert.equal(resultsSource.includes('<Bar '), false);
});
