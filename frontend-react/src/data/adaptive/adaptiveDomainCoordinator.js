/**
 * Adaptive Domain Exploration Coordinator
 * 
 * Objectives:
 * - Help CSE students discover which domains they should explore further.
 * - Non-technical beginner friendly (accessible to students with zero coding knowledge).
 * - NOT a technical exam, coding interview, or personality test.
 * - Strictly decouples performance/skill from interest/enjoyment.
 * - Next question selection depends on latest answer AND full session history.
 * - Uses explainable selection reasons and evidence gap tracking.
 * - Avoids self-confirming bias (requires minimum exploration coverage across domain clusters).
 * - Produces an explainable shortlist with options to compare, challenge, or choose.
 */

export const SUPPORTED_DOMAINS = [
  { id: 'ai', title: 'AI, ML & Deep Learning', cluster: 'cluster_data_ai' },
  { id: 'data', title: 'Data Science', cluster: 'cluster_data_ai' },
  { id: 'web', title: 'Web, App & Game Development', cluster: 'cluster_interactive_web' },
  { id: 'security', title: 'Cyber Security & Blockchain', cluster: 'cluster_systems_security' },
  { id: 'cloud', title: 'Cloud Computing', cluster: 'cluster_systems_security' },
  { id: 'iot', title: 'IoT & Embedded Systems', cluster: 'cluster_cyber_physical' },
  { id: 'robotics', title: 'Robotics & Automation', cluster: 'cluster_cyber_physical' },
  { id: 'vlsi', title: 'VLSI & Computer Architecture', cluster: 'cluster_cyber_physical' },
  { id: 'networking', title: 'Networking & Communication Systems', cluster: 'cluster_systems_security' }
];

export const DOMAIN_CLUSTERS = {
  cluster_data_ai: ['ai', 'data'],
  cluster_interactive_web: ['web'],
  cluster_systems_security: ['security', 'cloud', 'networking'],
  cluster_cyber_physical: ['iot', 'robotics', 'vlsi']
};

export const SELECTION_REASON_CODES = {
  ENSURE_MINIMUM_EXPLORATION_COVERAGE: 'ENSURE_MINIMUM_EXPLORATION_COVERAGE',
  RESOLVE_AMBIGUITY_WITHOUT_PENALTY: 'RESOLVE_AMBIGUITY_WITHOUT_PENALTY',
  DECOUPLE_APTITUDE_FROM_INTEREST: 'DECOUPLE_APTITUDE_FROM_INTEREST',
  SUPPORT_ENTHUSIASM_WITH_FOUNDATIONS: 'SUPPORT_ENTHUSIASM_WITH_FOUNDATIONS',
  GROUND_INTEREST_IN_REAL_EXPERIENCE: 'GROUND_INTEREST_IN_REAL_EXPERIENCE',
  RESOLVE_CLOSE_DOMAIN_TIE: 'RESOLVE_CLOSE_DOMAIN_TIE',
  CONFIRM_DOMAIN_AFFINITY: 'CONFIRM_DOMAIN_AFFINITY',
  EXPLORE_REMAINING_UNCERTAINTY: 'EXPLORE_REMAINING_UNCERTAINTY'
};

/**
 * Initializes the decoupled evidence state from the student's onboarding profile.
 */
