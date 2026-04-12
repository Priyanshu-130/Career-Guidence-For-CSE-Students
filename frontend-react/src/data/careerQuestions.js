export const CAREER_QUESTIONS = [
  // --- ORIENTATION (Mindset & Approach) ---
  {
    category: 'Orientation',
    text: 'When you want to solve a tough task, which approach feels most natural to you?',
    options: [
      { title: 'The "Thinker"', desc: 'Find a smart way or a tool that learns to do it automatically.', scores: { ai: 3, data: 2 } },
      { title: 'The "Builder"', desc: 'Jump in and create a beautiful or fun solution that people love.', scores: { web: 3, robotics: 1 } },
      { title: 'The "Protector"', desc: 'Check for flaws and make sure everything is safe and secure.', scores: { security: 3, networking: 1 } },
      { title: 'The "Organizer"', desc: 'Set up a strong, reliable system that never crashes.', scores: { cloud: 3, networking: 2 } }
    ]
  },
  {
    category: 'Orientation',
    text: 'What kind of impact would make you feel most proud of your work?',
    options: [
      { title: 'Helping People', desc: 'Designing apps or sites that millions of people enjoy every day.', scores: { web: 3, iot: 1 } },
      { title: 'Protecting Privacy', desc: 'Defending users from hackers and keeping data locked tight.', scores: { security: 4, networking: 1 } },
      { title: 'Scientific Discovery', desc: 'Pushing boundaries with AI or discovering hidden patterns in data.', scores: { ai: 3, data: 3 } },
      { title: 'Speed & Scale', desc: 'Building the invisible backbone that powers the whole internet.', scores: { cloud: 3, networking: 3 } }
    ]
  },
  {
    category: 'Orientation',
    text: 'When you get a new gadget or app, what is the first thing you wonder about?',
    options: [
      { title: 'How it thinks', desc: 'Is it smart enough to guess what I want?', scores: { ai: 3, data: 1 } },
      { title: 'How it looks', desc: 'Why did they choose those colors and animations?', scores: { web: 4 } },
      { title: 'How it connects', desc: 'How does it talk to other devices without wires?', scores: { iot: 3, networking: 2 } },
      { title: 'How it stays safe', desc: 'How easy would it be for someone to hack into this?', scores: { security: 4 } }
    ]
  },

  // --- INTERESTS (Hobbies & Passions) ---
  {
    category: 'Interests',
    text: 'Which of these weekend projects sounds like the most fun to you?',
    options: [
      { title: 'Build a Smart Assitant', desc: 'Teach a computer to understand your voice commands.', scores: { ai: 4, iot: 1 } },
      { title: 'Design a Personal Site', desc: 'Create a cool portfolio with smooth scrolling and dark mode.', scores: { web: 4 } },
      { title: 'Fix a Broken Wi-Fi', desc: 'Troubleshoot your home network and make it super fast.', scores: { networking: 3, cloud: 2 } },
      { title: 'Assemble a Robot', desc: 'Build a small machine that moves and reacts to its surroundings.', scores: { robotics: 4, iot: 1 } }
    ]
  },
  {
    category: 'Interests',
    text: 'If a genie could grant you one master skill instantly, you would choose:',
    options: [
      { title: 'The Visionary', desc: 'Mastering AI to build robots that think for themselves.', scores: { ai: 4, robotics: 2 } },
      { title: 'The Artist', desc: 'Designing the most beautiful and popular apps in the world.', scores: { web: 4 } },
      { title: 'The Spy', desc: 'Being an uncatchable digital security expert and ethical hacker.', scores: { security: 4, networking: 2 } },
      { title: 'The Architect', desc: 'Building a global computer network that never goes offline.', scores: { cloud: 4, networking: 3 } }
    ]
  },
  {
    category: 'Interests',
    text: 'What is your favorite type of news to read about in technology?',
    options: [
      { title: 'Intelligent Machines', desc: 'New breakthroughs in AI and smart robots.', scores: { ai: 3, robotics: 2 } },
      { title: 'Digital Freedom', desc: 'Privacy, encryption, and safe communication.', scores: { security: 3, networking: 2 } },
      { title: 'Stunning Designs', desc: 'Virtual reality, games, and amazing user interfaces.', scores: { web: 4 } },
      { title: 'Big Data', desc: 'How companies use statistics to predict the future.', scores: { data: 4, ai: 1 } }
    ]
  },

  // --- APTITUDE (Natural Skills) ---
  {
    category: 'Aptitude',
    text: 'Which of these tasks feels more like "play" than "work" to you?',
    options: [
      { title: 'Logical Puzzles', desc: 'Solving riddles, math problems, or finding data patterns.', scores: { data: 4, ai: 2 } },
      { title: 'Creative Design', desc: 'Arranging colors and layouts until they look perfect.', scores: { web: 4 } },
      { title: 'Technical Repairs', desc: 'Fixing a slow laptop or setting up a router.', scores: { networking: 3, cloud: 2, iot: 1 } },
      { title: 'Finding Errors', desc: 'Spotting the one mistake that everyone else missed.', scores: { security: 4, web: 1 } }
    ]
  },
  {
    category: 'Aptitude',
    text: 'When learning something new, which method works best for you?',
    options: [
      { title: 'The Flowchart', desc: 'Seeing how steps branch out like a decision tree.', scores: { ai: 3, data: 2, web: 2 } },
      { title: 'The Blueprint', desc: 'Seeing how physical parts are wired together.', scores: { iot: 3, networking: 3, robotics: 2 } },
      { title: 'The Story', desc: 'Visualizing how a user interacts with an app.', scores: { web: 4 } },
      { title: 'The Code', desc: 'Looking at logic and math formulas directly.', scores: { data: 3, ai: 2, vlsi: 3 } }
    ]
  },
  {
    category: 'Aptitude',
    text: 'Your friends usually ask for your help when they need to:',
    options: [
      { title: 'Analyze something', desc: 'Explain a confusing chart or a math problem.', scores: { data: 4, ai: 2 } },
      { title: 'Make it Pretty', desc: 'Design a social media post or a slide deck.', scores: { web: 4 } },
      { title: 'Secure it', desc: 'Check if an email is a scam or if a password is safe.', scores: { security: 4 } },
      { title: 'Fix the Internet', desc: 'Solve why the Wi-Fi is slow or disconnected.', scores: { networking: 4, cloud: 1 } }
    ]
  }
];

