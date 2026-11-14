import test from 'node:test';
import assert from 'node:assert/strict';
import { DOMAIN_QUESTION_BANK } from './domainQuestionBank.js';
import {
  DomainAssessmentAgent,
  AnswerEvaluationAgent,
  SkillMappingAgent,
  RoadmapGenerationAgent,
  TrajectoryPlanningAgent,
  DomainComparisonEngine
} from './domainAssessmentAgent.js';

test('Domain Question Bank: 135 items across 9 canonical CSE domains with authentic provenance', () => {
  const canonicalDomains = ['ai', 'data', 'web', 'security', 'cloud', 'iot', 'robotics', 'vlsi', 'networking'];
  
  // Verify all 9 domains exist in the bank
  canonicalDomains.forEach(domId => {
    const items = DOMAIN_QUESTION_BANK[domId];
    assert.ok(items, `Domain ${domId} must exist in DOMAIN_QUESTION_BANK`);
    assert.ok(items.length >= 10, `Domain ${domId} must have at least 10 items, found ${items.length}`);
  });

  const allItems = Object.values(DOMAIN_QUESTION_BANK).flat();
  assert.equal(allItems.length, 135, `Expected exactly 135 items (9 domains x 15), found ${allItems.length}`);

  allItems.forEach(item => {
    assert.ok(item.id, 'Item must have an id');
    assert.ok(item.domainId, `Item ${item.id} must specify a domainId`);
    assert.ok(item.prompt, `Item ${item.id} must have a prompt`);
    assert.ok(item.difficulty >= 1 && item.difficulty <= 3, `Item ${item.id} difficulty must be 1, 2, or 3`);
    assert.ok(Array.isArray(item.options) && item.options.length >= 4, `Item ${item.id} must have at least 4 options`);
    
    // Check correct option exists
    const correctOpt = item.options.find(o => o.isCorrect);
    assert.ok(correctOpt, `Item ${item.id} must have a correct option`);
    assert.ok(correctOpt.key, `Correct option in ${item.id} must have key`);
    assert.ok(item.category, `Item ${item.id} must have a category`);
    
    // Provenance verification: O*NET, Bebras, Code.org, or PathFinder CSE framework
    assert.ok(item.provenance && item.provenance.source, `Item ${item.id} must have provenance source`);
    assert.ok(item.provenance.license, `Item ${item.id} must specify a license`);
    assert.ok(item.provenance.attribution, `Item ${item.id} must have proper attribution`);
  });
});

test('DomainAssessmentAgent: Generates exactly 10 domain-specific questions adapted to prerequisites', () => {
  const testDomains = ['ai', 'security', 'cloud', 'web', 'robotics'];
  
  testDomains.forEach(domainId => {
    const session = DomainAssessmentAgent.initSession({
      domainId,
      initialResults: {
        shortlist: [{ domainId, knowledgeScore: 75 }],
        history: [{ itemId: `dom_${domainId}_001` }]
      },
      alreadyAskedQuestionIds: [`dom_${domainId}_002`]
    });

    assert.equal(session.domainId, domainId);
    assert.equal(session.totalQuestions, 10);
    assert.equal(session.questions.length, 10);
    assert.equal(session.currentIndex, 0);
    assert.equal(session.isComplete, false);
    assert.ok(session.currentQuestion);
    
    // Check no duplicate IDs within the generated 10 questions
    const idSet = new Set(session.questions.map(q => q.id));
    assert.equal(idSet.size, 10, 'All 10 questions must have unique IDs');
    
    // Check excluded question is not included
    assert.ok(!idSet.has(`dom_${domainId}_001`), 'Excluded question should not appear in session');
    assert.ok(!idSet.has(`dom_${domainId}_002`), 'Excluded question should not appear in session');

    // Check all questions belong strictly to this domain
    session.questions.forEach(q => {
      assert.equal(q.domainId, domainId, `Question ${q.id} must belong to domain ${domainId}`);
    });
  });
});

