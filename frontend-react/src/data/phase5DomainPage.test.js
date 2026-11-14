import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PHASE4_META,
  LEGACY_HARDWARE_ALIASES,
  getAllPhase4Domains,
  getPhase4DomainBundle,
  filterAndGroupResources,
} from './phase4DataLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '..');

const CANONICAL_IDS = ['web', 'ai', 'data', 'cloud', 'security', 'mobile', 'systems'];
const LEGACY_IDS = ['iot', 'robotics', 'vlsi', 'networking'];

test('getAllPhase4Domains returns all 7 canonical domains with enriched Phase 4 data', () => {
  const domains = getAllPhase4Domains();
  assert.equal(domains.length, CANONICAL_IDS.length);
  assert.deepEqual(
    domains.map((d) => d.id),
    CANONICAL_IDS
  );

  for (const domain of domains) {
    assert.ok(domain.marketDemand, `Missing marketDemand for ${domain.id}`);
    assert.ok(domain.marketBooster, `Missing marketBooster for ${domain.id}`);
    assert.ok(Array.isArray(domain.resources) && domain.resources.length > 0, `Missing resources for ${domain.id}`);
  }
});

test('getPhase4DomainBundle resolves all 7 canonical IDs, 4 legacy aliases, and returns null for unknown IDs', () => {
  assert.equal(PHASE4_META.lastUpdated, '2026-11-01');

  for (const id of CANONICAL_IDS) {
    const bundle = getPhase4DomainBundle(id);
    assert.ok(bundle, `Expected bundle for canonical domain ${id}`);
    assert.equal(bundle.domain.id, id);
    assert.equal(bundle.marketDemand.domain_id, id);
    assert.equal(bundle.marketBooster.domain_id, id);
    assert.ok(Array.isArray(bundle.resources) && bundle.resources.length > 0);
    assert.equal(bundle.meta.lastUpdated, PHASE4_META.lastUpdated);
  }

  for (const legacyId of LEGACY_IDS) {
    const expectedCanonical = LEGACY_HARDWARE_ALIASES[legacyId];
    assert.ok(expectedCanonical, `Missing alias mapping for ${legacyId}`);
    const bundle = getPhase4DomainBundle(legacyId);
    assert.ok(bundle, `Expected bundle for legacy alias ${legacyId}`);
    assert.equal(bundle.domain.id, legacyId);
    assert.equal(bundle.domain.canonicalId, expectedCanonical);
    assert.equal(bundle.marketDemand.domain_id, expectedCanonical);
    assert.equal(bundle.marketBooster.domain_id, expectedCanonical);
    assert.ok(bundle.resources.length > 0);
  }

  assert.equal(getPhase4DomainBundle('nonexistent-domain'), null);
  assert.equal(getPhase4DomainBundle(''), null);
  assert.equal(getPhase4DomainBundle(null), null);
});

