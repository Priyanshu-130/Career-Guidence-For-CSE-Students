const questions = [
    // Part 1: Orientation (4 Questions)
    { category: "Orientation", q: "1. When starting a completely new project, your first instinct is usually to:", options: { A: "See if Artificial Intelligence or Machine Learning can automate or solve the core problem completely.", B: "Gather past records, clean up massive spreadsheets, and analyze the pure data.", C: "Sketch out exactly how the user screens will look and how the buttons will feel.", D: "Look for security risks, think about how it could be hacked, or build it completely decentralized.", E: "Plan how many huge servers are needed and how the physical infrastructure connects together." } },
    { category: "Orientation", q: "2. Would you rather work in an environment that is heavily focused on:", options: { A: "Training brand new software to act like a human brain and make its own decisions.", B: "Being driven completely by undeniable evidence, charts, and deep statistical metrics.", C: "Being fast-paced, highly creative, and constantly focused on building beautiful products people see.", D: "Being highly secretive, defensive, and rigorously focused on defending against attacks.", E: "Being highly scalable, keeping hundreds of global servers online 24/7 without a single drop." } },
    { category: "Orientation", q: "3. When someone hands you a complex, messy problem to solve, you immediately:", options: { A: "Look for an abstraction or a heuristic formula that can intelligently solve it on its own.", B: "Look for hidden trends in the historical records that nobody else has noticed yet.", C: "Break it down visually into what the user will see and experience when they click heavily.", D: "Think exactly like a malicious attacker who is actively trying to break the system.", E: "Write a background script to completely automate the entire solution so you never have to do it again." } },
    { category: "Orientation", q: "4. If you had to describe your natural engineering mind, you gravitate towards:", options: { A: "Making computers act just like intelligent humans.", B: "Telling incredibly accurate and fascinating stories using complex numbers.", C: "Creating incredibly engaging, beautiful, and interactive products that go viral.", D: "Protecting systems from bad actors and creating mathematically unbreakable trust.", E: "Building massive interconnected networks and extremely smart physical smart-devices." } },

    // Part 2: Interest (4 Questions)
    { category: "Interest", q: "5. In your free time, you are most likely to read news articles heavily detailing:", options: { A: "The latest massive Language Models (like ChatGPT) and entirely deep neural networks.", B: "Incredible new data visualizations, big data trends, and data tracking tools.", C: "Brand new user-interface design frameworks, beautiful animations, or 3D gaming engines.", D: "Zero-day massive cyber-attacks, ethical hacking, and blockchain cryptocurrency innovations.", E: "Enterprise cloud architecture, Kubernetes scaling, and real-world robotics programming." } },
    { category: "Interest", q: "6. The type of software application that you find the absolutely most fascinating is:", options: { A: "Virtual voice assistants, computer vision models, and highly intelligent chatbots.", B: "Massive business intelligence data pipelines and live tracking dashboards.", C: "Sleek mobile applications and incredibly high-fidelity 3D immersive video games.", D: "Intrusion detection security systems and transparent DeFi (Decentralized Finance) protocols.", E: "Infrastructure-as-code platforms that can deploy a thousand servers in one second." } },
    { category: "Interest", q: "7. Which of these tech news headlines would immediately make you click without thinking:", options: { A: "'New Artificial Intelligence safely drives a car through an entire city unsupervised!'", B: "'How analyzing 10 billion rows of shopping data revealed a completely hidden human behavior!'", C: "'The stunning new visual framework replacing React and Unreal Engine is finally here!'", D: "'Major tech mega-corporation completely hacked via clever social engineering token theft!'", E: "'New massive server architecture and sensors completely revolutionize global edge computing!'" } },
    { category: "Interest", q: "8. A magical genie grants you the ability to master one aspect of computing perfectly. You choose:", options: { A: "Deep Machine Learning, NLP, and complex Neural Networks.", B: "Data Warehousing, Statistical Pipelines, and ETL (Extract, Transform, Load).", C: "Full-stack Web Architecture, Graphic Design, and immersive Gameplay Mechanics.", D: "Ethical Hacking, Penetration Testing, and impenetrable Tokenomics.", E: "Distributed Global Systems, Virtualization, and Real-time Operating Systems." } },

    // Part 3: Aptitude (4 Questions)
    { category: "Aptitude", q: "9. You genuinely feel like you have a remarkable, natural talent for:", options: { A: "Probability, deep calculus, and mapping out incredibly abstract intelligence algorithms.", B: "Spotting incredibly tiny, hidden logical inconsistencies in massive, boring documents or numbers.", C: "Having a phenomenally good eye for beautiful colors, spatial layouts, and smooth human interactions.", D: "Spotting exactly when a system is fundamentally flawed, actively lying, or easily corruptible.", E: "Organizing incredibly complex backend systems or easily fixing broken appliances and electronics." } },
    { category: "Aptitude", q: "10. You can focus deeply for entirely uninterrupted hours easily when you are:", options: { A: "Intensely experimenting with adding and removing deep neural network layers to see what happens.", B: "Cleaning, normalizing, and beautifully transforming a massive, terrible spreadsheet into gold.", C: "Tweaking CSS styling or game level design until it feels exactly, perfectly right to the pixel.", D: "Aggressively hunting down a tiny memory bug in a deeply reverse-engineered, complex binary.", E: "Configuring a full Linux server cluster from absolute scratch or wiring a custom PCB board." } },
    { category: "Aptitude", q: "11. The fundamental subject you seemed to naturally pick up the absolute fastest in life was:", options: { A: "Advanced Cognitive Math, Deep Philosophical Logic, and abstract AI concepts.", B: "Statistics, Probability distributions, and building insanely complex Excel trackers.", C: "Art, Web Design, Media Arts, or understanding the psychology of Graphic Design.", D: "Deep networking protocols, intense cryptography, and psychological game theory.", E: "Bash scripting, deep containerization, hardcore Physics, and electrical Circuits." } },
    { category: "Aptitude", q: "12. When given a truly massive, overwhelming amount of information, you instinctively:", options: { A: "Train an intelligent machine-learning model to understand its massive underlying distributions.", B: "Filter it, deeply sort it, and visualize it mathematically so the pure truth reveals itself.", C: "Create a remarkably beautiful, clean dashboard so a normal user can visually process it easily.", D: "Hash it, immutably secure it, or aggressively probe the data for highly sensitive leaks.", E: "Store it incredibly efficiently in a highly distributed database or process it directly at the edge." } }
];

