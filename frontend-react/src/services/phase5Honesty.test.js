import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  getCustomizedRoadmap,
  calculateTechnicalReadiness,
  calculateTriComponentDomainFit
} from '../utils/roadmapHelper.js';

import {
  ENGINES,
  getActiveEngine,
  setActiveEngine,
  getMetricLabel,
  calculateCompositeDomainScore
} from '../utils/configHandler.js';

import { analyzeSkillGaps } from './skillGapService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const domainsData = JSON.parse(
  readFileSync(join(__dirname, '../data/domains.json'), 'utf-8')
);

const domainAI = domainsData.find(d => d.id === 'ai') || domainsData[0];
const domainWeb = domainsData.find(d => d.id === 'web') || domainsData[2];

// =========================================================================
// PHASE 5: INTEGRATION AND MODEL HONESTY TESTS
// =========================================================================

test('Roadmap dynamically changes when mastery changes', () => {
  // Student 1: Zero prior knowledge (Level 0)
  const masteryZero = { python: { level: 0 }, logic: { level: 0 } };
  const roadmapZero = getCustomizedRoadmap(domainAI, masteryZero);

  // Student 2: Verified Intermediate competence (Level 3)
  const masteryInter = { python: { level: 3 }, logic: { level: 2 } };
  const roadmapInter = getCustomizedRoadmap(domainAI, masteryInter);

  // Student 3: Verified Advanced competence (Level 4)
  const masteryAdv = { python: { level: 4 }, logic: { level: 3 } };
  const roadmapAdv = getCustomizedRoadmap(domainAI, masteryAdv);

  // Verification 1: Semester 1 course starting depth changes based on verified topic level
  assert.equal(roadmapZero[0].startingDepth, 'explainer_first');
  assert.ok(roadmapZero[0].depthBadge.includes('Level 0'));
  assert.equal(roadmapZero[0].isAccelerated, false);

  assert.equal(roadmapInter[0].startingDepth, 'accelerated');
  assert.ok(roadmapInter[0].depthBadge.includes('Level 3 Verified'));
  assert.equal(roadmapInter[0].isAccelerated, true);

  assert.equal(roadmapAdv[0].startingDepth, 'mastery_exempt');
  assert.ok(roadmapAdv[0].depthBadge.includes('Level 4 Verified'));

  // Ensure roadmaps between Level 0 and Level 3 are markedly distinct
  assert.notEqual(roadmapZero[0].startingDepth, roadmapInter[0].startingDepth);
  assert.notEqual(roadmapZero[0].depthBadge, roadmapInter[0].depthBadge);
  assert.notEqual(roadmapZero[0].recommendation, roadmapInter[0].recommendation);
});

test('Roadmap dynamically changes when interest orientation changes', () => {
  const mastery = { python: { level: 2 }, sql: { level: 2 } };

  // Student with AI Interest vs Student with Web Interest
  const roadmapAI = getCustomizedRoadmap(domainAI, mastery, { primaryInterest: 'ai' });
  const roadmapWeb = getCustomizedRoadmap(domainWeb, mastery, { primaryInterest: 'web' });

  // Curricula and projects reflect respective domain orientation
  assert.equal(roadmapAI[0].course.title, domainAI.curriculum.year1[0].title);
  assert.equal(roadmapWeb[0].course.title, domainWeb.curriculum.year1[0].title);
  assert.notEqual(roadmapAI[0].course.title, roadmapWeb[0].course.title);

  // Applied mini-projects are tailored
  assert.ok(roadmapAI[3].course.title.includes('ML Pipeline') || roadmapAI[3].course.title.includes('Mini-Project'));
  assert.ok(roadmapWeb[3].course.title.includes('Full-Stack MERN') || roadmapWeb[3].course.title.includes('Mini-Project'));
});

test('Tri-Component rule-based engine: 35% Interest, 35% Self-Report, 30% Verified Technical Readiness', () => {
  // Test case with full assessment: Interest 80, Self-Report 70, Verified Technical 90
  // Formula: (0.35 * 80) + (0.35 * 70) + (0.30 * 90) = 28 + 24.5 + 27 = 79.5
  const fit = calculateCompositeDomainScore(80, 70, 90);

  assert.equal(fit.score, 79.5);
  assert.equal(fit.hasVerifiedReadiness, true);
  assert.equal(fit.components.interest_contribution, 28.0);
  assert.equal(fit.components.self_report_contribution, 24.5);
  assert.equal(fit.components.technical_readiness_contribution, 27.0);
  assert.equal(fit.metric, 'Match Score', 'Must display strictly Match Score, never accuracy or probability');

  // Fallback for unassessed students: 50% Interest + 50% Self-Report
  const fallbackFit = calculateCompositeDomainScore(80, 70, null);
  assert.equal(fallbackFit.score, 75.0); // (0.50 * 80) + (0.50 * 70)
  assert.equal(fallbackFit.hasVerifiedReadiness, false);
  assert.ok(fallbackFit.note.includes('Technical readiness pending adaptive ladder assessment'));
});

