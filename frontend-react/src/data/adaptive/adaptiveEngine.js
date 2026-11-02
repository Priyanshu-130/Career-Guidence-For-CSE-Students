/**
 * Pure Engine Logic for Topic-Level Adaptive Assessment & Career Domain Mapping
 *
 * Rules:
 * - Pure, unit-testable functions
 * - Driven strictly by rules_version and domain_mapping_version configurations
 * - Strict separation of Knowledge (correctness) and Interest (preference & behavior)
 * - Deterministic routing: ladder promotion after 2 consecutive correct, demotion after 2 consecutive wrong
 * - Interest-to-Domain mapping is versioned as "hypothesis v1", never as a final verdict
 * - Top 3 domains always presented with plain-language hypothesis disclaimer
 * - Behavior adjustments capped at +/- 20%
 * - Feedback collection for recalibration ("Does this feel right? (1-5)")
 */

import defaultRulesConfig from './rules_version.json' with { type: 'json' };
import defaultMappingConfig from './domain_mapping_version.json' with { type: 'json' };

/**
 * Validates a single item or an entire item bank against licensing and schema rules.
 */
export function validateItemBank(items, allowedLicenses = []) {
  const errors = [];
  const requiredFields = [
    'id',
    'topicId',
    'type',              // 'interest' | 'logic' | 'knowledge' | 'guided_activity' | 'prerequisite'
    'difficulty',        // 'basic' | 'medium' | 'hard' or 1, 2, 3, 4
    'questionText',
    'options',           // Array of { key, text, ... }
    'source',
    'sourceUrl',
    'license',
    'attributionText',
    'modified'           // boolean
  ];

  const validTypes = new Set(['interest', 'logic', 'knowledge', 'guided_activity', 'prerequisite']);
  const validDifficulties = new Set(['basic', 'medium', 'hard', 1, 2, 3, 4]);

  if (!Array.isArray(items)) {
    return { valid: false, errors: ['Item bank must be an array of question items.'] };
  }

  const seenIds = new Set();

  items.forEach((item, idx) => {
    const itemPrefix = `Item [index ${idx}, id: ${item?.id || 'unknown'}]:`;

    // 1. Required fields presence
    for (const field of requiredFields) {
      if (item[field] === undefined || item[field] === null || item[field] === '') {
        errors.push(`${itemPrefix} Missing required field '${field}'.`);
      }
    }

    // 2. ID uniqueness
    if (item.id) {
      if (seenIds.has(item.id)) {
        errors.push(`${itemPrefix} Duplicate item ID '${item.id}'.`);
      }
      seenIds.add(item.id);
    }

    // 3. Type & Difficulty validation
    if (item.type && !validTypes.has(item.type)) {
      errors.push(`${itemPrefix} Invalid item type '${item.type}'. Must be one of: ${[...validTypes].join(', ')}.`);
    }
    if (item.difficulty && !validDifficulties.has(item.difficulty)) {
      errors.push(`${itemPrefix} Invalid difficulty '${item.difficulty}'. Must be basic, medium, hard, or 1-4.`);
    }

    // 4. Options validation
    if (!Array.isArray(item.options) || item.options.length < 2) {
      errors.push(`${itemPrefix} Must have an array of at least 2 options.`);
    }

    // 5. Correct answer check for knowledge, logic, and prerequisite items
    if (['knowledge', 'logic', 'prerequisite'].includes(item.type)) {
      if (!item.correctOption && item.correctOption !== 0 && !item.answer) {
        errors.push(`${itemPrefix} Objective items of type '${item.type}' must specify 'correctOption' or 'answer'.`);
      }
      if (!item.explanation) {
        errors.push(`${itemPrefix} Items of type '${item.type}' must include an 'explanation'.`);
      }
    }

    // 6. Strict Source & License Checks
    if (typeof item.modified !== 'boolean') {
      errors.push(`${itemPrefix} Field 'modified' must be a boolean indicating whether content was adapted.`);
    }

    if (item.source && item.source.toLowerCase().includes('codehs')) {
      errors.push(`${itemPrefix} CodeHS content cannot be copied directly (no confirmed open license). External links or original activities only.`);
    }

    if (allowedLicenses.length > 0 && item.license && !allowedLicenses.includes(item.license)) {
      errors.push(`${itemPrefix} License '${item.license}' is not in the list of recognized educational open licenses.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates item counts for a quiz of target total questions according to configured percentage mix.
 */
export function computeQuizMix(level, totalQuestions, config = defaultRulesConfig) {
  const levelKey = String(level);
  const levelConfig = config?.quiz_mix?.[levelKey] ||
                      config?.quiz_mix?.[level] ||
                      (level === 0 || level === 1 ? config?.quiz_mix?.basic :
                       level === 2 ? config?.quiz_mix?.medium :
                       level >= 3 ? config?.quiz_mix?.hard : config?.quiz_mix?.basic);

  const targets = levelConfig?.target_percentages || {
    interest: 55,
    logic: 25,
    knowledge: 5,
    guided_activity: 15
  };

  const rawCounts = {
    interest: (targets.interest / 100) * totalQuestions,
    logic: (targets.logic / 100) * totalQuestions,
    knowledge: (targets.knowledge / 100) * totalQuestions,
    guided_activity: (targets.guided_activity / 100) * totalQuestions
  };

  // Deterministic integer rounding with remainder assignment to dominant category
  const counts = {
    interest: Math.floor(rawCounts.interest),
    logic: Math.floor(rawCounts.logic),
    knowledge: Math.floor(rawCounts.knowledge),
    guided_activity: Math.floor(rawCounts.guided_activity)
  };

  const allocated = counts.interest + counts.logic + counts.knowledge + counts.guided_activity;
  const remaining = totalQuestions - allocated;

  const dominantCategory = Object.keys(targets).reduce((a, b) => targets[a] > targets[b] ? a : b);
  counts[dominantCategory] += remaining;

  return counts;
}

/**
 * Evaluates starter diagnostic answers to separate "zero exposure + strong logic" from "zero exposure + weak logic".
 */
export function diagnosticScore(starterAnswers, bank = null, config = defaultRulesConfig) {
  if (!starterAnswers || !Array.isArray(starterAnswers) || starterAnswers.length === 0) {
    return {
      logicScore: 0.0,
      category: 'weak_logic',
      recommendedStartingLevelForZeroExposure: 0,
      correctLogicCount: 0,
      totalLogicCount: 0,
      dontKnowCount: 0
    };
  }

  const questionsList = Array.isArray(bank) ? bank : (bank?.questions || []);
  const questionMap = new Map(questionsList.map(q => [q.id, q]));

  let correctLogic = 0;
  let totalLogic = 0;
  let dontKnowCount = 0;

  starterAnswers.forEach(ans => {
    const qMeta = questionMap.get(ans.questionId) || {};
    const isLogic = ans.category === 'logic' ||
                    ans.type === 'logic' ||
                    qMeta.category === 'logic' ||
                    qMeta.type === 'logic' ||
                    (ans.questionId && (ans.questionId.includes('logic') || ans.questionId.includes('pattern') || ans.questionId.includes('loop') || ans.questionId.includes('step')));

    const isDontKnow = ans.isDontKnow ||
                       ans.selectedAnswer === "I don't know / haven't learned this yet" ||
                       ans.selectedOption === "I don't know / haven't learned this yet";

    if (isDontKnow) {
      dontKnowCount += 1;
    }

    if (isLogic) {
      totalLogic += 1;
      let correct = false;
      if (typeof ans.isCorrect === 'boolean') {
        correct = ans.isCorrect;
      } else if (qMeta.answer && (ans.selectedAnswer || ans.selectedOption)) {
        correct = (ans.selectedAnswer === qMeta.answer || ans.selectedOption === qMeta.answer);
      }
      if (correct && !isDontKnow) {
        correctLogic += 1;
      }
    }
  });

  const threshold = config?.starter_diagnostic?.logic_threshold_strong ?? 0.60;
  const score = totalLogic > 0 ? Number((correctLogic / totalLogic).toFixed(2)) : 0.0;
  const isStrong = score >= threshold;

  return {
    logicScore: score,
    category: isStrong ? 'strong_logic' : 'weak_logic',
    recommendedStartingLevelForZeroExposure: isStrong ? 1 : 0,
    correctLogicCount: correctLogic,
    totalLogicCount: totalLogic,
    dontKnowCount
  };
}

/**
 * Computes starting placement level per topic from self-reported intro profile and optional diagnostic logic.
 *
 * Rules:
 * - none -> 0 (if weak/no logic) or 1 (if strong logic)
 * - basic -> 2
 * - intermediate -> 3
 * - advanced -> 4
 * - source = "self_report", confidence = "low"
 */
export function startingLevel(introProfile, starterAnswersOrDiagnostic = null, config = defaultRulesConfig) {
  let diagResult = null;
  if (starterAnswersOrDiagnostic) {
    if (Array.isArray(starterAnswersOrDiagnostic)) {
      diagResult = diagnosticScore(starterAnswersOrDiagnostic, null, config);
    } else if (typeof starterAnswersOrDiagnostic === 'object' && starterAnswersOrDiagnostic.category) {
      diagResult = starterAnswersOrDiagnostic;
    }
  }

  // Helper to map single topic level string
  const mapLevel = (levelStr) => {
    const norm = String(levelStr || '').toLowerCase().trim();
    if (norm === 'none' || norm === 'beginner' || norm === 'no_experience' || norm === 'zero') {
      const strongLogic = diagResult?.category === 'strong_logic';
      return strongLogic ? 1 : 0;
    }
    if (norm === 'basic' || norm === 'foundational') {
      return 2;
    }
    if (norm === 'intermediate') {
      return 3;
    }
    if (norm === 'advanced') {
      return 4;
    }
    return 0;
  };

  // If passed a simple level string
  if (typeof introProfile === 'string') {
    return {
      level: mapLevel(introProfile),
      source: 'self_report',
      confidence: 'low'
    };
  }

  const topicsMap = introProfile?.topics || introProfile?.selfReport || introProfile;
  const result = {};

  if (typeof topicsMap === 'object' && topicsMap !== null) {
    for (const [topic, val] of Object.entries(topicsMap)) {
      if (['starterAnswers', 'diagnostic', 'diagnosticLogicScore'].includes(topic)) continue;
      const levelVal = typeof val === 'object' && val !== null ? val.level || val.experience : val;
      result[topic] = {
        topic,
        level: mapLevel(levelVal),
        source: 'self_report',
        confidence: 'low'
      };
    }
  }

  return result;
}

/**
 * Checks if a topic skill should be skipped due to existing valid mastery evidence.
 */
export function checkEvidenceSkip(topicId, priorEvidence, config = defaultRulesConfig) {
  const rule = config?.knowledge_ladder?.evidence_skip_rule;
  if (!rule || !rule.enabled || !priorEvidence) {
    return { shouldSkip: false, reason: 'No skip rule or evidence available' };
  }

  const topicRecord = priorEvidence[topicId];
  if (!topicRecord) {
    return { shouldSkip: false, reason: 'No prior assessment on record' };
  }

  // Check recency
  if (topicRecord.lastAssessedTimestamp) {
    const elapsedDays = (Date.now() - new Date(topicRecord.lastAssessedTimestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (elapsedDays > rule.reassessment_interval_days) {
      return {
        shouldSkip: false,
        reason: 'Reassessment due: evidence expired',
        needsReassessment: true,
        reassessmentLevel: topicRecord.level || 2
      };
    }
  }

  // Check verified correct count at topic target level
  if ((topicRecord.verifiedCorrectAtLevel || 0) >= rule.min_correct_at_level) {
    return {
      shouldSkip: true,
      reason: `Sufficient verified mastery (${topicRecord.verifiedCorrectAtLevel} correct items at level ${topicRecord.level})`,
      assignedLevel: topicRecord.level
    };
  }

  return { shouldSkip: false, reason: 'Insufficient evidence threshold' };
}

/**
 * Selects the next question adaptively using mix table, ladder level, evidence-skip,
 * reassessment threshold, previous mistakes, and skill tags.
 */
export function nextQuestion(state, bank, config = defaultRulesConfig) {
  const questionsList = Array.isArray(bank) ? bank : (bank?.questions || []);
  const askedIds = new Set(state?.askedQuestionIds || []);
  const currentTopic = state?.topic || 'python';
  const currentLevel = typeof state?.level === 'number' ? state.level : 1;

  // 1. Evidence skip & reassessment check
  if (state?.evidence && state.evidence[currentTopic]) {
    const skipCheck = checkEvidenceSkip(currentTopic, state.evidence, config);
    if (skipCheck.shouldSkip) {
      return {
        skipTopic: true,
        reason: skipCheck.reason,
        assignedLevel: skipCheck.assignedLevel,
        topic: currentTopic
      };
    }
  }

  // 2. Filter candidates for current topic that are unasked and approved
  let candidates = questionsList.filter(q => {
    if (askedIds.has(q.id)) return false;
    if (q.status && q.status === 'draft') return false;
    return q.topic === currentTopic;
  });

  // If no candidates exist for topic, fallback to any unasked approved question
  if (candidates.length === 0) {
    candidates = questionsList.filter(q => !askedIds.has(q.id) && q.status !== 'draft');
  }

  // 3. Explainer-First / Prerequisite guidance triggered (Level 0 or Demoted / Previous Mistakes)
  const isLevel0 = currentLevel === 0;
  const hasPrereqGuidance = Boolean(state?.prerequisiteGuidance || state?.showExplainer || state?.previousMistakes?.length > 0);

  if (isLevel0) {
    // Basic mix, explainer-first: prefer difficulty 1 / basic recall / logic / explainer ref
    const basicCandidate = candidates.find(q => Number(q.difficulty) === 1) || candidates[0];
    if (basicCandidate) {
      return {
        ...basicCandidate,
        explainerFirst: true,
        recommendedExplainerRef: basicCandidate.explainer_ref || 'exp_logic_patterns',
        assignedDifficulty: 1,
        mode: 'explainer_first'
      };
    }
  }

  if (hasPrereqGuidance && state?.previousMistakes?.length > 0) {
    const lastMistake = state.previousMistakes[state.previousMistakes.length - 1];
    const missedSkills = new Set(lastMistake.skills || []);

    // Look for a question addressing missed skills or prerequisites at lower difficulty
    const prereqCandidate = candidates.find(q => {
      const matchesSkill = q.skills?.some(s => missedSkills.has(s)) ||
                           q.prereqs?.some(p => missedSkills.has(p));
      const isEasier = Number(q.difficulty) <= Math.max(1, currentLevel);
      return matchesSkill && isEasier;
    });

    if (prereqCandidate) {
      return {
        ...prereqCandidate,
        explainerFirst: false,
        prerequisiteGuidance: true,
        remedialSkill: [...missedSkills][0] || 'foundations',
        assignedDifficulty: prereqCandidate.difficulty
      };
    }
  }

  // 4. Knowledge ladder target difficulty mapping
  // Level 0/1 -> Difficulty 1
  // Level 2 -> Difficulty 2
  // Level 3 -> Difficulty 3
  // Level 4 -> Difficulty 4
  const targetDifficulty = currentLevel === 0 ? 1 : Math.min(4, Math.max(1, currentLevel));

  // Match exact difficulty first
  let matched = candidates.filter(q => Number(q.difficulty) === targetDifficulty);

  // If no exact match, choose closest difficulty
  if (matched.length === 0) {
    matched = [...candidates].sort((a, b) => {
      return Math.abs(Number(a.difficulty) - targetDifficulty) - Math.abs(Number(b.difficulty) - targetDifficulty);
    });
  }

  const chosen = matched[0] || null;
  if (!chosen) {
    return null; // All questions exhausted
  }

  return {
    ...chosen,
    explainerFirst: false,
    assignedDifficulty: targetDifficulty
  };
}

/**
 * Updates mastery state when an answer is received.
 *
 * Promotes after consecutive_correct_to_promote (default 2).
 * Demotes after consecutive_wrong_to_demote (default 2) or "I don't know" at higher levels.
 * Updates confidence (low -> medium -> high).
 */
export function updateMastery(state, answer, config = defaultRulesConfig) {
  const promoteThreshold = config?.knowledge_ladder?.consecutive_correct_to_promote || 2;
  const demoteThreshold = config?.knowledge_ladder?.consecutive_wrong_to_demote || 2;

  const currentLevel = typeof state?.level === 'number' ? state.level : 1;
  let consecutiveCorrect = state?.consecutiveCorrect || 0;
  let consecutiveWrong = state?.consecutiveWrong || 0;

  let isCorrect = false;
  let isDontKnow = false;

  if (typeof answer === 'boolean') {
    isCorrect = answer;
  } else if (typeof answer === 'object' && answer !== null) {
    isDontKnow = Boolean(
      answer.isDontKnow ||
      answer.selectedOption === "I don't know / haven't learned this yet" ||
      answer.selectedAnswer === "I don't know / haven't learned this yet"
    );
    isCorrect = Boolean(answer.isCorrect) && !isDontKnow;
  }

  let newLevel = currentLevel;
  let transitionEvent = 'maintain';
  let prerequisiteGuidance = false;
  let showExplainer = false;

  const previousMistakes = [...(state?.previousMistakes || [])];

  if (isCorrect) {
    consecutiveCorrect += 1;
    consecutiveWrong = 0;
    if (consecutiveCorrect >= promoteThreshold) {
      if (currentLevel < 4) {
        newLevel = currentLevel + 1;
        transitionEvent = 'promote';
        consecutiveCorrect = 0;
      }
    }
  } else {
    consecutiveWrong += 1;
    consecutiveCorrect = 0;

    // Record mistake
    if (typeof answer === 'object' && answer !== null) {
      previousMistakes.push({
        questionId: answer.questionId || 'unknown',
        skills: answer.skills || [],
        explainer_ref: answer.explainer_ref || null,
        isDontKnow
      });
    }

    if (consecutiveWrong >= demoteThreshold || (isDontKnow && currentLevel >= 2)) {
      if (currentLevel > 0) {
        newLevel = currentLevel - 1;
        transitionEvent = 'demote';
        consecutiveWrong = 0;
        prerequisiteGuidance = true;
        showExplainer = true;
      }
    }
  }

  // Confidence updates: low -> medium -> high as verified data accumulates
  const historyCount = (state?.history?.length || 0) + 1;
  let confidence = 'low';
  if (historyCount >= 4) {
    confidence = 'high';
  } else if (historyCount >= 2 || (isDontKnow && currentLevel >= 2)) {
    confidence = 'medium';
  }

  return {
    ...state,
    level: newLevel,
    source: 'assessed',
    confidence,
    consecutiveCorrect,
    consecutiveWrong,
    transitionEvent,
    prerequisiteGuidance,
    showExplainer,
    previousMistakes,
    history: [...(state?.history || []), answer]
  };
}

/**
 * Knowledge Ladder Step: Compatibility wrapper for existing tests.
 */
export function updateKnowledgeLadder(currentState, isCorrect, config = defaultRulesConfig) {
  const levels = config?.knowledge_ladder?.levels || ['basic', 'medium', 'hard'];
  const promoteThreshold = config?.knowledge_ladder?.consecutive_correct_to_promote || 2;
  const demoteThreshold = config?.knowledge_ladder?.consecutive_wrong_to_demote || 2;

  let currentLevelIdx = levels.indexOf(currentState.currentLevel);
  if (currentLevelIdx === -1) currentLevelIdx = 0;

  let consecutiveCorrect = isCorrect ? (currentState.consecutiveCorrect || 0) + 1 : 0;
  let consecutiveWrong = !isCorrect ? (currentState.consecutiveWrong || 0) + 1 : 0;

  let newLevelIdx = currentLevelIdx;
  let event = 'maintain';
  let triggerPrerequisite = false;
  let showExplainer = false;

  if (isCorrect && consecutiveCorrect >= promoteThreshold) {
    if (currentLevelIdx < levels.length - 1) {
      newLevelIdx = currentLevelIdx + 1;
      event = 'promote';
      consecutiveCorrect = 0;
    }
  } else if (!isCorrect && consecutiveWrong >= demoteThreshold) {
    if (currentLevelIdx > 0) {
      newLevelIdx = currentLevelIdx - 1;
      event = 'demote';
      consecutiveWrong = 0;
      triggerPrerequisite = Boolean(config?.knowledge_ladder?.demotion_triggers?.inject_prerequisite_items);
      showExplainer = Boolean(config?.knowledge_ladder?.demotion_triggers?.show_explainer);
    }
  }

  return {
    currentLevel: levels[newLevelIdx],
    consecutiveCorrect,
    consecutiveWrong,
    transitionEvent: event,
    triggerPrerequisite,
    showExplainer,
    previousLevel: levels[currentLevelIdx]
  };
}

/**
 * Computes 6 RIASEC scores (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
 * from career interest items.
 *
 * Technical knowledge accuracy does NOT affect these scores.
 */
export function interestScores(answers) {
  const riasecTotals = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const riasecCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  answers.forEach(ans => {
    // Only interest items contribute to RIASEC
    if (ans.category !== 'interest' && ans.type !== 'interest' && !ans.riasec) {
      return;
    }

    const dim = ans.riasec ? ans.riasec.toUpperCase() : null;
    if (dim && riasecTotals[dim] !== undefined) {
      // Score can be 1-5 or explicit rating
      let val = 3; // default neutral
      if (typeof ans.score === 'number') {
        val = ans.score;
      } else if (typeof ans.selectedOptionScore === 'number') {
        val = ans.selectedOptionScore;
      } else if (typeof ans.selectedAnswer === 'string') {
        const match = ans.selectedAnswer.match(/\((\d)\)/);
        if (match) val = parseInt(match[1], 10);
      }
      riasecTotals[dim] += val;
      riasecCounts[dim] += 1;
    }
  });

  // Normalize each dimension to a 0-100 scale (1 -> 0%, 5 -> 100%)
  const scores = {};
  for (const dim of ['R', 'I', 'A', 'S', 'E', 'C']) {
    if (riasecCounts[dim] > 0) {
      const avg = riasecTotals[dim] / riasecCounts[dim];
      scores[dim] = Number(Math.max(0, Math.min(100, ((avg - 1) / 4) * 100)).toFixed(1));
    } else {
      scores[dim] = 50.0; // neutral default
    }
  }

  return scores;
}

/**
 * Evaluates behavioral events and produces small capped adjustments (at most +/-20%).
 *
 * Rules:
 * - Cap is strictly +/-20% (+/-20 points on a 100-point scale or +/-0.20)
 * - Adjusts hypothesis without overriding it
 */
export function behaviorSignals(events, config = defaultRulesConfig) {
  const maxCap = config?.behavior?.max_adjustment_percentage ?? 20;

  const eventList = Array.isArray(events) ? events : [events];
  const domainRawDeltas = {};

  let totalRetries = 0;
  let totalTime = 0;

  eventList.forEach(e => {
    if (!e) return;
    if (e.voluntaryRetries) totalRetries += e.voluntaryRetries;
    if (e.timeSpentSeconds) totalTime += e.timeSpentSeconds;

    // Domain exploration signals
    if (e.domainId !== undefined) {
      const dId = String(e.domainId);
      const bonus = (e.voluntaryExploration ? 8 : 0) +
                    (e.codePlaygroundRuns ? e.codePlaygroundRuns * 2 : 0) +
                    (e.bonusPoints || 0);
      domainRawDeltas[dId] = (domainRawDeltas[dId] || 0) + bonus;
    }
  });

  const cappedDomainAdjustments = {};
  for (const [dId, raw] of Object.entries(domainRawDeltas)) {
    // Strict capping at maxCap
    cappedDomainAdjustments[dId] = Math.max(-maxCap, Math.min(maxCap, raw));
  }

  // General retry bonus
  const generalRetryBonus = Math.min(maxCap, totalRetries * 2);

  return {
    domainAdjustments: cappedDomainAdjustments,
    generalRetryBonus,
    maxCapApplied: Object.values(domainRawDeltas).some(v => Math.abs(v) > maxCap),
    maxCapPercentage: maxCap
  };
}

/**
 * Maps RIASEC interest scores to Career Domains using versioned heuristic config ("hypothesis v1").
 *
 * Rules:
 * - Versioned config labeled "hypothesis v1", never as fact
 * - Derived from O*NET occupation RIASEC data
 * - Behavior adjustment is capped at most +/-20%
 * - Always shows top 3 domains with plain-language note
 * - Never outputs a single final verdict
 */
export function domainMapping(userRiasec, behavior = null, mappingConfig = defaultMappingConfig) {
  const config = mappingConfig || defaultMappingConfig;
  const maxCap = config?.behavior_adjustment_cap?.max_percentage ?? 20;
  const domains = config?.domains || [];

  const behaviorAdjustments = behavior?.domainAdjustments || {};

  const domainScores = domains.map(domain => {
    const weights = domain.riasec_weights;
    // Calculate Euclidean distance between user vector and domain vector
    let sumSq = 0;
    const dims = ['R', 'I', 'A', 'S', 'E', 'C'];
    for (const dim of dims) {
      const userVal = userRiasec[dim] !== undefined ? userRiasec[dim] : 50;
      const targetVal = weights[dim] !== undefined ? weights[dim] : 50;
      sumSq += Math.pow(userVal - targetVal, 2);
    }
    const dist = Math.sqrt(sumSq);
    const maxDist = Math.sqrt(6 * Math.pow(100, 2)); // ~244.9

    // Raw heuristic fit (0 to 100)
    const baseFit = Math.max(0, 100 - (dist / maxDist) * 100);

    // Apply capped behavior adjustment (+/- 20% max)
    const rawAdj = behaviorAdjustments[domain.id] || 0;
    const cappedAdj = Math.max(-maxCap, Math.min(maxCap, rawAdj));

    const finalScore = Number(Math.max(0, Math.min(100, baseFit + cappedAdj)).toFixed(1));

    return {
      id: domain.id,
      key: domain.key,
      title: domain.title,
      score: finalScore,
      baseFit: Number(baseFit.toFixed(1)),
      behaviorAdjustment: cappedAdj,
      onet_soc_codes: domain.onet_soc_codes,
      derivation: domain.derivation
    };
  });

  // Sort descending by score
  domainScores.sort((a, b) => b.score - a.score);

  // Take top 3 domains (never a single verdict)
  const top3 = domainScores.slice(0, 3);

  return {
    mapping_version: config?.mapping_version || 'hypothesis v1',
    status: 'hypothesis',
    note: config?.disclaimer || 'starting hypothesis based on your answers; it adjusts as you explore',
    top3Domains: top3,
    allDomains: domainScores,
    singleVerdict: false, // strictly false
    license_attribution: config?.license_and_terms?.attribution
  };
}

/**
 * Stores validation feedback for the domain hypothesis.
 * Control: "Does this feel right? (1-5)"
 */
export function storeFeedback(hypothesisResult, rating, comment = '') {
  const numericRating = Number(rating);
  if (![1, 2, 3, 4, 5].includes(numericRating)) {
    throw new Error('Feedback rating must be an integer between 1 and 5.');
  }

  return {
    hypothesis_version: hypothesisResult?.mapping_version || 'hypothesis v1',
    top_domains: (hypothesisResult?.top3Domains || []).map(d => ({ id: d.id, title: d.title, score: d.score })),
    rating: numericRating,
    comment: comment.trim(),
    timestamp: new Date().toISOString(),
    validated: true
  };
}

/**
 * Signals separation: Compatibility wrapper for existing tests.
 */
export function evaluateSignals(responses) {
  let knowledgeCorrect = 0;
  let knowledgeTotal = 0;

  let interestScoreAccumulator = 0;
  let interestItemsCount = 0;

  let voluntaryRetries = 0;
  let totalTimeSpentSeconds = 0;

  responses.forEach(r => {
    if (['knowledge', 'logic', 'prerequisite'].includes(r.itemType)) {
      knowledgeTotal += 1;
      if (r.isCorrect) knowledgeCorrect += 1;
    }

    if (r.itemType === 'interest' || r.interestWeight) {
      interestItemsCount += 1;
      const weight = Number(r.selectedOptionScore || (r.isHighInterest ? 5 : 3));
      interestScoreAccumulator += weight;
    }

    if (r.timeSpentSeconds) {
      totalTimeSpentSeconds += r.timeSpentSeconds;
    }

    if (r.isVoluntaryRetry) {
      voluntaryRetries += 1;
    }
  });

  const knowledgeAccuracy = knowledgeTotal > 0 ? Number((knowledgeCorrect / knowledgeTotal).toFixed(2)) : null;
  const rawInterestAverage = interestItemsCount > 0 ? interestScoreAccumulator / interestItemsCount : 3.0;

  const retryBonus = Math.min(1.0, voluntaryRetries * 0.25);
  const normalizedInterestScore = Number(Math.min(5.0, rawInterestAverage + retryBonus).toFixed(2));

  return {
    knowledge: {
      correctCount: knowledgeCorrect,
      totalCount: knowledgeTotal,
      accuracy: knowledgeAccuracy,
      levelLabel: knowledgeAccuracy === null ? 'Insufficient Data' :
                  knowledgeAccuracy >= 0.8 ? 'Proficient' :
                  knowledgeAccuracy >= 0.5 ? 'Foundational' : 'Introductory'
    },
    interest: {
      itemsEvaluated: interestItemsCount,
      normalizedScore: normalizedInterestScore,
      voluntaryRetries,
      totalTimeSpentSeconds,
      levelLabel: normalizedInterestScore >= 4.0 ? 'High Curiosity' :
                  normalizedInterestScore >= 2.5 ? 'Moderate Interest' : 'Exploratory'
    }
  };
}
