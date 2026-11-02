/**
 * SkillGapService: Skill Gap & Readiness Analyzer
 *
 * Rules:
 * - Uses verified topic levels (Level 0–4) IN ADDITION TO completed semester courses.
 * - Recognizes real competency: if a student has verified Level 3 mastery in Python,
 *   their core programming competency is confirmed even if semester 1 coursework is unrecorded.
 * - Detects false security: if a course is marked completed but verified mastery is Level 0,
 *   flags an active knowledge gap requiring remedial reinforcement.
 */

import domainsData from '../data/domains.json' with { type: 'json' };

// Competency to topic mapping
const COMPETENCY_TOPIC_MAP = {
  'Python Basics': 'python',
  'Programming Fundamentals': 'python',
  'Core Programming': 'python',
  'Python Programming Basics': 'python',
  'Data Structures (Lists, Dicts, Sets)': 'python',
  'OOP Principles (Classes, Inheritance)': 'python',
  'SQL Database Queries': 'sql',
  'SQL Database Integration': 'sql',
  'Relational Databases': 'sql',
  'Logic & Algorithms': 'logic',
  'Linear Algebra': 'logic',
  'Probability & Inferential Statistics': 'logic',
  'Java Fundamentals': 'java',
  'OOP Concepts': 'java'
};

/**
 * Analyzes skill gaps for a domain considering BOTH verified mastery levels AND course completions.
 */
export function analyzeSkillGaps(domainId, verifiedMastery = {}, completedCourses = []) {
  const domain = domainsData.find(d => d.id === domainId || d.key === domainId) || domainsData[0] || {};
  const domainPrereqs = domain.prerequisites || ['Programming Fundamentals', 'Basic Math & Logic', 'Data Structures'];

  const completedCourseSet = new Set(
    completedCourses.map(c => typeof c === 'string' ? c.toLowerCase().trim() : (c.course_title || '').toLowerCase().trim())
  );

  const competencyEvaluations = [];
  let totalPointsEarned = 0;
  let maxPossiblePoints = domainPrereqs.length * 100;

  domainPrereqs.forEach(skill => {
    const topicKey = COMPETENCY_TOPIC_MAP[skill] || (skill.toLowerCase().includes('python') ? 'python' : (skill.toLowerCase().includes('sql') ? 'sql' : 'logic'));
    const masteryRecord = verifiedMastery[topicKey] || null;
    const verifiedLevel = masteryRecord ? (typeof masteryRecord === 'number' ? masteryRecord : (masteryRecord.level ?? 0)) : null;

    const isCourseDone = completedCourseSet.has(skill.toLowerCase()) ||
                         [...completedCourseSet].some(c => c.includes(skill.toLowerCase()) || skill.toLowerCase().includes(c));

    let status = 'gap';
    let readinessPoints = 0;
    let note = '';

    if (verifiedLevel !== null && verifiedLevel >= 3) {
      status = 'verified_mastery';
      readinessPoints = 100;
      note = `Level ${verifiedLevel} verified in assessment. Skill confirmed regardless of college course status.`;
    } else if (verifiedLevel === 2) {
      status = isCourseDone ? 'verified_mastery' : 'proficient';
      readinessPoints = isCourseDone ? 90 : 75;
      note = isCourseDone
        ? 'Level 2 verified + coursework completed. Solid foundational mastery.'
        : 'Level 2 verified in assessment. Foundational practice solid.';
    } else if (isCourseDone && (verifiedLevel === null || verifiedLevel === 1)) {
      status = 'in_progress';
      readinessPoints = 50;
      note = verifiedLevel === 1
        ? 'Coursework completed, but verified assessment shows Level 1 recall. Reinforcement recommended.'
        : 'Coursework marked complete. Take adaptive ladder assessment to verify mastery.';
    } else if (isCourseDone && verifiedLevel === 0) {
      status = 'gap_warning';
      readinessPoints = 25;
      note = 'Course completed on record, but diagnostic indicates Level 0 knowledge gap. Explainer review required.';
    } else if (verifiedLevel === 1) {
      status = 'in_progress';
      readinessPoints = 35;
      note = 'Basic recall verified (Level 1). Needs hands-on practical application.';
    } else {
      status = 'critical_gap';
      readinessPoints = 0;
      note = 'Prerequisite gap detected. No course completion or verified assessment on record.';
    }

    totalPointsEarned += readinessPoints;

    competencyEvaluations.push({
      skill,
      topic: topicKey,
      status,
      verifiedLevel,
      isCourseCompleted: isCourseDone,
      readinessPoints,
      note
    });
  });

  const overallReadinessPct = maxPossiblePoints > 0
    ? Math.round((totalPointsEarned / maxPossiblePoints) * 100)
    : 50;

  const criticalGaps = competencyEvaluations.filter(c => c.status === 'critical_gap' || c.status === 'gap_warning');
  const strengths = competencyEvaluations.filter(c => c.status === 'verified_mastery');

  return {
    domainId: domain.id || domainId,
    domainTitle: domain.title || domainId,
    overallReadinessPct,
    competencies: competencyEvaluations,
    criticalGaps,
    strengths,
    hasVerifiedData: Object.keys(verifiedMastery).length > 0
  };
}

export default {
  analyzeSkillGaps
};
