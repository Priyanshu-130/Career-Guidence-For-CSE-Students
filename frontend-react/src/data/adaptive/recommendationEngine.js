/**
 * Phase 6 Single-Domain Recommendation Engine
 *
 * Computes a deterministic weighted sum across three factors:
 *   Final Score = w_riasec * RIASEC_Match + w_readiness * Knowledge_Readiness + w_demand * India_Market_Demand
 * Default weights and trend-to-score mappings live in ./recommendation_config.json.
 * Ties on final score are broken deterministically in favor of higher RIASEC match.
 */

import recommendationConfig from './recommendation_config.json' with { type: 'json' };
import domainMappingConfig from './domain_mapping_version.json' with { type: 'json' };
import phase4DemandData from '../../../../data/market_demand.json' with { type: 'json' };
import phase4DomainsData from '../../../../data/domains.json' with { type: 'json' };
import legacyDomainsData from '../domains.json' with { type: 'json' };

export const RECOMMENDATION_CONFIG = recommendationConfig;

export const LEGACY_TO_PHASE4_DOMAIN = {
  iot: 'systems',
  robotics: 'systems',
  vlsi: 'systems',
  networking: 'cloud',
};

const FALLBACK_RIASEC_WEIGHTS = {
  systems: { R: 88, I: 84, A: 20, S: 20, E: 35, C: 78 },
  mobile: { R: 75, I: 58, A: 85, S: 45, E: 60, C: 55 },
};

const RIASEC_BY_DOMAIN_ID = (() => {
  const map = { ...FALLBACK_RIASEC_WEIGHTS };
  (domainMappingConfig?.domains || []).forEach((d) => {
    const id = String(d.canonical_id || d.domain_id || d.id || '').toLowerCase();
    if (id && d.riasec_weights) {
      map[id] = d.riasec_weights;
    }
  });
  return map;
})();

const PHASE4_DEMAND_BY_ID = new Map(
  (phase4DemandData?.market_demand || []).map((entry) => [entry.domain_id, entry])
);

const PHASE4_DOMAIN_BY_ID = new Map(
  (phase4DomainsData?.domains || []).map((entry) => [entry.id, entry])
);

const LEGACY_DOMAIN_BY_ID = new Map(
  (Array.isArray(legacyDomainsData) ? legacyDomainsData : []).map((entry) => [entry.id, entry])
);

function clamp01(val) {
  const num = Number(val);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(1, num));
}

export function normalizeUnitScore(value, maxScale = 100) {
  if (value && typeof value === 'object' && value.level !== undefined) {
    const maxLvl = Number(value.maxLevel) || 4;
    return clamp01(Number(value.level) / maxLvl);
  }
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  if (num > 1) {
    return clamp01(num / maxScale);
  }
  return clamp01(num);
}

/**
 * Maps a demand trend string to its configured score in [0, 1].
 * Default config: Rising=1.0, Stable=0.7, Saturated=0.4, Declining=0.2.
 */
export function getDemandTrendScore(trend, config = recommendationConfig) {
  const mapping =
    config?.demand_trend_scores || recommendationConfig.demand_trend_scores || {};
  const raw = String(trend || '').trim();
  if (!raw) {
    return mapping.Stable ?? 0.7;
  }

  if (Object.prototype.hasOwnProperty.call(mapping, raw)) {
    return Number(mapping[raw]);
  }

  const lower = raw.toLowerCase();
  for (const [label, score] of Object.entries(mapping)) {
    if (label.toLowerCase() === lower) {
      return Number(score);
    }
  }

  if (lower.includes('saturated')) return Number(mapping.Saturated ?? 0.4);
  if (lower.includes('rising')) return Number(mapping.Rising ?? 1.0);
  if (lower.includes('declining')) return Number(mapping.Declining ?? 0.2);
  if (lower.includes('stable')) return Number(mapping.Stable ?? 0.7);

  return Number(mapping.Stable ?? 0.7);
}

