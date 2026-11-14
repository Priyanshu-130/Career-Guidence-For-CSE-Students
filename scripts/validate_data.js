#!/usr/bin/env node
/**
 * Validation script for Phase 4 /data JSON files.
 * Checks schema compliance, broken fields, domain referential integrity,
 * minimum resource coverage, 6-month freshness, and unverified record audit.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_DOMAIN_IDS = ['web', 'ai', 'data', 'cloud', 'security', 'mobile', 'systems'];
const VALID_DEMAND_TRENDS = ['Rising', 'Stable', 'Declining', 'Saturated at entry level'];
const VALID_COSTS = ['free', 'paid'];
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_TYPES = ['course', 'docs', 'youtube', 'book', 'practice', 'project', 'certification'];
const MAX_AGE_DAYS = 183; // ~6 months
const MIN_RESOURCES_PER_DOMAIN = 8;

function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function isNonEmptyStringArray(val) {
  return Array.isArray(val) && val.length > 0 && val.every(isNonEmptyString);
}

function isValidHttpUrl(val) {
  if (!isNonEmptyString(val)) return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseIsoDate(val) {
  if (!isNonEmptyString(val) || !/^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return null;
  }
  const date = new Date(`${val.trim()}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.toISOString().slice(0, 10) !== val.trim()) return null;
  return date;
}

function checkFreshness(dateStr, location, referenceDate, staleEntries, errors) {
  const parsed = parseIsoDate(dateStr);
  if (!parsed) {
    errors.push(`${location}: invalid or missing last_updated date '${dateStr}' (expected YYYY-MM-DD)`);
    return;
  }
  const diffDays = (referenceDate.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > MAX_AGE_DAYS) {
    staleEntries.push({
      location,
      last_updated: dateStr,
      age_days: Math.floor(diffDays),
    });
  }
}

function loadJsonFile(filePath, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required data file: ${filePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    errors.push(`Invalid JSON in ${path.basename(filePath)}: ${err.message}`);
    return null;
  }
}

function validateEnvelope(payload, filename, referenceDate, staleEntries, errors) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    errors.push(`${filename}: root JSON must be an object`);
    return false;
  }
  if (!isNonEmptyString(payload.version)) {
    errors.push(`${filename}: missing or empty top-level 'version'`);
  }
  checkFreshness(payload.last_updated, `${filename} (envelope)`, referenceDate, staleEntries, errors);
  return true;
}

function validateDataFoundation({
  dataDir = path.resolve(__dirname, '..', 'data'),
  referenceDate = new Date(),
} = {}) {
  const refDate = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const errors = [];
  const staleEntries = [];
  const unverifiedEntries = [];

  const domainsPayload = loadJsonFile(path.join(dataDir, 'domains.json'), errors);
  const demandPayload = loadJsonFile(path.join(dataDir, 'market_demand.json'), errors);
  const boostersPayload = loadJsonFile(path.join(dataDir, 'market_boosters.json'), errors);
  const resourcesPayload = loadJsonFile(path.join(dataDir, 'resources.json'), errors);

  const validDomainIds = new Set();
  const resourceCountsByDomain = {};
  REQUIRED_DOMAIN_IDS.forEach((id) => {
    resourceCountsByDomain[id] = 0;
  });

  // 1. Validate domains.json
  if (domainsPayload && validateEnvelope(domainsPayload, 'domains.json', refDate, staleEntries, errors)) {
    if (!Array.isArray(domainsPayload.domains) || domainsPayload.domains.length === 0) {
      errors.push('domains.json: top-level "domains" must be a non-empty array');
    } else {
      domainsPayload.domains.forEach((dom, idx) => {
        const loc = `domains.json[id=${dom?.id || idx}]`;
        if (!dom || typeof dom !== 'object') {
          errors.push(`${loc}: entry must be an object`);
          return;
        }
        if (!isNonEmptyString(dom.id)) {
          errors.push(`${loc}: missing 'id'`);
        } else if (validDomainIds.has(dom.id)) {
          errors.push(`${loc}: duplicate domain id '${dom.id}'`);
        } else {
          validDomainIds.add(dom.id);
        }

        if (!isNonEmptyString(dom.name)) errors.push(`${loc}: missing 'name'`);
        if (!isNonEmptyString(dom.overview)) errors.push(`${loc}: missing 'overview'`);
        if (!isNonEmptyStringArray(dom.core_skills)) errors.push(`${loc}: 'core_skills' must be a non-empty string array`);
        if (!isNonEmptyStringArray(dom.prerequisites)) errors.push(`${loc}: 'prerequisites' must be a non-empty string array`);
        if (!isNonEmptyStringArray(dom.career_paths)) errors.push(`${loc}: 'career_paths' must be a non-empty string array`);
        if (!isNonEmptyString(dom.source)) errors.push(`${loc}: missing 'source'`);
        if (!isValidHttpUrl(dom.source_url)) errors.push(`${loc}: invalid 'source_url'`);
        if (typeof dom.verified !== 'boolean') {
          errors.push(`${loc}: 'verified' must be a boolean`);
        } else if (dom.verified === false) {
          unverifiedEntries.push(loc);
        }
        checkFreshness(dom.last_updated, loc, refDate, staleEntries, errors);
      });
    }
  }

  REQUIRED_DOMAIN_IDS.forEach((reqId) => {
    if (!validDomainIds.has(reqId)) {
      errors.push(`domains.json: missing required domain id '${reqId}'`);
    }
  });

  // 2. Validate market_demand.json
  const demandDomainIds = new Set();
  if (demandPayload && validateEnvelope(demandPayload, 'market_demand.json', refDate, staleEntries, errors)) {
    if (!Array.isArray(demandPayload.market_demand) || demandPayload.market_demand.length === 0) {
      errors.push('market_demand.json: top-level "market_demand" must be a non-empty array');
    } else {
      demandPayload.market_demand.forEach((item, idx) => {
        const loc = `market_demand.json[domain_id=${item?.domain_id || idx}]`;
        if (!item || typeof item !== 'object') {
          errors.push(`${loc}: entry must be an object`);
          return;
        }
        if (!isNonEmptyString(item.domain_id) || !validDomainIds.has(item.domain_id)) {
          errors.push(`${loc}: invalid or unknown 'domain_id'`);
        } else if (demandDomainIds.has(item.domain_id)) {
          errors.push(`${loc}: duplicate 'domain_id'`);
        } else {
          demandDomainIds.add(item.domain_id);
        }

        if (!VALID_DEMAND_TRENDS.includes(item.demand_trend)) {
          errors.push(`${loc}: invalid 'demand_trend' ('${item.demand_trend}')`);
        }

        const sal = item.fresher_salary_range_inr;
        if (!sal || typeof sal !== 'object') {
          errors.push(`${loc}: missing 'fresher_salary_range_inr' object`);
        } else {
          if (typeof sal.min_lpa !== 'number' || Number.isNaN(sal.min_lpa) || sal.min_lpa <= 0) {
            errors.push(`${loc}: 'fresher_salary_range_inr.min_lpa' must be > 0`);
          }
          if (typeof sal.max_lpa !== 'number' || Number.isNaN(sal.max_lpa) || sal.max_lpa < (sal.min_lpa || 0)) {
            errors.push(`${loc}: 'fresher_salary_range_inr.max_lpa' must be >= min_lpa`);
          }
          if (!isNonEmptyString(sal.display)) {
            errors.push(`${loc}: missing 'fresher_salary_range_inr.display'`);
          }
        }

        if (!isNonEmptyStringArray(item.hot_skills)) errors.push(`${loc}: 'hot_skills' must be a non-empty string array`);
        if (!isNonEmptyStringArray(item.saturated_skills)) errors.push(`${loc}: 'saturated_skills' must be a non-empty string array`);
        if (!isNonEmptyString(item.entry_level_reality)) errors.push(`${loc}: missing 'entry_level_reality'`);
        if (!isNonEmptyString(item.source)) errors.push(`${loc}: missing 'source'`);
        if (!isValidHttpUrl(item.source_url)) errors.push(`${loc}: invalid 'source_url'`);
        if (typeof item.verified !== 'boolean') {
          errors.push(`${loc}: 'verified' must be a boolean`);
        } else if (item.verified === false) {
          unverifiedEntries.push(loc);
        }
        checkFreshness(item.last_updated, loc, refDate, staleEntries, errors);
      });
    }
  }

  REQUIRED_DOMAIN_IDS.forEach((reqId) => {
    if (!demandDomainIds.has(reqId)) {
      errors.push(`market_demand.json: missing entry for required domain '${reqId}'`);
    }
  });

  // 3. Validate market_boosters.json
  const boosterDomainIds = new Set();
  if (boostersPayload && validateEnvelope(boostersPayload, 'market_boosters.json', refDate, staleEntries, errors)) {
    if (!Array.isArray(boostersPayload.market_boosters) || boostersPayload.market_boosters.length === 0) {
      errors.push('market_boosters.json: top-level "market_boosters" must be a non-empty array');
    } else {
      boostersPayload.market_boosters.forEach((item, idx) => {
        const loc = `market_boosters.json[domain_id=${item?.domain_id || idx}]`;
        if (!item || typeof item !== 'object') {
          errors.push(`${loc}: entry must be an object`);
          return;
        }
        if (!isNonEmptyString(item.domain_id) || !validDomainIds.has(item.domain_id)) {
          errors.push(`${loc}: invalid or unknown 'domain_id'`);
        } else if (boosterDomainIds.has(item.domain_id)) {
          errors.push(`${loc}: duplicate 'domain_id'`);
        } else {
          boosterDomainIds.add(item.domain_id);
        }

        if (!isNonEmptyStringArray(item.core_skills)) errors.push(`${loc}: 'core_skills' must be a non-empty string array`);
        if (!isNonEmptyStringArray(item.high_value_addons)) errors.push(`${loc}: 'high_value_addons' must be a non-empty string array`);
        if (!isNonEmptyStringArray(item.declining_skills)) errors.push(`${loc}: 'declining_skills' must be a non-empty string array`);

        if (!Array.isArray(item.upgrade_path) || item.upgrade_path.length !== 3) {
          errors.push(`${loc}: 'upgrade_path' must have exactly 3 steps`);
        } else {
          item.upgrade_path.forEach((stepObj, sIdx) => {
            if (!stepObj || stepObj.step !== sIdx + 1 || !isNonEmptyString(stepObj.title) || !isNonEmptyString(stepObj.description)) {
              errors.push(`${loc}: 'upgrade_path[${sIdx}]' must have step=${sIdx + 1}, non-empty title, and description`);
            }
          });
        }

        if (!isNonEmptyString(item.source)) errors.push(`${loc}: missing 'source'`);
        if (!isValidHttpUrl(item.source_url)) errors.push(`${loc}: invalid 'source_url'`);
        if (typeof item.verified !== 'boolean') {
          errors.push(`${loc}: 'verified' must be a boolean`);
        } else if (item.verified === false) {
          unverifiedEntries.push(loc);
        }
        checkFreshness(item.last_updated, loc, refDate, staleEntries, errors);
      });
    }
  }

  REQUIRED_DOMAIN_IDS.forEach((reqId) => {
    if (!boosterDomainIds.has(reqId)) {
      errors.push(`market_boosters.json: missing entry for required domain '${reqId}'`);
    }
  });

  // 4. Validate resources.json
  const resourceIds = new Set();
  let totalResources = 0;
  if (resourcesPayload && validateEnvelope(resourcesPayload, 'resources.json', refDate, staleEntries, errors)) {
    if (!Array.isArray(resourcesPayload.resources) || resourcesPayload.resources.length === 0) {
      errors.push('resources.json: top-level "resources" must be a non-empty array');
    } else {
      totalResources = resourcesPayload.resources.length;
      resourcesPayload.resources.forEach((res, idx) => {
        const loc = `resources.json[id=${res?.id || idx}]`;
        if (!res || typeof res !== 'object') {
          errors.push(`${loc}: entry must be an object`);
          return;
        }
        if (!isNonEmptyString(res.id)) {
          errors.push(`${loc}: missing 'id'`);
        } else if (resourceIds.has(res.id)) {
          errors.push(`${loc}: duplicate resource id '${res.id}'`);
        } else {
          resourceIds.add(res.id);
        }

        if (!isNonEmptyString(res.domain_id) || !validDomainIds.has(res.domain_id)) {
          errors.push(`${loc}: invalid or unknown 'domain_id'`);
        } else {
          resourceCountsByDomain[res.domain_id] = (resourceCountsByDomain[res.domain_id] || 0) + 1;
        }

        if (!isNonEmptyString(res.title)) errors.push(`${loc}: missing 'title'`);
        if (!isNonEmptyString(res.provider)) errors.push(`${loc}: missing 'provider'`);
        if (!isValidHttpUrl(res.url)) errors.push(`${loc}: invalid 'url'`);
        if (!isValidHttpUrl(res.source_url)) errors.push(`${loc}: invalid 'source_url'`);
        if (!VALID_COSTS.includes(res.cost)) errors.push(`${loc}: invalid 'cost' ('${res.cost}')`);
        if (!VALID_LEVELS.includes(res.level)) errors.push(`${loc}: invalid 'level' ('${res.level}')`);
        if (!VALID_TYPES.includes(res.type)) errors.push(`${loc}: invalid 'type' ('${res.type}')`);
        if (typeof res.estimated_hours !== 'number' || Number.isNaN(res.estimated_hours) || res.estimated_hours <= 0) {
          errors.push(`${loc}: 'estimated_hours' must be a positive number`);
        }
        if (!isNonEmptyString(res.language)) errors.push(`${loc}: missing 'language'`);
        if (typeof res.verified !== 'boolean') {
          errors.push(`${loc}: 'verified' must be a boolean`);
        } else if (res.verified === false) {
          unverifiedEntries.push(loc);
        }
        checkFreshness(res.last_updated, loc, refDate, staleEntries, errors);
      });
    }
  }

  REQUIRED_DOMAIN_IDS.forEach((reqId) => {
    const count = resourceCountsByDomain[reqId] || 0;
    if (count < MIN_RESOURCES_PER_DOMAIN) {
      errors.push(`resources.json: domain '${reqId}' has ${count} resources (minimum ${MIN_RESOURCES_PER_DOMAIN} required)`);
    }
  });

  return {
    ok: errors.length === 0 && staleEntries.length === 0,
    errors,
    staleEntries,
    unverifiedEntries,
    summary: {
      domainCount: validDomainIds.size,
      totalResources,
      resourceCountsByDomain,
      referenceDate: refDate.toISOString().slice(0, 10),
    },
  };
}

function runCli() {
  const args = process.argv.slice(2);
  let asOf = new Date();
  const asOfIdx = args.indexOf('--as-of');
  if (asOfIdx !== -1 && args[asOfIdx + 1]) {
    const parsed = parseIsoDate(args[asOfIdx + 1]);
    if (!parsed) {
      console.error(`Invalid --as-of date: ${args[asOfIdx + 1]} (expected YYYY-MM-DD)`);
      process.exit(1);
    }
    asOf = parsed;
  }

  const report = validateDataFoundation({ referenceDate: asOf });

  console.log('=== CSE PathFinder Phase 4 Data Validation ===');
  console.log(`Reference Date: ${report.summary.referenceDate} (max age: ${MAX_AGE_DAYS} days)`);
  console.log(`Domains Verified: ${report.summary.domainCount}/${REQUIRED_DOMAIN_IDS.length}`);
  console.log(`Total Resources: ${report.summary.totalResources}`);
  console.log('Resources per domain:', JSON.stringify(report.summary.resourceCountsByDomain));
  console.log(`Records flagged as verified=false (pending manual verification): ${report.unverifiedEntries.length}`);

  if (report.staleEntries.length > 0) {
    console.error(`\n[STALE > 6 MONTHS] ${report.staleEntries.length} entries older than ${MAX_AGE_DAYS} days:`);
    report.staleEntries.forEach((s) => {
      console.error(`  - ${s.location} (last_updated=${s.last_updated}, age=${s.age_days} days)`);
    });
  }

  if (report.errors.length > 0) {
    console.error(`\n[SCHEMA / FIELD ERRORS] ${report.errors.length} error(s):`);
    report.errors.forEach((e) => console.error(`  - ${e}`));
  }

  if (!report.ok) {
    console.error('\nValidation FAILED.');
    process.exit(1);
  }

  console.log('\nValidation PASSED (0 schema errors, 0 stale entries).');
}

if (require.main === module) {
  runCli();
}

module.exports = {
  validateDataFoundation,
  REQUIRED_DOMAIN_IDS,
  VALID_DEMAND_TRENDS,
  VALID_COSTS,
  VALID_LEVELS,
  VALID_TYPES,
  MAX_AGE_DAYS,
  MIN_RESOURCES_PER_DOMAIN,
};