let currentQuestion = 0;
let userAnswers = {};
let activeCategory = 0;
let completedCategories = new Set();
let finalRefinedDomain = null;
let refinementAnswers = {};
let currentTopCluster = null;

const categoryWeights = {
    "Aptitude": 0.40,
    "Interest": 0.35,
    "Orientation": 0.25
};

const categoryExplanations = {
    "Orientation": {
        A: "You scored incredibly high in the Analytical & Intelligence domain for Orientation! This means that when you face a brand-new problem, your absolute first instinct is to think, \"How can I teach a machine to solve this for me?\" Rather than manually writing out step-by-step code, you prefer to feed data into algorithms and let the system discover the answer itself. Because you orient your thinking toward automation, machine learning, and mapping human cognition into code, domains like Artificial Intelligence and Deep Learning are a fantastic, natural fit for your foundational mindset.",
        B: "You scored incredibly high in the Data & Insights domain for Orientation! When you start a completely new task, your brain immediately craves pure, undeniable metrics. You do not like to guess or rely on \"gut feelings\"; you prefer to gather historical records, analyze the numbers, and let the factual evidence dictate your strategy. Because you heavily orient toward uncovering the absolute truth hidden inside massive amounts of chaotic information, Data Science is the absolute perfect domain for you.",
        C: "You scored incredibly high in the Creative Product Building domain for Orientation! For you, the most important part of ANY software is the person actually using it. Your mind immediately jumps to sketching out screens, obsessing over how the buttons feel, and focusing incredibly hard on the visual layout. Because your compass naturally points toward empathy for the user and creating stunning, interactive, visual experiences, fields like Web Development and Game Development will feel remarkably fulfilling to you.",
        D: "You scored incredibly high in the Security & Trust domain for Orientation! You have a fascinatingly unique mindset where you naturally look at systems and immediately wonder, \"How could this be broken, hacked, or manipulated?\" You strongly prefer environments that are rigorously defensive, secretive, and decentralized. Because you orient your raw problem-solving toward protecting massive architecture from malicious actors and enforcing absolute transparent trust, Cyber Security and Blockchain engineering are spectacular career paths for you.",
        E: "You scored incredibly high in the Systems & Hardware domain for Orientation! When you approach a massive problem, you think about the literal foundation: the physical servers, the global networking connections, and the hardware microchips that make the virtual world possible. You intensely prefer highly scalable, 24/7 available environments rather than just writing a simple web app. Because your brain naturally architects massive, interconnected, physical components, Cloud Computing and IoT (Internet of Things) will be an incredibly rewarding playground."
    },
    "Interest": {
        A: "Your raw, passionate Interest perfectly aligns with the Analytical & Intelligence cluster! When you are completely off the clock, you naturally find yourself reading about massive Language Models like ChatGPT, computer vision, and the bleeding edge of intelligent algorithms. You are genuinely fascinated by the philosophical possibility of a machine that truly thinks. Because this domain entirely revolves around training neural networks that can independently converse and learn, Artificial Intelligence and Machine Learning are exactly where your curiosity thrives.",
        B: "Your raw, passionate Interest perfectly aligns with the Data & Insights cluster! Unlike many engineers, you are deeply fascinated by massive business intelligence pipelines, tracking global dashboards, and reading news articles about how 10 billion rows of shopping data revealed a completely hidden human behavior. You genuinely love extracting a clear narrative out of messy spreadsheets. Because your absolute highest interest lies in the mathematics of truth and statistical anomalies, Data Science will keep you endlessly fascinated for your entire career.",
        C: "Your raw, passionate Interest perfectly aligns with the Creative Product Building cluster! In your free time, you naturally gravitate toward reading about the newest visual design frameworks, stunning CSS styling tricks, or exploring the immersive mechanics of 3D gaming engines like Unreal. You are captivated by exceptionally sleek, highly responsive, high-fidelity applications. Because your deepest fascination lies in blending beautiful, psychological art with hardcore code logic to entertain and assist users, Web Development and Game Development are incredibly strong career leads for you.",
        D: "Your raw, passionate Interest perfectly aligns with the Security & Trust cluster! You are completely captivated by the intense, constant cat-and-mouse game of ethical hacking. You love reading about zero-day attacks, massive corporate breaches, penetration testing, and the entirely trustless mathematics of cryptocurrency protocols. You actively want to master the art of finding dangerous exploits before the bad guys do. Because your curiosity thrives on intense, defensive cyber-warfare, Cyber Security and Blockchain will never, ever feel boring to you.",
        E: "Your raw, passionate Interest perfectly aligns with the Systems & Hardware cluster! You find the actual, physical infrastructure of computing incredibly fascinating—reading about automating massive Kubernetes clusters, programming intricate robotics, and deploying 1,000 global servers in a single second. Your dream project is literally building a home cloud lab or wiring up a smart greenhouse connected to a microcontroller. Because your deepest interest lies in the massive, tangible architecture of the internet, Cloud DevOps and IoT are exceptionally great alignments."
    },
    "Aptitude": {
        A: "Your natural Aptitude points entirely toward the Analytical & Intelligence cluster! You have a remarkably brilliant, innate talent for advanced cognitive math, probability, deep calculus, and mapping out highly abstract intelligence algorithms. The subjects you pick up fastest are always philosophy, advanced logic, and deep AI concepts. Because you are naturally gifted at understanding multi-dimensional arrays and training models to understand complex distributions, you possess the exact intellectual firepower required to be a spectacular Machine Learning engineer.",
        B: "Your natural Aptitude points entirely toward the Data & Insights cluster! You natively excel at spotting hidden statistical anomalies, finding beautiful correlations, and organizing massive amounts of information mathematically. People constantly ask for your help making sense of wildly confusing business numbers or giant survey reports. Because your brain naturally filters, sorts, and visualizes exceptionally large datasets incredibly efficiently, you have the absolute perfect intellectual foundation to master Data Science.",
        C: "Your natural Aptitude points entirely toward the Creative Product Building cluster! You have a phenomenally good, natural eye for stunning colors, perfect spatial layouts, and perfectly smooth human interactions. Whether it's art, media design, or complex CSS styling to the absolute pixel, you intuitively understand human navigation perfectly. Because your raw talent lies in visually communicating massive amounts of information beautifully and making systems \"feel right\", you possess the elite skills necessary to become a master Web or Game Developer.",
        D: "Your natural Aptitude points entirely toward the Security & Trust cluster! You are exceptionally gifted at finding flaws in a rigid set of rules, deeply reverse-engineering logic, understanding advanced encryption cryptography, and spotting deception (like phishing scams) immediately. When given an overwhelming system, your instinct is strictly to immutably secure it and deeply probe it for massive leaks. Because your intellectual talent lies heavily in critical system defense and tokenomic game theory, you are genuinely brilliant at Cyber Security and Blockchain.",
        E: "Your natural Aptitude points entirely toward the Systems & Hardware cluster! You casually learn deep physical and massive networked systems incredibly fast. You are deeply gifted at mapping out server connections, automation bash scripts, handling deep containerization, and perfectly understanding physical electrical circuitry. Because your brain naturally organizes incredibly complex backend database architectures and fixes broken hardware easily, you have the absolute necessary elite engineering talent to master Cloud DevOps and IoT."
    }
};

