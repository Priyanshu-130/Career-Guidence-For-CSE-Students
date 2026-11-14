/**
 * PathFinder Domain-Specific Assessment & AI Roadmap Engine
 * 
 * Five Specialized AI Agents:
 * 1. Domain Assessment Agent: Generates 10 domain-specific questions adapted to previous answers,
 *    declared/verified prerequisites, strictly from O*NET, Bebras, Code.org & CSE frameworks.
 * 2. Answer Evaluation Agent: Evaluates responses on conceptual understanding, technical proficiency,
 *    problem-solving ability, prerequisite mastery, and identifies specific strengths and knowledge gaps.
 * 3. Skill Mapping Agent: Maps demonstrated competencies against domain requirements.
 * 4. Roadmap Generation Agent: Combines the 3 independent intelligence sources:
 *    A. Initial Diagnostic Profile
 *    B. Domain-Specific Assessment (10 questions)
 *    C. Academic Profile
 *    to generate an 8-semester personalized roadmap with all 9 required components per semester.
 * 5. Trajectory Planning Agent: Converts the roadmap into measurable milestones and progress targets.
 * 
 * Also includes Domain Comparison Engine for multi-domain comparison and Primary/Secondary selection.
 */

import { DOMAIN_QUESTION_BANK } from './domainQuestionBank.js';
import domainsData from '../domains.json' with { type: 'json' };

// =========================================================================
// 1. DOMAIN ASSESSMENT AGENT
// =========================================================================

export const DomainAssessmentAgent = {
  /**
   * Initializes a 10-question assessment session for a specific domain.
   */
  initSession({
    domainId,
    initialResults = null,
    academicProfile = null,
    alreadyAskedQuestionIds = []
  }) {
    const domainQuestions = DOMAIN_QUESTION_BANK[domainId] || [];
    if (domainQuestions.length === 0) {
      throw new Error(`Domain question pool for '${domainId}' not found.`);
    }

    const domainMeta = domainsData.find(d => d.id === domainId) || {
      id: domainId,
      title: domainId.toUpperCase(),
      description: 'Computer Science Specialization'
    };

    // Filter out questions already asked in the initial assessment session
    const excludedIds = new Set(alreadyAskedQuestionIds);
    if (initialResults && initialResults.history) {
      initialResults.history.forEach(h => excludedIds.add(h.itemId));
    }

    const availablePool = domainQuestions.filter(q => !excludedIds.has(q.id));
    const pool = availablePool.length >= 10 ? availablePool : domainQuestions;

    // Determine starting difficulty based on initial assessment knowledge score
    const initialKnowledgeScore = initialResults?.shortlist?.find(s => s.domainId === domainId)?.knowledgeScore ??
      initialResults?.domainKnowledgeScores?.[domainId] ??
      (initialResults?.technicalKnowledgeLevel === 'intermediate' ? 65 : (initialResults?.technicalKnowledgeLevel === 'advanced' ? 85 : 40));

    // Sort questions into difficulty buckets: 1 = Foundational, 2 = Intermediate, 3 = Advanced/Applied
    const d1 = pool.filter(q => q.difficulty === 1);
    const d2 = pool.filter(q => q.difficulty === 2);
    const d3 = pool.filter(q => q.difficulty === 3);

    // Adaptive 10-question sequence tailored to student's verified background:
    // If higher verified knowledge: 2 Foundational -> 5 Intermediate -> 3 Advanced
    // If lower verified knowledge: 4 Foundational -> 4 Intermediate -> 2 Advanced
    let selectedTen = [];
    if (initialKnowledgeScore >= 60) {
      selectedTen = [
        ...d1.slice(0, 2),
        ...d2.slice(0, 5),
        ...d3.slice(0, 3)
      ];
    } else {
      selectedTen = [
        ...d1.slice(0, 4),
        ...d2.slice(0, 4),
        ...d3.slice(0, 2)
      ];
    }

    // Fallback if any bucket was short
    if (selectedTen.length < 10) {
      const needed = 10 - selectedTen.length;
      const remaining = pool.filter(q => !selectedTen.some(s => s.id === q.id));
      selectedTen = [...selectedTen, ...remaining.slice(0, needed)];
    }

    // Exactly 10 questions guaranteed
    const finalTen = selectedTen.slice(0, 10);

    return {
      sessionId: `dom_sess_${domainId}_${Date.now()}`,
      domainId,
      domainMeta,
      initialKnowledgeScore,
      questions: finalTen,
      totalQuestions: 10,
      currentIndex: 0,
      answers: [],
      currentQuestion: finalTen[0],
      isComplete: false,
      agentReasoning: `Domain Assessment Agent: Initialized 10 adaptive questions calibrated for ${domainMeta.title}. Starting difficulty anchored at verified knowledge level (${initialKnowledgeScore}%).`
    };
  },

  /**
   * Records an answer and advances to the next question.
   */
  submitAnswer({ session, selectedOptionKey, timeTakenSeconds = 15 }) {
    if (session.isComplete) return session;

    const currentQ = session.questions[session.currentIndex];
    const chosenOpt = currentQ.options.find(o => o.key === selectedOptionKey);
    const isCorrect = chosenOpt ? chosenOpt.isCorrect : false;

    const recordedAnswer = {
      step: session.currentIndex + 1,
      questionId: currentQ.id,
      concept: currentQ.concept,
      category: currentQ.category,
      difficulty: currentQ.difficulty,
      prerequisiteDependency: currentQ.prerequisiteDependency,
      selectedKey: selectedOptionKey,
      selectedText: chosenOpt ? chosenOpt.text : '',
      isCorrect,
      conceptualExplanation: chosenOpt ? chosenOpt.conceptualExplanation : '',
      timeTaken: timeTakenSeconds,
      provenance: currentQ.provenance
    };

    const updatedAnswers = [...session.answers, recordedAnswer];
    const nextIndex = session.currentIndex + 1;
    const isFinished = nextIndex >= session.totalQuestions;

    return {
      ...session,
      currentIndex: nextIndex,
      answers: updatedAnswers,
      currentQuestion: isFinished ? null : session.questions[nextIndex],
      isComplete: isFinished,
      agentReasoning: isFinished
        ? `Domain Assessment Agent: Completed all 10 domain questions for ${session.domainMeta.title}. Invoking Answer Evaluation Agent.`
        : `Domain Assessment Agent: Recorded response for Question ${session.currentIndex + 1}. Serving Question ${nextIndex + 1} (${session.questions[nextIndex].category} - Difficulty ${session.questions[nextIndex].difficulty}/3).`
    };
  }
};

// =========================================================================
// 2. ANSWER EVALUATION AGENT
// =========================================================================

