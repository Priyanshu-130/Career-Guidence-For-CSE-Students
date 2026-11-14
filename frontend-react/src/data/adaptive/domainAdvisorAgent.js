/**
 * Multi-Vector Adaptive Domain Advisor Agent for CSE PathFinder
 * 
 * Explicit Division of Responsibility:
 * 1. Prerequisite Analyzer: Understand existing knowledge and identify gaps.
 * 2. Interest Analyzer: Discover domain preferences.
 * 3. Adaptive Quiz Generator: Generate the next question based on previous answers under controlled constraints.
 * 4. Answer Evaluator: Evaluate correctness and conceptual understanding.
 * 5. Diagnostic Agent: Calculate domain-wise profiles, keeping two strictly separate scores for every domain:
 *    - Interest Score: How much the student wants to learn that domain.
 *    - Knowledge Score: How much the student actually knows about that domain.
 *    (e.g., a beginner with 95% interest in AI/ML but only 10% demonstrated knowledge is NOT disqualified!).
 */

import adaptiveBank from './adaptiveQuestionBank.js';
import { QUIZ_DATA } from '../questions.js';
import { buildPhase6RecommendationFromSession } from './recommendationEngine.js';

// =========================================================================
// TRACK & DOMAIN METADATA SPECIFICATIONS
// =========================================================================

export const TRACK_DESCRIPTIONS = {
  software: {
    id: 'software',
    title: 'Software Engineering Track',
    tagline: 'Design, build, and scale world-class software systems, intelligent algorithms, and global platforms.',
    overview: 'The Software Engineering Track prepares students to engineer resilient software architectures, modern web and mobile applications, large-scale distributed systems, and cutting-edge artificial intelligence models. Students master computational thinking, algorithmic efficiency, clean software design, and enterprise data infrastructure.',
    whatStudentsLearn: [
      'Core programming paradigms (procedural, object-oriented, and functional).',
      'Algorithmic complexity, data structure design, and computational problem solving.',
      'Relational and distributed database design, ACID compliance, and SQL/NoSQL systems.',
      'Modern operating systems, concurrency, memory management, and process synchronization.',
      'Web and mobile full-stack architecture, REST/GraphQL APIs, and responsive human interfaces.',
      'Machine learning model training, computer vision, natural language processing, and neural nets.',
      'Threat modeling, vulnerability assessment, cryptography, and network defense.',
      'Cloud-native architecture, microservices, containerization (Docker/Kubernetes), and CI/CD pipelines.'
    ],
    importantSubjects: [
      'Data Structures & Algorithms (DSA)',
      'Object-Oriented Programming (OOP in Java/C++/Python)',
      'Database Management Systems (DBMS & SQL)',
      'Operating Systems & Kernel Interfaces',
      'Computer Networks & Protocols (TCP/IP, HTTP)',
      'Software Architecture & Design Patterns',
      'Artificial Intelligence & Machine Learning',
      'Cloud Computing & Distributed Systems',
      'Cybersecurity & Cryptography'
    ],
    foundationalKnowledge: [
      'Basic mathematical reasoning and boolean algebra.',
      'Logical problem decomposition and step-by-step analytical thinking.',
      'Curiosity for digital automation and software-driven problem solving.'
    ],
    specializationDomains: [
      'Artificial Intelligence & Machine Learning',
      'Data Science & Predictive Analytics',
      'Full Stack Web, Mobile & UX Engineering',
      'Cybersecurity & Digital Defense',
      'Cloud Computing & Distributed Systems'
    ],
    careerOpportunities: [
      'Software Engineer / Backend Developer',
      'Machine Learning Engineer / AI Researcher',
      'Data Scientist / Quantitative Analytics Lead',
      'Full Stack Developer / Frontend UI Architect',
      'Cloud Solutions Architect / DevOps Engineer',
      'Cybersecurity Specialist / Penetration Tester',
      'Site Reliability Engineer (SRE)'
    ]
  },
  hardware: {
    id: 'hardware',
    title: 'Hardware Engineering Track',
    tagline: 'Engineer silicon microchips, embedded robotics, connected IoT devices, and physical computing systems.',
    overview: 'The Hardware Engineering Track immerses students in the physical reality of computing—from microscopic semiconductor logic gates and VLSI layouts to real-time embedded firmware, robotics motor control, and high-frequency communication networks. Students bridge the physical and digital worlds by designing hardware that powers modern technology.',
    whatStudentsLearn: [
      'Digital circuit analysis, boolean minimization, logic gates, flip-flops, and sequential state machines.',
      'Computer organization, processor registers, instruction set architecture (ISA: RISC-V, ARM, x86).',
      'Microprocessor interfaces, interrupt service routines, timers, ADCs, and peripheral buses (SPI, I2C, UART).',
      'Embedded C/C++ programming for real-time operating systems (RTOS) and microcontrollers (ESP32, STM32).',
      'Very Large Scale Integration (VLSI), FPGA synthesis, and Hardware Description Languages (Verilog/VHDL).',
      'Internet of Things (IoT) edge sensors, low-power telemetry, and wireless protocols (BLE, LoRa, Zigbee).',
      'Robotics kinematics, actuator feedback loops, sensor fusion, and autonomous physical systems.',
      'High-speed networking hardware, optical switches, routers, and physical layer transmission.'
    ],
    importantSubjects: [
      'Digital Logic Design & Switching Theory',
      'Computer Organization & Architecture (COA)',
      'Microprocessors & Microcontrollers (8086, ARM Cortex)',
      'Embedded Systems & Real-Time Operating Systems (RTOS)',
      'VLSI Design & Hardware Description Languages (Verilog)',
      'Circuit Theory & Electronic Devices',
      'IoT Sensor Networks & Edge Prototyping',
      'Robotics Kinematics & Automation Control',
      'Computer & Telecommunication Networks'
    ],
    foundationalKnowledge: [
      'Fundamentals of electricity (Ohm’s law, Kirchhoff’s voltage and current laws).',
      'Elementary physics, signal concepts, and binary mathematics.',
      'Curiosity for physical machinery, circuits, sensors, and electronic devices.'
    ],
    specializationDomains: [
      'IoT & Embedded Systems',
      'Robotics & Automation Systems',
      'VLSI & Computer Architecture',
      'Networking & Communication Systems'
    ],
    careerOpportunities: [
      'Embedded Systems Engineer / Firmware Developer',
      'VLSI Design & Verification Engineer',
      'Robotics & Automation Systems Engineer',
      'Hardware Architect / FPGA Developer',
      'IoT Solutions & Edge Computing Specialist',
      'Network Systems Engineer / Telecom Lead',
      'Hardware Test & Integration Specialist'
    ]
  }
};

export const SEMESTER_OPTIONS = [
  { id: '1-2', label: 'Semester 1–2', sublabel: '1st Year · Exploring Foundations' },
  { id: '3-4', label: 'Semester 3–4', sublabel: '2nd Year · Building Core & Projects' },
  { id: '5-6', label: 'Semester 5–6', sublabel: '3rd Year · Specialization & Internships' },
  { id: '7-8', label: 'Semester 7–8', sublabel: 'Final Year · Placements & Capstone' }
];

export const DOMAIN_FACTOR_OPTIONS = {
  mathComfort: [
    { id: 'love_math', label: 'I enjoy math, statistics & working with numbers' },
    { id: 'balanced', label: 'I am comfortable with basic math when applied to projects' },
    { id: 'prefer_visual', label: 'I prefer visual building, design, or hands-on work over heavy math' }
  ],
  workStyle: [
    { id: 'visual_user', label: 'Seeing what I build (apps, screens, UI, robots, gadgets)' },
    { id: 'behind_scenes', label: 'Working behind the scenes (data, servers, security, logic)' },
    { id: 'mix', label: 'A mix of both visual and behind-the-scenes work' }
  ],
  careerGoal: [
    { id: 'job_ready', label: 'Get an internship or industry job with practical skills' },
    { id: 'build_products', label: 'Build real-world apps, startups, or creative products' },
    { id: 'research_ai', label: 'Explore AI, research, or higher studies (MS / MTech)' },
    { id: 'systems_defense', label: 'Work on security, cloud infrastructure, or core hardware' }
  ]
};