const clusterMap = {
    A: { name: "AI & Intelligence", domains: ["Artificial Intelligence", "Machine Learning", "Deep Learning"], colors: ["#3b82f6", "#14b8a6", "#1e40af"] },
    B: { name: "Data & Analytics", domains: ["Data Science"], colors: ["#10b981"] },
    C: { name: "Product Development", domains: ["Web / App Development", "Game Development"], colors: ["#f59e0b", "#f97316"] },
    D: { name: "Security & Trust", domains: ["Cyber Security", "Blockchain"], colors: ["#ef4444", "#6366f1"] },
    E: { name: "Systems & Infrastructure", domains: ["Cloud Computing", "IoT & Embedded Systems"], colors: ["#8b5cf6", "#ec4899"] }
};

const domainMap = {
    "Artificial Intelligence": { link: "domain_ai.html", color: "#3b82f6" },
    "Data Science": { link: "domain_data.html", color: "#10b981" },
    "Web / App Development": { link: "domain_web.html", color: "#f59e0b" },
    "Cyber Security": { link: "domain_security.html", color: "#ef4444" },
    "Cloud Computing": { link: "domain_cloud.html", color: "#8b5cf6" },
    "IoT & Embedded Systems": { link: "domain_iot.html", color: "#ec4899" },
    "Blockchain": { link: "domain_blockchain.html", color: "#6366f1" },
    "Game Development": { link: "domain_game.html", color: "#f97316" },
    "Machine Learning": { link: "domain_ml.html", color: "#14b8a6" },
    "Deep Learning": { link: "domain_dl.html", color: "#1e40af" }
};