export function initStudentEvidenceState(onboardingProfile = {}, sessionId = null, studentEmail = 'guest@pathfinder.edu') {
  const normalizedProfile = {
    semester: onboardingProfile.semester || 1,
    prior_programming_exposure: onboardingProfile.prior_programming_exposure || 'none',
    subjects_tools_explored: Array.isArray(onboardingProfile.subjects_tools_explored) ? onboardingProfile.subjects_tools_explored : [],
    projects_built: Array.isArray(onboardingProfile.projects_built) ? onboardingProfile.projects_built : [],
    existing_career_interests: Array.isArray(onboardingProfile.existing_career_interests) ? onboardingProfile.existing_career_interests : [],
    is_unsure: Boolean(
      onboardingProfile.is_unsure || 
      (onboardingProfile.existing_career_interests || []).some(i => i.toLowerCase().includes('not know') || i.toLowerCase().includes('unsure') || i === 'idk')
    ),
    preferred_language: onboardingProfile.preferred_language || 'en',
    accessibility_needs: onboardingProfile.accessibility_needs || 'none'
  };

  const domainEvidence = {};
  SUPPORTED_DOMAINS.forEach(domain => {
    let initialStatedInterest = 50;
    if (normalizedProfile.is_unsure) {
      initialStatedInterest = 50;
    } else if (normalizedProfile.existing_career_interests.includes(domain.id) || 
               normalizedProfile.existing_career_interests.some(i => domain.title.toLowerCase().includes(i.toLowerCase()))) {
      initialStatedInterest = 75;
    }

    let priorExposureLevel = 0;
    if (normalizedProfile.prior_programming_exposure === 'substantial') priorExposureLevel = 3;
    else if (normalizedProfile.prior_programming_exposure === 'moderate') priorExposureLevel = 2;
    else if (normalizedProfile.prior_programming_exposure === 'light_exploratory') priorExposureLevel = 1;

    domainEvidence[domain.id] = {
      domain_id: domain.id,
      title: domain.title,
      cluster: domain.cluster,
      stated_interest_score: initialStatedInterest,
      activity_enjoyment_score: 50,
      activity_enjoyment_count: 0,
      willingness_to_continue: null,
      prior_exposure_level: priorExposureLevel,
      demonstrated_ct_score: null,
      demonstrated_ct_count: 0,
      guided_activities_count: 0,
      coverage_count: 0,
      uncertainty: 1.0
    };
  });

  return {
    session_id: sessionId || `sess_${Math.random().toString(36).substring(2, 10)}`,
    student_email: studentEmail,
    onboarding_profile: normalizedProfile,
    domain_evidence: domainEvidence,
    history: [],
    rule_policy_version: '2.0.0-domain-adaptive',
    uncertainty_index: 1.0,
    status: 'in_progress'
  };
}

/**
 * Calculates current aggregate domain discovery score combining decoupled dimensions.
 * Weighting:
 * - Activity Enjoyment & Reflection: 40%
 * - Stated / Probed Interest: 40%
 * - Demonstrated CT (approachable problem-solving context): 20%
 * Exposure/Skill level does NOT penalize or determine interest.
 */
export function calculateDomainScores(evidenceState) {
  const scores = {};
  SUPPORTED_DOMAINS.forEach(d => {
    const ev = evidenceState.domain_evidence[d.id];
    if (!ev) return;

    let enjoymentPart = ev.activity_enjoyment_score;
    let interestPart = ev.stated_interest_score;
    let ctPart = ev.demonstrated_ct_score !== null ? ev.demonstrated_ct_score : 50;

    // Decouple: If enjoyment is low, high CT score does not drag the score up artificially
    if (ev.activity_enjoyment_count > 0 && ev.activity_enjoyment_score < 40) {
      ctPart = Math.min(ctPart, ev.activity_enjoyment_score);
    }

    // If student expressly indicated willingness to continue exploring, provide healthy discovery bonus
    const willingnessBonus = ev.willingness_to_continue === true ? 8 : (ev.willingness_to_continue === false ? -10 : 0);

    const compositeScore = Number(Math.max(0, Math.min(100,
      (enjoymentPart * 0.40) + (interestPart * 0.40) + (ctPart * 0.20) + willingnessBonus
    )).toFixed(1));

    scores[d.id] = {
      domain_id: d.id,
      title: d.title,
      cluster: d.cluster,
      composite_score: compositeScore,
      enjoyment: ev.activity_enjoyment_score,
      interest: ev.stated_interest_score,
      ct: ev.demonstrated_ct_score,
      coverage: ev.coverage_count,
      guidedCount: ev.guided_activities_count,
      uncertainty: ev.uncertainty
    };
  });
  return scores;
}

/**
 * Checks cluster coverage: returns list of visited cluster keys.
 */
export function getVisitedClusters(evidenceState) {
  const visited = new Set();
  (evidenceState.history || []).forEach(h => {
    if (h.domain_tags && Array.isArray(h.domain_tags)) {
      h.domain_tags.forEach(dId => {
        const dom = SUPPORTED_DOMAINS.find(d => d.id === dId);
        if (dom) visited.add(dom.cluster);
      });
    }
  });
  return [...visited];
}

