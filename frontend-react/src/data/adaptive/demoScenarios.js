/**
 * Seed dataset for 6 Real-World Demonstration Scenarios
 *
 * Scenarios:
 * 1. Zero Experience -> Beginner route, foundational explainer, starter logic.
 * 2. Prior Python Experience -> Skips introductory syntax straight into Python Level 2/3.
 * 3. Knows Java but No SQL -> Split assessment: advanced Java concepts, beginner SQL foundation.
 * 4. Solid Foundations -> Strong starter diagnostic triggers deeper conceptual ladder items.
 * 5. Struggles at Intermediate -> Hits 2 incorrect answers, triggers demotion + prerequisite card.
 * 6. Different Backgrounds -> Parallel students showing distinct, customized learning routes.
 */

export const DEMO_SCENARIOS = [
  {
    id: 'demo_1_zero_experience',
    title: 'Scenario 1: No Prior Programming Experience',
    description: 'Student has zero prior exposure; diagnostic routes to Level 0 with explainer-first pacing.',
    student: {
      name: 'Aarav Sharma',
      email: 'aarav.beginner@demo.csepathfinder.edu',
      semester: 1,
      topicExperience: { python: 'none', sql: 'none', java: 'none' }
    },
    diagnosticResults: {
      score: 0.40,
      strongLogic: false
    },
    attempts: [
      {
        question_id: 'diag_logic_comp_001',
        topic: 'starter_diagnostic',
        correct: true,
        answer: 'A is greater than C',
        time_taken: 14.5
      },
      {
        question_id: 'diag_trace_var_003',
        topic: 'starter_diagnostic',
        correct: false,
        answer: "I don't know / haven't learned this yet",
        is_dont_know: true,
        time_taken: 6.2
      },
      {
        question_id: 'py_k_001',
        topic: 'python',
        correct: false,
        answer: "I don't know / haven't learned this yet",
        is_dont_know: true,
        time_taken: 8.0
      },
      {
        question_id: 'py_k_003',
        topic: 'python',
        correct: false,
        answer: '20',
        time_taken: 18.2
      }
    ],
    mastery: {
      python: { level: 0, confidence: 'high', evidence_count: 2 }
    },
    riasecVector: { R: 40, I: 50, A: 65, S: 70, E: 45, C: 40 },
    behaviorEvents: [{ type: 'guided_activity_reflection', details: 'Completed Python variables explainer card' }]
  },

  {
    id: 'demo_2_python_experienced',
    title: 'Scenario 2: Experienced Python Hobbyist',
    description: 'Self-reports intermediate Python; passes starter diagnostic and advances rapidly to Level 3.',
    student: {
      name: 'Sneha Patel',
      email: 'sneha.python@demo.csepathfinder.edu',
      semester: 3,
      topicExperience: { python: 'intermediate', sql: 'basic', java: 'none' }
    },
    diagnosticResults: {
      score: 1.0,
      strongLogic: true
    },
    attempts: [
      {
        question_id: 'py_k_006',
        topic: 'python',
        correct: true,
        answer: "'cherry'",
        time_taken: 6.4
      },
      {
        question_id: 'py_k_007',
        topic: 'python',
        correct: true,
        answer: '6 (1 + 2 + 3)',
        time_taken: 9.1
      },
      {
        question_id: 'py_k_012',
        topic: 'python',
        correct: true,
        answer: '[1, 2]',
        time_taken: 15.0
      },
      {
        question_id: 'py_k_013',
        topic: 'python',
        correct: true,
        answer: 'Sets use hash tables offering O(1) average lookup time versus O(n) linear search in lists',
        time_taken: 12.3
      }
    ],
    mastery: {
      python: { level: 3, confidence: 'high', evidence_count: 4 }
    },
    riasecVector: { R: 30, I: 85, A: 45, S: 40, E: 55, C: 60 },
    behaviorEvents: [{ type: 'retry', details: 'Voluntary speed improvement test' }]
  },

  {
    id: 'demo_3_java_pro_sql_novice',
    title: 'Scenario 3: Java Proficiency + SQL Novice (Split Assessment)',
    description: 'Student demonstrates Level 3 in Java OOP while receiving Level 1 relational database onboarding.',
    student: {
      name: 'Rohan Verma',
      email: 'rohan.java@demo.csepathfinder.edu',
      semester: 4,
      topicExperience: { python: 'none', sql: 'none', java: 'intermediate' }
    },
    diagnosticResults: {
      score: 0.80,
      strongLogic: true
    },
    attempts: [
      {
        question_id: 'java_k_006',
        topic: 'java',
        correct: true,
        answer: 'numbers.length',
        time_taken: 7.2
      },
      {
        question_id: 'java_k_007',
        topic: 'java',
        correct: true,
        answer: 'equals() compares the character contents, while == compares memory reference addresses',
        time_taken: 11.0
      },
      {
        question_id: 'java_k_013',
        topic: 'java',
        correct: true,
        answer: 'A subclass provides a specific implementation of a method that is already defined in its superclass',
        time_taken: 14.2
      },
      {
        question_id: 'sql_k_001',
        topic: 'sql',
        correct: true,
        answer: 'SELECT',
        time_taken: 5.0
      },
      {
        question_id: 'sql_k_006',
        topic: 'sql',
        correct: false,
        answer: "I don't know / haven't learned this yet",
        is_dont_know: true,
        time_taken: 9.8
      }
    ],
    mastery: {
      java: { level: 3, confidence: 'high', evidence_count: 3 },
      sql: { level: 1, confidence: 'medium', evidence_count: 2 }
    },
    riasecVector: { R: 65, I: 75, A: 35, S: 40, E: 50, C: 70 },
    behaviorEvents: []
  },

  {
    id: 'demo_4_foundations_to_deep',
    title: 'Scenario 4: High Algorithmic Foundations -> Deep Escalation',
    description: 'A student who aces Bebras tasks and immediately unlocks higher difficulty tier queries.',
    student: {
      name: 'Ananya Iyer',
      email: 'ananya.foundations@demo.csepathfinder.edu',
      semester: 2,
      topicExperience: { python: 'basic', sql: 'basic', java: 'basic' }
    },
    diagnosticResults: {
      score: 1.0,
      strongLogic: true
    },
    attempts: [
      {
        question_id: 'bebras_graph_001',
        topic: 'bebras_logic',
        correct: true,
        answer: 'No, because B and C was the only bridge connecting the two halves',
        time_taken: 10.1
      },
      {
        question_id: 'bebras_graph_003',
        topic: 'bebras_logic',
        correct: true,
        answer: 'Path 2 (7ms total: 4 + 3)',
        time_taken: 8.4
      },
      {
        question_id: 'bebras_fsm_004',
        topic: 'bebras_logic',
        correct: true,
        answer: 'Algorithm Alpha (1,000,000 operations vs 100,000,000 operations for Beta)',
        time_taken: 12.0
      }
    ],
    mastery: {
      bebras_logic: { level: 4, confidence: 'high', evidence_count: 3 }
    },
    riasecVector: { R: 40, I: 95, A: 50, S: 45, E: 60, C: 55 },
    behaviorEvents: [{ type: 'retry', details: 'Exploring alternate algorithmic solutions' }]
  },

  {
    id: 'demo_5_struggles_intermediate',
    title: 'Scenario 5: Intermediate Misconception -> Prerequisite Demotion',
    description: 'Student hits two consecutive incorrect answers in SQL Joins, triggering demotion to Level 2 + explainer.',
    student: {
      name: 'Vikram Joshi',
      email: 'vikram.remediation@demo.csepathfinder.edu',
      semester: 5,
      topicExperience: { python: 'basic', sql: 'intermediate', java: 'none' }
    },
    diagnosticResults: {
      score: 0.60,
      strongLogic: true
    },
    attempts: [
      {
        question_id: 'sql_k_012',
        topic: 'sql',
        correct: false,
        answer: 'All 10 student rows filled with NULLs',
        time_taken: 22.1
      },
      {
        question_id: 'sql_k_013',
        topic: 'sql',
        correct: false,
        answer: 'When the right table is smaller than the left table',
        time_taken: 19.4
      },
      {
        question_id: 'sql_k_008',
        topic: 'sql',
        correct: true,
        answer: 'COUNT(*) counts all rows including NULLs, while COUNT(email) counts only rows where email is not NULL',
        time_taken: 12.0
      }
    ],
    mastery: {
      sql: { level: 2, confidence: 'medium', evidence_count: 3 }
    },
    riasecVector: { R: 50, I: 60, A: 40, S: 50, E: 55, C: 75 },
    behaviorEvents: [{ type: 'guided_activity_reflection', details: 'Reviewed SQL INNER vs LEFT JOIN explainer card' }]
  },

  {
    id: 'demo_6_contrasting_backgrounds',
    title: 'Scenario 6: Creative/Design Background vs Systems Background',
    description: 'Demonstrates how artistic RIASEC answers favor Web/UI while investigative/realistic favor Systems/Security.',
    student: {
      name: 'Diya Sen',
      email: 'diya.creative@demo.csepathfinder.edu',
      semester: 3,
      topicExperience: { python: 'basic', sql: 'none', java: 'none' }
    },
    diagnosticResults: {
      score: 0.80,
      strongLogic: true
    },
    attempts: [
      {
        question_id: 'onet_a_001',
        topic: 'career_interest',
        correct: true,
        answer: 'Strongly Like (5)',
        time_taken: 5.5
      },
      {
        question_id: 'onet_a_002',
        topic: 'career_interest',
        correct: true,
        answer: 'Strongly Like (5)',
        time_taken: 4.8
      },
      {
        question_id: 'py_k_001',
        topic: 'python',
        correct: true,
        answer: 'print()',
        time_taken: 7.1
      }
    ],
    mastery: {
      python: { level: 2, confidence: 'medium', evidence_count: 2 }
    },
    riasecVector: { R: 30, I: 50, A: 92, S: 65, E: 70, C: 40 },
    behaviorEvents: []
  }
];