// --- Refinement Tie-Breaker Question Logic ---
const refinementQuestionsLib = {
    A: [
        { q: "Are you more interested in general systems that mimic human behaviors, or systems that specifically learn from massive datasets?", options: { "Artificial Intelligence": "I want to build general systems like robots or voice agents that mimic broad human capabilities.", "Machine Learning": "I want to build algorithms that mathematically learn from large datasets without being explicitly programmed.", "Deep Learning": "I want to build highly complex, multi-layered neural networks (like ChatGPT or image generators)." } },
        { q: "When you hear 'Neural Networks', what excites you the most?", options: { "Artificial Intelligence": "Using them as one tool among many to create a smart, autonomous robot or character.", "Machine Learning": "Using them to run regression models to perfectly predict a housing market.", "Deep Learning": "The massive, pure underlying architecture of the neural network itself." } },
        { q: "If you had to choose a project for this weekend:", options: { "Artificial Intelligence": "I would build a chess-playing bot that understands complex game rules and logic.", "Machine Learning": "I would build a recommendation engine that suggests movies based on Excel data.", "Deep Learning": "I would train a model that generates completely new, fake photorealistic faces." } },
        { q: "Your ultimate career goal is to create a machine that:", options: { "Artificial Intelligence": "Can pass the Turing Test and talk exactly like a real human being.", "Machine Learning": "Can perfectly predict next year's stock market prices based on historical data.", "Deep Learning": "Can understand massive unstructured contexts, like reading entire legal books in seconds." } }
    ],
    B: [
        { q: "What type of Data Science role excites you the most?", options: { "Data Science": "Building predictive Machine Learning models on clean data.", "Data Science ": "Engineering and scaling massive data pipelines (Data Engineering).", "Data Science  ": "Creating beautiful tracking dashboards for business (Data Analytics)." } },
        { q: "When working with a massive dataset, you prefer to:", options: { "Data Science": "Solve complex probability and find hidden predictive patterns.", "Data Science ": "Clean, structure, and optimize it so others can use it fast.", "Data Science  ": "Visualize it perfectly so executives can understand the story." } },
        { q: "Which toolset do you most want to master?", options: { "Data Science": "Python, Scikit-Learn, and TensorFlow algorithms.", "Data Science ": "SQL, Spark, Hadoop, and Cloud Data Warehouses.", "Data Science  ": "Tableau, PowerBI, and Advanced Excel." } },
        { q: "What is the ultimate goal of your ideal data work?", options: { "Data Science": "Predicting the absolute future with high mathematical accuracy.", "Data Science ": "Providing an invisible, flawless, fast foundation for data.", "Data Science  ": "Revealing immediate past and present business strategies." } }
    ],
    C: [
        { q: "When you open an application, what do you notice first?", options: { "Web / App Development": "The layout, the smooth scrolling, and how functional the buttons are.", "Game Development": "The lighting, 3D graphics, particles, and the physics of movement." } },
        { q: "You prefer building experiences that are:", options: { "Web / App Development": "Highly useful, informative, and solve a daily real-world productivity problem for a user.", "Game Development": "Highly entertaining, completely immersive, and built entirely for fun and escapism." } },
        { q: "You would rather spend 5 hours debugging:", options: { "Web / App Development": "A responsive CSS grid that breaks completely when someone turns their phone sideways.", "Game Development": "A collision detection bug where a character falls straight through the floor." } },
        { q: "Which toolset sounds vastly more exciting to master?", options: { "Web / App Development": "React, Node.js, databases, and high-performance frontend frameworks.", "Game Development": "Unreal Engine, Unity, C++, and 3D modeling pipelines." } },
    ],
    D: [
        { q: "What is your main interest in Security & Trust?", options: { "Cyber Security": "Offensive and defensive hacking, finding vulnerabilities before attackers do.", "Blockchain": "Building completely decentralized, mathematically undeniable smart contracts." } },
        { q: "You would rather stop a disaster by:", options: { "Cyber Security": "Monitoring network traffic and isolating a vicious, active ransomware attack.", "Blockchain": "Writing a protocol so inherently secure that an attack mathematically cannot exist." } },
        { q: "When dealing with money and data, you prefer:", options: { "Cyber Security": "Trusting a massive central authority (like a Bank) but guarding it with impenetrable walls.", "Blockchain": "Removing the center authority entirely so users have absolute, undeniable control." } },
        { q: "Which sounds like the coolest job title?", options: { "Cyber Security": "Chief Penetration Tester (Ethical Hacker) / Incident Commander.", "Blockchain": "Decentralized Finance (DeFi) Architecture Engineer." } }
    ],
    E: [
        { q: "When you look at massive infrastructure, you prefer:", options: { "Cloud Computing": "Virtual architecture—massive global servers running invisibly in data centers.", "IoT & Embedded Systems": "Physical architecture—smart fridges, drones, sensors, and real-world microcontrollers." } },
        { q: "You are tasked with a new deployment. You would rather:", options: { "Cloud Computing": "Write a script that spins up 5,000 virtual Amazon web servers instantly.", "IoT & Embedded Systems": "Write C code that reads temperature data from a physical sensor board." } },
        { q: "The biggest challenge you'd actively enjoy fixing is:", options: { "Cloud Computing": "A network timeout issue between two global data centers running microservices.", "IoT & Embedded Systems": "A power efficiency issue draining the battery of a smart-watch too fast." } },
        { q: "Your ideal workspace consists of:", options: { "Cloud Computing": "A clean desk, dual monitors, and entirely virtual command-line interfaces.", "IoT & Embedded Systems": "A soldering iron, circuit boards, exposed wires, and a multimeter." } }
    ]
};
// ------------------------------------------

