import phase4DomainsData from '../../../data/domains.json' with { type: 'json' };
import phase4DemandData from '../../../data/market_demand.json' with { type: 'json' };
import phase4BoostersData from '../../../data/market_boosters.json' with { type: 'json' };
import phase4ResourcesData from '../../../data/resources.json' with { type: 'json' };
import legacyDomainsData from './domains.json' with { type: 'json' };

export const PHASE4_META = {
  version: phase4DomainsData.version || '1.0.0',
  lastUpdated: phase4DomainsData.last_updated || '2026-11-01',
  disclaimer:
    phase4DemandData.disclaimer ||
    'Demand tags and salary figures are indicative estimates based on Indian job boards and industry reports, not guaranteed facts.',
  sources: [
    { label: 'O*NET OnLine', url: 'https://www.onetonline.org/' },
    { label: 'ACM/IEEE CS2023', url: 'https://csed.acm.org/final-report/' },
    { label: 'roadmap.sh', url: 'https://roadmap.sh/' },
    { label: 'Naukri JobSpeak', url: 'https://www.naukri.com/jobspeak' },
    { label: 'LinkedIn Jobs India', url: 'https://www.linkedin.com/jobs/' },
    { label: 'NASSCOM', url: 'https://nasscom.in/knowledge-center/publications' },
    { label: 'Stack Overflow Survey', url: 'https://survey.stackoverflow.co/' },
    { label: 'NPTEL / freeCodeCamp / CS50 / MDN', url: 'https://nptel.ac.in/' },
  ],
};

export const LEGACY_HARDWARE_ALIASES = {
  iot: 'systems',
  robotics: 'systems',
  vlsi: 'systems',
  networking: 'cloud',
};

export function getAllPhase4Domains() {
  const demandByDomain = new Map(
    (phase4DemandData.market_demand || []).map((m) => [m.domain_id, m])
  );
  const boosterByDomain = new Map(
    (phase4BoostersData.market_boosters || []).map((b) => [b.domain_id, b])
  );
  const resourcesByDomain = new Map();
  (phase4ResourcesData.resources || []).forEach((r) => {
    if (!resourcesByDomain.has(r.domain_id)) resourcesByDomain.set(r.domain_id, []);
    resourcesByDomain.get(r.domain_id).push(r);
  });

  return (phase4DomainsData.domains || []).map((dom) => ({
    ...dom,
    marketDemand: demandByDomain.get(dom.id) || null,
    marketBooster: boosterByDomain.get(dom.id) || null,
    resources: resourcesByDomain.get(dom.id) || [],
  }));
}

export function getPhase4DomainBundle(domainId) {
  const rawId = String(domainId || '').trim().toLowerCase();
  if (!rawId) return null;

  const canonicalId = LEGACY_HARDWARE_ALIASES[rawId] || rawId;
  const baseDomain = (phase4DomainsData.domains || []).find((d) => d.id === canonicalId);
  if (!baseDomain) return null;

  const marketDemand =
    (phase4DemandData.market_demand || []).find((m) => m.domain_id === canonicalId) || null;
  const marketBooster =
    (phase4BoostersData.market_boosters || []).find((b) => b.domain_id === canonicalId) || null;
  const resources = (phase4ResourcesData.resources || []).filter(
    (r) => r.domain_id === canonicalId
  );

  let domain = { ...baseDomain, canonicalId };
  if (canonicalId !== rawId) {
    const legacyDom = (legacyDomainsData || []).find((d) => d.id === rawId);
    if (legacyDom) {
      domain = {
        ...baseDomain,
        id: rawId,
        canonicalId,
        name: legacyDom.title || baseDomain.name,
        overview: legacyDom.overview || legacyDom.description || baseDomain.overview,
        prerequisites: legacyDom.prerequisites || baseDomain.prerequisites,
        career_paths: legacyDom.roles || baseDomain.career_paths,
      };
    }
  }

  return {
    domain,
    marketDemand,
    marketBooster,
    resources,
    meta: PHASE4_META,
  };
}

export function filterAndGroupResources(resources = [], { cost = 'all', language = 'all' } = {}) {
  const costFilter = String(cost || 'all').trim().toLowerCase();
  const langFilter = String(language || 'all').trim().toLowerCase();

  const filtered = (Array.isArray(resources) ? resources : []).filter((res) => {
    const matchesCost =
      costFilter === 'all' || String(res?.cost || '').toLowerCase() === costFilter;
    const matchesLang =
      langFilter === 'all' ||
      String(res?.language || '')
        .toLowerCase()
        .includes(langFilter);
    return matchesCost && matchesLang;
  });

  const grouped = {
    beginner: [],
    intermediate: [],
    advanced: [],
    totalCount: filtered.length,
  };

  filtered.forEach((res) => {
    const lvl = String(res?.level || 'beginner').toLowerCase();
    if (lvl === 'advanced') {
      grouped.advanced.push(res);
    } else if (lvl === 'intermediate') {
      grouped.intermediate.push(res);
    } else {
      grouped.beginner.push(res);
    }
  });

  return grouped;
}
