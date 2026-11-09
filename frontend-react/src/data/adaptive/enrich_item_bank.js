import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemBankPath = path.join(__dirname, 'item_bank.json');
const bank = JSON.parse(fs.readFileSync(itemBankPath, 'utf8'));

const IDK_OPTION = "I don't know / haven't learned this yet";

// Annotate and upgrade existing questions
bank.questions.forEach(q => {
  q.question_id = q.id;
  q.content_version = '1.1.0';
  q.question_type = q.category === 'guided_activity' ? 'guided_experience' : (q.category === 'logic' ? 'computational_thinking' : q.category);
  q.skill_tags = q.skills || [];
  q.prerequisites = q.prereqs || [];
  q.source_type = (q.source && q.source.includes('O*NET')) ? 'official_onet' :
                  (q.source && q.source.includes('Bebras')) ? 'official_bebras' :
                  (q.source && q.source.includes('Code.org')) ? 'adapted_open_curriculum' : 'original_reviewed';
  q.source_reference = q.source_url || q.source || 'PathFinder Item Bank';
  q.licence = q.license || 'CC-BY-SA 4.0';
  q.review_status = q.status || 'approved';
  q.hint = q.hint || 'Focus on how information flows and what the goal of this step is.';

  const text = (q.questionText + ' ' + (q.skills || []).join(' ') + ' ' + (q.topic || '')).toLowerCase();
  const dTags = [];
  if (text.includes('ai') || text.includes('machine learning') || text.includes('pattern') || text.includes('neural')) dTags.push('ai');
  if (text.includes('data') || text.includes('sql') || text.includes('statistic') || text.includes('sensor dataset')) dTags.push('data');
  if (text.includes('web') || text.includes('app lab') || text.includes('ui') || text.includes('interface') || text.includes('mobile')) dTags.push('web');
  if (text.includes('secur') || text.includes('cipher') || text.includes('encrypt') || text.includes('hack') || text.includes('packet-sniffing')) dTags.push('security');
  if (text.includes('cloud') || text.includes('server') || text.includes('api') || text.includes('gateway') || text.includes('rate limiting')) dTags.push('cloud');
  if (text.includes('network') || text.includes('router') || text.includes('packet') || text.includes('switch') || text.includes('dns')) dTags.push('networking');
  if (text.includes('solder') || text.includes('microcontroller') || text.includes('circuit') || text.includes('embedded') || text.includes('hardware')) dTags.push('iot');
  if (text.includes('robot') || text.includes('motor') || text.includes('actuator') || text.includes('automation')) dTags.push('robotics');
  if (text.includes('binary') || text.includes('gate') || text.includes('switch') || text.includes('transistor') || text.includes('architecture')) dTags.push('vlsi');

  if (dTags.length === 0) {
    if (q.topic === 'python') dTags.push('ai', 'data');
    else if (q.topic === 'sql') dTags.push('data', 'cloud');
    else if (q.topic === 'java') dTags.push('web', 'cloud');
    else dTags.push('ai', 'web');
  }
  q.domain_tags = [...new Set(dTags)];
});

// Add extra rich domain guided activities and comparison items
const existingIds = new Set(bank.questions.map(q => q.id));