function switchTab(tabIndex) {
    if (activeCategory === tabIndex) return;
    
    document.querySelectorAll(".tab-btn").forEach((btn, idx) => {
        if (idx === tabIndex) btn.classList.add("active");
        else btn.classList.remove("active");
    });
    
    activeCategory = tabIndex;
    
    if (completedCategories.has(tabIndex)) {
        showCategoryResult(tabIndex);
    } else {
        let startQ = tabIndex * 4;
        let nextUnanswered = startQ;
        for (let i = startQ; i < startQ + 4; i++) {
            if (!userAnswers[i]) {
                nextUnanswered = i;
                break;
            }
        }
        
        document.getElementById("categoryResult").classList.add("hidden");
        document.getElementById("questionContainer").classList.remove("hidden");
        document.getElementById("nextBtn").classList.remove("hidden");
        document.getElementById("prevBtn").classList.remove("hidden");
        
        loadQuestion(nextUnanswered);
    }
    checkFinishPossibility();
}

function checkFinishPossibility() {
    if (completedCategories.size === 3) {
        document.getElementById("finishQuizBtn").classList.remove("hidden");
        document.getElementById("finishQuizBtn").onclick = showRefinementStep;
    }
}

function loadQuestion(index) {
    currentQuestion = index;
    const q = questions[index];
    const container = document.getElementById("questionContainer");

    let html = `
        <div class="question-card">
            <h3 style="margin-top:0;">${q.q}</h3>
            <div class="options-grid">
    `;

    for (const [key, value] of Object.entries(q.options)) {
        const isSelected = userAnswers[index] === key ? 'selected' : '';
        html += `
            <label class="option-label ${isSelected}" onclick="selectOption(this, ${index}, '${key}')">
                <input type="radio" name="q${index}" value="${key}" ${isSelected ? 'checked' : ''}>
                ${value}
            </label>
        `;
    }

    html += `   </div>
        </div>`;
    container.innerHTML = html;

    document.getElementById("currentQNum").innerText = (index % 4) + 1;
    document.getElementById("totalQuestions").innerText = "4";
    let progress = (((index % 4) + 1) / 4) * 100;
    document.getElementById("progressFill").style.width = progress + "%";

    let catStart = activeCategory * 4;
    document.getElementById("prevBtn").disabled = index === catStart;

    if (index === catStart + 3) {
        document.getElementById("nextBtn").innerText = "Finish Category";
        document.getElementById("nextBtn").classList.add("btn-secondary");
    } else {
        document.getElementById("nextBtn").innerText = "Next";
        document.getElementById("nextBtn").classList.remove("btn-secondary");
    }
}