export function getDomainRiasecWeights(domainId) {
  const key = String(domainId || '').trim().toLowerCase();
  return (
    RIASEC_BY_DOMAIN_ID[key] ||
    RIASEC_BY_DOMAIN_ID[LEGACY_TO_PHASE4_DOMAIN[key]] ||
    { R: 70, I: 75, A: 40, S: 35, E: 50, C: 70 }
  );
}

/**
 * Computes RIASEC similarity using the existing 6-dimensional Euclidean distance formula.
 * Returns normalized unit score in [0, 1], percentage in [0, 100], and Euclidean distance.
 */
export function computeRiasecEuclideanMatch(userRiasec = {}, domainRiasecWeights = {}) {
  const dims = ['R', 'I', 'A', 'S', 'E', 'C'];
  let sumSq = 0;

  for (const dim of dims) {
    const userVal =
      userRiasec && userRiasec[dim] !== undefined ? Number(userRiasec[dim]) : 50;
    const targetVal =
      domainRiasecWeights && domainRiasecWeights[dim] !== undefined
        ? Number(domainRiasecWeights[dim])
        : 50;
    sumSq += Math.pow(userVal - targetVal, 2);
  }

  const dist = Math.sqrt(sumSq);
  const maxDist = Math.sqrt(dims.length * Math.pow(100, 2)); // ~244.95
  const scorePct = Math.max(0, Math.min(100, 100 - (dist / maxDist) * 100));
  const score = scorePct / 100;

  return {
    score: Number(score.toFixed(6)),
    scorePct: Number(scorePct.toFixed(1)),
    distance: Number(dist.toFixed(2)),
  };
}

function getEffectiveWeights(config = recommendationConfig) {
  const raw = config?.weights || recommendationConfig.weights || {};
  const riasec = Number(raw.riasec ?? 0.4);
  const readiness = Number(raw.readiness ?? 0.3);
  const market_demand = Number(raw.market_demand ?? 0.3);
  return { riasec, readiness, market_demand };
}

function resolveCandidateMetadata(domainId, candidate) {
  const normId = String(domainId || candidate.id || '').trim().toLowerCase();
  const phase4Id = LEGACY_TO_PHASE4_DOMAIN[normId] || normId;
  const phase4Domain = PHASE4_DOMAIN_BY_ID.get(phase4Id);
  const phase4Demand = PHASE4_DEMAND_BY_ID.get(phase4Id);
  const legacyDomain = LEGACY_DOMAIN_BY_ID.get(normId);

  const title =
    candidate.title ||
    candidate.name ||
    legacyDomain?.title ||
    phase4Domain?.name ||
    normId.toUpperCase();

  const overview =
    candidate.summary ||
    candidate.overview ||
    candidate.description ||
    legacyDomain?.description ||
    phase4Domain?.overview ||
    '';

  const demandTrend =
    candidate.demandTrend ||
    candidate.demand_trend ||
    phase4Demand?.demand_trend ||
    'Stable';

  const fresherSalaryDisplay =
    candidate.fresherSalaryDisplay ||
    phase4Demand?.fresher_salary_range_inr?.display ||
    null;

  return {
    domainId: normId,
    phase4DomainId: phase4Id,
    title,
    overview,
    demandTrend,
    fresherSalaryDisplay,
  };
}

