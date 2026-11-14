import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import validator from '../../../scripts/validate_data.js';

const { validateDataFoundation, REQUIRED_DOMAIN_IDS } = validator;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DATA_DIR = path.resolve(__dirname, '../../../data');

test('Phase 4 data files pass schema, integrity, and 6-month freshness checks', () => {
  const report = validateDataFoundation({
    dataDir: ROOT_DATA_DIR,
    referenceDate: new Date('2026-11-14T00:00:00Z'),
  });

  assert.equal(report.ok, true, `Expected validation to pass, errors: ${report.errors.join('; ')}`);
  assert.equal(report.errors.length, 0);
  assert.equal(report.staleEntries.length, 0);
  assert.equal(report.summary.domainCount, 7);
  assert.ok(report.summary.totalResources >= 56);
  REQUIRED_DOMAIN_IDS.forEach((id) => {
    assert.ok(report.summary.resourceCountsByDomain[id] >= 8, `Expected >= 8 resources for ${id}`);
  });
});

test('Phase 4 web market booster includes required full-stack upgrade skills and unverified flags', () => {
  const boosters = JSON.parse(fs.readFileSync(path.join(ROOT_DATA_DIR, 'market_boosters.json'), 'utf8'));
  const webBooster = boosters.market_boosters.find((b) => b.domain_id === 'web');
  assert.ok(webBooster, 'web market booster must exist');

  const addonsJoined = webBooster.high_value_addons.join(' | ').toLowerCase();
  assert.ok(addonsJoined.includes('typescript'));
  assert.ok(addonsJoined.includes('next.js'));
  assert.ok(addonsJoined.includes('node'));
  assert.ok(addonsJoined.includes('postgresql'));
  assert.ok(addonsJoined.includes('testing'));
  assert.ok(addonsJoined.includes('cloud') || addonsJoined.includes('docker'));
  assert.ok(addonsJoined.includes('ai api'));
  assert.equal(webBooster.upgrade_path.length, 3);

  const demand = JSON.parse(fs.readFileSync(path.join(ROOT_DATA_DIR, 'market_demand.json'), 'utf8'));
  const webDemand = demand.market_demand.find((d) => d.domain_id === 'web');
  assert.equal(webDemand.demand_trend, 'Saturated at entry level');
  assert.equal(webDemand.verified, false);
});

test('Validator flags entries older than 6 months when referenceDate advances', () => {
  const report = validateDataFoundation({
    dataDir: ROOT_DATA_DIR,
    referenceDate: new Date('2028-01-01T00:00:00Z'),
  });

  assert.equal(report.ok, false);
  assert.ok(report.staleEntries.length > 0, 'Expected stale entries to be flagged after >6 months');
});

test('Validator detects broken schema fields and invalid foreign keys', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'phase4-val-'));
  try {
    fs.writeFileSync(
      path.join(tmpDir, 'domains.json'),
      JSON.stringify({
        version: '1.0.0',
        last_updated: '2026-11-01',
        domains: [
          {
            id: 'web',
            name: '',
            overview: 'Web overview',
            core_skills: [],
            prerequisites: ['JS'],
            career_paths: ['FE'],
            source: 'test',
            source_url: 'not-a-url',
            last_updated: 'bad-date',
            verified: 'yes',
          },
        ],
      })
    );
    fs.writeFileSync(
      path.join(tmpDir, 'market_demand.json'),
      JSON.stringify({
        version: '1.0.0',
        last_updated: '2026-11-01',
        market_demand: [
          {
            domain_id: 'unknown_domain',
            demand_trend: 'Exploding',
            fresher_salary_range_inr: { min_lpa: 10, max_lpa: 5, display: 'broken' },
            hot_skills: ['React'],
            saturated_skills: ['HTML'],
            entry_level_reality: 'Competitive',
            source: 'test',
            source_url: 'https://example.com',
            last_updated: '2026-11-01',
            verified: false,
          },
        ],
      })
    );
    fs.writeFileSync(
      path.join(tmpDir, 'market_boosters.json'),
      JSON.stringify({ version: '1.0.0', last_updated: '2026-11-01', market_boosters: [] })
    );
    fs.writeFileSync(
      path.join(tmpDir, 'resources.json'),
      JSON.stringify({
        version: '1.0.0',
        last_updated: '2026-11-01',
        resources: [
          {
            id: 'r1',
            domain_id: 'web',
            title: 'Test',
            provider: 'MDN',
            url: 'https://developer.mozilla.org/',
            source_url: 'https://developer.mozilla.org/',
            cost: 'free',
            level: 'beginner',
            type: 'docs',
            estimated_hours: -5,
            language: 'English',
            last_updated: '2026-11-01',
            verified: true,
          },
        ],
      })
    );

    const report = validateDataFoundation({
      dataDir: tmpDir,
      referenceDate: new Date('2026-11-14T00:00:00Z'),
    });

    assert.equal(report.ok, false);
    assert.ok(report.errors.some((e) => e.includes("missing 'name'")));
    assert.ok(report.errors.some((e) => e.includes("invalid 'source_url'")));
    assert.ok(report.errors.some((e) => e.includes("invalid or unknown 'domain_id'")));
    assert.ok(report.errors.some((e) => e.includes("invalid 'demand_trend'")));
    assert.ok(report.errors.some((e) => e.includes('max_lpa')));
    assert.ok(report.errors.some((e) => e.includes('estimated_hours')));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