test('AnswerEvaluationAgent: Evaluates student answers across multiple dimensions (not accuracy alone)', () => {
  let session = DomainAssessmentAgent.initSession({ domainId: 'ai' });

  // Simulate answering all 10 questions: 8 correct, 2 incorrect
  for (let i = 0; i < 10; i++) {
    const currentQ = session.currentQuestion;
    const correctOpt = currentQ.options.find(o => o.isCorrect);
    const incorrectOpt = currentQ.options.find(o => !o.isCorrect);
    
    const chosenKey = (i < 8) ? correctOpt.key : incorrectOpt.key;
    session = DomainAssessmentAgent.submitAnswer({
      session,
      selectedOptionKey: chosenKey,
      timeTakenSeconds: 30
    });
  }

  assert.equal(session.isComplete, true);
  assert.equal(session.answers.length, 10);

  const evaluation = AnswerEvaluationAgent.evaluate({ session });

  assert.equal(evaluation.totalQuestions, 10);
  assert.equal(evaluation.correctCount, 8);
  assert.equal(evaluation.accuracyPercentage, 80);
  assert.ok(evaluation.demonstratedKnowledgeScore > 0, 'Must compute difficulty-weighted knowledge score');
  
  // Multi-dimensional scores check
  assert.ok(evaluation.multiDimensionalScores.conceptualUnderstanding >= 0);
  assert.ok(evaluation.multiDimensionalScores.technicalProficiency >= 0);
  assert.ok(evaluation.multiDimensionalScores.problemSolvingAbility >= 0);
  assert.ok(evaluation.multiDimensionalScores.compositeReadiness > 0);
  
  // Strengths and gaps
  assert.ok(Array.isArray(evaluation.strengths), 'Must report strengths');
  assert.ok(Array.isArray(evaluation.knowledgeGaps), 'Must identify knowledge gaps');
  assert.equal(evaluation.knowledgeGaps.length, 2, 'Should identify 2 knowledge gaps for missed questions');
  assert.ok(evaluation.evaluatorSummary, 'Must provide diagnostic summary narrative');
});

test('SkillMappingAgent: Maps competencies, identifies mastered concepts, and recommends remediations', () => {
  let session = DomainAssessmentAgent.initSession({ domainId: 'security' });
  for (let i = 0; i < 10; i++) {
    const currentQ = session.currentQuestion;
    const chosenOpt = i % 2 === 0 ? currentQ.options.find(o => o.isCorrect) : currentQ.options.find(o => !o.isCorrect);
    session = DomainAssessmentAgent.submitAnswer({
      session,
      selectedOptionKey: chosenOpt.key
    });
  }
  const evaluationResults = AnswerEvaluationAgent.evaluate({ session });

  const skillProfile = SkillMappingAgent.mapSkills({
    domainId: 'security',
    evaluationResults,
    declaredPrerequisites: ['Networking Basics', 'Linux Fundamentals']
  });

  assert.equal(skillProfile.domainId, 'security');
  assert.ok(Array.isArray(skillProfile.competencyMappings));
  assert.ok(skillProfile.competencyMappings.length > 0);
  assert.ok(typeof skillProfile.masteredCount === 'number');
  assert.ok(typeof skillProfile.gapCount === 'number');
  assert.ok(typeof skillProfile.readinessRatio === 'number');
  assert.ok(skillProfile.summary.includes('Skill Mapping Agent'));
});

test('RoadmapGenerationAgent: Combines Sources A, B, and C into an 8-semester adaptive roadmap with all 9 components', () => {
  // Source A: Initial Diagnostic Profile
  const initialProfile = {
    domainInterestScores: { ai: 90 },
    prerequisiteProfile: {
      declaredPrerequisites: ['Python Programming', 'Linear Algebra']
    },
    shortlist: [{ domainId: 'ai', rank: 1 }]
  };

  // Source B: Domain Assessment Results (10 questions)
  const domainEvaluation = {
    demonstratedKnowledgeScore: 82,
    accuracyPercentage: 80,
    readinessTier: 'Accelerated / Advanced',
    strengths: ['Matrix Operations', 'Loss Functions'],
    knowledgeGaps: [
      { concept: 'Gradient Descent Optimization', prerequisite: 'Multivariate Calculus' }
    ]
  };

  // Source C: Academic Profile
  const academicProfile = {
    currentSemester: 3,
    academicYear: '2nd Year',
    completedSubjects: ['Engineering Mathematics I', 'Programming in C'],
    careerObjective: 'Machine Learning Research Engineer',
    availableWeeklyHours: '15-20 hours/week'
  };

  const roadmap = RoadmapGenerationAgent.generateRoadmap({
    domainId: 'ai',
    initialProfile,
    domainEvaluation,
    academicProfile
  });

  assert.equal(roadmap.domainId, 'ai');
  assert.ok(roadmap.semesters, 'Roadmap must contain semesters');
  assert.equal(roadmap.semesters.length, 8, 'Roadmap must span all 8 semesters');

  // Verify all 9 required components are present in every semester
  roadmap.semesters.forEach(sem => {
    assert.ok(sem.semester >= 1 && sem.semester <= 8, 'Semester must have valid number');
    // 1. Learning Objectives
    assert.ok(Array.isArray(sem.learningObjectives) && sem.learningObjectives.length > 0, `Sem ${sem.semester} missing learningObjectives`);
    // 2. Technical subjects and concepts to study
    assert.ok(Array.isArray(sem.technicalSubjects) && sem.technicalSubjects.length > 0, `Sem ${sem.semester} missing technicalSubjects`);
    // 3. Required programming languages, tools and technologies
    assert.ok(Array.isArray(sem.toolsAndLanguages) && sem.toolsAndLanguages.length > 0, `Sem ${sem.semester} missing toolsAndLanguages`);
    // 4. Domain-specific skills to develop
    assert.ok(Array.isArray(sem.domainSkills) && sem.domainSkills.length > 0, `Sem ${sem.semester} missing domainSkills`);
    // 5. Recommended courses and learning resources
    assert.ok(Array.isArray(sem.recommendedResources) && sem.recommendedResources.length > 0, `Sem ${sem.semester} missing recommendedResources`);
    // 6. Practical projects and implementation milestones
    assert.ok(Array.isArray(sem.practicalProjects) && sem.practicalProjects.length > 0, `Sem ${sem.semester} missing practicalProjects`);
    // 7. DSA and core CS preparation where relevant
    assert.ok(Array.isArray(sem.dsaAndCoreCS) && sem.dsaAndCoreCS.length > 0, `Sem ${sem.semester} missing dsaAndCoreCS`);
    // 8. Internship and placement preparation milestones
    assert.ok(Array.isArray(sem.internshipPlacementMilestones) && sem.internshipPlacementMilestones.length > 0, `Sem ${sem.semester} missing internshipPlacementMilestones`);
    // 9. Expected outcomes and measurable completion criteria
    assert.ok(Array.isArray(sem.expectedOutcomes) && sem.expectedOutcomes.length > 0, `Sem ${sem.semester} missing expectedOutcomes`);
  });

  // Verify intelligence sources attribution
  assert.ok(roadmap.intelligenceSourcesUsed.sourceA_InitialDiagnostic);
  assert.ok(roadmap.intelligenceSourcesUsed.sourceB_DomainAssessment);
  assert.ok(roadmap.intelligenceSourcesUsed.sourceC_AcademicContext);
  assert.equal(roadmap.studentAcademicProfile.currentSemester, 3);
});