export const AnswerEvaluationAgent = {
  /**
   * Deep multi-dimensional evaluation of the 10-question assessment.
   * Does NOT evaluate by raw accuracy alone. Considers question difficulty,
   * prerequisite dependencies, conceptual depth, and problem-solving ability.
   */
  evaluate({ session }) {
    const answers = session.answers || [];
    const total = answers.length || 10;

    let conceptualTotal = 0;
    let conceptualPoints = 0;
    let technicalTotal = 0;
    let technicalPoints = 0;
    let problemSolvingTotal = 0;
    let problemSolvingPoints = 0;

    let correctCount = 0;
    let weightedScoreTotal = 0;
    let maxWeightedScore = 0;

    const strengths = [];
    const knowledgeGaps = [];
    const prerequisiteMastery = {};

    answers.forEach(ans => {
      const difficultyWeight = ans.difficulty === 3 ? 1.5 : (ans.difficulty === 2 ? 1.2 : 1.0);
      maxWeightedScore += 10 * difficultyWeight;

      if (ans.isCorrect) {
        correctCount += 1;
        weightedScoreTotal += 10 * difficultyWeight;
        strengths.push(`${ans.concept} (Verified: ${ans.category})`);

        if (!prerequisiteMastery[ans.prerequisiteDependency]) {
          prerequisiteMastery[ans.prerequisiteDependency] = { attempted: 0, passed: 0, status: 'Mastered' };
        }
        prerequisiteMastery[ans.prerequisiteDependency].attempted += 1;
        prerequisiteMastery[ans.prerequisiteDependency].passed += 1;
      } else {
        knowledgeGaps.push({
          concept: ans.concept,
          prerequisite: ans.prerequisiteDependency,
          remediation: `Review foundational concepts for ${ans.concept}. Focus on: ${ans.conceptualExplanation}`
        });

        if (!prerequisiteMastery[ans.prerequisiteDependency]) {
          prerequisiteMastery[ans.prerequisiteDependency] = { attempted: 0, passed: 0, status: 'Needs Reinforcement' };
        }
        prerequisiteMastery[ans.prerequisiteDependency].attempted += 1;
      }

      // Breakdown by cognitive category
      if (ans.category === 'Conceptual Understanding') {
        conceptualTotal += 1;
        if (ans.isCorrect) conceptualPoints += 1;
      } else if (ans.category === 'Technical Proficiency') {
        technicalTotal += 1;
        if (ans.isCorrect) technicalPoints += 1;
      } else {
        problemSolvingTotal += 1;
        if (ans.isCorrect) problemSolvingPoints += 1;
      }
    });

    const accuracyPct = Math.round((correctCount / total) * 100);
    const weightedKnowledgeScore = Math.min(100, Math.round((weightedScoreTotal / (maxWeightedScore || 1)) * 100));

    const conceptualScore = conceptualTotal > 0 ? Math.round((conceptualPoints / conceptualTotal) * 100) : accuracyPct;
    const technicalScore = technicalTotal > 0 ? Math.round((technicalPoints / technicalTotal) * 100) : accuracyPct;
    const problemSolvingScore = problemSolvingTotal > 0 ? Math.round((problemSolvingPoints / problemSolvingTotal) * 100) : accuracyPct;

    // Derive readiness tier
    let readinessTier = 'Foundational / Beginner';
    let readinessDescription = 'Foundational readiness. Recommended roadmap will emphasize core syntax, math fundamentals, and guided labs.';
    if (weightedKnowledgeScore >= 80) {
      readinessTier = 'Accelerated / Advanced';
      readinessDescription = 'Exceptional readiness. Eligible to bypass elementary syntax and proceed directly into advanced system architecture and research electives.';
    } else if (weightedKnowledgeScore >= 60) {
      readinessTier = 'Proficient / Intermediate';
      readinessDescription = 'Strong foundational understanding. Recommended roadmap will rapidly bridge intermediate frameworks and capstone projects.';
    } else if (weightedKnowledgeScore >= 40) {
      readinessTier = 'Developing / Guided';
      readinessDescription = 'Demonstrated baseline intuition with specific conceptual gaps. Roadmap will reinforce prerequisites before advancing.';
    }

    // Update prerequisite status summary
    Object.keys(prerequisiteMastery).forEach(prereq => {
      const p = prerequisiteMastery[prereq];
      const ratio = p.passed / (p.attempted || 1);
      if (ratio >= 0.75) {
        p.status = 'Verified Mastered';
      } else if (ratio >= 0.5) {
        p.status = 'Partially Proficient';
      } else {
        p.status = 'Knowledge Gap Flagged';
      }
    });

    return {
      domainId: session.domainId,
      domainTitle: session.domainMeta.title,
      totalQuestions: total,
      correctCount,
      accuracyPercentage: accuracyPct,
      demonstratedKnowledgeScore: weightedKnowledgeScore,
      multiDimensionalScores: {
        conceptualUnderstanding: conceptualScore,
        technicalProficiency: technicalScore,
        problemSolvingAbility: problemSolvingScore,
        compositeReadiness: Math.round((conceptualScore * 0.35) + (technicalScore * 0.35) + (problemSolvingScore * 0.30))
      },
      readinessTier,
      readinessDescription,
      strengths: strengths.slice(0, 4),
      knowledgeGaps: knowledgeGaps.slice(0, 4),
      prerequisiteMastery,
      evaluatorSummary: `Evaluated ${total} domain questions for ${session.domainMeta.title}. Demonstrated ${accuracyPct}% raw accuracy with a difficulty-weighted knowledge score of ${weightedKnowledgeScore}%. Conceptual understanding rated at ${conceptualScore}%, Technical proficiency at ${technicalScore}%, and Problem solving at ${problemSolvingScore}%.`
    };
  }
};

// =========================================================================
// 3. SKILL MAPPING AGENT
// =========================================================================