function selectOption(label, qIndex, value) {
    document.querySelectorAll(".option-label").forEach(el => el.classList.remove("selected"));
    label.classList.add("selected");
    label.querySelector("input").checked = true;
    userAnswers[qIndex] = value;
}

function nextQuestion() {
    if (!userAnswers[currentQuestion]) {
        alert("Please select an option.");
        return;
    }

    let catStart = activeCategory * 4;
    if (currentQuestion < catStart + 3) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        completedCategories.add(activeCategory);
        document.querySelectorAll(".tab-btn")[activeCategory].style.borderColor = "#10b981"; 
        showCategoryResult(activeCategory);
        checkFinishPossibility();
    }
}

function prevQuestion() {
    let catStart = activeCategory * 4;
    if (currentQuestion > catStart) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
}

function calculateWeightedScores() {
    let clusterCategoryCounts = {
        A: { "Aptitude": 0, "Interest": 0, "Orientation": 0 },
        B: { "Aptitude": 0, "Interest": 0, "Orientation": 0 },
        C: { "Aptitude": 0, "Interest": 0, "Orientation": 0 },
        D: { "Aptitude": 0, "Interest": 0, "Orientation": 0 },
        E: { "Aptitude": 0, "Interest": 0, "Orientation": 0 }
    };
    
    Object.entries(userAnswers).forEach(([qIndex, clusterKey]) => {
        const cat = questions[qIndex].category;
        clusterCategoryCounts[clusterKey][cat]++;
    });
    
    let processScores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    Object.keys(processScores).forEach(cluster => {
        let weightedScore = 0;
        weightedScore += clusterCategoryCounts[cluster]["Aptitude"] * categoryWeights["Aptitude"];
        weightedScore += clusterCategoryCounts[cluster]["Interest"] * categoryWeights["Interest"];
        weightedScore += clusterCategoryCounts[cluster]["Orientation"] * categoryWeights["Orientation"];
        processScores[cluster] = weightedScore;
    });
    
    return { processScores, clusterCategoryCounts };
}