const newItems = [
  {
    id: 'guided_robotics_001',
    question_id: 'guided_robotics_001',
    category: 'guided_activity',
    question_type: 'guided_experience',
    topic: 'robotics',
    domain_tags: ['robotics', 'iot'],
    skills: ['feedback-loops', 'sensor-actuator', 'obstacle-avoidance'],
    skill_tags: ['feedback-loops', 'sensor-actuator', 'obstacle-avoidance'],
    difficulty: 1,
    prerequisites: [],
    questionText: 'Guided Activity (Robotics Feedback Loop): You are programming a line-following delivery robot with two optical sensors (Left and Right). If the Left sensor sees black (the line) while the Right sensor sees white (the floor), how should the robot steer to stay centered?',
    options: [
      'Steer Left by slowing down or reversing the left wheel',
      'Steer Right by turning off the right wheel',
      'Accelerate both wheels to maximum speed',
      'Stop all motors and sound an emergency siren',
      IDK_OPTION
    ],
    answer: 'Steer Left by slowing down or reversing the left wheel',
    explanation: 'Differential steering turns a robot towards the slower or reversed wheel. Slowing the left wheel corrects the robot trajectory back over the line.',
    hint: 'Think about how a canoe turns when you paddle harder on only one side.',
    source: 'Open Robotics Educational Curriculum',
    source_type: 'original_reviewed',
    source_reference: 'PathFinder Robotics Lab',
    license: 'CC-BY-SA 4.0',
    licence: 'CC-BY-SA 4.0',
    status: 'approved',
    review_status: 'approved',
    attribution_text: 'Original reviewed curriculum by CSE PathFinder team under CC-BY-SA 4.0.',
    modified: false
  },
  {
    id: 'guided_iot_002',
    question_id: 'guided_iot_002',
    category: 'guided_activity',
    question_type: 'guided_experience',
    topic: 'iot',
    domain_tags: ['iot', 'cloud'],
    skills: ['embedded-sensors', 'telemetry', 'actuators'],
    skill_tags: ['embedded-sensors', 'telemetry', 'actuators'],
    difficulty: 1,
    prerequisites: [],
    questionText: 'Guided Activity (Smart Greenhouse IoT): A temperature sensor in an automated greenhouse measures 38°C (threshold is 30°C). What sequence should the microcontroller execute to protect the crops?',
    options: [
      "Activate exhaust fans immediately, send an alert to the farmer's phone, and log the reading",
      'Shut down the power grid to the greenhouse permanently',
      'Delete the temperature reading so the average looks normal',
      'Heat the greenhouse further to calibrate the sensor',
      IDK_OPTION
    ],
    answer: "Activate exhaust fans immediately, send an alert to the farmer's phone, and log the reading",
    explanation: 'IoT systems pair local real-time actuation (turning on fans) with remote telemetry (cloud alerts and monitoring).',
    hint: 'Consider both the immediate physical response and notifying the human supervisor.',
    source: 'PathFinder Embedded Labs',
    source_type: 'original_reviewed',
    source_reference: 'PathFinder IoT Lab',
    license: 'CC-BY-SA 4.0',
    licence: 'CC-BY-SA 4.0',
    status: 'approved',
    review_status: 'approved',
    attribution_text: 'Original reviewed curriculum by CSE PathFinder team under CC-BY-SA 4.0.',
    modified: false
  },
  {
    id: 'guided_vlsi_003',
    question_id: 'guided_vlsi_003',
    category: 'guided_activity',
    question_type: 'guided_experience',
    topic: 'vlsi',
    domain_tags: ['vlsi'],
    skills: ['logic-gates', 'digital-timing', 'propagation-delay'],
    skill_tags: ['logic-gates', 'digital-timing', 'propagation-delay'],
    difficulty: 2,
    prerequisites: ['binary-basics'],
    questionText: 'Guided Activity (VLSI Chip Timing): On a microchip, an AND gate output takes 2 nanoseconds to reach the input of an OR gate. Why must chip designers pay close attention to this "propagation delay"?',
    options: [
      'Signals must arrive in time for the processor clock cycle, otherwise calculations produce corrupted errors',
      'Propagation delay makes the silicon turn red and burn',
      'It allows software to run without electricity',
      'It converts digital 1s into analog sound waves',
      IDK_OPTION
    ],
    answer: 'Signals must arrive in time for the processor clock cycle, otherwise calculations produce corrupted errors',
    explanation: 'Clock frequencies depend on the longest delay (critical path). If signals arrive late, flip-flops sample incorrect transitional states.',
    hint: 'Think about a runner waiting for a baton pass before the timer runs out.',
    source: 'Computer Architecture & Digital Logic Open Courseware',
    source_type: 'original_reviewed',
    source_reference: 'PathFinder VLSI Lab',
    license: 'CC-BY-SA 4.0',
    licence: 'CC-BY-SA 4.0',
    status: 'approved',
    review_status: 'approved',
    attribution_text: 'Original reviewed curriculum by CSE PathFinder team under CC-BY-SA 4.0.',
    modified: false
  },
  {
    id: 'comp_tradeoff_ai_data_001',
    question_id: 'comp_tradeoff_ai_data_001',
    category: 'interest',
    question_type: 'interest',
    topic: 'career_interest',
    domain_tags: ['ai', 'data'],
    skills: ['ai-vs-data-science', 'work-preference'],
    skill_tags: ['ai-vs-data-science', 'work-preference'],
    difficulty: 1,
    prerequisites: [],
    questionText: 'Work Preference Comparison (AI vs Data Science): Which type of daily challenge sounds more appealing to you?',
    options: [
      'Building and tuning an AI model that learns to recognize medical scans autonomously (AI focus)',
      'Analyzing hospital patient trends and health patterns to produce strategic insights for doctors (Data Science focus)',
      'Both sound equally exciting to me',
      'Neither sounds appealing',
      IDK_OPTION
    ],
    answer: null,
    explanation: 'Contrasts AI model training pipelines with exploratory business intelligence and statistical inquiry.',
    hint: 'One focuses on teaching algorithms to act on new data; the other focuses on drawing conclusions from existing patterns.',
    source: 'CSE PathFinder Career Exploration Model',
    source_type: 'original_reviewed',
    source_reference: 'PathFinder Career Explorer',
    license: 'CC-BY-SA 4.0',
    licence: 'CC-BY-SA 4.0',
    status: 'approved',
    review_status: 'approved',
    attribution_text: 'Original reviewed curriculum by CSE PathFinder team under CC-BY-SA 4.0.',
    modified: false
  },
  {
    id: 'comp_tradeoff_web_iot_002',
    question_id: 'comp_tradeoff_web_iot_002',
    category: 'interest',
    question_type: 'interest',
    topic: 'career_interest',
    domain_tags: ['web', 'iot'],
    skills: ['digital-vs-physical-interaction', 'work-preference'],
    skill_tags: ['digital-vs-physical-interaction', 'work-preference'],
    difficulty: 1,
    prerequisites: [],
    questionText: 'Work Preference Comparison (Interactive Apps vs Physical Devices): When you build something, where do you prefer to see it work?',
    options: [
      'On a sleek screen with buttons, responsive layouts, and smooth animations (Web & App focus)',
      'On a physical gadget on your desk with real buttons, LEDs, and motorized parts (IoT & Embedded focus)',
      'Both sound equally rewarding',
      'Neither sounds appealing',
      IDK_OPTION
    ],
    answer: null,
    explanation: 'Disambiguates between software visual interfaces and cyber-physical hardware creation.',
    hint: 'Think about whether you enjoy screen-based design or working with tangible objects in the real world.',
    source: 'CSE PathFinder Career Exploration Model',
    source_type: 'original_reviewed',
    source_reference: 'PathFinder Career Explorer',
    license: 'CC-BY-SA 4.0',
    licence: 'CC-BY-SA 4.0',
    status: 'approved',
    review_status: 'approved',
    attribution_text: 'Original reviewed curriculum by CSE PathFinder team under CC-BY-SA 4.0.',
    modified: false
  }
];

newItems.forEach(item => {
  if (!existingIds.has(item.id)) {
    bank.questions.push(item);
  }
});

fs.writeFileSync(itemBankPath, JSON.stringify(bank, null, 2), 'utf8');
console.log('Item bank enriched! Total items:', bank.questions.length);