test('TrajectoryPlanningAgent: Generates measurable milestones and progress tracking targets', () => {
  const roadmap = RoadmapGenerationAgent.generateRoadmap({
    domainId: 'cloud',
    initialProfile: { domainInterestScores: { cloud: 85 } },
    domainEvaluation: { demonstratedKnowledgeScore: 72, knowledgeGaps: [] },
    academicProfile: { currentSemester: 2 }
  });

  const trajectory = TrajectoryPlanningAgent.planTrajectory({
    domainId: 'cloud',
    roadmap,
    initialProgress: { sem_1_trajectory: true }
  });

  assert.equal(trajectory.domainId, 'cloud');
  assert.equal(trajectory.totalSemesters, 8);
  assert.ok(Array.isArray(trajectory.milestones));
  assert.equal(trajectory.milestones.length, 8);
  assert.ok(trajectory.trajectoryProgressPercentage > 0);
  assert.ok(Array.isArray(trajectory.careerMilestones));

  // Check milestone structure
  trajectory.milestones.forEach(m => {
    assert.ok(m.id);
    assert.ok(m.semesterNum);
    assert.ok(Array.isArray(m.keyMilestones));
    assert.equal(m.keyMilestones.length, 5, 'Must contain 5 milestone types (Core Skill, Technical Project, Course, DSA, Career)');
    assert.ok(m.measurableOutcome);
  });
});

test('DomainComparisonEngine: Compares evaluated domains side-by-side with trade-off analysis', () => {
  const domainReports = [
    {
      domainId: 'ai',
      domainTitle: 'Artificial Intelligence & Machine Learning',
      interestScore: 92,
      demonstratedKnowledgeScore: 78,
      readinessTier: 'Proficient / Intermediate',
      multiDimensionalScores: {
        conceptualUnderstanding: 85,
        technicalProficiency: 75,
        problemSolvingAbility: 80,
        compositeReadiness: 80
      },
      strengths: ['Calculus', 'Python', 'Heuristic Search'],
      knowledgeGaps: [{ concept: 'Backpropagation Gradient Tuning' }]
    },
    {
      domainId: 'security',
      domainTitle: 'Cybersecurity & Defense',
      interestScore: 84,
      demonstratedKnowledgeScore: 86,
      readinessTier: 'Accelerated / Advanced',
      multiDimensionalScores: {
        conceptualUnderstanding: 88,
        technicalProficiency: 85,
        problemSolvingAbility: 84,
        compositeReadiness: 86
      },
      strengths: ['Network Protocols', 'Linux Internals'],
      knowledgeGaps: [{ concept: 'Reverse Engineering ELF Binaries' }]
    }
  ];

  const comparison = DomainComparisonEngine.compare({ domainReports });

  assert.equal(comparison.domainsCount, 2);
  assert.ok(Array.isArray(comparison.evaluatedDomains));
  assert.equal(comparison.evaluatedDomains.length, 2);
  assert.ok(comparison.aiSynthesis, 'Must produce AI synthesis narrative');
  assert.ok(comparison.evaluatedDomains[0].difficultyCurve, 'Must provide difficulty rating');
  assert.ok(comparison.evaluatedDomains[0].weeklyCommitment, 'Must provide weekly hours commitment');
  assert.ok(comparison.evaluatedDomains[0].careerOpportunities, 'Must list career outcomes');
  assert.ok(comparison.evaluatedDomains[0].internshipPaths, 'Must provide internship path');
});