function showCategoryResult(tabIndex) {
    const categoryNames = ["Orientation", "Interest", "Aptitude"];
    const catName = categoryNames[tabIndex];
    
    let startQ = tabIndex * 4;
    let localScores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (let i = startQ; i < startQ + 4; i++) {
        if (userAnswers[i]) {
            localScores[userAnswers[i]]++;
        }
    }
    
    let topCluster = 'A';
    let maxScore = -1;
    for (const [cluster, score] of Object.entries(localScores)) {
        if (score > maxScore) {
            maxScore = score;
            topCluster = cluster;
        }
    }
    
    let explanation = categoryExplanations[catName][topCluster];
    let topClusterName = clusterMap[topCluster].name;
    let fullExplanationText = `${explanation} Because of these traits, the <strong>${topClusterName}</strong> domain cluster is highly suggested for you in this category.`;
    
    document.getElementById("questionContainer").classList.add("hidden");
    document.getElementById("nextBtn").classList.add("hidden");
    document.getElementById("prevBtn").classList.add("hidden");
    
    const resBox = document.getElementById("categoryResult");
    resBox.classList.remove("hidden");
    document.getElementById("categoryResultText").innerHTML = fullExplanationText;
}

function showRefinementStep() {
    document.getElementById("quizSection").classList.add("hidden");
    document.getElementById("refinementSection").classList.remove("hidden");

    let { processScores } = calculateWeightedScores();

    let topCluster = 'A';
    let maxScore = -1;
    for (const [cluster, score] of Object.entries(processScores)) {
        if (score > maxScore) {
            maxScore = score;
            topCluster = cluster;
        }
    }

    currentTopCluster = topCluster;
    const clusterInfo = clusterMap[topCluster];
    const grid = document.getElementById("refinementOptionsGrid");
    grid.innerHTML = "";
    
    document.getElementById("refinementText").innerHTML = `Based on your psychological dimensions, your highest weighted alignment is completely focused on <strong>${clusterInfo.name}</strong>. Within this cognitive field, there are specialized paths. We have 4 tie-breaker questions to figure out exactly which one is for you.`;
    
    // Render 4 Specific Mini-Questions
    const qs = refinementQuestionsLib[topCluster];
    refinementAnswers = {};
    
    qs.forEach((qData, qIndex) => {
        const card = document.createElement("div");
        card.style.marginBottom = "20px";
        card.style.textAlign = "left";
        card.innerHTML = `<h4 style="color:var(--neon-blue); margin-bottom: 10px;">${qData.q}</h4>`;
        
        const optionsDiv = document.createElement("div");
        optionsDiv.className = "options-grid";
        
        for (const [domainName, optionText] of Object.entries(qData.options)) {
            const label = document.createElement("label");
            label.className = "option-label";
            label.style.display = "block"; // Make stacking cleaner
            label.innerHTML = `<input type="radio" name="refineQ${qIndex}" value="${domainName}"> <strong>${optionText}</strong>`;
            label.onclick = () => {
                optionsDiv.querySelectorAll(".option-label").forEach(el => el.classList.remove("selected"));
                label.classList.add("selected");
                label.querySelector("input").checked = true;
                refinementAnswers[qIndex] = domainName;
            };
            optionsDiv.appendChild(label);
        }
        card.appendChild(optionsDiv);
        grid.appendChild(card);
    });
        
    const btn = document.getElementById("refinementSubmitBtn");
    if(btn) {
        btn.innerText = "Finalize Selection & See Results";
        btn.style.display = "inline-block";
    }
}

function submitRefinement() {
    const topCluster = currentTopCluster;
    const qsCount = refinementQuestionsLib[topCluster].length;
    if (Object.keys(refinementAnswers).length < qsCount) {
        alert("Please answer all 4 tie-breaker questions to proceed.");
        return;
    }
    
    // Tally answers
    let tallies = {};
    for (let answer of Object.values(refinementAnswers)) {
        answer = answer.trim();
        tallies[answer] = (tallies[answer] || 0) + 1;
    }
    
    let winner = null;
    let maxVotes = -1;
    for (const [dom, count] of Object.entries(tallies)) {
        if (count > maxVotes) {
            maxVotes = count;
            winner = dom;
        }
    }
    
    finalRefinedDomain = winner;
    showFinalResults();
}

