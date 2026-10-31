/**
 * Configuration Handler & Model Honesty Manager for CSE PathFinder
 *
 * Rules:
 * - Rule-based engine stays the default production engine.
 * - Random Forest is explicitly labeled "experimental" in all configs and UI views.
 * - Terminology is strictly "Match Score" — never "probability" or "accuracy" unless model is calibrated on real outcomes.
 * - Multi-component weights: Interest (35%) + Self-Report (35%) + Technical Readiness (30%).
 * - Fallback for unassessed students: 50% interest + 50% self-report with note that assessment is pending.
 */

export const ENGINES = {
  RULE_BASED: {
    id: 'rule_based',
    name: 'Standard Rule-Based Engine',
    version: '2.0.0',
    status: 'production',
    isExperimental: false,
    label: 'Standard Heuristic Engine (O*NET Baseline)',
    weights: {
      interest: 0.35,
      self_report: 0.35,
      technical_readiness: 0.30
    },
    displayMetric: 'Match Score',
    description: 'Deterministic, transparent, multi-component alignment driven by O*NET RIASEC vectors and verified knowledge ladder evidence.'
  },
  RANDOM_FOREST: {
    id: 'random_forest',
    name: 'Random Forest Model',
    version: '1.0.0-experimental',
    status: 'experimental',
    isExperimental: true,
    label: 'Experimental Random Forest Model',
    displayMetric: 'Match Score',
    caveat: 'Trained on synthetic benchmark data (20,000 rows). Evaluates historical pattern approximations for research and exploratory comparison only.',
    modelCardPath: 'ml/MODEL_CARD.md'
  }
};

let activeEngineId = 'rule_based'; // Rule-based is strictly the production default

export function getActiveEngine() {
  return ENGINES[activeEngineId.toUpperCase()] || ENGINES.RULE_BASED;
}

export function setActiveEngine(engineId) {
  const norm = String(engineId || '').toLowerCase();
  if (norm === 'random_forest' || norm === 'rf') {
    activeEngineId = 'random_forest';
  } else {
    activeEngineId = 'rule_based';
  }
  return getActiveEngine();
}

/**
 * Ensures terminology compliance: strictly "Match Score", prohibiting "probability" or "accuracy"
 * unless calibrated on empirical longitudinal student outcomes.
 */
export function getMetricLabel() {
  return 'Match Score';
}

/**
 * Calculates domain composite score:
 * - Interest score: 35%
 * - Self-reported profile: 35%
 * - Verified technical readiness: 30%
 *
 * Fallback: If verified technical score is not available (unassessed student),
 * blend 50% interest and 50% self-report with fallback flag.
 */
export function calculateCompositeDomainScore(interestScore, selfReportScore, verifiedTechnicalScore = null) {
  const interest = Number(interestScore ?? 50);
  const selfReport = Number(selfReportScore ?? 50);

  if (verifiedTechnicalScore !== null && verifiedTechnicalScore !== undefined) {
    const technical = Number(verifiedTechnicalScore);
    const composite = (0.35 * interest) + (0.35 * selfReport) + (0.30 * technical);
    return {
      score: Number(Math.max(0, Math.min(100, composite)).toFixed(1)),
      metric: getMetricLabel(),
      components: {
        interest_contribution: Number((0.35 * interest).toFixed(1)),
        self_report_contribution: Number((0.35 * selfReport).toFixed(1)),
        technical_readiness_contribution: Number((0.30 * technical).toFixed(1))
      },
      hasVerifiedReadiness: true,
      engine: getActiveEngine().name,
      isExperimental: getActiveEngine().isExperimental
    };
  }

  // Fallback for students without adaptive assessments
  const fallbackScore = (0.50 * interest) + (0.50 * selfReport);
  return {
    score: Number(Math.max(0, Math.min(100, fallbackScore)).toFixed(1)),
    metric: getMetricLabel(),
    components: {
      interest_contribution: Number((0.50 * interest).toFixed(1)),
      self_report_contribution: Number((0.50 * selfReport).toFixed(1)),
      technical_readiness_contribution: null
    },
    hasVerifiedReadiness: false,
    note: 'Technical readiness pending adaptive ladder assessment; running on 50/50 interest and self-report baseline.',
    engine: getActiveEngine().name,
    isExperimental: getActiveEngine().isExperimental
  };
}