export const PREREQUISITE_DEFINITIONS = {
  software: [
    { id: 'prog_fund', name: 'Basic Coding (Python / C / Java / JS)', desc: 'Writing simple scripts, loops, functions, or small programs.' },
    { id: 'math_stats', name: 'Math, Statistics & Spreadsheets', desc: 'Probability, charts, Excel/Google Sheets, or linear algebra.' },
    { id: 'web_design', name: 'Visual Design, UI/UX or Web Basics', desc: 'Canva, Figma, HTML/CSS, or making apps look clean and easy to use.' },
    { id: 'dsa_logic', name: 'Problem Solving & Logic (DSA)', desc: 'Breaking down puzzles, arrays, sorting, or coding challenges.' },
    { id: 'dbms_data', name: 'Databases & Working with Data', desc: 'Organizing tables, SQL queries, or cleaning up large datasets.' },
    { id: 'linux_cloud', name: 'Terminal, Git & Hosting', desc: 'Using GitHub, command line, or putting a website/project online.' },
    { id: 'security_net', name: 'Networking, Privacy & Debugging', desc: 'Understanding how websites/Wi-Fi connect, or spotting bugs & security flaws.' }
  ],
  hardware: [
    { id: 'electronics', name: 'Basic Electronics & Tinkering', desc: 'Resistors, LEDs, batteries, multimeters, or repairing gadgets.' },
    { id: 'microcontrollers', name: 'Arduino / Raspberry Pi / ESP32', desc: 'Connecting sensors, motors, or building small smart-home DIY projects.' },
    { id: 'cad_mechanics', name: '3D Modeling, Physics & Mechanics', desc: 'Motion, balance, AutoCAD/Blender, or building RC/robotic models.' },
    { id: 'digital_logic', name: 'Logic Gates & Binary Math', desc: 'AND/OR/NOT gates, binary numbers, and how digital chips think.' },
    { id: 'networking_hw', name: 'Wi-Fi, Routers & Signals', desc: 'Setting up home networks, antennas, or troubleshooting connection lag.' },
    { id: 'embedded_c', name: 'C / Embedded Coding', desc: 'Writing simple code that controls physical pins, lights, or sensors.' }
  ]
};

export const DOMAIN_METADATA = {
  // Software Track Domains
  ai: {
    id: 'ai',
    track: 'software',
    name: 'Artificial Intelligence & Machine Learning',
    clusterKey: 'A',
    icon: 'Sparkles',
    color: '#E85D3F',
    plainSummary: 'Building smart systems that learn from data, recognize complex patterns, and automate intelligent decisions.',
    careers: ['Machine Learning Engineer', 'AI Research Scientist', 'NLP Specialist', 'Computer Vision Developer']
  },
  data: {
    id: 'data',
    track: 'software',
    name: 'Data Science & Big Data Analytics',
    clusterKey: 'B',
    icon: 'BarChart2',
    color: '#2EC4B6',
    plainSummary: 'Uncovering actionable predictions, empirical trends, and statistical insights buried inside massive datasets.',
    careers: ['Data Scientist', 'Data Analytics Architect', 'Business Intelligence Lead', 'Quantitative Analyst']
  },
  web: {
    id: 'web',
    track: 'software',
    name: 'Full Stack Web, Mobile & UX Engineering',
    clusterKey: 'C',
    icon: 'Layers',
    color: '#0284C7',
    plainSummary: 'Designing interactive, scalable applications, mobile software, and seamless user experiences enjoyed by millions.',
    careers: ['Full Stack Developer', 'Frontend Architect', 'Mobile App Creator (iOS/Android)', 'UI/UX Technologist']
  },
  security: {
    id: 'security',
    track: 'software',
    name: 'Cybersecurity & Digital Defense',
    clusterKey: 'D',
    icon: 'ShieldCheck',
    color: '#D97706',
    plainSummary: 'Protecting private data, analyzing vulnerabilities, simulating attacks, and fortifying global digital infrastructure.',
    careers: ['Ethical Hacker / Penetration Tester', 'Security Operations Analyst', 'Cryptographer', 'Incident Response Lead']
  },
  cloud: {
    id: 'cloud',
    track: 'software',
    name: 'Cloud Computing & Distributed Systems',
    clusterKey: 'E',
    icon: 'Cpu',
    color: '#6366F1',
    plainSummary: 'Architecting high-availability global server backbones, resilient microservices, and elastic cloud infrastructure.',
    careers: ['Cloud Architect', 'DevOps / SRE Engineer', 'Distributed Systems Specialist', 'Platform Reliability Lead']
  },

  // Hardware Track Domains
  iot: {
    id: 'iot',
    track: 'hardware',
    name: 'IoT & Embedded Systems',
    clusterKey: 'A',
    icon: 'Cpu',
    color: '#EC4899',
    plainSummary: 'Interfacing microcontrollers, sensors, firmware, and connected edge nodes to automate physical smart environments.',
    careers: ['Embedded Systems Engineer', 'IoT Firmware Developer', 'Hardware Integration Specialist', 'Edge Computing Architect']
  },
  robotics: {
    id: 'robotics',
    track: 'hardware',
    name: 'Robotics & Automation Systems',
    clusterKey: 'B',
    icon: 'Bot',
    color: '#F59E0B',
    plainSummary: 'Designing autonomous robotic kinematics, feedback controllers, mechatronic actuators, and intelligent physical machines.',
    careers: ['Robotics Engineer', 'Automation Systems Architect', 'Mechatronics Lead', 'Autonomous Navigation Developer']
  },
  vlsi: {
    id: 'vlsi',
    track: 'hardware',
    name: 'VLSI & Computer Architecture',
    clusterKey: 'C',
    icon: 'Layers',
    color: '#8B5CF6',
    plainSummary: 'Designing silicon microchips, semiconductor logic, pipelined CPU architectures, and hardware accelerators in Verilog.',
    careers: ['VLSI Design Engineer', 'Silicon Verification Engineer', 'ASIC/FPGA Developer', 'Processor Architect']
  },
  networking: {
    id: 'networking',
    track: 'hardware',
    name: 'Networking & Communication Systems',
    clusterKey: 'D',
    icon: 'Globe',
    color: '#10B981',
    plainSummary: 'Architecting enterprise communication networks, routing protocols, high-speed optical switches, and wireless 5G systems.',
    careers: ['Network Engineer', 'Telecommunications Architect', 'Systems Infrastructure Lead', 'Network Security Associate']
  },
  systems: {
    id: 'systems',
    track: 'software',
    name: 'Systems Programming & Operating Systems',
    clusterKey: 'F',
    icon: 'Terminal',
    color: '#10B981',
    plainSummary: 'Writing high-performance low-level software, device drivers, compilers, and operating system kernels.',
    careers: ['Systems Software Engineer', 'Kernel Developer', 'Compiler Engineer', 'Performance Optimization Lead']
  }
};

export const BEGINNER_EXPLAINERS = {
  A: {
    domainId: 'ai',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Teaching algorithms to learn from data patterns rather than manual coding.'
  },
  B: {
    domainId: 'data',
    title: 'Data Science & Analytics',
    description: 'Discovering hidden trends and predictive insights in complex datasets.'
  },
  C: {
    domainId: 'web',
    title: 'Full Stack Web & Human-Interface',
    description: 'Designing interactive apps, visual animations, and responsive software.'
  },
  D: {
    domainId: 'security',
    title: 'Cybersecurity & Digital Defense',
    description: 'Investigating vulnerabilities and safeguarding systems against cyber attackers.'
  },
  E: {
    domainId: 'cloud',
    title: 'Cloud & Distributed Systems',
    description: 'Building resilient 24/7 backbone networks that handle millions of requests.'
  }
};

// =========================================================================
// COMPONENT 1: PREREQUISITE ANALYZER
// Responsibility: Understand existing knowledge and identify gaps
// =========================================================================

export const PrerequisiteAnalyzer = {
  analyze({
    track = 'software',
    prerequisiteMode = 'zero', // 'zero' | 'prerequisites'
    declaredPrerequisites = [],
    customKnowledge = ''
  }) {
    const allPrereqs = PREREQUISITE_DEFINITIONS[track] || PREREQUISITE_DEFINITIONS.software;
    const declaredSet = new Set(declaredPrerequisites);
    const declaredItems = allPrereqs.filter(p => declaredSet.has(p.id));
    const missingItems = allPrereqs.filter(p => !declaredSet.has(p.id));

    const isZero = prerequisiteMode === 'zero' || declaredItems.length === 0;

    let estimatedBaseline = 'Foundational (Level 1)';
    let strategyName = 'Zero-Prerequisite Discovery Strategy';
    let strategySummary = '';
    let verificationFocus = [];

    if (isZero) {
      strategyName = 'Zero-Prerequisite Intuitive Discovery Strategy';
      strategySummary = `The Prerequisite Analyzer calibrated your diagnostic for zero coding syntax requirements. You will explore everyday problem scenarios with plain-English career connections.`;
      verificationFocus = ['Intuitive problem decomposition', 'Analytical curiosity', 'Pattern recognition'];
    } else {
      const ratio = declaredItems.length / allPrereqs.length;
      if (ratio >= 0.6) {
        estimatedBaseline = 'Intermediate to Advanced (Level 2–3)';
        strategyName = 'Comprehensive Technical Verification & Depth Calibration';
        strategySummary = `You declared prior experience in ${declaredItems.length} key subjects. The Prerequisite Analyzer identified key verification targets to verify conceptual depth.`;
      } else {
        estimatedBaseline = 'Early Academic / Foundational (Level 1–2)';
        strategyName = 'Targeted Prerequisite Calibration Strategy';
        strategySummary = `You declared familiarity with foundational concepts (${declaredItems.map(d => d.name.split('(')[0]).join(', ')}). The Prerequisite Analyzer will verify these while keeping unexplored subjects friendly.`;
      }
      verificationFocus = declaredItems.map(d => d.name.split('(')[0].trim());
    }

    return {
      track,
      prerequisiteMode: isZero ? 'zero' : 'prerequisites',
      declaredPrerequisites: declaredItems.map(d => d.name),
      declaredIds: declaredItems.map(d => d.id),
      missingPrerequisites: missingItems.map(d => d.name),
      missingIds: missingItems.map(d => d.id),
      customKnowledge: customKnowledge.trim(),
      estimatedBaseline,
      strategyName,
      strategySummary,
      verificationFocus,
      timestamp: new Date().toISOString()
    };
  }
};