function showFinalResults() {
    document.getElementById("refinementSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");

    const categories = ["Orientation", "Interest", "Aptitude"];
    let { processScores, clusterCategoryCounts } = calculateWeightedScores();
    
    const sortedClusters = Object.keys(processScores).sort((a, b) => processScores[b] - processScores[a]);
    
    // Max achievable score for a cluster is exactly 4 (100%).
    // 4 * (0.40 + 0.35 + 0.25) = 4 * 1.0 = 4.0.
    const MAX_SCORE = 4.0;
    
    const topScore = processScores[sortedClusters[0]];
    const secondScore = processScores[sortedClusters[1]];
    
    const topPercent = (topScore / MAX_SCORE) * 100;
    const secondPercent = (secondScore / MAX_SCORE) * 100;
    const diff = topPercent - secondPercent;
    
    let confidenceLevel = "Low Confidence";
    if (diff > 20) confidenceLevel = "High Confidence";
    else if (diff >= 10) confidenceLevel = "Medium Confidence";
    
    let primaryDomain = finalRefinedDomain || clusterMap[sortedClusters[0]].domains[0];
    
    let secondaryDomains = [];
    clusterMap[sortedClusters[0]].domains.forEach(d => {
        if (d !== primaryDomain) secondaryDomains.push(d);
    });
    clusterMap[sortedClusters[1]].domains.forEach(d => {
        if (d !== primaryDomain) secondaryDomains.push(d);
    });
    
    if(document.getElementById("primaryResultText")) {
        document.getElementById("primaryResultText").innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--neon-blue); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="color:var(--neon-blue); font-size: 1.5rem; margin-top: 0;">Primary Alignment: ${primaryDomain}</h3>
                <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">Confidence Score: <span style="color: #10b981;">${topPercent.toFixed(1)}%</span> <span style="font-size: 0.9rem; font-weight: normal; color: #9ca3af;">(${confidenceLevel})</span></p>
                <p style="margin-bottom: 0;"><strong>Secondary Alignments:</strong> ${secondaryDomains.join(', ')}</p>
            </div>
        `;
    }

    if (document.getElementById("resultChart")) {
        const categoryColors = {
            "Aptitude": "#3b82f6",     // 40%
            "Interest": "#10b981",     // 35%
            "Orientation": "#f59e0b"   // 25%
        };

        const chartDatasets = categories.map(cat => {
            return {
                label: cat + ` (${categoryWeights[cat]*100}%)`,
                data: sortedClusters.map(key => {
                    return (clusterCategoryCounts[key][cat] * categoryWeights[cat]);
                }),
                backgroundColor: categoryColors[cat],
                stack: 'Stack 0',
            };
        });

        const ctx = document.getElementById('resultChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedClusters.map(key => clusterMap[key].name),
                datasets: chartDatasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weighted Cluster Scores by Dimension',
                        color: 'white',
                        font: { size: 16 }
                    },
                    legend: { labels: { color: 'white' } },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toFixed(2) + ' weighted pts';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: { color: 'white' },
                        grid: { display: false }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 4,
                        ticks: { color: 'white' },
                        grid: { color: '#374151' }
                    }
                }
            }
        });
    }

    const linkContainer = document.getElementById("domainLinks");
    linkContainer.innerHTML = "";

    let listedDomains = [primaryDomain, ...secondaryDomains];
    
    listedDomains.forEach(domain => {
        const info = domainMap[domain];
        if (info) {
             linkContainer.innerHTML += `
                <a href="${info.link}" class="card" style="padding: 15px; text-decoration: none; color: white; display:flex; justify-content:space-between; align-items:center; border-left: 5px solid ${info.color}; margin-bottom: 10px;">
                    <span>Explore <strong>${domain}</strong></span>
                    <span style="background: ${info.color}; padding: 2px 8px; border-radius: 4px; color: black; font-weight: bold;">>&nbsp;</span>
                </a>
            `;
        }
    });

}

document.addEventListener("DOMContentLoaded", () => {
    activeCategory = -1; // Force the tab initialization to run
    switchTab(0);
});
