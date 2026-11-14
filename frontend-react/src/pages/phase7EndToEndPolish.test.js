import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  initAgentSession,
  agentNextQuestion,
  computeFinalResults,
} from '../data/adaptive/domainAdvisorAgent.js';
import {
  getPhase4DomainBundle,
  filterAndGroupResources,
} from '../data/phase4DataLoader.js';
import { getCustomizedRoadmap } from '../utils/roadmapHelper.js';
import { ROADMAP_SH_DOMAINS } from '../data/roadmapShData.js';
import legacyDomainsData from '../data/domains.json' with { type: 'json' };
import {
  clearLocalStorage,
  saveProfile,
  getNextQuestion,
  submitAnswer,
  getMastery,
  saveDomainAssessment,
  getDomainAssessment,
} from '../services/apiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '../..');
const repoRoot = path.resolve(frontendRoot, '..');

test('Phase 7 E2E: assessment -> skip -> IDK -> single-domain results -> domain page -> roadmap', () => {
  let session = initAgentSession({
    track: 'software',
    semester: '3-4',
    prerequisiteMode: 'prerequisites',
    declaredPrerequisites: ['prog_fund', 'dsa_logic'],
    totalTarget: 25,
  });

  // Step 1: Skip question does not change streak or ladder level
  const initialLevel = session.currentLadderLevel;
  const firstSkippedId = session.currentQuestion.id;
  session = agentNextQuestion({
    currentSession: session,
    selectedOptionKey: 'SKIP',
    isSkipped: true,
  });
  assert.equal(session.consecutiveCorrect, 0);
  assert.equal(session.consecutiveWrong, 0);
  assert.equal(session.currentLadderLevel, initialLevel);
  assert.equal(session.history[0].status, 'skipped');

  // Step 2: Verification items with IDK trigger demotion on 2 consecutive misses
  let idkUsed = 0;
  while (!session.isComplete) {
    const q = session.currentQuestion;
    const isVerif =
      q.tier === 'logic_bebras' ||
      q.tier === 'guided_micro_codeorg' ||
      q.tier === 'hardware_technical';

    if (q.reServed) {
      assert.equal(q.id, firstSkippedId, 'Re-served item must match previously skipped item');
      session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
    } else if (isVerif && idkUsed < 2) {
      idkUsed += 1;
      session = agentNextQuestion({
        currentSession: session,
        selectedOptionKey: 'IDK',
        isDontKnow: true,
      });
    } else {
      session = agentNextQuestion({ currentSession: session, selectedOptionKey: 'A' });
    }
  }

  assert.equal(session.isComplete, true);
  assert.equal(session.history.length, 25);

  const results = computeFinalResults(session);
  assert.ok(results.domain_id);
  assert.ok(results.top_domain);
  assert.ok(Array.isArray(results.why_this_one) && results.why_this_one.length <= 3);
  assert.ok(Array.isArray(results.lower_ranked_domains) && results.lower_ranked_domains.length > 0);
  assert.equal(results.auditTrail.length, 25);
  assert.ok(results.auditTrail.some((e) => e.status === 'skipped'));
  assert.ok(results.auditTrail.some((e) => e.status === 'dont_know'));
  assert.ok(results.auditTrail.some((e) => e.reServed === true));

  // Domain Detail Page data + filters for recommended domain
  const domainBundle = getPhase4DomainBundle(results.domain_id);
  assert.ok(domainBundle, `Missing Phase 4 bundle for ${results.domain_id}`);
  assert.ok(domainBundle.marketDemand.demand_trend);
  assert.ok(domainBundle.marketBooster.upgrade_path.length === 3);

  const freeResources = filterAndGroupResources(domainBundle.resources, {
    cost: 'free',
    language: 'all',
  });
  assert.ok(freeResources.totalCount > 0);

  // Roadmap resolution for every canonical Phase 4 domain (including mobile & systems aliases)
  const PHASE4_ROADMAP_ALIAS = { mobile: 'web', systems: 'iot' };
  const allCanonicalIds = ['web', 'ai', 'data', 'cloud', 'security', 'mobile', 'systems'];
  for (const domId of allCanonicalIds) {
    const aliasId = PHASE4_ROADMAP_ALIAS[domId] || domId;
    const baseDomain = legacyDomainsData.find((d) => d.id === aliasId);
    assert.ok(baseDomain, `Missing roadmap baseDomain for ${domId} (${aliasId})`);
    assert.ok(ROADMAP_SH_DOMAINS[aliasId]?.nodes?.length > 0, `Missing roadmap.sh nodes for ${aliasId}`);

    const semesters = getCustomizedRoadmap(baseDomain, {
      python: { level: 3 },
      sql: { level: 2 },
    });
    assert.equal(semesters.length, 8, `Expected 8 semesters for ${domId}`);
  }
});