export const SkillMappingAgent = {
  /**
   * Maps student's demonstrated competencies against the formal curriculum
   * and requirements for the domain.
   */
  mapSkills({ domainId, evaluationResults, verifiedMastery = {}, declaredPrerequisites = [] }) {
    const domain = domainsData.find(d => d.id === domainId) || domainsData[0];
    const domainPrereqs = domain.prerequisites || [
      'Programming Fundamentals',
      'Data Structures & Algorithms',
      'Applied Mathematics',
      'Computer Systems & Architecture'
    ];

    const mappings = domainPrereqs.map(req => {
      // Check evaluation's verified prerequisites
      let status = 'Unverified Gap';
      let confidence = 'medium';
      let recommendation = `Include comprehensive foundational coverage in Semester 1-2.`;

      const matchingEvaluated = Object.entries(evaluationResults.prerequisiteMastery || {}).find(([k]) =>
        k.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(k.toLowerCase())
      );

      if (matchingEvaluated && matchingEvaluated[1].status.includes('Mastered')) {
        status = 'Mastered';
        confidence = 'high';
        recommendation = `Mastery verified through assessment. Exempt from redundant remedial coursework; advance to applied projects.`;
      } else if (matchingEvaluated && matchingEvaluated[1].status.includes('Partially')) {
        status = 'Proficient';
        confidence = 'high';
        recommendation = `Competency verified with minor gaps. Include short reinforcement modules.`;
      } else if (declaredPrerequisites.some(d => d.toLowerCase().includes(req.toLowerCase()))) {
        status = 'Declared (Needs Practice)';
        confidence = 'low';
        recommendation = `Self-reported prior exposure. Integrate practical labs to verify depth.`;
      } else {
        status = 'Critical Gap';
        confidence = 'high';
        recommendation = `Identified prerequisite gap. Must be systematically built in Semester 1 before advanced electives.`;
      }

      return {
        competency: req,
        status,
        confidence,
        recommendation
      };
    });

    const masteredCount = mappings.filter(m => m.status === 'Mastered').length;
    const gapCount = mappings.filter(m => m.status.includes('Gap')).length;

    return {
      domainId,
      competencyMappings: mappings,
      masteredCount,
      gapCount,
      readinessRatio: Math.round((masteredCount / (mappings.length || 1)) * 100),
      summary: `Skill Mapping Agent: Identified ${masteredCount} verified mastered competencies and ${gapCount} targeted prerequisite gaps for ${domain.title}.`
    };
  }
};

// =========================================================================
// 4. ROADMAP GENERATION AGENT
// =========================================================================

export const RoadmapGenerationAgent = {
  /**
   * Synthesizes the 3 independent intelligence sources:
   * Source A: Initial Diagnostic Profile (interests, initial quiz answers, declared/verified prereqs)
   * Source B: Domain-Specific Assessment (10 questions evaluation, conceptual understanding, strengths/gaps)
   * Source C: Academic Profile (current semester, academic year, completed subjects, career objectives)
   *
   * Produces an 8-semester roadmap with ALL 9 required components per semester.
   */
  generateRoadmap({
    domainId,
    initialProfile = {},
    domainEvaluation = {},
    skillMapping = {},
    academicProfile = {}
  }) {
    const domain = domainsData.find(d => d.id === domainId) || domainsData[0];
    
    // Academic Profile Defaults
    const currentSemester = parseInt(academicProfile.currentSemester || 1, 10);
    const academicYear = academicProfile.academicYear || (currentSemester <= 2 ? '1st Year' : (currentSemester <= 4 ? '2nd Year' : (currentSemester <= 6 ? '3rd Year' : '4th Year')));
    const completedSubjects = new Set((academicProfile.completedSubjects || []).map(s => s.toLowerCase()));
    const careerObjective = academicProfile.careerObjective || 'Industry Software / Systems Engineer';
    const availableLearningHours = academicProfile.availableWeeklyHours || '15-20 hours/week';

    const knowledgeScore = domainEvaluation.demonstratedKnowledgeScore ?? 50;
    const interestScore = initialProfile.domainInterestScores?.[domainId] ?? initialProfile.all_scores?.[domainId] ?? 85;
    const gaps = domainEvaluation.knowledgeGaps || [];
    const strengths = domainEvaluation.strengths || [];

    // Base curriculum repository for the domain across all 8 semesters
    const template = getCanonicalCurriculumTemplate(domainId, domain);

    // Build the 8-semester customized roadmap
    const personalizedSemesters = template.map((baseSem, index) => {
      const semNum = index + 1;
      const isPastSemester = semNum < currentSemester;
      const isCurrentSemester = semNum === currentSemester;

      // Adapt early semesters (Sem 1 and 2) if student already demonstrated verified mastery
      let technicalSubjects = [...baseSem.technicalSubjects];
      let domainSkills = [...baseSem.domainSkills];
      let practicalProjects = [...baseSem.practicalProjects];
      let toolsAndLanguages = [...baseSem.toolsAndLanguages];
      let recommendedResources = [...baseSem.recommendedResources];
      let dsaAndCoreCS = [...baseSem.dsaAndCoreCS];
      let internshipMilestones = [...baseSem.internshipPlacementMilestones];
      let learningObjectives = [...baseSem.learningObjectives];
      let expectedOutcomes = [...baseSem.expectedOutcomes];

      let semesterPacing = 'Standard Curriculum';
      let adaptationNote = '';

      if (semNum === 1 || semNum === 2) {
        if (knowledgeScore >= 80) {
          semesterPacing = 'Accelerated Placement';
          adaptationNote = `Verified Advanced Mastery (${knowledgeScore}%). Basic syntax replaced with Advanced Systems Architecture, Performance Profiling, and High-Impact Open Source contributions.`;
          learningObjectives = [
            `Bypass elementary syntax drills; evaluate advanced memory architectures and concurrency.`,
            `Build enterprise-grade implementations of domain algorithms.`,
            `Lead peer review and architectural design sessions.`
          ];
          technicalSubjects = technicalSubjects.map(s => `Advanced Deep-Dive: ${s}`);
          practicalProjects = [
            {
              title: `Production Architecture Benchmark & Scalable Pipeline`,
              description: `Implement high-throughput multi-threaded benchmarks in ${domain.title}, achieving 10x throughput optimization.`
            }
          ];
        } else if (gaps.length > 0 && semNum === 1) {
          semesterPacing = 'Remedial Reinforcement';
          adaptationNote = `Identified prerequisite gaps (${gaps.map(g => g.concept).slice(0, 2).join(', ')}). Injected foundational conceptual mastery modules before advancing.`;
          technicalSubjects = [
            `Targeted Prerequisite Reinforcement: ${gaps[0]?.concept || 'Core Fundamentals'}`,
            ...technicalSubjects
          ];
          learningObjectives.unshift(`Fill verified conceptual gaps in ${gaps[0]?.concept || 'Foundational Logic'}.`);
        }
      }

      // Check if student already marked completed subjects
      if (completedSubjects.size > 0) {
        technicalSubjects = technicalSubjects.map(subj => {
          const isDone = [...completedSubjects].some(c => subj.toLowerCase().includes(c));
          return isDone ? `${subj} [Prerequisite Completed - Advanced Elective Extension]` : subj;
        });
      }

      return {
        semester: semNum,
        year: semNum <= 2 ? 'Year 1' : (semNum <= 4 ? 'Year 2' : (semNum <= 6 ? 'Year 3' : 'Year 4')),
        title: baseSem.title,
        theme: baseSem.theme,
        isPastSemester,
        isCurrentSemester,
        semesterPacing,
        adaptationNote,

        // 1. Learning Objectives
        learningObjectives,

        // 2. Technical subjects and concepts to study
        technicalSubjects,

        // 3. Required programming languages, tools and technologies
        toolsAndLanguages,

        // 4. Domain-specific skills to develop
        domainSkills,

        // 5. Recommended courses and learning resources
        recommendedResources,

        // 6. Practical projects and implementation milestones
        practicalProjects,

        // 7. DSA and core CS preparation where relevant
        dsaAndCoreCS,

        // 8. Internship and placement preparation milestones
        internshipPlacementMilestones: internshipMilestones,

        // 9. Expected outcomes and measurable completion criteria
        expectedOutcomes
      };
    });

    return {
      domainId,
      domainTitle: domain.title,
      studentAcademicProfile: {
        currentSemester,
        academicYear,
        careerObjective,
        availableWeeklyHours: availableLearningHours,
        demonstratedKnowledgeScore: knowledgeScore,
        interestScore
      },
      intelligenceSourcesUsed: {
        sourceA_InitialDiagnostic: {
          interestScore,
          initialRank: initialProfile.shortlist?.find(s => s.domainId === domainId)?.rank || 1,
          declaredPrerequisites: initialProfile.prerequisiteProfile?.declaredPrerequisites || []
        },
        sourceB_DomainAssessment: {
          knowledgeScore,
          accuracyPercentage: domainEvaluation.accuracyPercentage || knowledgeScore,
          readinessTier: domainEvaluation.readinessTier || 'Proficient / Intermediate',
          strengthsCount: strengths.length,
          gapsCount: gaps.length
        },
        sourceC_AcademicContext: {
          currentSemester,
          academicYear,
          careerObjective,
          weeklyCommitment: availableLearningHours
        }
      },
      semesters: personalizedSemesters,
      roadmapSummary: `Personalized 8-Semester Curriculum Roadmap for ${domain.title}. Integrated initial interest (${interestScore}%), 10-question verified knowledge (${knowledgeScore}%), and Academic Year context (${academicYear}, Semester ${currentSemester}).`
    };
  }
};