export const analyzePrerequisites = PrerequisiteAnalyzer.analyze;

// =========================================================================
// COMPONENT 2: INTEREST ANALYZER
// Responsibility: Discover domain preferences (Independent of technical score)
// =========================================================================

export const InterestAnalyzer = {
  updateInterest({ currentInterestScores, currentEnjoymentScores, selectedOption }) {
    const newInterest = { ...currentInterestScores };
    const newEnjoyment = { ...currentEnjoymentScores };
    let primaryDomain = null;

    if (selectedOption) {
      // Accumulate curiosity & affinity weights
      if (selectedOption.interest_weights) {
        let maxWeight = 0;
        Object.entries(selectedOption.interest_weights).forEach(([dom, wt]) => {
          newInterest[dom] = (newInterest[dom] || 0) + wt;
          if (wt > maxWeight) {
            maxWeight = wt;
            primaryDomain = dom;
          }
        });
      }

      // Accumulate intrinsic enjoyment
      if (primaryDomain && selectedOption.enjoyment_weight) {
        newEnjoyment[primaryDomain] = (newEnjoyment[primaryDomain] || 0) + selectedOption.enjoyment_weight;
      }
    }

    return {
      interestScores: newInterest,
      enjoymentScores: newEnjoyment,
      primaryDomain
    };
  },

  calculateNormalizedInterest(interestScores, track) {
    const totalWeight = Object.values(interestScores).reduce((sum, v) => sum + v, 0) || 1;
    const trackDomains = track === 'hardware'
      ? ['iot', 'robotics', 'vlsi', 'networking']
      : ['ai', 'data', 'web', 'security', 'cloud', 'systems'];

    const normalized = {};
    trackDomains.forEach(domId => {
      const raw = interestScores[domId] || 0;
      // Normalized score 0-100%
      const pct = Math.min(98, Math.max(25, Math.round((raw / totalWeight) * 100 * (track === 'hardware' ? 2.5 : 2.2))));
      normalized[domId] = pct;
    });

    return normalized;
  }
};

// =========================================================================
// COMPONENT 3: ANSWER EVALUATOR
// Responsibility: Evaluate correctness and conceptual understanding
// =========================================================================

export const AnswerEvaluator = {
  evaluate({ currentItem, selectedOption, currentKnowledgeScores, currentPrerequisiteGaps, primaryDomain }) {
    const newKnowledge = {
      ...currentKnowledgeScores,
      domainDemonstrated: { ...(currentKnowledgeScores.domainDemonstrated || {}) },
      domainAttempts: { ...(currentKnowledgeScores.domainAttempts || {}) }
    };
    const newPrereqs = [...currentPrerequisiteGaps];

    const isVerificationItem = currentItem && (
      currentItem.tier === 'logic_bebras' || 
      currentItem.tier === 'guided_micro_codeorg' || 
      currentItem.tier === 'hardware_technical'
    );

    let evaluationVerdict = 'interest_exploration';
    let isCorrect = false;

    if (isVerificationItem && selectedOption) {
      newKnowledge.totalAnswered = (newKnowledge.totalAnswered || 0) + 1;
      const targetDom = primaryDomain || 'foundations';
      newKnowledge.domainAttempts[targetDom] = (newKnowledge.domainAttempts[targetDom] || 0) + 1;

      isCorrect = Boolean(selectedOption.is_correct);

      if (isCorrect) {
        newKnowledge.correct = (newKnowledge.correct || 0) + 1;
        newKnowledge.knowledgePoints = (newKnowledge.knowledgePoints || 0) + (selectedOption.knowledge_score || 1.0);
        newKnowledge.domainDemonstrated[targetDom] = (newKnowledge.domainDemonstrated[targetDom] || 0) + 1;
        evaluationVerdict = 'correct_conceptual_demonstration';
      } else {
        // Tag knowledge gap without penalizing passion!
        newPrereqs.push({
          itemId: currentItem.id,
          category: currentItem.category,
          prompt: currentItem.prompt,
          domain: targetDom,
          recommendedPrerequisite: selectedOption.career_meaning || 'Foundational Logic & Systems Concepts'
        });
        evaluationVerdict = 'prerequisite_gap_identified';
      }
    }

    return {
      knowledgeScores: newKnowledge,
      prerequisiteGaps: newPrereqs,
      isCorrect,
      isVerificationItem,
      verdict: evaluationVerdict
    };
  },

  calculateDomainKnowledgeScores(knowledgeScores, track, prerequisiteMode) {
    const trackDomains = track === 'hardware'
      ? ['iot', 'robotics', 'vlsi', 'networking']
      : ['ai', 'data', 'web', 'security', 'cloud', 'systems'];

    const domainKnowledge = {};
    const demonstrated = knowledgeScores.domainDemonstrated || {};
    const attempts = knowledgeScores.domainAttempts || {};

    trackDomains.forEach(domId => {
      const att = attempts[domId] || 0;
      const dem = demonstrated[domId] || 0;

      if (prerequisiteMode === 'zero') {
        // Beginners have 10-15% baseline knowledge - starting completely fresh
        domainKnowledge[domId] = 10;
      } else if (att > 0) {
        // Pro-rated knowledge score based on verified probes
        const ratio = dem / att;
        domainKnowledge[domId] = Math.round(ratio * 80) + 15;
      } else {
        // Untested domain for experienced student defaults to foundational baseline
        domainKnowledge[domId] = 20;
      }
    });

    return domainKnowledge;
  }
};

// =========================================================================
// COMPONENT 4: ADAPTIVE QUIZ GENERATOR
// Responsibility: Generate/select next question based on previous answers
// =========================================================================

export const AdaptiveQuizGenerator = {
  selectNextQuestion({ currentSession, candidates, leader, runnerUp, nextStepNum }) {
    let chosenItem = null;
    let agentReasoning = '';

    // STRATEGY A: Prerequisite Verification Trigger (Every 4th question if prerequisites declared)
    if (!chosenItem && currentSession.prerequisiteMode === 'prerequisites' && nextStepNum % 4 === 0) {
      const prereqCandidate = candidates.find(item => 
        item.tier === 'logic_bebras' || 
        item.tier === 'guided_micro_codeorg' || 
        item.tier === 'hardware_technical'
      );
      if (prereqCandidate) {
        chosenItem = prereqCandidate;
        agentReasoning = `Adaptive Quiz Generator: Injected a technical verification probe to assess conceptual readiness in declared prerequisites.`;
      }
    }

    // STRATEGY B: Disambiguation Trigger (Contrast top 2 domains when within 15%)
    const scoreDiff = (leader && runnerUp) ? (leader.score - runnerUp.score) : 999;
    const isCloseContest = leader && runnerUp && leader.score > 2 && (scoreDiff <= 1.5) && nextStepNum >= 5;

    if (!chosenItem && isCloseContest) {
      const leadDom = leader.domId;
      const runDom = runnerUp.domId;
      const disambigCandidate = candidates.find(item => {
        const domsInItem = new Set();
        item.options.forEach(opt => {
          Object.keys(opt.interest_weights || {}).forEach(d => domsInItem.add(d));
        });
        return domsInItem.has(leadDom) && domsInItem.has(runDom);
      });

      if (disambigCandidate) {
        chosenItem = disambigCandidate;
        const leadName = (DOMAIN_METADATA[leadDom]?.name || leadDom).split('&')[0].trim();
        const runName = (DOMAIN_METADATA[runDom]?.name || runDom).split('&')[0].trim();
        agentReasoning = `Adaptive Quiz Generator: Disambiguating close contest between ${leadName} and ${runName} to evaluate practical day-to-day workflow preference.`;
      }
    }

    // STRATEGY C: Anti-Echo-Chamber Exploration (Every 5th question)
    const isExplorationStep = (nextStepNum % 5 === 0);
    if (!chosenItem && isExplorationStep) {
      const sortedDomains = Object.entries(currentSession.interestScores)
        .sort((a, b) => b[1] - a[1])
        .map(([domId, score]) => ({ domId, score }));
      const underrepresented = sortedDomains.slice(-3);
      const targetUnderDom = underrepresented[Math.floor(Math.random() * underrepresented.length)]?.domId;

      const exploreCandidate = candidates.find(item => {
        return item.options.some(opt => opt.interest_weights && opt.interest_weights[targetUnderDom] > 0.4);
      });

      if (exploreCandidate) {
        chosenItem = exploreCandidate;
        agentReasoning = `Adaptive Quiz Generator: Exploring adjacent engineering domain to prevent early confirmation bias.`;
      }
    }

    // STRATEGY D: Exploitation / Depth Convergence on Emerging Leader
    if (!chosenItem && leader) {
      const leadDom = leader.domId;
      const depthCandidate = candidates.find(item => {
        return item.options.some(opt => opt.interest_weights && opt.interest_weights[leadDom] >= 0.7);
      });

      if (depthCandidate) {
        chosenItem = depthCandidate;
        const leadTitle = (DOMAIN_METADATA[leadDom]?.name || leadDom).split('&')[0].trim();
        agentReasoning = `Adaptive Quiz Generator: Deepening exploration of ${leadTitle} based on your demonstrated problem-solving enthusiasm.`;
      }
    }

    // Fallback: Pick next available candidate
    if (!chosenItem && candidates.length > 0) {
      chosenItem = candidates[0];
      agentReasoning = `Adaptive Quiz Generator: Evaluating multi-disciplinary alignment across ${currentSession.track} engineering.`;
    }

    return {
      chosenItem,
      agentReasoning
    };
  }
};