export function scoreDomainCandidate(candidate, config = recommendationConfig) {
  const weights = getEffectiveWeights(config);
  const meta = resolveCandidateMetadata(candidate.domainId || candidate.id, candidate);

  // 1. RIASEC match in [0, 1]
  let riasecScore;
  let riasecDistance = candidate.riasecDistance ?? null;
  if (candidate.riasecScore !== undefined) {
    riasecScore = normalizeUnitScore(candidate.riasecScore);
  } else if (candidate.riasecMatch !== undefined) {
    riasecScore = normalizeUnitScore(candidate.riasecMatch);
  } else if (candidate.riasecPct !== undefined) {
    riasecScore = clamp01(Number(candidate.riasecPct) / 100);
  } else {
    const targetWeights =
      candidate.riasecWeights || getDomainRiasecWeights(meta.domainId);
    const euclid = computeRiasecEuclideanMatch(candidate.userRiasec, targetWeights);
    riasecScore = euclid.score;
    riasecDistance = euclid.distance;
  }

  // 2. Knowledge-ladder readiness in [0, 1]
  let readinessScore;
  if (candidate.readinessScore !== undefined) {
    readinessScore = normalizeUnitScore(candidate.readinessScore);
  } else if (candidate.readinessPct !== undefined) {
    readinessScore = clamp01(Number(candidate.readinessPct) / 100);
  } else if (candidate.ladderLevel !== undefined) {
    readinessScore = clamp01(
      Number(candidate.ladderLevel) / (Number(candidate.maxLadderLevel) || 4)
    );
  } else if (candidate.knowledgeScore !== undefined) {
    readinessScore = normalizeUnitScore(candidate.knowledgeScore);
  } else {
    readinessScore = 0.25;
  }

  // 3. India market demand score in [0, 1]
  const marketDemandScore =
    candidate.marketDemandScore !== undefined
      ? normalizeUnitScore(candidate.marketDemandScore)
      : getDemandTrendScore(meta.demandTrend, config);

  const riasecContribution = Number((weights.riasec * riasecScore).toFixed(6));
  const readinessContribution = Number((weights.readiness * readinessScore).toFixed(6));
  const marketDemandContribution = Number(
    (weights.market_demand * marketDemandScore).toFixed(6)
  );
  const finalScore = Number(
    (riasecContribution + readinessContribution + marketDemandContribution).toFixed(6)
  );

  const riasecScorePct = Number((riasecScore * 100).toFixed(1));
  const readinessScorePct = Number((readinessScore * 100).toFixed(1));
  const marketDemandScorePct = Number((marketDemandScore * 100).toFixed(1));
  const finalScorePct = Number((finalScore * 100).toFixed(1));

  return {
    domainId: meta.domainId,
    phase4DomainId: meta.phase4DomainId,
    title: meta.title,
    overview: meta.overview,
    riasecScore: Number(riasecScore.toFixed(6)),
    riasecScorePct,
    riasecDistance,
    readinessScore: Number(readinessScore.toFixed(6)),
    readinessScorePct,
    readinessSource: candidate.readinessSource || 'Knowledge-Ladder Readiness',
    demandTrend: meta.demandTrend,
    fresherSalaryDisplay: meta.fresherSalaryDisplay,
    marketDemandScore: Number(marketDemandScore.toFixed(6)),
    marketDemandScorePct,
    weights,
    contributions: {
      riasec: riasecContribution,
      readiness: readinessContribution,
      market_demand: marketDemandContribution,
      riasecPct: Number((riasecContribution * 100).toFixed(1)),
      readinessPct: Number((readinessContribution * 100).toFixed(1)),
      marketDemandPct: Number((marketDemandContribution * 100).toFixed(1)),
    },
    finalScore,
    finalScorePct,
    formulaText: `(${weights.riasec} × ${riasecScorePct}%) + (${weights.readiness} × ${readinessScorePct}%) + (${weights.market_demand} × ${marketDemandScorePct}%) = ${finalScorePct}%`,
  };
}