test('Phase 7 Offline Fallback: localStorage mode works end-to-end without backend server', async () => {
  clearLocalStorage();
  const studentEmail = 'offline.phase7@pathfinder.edu';
  const sessionId = 'sess_offline_phase7';

  const profileRes = await saveProfile(
    {
      session_id: sessionId,
      student_email: studentEmail,
      intro_profile: { python: 'none', sql: 'none' },
      starter_answers: [],
    },
    { mode: 'localstorage' }
  );
  assert.equal(profileRes.status, 'success');
  assert.equal(profileRes.tier, 'localstorage');

  const qRes = await getNextQuestion(
    { email: studentEmail, topic: 'python', level: 0, session_id: sessionId },
    { mode: 'localstorage' }
  );
  assert.equal(qRes.status, 'success');
  assert.ok(qRes.question?.id);

  const ansRes = await submitAnswer(
    {
      session_id: sessionId,
      student_email: studentEmail,
      topic: 'python',
      question_id: qRes.question.id,
      answer: "I don't know / haven't learned this yet",
      is_dont_know: true,
      correct: false,
    },
    { mode: 'localstorage' }
  );
  assert.equal(ansRes.status, 'success');
  assert.equal(ansRes.tier, 'localstorage');

  const masteryRes = await getMastery(studentEmail, { mode: 'localstorage' });
  assert.equal(masteryRes.status, 'success');
  assert.equal(masteryRes.current_mastery.python.level, 0);

  // Domain assessment save & reload offline
  const domSave = await saveDomainAssessment(
    {
      student_email: studentEmail,
      domain_id: 'ai',
      roadmap_data: { semesters: [{ semester: 1, title: 'Python & Math' }] },
      trajectory_data: { milestones: [] },
    },
    { mode: 'localstorage' }
  );
  assert.equal(domSave.status, 'success');
  assert.equal(domSave.tier, 'localstorage');

  const domLoad = await getDomainAssessment(studentEmail, 'ai', { mode: 'localstorage' });
  assert.equal(domLoad.status, 'success');
  assert.equal(domLoad.assessment.domain_id, 'ai');
  assert.equal(domLoad.assessment.roadmap_data.semesters.length, 1);

  // Verify QuizRunner, Results, and App offline storage wiring
  const quizRunnerSrc = fs.readFileSync(path.join(frontendRoot, 'src/pages/QuizRunner.jsx'), 'utf8');
  const resultsSrc = fs.readFileSync(path.join(frontendRoot, 'src/pages/Results.jsx'), 'utf8');
  const appSrc = fs.readFileSync(path.join(frontendRoot, 'src/App.jsx'), 'utf8');
  const apiServiceSrc = fs.readFileSync(path.join(frontendRoot, 'src/services/apiService.js'), 'utf8');

  assert.match(apiServiceSrc, /DOMAIN_ASSESSMENTS:\s*'cpath_domain_assessments'/);
  assert.match(quizRunnerSrc, /cpath_latest_quiz_results/);
  assert.match(resultsSrc, /cpath_latest_quiz_results/);
  assert.match(resultsSrc, /masteryResp\.current_mastery\s*\|\|\s*masteryResp\.mastery/);
  assert.match(appSrc, /cpath_latest_quiz_results/);
});

test('Phase 7 Responsive CSS (360px, 768px, 1280px) & Documentation (README.md, CHANGELOG.md)', () => {
  const indexCss = fs.readFileSync(path.join(frontendRoot, 'src/index.css'), 'utf8');
  assert.match(indexCss, /overflow-x:\s*hidden/);
  assert.match(indexCss, /@media\s*\(max-width:\s*360px\)/);
  assert.match(indexCss, /@media\s*\(max-width:\s*768px\)/);
  assert.match(indexCss, /@media\s*\(min-width:\s*1280px\)/);

  const readmePath = path.join(repoRoot, 'README.md');
  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  assert.equal(fs.existsSync(readmePath), true, 'README.md must exist');
  assert.equal(fs.existsSync(changelogPath), true, 'CHANGELOG.md must exist');

  const readme = fs.readFileSync(readmePath, 'utf8');
  const changelog = fs.readFileSync(changelogPath, 'utf8');

  assert.match(readme, /recommendation_config\.json/);
  assert.match(readme, /validate_data\.js/);
  assert.match(readme, /Skip question/i);
  assert.match(readme, /localStorage/i);

  assert.match(changelog, /Phase 7/);
  assert.match(changelog, /Phase 6/);
  assert.match(changelog, /Phase 5/);
  assert.match(changelog, /Phase 4/);
  assert.match(changelog, /Phase 3/);
  assert.match(changelog, /Phase 2/);
  assert.match(changelog, /Phase 1/);
});