// =========================================================================
// COMPONENT 5: DIAGNOSTIC AGENT
// Responsibility: Calculate domain-wise profiles and recommendations
// Keeping TWO SEPARATE SCORES for every domain (Interest vs Knowledge)
// =========================================================================

export const DiagnosticAgent = {
  synthesize({ session }) {
    const track = session.track || 'software';
    const trackDomains = track === 'hardware'
      ? ['iot', 'robotics', 'vlsi', 'networking']
      : ['ai', 'data', 'web', 'security', 'cloud', 'systems'];

    // 1. Calculate TWO SEPARATE SCORES for every domain
    // A. Interest Score (How much student wants to learn that domain)
    const interestScores = InterestAnalyzer.calculateNormalizedInterest(session.interestScores, track);

    // B. Knowledge Score (How much student actually knows about that domain)
    const knowledgeScores = AnswerEvaluator.calculateDomainKnowledgeScores(session.knowledgeScores, track, session.prerequisiteMode);

    // 2. Rank primarily by INTEREST SCORE
    // A beginner with 95% interest in AI/ML but only 10% demonstrated knowledge
    // is NOT disqualified from receiving an AI/ML recommendation!
    const domainProfiles = trackDomains.map(domId => {
      const meta = DOMAIN_METADATA[domId] || {
        id: domId,
        name: domId.toUpperCase(),
        plainSummary: 'Engineering specialization',
        careers: ['Engineer', 'Specialist']
      };
      const interestPct = interestScores[domId] || 25;
      const knowledgePct = knowledgeScores[domId] || 10;

      return {
        domainId: domId,
        title: meta.name,
        summary: meta.plainSummary,
        careers: meta.careers,
        color: meta.color,
        interestScore: interestPct,
        knowledgeScore: knowledgePct,
        interestLabel: interestPct >= 80 ? 'High Passion' : interestPct >= 55 ? 'Moderate Interest' : 'Exploratory',
        knowledgeLabel: knowledgePct >= 70 ? 'Proficient' : knowledgePct >= 35 ? 'Intermediate' : 'Beginner / Starting Fresh',
        recommendationRationale: `Ranked with ${interestPct}% Interest Affinity. Current demonstrated knowledge is ${knowledgePct}%. PathFinder prioritizes your genuine passion and will build your technical knowledge through structured semester milestones.`
      };
    });

    // Sort by Interest Score
    const ranked = [...domainProfiles].sort((a, b) => b.interestScore - a.interestScore);

    const primary = ranked[0];
    const adjacent = ranked[1];
    const exploratory = ranked[2];

    // 3. Technical Knowledge Level across session
    const knowledge = session.knowledgeScores || { totalAnswered: 0, correct: 0 };
    let technicalKnowledgeLevel = 'Foundational (Level 1)';
    if (knowledge.totalAnswered >= 3) {
      const accuracy = knowledge.correct / knowledge.totalAnswered;
      if (accuracy >= 0.75) {
        technicalKnowledgeLevel = 'Proficient / Advanced (Level 3)';
      } else if (accuracy >= 0.4) {
        technicalKnowledgeLevel = 'Intermediate (Level 2)';
      } else {
        technicalKnowledgeLevel = 'Developing / Foundational (Level 1)';
      }
    } else if (session.prerequisiteMode === 'zero') {
      technicalKnowledgeLevel = 'Intuitive Beginner (Ready for Foundations)';
    }

    // 4. Uncertainty Index
    const spread = primary.interestScore - exploratory.interestScore;
    let uncertaintyIndex = 'Low';
    let uncertaintyDescription = 'High clarity and consistency observed across your scenario choices.';
    if (spread < 15) {
      uncertaintyIndex = 'High';
      uncertaintyDescription = 'Multidisciplinary profile: Your interests span multiple domains evenly. Exploring foundational projects across your top 2 domains is strongly recommended.';
    } else if (spread < 28) {
      uncertaintyIndex = 'Moderate';
      uncertaintyDescription = 'Clear primary affinity with strong complementary interests in adjacent engineering areas.';
    }

    // 5. Strengths & Weaknesses
    const strengths = [
      `High passion for ${primary.title.split('&')[0]} (${primary.interestScore}% Interest Score).`,
      `Demonstrated intuitive alignment with ${primary.summary.toLowerCase()}`
    ];
    if (knowledge.correct > 0) {
      strengths.push(`Verified ${knowledge.correct} technical reasoning probes accurately.`);
    }

    const weaknesses = (session.prerequisiteGaps || []).map(g => g.recommendedPrerequisite);
    if (weaknesses.length === 0 && session.prerequisiteMode === 'zero') {
      weaknesses.push('Formal programming syntax and algorithmic data structures.');
    }

    // 6. Phase 6 Single-Domain Weighted Scoring & Evidence Ledger
    const phase6Recommendation = buildPhase6RecommendationFromSession({
      track,
      rawInterestScores: session.interestScores,
      domainProfiles,
      domainInterestScores: interestScores,
      domainKnowledgeScores: knowledgeScores,
      currentLadderLevel: session.currentLadderLevel,
      knowledgeScores: session.knowledgeScores,
    });

    const resolvedTopDomain = phase6Recommendation?.topDomain || {
      domainId: primary.domainId,
      title: primary.title,
      finalScore: Number((primary.interestScore / 100).toFixed(4)),
      finalScorePct: primary.interestScore,
    };

    const history = session.history || [];
    const primaryPicks = history.filter(h => h.primaryDomain === resolvedTopDomain.domainId).length;

    const evidenceLedger = {
      whyItFits: (
        phase6Recommendation?.whyThisOne?.length
          ? phase6Recommendation.whyThisOne
          : [
              `Selected ${resolvedTopDomain.title.split('&')[0]} in ${primaryPicks} out of ${history.length} scenario evaluations.`,
              `Reported ${primary.interestScore}% Interest Affinity for ${primary.summary.toLowerCase()}`,
              `Showed work-style alignment in autonomous exploration and technical problem decomposition.`
            ]
      ).slice(0, 3),
      cautionOpenQuestions: [
        `Explore ${adjacent.title.split('&')[0]} in the technical audit log if you want to compare runner-up scores.`,
        (session.prerequisiteGaps || []).length > 0 
          ? `${(session.prerequisiteGaps || []).length} prerequisite concepts tagged for guided roadmap pacing.`
          : `Strong baseline reasoning observed across logic items.`
      ],
      prerequisiteRecommendations: weaknesses
    };

    const nextSteps = [
      `Enroll in Semester ${session.semester ? session.semester.split('-')[0].padStart(2, '0') : '01'} of the ${resolvedTopDomain.title} Curriculum Roadmap.`,
      `Begin with foundational coursework to bridge current readiness (${resolvedTopDomain.readinessScorePct ?? primary.knowledgeScore}%) up to proficiency.`,
      `Review India market demand and high-value skills on the ${resolvedTopDomain.title} Domain Page.`
    ];

    if (session.semester === '5-6' || session.semester === '7-8') {
      nextSteps[0] = `Focus on hands-on ${resolvedTopDomain.title} portfolio projects and internship/placement prep tailored for Semester ${session.semester}.`;
    } else if (session.semester === '3-4') {
      nextSteps[0] = `Start building 1–2 practical mini-projects in ${resolvedTopDomain.title} alongside your Semester ${session.semester} coursework.`;
    }

    if (session.domainFactors?.careerGoal === 'research_ai') {
      nextSteps.push(`Look for faculty-guided research projects or open-source labs in ${resolvedTopDomain.title}.`);
    } else if (session.domainFactors?.careerGoal === 'build_products') {
      nextSteps.push(`Join a hackathon or build an end-to-end user-facing prototype in ${resolvedTopDomain.title}.`);
    }

    return {
      track,
      trackTitle: track === 'hardware' ? 'Hardware Engineering Track' : 'Software Engineering Track',
      semester: session.semester || '1-2',
      domainFactors: session.domainFactors || {},
      prerequisiteProfile: {
        mode: session.prerequisiteMode,
        declaredCount: (session.declaredPrerequisites || []).length,
        declaredPrerequisites: session.declaredPrerequisites || [],
        verificationItemsAttempted: knowledge.totalAnswered,
        verifiedCount: knowledge.totalAnswered,
        verificationItemsCorrect: knowledge.correct,
        verifiedCorrect: knowledge.correct
      },
      technicalKnowledgeLevel,
      top_domain: resolvedTopDomain.title,
      domain_id: resolvedTopDomain.domainId,
      confidence_score: Math.min(95, primary.interestScore),
      final_score: resolvedTopDomain.finalScore,
      final_score_pct: resolvedTopDomain.finalScorePct,
      why_this_one: (phase6Recommendation?.whyThisOne || evidenceLedger.whyItFits).slice(0, 3),
      lower_ranked_domains: phase6Recommendation?.lowerRankedDomains || [],
      phase6Recommendation,
      rawInterestScores: session.interestScores,
      uncertainty_index: uncertaintyIndex,
      uncertainty_description: uncertaintyDescription,

      // DUAL SCORES FOR EVERY DOMAIN (Mandatory requirement)
      domainProfiles,
      domainInterestScores: interestScores,
      domainKnowledgeScores: knowledgeScores,
      all_scores: interestScores, // For Chart.js compatibility

      // Explainable Top 3 Shortlist with dual scores
      shortlist: [
        {
          rank: 1,
          tier: 'Primary Specialization',
          domainId: primary.domainId,
          title: primary.title,
          matchPct: primary.interestScore,
          interestScore: primary.interestScore,
          knowledgeScore: primary.knowledgeScore,
          summary: primary.summary,
          careers: primary.careers
        },
        {
          rank: 2,
          tier: 'Strong Adjacent Domain',
          domainId: adjacent.domainId,
          title: adjacent.title,
          matchPct: adjacent.interestScore,
          interestScore: adjacent.interestScore,
          knowledgeScore: adjacent.knowledgeScore,
          summary: adjacent.summary,
          careers: adjacent.careers
        },
        {
          rank: 3,
          tier: 'Exploratory Runner-Up',
          domainId: exploratory.domainId,
          title: exploratory.title,
          matchPct: exploratory.interestScore,
          interestScore: exploratory.interestScore,
          knowledgeScore: exploratory.knowledgeScore,
          summary: exploratory.summary,
          careers: exploratory.careers
        }
      ],

      strengths,
      weaknesses,
      missingFoundationalSkills: weaknesses,
      evidence_ledger: evidenceLedger,
      readiness_summary: {
        items_evaluated: knowledge.totalAnswered,
        verified_correct: knowledge.correct,
        prerequisites_flagged: (session.prerequisiteGaps || []).length,
        skipped_count: history.filter(h => h.status === 'skipped' || h.isSkipped).length
      },
      auditTrail: history.map(h => ({
        step: h.step,
        itemId: h.itemId,
        prompt: h.prompt,
        status: h.status || (h.isSkipped ? 'skipped' : h.isDontKnow ? 'dont_know' : h.isCorrect === true ? 'correct' : h.isCorrect === false ? 'incorrect' : 'answered'),
        selectedKey: h.selectedKey,
        selectedText: h.selectedText,
        reServed: Boolean(h.reServed)
      })),
      ladderEvents: session.ladderEvents || [],
      recommendedNextSteps: nextSteps
    };
  }
};