function buildWhyThisOneBullets(top, weights) {
  const bullets = [
    `RIASEC Profile Match (${top.riasecScorePct}%, weight ${weights.riasec}): Strongest overall alignment with your problem-solving and work-style interests via Euclidean O*NET distance.`,
    `Knowledge-Ladder Readiness (${top.readinessScorePct}%, weight ${weights.readiness}): Calibrated directly from your verified ${top.readinessSource.toLowerCase()} without guesswork.`,
    `India Market Demand (${top.demandTrend} = ${top.marketDemandScorePct}%, weight ${weights.market_demand}): ${
      top.fresherSalaryDisplay
        ? `Indicative fresher range of ${top.fresherSalaryDisplay} across Indian job boards.`
        : `Reflected by current entry-level hiring signals in India.`
    }`,
  ];
  return bullets.slice(0, 3);
}

function buildWhyRankedLowerReason(cand, top) {
  const eps = 1e-9;
  if (Math.abs(top.finalScore - cand.finalScore) <= eps) {
    if (Math.abs(top.riasecScore - cand.riasecScore) > eps) {
      return `Tied with ${top.title} on weighted final score (${cand.finalScorePct}%), so ${top.title} won the deterministic tie-breaker with a higher RIASEC match (${top.riasecScorePct}% vs ${cand.riasecScorePct}%).`;
    }
    if (Math.abs(top.readinessScore - cand.readinessScore) > eps) {
      return `Tied with ${top.title} on final score (${cand.finalScorePct}%) and RIASEC match (${cand.riasecScorePct}%), but ranked lower on knowledge-ladder readiness (${cand.readinessScorePct}% vs ${top.readinessScorePct}%).`;
    }
    return `Tied with ${top.title} across weighted components (${cand.finalScorePct}%), ordered deterministically after ${top.title}.`;
  }

  const gapPct = (top.finalScorePct - cand.finalScorePct).toFixed(1);
  const gaps = [];
  if (cand.riasecScorePct < top.riasecScorePct) {
    gaps.push(`lower RIASEC match (${cand.riasecScorePct}% vs ${top.riasecScorePct}%)`);
  }
  if (cand.readinessScorePct < top.readinessScorePct) {
    gaps.push(`lower readiness (${cand.readinessScorePct}% vs ${top.readinessScorePct}%)`);
  }
  if (cand.marketDemandScorePct < top.marketDemandScorePct) {
    gaps.push(
      `lower India market demand (${cand.demandTrend}: ${cand.marketDemandScorePct}% vs ${top.demandTrend}: ${top.marketDemandScorePct}%)`
    );
  }

  const reasonSuffix =
    gaps.length > 0
      ? `driven by ${gaps.join(', ')}`
      : `due to smaller combined weighted contribution`;
  return `Scored ${gapPct} pts below ${top.title} (${cand.finalScorePct}% vs ${top.finalScorePct}%), ${reasonSuffix}.`;
}

/**
 * Scores, ranks, breaks ties deterministically (higher RIASEC match wins),
 * and selects strictly ONE recommended domain plus audit explanations.
 */
export function recommendSingleDomain(candidates = [], config = recommendationConfig) {
  const weights = getEffectiveWeights(config);
  const trendScores =
    config?.demand_trend_scores || recommendationConfig.demand_trend_scores;

  const list = Array.isArray(candidates) ? candidates : [];
  if (list.length === 0) {
    return {
      topDomain: null,
      whyThisOne: [],
      rankedDomains: [],
      lowerRankedDomains: [],
      weights,
      demandTrendScores: trendScores,
    };
  }

  const scored = list.map((cand) => scoreDomainCandidate(cand, config));

  const eps = 1e-9;
  scored.sort((a, b) => {
    if (Math.abs(b.finalScore - a.finalScore) > eps) {
      return b.finalScore - a.finalScore;
    }
    // Deterministic tie-breaker: higher RIASEC match wins
    if (Math.abs(b.riasecScore - a.riasecScore) > eps) {
      return b.riasecScore - a.riasecScore;
    }
    if (Math.abs(b.readinessScore - a.readinessScore) > eps) {
      return b.readinessScore - a.readinessScore;
    }
    if (Math.abs(b.marketDemandScore - a.marketDemandScore) > eps) {
      return b.marketDemandScore - a.marketDemandScore;
    }
    return String(a.domainId).localeCompare(String(b.domainId));
  });

  const rankedDomains = scored.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const topDomain = rankedDomains[0];
  const whyThisOne = buildWhyThisOneBullets(topDomain, weights);

  const lowerRankedDomains = rankedDomains.slice(1).map((cand) => ({
    ...cand,
    whyRankedLower: buildWhyRankedLowerReason(cand, topDomain),
  }));

  return {
    topDomain,
    whyThisOne,
    rankedDomains,
    lowerRankedDomains,
    weights,
    demandTrendScores: trendScores,
  };
}