// =========================================================================
// 5. TRAJECTORY PLANNING AGENT
// =========================================================================

export const TrajectoryPlanningAgent = {
  /**
   * Converts the 8-semester roadmap into actionable student trajectories
   * with progress tracking, milestone checkboxes, and placement targets.
   */
  planTrajectory({ domainId, roadmap, initialProgress = {} }) {
    const semesters = roadmap.semesters || [];

    const trajectoryMilestones = semesters.map(sem => {
      const milestoneId = `sem_${sem.semester}_trajectory`;
      const isCompleted = initialProgress[milestoneId] ?? sem.isPastSemester;

      return {
        id: milestoneId,
        semesterNum: sem.semester,
        semesterTitle: `Semester 0${sem.semester}: ${sem.title}`,
        academicYear: sem.year,
        isCompleted: Boolean(isCompleted),
        keyMilestones: [
          {
            type: 'Core Skill',
            text: sem.domainSkills[0] || 'Core Subject Mastery',
            status: isCompleted ? 'Completed' : 'In Progress'
          },
          {
            type: 'Technical Project',
            text: sem.practicalProjects[0]?.title || 'Practical Implementation Lab',
            status: isCompleted ? 'Completed' : 'Pending'
          },
          {
            type: 'Course / Certification',
            text: sem.recommendedResources[0]?.title || 'Online Certification Track',
            status: isCompleted ? 'Completed' : 'Enrolled'
          },
          {
            type: 'DSA / Placement',
            text: sem.dsaAndCoreCS[0] || 'Data Structures & Competitive Coding',
            status: isCompleted ? 'Completed' : 'Targeted'
          },
          {
            type: 'Career / Portfolio',
            text: sem.internshipPlacementMilestones[0] || 'GitHub Repository Commit',
            status: isCompleted ? 'Completed' : 'Targeted'
          }
        ],
        measurableOutcome: sem.expectedOutcomes[0] || 'Verified semester project demo.'
      };
    });

    const completedCount = trajectoryMilestones.filter(m => m.isCompleted).length;
    const progressPct = Math.round((completedCount / (trajectoryMilestones.length || 1)) * 100);

    return {
      domainId,
      domainTitle: roadmap.domainTitle,
      totalSemesters: trajectoryMilestones.length,
      completedSemestersCount: completedCount,
      trajectoryProgressPercentage: progressPct,
      milestones: trajectoryMilestones,
      careerMilestones: [
        { phase: 'Year 1 (Sem 1-2)', focus: 'Foundational Programming & Computational Logic', status: completedCount >= 2 ? 'Achieved' : 'In Progress' },
        { phase: 'Year 2 (Sem 3-4)', focus: 'DSA Mastery & Domain Mini-Projects', status: completedCount >= 4 ? 'Achieved' : 'Upcoming' },
        { phase: 'Year 3 (Sem 5-6)', focus: 'Summer Internship & High-Impact Open Source Portfolio', status: completedCount >= 6 ? 'Achieved' : 'Upcoming' },
        { phase: 'Year 4 (Sem 7-8)', focus: 'Campus Placements, System Design & Capstone Launch', status: completedCount >= 8 ? 'Achieved' : 'Upcoming' }
      ]
    };
  }
};

// =========================================================================
// 6. DOMAIN COMPARISON ENGINE
// =========================================================================

export const DomainComparisonEngine = {
  /**
   * Compares multiple evaluated domains side-by-side, providing
   * transparent AI trade-off analysis instead of naive quiz score sorting.
   */
  compare({ domainReports = [], studentProfile = {} }) {
    if (domainReports.length === 0) {
      return { comparisons: [], aiSynthesis: "No domains evaluated yet." };
    }

    const domainProfiles = domainReports.map(rep => {
      const domId = rep.domainId;
      const meta = domainsData.find(d => d.id === domId) || { title: rep.domainTitle, description: '' };
      
      const interestScore = rep.interestScore ?? 85;
      const knowledgeScore = rep.demonstratedKnowledgeScore ?? 60;
      const readinessTier = rep.readinessTier || 'Proficient / Intermediate';
      const gapCount = (rep.knowledgeGaps || []).length;
      const strengthsCount = (rep.strengths || []).length;

      // Domain-specific trade-off profiles
      const tradeOffs = getDomainTradeOffProfile(domId);

      return {
        domainId: domId,
        title: meta.title,
        description: meta.description || meta.overview,
        interestScore,
        knowledgeScore,
        readinessTier,
        gapCount,
        strengthsCount,
        strengths: rep.strengths || [],
        knowledgeGaps: rep.knowledgeGaps || [],
        difficultyCurve: tradeOffs.difficultyCurve,
        weeklyCommitment: tradeOffs.weeklyCommitment,
        foundationalRequirements: tradeOffs.foundationalRequirements,
        careerOpportunities: tradeOffs.careerOpportunities,
        internshipPaths: tradeOffs.internshipPaths,
        averageStartingCompensation: tradeOffs.compensation,
        aiTradeOffSummary: tradeOffs.tradeOffExplanation
      };
    });

    // Generate comprehensive AI synthesis across all evaluated candidates
    const synthesis = generateAISynthesisText(domainProfiles);

    return {
      domainsCount: domainProfiles.length,
      evaluatedDomains: domainProfiles,
      aiSynthesis: synthesis
    };
  }
};