test('SkillGapService uses verified levels in addition to completed courses', () => {
  // Scenario A: Student has NOT completed college course 'Python Basics',
  // but verified Level 3 mastery in adaptive assessment.
  // SkillGapService must acknowledge verified competence without false gap.
  const gapsA = analyzeSkillGaps('ai', { python: { level: 3 } }, []);
  const pySkillA = gapsA.competencies.find(c => c.topic === 'python');

  assert.ok(pySkillA, 'Python competency must be tracked');
  assert.equal(pySkillA.status, 'verified_mastery');
  assert.equal(pySkillA.readinessPoints, 100);
  assert.ok(pySkillA.note.includes('Level 3 verified in assessment. Skill confirmed regardless of college course status.'));

  // Scenario B: Student marked college course 'Python Basics' completed,
  // but verified assessment detected Level 0 gap.
  // SkillGapService must flag a gap warning rather than granting false confidence.
  const gapsB = analyzeSkillGaps('ai', { python: { level: 0 } }, ['Python Basics']);
  const pySkillB = gapsB.competencies.find(c => c.topic === 'python');

  assert.equal(pySkillB.status, 'gap_warning');
  assert.ok(pySkillB.readinessPoints < 50);
  assert.ok(pySkillB.note.includes('diagnostic indicates Level 0 knowledge gap'));

  // Scenario C: Completely unassessed student with no courses
  const gapsC = analyzeSkillGaps('ai', {}, []);
  assert.ok(gapsC.criticalGaps.length >= 2, 'Unassessed and uncompleted competencies must be flagged as critical gaps');
});

test('FIX: RANDOM FOREST HONESTY - Model Card exists and enforces ethical compliance', () => {
  const modelCardPath = join(__dirname, '../../../ml/MODEL_CARD.md');
  assert.ok(existsSync(modelCardPath), 'ml/MODEL_CARD.md must exist in root ml directory');

  const content = readFileSync(modelCardPath, 'utf-8');

  // 1. Data source & size documented
  assert.ok(content.includes('20,000 rows'), 'Must document 20,000 rows in test_data.csv');
  assert.ok(content.includes('34 unique'), 'Must document 34 target classes');
  assert.ok(content.includes('Synthetic benchmark dataset'), 'Must state dataset is synthetic');

  // 2. Cross-validation caveat documented
  assert.ok(
    content.includes('does not predict real-world') || content.includes('does NOT predict real-world'),
    'Must include caveat that CV on synthetic data does not predict real-world accuracy'
  );

  // 3. Status labeled experimental
  assert.ok(content.includes('EXPERIMENTAL ONLY'), 'Must label Random Forest as experimental');

  // 4. Metric terminology documented
  assert.ok(content.includes('Match Score'), 'Must enforce Match Score metric');
  assert.ok(
    content.includes('Never reported as "probability"') || content.includes('never "probability"'),
    'Must prohibit probability or accuracy claims'
  );

  // 5. Retraining and pilot plan documented
  assert.ok(content.includes('Post-Pilot Recalibration Plan'), 'Must include post-pilot evaluation plan');
});

test('ConfigHandler enforces rule-based default and experimental Random Forest labeling', () => {
  // Rule-based is production default
  setActiveEngine('rule_based');
  const defaultEng = getActiveEngine();
  assert.equal(defaultEng.id, 'rule_based');
  assert.equal(defaultEng.isExperimental, false);
  assert.equal(defaultEng.status, 'production');

  // Random Forest is explicitly labeled experimental
  const rfEng = ENGINES.RANDOM_FOREST;
  assert.equal(rfEng.isExperimental, true);
  assert.equal(rfEng.status, 'experimental');
  assert.ok(rfEng.label.includes('Experimental'));
  assert.equal(rfEng.displayMetric, 'Match Score');
  assert.ok(rfEng.caveat.includes('synthetic benchmark data'));
});