const DOMAIN_TOPIC_MAP = {
  ai: ['python', 'bebras_logic', 'logic'],
  data: ['python', 'sql', 'bebras_logic'],
  web: ['javascript', 'html', 'python', 'sql', 'bebras_logic'],
  security: ['java', 'python', 'bebras_logic', 'linux'],
  cloud: ['java', 'python', 'sql', 'bebras_logic', 'linux'],
  mobile: ['java', 'javascript', 'python', 'bebras_logic'],
  systems: ['java', 'python', 'bebras_logic', 'c'],
  iot: ['java', 'python', 'bebras_logic', 'c'],
  robotics: ['python', 'java', 'bebras_logic'],
  vlsi: ['java', 'bebras_logic'],
  networking: ['java', 'python', 'bebras_logic'],
};

function deriveUserRiasecFromDomainInterests(interestWeightsByDomain, domainIds) {
  const dims = ['R', 'I', 'A', 'S', 'E', 'C'];
  const entries = domainIds.map((id) => ({
    id,
    raw: Math.max(0, Number(interestWeightsByDomain?.[id] ?? 0)),
  }));

  const minRaw = Math.min(...entries.map((e) => e.raw));
  const useExcess = entries.some((e) => e.raw > minRaw);
  const weightedEntries = entries.map((e) => ({
    id: e.id,
    weight: useExcess ? e.raw - minRaw : e.raw || 1,
  }));

  const totalWeight = weightedEntries.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) {
    return { R: 65, I: 75, A: 40, S: 35, E: 45, C: 65 };
  }

  const vector = {};
  for (const dim of dims) {
    let acc = 0;
    for (const { id, weight } of weightedEntries) {
      if (weight <= 0) continue;
      const domWeights = getDomainRiasecWeights(id);
      acc += (domWeights[dim] ?? 50) * weight;
    }
    vector[dim] = Number((acc / totalWeight).toFixed(2));
  }
  return vector;
}

function normalizeTrackInterestInput(source, track) {
  const trackDomains =
    track === 'hardware'
      ? ['iot', 'robotics', 'vlsi', 'networking']
      : ['ai', 'data', 'web', 'security', 'cloud', 'systems'];

  const clusterToDomain =
    track === 'hardware'
      ? { A: 'iot', B: 'robotics', C: 'vlsi', D: 'networking' }
      : { A: 'ai', B: 'data', C: 'web', D: 'security', E: 'cloud', F: 'systems' };

  const out = {};
  trackDomains.forEach((id) => {
    out[id] = 0;
  });

  if (source && typeof source === 'object') {
    Object.entries(source).forEach(([k, v]) => {
      const lower = String(k).toLowerCase();
      if (trackDomains.includes(lower)) {
        out[lower] = Number(v) || 0;
      } else if (clusterToDomain[k]) {
        out[clusterToDomain[k]] = Number(v) || 0;
      }
    });
  }

  return { trackDomains, rawInterest: out };
}