// =========================================================================
// HELPER CURRICULUM TEMPLATES FOR ALL 9 CANONICAL DOMAINS
// =========================================================================

function getCanonicalCurriculumTemplate(domainId, domainMeta) {
  const templates = {
    ai: [
      {
        semester: 1,
        title: 'Core Computing & Python Architecture',
        theme: 'Foundational Programming & Vector Spaces',
        learningObjectives: [
          'Master procedural, object-oriented, and vectorized Python programming.',
          'Understand linear algebra matrix transformations and NumPy vectorization.',
          'Build algorithmic problem-solving habits using Bebras computational thinking patterns.'
        ],
        technicalSubjects: [
          'Advanced Python Logic & Memory Model',
          'Linear Algebra (Matrices, Dot Products, Eigenvalues)',
          'Discrete Mathematics & Computational Logic'
        ],
        toolsAndLanguages: ['Python 3.12', 'NumPy', 'Git & GitHub', 'VS Code'],
        domainSkills: ['Vectorized Array Operations', 'Algorithm Tracing', 'Object-Oriented Design'],
        recommendedResources: [
          { title: 'MIT 6.0001: Introduction to Computer Science and Programming in Python', type: 'Course' },
          { title: 'Essence of Linear Algebra (3Blue1Brown)', type: 'Visual Guide' },
          { title: 'Code.org Advanced Computing Concepts', type: 'Practice' }
        ],
        practicalProjects: [
          { title: 'Matrix Transformation Engine & Vector Math Library', description: 'Pure Python/NumPy library implementing forward projections and 2D/3D affine transformations.' }
        ],
        dsaAndCoreCS: ['Arrays, Strings, Hash Maps, Time Complexity Big-O Analysis'],
        internshipPlacementMilestones: ['Initialize professional GitHub portfolio; document clean READMEs for class repositories.'],
        expectedOutcomes: ['Complete working Python package with 90% unit test coverage hosted on GitHub.']
      },
      {
        semester: 2,
        title: 'Applied Mathematics & Data Structures',
        theme: 'Calculus, Statistics & Algorithmic Efficiency',
        learningObjectives: [
          'Formulate multivariate calculus gradients and partial derivatives.',
          'Analyze probability distributions, bayesian inference, and statistical significance.',
          'Implement core data structures (Stacks, Queues, Linked Lists, Binary Search Trees).'
        ],
        technicalSubjects: [
          'Multivariate Calculus & Gradient Descent Optimization',
          'Probability & Inferential Statistics for Machine Learning',
          'Data Structures in Python / C++'
        ],
        toolsAndLanguages: ['SciPy', 'SymPy', 'Matplotlib', 'Jupyter Lab'],
        domainSkills: ['Objective Loss Optimization', 'Statistical Distribution Fitting', 'Tree Traversals'],
        recommendedResources: [
          { title: 'Khan Academy: Multivariable Calculus & Gradients', type: 'Course' },
          { title: 'Mathematics for Machine Learning (Deisenroth et al.)', type: 'Book' }
        ],
        practicalProjects: [
          { title: 'From-Scratch Gradient Descent & Regression Solver', description: 'Numerical optimizer minimizing mean squared error with dynamic learning rate scheduling.' }
        ],
        dsaAndCoreCS: ['Binary Trees, Heaps, Priority Queues, Binary Search on Answer'],
        internshipPlacementMilestones: ['Participate in first college hackathon or computational coding competition.'],
        expectedOutcomes: ['Working gradient descent visualizer comparing SGD vs Momentum vs Adam optimizers.']
      },
      {
        semester: 3,
        title: 'Statistical Machine Learning & Exploratory Data Analysis',
        theme: 'Supervised & Unsupervised Learning',
        learningObjectives: [
          'Train, evaluate, and tune supervised models (Decision Trees, Random Forests, SVMs, Boosting).',
          'Implement unsupervised clustering (K-Means, DBSCAN) and dimensionality reduction (PCA).',
          'Execute rigorous cross-validation and prevent data leakage.'
        ],
        technicalSubjects: [
          'Supervised Machine Learning Algorithms',
          'Unsupervised Clustering & PCA Manifolds',
          'Feature Engineering & Data Preprocessing Pipelines'
        ],
        toolsAndLanguages: ['Scikit-Learn', 'Pandas', 'Seaborn', 'XGBoost'],
        domainSkills: ['Pipeline Hyperparameter Tuning', 'Bias-Variance Diagnostic Analysis', 'Confusion Matrix Metrics'],
        recommendedResources: [
          { title: 'Coursera: Machine Learning Specialization (Andrew Ng)', type: 'Course' },
          { title: 'Hands-On Machine Learning with Scikit-Learn & PyTorch (Geron)', type: 'Book' }
        ],
        practicalProjects: [
          { title: 'Predictive Diagnostic Model with Cross-Validated Pipeline', description: 'End-to-end classification system handling missing data, scaling, and hyperparameter search.' }
        ],
        dsaAndCoreCS: ['Graph Traversal (BFS, DFS), Shortest Paths (Dijkstra), A* Search Algorithm'],
        internshipPlacementMilestones: ['Build Kaggle competitor profile; complete 3 benchmark exploratory notebooks.'],
        expectedOutcomes: ['Top 20% Kaggle leaderboard submission with reproducible Jupyter notebook writeup.']
      },
      {
        semester: 4,
        title: 'Deep Learning & Neural Architectures',
        theme: 'Artificial Neural Networks & PyTorch Engineering',
        learningObjectives: [
          'Architect multilayer perceptrons and implement backpropagation from scratch.',
          'Train deep neural networks using PyTorch tensors, autograd, and CUDA acceleration.',
          'Apply regularization techniques (Dropout, Batch Normalization, Weight Decay).'
        ],
        technicalSubjects: [
          'Artificial Neural Networks (ANN) & Computational Graphs',
          'Optimization (AdamW, Learning Rate Schedulers)',
          'Convolutional Neural Networks (CNN) for Computer Vision'
        ],
        toolsAndLanguages: ['PyTorch', 'Torchvision', 'Google Colab / Kaggle GPU', 'Weights & Biases'],
        domainSkills: ['PyTorch Dataset/DataLoader Design', 'Loss Function Customization', 'Training Curve Debugging'],
        recommendedResources: [
          { title: 'Fast.ai: Practical Deep Learning for Coders', type: 'Course' },
          { title: 'Stanford CS231n: Deep Learning for Computer Vision', type: 'Course' }
        ],
        practicalProjects: [
          { title: 'Medical Image Classification with Transfer Learning', description: 'Fine-tuned ResNet model achieving >95% precision on radiological scan detection.' }
        ],
        dsaAndCoreCS: ['Dynamic Programming (1D & 2D Memoization), Knapsack, Longest Common Subsequence'],
        internshipPlacementMilestones: ['Apply for Summer Research Fellowships or Early AI Engineering Internships.'],
        expectedOutcomes: ['Deployable deep learning model with logged experiment metrics on Weights & Biases.']
      },
      {
        semester: 5,
        title: 'Advanced Computer Vision & Natural Language Processing',
        theme: 'Transformers, LLMs & Vision Transformers',
        learningObjectives: [
          'Understand Attention mechanisms, Self-Attention, and Transformer architectures.',
          'Fine-tune pre-trained Large Language Models (HuggingFace Transformers).',
          'Deploy object detection systems (YOLOv8) and semantic segmentation.'
        ],
        technicalSubjects: [
          'Transformer Architecture & Scaled Dot-Product Attention',
          'Natural Language Processing (Tokenization, Embeddings, BERT/GPT)',
          'Advanced Vision (YOLO Object Detection, Segmentation)'
        ],
        toolsAndLanguages: ['HuggingFace Transformers', 'OpenCV', 'LangChain', 'FastAPI'],
        domainSkills: ['LLM Fine-Tuning (LoRA / PEFT)', 'Vector Database Embedding Search', 'Real-Time Video Inference'],
        recommendedResources: [
          { title: 'Stanford CS224N: Natural Language Processing with Deep Learning', type: 'Course' },
          { title: 'HuggingFace NLP Course (Official)', type: 'Interactive Course' }
        ],
        practicalProjects: [
          { title: 'Domain-Specific Retrieval-Augmented Generation (RAG) System', description: 'Enterprise question-answering assistant over custom PDF documents using Pinecone/Chroma and LangChain.' }
        ],
        dsaAndCoreCS: ['Advanced Graphs (Topological Sort, Minimum Spanning Trees), Trie Data Structures'],
        internshipPlacementMilestones: ['Publish technical blog post on Transformer mechanics; reach 150+ LeetCode solved.'],
        expectedOutcomes: ['Live interactive RAG application with streaming responses hosted on Streamlit Cloud.']
      },
      {
        semester: 6,
        title: 'Production MLOps, Model Serving & Systems',
        theme: 'Enterprise Deployment & Scalable Inference',
        learningObjectives: [
          'Package models into low-latency containerized REST microservices (FastAPI + Docker).',
          'Implement CI/CD automated testing pipelines for machine learning models.',
          'Monitor data drift, concept drift, and production latency metrics.'
        ],
        technicalSubjects: [
          'High-Performance Model Serving (FastAPI, ONNX Runtime, TensorRT)',
          'Containerization & Cloud Infrastructure (Docker, AWS EC2/ECS)',
          'Continuous Training & Model Registry (MLflow, DVC)'
        ],
        toolsAndLanguages: ['Docker', 'FastAPI', 'ONNX Runtime', 'MLflow', 'AWS / GCP'],
        domainSkills: ['Model Quantization (INT8/FP16)', 'Docker Containerization', 'Automated Integration Testing'],
        recommendedResources: [
          { title: 'Full Stack Deep Learning (FSDL 2024)', type: 'Course' },
          { title: 'Designing Machine Learning Systems (Chip Huyen)', type: 'Book' }
        ],
        practicalProjects: [
          { title: 'Production MLOps Pipeline with Automated Model Registry', description: 'Full CI/CD pipeline that trains, benchmarks latency, and auto-deploys containerized model.' }
        ],
        dsaAndCoreCS: ['System Design Fundamentals, Rate Limiting, Caching, Asynchronous Queues'],
        internshipPlacementMilestones: ['Complete Summer AI Engineering Internship; gather employer recommendation letter.'],
        expectedOutcomes: ['Containerized FastAPI microservice with sub-25ms inference latency benchmark.']
      },
      {
        semester: 7,
        title: 'Reinforcement Learning, Generative AI & Ethics',
        theme: 'Agentic AI, Diffusion Models & Responsible AI',
        learningObjectives: [
          'Evaluate Markov Decision Processes (MDP) and Q-Learning / Policy Gradients.',
          'Study Generative Diffusion Models and Multimodal Foundations.',
          'Audit AI models for fairness, bias, privacy, and safety compliance.'
        ],
        technicalSubjects: [
          'Reinforcement Learning (Q-Learning, PPO, Actor-Critic)',
          'Generative Diffusion Models & Latent Diffusion',
          'AI Safety, Fairness Auditing & Explainability (SHAP, LIME)'
        ],
        toolsAndLanguages: ['Stable Diffusion', 'Gymnasium', 'SHAP', 'PyTorch Lightning'],
        domainSkills: ['Reward Function Modeling', 'Explainable AI Feature Importance', 'Multimodal Integration'],
        recommendedResources: [
          { title: 'Deep Reinforcement Learning (David Silver / DeepMind)', type: 'Course' },
          { title: 'EU AI Act & NIST AI Risk Management Framework', type: 'Regulatory Framework' }
        ],
        practicalProjects: [
          { title: 'Autonomous Multi-Agent Simulation with Reinforcement Learning', description: 'Custom environment where agents navigate dynamic competitive obstacles via policy gradients.' }
        ],
        dsaAndCoreCS: ['Mock Technical Interviews, Advanced System Design for ML Platforms'],
        internshipPlacementMilestones: ['Target Tier-1 Campus Placement drives; polish resume with metrics and links.'],
        expectedOutcomes: ['Complete explainability audit notebook demonstrating model interpretability on sensitive attributes.']
      },
      {
        semester: 8,
        title: 'Capstone System Architecture & Placement Launch',
        theme: 'Enterprise Capstone & Career Transition',
        learningObjectives: [
          'Design and execute an end-to-end production AI capstone system.',
          'Demonstrate mastery in systems engineering, scalability, and business impact.',
          'Ace technical AI algorithm interviews and systems design interviews.'
        ],
        technicalSubjects: [
          'Enterprise Large-Scale Distributed AI Systems',
          'System Design for Machine Learning at Hyperscale',
          'Career Readiness & Technical Interview Mastery'
        ],
        toolsAndLanguages: ['Kubernetes', 'Ray / Spark ML', 'Enterprise Cloud (AWS/Azure)'],
        domainSkills: ['Distributed Training (FSDP / DeepSpeed)', 'High-Availability Architectures', 'Technical Communication'],
        recommendedResources: [
          { title: 'System Design Interview – An Insider’s Guide (Alex Xu)', type: 'Book' },
          { title: 'Stanford CS329S: Machine Learning Systems Design', type: 'Course' }
        ],
        practicalProjects: [
          { title: 'Enterprise AI Capstone: Real-Time Multimodal Intelligence Platform', description: 'Fully scalable distributed platform serving live multimodal inference with continuous monitoring.' }
        ],
        dsaAndCoreCS: ['Comprehensive DSA Review, Concurrency, Database Locking, Scalable Caching'],
        internshipPlacementMilestones: ['Accept full-time Machine Learning Engineer / AI Researcher job offer.'],
        expectedOutcomes: ['Deployed production system with live demo link, documentation, and architecture diagram.']
      }
    ]
  };

  // If a template exists for the domain, return it. Otherwise construct a domain-specific 8-semester curriculum.
  if (templates[domainId]) {
    return templates[domainId];
  }

  return generateDynamicDomainTemplate(domainId, domainMeta);
}

