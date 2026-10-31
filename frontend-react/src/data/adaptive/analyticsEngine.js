/**
 * Pure Analytics & Explainability Engine for CSE PathFinder
 *
 * Rules:
 * - Pure, unit-testable functions
 * - Transparent explanation of how each topic level and domain score was derived
 * - Event logging aggregation: question served, answered, time, "I don't know", activity chosen, retries
 * - Item-level psychometric & diagnostic analytics:
 *    * % correct (facility index)
 *    * "I don't know" selection rate
 *    * Average time taken (seconds)
 *    * Discrimination index: comparison of correctness between top-half vs bottom-half students
 *    * Auto-flagging: too easy (facility > 0.90), too hard (facility < 0.20), confusing (negative discrimination)
 * - Admin question lifecycle management: status transitions (draft -> reviewed -> approved -> retired)
 */

/**
 * Explains a student's assessment result in complete plain English.
 * Breaks down exactly which answers, starting level, ladder transitions,
 * RIASEC answers, and behavior events determined their outcomes.
 */
export function explainResult(sessionData) {
  const {
    studentProfile = {},
    attempts = [],
    diagnosticResults = null,
    mastery = {},
    hypothesisResult = null,
    behaviorEvents = []
  } = sessionData;

  const topicExplanations = {};

  // Group attempts by topic
  const attemptsByTopic = {};
  attempts.forEach(att => {
    const t = att.topic || 'general';
    if (!attemptsByTopic[t]) attemptsByTopic[t] = [];
    attemptsByTopic[t].push(att);
  });

  // 1. Topic Level Explanations
  Object.keys(attemptsByTopic).forEach(topic => {
    const topicAttempts = attemptsByTopic[topic];
    const correctCount = topicAttempts.filter(a => a.correct).length;
    const idkCount = topicAttempts.filter(a => a.is_dont_know || String(a.answer).includes("I don't know")).length;
    const finalMastery = mastery[topic] || { level: 1, confidence: 'medium' };

    const ladderEvents = [];
    let consecutiveCorrect = 0;
    let consecutiveWrong = 0;

    topicAttempts.forEach((att, idx) => {
      const isIdk = att.is_dont_know || String(att.answer).includes("I don't know");
      if (att.correct) {
        consecutiveCorrect += 1;
        consecutiveWrong = 0;
        if (consecutiveCorrect === 2) {
          ladderEvents.push(`Question #${idx + 1}: Second consecutive correct answer triggered level promotion.`);
          consecutiveCorrect = 0;
        }
      } else {
        consecutiveWrong += 1;
        consecutiveCorrect = 0;
        if (consecutiveWrong === 2) {
          ladderEvents.push(`Question #${idx + 1}: Second consecutive incorrect answer (or 'I don't know') triggered demotion + explainer review.`);
          consecutiveWrong = 0;
        }
      }
      if (isIdk) {
        ladderEvents.push(`Question #${idx + 1}: Selected 'I don't know' — treated as verified evidence of gap for that concept without guessing distortion.`);
      }
    });

    topicExplanations[topic] = {
      topic,
      finalLevel: finalMastery.level,
      confidence: finalMastery.confidence || 'medium',
      selfReportedPrior: studentProfile.topicExperience?.[topic] || 'none',
      diagnosticInfluence: diagnosticResults ? `Diagnostic logic score (${Math.round((diagnosticResults.score || 0) * 100)}%) set starting level.` : 'Standard starter level applied.',
      totalQuestionsAnswered: topicAttempts.length,
      correctCount,
      idkCount,
      ladderTransitions: ladderEvents,
      summaryText: `Your assigned Level ${finalMastery.level} was derived from your initial starting placement, ${correctCount} correct answer(s), and ${idkCount} transparent 'I don't know' selection(s).`
    };
  });

  // 2. Domain Hypothesis Derivation Breakdown
  const domainExplanations = [];
  if (hypothesisResult && hypothesisResult.top3Domains) {
    hypothesisResult.top3Domains.forEach((dom, rank) => {
      domainExplanations.push({
        rank: rank + 1,
        domainId: dom.id,
        title: dom.title,
        compositeScore: dom.score,
        baseOnetFit: dom.baseFit,
        behaviorAdjustment: dom.behaviorAdjustment,
        derivationFormula: `Fit (${dom.score}%) = O*NET Euclidean Profile Proximity (${dom.baseFit}%) + Behavior Engagement Adjustment (${dom.behaviorAdjustment >= 0 ? '+' : ''}${dom.behaviorAdjustment}%).`,
        reasoning: dom.derivation,
        onetSocCodes: dom.onet_soc_codes || []
      });
    });
  }

  return {
    studentEmail: sessionData.studentEmail || 'guest_student',
    modelRuleVersion: sessionData.rules_version || '1.0.0',
    mappingVersion: hypothesisResult?.mapping_version || 'hypothesis v1',
    topicExplanations,
    domainExplanations,
    behaviorSummary: {
      totalTimeSeconds: attempts.reduce((acc, a) => acc + (a.time_taken || 0), 0),
      voluntaryRetries: behaviorEvents.filter(e => e.type === 'retry').length,
      guidedActivitiesCompleted: behaviorEvents.filter(e => e.type === 'guided_activity_reflection').length
    }
  };
}