test('filterAndGroupResources groups by level and filters by cost and language including bilingual entries', () => {
  const sampleResources = [
    { id: 'r1', title: 'HTML Basics', level: 'beginner', cost: 'free', language: 'English' },
    { id: 'r2', title: 'React Hindi Course', level: 'beginner', cost: 'free', language: 'Hindi / English' },
    { id: 'r3', title: 'System Design Paid', level: 'intermediate', cost: 'paid', language: 'English' },
    { id: 'r4', title: 'Backend Hindi', level: 'intermediate', cost: 'free', language: 'Hindi' },
    { id: 'r5', title: 'Distributed Systems', level: 'advanced', cost: 'paid', language: 'Bilingual (Hindi/English)' },
  ];

  const allGrouped = filterAndGroupResources(sampleResources, { cost: 'all', language: 'all' });
  assert.equal(allGrouped.totalCount, 5);
  assert.equal(allGrouped.beginner.length, 2);
  assert.equal(allGrouped.intermediate.length, 2);
  assert.equal(allGrouped.advanced.length, 1);

  const freeOnly = filterAndGroupResources(sampleResources, { cost: 'free', language: 'all' });
  assert.equal(freeOnly.totalCount, 3);
  assert.deepEqual(
    freeOnly.beginner.map((r) => r.id),
    ['r1', 'r2']
  );
  assert.deepEqual(
    freeOnly.intermediate.map((r) => r.id),
    ['r4']
  );
  assert.equal(freeOnly.advanced.length, 0);

  const paidOnly = filterAndGroupResources(sampleResources, { cost: 'paid', language: 'all' });
  assert.equal(paidOnly.totalCount, 2);
  assert.equal(paidOnly.beginner.length, 0);
  assert.equal(paidOnly.intermediate.length, 1);
  assert.equal(paidOnly.advanced.length, 1);

  const hindiOnly = filterAndGroupResources(sampleResources, { cost: 'all', language: 'Hindi' });
  assert.equal(hindiOnly.totalCount, 3);
  assert.deepEqual(
    [...hindiOnly.beginner, ...hindiOnly.intermediate, ...hindiOnly.advanced].map((r) => r.id),
    ['r2', 'r4', 'r5']
  );

  const englishFree = filterAndGroupResources(sampleResources, { cost: 'free', language: 'English' });
  assert.equal(englishFree.totalCount, 2);
  assert.deepEqual(
    englishFree.beginner.map((r) => r.id),
    ['r1', 'r2']
  );

  const webBundle = getPhase4DomainBundle('web');
  const webGrouped = filterAndGroupResources(webBundle.resources);
  assert.equal(
    webGrouped.totalCount,
    webGrouped.beginner.length + webGrouped.intermediate.length + webGrouped.advanced.length
  );
  assert.equal(webGrouped.totalCount, webBundle.resources.length);
});

test('DomainDetail.jsx removes MiniQuiz and keeps the 5 Phase 5 sections in exact order with 3-line overview clamp', () => {
  const domainDetailSource = fs.readFileSync(path.join(srcRoot, 'pages', 'DomainDetail.jsx'), 'utf8');

  assert.equal(
    domainDetailSource.includes('MiniQuiz'),
    false,
    'DomainDetail.jsx should not include MiniQuiz'
  );

  const sectionIds = [
    'domain-section-overview',
    'domain-section-market-demand',
    'domain-section-market-booster',
    'domain-section-resources',
    'domain-section-roadmap',
  ];

  const positions = sectionIds.map((id) => {
    const idx = domainDetailSource.indexOf(`id="${id}"`);
    assert.ok(idx !== -1, `Missing section id="${id}" in DomainDetail.jsx`);
    return idx;
  });

  for (let i = 1; i < positions.length; i += 1) {
    assert.ok(
      positions[i] > positions[i - 1],
      `Section ${sectionIds[i]} must appear after ${sectionIds[i - 1]}`
    );
  }

  assert.match(
    domainDetailSource,
    /WebkitLineClamp:\s*3/,
    'Overview section in DomainDetail.jsx must enforce WebkitLineClamp: 3'
  );
});

test('PHASE4_META metadata is configured and DataSourcesFooter is removed from App layouts', () => {
  const footerSource = fs.readFileSync(path.join(srcRoot, 'components', 'DataSourcesFooter.jsx'), 'utf8');
  const appSource = fs.readFileSync(path.join(srcRoot, 'App.jsx'), 'utf8');

  assert.equal(PHASE4_META.lastUpdated, '2026-11-01');
  assert.ok(Array.isArray(PHASE4_META.sources) && PHASE4_META.sources.length > 0);
  assert.ok(PHASE4_META.disclaimer);
  assert.match(footerSource, /return\s+null/);

  assert.doesNotMatch(appSource, /import\s+DataSourcesFooter\s+from\s+['"]\.\/components\/DataSourcesFooter/);
  assert.doesNotMatch(appSource, /<DataSourcesFooter\s*\/>/);
});