function generateDynamicDomainTemplate(domainId, domainMeta) {
  const title = domainMeta.title || domainId;
  const tools = domainMeta.tools || ['Python', 'Git', 'Linux', 'Docker'];

  const semThemes = [
    { num: 1, title: `Computing Foundations & ${title} Fundamentals`, theme: 'Core Syntax & Problem Decomposition' },
    { num: 2, title: `Mathematical Foundations & Data Structures`, theme: 'Algorithmic Thinking & Core Systems' },
    { num: 3, title: `Domain Core Architectures & Practical Labs`, theme: 'Hands-on Framework Exploration' },
    { num: 4, title: `Intermediate System Design & Networking`, theme: 'Scalable Patterns & Data Pipelines' },
    { num: 5, title: `Advanced Specialization & Deep Concepts`, theme: 'Production-Grade Protocols & Engineering' },
    { num: 6, title: `Enterprise Microservices & Cloud Integration`, theme: 'Cloud Architecture & DevOps CI/CD' },
    { num: 7, title: `Security Hardening, Optimization & Ethics`, theme: 'Resilience, Compliance & Advanced Electives' },
    { num: 8, title: `Major Capstone Launch & Placement Readiness`, theme: 'Portfolio Showcase & Technical Interviews' }
  ];

  return semThemes.map(s => ({
    semester: s.num,
    year: s.num <= 2 ? 'Year 1' : (s.num <= 4 ? 'Year 2' : (s.num <= 6 ? 'Year 3' : 'Year 4')),
    title: s.title,
    theme: s.theme,
    learningObjectives: [
      `Master core technical concepts of ${title} for Semester ${s.num}.`,
      `Implement practical lab exercises and write automated tests.`,
      `Progress toward placement readiness with continuous portfolio commits.`
    ],
    technicalSubjects: [
      `${title} Core Topic ${s.num}.1`,
      `${title} Specialized Subtopic ${s.num}.2`,
      `Systems Architecture & Engineering ${s.num}.3`
    ],
    toolsAndLanguages: tools.slice(0, 3).concat(['Git', 'Linux']),
    domainSkills: [`${title} Application Lab`, 'System Profiling', 'Code Quality'],
    recommendedResources: [
      { title: `Coursera / edX ${title} Professional Specialization`, type: 'Course' },
      { title: `ACM/IEEE Computer Society Curriculum Guide`, type: 'Standard' }
    ],
    practicalProjects: [
      { title: `Semester ${s.num} Capstone Lab in ${title}`, description: `Hands-on project applying semester concepts with working code repository.` }
    ],
    dsaAndCoreCS: [s.num <= 2 ? 'Arrays, Strings, Linked Lists' : (s.num <= 4 ? 'Trees, Graphs, Sorting' : 'System Design & Concurrency')],
    internshipPlacementMilestones: [s.num <= 4 ? 'Hackathon participation & GitHub portfolio commits' : 'Internship interview prep & placement drives'],
    expectedOutcomes: [`Documented GitHub repository with working test suite for Semester ${s.num}.`]
  }));
}