function computeDomainReadiness({
  domId,
  sessionOrResults,
  mastery,
  fallbackKnowledgeScore,
}) {
  const topicKeys = DOMAIN_TOPIC_MAP[domId] || ['python', 'bebras_logic'];
  const matchedLevels = [];

  if (mastery && typeof mastery === 'object') {
    topicKeys.forEach((tKey) => {
      const entry = mastery[tKey];
      if (entry && typeof entry.level === 'number') {
        matchedLevels.push(clamp01(entry.level / 4));
      }
    });
  }

  const ladderLevel = sessionOrResults?.currentLadderLevel;
  const domainAttempts =
    sessionOrResults?.knowledgeScores?.domainAttempts?.[domId] ??
    sessionOrResults?.prerequisiteProfile?.verificationItemsAttempted ??
    0;

  if (matchedLevels.length > 0) {
    const avg = matchedLevels.reduce((s, v) => s + v, 0) / matchedLevels.length;
    return {
      readinessScore: Number(avg.toFixed(6)),
      readinessSource: 'Topic Mastery Ladder',
    };
  }

  if (typeof ladderLevel === 'number') {
    const ladderUnit = clamp01(ladderLevel / 4);
    if (domainAttempts > 0 && typeof fallbackKnowledgeScore === 'number') {
      const knowUnit = clamp01(fallbackKnowledgeScore / 100);
      const blended = 0.5 * ladderUnit + 0.5 * knowUnit;
      return {
        readinessScore: Number(blended.toFixed(6)),
        readinessSource: `Knowledge Ladder Level ${ladderLevel}/4 & Domain Probes`,
      };
    }
    return {
      readinessScore: Number(ladderUnit.toFixed(6)),
      readinessSource: `Knowledge Ladder Level ${ladderLevel}/4`,
    };
  }

  if (typeof fallbackKnowledgeScore === 'number') {
    return {
      readinessScore: clamp01(fallbackKnowledgeScore / 100),
      readinessSource: 'Verified Domain Knowledge',
    };
  }

  return {
    readinessScore: 0.25,
    readinessSource: 'Foundational Baseline (Level 1/4)',
  };
}

/**
 * Builds Phase 6 single-domain weighted recommendation from an advisor session or stored result.
 */
export function buildPhase6RecommendationFromSession(
  sessionOrResults = {},
  config = recommendationConfig
) {
  const track = sessionOrResults?.track === 'hardware' ? 'hardware' : 'software';
  const rawSource =
    sessionOrResults?.rawInterestScores ||
    sessionOrResults?.interestScores ||
    sessionOrResults?.domainInterestScores ||
    sessionOrResults?.all_scores ||
    {};

  const { trackDomains, rawInterest } = normalizeTrackInterestInput(rawSource, track);
  const profilesById = new Map(
    (sessionOrResults?.domainProfiles || []).map((p) => [p.domainId, p])
  );

  // If explicit domainProfiles exist without raw interest, fall back to profile interestScore
  if (
    trackDomains.every((id) => rawInterest[id] === 0) &&
    profilesById.size > 0
  ) {
    trackDomains.forEach((id) => {
      rawInterest[id] = profilesById.get(id)?.interestScore ?? 25;
    });
  }

  const userRiasec =
    sessionOrResults?.userRiasec ||
    deriveUserRiasecFromDomainInterests(rawInterest, trackDomains);

  const mastery =
    sessionOrResults?.adaptiveMastery || sessionOrResults?.mastery || null;

  const candidates = trackDomains.map((domId) => {
    const profile = profilesById.get(domId);
    const fallbackKnowledge =
      profile?.knowledgeScore ??
      sessionOrResults?.domainKnowledgeScores?.[domId];
    const { readinessScore, readinessSource } = computeDomainReadiness({
      domId,
      sessionOrResults,
      mastery,
      fallbackKnowledgeScore: fallbackKnowledge,
    });

    return {
      domainId: domId,
      title: profile?.title,
      overview: profile?.summary,
      userRiasec,
      riasecWeights: getDomainRiasecWeights(domId),
      readinessScore,
      readinessSource,
    };
  });

  return recommendSingleDomain(candidates, config);
}