/**
 * Selects the next adaptive question or activity based on full session history and decoupled state.
 */
export function selectNextAdaptiveItem(evidenceState, itemBank = [], explainerBank = []) {
  const askedIds = new Set((evidenceState.history || []).map(h => h.question_id));
  const lastHistory = evidenceState.history.length > 0 ? evidenceState.history[evidenceState.history.length - 1] : null;
  const domainScores = calculateDomainScores(evidenceState);
  const sortedDomains = Object.values(domainScores).sort((a, b) => b.composite_score - a.composite_score);

  // Helper to filter items
  const getCandidateItems = (filterFn) => {
    return itemBank.filter(q => {
      const qId = q.question_id || q.id;
      if (askedIds.has(qId)) return false;
      if (q.review_status === 'flagged' || q.status === 'draft') return false;
      return filterFn(q);
    });
  };

  // -------------------------------------------------------------------------
  // RULE 1: Clarification / Explainer needed if student selected "I don't know" or asked for explanation
  // -------------------------------------------------------------------------
  if (lastHistory && lastHistory.is_idk) {
    const targetDomainId = lastHistory.domain_tags?.[0] || 'data';
    const explainerCard = explainerBank.find(e => e.domain === targetDomainId || e.topic === targetDomainId) || {
      id: `exp_${targetDomainId}_overview`,
      domain: targetDomainId,
      title: `Understanding ${SUPPORTED_DOMAINS.find(d => d.id === targetDomainId)?.title || 'This Domain'}`,
      summary: `Here is a friendly 30-second breakdown of what professionals in this domain actually do.`,
      key_takeaways: [
        'Focuses on practical problem-solving using structured logic.',
        'No prior programming syntax is required to explore this path.',
        'You can experience a guided beginner exercise before deciding if you enjoy it.'
      ]
    };

    return {
      action_type: 'clarification',
      selection_reason_code: SELECTION_REASON_CODES.RESOLVE_AMBIGUITY_WITHOUT_PENALTY,
      evidence_gap_addressed: 'CLARIFY_UNFAMILIAR_CONCEPT',
      rule_version: '2.0.0',
      target_domain: targetDomainId,
      explainer: explainerCard,
      reason_description: `You indicated you haven't learned this yet. We provide an approachable overview first rather than penalizing your score.`
    };
  }

  // -------------------------------------------------------------------------
  // RULE 2: Decouple Aptitude from Low Enjoyment (Immediate Reflection Reaction)
  // (Student solved a task well in domain X, but reported low enjoyment <= 2)
  // -------------------------------------------------------------------------
  if (lastHistory && (lastHistory.post_activity_enjoyment !== null && lastHistory.post_activity_enjoyment <= 2) && lastHistory.is_correct) {
    const dislikedDomain = lastHistory.domain_tags?.[0];
    const altDomain = sortedDomains.find(d => d.domain_id !== dislikedDomain && d.coverage === 0) || sortedDomains.find(d => d.domain_id !== dislikedDomain);
    const candidate = getCandidateItems(q => {
      const qDomains = q.domain_tags || [q.domain || q.topic];
      return qDomains.includes(altDomain.domain_id);
    })[0];

    if (candidate) {
      return {
        action_type: 'question',
        item: candidate,
        selection_reason_code: SELECTION_REASON_CODES.DECOUPLE_APTITUDE_FROM_INTEREST,
        evidence_gap_addressed: 'HIGH_SKILL_LOW_ENJOYMENT_DISCONNECT',
        rule_version: '2.0.0',
        target_domain: altDomain.domain_id,
        reason_description: `You solved the previous problem well, but indicated you did not enjoy the work. We explore a different domain rather than assuming high interest.`
      };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 3: Low Skill but High Enjoyment (Immediate Reflection Reaction)
  // (Student struggled with a task but rated enjoyment >= 4 or wants to learn)
  // -------------------------------------------------------------------------
  if (lastHistory && (lastHistory.post_activity_enjoyment >= 4 || lastHistory.post_activity_willingness === true) && !lastHistory.is_correct) {
    const lovedDomain = lastHistory.domain_tags?.[0];
    const candidate = getCandidateItems(q => {
      const qDomains = q.domain_tags || [q.domain || q.topic];
      return qDomains.includes(lovedDomain) && (q.difficulty === 1 || q.question_type === 'guided_experience');
    })[0] || getCandidateItems(q => {
      const qDomains = q.domain_tags || [q.domain || q.topic];
      return qDomains.includes(lovedDomain);
    })[0];

    if (candidate) {
      return {
        action_type: 'question',
        item: candidate,
        selection_reason_code: SELECTION_REASON_CODES.SUPPORT_ENTHUSIASM_WITH_FOUNDATIONS,
        evidence_gap_addressed: 'ENTHUSIASM_REQUIRES_FOUNDATIONAL_EXPERIENCE',
        rule_version: '2.0.0',
        target_domain: lovedDomain,
        reason_description: `You enjoyed this topic! We keep this domain open and offer an accessible foundational activity.`
      };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 4: Minimum Exploration Coverage across Domain Clusters
  // -------------------------------------------------------------------------
  const visitedClusters = getVisitedClusters(evidenceState);
  const allClusters = Object.keys(DOMAIN_CLUSTERS);
  const unvisitedClusters = allClusters.filter(c => !visitedClusters.includes(c));

  if (visitedClusters.length < 3 && unvisitedClusters.length > 0) {
    const targetCluster = unvisitedClusters[0];
    const clusterDomainIds = DOMAIN_CLUSTERS[targetCluster];
    const candidate = getCandidateItems(q => {
      const qDomains = q.domain_tags || [q.domain || q.topic];
      return qDomains.some(d => clusterDomainIds.includes(d));
    })[0];

    if (candidate) {
      return {
        action_type: 'question',
        item: candidate,
        selection_reason_code: SELECTION_REASON_CODES.ENSURE_MINIMUM_EXPLORATION_COVERAGE,
        evidence_gap_addressed: 'UNTESTED_DOMAIN_CLUSTER',
        rule_version: '2.0.0',
        target_domain: candidate.domain_tags?.[0] || clusterDomainIds[0],
        reason_description: `Sampling a new engineering cluster to avoid jumping to conclusions before exploring alternatives.`
      };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 5: Ground Stated Interest in Real Experience
  // (A leading domain has high interest > 60 but zero guided experiences)
  // -------------------------------------------------------------------------
  const ungroundedHighInterest = sortedDomains.find(d => d.interest >= 60 && d.guidedCount === 0);
  if (ungroundedHighInterest) {
    const candidate = getCandidateItems(q => {
      const qDomains = q.domain_tags || [q.domain || q.topic];
      const isGuided = q.question_type === 'guided_experience' || q.category === 'guided_activity';
      return qDomains.includes(ungroundedHighInterest.domain_id) && isGuided;
    })[0];

    if (candidate) {
      return {
        action_type: 'question',
        item: candidate,
        selection_reason_code: SELECTION_REASON_CODES.GROUND_INTEREST_IN_REAL_EXPERIENCE,
        evidence_gap_addressed: 'VERIFY_ABSTRACT_INTEREST_WITH_EXPERIENCE',
        rule_version: '2.0.0',
        target_domain: ungroundedHighInterest.domain_id,
        reason_description: `You expressed interest in ${ungroundedHighInterest.title}. Here is a guided hands-on scenario so you can experience what this work feels like.`
      };
    }
  }

  // -------------------------------------------------------------------------
  // RULE 6: Compare Close Domains / Trade-off Probe
  // (If top 2 domains are within 12 points and both probed at least once)
  // -------------------------------------------------------------------------
  if (sortedDomains.length >= 2) {
    const first = sortedDomains[0];
    const second = sortedDomains[1];
    if (Math.abs(first.composite_score - second.composite_score) <= 12 && first.coverage > 0 && second.coverage > 0) {
      const compareCandidate = getCandidateItems(q => {
        const qDomains = q.domain_tags || [q.domain || q.topic];
        return qDomains.includes(first.domain_id) && qDomains.includes(second.domain_id);
      })[0] || getCandidateItems(q => {
        const qDomains = q.domain_tags || [q.domain || q.topic];
        return qDomains.includes(second.domain_id) && q.coverage === 0;
      })[0];

      if (compareCandidate) {
        return {
          action_type: 'question',
          item: compareCandidate,
          selection_reason_code: SELECTION_REASON_CODES.RESOLVE_CLOSE_DOMAIN_TIE,
          evidence_gap_addressed: 'AMBIGUITY_BETWEEN_LEADING_DOMAINS',
          rule_version: '2.0.0',
          target_domain: second.domain_id,
          reason_description: `Your responses show close affinity between ${first.title} and ${second.title}. This activity contrasts their daily focus.`
        };
      }
    }
  }

  // -------------------------------------------------------------------------
  // RULE 7: Deepen Top Candidate or Explore Remaining Uncertainty
  // -------------------------------------------------------------------------
  const topDomain = sortedDomains[0];
  const candidate = getCandidateItems(q => {
    const qDomains = q.domain_tags || [q.domain || q.topic];
    return qDomains.includes(topDomain.domain_id);
  })[0] || getCandidateItems(() => true)[0];

  if (candidate) {
    return {
      action_type: 'question',
      item: candidate,
      selection_reason_code: SELECTION_REASON_CODES.CONFIRM_DOMAIN_AFFINITY,
      evidence_gap_addressed: 'VALIDATE_PRIMARY_AFFINITY',
      rule_version: '2.0.0',
      target_domain: candidate.domain_tags?.[0] || topDomain.domain_id,
      reason_description: `Gathering final evidence on your engagement with ${topDomain.title}.`
    };
  }

  // No candidates remaining in bank
  return null;
}

/**
 * Updates the student evidence state with the latest response and reflections.
 */
export function updateEvidenceWithResponse(evidenceState, response) {
  const {
    question_id,
    question_type = 'interest',
    domain_tags = [],
    selected_option_key,
    selected_option_text = '',
    is_correct = null,
    is_idk = false,
    post_activity_enjoyment = null, // 1 to 5
    post_activity_willingness = null, // boolean
    hint_used = false,
    time_spent_seconds = 0,
    selection_reason_code = SELECTION_REASON_CODES.EXPLORE_REMAINING_UNCERTAINTY,
    evidence_gap_addressed = 'GENERAL'
  } = response;

  const newHistoryItem = {
    step: evidenceState.history.length + 1,
    question_id,
    question_type,
    domain_tags,
    selected_option_key,
    selected_option_text,
    is_correct,
    is_idk,
    post_activity_enjoyment,
    post_activity_willingness,
    hint_used,
    time_spent_seconds,
    selection_reason_code,
    evidence_gap_addressed,
    timestamp: new Date().toISOString()
  };

  const updatedEvidence = { ...evidenceState.domain_evidence };

  domain_tags.forEach(dId => {
    const current = updatedEvidence[dId];
    if (!current) return;

    let statedInterest = current.stated_interest_score;
    let enjoymentScore = current.activity_enjoyment_score;
    let enjoymentCount = current.activity_enjoyment_count;
    let willingness = current.willingness_to_continue;
    let ctScore = current.demonstrated_ct_score;
    let ctCount = current.demonstrated_ct_count;
    let guidedCount = current.guided_activities_count;
    let coverage = current.coverage_count + 1;

    // 1. Process Stated Interest Items
    if (question_type === 'interest') {
      if (!is_idk) {
        let weight = 3;
        if (typeof response.option_score === 'number') weight = response.option_score;
        else if (selected_option_text.includes('(5)') || selected_option_text.toLowerCase().includes('strongly like')) weight = 5;
        else if (selected_option_text.includes('(4)') || selected_option_text.toLowerCase().includes('like')) weight = 4;
        else if (selected_option_text.includes('(2)') || selected_option_text.toLowerCase().includes('dislike')) weight = 2;
        else if (selected_option_text.includes('(1)') || selected_option_text.toLowerCase().includes('strongly dislike')) weight = 1;

        const delta = (weight - 3) * 12; // -24 to +24
        statedInterest = Math.max(10, Math.min(100, statedInterest + delta));
      }
    }

    // 2. Process Post-Activity Enjoyment Reflection (1-5)
    if (post_activity_enjoyment !== null && post_activity_enjoyment !== undefined) {
      const normalizedEnjoyment = (post_activity_enjoyment / 5) * 100;
      enjoymentScore = enjoymentCount === 0 ? normalizedEnjoyment : Math.round((enjoymentScore * enjoymentCount + normalizedEnjoyment) / (enjoymentCount + 1));
      enjoymentCount += 1;
    }

    // 3. Process Willingness to Continue
    if (post_activity_willingness !== null && post_activity_willingness !== undefined) {
      willingness = Boolean(post_activity_willingness);
    }

    // 4. Process Demonstrated Computational Thinking / Task Performance
    if (question_type === 'computational_thinking' || question_type === 'logic') {
      if (is_correct !== null && !is_idk) {
        const itemScore = is_correct ? (hint_used ? 75 : 100) : 30;
        ctScore = ctCount === 0 ? itemScore : Math.round((ctScore * ctCount + itemScore) / (ctCount + 1));
        ctCount += 1;
      }
    }

    // 5. Track Guided Experiences Count
    if (question_type === 'guided_experience' || question_type === 'guided_activity') {
      guidedCount += 1;
    }

    // 6. Reduce uncertainty for this domain as evidence accumulates
    const uncertainty = Math.max(0.15, Number((1.0 - (coverage * 0.25)).toFixed(2)));

    updatedEvidence[dId] = {
      ...current,
      stated_interest_score: statedInterest,
      activity_enjoyment_score: enjoymentScore,
      activity_enjoyment_count: enjoymentCount,
      willingness_to_continue: willingness,
      demonstrated_ct_score: ctScore,
      demonstrated_ct_count: ctCount,
      guided_activities_count: guidedCount,
      coverage_count: coverage,
      uncertainty
    };
  });

  // Calculate overall uncertainty index
  const avgUncertainty = Number((
    Object.values(updatedEvidence).reduce((acc, val) => acc + val.uncertainty, 0) / SUPPORTED_DOMAINS.length
  ).toFixed(2));

  return {
    ...evidenceState,
    domain_evidence: updatedEvidence,
    history: [...evidenceState.history, newHistoryItem],
    uncertainty_index: avgUncertainty
  };
}

/**
 * Evaluates whether the adaptive session has met stopping criteria.
 */
export function evaluateStoppingConditions(evidenceState, config = {}) {
  const minQuestions = config.min_questions || 6;
  const maxQuestions = config.max_questions || 12;
  const decisiveMargin = config.decisive_margin || 20;

  const totalAnswered = evidenceState.history.length;
  const visitedClusters = getVisitedClusters(evidenceState);

  // Hard stop on max questions
  if (totalAnswered >= maxQuestions) {
    const idksCount = evidenceState.history.filter(h => h.is_idk).length;
    const isInsufficient = (idksCount / totalAnswered) >= 0.6 || visitedClusters.length < 2;

    return {
      should_stop: true,
      stop_reason: isInsufficient ? 'insufficient_evidence' : 'max_questions_reached',
      total_answered: totalAnswered,
      visited_clusters_count: visitedClusters.length
    };
  }

  // Cannot stop before minimum questions and minimum cluster coverage
  if (totalAnswered < minQuestions || visitedClusters.length < 3) {
    return {
      should_stop: false,
      stop_reason: 'gathering_minimum_coverage',
      total_answered: totalAnswered,
      visited_clusters_count: visitedClusters.length
    };
  }

  // Check for clear decisive lead with at least 1 guided activity experienced
  const scores = calculateDomainScores(evidenceState);
  const sorted = Object.values(scores).sort((a, b) => b.composite_score - a.composite_score);
  const leadGap = sorted[0].composite_score - sorted[1].composite_score;
  const hasGuidedExperience = sorted[0].guidedCount >= 1;

  if (leadGap >= decisiveMargin && hasGuidedExperience) {
    return {
      should_stop: true,
      stop_reason: 'decisive_lead_achieved',
      lead_domain: sorted[0].domain_id,
      lead_gap: leadGap,
      total_answered: totalAnswered,
      visited_clusters_count: visitedClusters.length
    };
  }

  return {
    should_stop: false,
    stop_reason: 'narrowing_hypotheses',
    total_answered: totalAnswered,
    visited_clusters_count: visitedClusters.length
  };
}

/**
 * Generates an explainable shortlist of top 2-3 domains with transparent evidence breakdowns.
 */
export function generateDomainShortlist(evidenceState, domainsCatalogue = []) {
  const scores = calculateDomainScores(evidenceState);
  const sorted = Object.values(scores).sort((a, b) => b.composite_score - a.composite_score);
  const topCandidates = sorted.slice(0, 3);

  const shortlist = topCandidates.map(candidate => {
    const dMeta = domainsCatalogue.find(d => d.id === candidate.domain_id) || {};
    const ev = evidenceState.domain_evidence[candidate.domain_id];

    // Build human-explainable rationale components
    let interestRationale = 'Neutral starting orientation';
    if (ev.stated_interest_score >= 70) {
      interestRationale = 'Strongly aligned with your stated preference for building and problem-solving';
    } else if (ev.stated_interest_score >= 55) {
      interestRationale = 'Moderate positive curiosity shown during vocational exploration questions';
    } else {
      interestRationale = 'Exploratory curiosity; interest developed during the session';
    }

    let reflectionRationale = 'No interactive labs completed yet';
    if (ev.activity_enjoyment_count > 0) {
      if (ev.activity_enjoyment_score >= 75) {
        reflectionRationale = `High engagement (${ev.activity_enjoyment_score}% enjoyment rating) on guided hands-on tasks`;
      } else if (ev.activity_enjoyment_score >= 50) {
        reflectionRationale = `Moderate engagement (${ev.activity_enjoyment_score}% enjoyment rating) on initial scenarios`;
      } else {
        reflectionRationale = `Lower initial enjoyment (${ev.activity_enjoyment_score}% rating); worth trying a different subfield project`;
      }
    }

    let exposureRationale = 'Zero prior technical exposure required to begin';
    if (ev.prior_exposure_level === 3) {
      exposureRationale = 'Substantial prior project exposure self-reported';
    } else if (ev.prior_exposure_level === 2) {
      exposureRationale = 'Foundational academic or hobby exposure self-reported';
    } else if (ev.prior_exposure_level === 1) {
      exposureRationale = 'Light introductory exposure self-reported';
    }

    let unknowns = [
      'Specific programming language syntax preference',
      'Preferred team collaboration environment vs independent engineering',
      'Advanced mathematical modeling depth'
    ];

    let whyWorthExploring = dMeta.description || `Offers impactful career opportunities spanning design, logic, and systems.`;
    let recommendedNextExperience = dMeta.projects?.[0] ? `${dMeta.projects[0].name}: ${dMeta.projects[0].desc}` : `Complete a 30-minute interactive introductory lab.`;

    return {
      domain_id: candidate.domain_id,
      title: candidate.title,
      cluster: candidate.cluster,
      match_score: candidate.composite_score,
      supporting_interest_evidence: interestRationale,
      relevant_activity_reflections: reflectionRationale,
      current_exposure_knowledge: exposureRationale,
      demonstrated_ct_score: ev.demonstrated_ct_score,
      important_unknowns: unknowns,
      why_worth_exploring: whyWorthExploring,
      recommended_next_experience: recommendedNextExperience,
      tools: dMeta.tools || [],
      roles: dMeta.roles || []
    };
  });

  return {
    is_shortlist: true,
    never_single_verdict: true,
    total_questions_evaluated: evidenceState.history.length,
    uncertainty_level: evidenceState.uncertainty_index < 0.4 ? 'low' : (evidenceState.uncertainty_index < 0.7 ? 'moderate' : 'high'),
    shortlist,
    student_actions: [
      { key: 'confirm_selection', label: 'Choose this direction and build semester roadmap' },
      { key: 'compare_domains', label: 'Compare top 2 domains side-by-side' },
      { key: 'explore_another', label: 'Explore an alternative domain' },
      { key: 'challenge_verdict', label: 'This does not reflect me — adjust preferences' }
    ]
  };
}