// =========================================================================
// QUESTION POOL GENERATOR
// =========================================================================

function buildFriendlySoftwarePool(prerequisiteMode = 'zero') {
  const swQuestions = (QUIZ_DATA.software && QUIZ_DATA.software.questions) || [];
  const clusterMap = {
    A: { domain: 'ai', secondary: 'data' },
    B: { domain: 'data', secondary: 'ai' },
    C: { domain: 'web', secondary: 'systems' },
    D: { domain: 'security', secondary: 'systems' },
    E: { domain: 'cloud', secondary: 'systems' }
  };

  const baseItems = swQuestions.map((q, idx) => {
    const cleanPrompt = q.q.replace(/^\d+\.\s*/, '');
    const options = Object.entries(q.options || {}).map(([key, text]) => {
      const mapping = clusterMap[key] || { domain: 'ai' };
      const weights = { [mapping.domain]: 1.0 };
      if (mapping.secondary) weights[mapping.secondary] = 0.25;
      return {
        key,
        text,
        career_meaning: '',
        interest_weights: weights,
        enjoyment_weight: 0.9
      };
    });

    return {
      id: `sw_friendly_${String(idx + 1).padStart(3, '0')}`,
      track: 'software',
      category: q.category || 'Domain Discovery',
      tier: 'interest_onet',
      target_routes: ['beginner', 'experienced'],
      prompt: cleanPrompt,
      plain_english_helper: 'Pick the option that feels most natural to you.',
      provenance: {
        source: 'CSE PathFinder Plain-English Question Bank',
        license: 'CC-BY-4.0',
        is_modified: false
      },
      options
    };
  });

  if (prerequisiteMode === 'zero') {
    return baseItems;
  }

  // Clear, practical & jargon-free questions for students who already have some prerequisites
  const prerequisiteFriendlyScenarios = [
    {
      id: 'sw_pre_001',
      category: 'Project Role',
      tier: 'cse_scenario_original',
      prompt: 'Your team is building a college campus app from scratch. Which part would you volunteer to build first?',
      options: [
        { key: 'A', text: 'A smart assistant that answers student questions about classes and events automatically.', interest_weights: { ai: 1.0, data: 0.2 }, enjoyment_weight: 0.9 },
        { key: 'B', text: 'A dashboard showing attendance trends, popular clubs, and feedback charts.', interest_weights: { data: 1.0, ai: 0.2 }, enjoyment_weight: 0.9 },
        { key: 'C', text: 'The screens, buttons, navigation, and smooth mobile-friendly design.', interest_weights: { web: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'D', text: 'The login system, password safety, and making sure no one can fake votes or data.', interest_weights: { security: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'E', text: 'Putting the app online so 2,000 students can open it during fest registration without crashing.', interest_weights: { cloud: 1.0, systems: 0.3 }, enjoyment_weight: 0.9 }
      ]
    },
    {
      id: 'sw_pre_002',
      category: 'Problem Solving',
      tier: 'cse_scenario_original',
      prompt: 'A popular shopping website suddenly slows down during a big sale. What is the first thing you want to investigate?',
      options: [
        { key: 'A', text: 'Whether the product recommendation engine is taking too long to suggest items.', interest_weights: { ai: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Which products and pages are getting the most clicks in the database records.', interest_weights: { data: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'C', text: 'Why images and buttons are freezing on the user screen.', interest_weights: { web: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'D', text: 'Whether bots or fake accounts are flooding the site to crash it.', interest_weights: { security: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'E', text: 'Whether the server needs extra backup machines to share the heavy traffic.', interest_weights: { cloud: 1.0, systems: 0.4 }, enjoyment_weight: 0.85 }
      ]
    },
    {
      id: 'sw_pre_003',
      category: 'Hands-On Preference',
      tier: 'cse_scenario_original',
      prompt: 'When you finish writing a working program, what makes you feel the proudest?',
      options: [
        { key: 'A', text: 'Seeing it learn from examples and get smarter on its own.', interest_weights: { ai: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'B', text: 'Turning a messy pile of records into a clear chart that reveals an insight.', interest_weights: { data: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'C', text: 'Seeing friends actually click through and enjoy using what I designed.', interest_weights: { web: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'D', text: 'Finding and fixing a sneaky bug or loophole before anyone else spotted it.', interest_weights: { security: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'E', text: 'Automating it so it runs reliably 24/7 without anyone having to touch it.', interest_weights: { cloud: 1.0, systems: 0.3 }, enjoyment_weight: 0.9 }
      ]
    },
    {
      id: 'sw_pre_004',
      category: 'Hands-On Preference',
      tier: 'cse_scenario_original',
      prompt: 'If you had to spend a month learning one practical skill for an internship, which sounds most exciting?',
      options: [
        { key: 'A', text: 'Training a model to recognize images, voice, or text.', interest_weights: { ai: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'B', text: 'Using Python and SQL to clean real-world datasets and forecast trends.', interest_weights: { data: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'C', text: 'Building a complete website or mobile app with React and APIs.', interest_weights: { web: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'D', text: 'Testing websites for security weaknesses and learning how to defend them.', interest_weights: { security: 1.0 }, enjoyment_weight: 0.9 },
        { key: 'E', text: 'Deploying apps on cloud servers and automating updates with Docker/Linux.', interest_weights: { cloud: 1.0, systems: 0.3 }, enjoyment_weight: 0.9 }
      ]
    },
    {
      id: 'sw_pre_005',
      category: 'Applied Thinking',
      tier: 'cse_scenario_original',
      prompt: 'A local hospital wants to improve how patients book appointments and check test reports. Which task would you pick?',
      options: [
        { key: 'A', text: 'Build a smart symptom-checker that helps direct patients to the right doctor.', interest_weights: { ai: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Analyze appointment history to predict busy hours and reduce waiting times.', interest_weights: { data: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'C', text: 'Design a simple, stress-free booking page that even elderly patients can use easily.', interest_weights: { web: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'D', text: 'Lock down patient medical files so private health records can never leak.', interest_weights: { security: 1.0 }, enjoyment_weight: 0.85 },
        { key: 'E', text: 'Make sure the hospital system stays online 24/7 with automatic backups.', interest_weights: { cloud: 1.0 }, enjoyment_weight: 0.85 }
      ]
    },
    // Approachable, plain-English conceptual checks (no trick riddles or obscure jargon)
    {
      id: 'sw_check_001',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'You are looking for a friend’s name in an alphabetically sorted list of 16 names. If you check the middle name each time and cut the list in half, at most how many checks do you need?',
      options: [
        { key: 'A', text: 'About 4 checks (16 → 8 → 4 → 2 → 1).', interest_weights: { ai: 0.2, data: 0.2 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.8 },
        { key: 'B', text: 'Always 16 checks, one by one from the top.', interest_weights: { web: 0.1 }, is_correct: false, knowledge_score: 0.2, enjoyment_weight: 0.6 },
        { key: 'C', text: '8 checks because half of 16 is 8.', interest_weights: { data: 0.1 }, is_correct: false, knowledge_score: 0.3, enjoyment_weight: 0.6 },
        { key: 'D', text: 'I haven’t learned searching methods yet, and that’s totally fine.', interest_weights: { web: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    },
    {
      id: 'sw_check_002',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'Your website’s login page suddenly gets 500 wrong password attempts per minute from the same computer. What is the simplest first protection?',
      options: [
        { key: 'A', text: 'Limit how many failed tries are allowed per minute and temporarily block that source.', interest_weights: { security: 0.5, cloud: 0.2 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Change the button color on the login page.', interest_weights: { web: 0.1 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.5 },
        { key: 'C', text: 'Delete all user accounts so nobody can log in.', interest_weights: { systems: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'D', text: 'I haven’t explored login security yet.', interest_weights: { security: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    },
    {
      id: 'sw_check_003',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'You have a table of 10,000 student marks, and some rows accidentally have blank cells or "-999". What should you do BEFORE calculating the class average?',
      options: [
        { key: 'A', text: 'Clean or filter out the missing and invalid "-999" values first so the average isn’t ruined.', interest_weights: { data: 0.5, ai: 0.3 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Average everything as-is; "-999" won’t affect the result much.', interest_weights: { data: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'C', text: 'Replace all blank cells with 100.', interest_weights: { web: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'D', text: 'I haven’t worked with data cleaning yet.', interest_weights: { data: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    },
    {
      id: 'sw_check_004',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'When a user clicks "Save" on a form and the page freezes for 3 seconds while waiting for the server, what usually improves the experience?',
      options: [
        { key: 'A', text: 'Show a clear loading spinner/message and handle the save in the background so the screen stays responsive.', interest_weights: { web: 0.5, cloud: 0.2 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Hide the Save button permanently after the page loads.', interest_weights: { web: 0.1 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.5 },
        { key: 'C', text: 'Ask the user to refresh the browser every time they save.', interest_weights: { systems: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'D', text: 'I haven’t built web forms yet.', interest_weights: { web: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    },
    {
      id: 'sw_check_005',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'If you train a spam-detector only on emails from 2015, why might it struggle on today’s emails?',
      options: [
        { key: 'A', text: 'Because scam styles and words change over time, so old examples don’t match new patterns.', interest_weights: { ai: 0.5, data: 0.3 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.85 },
        { key: 'B', text: 'Because computers forget everything after 5 years.', interest_weights: { ai: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'C', text: 'Because emails in 2015 were shorter.', interest_weights: { data: 0.1 }, is_correct: false, knowledge_score: 0.2, enjoyment_weight: 0.5 },
        { key: 'D', text: 'I haven’t learned how AI models are trained yet.', interest_weights: { ai: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    },
    {
      id: 'sw_check_006',
      category: 'Logic & Concepts',
      tier: 'logic_bebras',
      prompt: 'Why do big apps keep copies of their data in more than one server location?',
      options: [
        { key: 'A', text: 'So if one server goes down, another takes over and users don’t lose access.', interest_weights: { cloud: 0.5, systems: 0.3 }, is_correct: true, knowledge_score: 1.0, enjoyment_weight: 0.85 },
        { key: 'B', text: 'To make the app’s font look sharper.', interest_weights: { web: 0.1 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.5 },
        { key: 'C', text: 'Because a single server can only hold one user at a time.', interest_weights: { cloud: 0.1 }, is_correct: false, knowledge_score: 0.1, enjoyment_weight: 0.5 },
        { key: 'D', text: 'I haven’t learned about servers and cloud hosting yet.', interest_weights: { cloud: 0.2 }, is_correct: false, knowledge_score: 0, enjoyment_weight: 0.7 }
      ]
    }
  ].map(item => ({
    ...item,
    track: 'software',
    target_routes: ['experienced'],
    plain_english_helper: 'Pick the option that makes the most sense to you.',
    provenance: {
      source: 'CSE PathFinder Plain-English Question Bank',
      license: 'CC-BY-4.0',
      is_modified: false
    }
  }));

  // Combine clear applied scenarios, conceptual checks, and intuitive core questions
  return [...prerequisiteFriendlyScenarios, ...baseItems.slice(0, 20)];
}

function buildHardwareQuestionPool() {
  const hwQuestions = (QUIZ_DATA.hardware && QUIZ_DATA.hardware.questions) || [];
  const clusterMapping = {
    A: { domain: 'iot', meaning: 'IoT & Embedded Systems: Programming microcontrollers, sensors, and physical edge hardware.' },
    B: { domain: 'robotics', meaning: 'Robotics & Automation: Designing autonomous robots, motor controls, and mechatronics.' },
    C: { domain: 'vlsi', meaning: 'VLSI & Chip Architecture: Designing microprocessors, logic gates, and silicon chips.' },
    D: { domain: 'networking', meaning: 'Computer Networks: Routing global data, packet protocols, and wireless communications.' }
  };

  return hwQuestions.map((q, idx) => {
    const isTech = q.category === 'Technical';
    const qId = `hw_item_${String(idx + 1).padStart(3, '0')}`;
    
    const options = Object.entries(q.options || {}).map(([key, text]) => {
      const mapping = clusterMapping[key] || { domain: 'iot', meaning: 'Physical Computing & Electronics' };
      return {
        key,
        text,
        career_meaning: mapping.meaning,
        interest_weights: { [mapping.domain]: 1.0 },
        enjoyment_weight: 0.85,
        is_correct: isTech ? (key === 'A' || key === 'B') : true,
        knowledge_score: isTech ? 1.0 : 0
      };
    });

    return {
      id: qId,
      track: 'hardware',
      category: q.category || 'Hardware Exploration',
      tier: isTech ? 'hardware_technical' : 'hardware_interest',
      target_routes: isTech ? ['experienced'] : ['beginner', 'experienced'],
      prompt: q.q,
      plain_english_helper: 'This question observes whether you lean toward chips, robotics, embedded devices, or telecommunication networks.',
      provenance: {
        source: 'PathFinder ACM/IEEE Hardware Curriculum Item Bank',
        license: 'CC-BY-4.0',
        is_modified: false
      },
      options
    };
  });
}

function normalizeItemForUI(item) {
  return {
    id: item.id,
    q: item.prompt,
    category: item.category || 'Domain Discovery',
    tier: item.tier,
    plainEnglishHelper: item.plain_english_helper,
    provenance: item.provenance,
    options: item.options.map(opt => ({
      key: opt.key,
      text: opt.text,
      careerMeaning: opt.career_meaning,
      interestWeights: opt.interest_weights || {},
      enjoymentWeight: opt.enjoyment_weight || 0.7,
      isCorrect: opt.is_correct,
      knowledgeScore: opt.knowledge_score
    }))
  };
}

// =========================================================================
// ORCHESTRATION FUNCTIONS (Exposed to QuizRunner and existing tests)
// =========================================================================

export function initAgentSession(arg1 = 'software', arg2 = 25, arg3 = null) {
  let track = 'software';
  let prerequisiteMode = 'zero';
  let declaredPrerequisites = [];
  let customKnowledge = '';
  let totalTarget = 25;
  let declaredInterest = null;
  let semester = '1-2';
  let domainFactors = {};

  if (typeof arg1 === 'object' && arg1 !== null) {
    track = arg1.track || 'software';
    prerequisiteMode = arg1.prerequisiteMode || (arg1.routeType === 'experienced' ? 'prerequisites' : 'zero');
    declaredPrerequisites = arg1.declaredPrerequisites || [];
    customKnowledge = arg1.customKnowledge || '';
    totalTarget = arg1.totalTarget || 25;
    declaredInterest = arg1.declaredInterest || null;
    semester = arg1.semester || '1-2';
    domainFactors = arg1.domainFactors || {};
  } else {
    // Legacy positional arguments
    if (arg1 === 'experienced') {
      prerequisiteMode = 'prerequisites';
      track = 'software';
    } else if (arg1 === 'hardware') {
      track = 'hardware';
      prerequisiteMode = 'zero';
    } else if (arg1 === 'software') {
      track = 'software';
      prerequisiteMode = 'zero';
    } else {
      prerequisiteMode = 'zero';
      track = 'software';
    }
    totalTarget = arg2 || 25;
    declaredInterest = arg3 || null;
  }

  // 1. Prerequisite Analyzer Component Invocation
  const strategyAnalysis = PrerequisiteAnalyzer.analyze({
    track,
    prerequisiteMode,
    declaredPrerequisites,
    customKnowledge
  });

  // 2. Build Track-Specific Question Pool (Plain-English, Beginner & Prerequisite Friendly)
  const bankItems = adaptiveBank.items || [];
  let trackItems = [];

  if (track === 'hardware') {
    trackItems = buildHardwareQuestionPool();
  } else {
    trackItems = buildFriendlySoftwarePool(prerequisiteMode);
  }

  if (trackItems.length === 0) {
    trackItems = bankItems;
  }

  // 3. Initial Question Selection
  let initialItem = trackItems[0];

  const trackDomains = track === 'hardware'
    ? ['iot', 'robotics', 'vlsi', 'networking']
    : ['ai', 'data', 'web', 'security', 'cloud', 'systems'];

  const initInterest = {};
  const initEnjoyment = {};
  trackDomains.forEach(d => {
    initInterest[d] = 0;
    initEnjoyment[d] = 0;
  });

  // Gentle initial alignment from non-CSE-core factors (math comfort, work style, career goal)
  if (domainFactors.mathComfort === 'love_math') {
    if (initInterest.ai !== undefined) initInterest.ai += 0.8;
    if (initInterest.data !== undefined) initInterest.data += 0.8;
    if (initInterest.vlsi !== undefined) initInterest.vlsi += 0.8;
  } else if (domainFactors.mathComfort === 'prefer_visual') {
    if (initInterest.web !== undefined) initInterest.web += 0.9;
    if (initInterest.iot !== undefined) initInterest.iot += 0.6;
  }

  if (domainFactors.workStyle === 'visual_user') {
    if (initInterest.web !== undefined) initInterest.web += 0.8;
    if (initInterest.robotics !== undefined) initInterest.robotics += 0.7;
    if (initInterest.iot !== undefined) initInterest.iot += 0.5;
  } else if (domainFactors.workStyle === 'behind_scenes') {
    if (initInterest.cloud !== undefined) initInterest.cloud += 0.7;
    if (initInterest.security !== undefined) initInterest.security += 0.7;
    if (initInterest.data !== undefined) initInterest.data += 0.6;
    if (initInterest.networking !== undefined) initInterest.networking += 0.7;
  }

  if (domainFactors.careerGoal === 'research_ai') {
    if (initInterest.ai !== undefined) initInterest.ai += 0.9;
    if (initInterest.vlsi !== undefined) initInterest.vlsi += 0.6;
  } else if (domainFactors.careerGoal === 'build_products') {
    if (initInterest.web !== undefined) initInterest.web += 0.8;
    if (initInterest.iot !== undefined) initInterest.iot += 0.7;
  } else if (domainFactors.careerGoal === 'systems_defense') {
    if (initInterest.security !== undefined) initInterest.security += 0.8;
    if (initInterest.cloud !== undefined) initInterest.cloud += 0.7;
    if (initInterest.networking !== undefined) initInterest.networking += 0.7;
  }

  return {
    track,
    routeType: prerequisiteMode === 'zero' ? 'beginner' : 'experienced',
    prerequisiteMode,
    semester,
    domainFactors,
    declaredPrerequisites,
    strategyAnalysis,
    totalTarget: Math.min(totalTarget, trackItems.length),
    currentStep: 1,
    declaredInterest,
    askedItemIds: [initialItem.id],
    skippedItemIds: [],
    reservedItemIds: [],
    everSkippedIds: [],
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    currentLadderLevel: prerequisiteMode === 'zero' ? 1 : 2,
    ladderEvents: [],
    eligibleItemIds: trackItems.map(i => i.id),
    allItemsMap: new Map(trackItems.map(i => [i.id, i])),

    // Decoupled Evidence State
    interestScores: initInterest,
    enjoymentScores: initEnjoyment,
    knowledgeScores: {
      totalAnswered: 0,
      correct: 0,
      knowledgePoints: 0,
      domainDemonstrated: {},
      domainAttempts: {}
    },
    prerequisiteGaps: [],

    history: [],
    currentQuestion: normalizeItemForUI(initialItem),
    agentReasoning: `Prerequisite Analyzer: [${strategyAnalysis.strategyName}] Calibrating questions for ${track.toUpperCase()} engineering trajectory.`,
    activeComponent: 'Adaptive Quiz Generator',
    emergingLeader: declaredInterest || (track === 'hardware' ? 'iot' : 'ai'),
    isComplete: false
  };
}

export function agentNextQuestion({
  currentSession,
  selectedOptionKey,
  isSkipped = false,
  isDontKnow = false
}) {
  const itemMap = currentSession.allItemsMap;
  const currentQ = currentSession.currentQuestion;
  const currentId = currentQ.id;
  const wasReServed = Boolean(currentQ.reServed);
  const currentItem = itemMap ? itemMap.get(currentId) : null;
  const selectedOpt = currentItem ? currentItem.options.find(o => o.key === selectedOptionKey) : null;

  const skipped = Boolean(
    isSkipped ||
    selectedOptionKey === 'SKIP' ||
    selectedOptionKey === 'skipped'
  );
  const dontKnow = !skipped && Boolean(
    isDontKnow ||
    selectedOptionKey === 'IDK' ||
    (selectedOpt && /haven.t learned|haven.t explored|haven.t worked|haven.t built|don.t know/i.test(selectedOpt.text))
  );

  let interestScores = { ...currentSession.interestScores };
  let enjoymentScores = { ...currentSession.enjoymentScores };
  let primaryDomain = null;
  let knowledgeScores = currentSession.knowledgeScores;
  let prerequisiteGaps = [...(currentSession.prerequisiteGaps || [])];
  let isCorrect = null;
  let consecutiveCorrect = currentSession.consecutiveCorrect || 0;
  let consecutiveWrong = currentSession.consecutiveWrong || 0;
  let currentLadderLevel = typeof currentSession.currentLadderLevel === 'number' ? currentSession.currentLadderLevel : 1;
  const ladderEvents = [...(currentSession.ladderEvents || [])];

  const reservedSet = new Set(currentSession.reservedItemIds || []);
  const everSkippedSet = new Set(currentSession.everSkippedIds || []);
  let updatedSkippedItemIds = [...(currentSession.skippedItemIds || [])];

  if (skipped) {
    // Skip is NOT IDK and counts as neither correct nor incorrect; streaks stay unchanged
    if (!everSkippedSet.has(currentId) && !reservedSet.has(currentId) && !wasReServed) {
      updatedSkippedItemIds.push(currentId);
      everSkippedSet.add(currentId);
    } else {
      updatedSkippedItemIds = updatedSkippedItemIds.filter(id => id !== currentId);
      reservedSet.add(currentId);
    }
    ladderEvents.push(
      `Step ${currentSession.currentStep} (${currentId}): Question skipped — counted as neither correct nor incorrect; streak unchanged.`
    );
  } else {
    // Item was resolved (answered or IDK): ensure it is never re-served again
    if (updatedSkippedItemIds.includes(currentId) || everSkippedSet.has(currentId) || wasReServed) {
      updatedSkippedItemIds = updatedSkippedItemIds.filter(id => id !== currentId);
      reservedSet.add(currentId);
    }

    if (dontKnow && !selectedOpt) {
      // Dedicated "I don't know" button on any item
      isCorrect = false;
      const isVerif = currentItem && (
        currentItem.tier === 'logic_bebras' ||
        currentItem.tier === 'guided_micro_codeorg' ||
        currentItem.tier === 'hardware_technical'
      );
      if (isVerif) {
        knowledgeScores = {
          ...currentSession.knowledgeScores,
          totalAnswered: (currentSession.knowledgeScores.totalAnswered || 0) + 1
        };
        prerequisiteGaps.push({
          itemId: currentId,
          category: currentItem.category,
          prompt: currentItem.prompt,
          domain: 'foundations',
          recommendedPrerequisite: 'Foundational Logic & Systems Concepts'
        });
      }
      consecutiveWrong += 1;
      consecutiveCorrect = 0;
      if (consecutiveWrong >= 2) {
        currentLadderLevel = Math.max(0, currentLadderLevel - 1);
        consecutiveWrong = 0;
        ladderEvents.push(`Step ${currentSession.currentStep} (${currentId}): Two consecutive incorrect/IDK responses triggered demotion to Level ${currentLadderLevel}.`);
      }
    } else {
      // 1. Interest Analyzer Component: Update domain preferences
      const interestRes = InterestAnalyzer.updateInterest({
        currentInterestScores: currentSession.interestScores,
        currentEnjoymentScores: currentSession.enjoymentScores,
        selectedOption: selectedOpt
      });
      interestScores = interestRes.interestScores;
      enjoymentScores = interestRes.enjoymentScores;
      primaryDomain = interestRes.primaryDomain;

      // 2. Answer Evaluator Component: Evaluate correctness and conceptual depth
      const evalRes = AnswerEvaluator.evaluate({
        currentItem,
        selectedOption: selectedOpt,
        currentKnowledgeScores: currentSession.knowledgeScores,
        currentPrerequisiteGaps: currentSession.prerequisiteGaps,
        primaryDomain
      });
      knowledgeScores = evalRes.knowledgeScores;
      prerequisiteGaps = evalRes.prerequisiteGaps;
      isCorrect = evalRes.isCorrect;

      if (evalRes.isVerificationItem) {
        if (isCorrect) {
          consecutiveCorrect += 1;
          consecutiveWrong = 0;
          if (consecutiveCorrect >= 2) {
            currentLadderLevel = Math.min(4, currentLadderLevel + 1);
            consecutiveCorrect = 0;
            ladderEvents.push(`Step ${currentSession.currentStep} (${currentId}): Two consecutive correct answers triggered promotion to Level ${currentLadderLevel}.`);
          }
        } else {
          consecutiveWrong += 1;
          consecutiveCorrect = 0;
          if (consecutiveWrong >= 2) {
            currentLadderLevel = Math.max(0, currentLadderLevel - 1);
            consecutiveWrong = 0;
            ladderEvents.push(`Step ${currentSession.currentStep} (${currentId}): Two consecutive wrong answers triggered demotion to Level ${currentLadderLevel}.`);
          }
        }
      }
    }
  }

  // Rank current interest
  const sortedDomains = Object.entries(interestScores)
    .sort((a, b) => b[1] - a[1])
    .map(([domId, score]) => ({ domId, score }));

  const leader = sortedDomains[0];
  const runnerUp = sortedDomains[1];

  const isVerifTier = currentItem && (
    currentItem.tier === 'logic_bebras' ||
    currentItem.tier === 'guided_micro_codeorg' ||
    currentItem.tier === 'hardware_technical'
  );
  const status = skipped
    ? 'skipped'
    : dontKnow
      ? 'dont_know'
      : isVerifTier
        ? (isCorrect ? 'correct' : 'incorrect')
        : 'answered';

  // Update session history
  const updatedHistory = [
    ...currentSession.history,
    {
      step: currentSession.currentStep,
      itemId: currentId,
      prompt: currentQ.q,
      tier: currentItem?.tier,
      selectedKey: skipped ? 'SKIP' : dontKnow && !selectedOpt ? 'IDK' : selectedOptionKey,
      selectedText: skipped ? 'Skipped question' : dontKnow && !selectedOpt ? "I don't know" : selectedOpt?.text,
      careerMeaning: selectedOpt?.career_meaning || null,
      primaryDomain,
      isCorrect: skipped ? null : isCorrect,
      isSkipped: skipped,
      isDontKnow: dontKnow,
      status,
      reServed: wasReServed
    }
  ];

  const nextStepNum = currentSession.currentStep + 1;
  const askedSet = new Set(currentSession.askedItemIds);
  const pendingSkips = updatedSkippedItemIds.filter(id => !reservedSet.has(id));
  const candidates = currentSession.eligibleItemIds
    .filter(id => !askedSet.has(id))
    .map(id => itemMap.get(id))
    .filter(Boolean);

  // Check completion (strictly honors totalTarget / 25-item cap)
  if (nextStepNum > currentSession.totalTarget || (candidates.length === 0 && pendingSkips.length === 0)) {
    return {
      ...currentSession,
      currentStep: nextStepNum,
      skippedItemIds: updatedSkippedItemIds,
      reservedItemIds: [...reservedSet],
      everSkippedIds: [...everSkippedSet],
      consecutiveCorrect,
      consecutiveWrong,
      currentLadderLevel,
      ladderEvents,
      interestScores,
      enjoymentScores,
      knowledgeScores,
      prerequisiteGaps,
      history: updatedHistory,
      emergingLeader: leader ? leader.domId : (currentSession.track === 'hardware' ? 'iot' : 'ai'),
      isComplete: true,
      activeComponent: 'Diagnostic Agent',
      agentReasoning: `Diagnostic Agent: Multi-vector assessment complete! Generating dual interest and knowledge scores...`
    };
  }

  // 3. Re-serve a skipped item once near the end, otherwise select next unasked candidate
  const remainingSteps = currentSession.totalTarget - nextStepNum + 1;
  const shouldReServe = pendingSkips.length > 0 && (remainingSteps <= pendingSkips.length || candidates.length === 0);

  if (shouldReServe) {
    const reServeId = pendingSkips[0];
    const reServeItem = itemMap.get(reServeId);
    if (reServeItem) {
      updatedSkippedItemIds = updatedSkippedItemIds.filter(id => id !== reServeId);
      reservedSet.add(reServeId);
      return {
        ...currentSession,
        currentStep: nextStepNum,
        skippedItemIds: updatedSkippedItemIds,
        reservedItemIds: [...reservedSet],
        everSkippedIds: [...everSkippedSet],
        consecutiveCorrect,
        consecutiveWrong,
        currentLadderLevel,
        ladderEvents,
        interestScores,
        enjoymentScores,
        knowledgeScores,
        prerequisiteGaps,
        history: updatedHistory,
        currentQuestion: {
          ...normalizeItemForUI(reServeItem),
          reServed: true
        },
        activeComponent: 'Adaptive Quiz Generator',
        agentReasoning: 'Adaptive Quiz Generator: Re-serving a previously skipped question once before completing your assessment.',
        emergingLeader: leader ? leader.domId : (currentSession.track === 'hardware' ? 'iot' : 'ai'),
        isComplete: false
      };
    }
  }

  const { chosenItem, agentReasoning } = AdaptiveQuizGenerator.selectNextQuestion({
    currentSession: { ...currentSession, interestScores },
    candidates,
    leader,
    runnerUp,
    nextStepNum
  });

  return {
    ...currentSession,
    currentStep: nextStepNum,
    askedItemIds: [...currentSession.askedItemIds, chosenItem.id],
    skippedItemIds: updatedSkippedItemIds,
    reservedItemIds: [...reservedSet],
    everSkippedIds: [...everSkippedSet],
    consecutiveCorrect,
    consecutiveWrong,
    currentLadderLevel,
    ladderEvents,
    interestScores,
    enjoymentScores,
    knowledgeScores,
    prerequisiteGaps,
    history: updatedHistory,
    currentQuestion: normalizeItemForUI(chosenItem),
    activeComponent: 'Adaptive Quiz Generator',
    agentReasoning,
    emergingLeader: leader ? leader.domId : (currentSession.track === 'hardware' ? 'iot' : 'ai'),
    isComplete: false
  };
}

export function computeFinalResults(session) {
  // 5. Diagnostic Agent Component: Synthesizes final results with dual scores
  return DiagnosticAgent.synthesize({ session });
}