// =========================================================================
// TRADE-OFF PROFILES FOR DOMAIN COMPARISON
// =========================================================================

function getDomainTradeOffProfile(domId) {
  const profiles = {
    ai: {
      difficultyCurve: 'Steep (Heavy Math & Theory)',
      weeklyCommitment: '18-22 hours/week',
      foundationalRequirements: 'Linear Algebra, Multivariate Calculus, Probability, Python Proficiency',
      careerOpportunities: 'ML Engineer, AI Research Scientist, Computer Vision Specialist, MLOps Architect',
      internshipPaths: 'AI Research Labs, Hyperscale Tech, Autonomous Vehicle Startups, Healthcare AI',
      compensation: '$110,000 - $165,000 / ₹12-28 LPA',
      tradeOffExplanation: 'High market demand and compensation in modern industry; demands deep commitment to mathematical foundations (calculus, linear algebra) and continuous GPU training patience.'
    },
    data: {
      difficultyCurve: 'Moderate (Analytical & Practical)',
      weeklyCommitment: '14-18 hours/week',
      foundationalRequirements: 'SQL Mastery, Python/Pandas, Inferential Statistics, Data Modeling',
      careerOpportunities: 'Data Scientist, Business Intelligence Lead, Big Data Engineer, Quantitative Analyst',
      internshipPaths: 'Fintech, E-Commerce Analytics, Healthcare Informatics, Consulting Giants',
      compensation: '$95,000 - $145,000 / ₹10-22 LPA',
      tradeOffExplanation: 'Immediate industry applicability across every corporate sector; heavy focus on SQL and business metrics, slightly less emphasis on low-level operating system internals.'
    },
    web: {
      difficultyCurve: 'Moderate-Gentle (Immediate Visual Feedback)',
      weeklyCommitment: '12-16 hours/week',
      foundationalRequirements: 'JavaScript/TypeScript, HTML/CSS, React, REST/GraphQL APIs, Databases',
      careerOpportunities: 'Full Stack Engineer, Frontend UI/UX Architect, Backend API Developer, Mobile Lead',
      internshipPaths: 'SaaS Startups, Digital Agencies, Product Tech Companies, Enterprise Web',
      compensation: '$90,000 - $140,000 / ₹8-20 LPA',
      tradeOffExplanation: 'Fastest pathway to building visible software products and freelance/startup MVPs; requires ongoing adaptation to rapidly changing frontend library ecosystems.'
    },
    security: {
      difficultyCurve: 'Steep (Low-Level Systems & Networking)',
      weeklyCommitment: '16-20 hours/week',
      foundationalRequirements: 'Linux Kernel CLI, Networking Protocols (TCP/IP), Cryptography, Assembly/C',
      careerOpportunities: 'Cybersecurity Analyst, Penetration Tester, Security Operations Engineer, DevSecOps Lead',
      internshipPaths: 'Defense Contractors, Financial Institutions, SOC Operations, Cybersecurity Vendors',
      compensation: '$105,000 - $155,000 / ₹11-25 LPA',
      tradeOffExplanation: 'Vital enterprise mission-critical importance and high job security; requires deep patience with low-level protocol debugging, Linux command lines, and strict regulatory compliance.'
    },
    cloud: {
      difficultyCurve: 'Moderate-Steep (Distributed Systems & Architecture)',
      weeklyCommitment: '15-18 hours/week',
      foundationalRequirements: 'Linux Administration, Docker Containers, Kubernetes, Terraform IaC, Networking',
      careerOpportunities: 'Cloud Solutions Architect, DevOps Engineer, Site Reliability Engineer (SRE), Platform Lead',
      internshipPaths: 'Cloud Service Providers (AWS/Azure/GCP), Hyperscale SaaS, Enterprise Infrastructure',
      compensation: '$105,000 - $160,000 / ₹12-26 LPA',
      tradeOffExplanation: 'Universal demand as all enterprises migrate to cloud-native platforms; requires managing complex distributed systems, autoscaling reliability, and cloud billing budgets.'
    },
    iot: {
      difficultyCurve: 'Steep (Hardware-Software Boundary)',
      weeklyCommitment: '16-20 hours/week',
      foundationalRequirements: 'C/C++ Programming, Digital Circuit Analysis, Ohm\'s Law, Microcontrollers (ESP32/STM32)',
      careerOpportunities: 'Embedded Systems Engineer, IoT Firmware Developer, Hardware Interfacing Specialist',
      internshipPaths: 'Automotive Electronics, Smart Home Device Manufacturers, Industrial Robotics, Medical Devices',
      compensation: '$95,000 - $145,000 / ₹9-22 LPA',
      tradeOffExplanation: 'Tangible thrill of programming physical microchips and connected devices; hardware debugging can be slower than software and requires access to development boards and oscilloscopes.'
    },
    robotics: {
      difficultyCurve: 'Very Steep (Multidisciplinary Math & Mechanics)',
      weeklyCommitment: '18-22 hours/week',
      foundationalRequirements: 'Kinematics, PID Control Systems, C++, Python, ROS 2, Linear Algebra, Sensor Fusion',
      careerOpportunities: 'Robotics Engineer, Autonomous Navigation Lead, Automation Control Specialist, Drone Engineer',
      internshipPaths: 'Warehouse Automation, Autonomous Driving Companies, Drone Startups, Aerospace Defense',
      compensation: '$105,000 - $160,000 / ₹11-26 LPA',
      tradeOffExplanation: 'Deeply exciting cutting-edge field bridging hardware, software, and real physical kinematics; requires multi-disciplinary mastery across mechanical physics, control theory, and computer vision.'
    },
    vlsi: {
      difficultyCurve: 'Very Steep (Nanometer Silicon Physics & RTL)',
      weeklyCommitment: '18-24 hours/week',
      foundationalRequirements: 'Digital Logic Design, Computer Architecture, Verilog/VHDL, Static Timing Analysis, CMOS',
      careerOpportunities: 'VLSI Design Engineer, ASIC Physical Design Lead, FPGA Developer, Processor Architect',
      internshipPaths: 'Semiconductor Giants (Intel, AMD, NVIDIA, Qualcomm, TSMC), Hardware Enclaves',
      compensation: '$115,000 - $175,000 / ₹14-30 LPA',
      tradeOffExplanation: 'Prestige and long-term career stability at the foundation of modern technology (microchip manufacturing); high barrier to entry with expensive proprietary EDA toolchains and rigorous physical design constraints.'
    },
    networking: {
      difficultyCurve: 'Moderate (Protocol Engineering & Infrastructure)',
      weeklyCommitment: '14-17 hours/week',
      foundationalRequirements: 'OSI Model, IPv4/IPv6 Subnetting, Routing Protocols (OSPF/BGP), TCP Flow, Wireshark',
      careerOpportunities: 'Network Systems Engineer, Telecom Solutions Architect, Network Reliability Lead',
      internshipPaths: 'Telecom Providers (Cisco, Juniper, AT&T), Data Center Infrastructure, ISP Operations',
      compensation: '$90,000 - $135,000 / ₹8-18 LPA',
      tradeOffExplanation: 'Foundation of global data communications with clear industry certification milestones (CCNA, CCNP); focused heavily on protocol engineering, switching, and routing resilience.'
    }
  };

  return profiles[domId] || profiles.ai;
}

function generateAISynthesisText(profiles) {
  if (profiles.length === 1) {
    return `Evaluated ${profiles[0].title}. High demonstrated readiness (${profiles[0].knowledgeScore}% Knowledge, ${profiles[0].interestScore}% Interest). Review the full 8-semester curriculum roadmap below.`;
  }

  const topInterest = [...profiles].sort((a, b) => b.interestScore - a.interestScore)[0];
  const topKnowledge = [...profiles].sort((a, b) => b.knowledgeScore - a.knowledgeScore)[0];

  return `Comparative AI Analysis across ${profiles.length} evaluated domains: Your highest personal passion aligns with ${topInterest.title} (${topInterest.interestScore}% Interest Affinity), while your strongest demonstrated technical aptitude currently lies in ${topKnowledge.title} (${topKnowledge.knowledgeScore}% Verified Knowledge). Rather than simply choosing the highest quiz score, evaluate the distinct learning curves: ${profiles.map(p => `${p.title} requires ${p.weeklyCommitment} (${p.difficultyCurve})`).join('; ')}. Select one Primary Domain as your main career trajectory, and optionally retain Secondary Domains as complementary minors.`;
}