export const CAREER_PROFILES = {
  ai: { id: 'ai', name: 'Artificial Intelligence & ML', icon: '🤖', description: 'Brain of computers. Focuses on building intelligent systems that learn and think.' },
  web: { id: 'web', name: 'Web, App & Game Development', icon: '🌐', description: 'Face of computers. Crafting digital products and interactive user experiences.' },
  data: { id: 'data', name: 'Data Science & Analytics', icon: '📊', description: 'The Logic. Converting raw data into actionable stories and intelligence.' },
  cloud: { id: 'cloud', name: 'Cloud & Infrastructure', icon: '☁️', description: 'The Backbone. Designing scalable and reliable online systems for millions.' },
  security: { id: 'security', name: 'Cyber Security & Blockchain', icon: '🔐', description: 'The Shield. Defending networks and systems from digital threats.' },
  networking: { id: 'networking', name: 'Networking Systems', icon: '🔗', description: 'The Arteries. The architecture of global data and internet connectivity.' },
  iot: { id: 'iot', name: 'Internet of Things', icon: '📡', description: 'The Nervous System. Connecting physical objects to the digital world.' },
  robotics: { id: 'robotics', name: 'Robotics', icon: '🦾', description: 'The Body. Building autonomous physical systems that can move and act.' },
  vlsi: { id: 'vlsi', name: 'VLSI Design', icon: '🔬', description: 'The Foundation. The fundamentals of tiny chip and processor architecture.' }
};
