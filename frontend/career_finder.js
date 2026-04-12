/* ═══════════════════════════════════════════
   CAREER PATH FINDER — Application Logic
   State machine, question data, result engine.
════════════════════════════════════════════ */

'use strict';

/* ─── Question Data ─────────────────────────
   Four categories mapped to the sidebar steps.
   Each question maps to a domain score.
────────────────────────────────────────────── */
const QUESTIONS = [
  // ── PROFILE (step 0) ──────────────────────
  {
    category: 'Profile',
    stepIndex: 0,
    text: 'When you encounter a complex problem, what is your first instinct?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        title: 'Analyze patterns',
        desc: 'Break data down and find the logic beneath it',
        scores: { ai: 3, data: 3, web: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        title: 'Build a prototype',
        desc: 'Jump in and create something fast to learn',
        scores: { web: 3, iot: 2, robotics: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        title: 'Research existing solutions',
        desc: 'Understand how others solved it first',
        scores: { cloud: 3, networking: 2, security: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        title: 'Discuss with others',
        desc: 'Gather different perspectives and collaborate',
        scores: { web: 2, cloud: 1, data: 2 }
      }
    ]
  },
  {
    category: 'Profile',
    stepIndex: 0,
    text: 'Which environment do you find most energizing to work in?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        title: 'Quiet & focused',
        desc: 'Deep solo work on complex technical problems',
        scores: { ai: 2, security: 3, vlsi: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
        title: 'Structured team',
        desc: 'Clear roles, code reviews, shipping together',
        scores: { web: 3, cloud: 2, data: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        title: 'Fast-paced & iterative',
        desc: 'Ship fast, experiment, adapt quickly',
        scores: { web: 2, iot: 3, robotics: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
        title: 'Open-ended research',
        desc: 'Exploring the unknown without strict deadlines',
        scores: { ai: 3, data: 2, networking: 1 }
      }
    ]
  },
  {
    category: 'Profile',
    stepIndex: 0,
    text: 'What kind of impact motivates you most in your work?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
        title: 'Scale & infrastructure',
        desc: 'Building systems that millions rely on',
        scores: { cloud: 3, networking: 3, security: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
        title: 'User experience',
        desc: 'Designing things people actually love using',
        scores: { web: 3, iot: 1, data: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        title: 'Scientific discovery',
        desc: 'Pushing the boundaries of what machines can do',
        scores: { ai: 3, data: 3, vlsi: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: 'Safety & protection',
        desc: 'Defending systems and protecting people',
        scores: { security: 4, networking: 1 }
      }
    ]
  },

  // ── INTERESTS (step 1) ─────────────────────
  {
    category: 'Interests',
    stepIndex: 1,
    text: 'Which of these projects would you most enjoy working on?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/></svg>`,
        title: 'Distributed cloud system',
        desc: 'Orchestrate services that scale automatically',
        scores: { cloud: 4, networking: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        title: 'AI assistant or chatbot',
        desc: 'Teach a model to understand and generate language',
        scores: { ai: 4, data: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        title: 'Full-stack web product',
        desc: 'Build the interface, API, and database end-to-end',
        scores: { web: 4, cloud: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
        title: 'Smart sensor network',
        desc: 'Connect physical devices that exchange real-world data',
        scores: { iot: 4, networking: 2, robotics: 1 }
      }
    ]
  },
  {
    category: 'Interests',
    stepIndex: 1,
    text: 'What topic do you find yourself reading about in your spare time?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>`,
        title: 'Machine learning models',
        desc: 'Neural networks, transformers, generative AI',
        scores: { ai: 4, data: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: 'Cybersecurity & hacking',
        desc: 'Exploits, CTFs, zero-days, and network defense',
        scores: { security: 4, networking: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        title: 'UI/UX & design systems',
        desc: 'Typography, color, interaction patterns',
        scores: { web: 4, data: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
        title: 'Data pipelines & analytics',
        desc: 'ETL, SQL, dashboards, and business intelligence',
        scores: { data: 4, cloud: 1 }
      }
    ]
  },
  {
    category: 'Interests',
    stepIndex: 1,
    text: 'Which of these activities sounds most like a fun weekend project?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
        title: 'Train a voice assistant',
        desc: 'Build something that listens and responds intelligently',
        scores: { ai: 3, iot: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
        title: 'Build a personal website',
        desc: 'Portfolio site with animations and dark mode',
        scores: { web: 4 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        title: 'Dashboard of fitness data',
        desc: 'Pull data from APIs and visualize trends',
        scores: { data: 3, web: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
        title: 'Home network security audit',
        desc: 'Scan your network, find vulnerabilities, patch them',
        scores: { security: 3, networking: 3 }
      }
    ]
  },

  // ── SKILLS (step 2) ───────────────────────
  {
    category: 'Skills',
    stepIndex: 2,
    text: 'Which of these comes most naturally to you?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        title: 'Writing clean code',
        desc: 'Structured, readable, and well-tested programs',
        scores: { web: 3, ai: 2, security: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        title: 'Working with data',
        desc: 'Cleaning, transforming, and drawing insights',
        scores: { data: 4, ai: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        title: 'Systems thinking',
        desc: 'Designing how many parts work together reliably',
        scores: { cloud: 3, networking: 3, iot: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
        title: 'Finding vulnerabilities',
        desc: 'Noticing what others missed; adversarial thinking',
        scores: { security: 4, networking: 1 }
      }
    ]
  },
  {
    category: 'Skills',
    stepIndex: 2,
    text: 'If you were debugging a complex system, you would first:',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
        title: 'Read logs and traces',
        desc: 'Sift through output data for the exact error signal',
        scores: { cloud: 2, data: 3, security: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>`,
        title: 'Isolate and bisect',
        desc: 'Narrow down which component is misbehaving',
        scores: { ai: 2, web: 2, networking: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        title: 'Monitor network traffic',
        desc: 'Capture and inspect packets at the protocol level',
        scores: { networking: 4, security: 2, iot: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
        title: 'Rewrite the problematic part',
        desc: 'Refactor and simplify until the bug is gone',
        scores: { web: 3, ai: 2, vlsi: 1 }
      }
    ]
  },
  {
    category: 'Skills',
    stepIndex: 2,
    text: 'What is your strongest academic or self-taught area?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
        title: 'Mathematics & statistics',
        desc: 'Probability, linear algebra, calculus',
        scores: { ai: 4, data: 3, vlsi: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
        title: 'Computer architecture',
        desc: 'CPUs, memory hierarchies, logic gates',
        scores: { vlsi: 4, iot: 2, networking: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        title: 'Algorithms & DSA',
        desc: 'Graphs, trees, dynamic programming, complexity',
        scores: { ai: 2, security: 2, web: 2, data: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
        title: 'Networking & protocols',
        desc: 'TCP/IP, HTTP, routing, DNS, subnetting',
        scores: { networking: 4, cloud: 2, security: 2 }
      }
    ]
  },

  // ── THINKING STYLE (step 3) ────────────────
  {
    category: 'Thinking Style',
    stepIndex: 3,
    text: 'When making a decision, you typically rely on:',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        title: 'Hard data & metrics',
        desc: 'Numbers, benchmarks, A/B tests, evidence',
        scores: { data: 4, ai: 2, cloud: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>`,
        title: 'First principles thinking',
        desc: 'Strip back assumptions and rebuild from scratch',
        scores: { ai: 3, vlsi: 3, networking: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        title: 'Observing user behavior',
        desc: 'Watch how people use things and iterate accordingly',
        scores: { web: 4, iot: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: 'Risk & threat modeling',
        desc: 'Anticipate failure modes before they happen',
        scores: { security: 4, cloud: 2, networking: 1 }
      }
    ]
  },
  {
    category: 'Thinking Style',
    stepIndex: 3,
    text: 'Which analogy resonates most with how you see yourself?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/></svg>`,
        title: 'An architect',
        desc: 'Design the structure before laying a single brick',
        scores: { cloud: 3, networking: 2, vlsi: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
        title: 'An investigator',
        desc: 'Piece together clues; nothing escapes your attention',
        scores: { security: 4, data: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
        title: 'A sculptor',
        desc: 'Shape something complex until it is elegant and right',
        scores: { ai: 3, web: 2, robotics: 2 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        title: 'A connector',
        desc: 'Bridge people, systems, and information together',
        scores: { iot: 3, networking: 3, cloud: 1 }
      }
    ]
  },
  {
    category: 'Thinking Style',
    stepIndex: 3,
    text: 'Given unlimited time, what would you build from scratch?',
    options: [
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        title: 'An AI that reasons & learns',
        desc: 'A model that understands context and improves itself',
        scores: { ai: 5, data: 1 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        title: 'An unhackable network',
        desc: 'Infrastructure where attacks are impossible to succeed',
        scores: { security: 4, networking: 3 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        title: 'A platform used by millions',
        desc: 'An app or service that solves a real everyday problem',
        scores: { web: 4, cloud: 3 }
      },
      {
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>`,
        title: 'A city-wide IoT grid',
        desc: 'Sensors, edge devices, and dashboards at urban scale',
        scores: { iot: 5, robotics: 2, networking: 1 }
      }
    ]
  }
];

/* ─── Domain Profiles ───────────────────────
   Full metadata for the Career Insight Report.
────────────────────────────────────────────── */
const DOMAINS = {
  ai: {
    name: 'Artificial Intelligence & ML',
    icon: '🤖',
    exploreUrl: 'roadmap_ai.html',
    explanation: 'You show a strong preference for abstract reasoning, pattern discovery, and scientific exploration. AI/ML rewards exactly this mindset — it sits at the intersection of mathematics, code, and genuine intellectual curiosity. Your instinct to understand deeply before building makes you well-suited for research-grade engineering.',
    skills: [
      { label: 'Mathematical Reasoning', pct: 90 },
      { label: 'Python & Data Science', pct: 85 },
      { label: 'Model Architecture', pct: 78 },
      { label: 'Critical Analysis', pct: 88 }
    ],
    path: [
      { phase: 'Foundation', chips: ['Linear Algebra', 'Probability', 'Python'] },
      { phase: 'Core ML', chips: ['Scikit-learn', 'NumPy', 'Pandas', 'Statistics'] },
      { phase: 'Deep Learning', chips: ['PyTorch', 'TensorFlow', 'CNNs', 'Transformers'] },
      { phase: 'Applied AI', chips: ['LLMs', 'RLHF', 'MLOps', 'Model Deployment'] }
    ]
  },
  web: {
    name: 'Full-Stack Web Development',
    icon: '🌐',
    exploreUrl: 'roadmap_web.html',
    explanation: 'Your answers reveal a maker mindset — you are driven by creating tangible products that real people engage with. You enjoy the interplay of design, logic, and user psychology. Full-stack web development puts you at the center of product creation, where you control experience from pixel to database row.',
    skills: [
      { label: 'UI/UX Sensibility', pct: 88 },
      { label: 'JavaScript & Frameworks', pct: 85 },
      { label: 'Backend APIs', pct: 75 },
      { label: 'Product Thinking', pct: 82 }
    ],
    path: [
      { phase: 'Basics', chips: ['HTML', 'CSS', 'JavaScript', 'Git'] },
      { phase: 'Frontend', chips: ['React', 'TypeScript', 'CSS Architecture'] },
      { phase: 'Backend', chips: ['Node.js / Python', 'REST APIs', 'SQL', 'Auth'] },
      { phase: 'Advanced', chips: ['Next.js', 'CI/CD', 'Testing', 'Performance'] }
    ]
  },
  data: {
    name: 'Data Science & Analytics',
    icon: '📊',
    exploreUrl: 'roadmap_data.html',
    explanation: 'You thrive when converting raw, ambiguous information into clear, actionable insight. Your strengths in structured analysis, quantitative reasoning, and curiosity for hidden patterns align precisely with data science work — turning numbers into decisions that drive business and research alike.',
    skills: [
      { label: 'Statistical Analysis', pct: 90 },
      { label: 'Python / SQL', pct: 85 },
      { label: 'Data Visualization', pct: 80 },
      { label: 'Business Acumen', pct: 74 }
    ],
    path: [
      { phase: 'Foundations', chips: ['Statistics', 'Python', 'SQL', 'Excel'] },
      { phase: 'Analysis', chips: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
      { phase: 'Modeling', chips: ['ML Basics', 'Feature Engineering', 'Scikit-learn'] },
      { phase: 'Production', chips: ['Airflow', 'dbt', 'BI Tools', 'Dashboards'] }
    ]
  },
  cloud: {
    name: 'Cloud & Infrastructure',
    icon: '☁️',
    exploreUrl: 'roadmap_cloud.html',
    explanation: 'Your systems-level thinking and desire to build at scale point clearly toward cloud and infrastructure engineering. You see the whole architecture — not just individual components — and care deeply about reliability, performance, and the invisible machinery that keeps everything running.',
    skills: [
      { label: 'Systems Architecture', pct: 88 },
      { label: 'Linux & Scripting', pct: 82 },
      { label: 'Cloud Platforms', pct: 84 },
      { label: 'Distributed Systems', pct: 78 }
    ],
    path: [
      { phase: 'Core', chips: ['Linux', 'Networking Basics', 'Bash', 'Git'] },
      { phase: 'Cloud', chips: ['AWS / GCP / Azure', 'S3', 'EC2', 'IAM'] },
      { phase: 'DevOps', chips: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
      { phase: 'Advanced', chips: ['SRE Practices', 'Observability', 'Cost Optimization'] }
    ]
  },
  security: {
    name: 'Cybersecurity',
    icon: '🔐',
    exploreUrl: 'roadmap_security.html',
    explanation: 'You think like an adversary — which is precisely the mindset that makes exceptional security engineers. You are methodical, patient, and notice things others overlook. Cybersecurity rewards people who question every assumption and find satisfaction in making systems provably hard to break.',
    skills: [
      { label: 'Adversarial Thinking', pct: 92 },
      { label: 'Networking Protocols', pct: 82 },
      { label: 'Scripting & Automation', pct: 76 },
      { label: 'Risk Assessment', pct: 88 }
    ],
    path: [
      { phase: 'Foundation', chips: ['Linux', 'Networking', 'Python', 'Cryptography'] },
      { phase: 'Offense', chips: ['Kali Linux', 'Metasploit', 'Burp Suite', 'CTFs'] },
      { phase: 'Defense', chips: ['SIEM', 'Incident Response', 'Threat Modeling'] },
      { phase: 'Specialization', chips: ['Pen Testing', 'Malware Analysis', 'Cloud Security'] }
    ]
  },
  networking: {
    name: 'Networking & Infrastructure',
    icon: '🔗',
    exploreUrl: 'roadmap_networking.html',
    explanation: 'You gravitate toward understanding how things connect — the invisible plumbing that carries data around the world. Networking engineers are essential architects of reliability. Your preference for structured, protocol-level thinking and tolerance for deep technical detail make this a natural fit.',
    skills: [
      { label: 'Protocol Knowledge', pct: 90 },
      { label: 'Routing & Switching', pct: 85 },
      { label: 'Linux Networking', pct: 80 },
      { label: 'Troubleshooting', pct: 88 }
    ],
    path: [
      { phase: 'Basics', chips: ['OSI Model', 'TCP/IP', 'Subnetting', 'DNS'] },
      { phase: 'Routing', chips: ['BGP', 'OSPF', 'VLANs', 'Cisco IOS'] },
      { phase: 'Operations', chips: ['Wireshark', 'Monitoring', 'Automation'] },
      { phase: 'Advanced', chips: ['SDN', 'Network Security', 'Cloud Networking'] }
    ]
  },
  iot: {
    name: 'Internet of Things',
    icon: '📡',
    exploreUrl: 'roadmap_iot.html',
    explanation: 'You are energized by connecting the physical and digital worlds. IoT engineers think across hardware and software — from microcontrollers to cloud dashboards. Your hands-on curiosity and systems-level views make you well-suited to building embedded systems that interact with the real world.',
    skills: [
      { label: 'Embedded Programming', pct: 82 },
      { label: 'Sensor Integration', pct: 88 },
      { label: 'Wireless Protocols', pct: 78 },
      { label: 'Edge Computing', pct: 74 }
    ],
    path: [
      { phase: 'Electronics', chips: ['Arduino', 'Raspberry Pi', 'Sensors', 'GPIO'] },
      { phase: 'Protocols', chips: ['MQTT', 'BLE', 'LoRa', 'Zigbee'] },
      { phase: 'Cloud', chips: ['AWS IoT', 'Node-RED', 'Time-Series DB'] },
      { phase: 'Advanced', chips: ['Edge AI', 'RTOS', 'PCB Design', 'Security'] }
    ]
  },
  robotics: {
    name: 'Robotics & Automation',
    icon: '🦾',
    exploreUrl: 'roadmap_ai.html',
    explanation: 'Your blend of hands-on curiosity and systems thinking points toward robotics and automation. You are not satisfied until things work in the real, physical world — not just in simulation. This domain rewards engineers who can think in hardware and software simultaneously.',
    skills: [
      { label: 'Kinematics & Control', pct: 80 },
      { label: 'C++ / Python', pct: 82 },
      { label: 'Sensor Fusion', pct: 78 },
      { label: 'Embedded Systems', pct: 84 }
    ],
    path: [
      { phase: 'Fundamentals', chips: ['C++', 'Python', 'Linux', 'Electronics'] },
      { phase: 'Robotics', chips: ['ROS 2', 'Kinematics', 'Control Systems'] },
      { phase: 'Perception', chips: ['Computer Vision', 'LiDAR', 'Sensor Fusion'] },
      { phase: 'Advanced', chips: ['SLAM', 'Motion Planning', 'Sim-to-Real'] }
    ]
  },
  vlsi: {
    name: 'VLSI & Chip Design',
    icon: '🔬',
    exploreUrl: 'roadmap_vlsi.html',
    explanation: 'Your affinity for low-level architecture, mathematical rigor, and getting things right at the hardware level maps precisely onto VLSI design. You care about how computation actually works — at the transistor level. This is one of the most demanding and rewarding fields in computer engineering.',
    skills: [
      { label: 'Digital Logic Design', pct: 88 },
      { label: 'Verilog / VHDL', pct: 82 },
      { label: 'Computer Architecture', pct: 85 },
      { label: 'Analytical Thinking', pct: 92 }
    ],
    path: [
      { phase: 'Digital Logic', chips: ['Boolean Algebra', 'Gates', 'Flip-flops', 'FSMs'] },
      { phase: 'HDL', chips: ['Verilog', 'VHDL', 'ModelSim', 'Testbenches'] },
      { phase: 'Architecture', chips: ['Pipelining', 'Cache Design', 'RISC-V'] },
      { phase: 'Advanced', chips: ['FPGA', 'Synthesis', 'Timing Analysis', 'ASIC Flow'] }
    ]
  }
};

/* ─── App State ─────────────────────────────── */
let state = {
  currentQuestion: 0,
  answers: [],          // index = question index, value = option index selected
  scores: {}            // accumulated domain scores
};

/* ─── Category to Step Mapping ─── */
const STEP_BOUNDS = [
  { name: 'Profile',       start: 0, end: 2 },
  { name: 'Interests',     start: 3, end: 5 },
  { name: 'Skills',        start: 6, end: 8 },
  { name: 'Thinking Style',start: 9, end: 11 }
];

/* ─── DOM references ─── */
const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════
   INITIALISE
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScores();
  renderQuestion(0);
  updateProgress();
});

function initScores() {
  Object.keys(DOMAINS).forEach(key => { state.scores[key] = 0; });
}

/* ═══════════════════════════════════════════
   RENDER QUESTION
════════════════════════════════════════════ */
function renderQuestion(index) {
  const q = QUESTIONS[index];
  if (!q) return;

  $('questionCategory').textContent  = q.category;
  $('questionCounter').textContent   = `Question ${index + 1} of ${QUESTIONS.length}`;
  $('questionTitle').textContent     = q.text;

  const grid = $('optionsGrid');
  grid.innerHTML = '';

  q.options.forEach((opt, i) => {
    const card = document.createElement('button');
    card.className = 'option-card';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.id = `option-${i}`;
    card.innerHTML = `
      <div class="option-icon">${opt.icon}</div>
      <span class="option-title">${opt.title}</span>
      <span class="option-desc">${opt.desc}</span>
    `;

    // Restore selection if the user is navigating back
    if (state.answers[index] === i) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }

    card.addEventListener('click', () => selectOption(card, index, i, q, opt));
    grid.appendChild(card);
  });

  // Update Next button state
  $('btnNext').disabled = state.answers[index] === undefined;
  // Disable Back on first question
  $('btnBack').disabled = index === 0;

  updateStepNav(q.stepIndex);
  updateProgress();
  animateQuestionIn();
}

/* ─── Select Option ─── */
function selectOption(card, questionIndex, optionIndex, question, option) {
  // Deselect all siblings
  card.closest('.options-grid').querySelectorAll('.option-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });

  // Select this card
  card.classList.add('selected');
  card.setAttribute('aria-checked', 'true');

  // Remove previous score contribution if re-selecting
  if (state.answers[questionIndex] !== undefined) {
    const prev = question.options[state.answers[questionIndex]];
    if (prev.scores) {
      Object.entries(prev.scores).forEach(([domain, pts]) => {
        state.scores[domain] = Math.max(0, (state.scores[domain] || 0) - pts);
      });
    }
  }

  // Record answer and add score
  state.answers[questionIndex] = optionIndex;
  if (option.scores) {
    Object.entries(option.scores).forEach(([domain, pts]) => {
      state.scores[domain] = (state.scores[domain] || 0) + pts;
    });
  }

  $('btnNext').disabled = false;
  updateProgress();
}

/* ─── Navigation ─── */
function navigateNext() {
  if (state.currentQuestion < QUESTIONS.length - 1) {
    state.currentQuestion++;
    renderQuestion(state.currentQuestion);
  } else {
    showLoading();
  }
}

function navigateBack() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    renderQuestion(state.currentQuestion);
  }
}

/* ─── Progress Bar ─── */
function updateProgress() {
  const answered = state.answers.filter(a => a !== undefined).length;
  const pct = (answered / QUESTIONS.length) * 100;
  $('progressFill').style.width = `${pct}%`;
}

/* ─── Sidebar Step Navigation ─── */
function updateStepNav(activeStepIndex) {
  const items = document.querySelectorAll('.step-item');
  items.forEach((item, i) => {
    item.classList.remove('active', 'completed');
    if (i < activeStepIndex) item.classList.add('completed');
    else if (i === activeStepIndex) item.classList.add('active');
  });
}

/* ─── Animate question in ─── */
function animateQuestionIn() {
  const view = $('questionView');
  view.style.animation = 'none';
  void view.offsetWidth; // reflow
  view.style.animation = '';
}

/* ═══════════════════════════════════════════
   LOADING + RESULTS
════════════════════════════════════════════ */
function showLoading() {
  $('questionView').classList.add('hidden');
  $('loadingView').classList.remove('hidden');

  // Mark step 4 (Result) as active
  updateStepNav(4);

  setTimeout(showResult, 2200);
}

function showResult() {
  $('loadingView').classList.add('hidden');
  $('resultView').classList.remove('hidden');

  const domain = computeTopDomain();
  const data   = DOMAINS[domain];

  // Badge
  $('resultBadgeIcon').textContent = data.icon;
  // Domain name
  $('resultDomain').textContent = data.name;
  // Explanation
  $('resultExplanation').textContent = data.explanation;
  // Explore link
  $('btnExplore').href = data.exploreUrl;

  // Skill bars
  const barsContainer = $('skillBars');
  barsContainer.innerHTML = '';
  data.skills.forEach(skill => {
    const item = document.createElement('div');
    item.className = 'skill-bar-item';
    item.innerHTML = `
      <div class="skill-bar-meta">
        <span class="skill-bar-label">${skill.label}</span>
        <span class="skill-bar-pct">${skill.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" style="width:0%" data-target="${skill.pct}"></div>
      </div>
    `;
    barsContainer.appendChild(item);
  });

  // Learning path
  const pathContainer = $('learningPath');
  pathContainer.innerHTML = '';
  data.path.forEach((phase, idx) => {
    const el = document.createElement('div');
    el.className = 'learning-phase';
    el.innerHTML = `
      <div class="learning-phase-num">${idx + 1}</div>
      <div class="learning-phase-content">
        <span class="learning-phase-title">${phase.phase}</span>
        <div class="learning-phase-chips">
          ${phase.chips.map(c => `<span class="chip">${c}</span>`).join('')}
        </div>
      </div>
    `;
    pathContainer.appendChild(el);
  });

  // Animate skill bars after a short delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 150);
  });
}

function computeTopDomain() {
  let top = 'web', topScore = -1;
  Object.entries(state.scores).forEach(([domain, score]) => {
    if (score > topScore) { topScore = score; top = domain; }
  });
  return top;
}

/* ─── Retake ─── */
function retakeQuiz() {
  state = { currentQuestion: 0, answers: [], scores: {} };
  initScores();
  $('resultView').classList.add('hidden');
  $('questionView').classList.remove('hidden');
  renderQuestion(0);
  updateStepNav(0);
  updateProgress();
}