/**
 * Aggregates diagnostic item analytics across all student attempts.
 * Computes:
 * - facility: % correct
 * - idkRate: % "I don't know"
 * - avgTime: mean time in seconds
 * - discrimination: difference in pass rate between upper-half vs lower-half students
 * - flags: "too_easy", "too_hard", "confusing"
 */
export function computeItemAnalytics(itemBank, attemptsList, masteryRecords = []) {
  const attemptsByQuestion = {};
  attemptsList.forEach(att => {
    const qid = att.question_id;
    if (!attemptsByQuestion[qid]) attemptsByQuestion[qid] = [];
    attemptsByQuestion[qid].push(att);
  });

  // Create student performance index to compute discrimination
  const studentTotalScores = {};
  attemptsList.forEach(att => {
    const email = att.student_email || 'anon';
    if (!studentTotalScores[email]) studentTotalScores[email] = { correct: 0, total: 0 };
    studentTotalScores[email].total += 1;
    if (att.correct) studentTotalScores[email].correct += 1;
  });

  const studentsSorted = Object.entries(studentTotalScores)
    .map(([email, s]) => ({ email, rate: s.total > 0 ? s.correct / s.total : 0 }))
    .sort((a, b) => b.rate - a.rate);

  const half = Math.max(1, Math.floor(studentsSorted.length / 2));
  const topStudents = new Set(studentsSorted.slice(0, half).map(s => s.email));
  const bottomStudents = new Set(studentsSorted.slice(half).map(s => s.email));

  const analytics = [];

  itemBank.forEach(item => {
    const itemAttempts = attemptsByQuestion[item.id] || [];
    const n = itemAttempts.length;

    if (n === 0) {
      analytics.push({
        questionId: item.id,
        topic: item.topic,
        difficulty: item.difficulty,
        status: item.status,
        attemptsCount: 0,
        facility: null,
        idkRate: null,
        avgTimeSeconds: null,
        discrimination: null,
        flags: [],
        recommendation: 'Needs more student attempts to evaluate.'
      });
      return;
    }

    const correctCount = itemAttempts.filter(a => a.correct).length;
    const idkCount = itemAttempts.filter(a => a.is_dont_know || String(a.answer).includes("I don't know")).length;
    const totalTime = itemAttempts.reduce((acc, a) => acc + (a.time_taken || 0), 0);

    const facility = Number((correctCount / n).toFixed(2));
    const idkRate = Number((idkCount / n).toFixed(2));
    const avgTime = Number((totalTime / n).toFixed(1));

    // Discrimination Index: (Top Half Correct % - Bottom Half Correct %)
    let discrimination = 0;
    if (topStudents.size > 0 && bottomStudents.size > 0) {
      const topAttempts = itemAttempts.filter(a => topStudents.has(a.student_email));
      const bottomAttempts = itemAttempts.filter(a => bottomStudents.has(a.student_email));

      const topPassRate = topAttempts.length > 0 ? topAttempts.filter(a => a.correct).length / topAttempts.length : facility;
      const bottomPassRate = bottomAttempts.length > 0 ? bottomAttempts.filter(a => a.correct).length / bottomAttempts.length : facility;
      discrimination = Number((topPassRate - bottomPassRate).toFixed(2));
    }

    // Flagging Rules
    const flags = [];
    if (facility > 0.90 && item.difficulty >= 2) {
      flags.push('too_easy');
    }
    if (facility < 0.20) {
      flags.push('too_hard');
    }
    if (discrimination < -0.05 && n >= 4) {
      // Lower performing students pass more often than top performing students (likely misleading distractor)
      flags.push('confusing');
    }
    if (idkRate > 0.60) {
      flags.push('high_idk_rate');
    }

    let recommendation = 'Item performing well within acceptable psychometric bounds.';
    if (flags.includes('confusing')) {
      recommendation = 'Investigate: item may have ambiguous wording or misleading distractors.';
    } else if (flags.includes('too_hard')) {
      recommendation = 'Review difficulty: Consider downgrading prerequisite requirements or adding clarifying hint.';
    } else if (flags.includes('too_easy')) {
      recommendation = 'Review difficulty: May be trivial for the stated difficulty level.';
    }

    analytics.push({
      questionId: item.id,
      topic: item.topic,
      difficulty: item.difficulty,
      status: item.status,
      attemptsCount: n,
      facility,
      idkRate,
      avgTimeSeconds: avgTime,
      discrimination,
      flags,
      recommendation
    });
  });

  return analytics;
}

/**
 * Admin action: updates an item's status in the bank (e.g. retiring a flagged item).
 */
export function updateQuestionStatus(itemBank, questionId, newStatus, reason = '') {
  const allowed = ['draft', 'reviewed', 'approved', 'retired'];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid status '${newStatus}'. Allowed: ${allowed.join(', ')}`);
  }

  const idx = itemBank.findIndex(q => q.id === questionId);
  if (idx === -1) {
    throw new Error(`Question with id '${questionId}' not found.`);
  }

  const updatedItem = {
    ...itemBank[idx],
    status: newStatus,
    status_change_note: reason,
    status_updated_at: new Date().toISOString()
  };

  const updatedBank = [...itemBank];
  updatedBank[idx] = updatedItem;

  return {
    updatedBank,
    updatedItem,
    message: `Question '${questionId}' status updated from '${itemBank[idx].status}' to '${newStatus}'.`
  };
}

