const questions = [
    {
        q: "1. When solving problems, I prefer:",
        options: {
            A: "Mathematical modeling",
            B: "Analyzing data patterns",
            C: "Building usable interfaces",
            D: "Finding system loopholes",
            E: "Designing system architecture",
            F: "Working with devices",
            G: "Designing decentralized systems",
            H: "Creating interactive worlds",
            I: "Predicting future trends",
            J: "Mimicking human brain"
        }
    },
    {
        q: "2. What excites you most?",
        options: {
            A: "Intelligent machines",
            B: "Data insights",
            C: "Interactive applications",
            D: "Breaking security challenges",
            E: "Scalable infrastructure",
            F: "Smart gadgets",
            G: "Crypto technologies",
            H: "Video games/Simulations",
            I: "Automated predictions",
            J: "Generative AI (ChatGPT)"
        }
    },
    {
        q: "3. If given free time, you would:",
        options: {
            A: "Train a model",
            B: "Analyze dataset",
            C: "Build a website",
            D: "Test vulnerabilities",
            E: "Setup servers",
            F: "Build electronics project",
            G: "Explore crypto tools",
            H: "Design a game level",
            I: "Study algorithms",
            J: "Read AI research papers"
        }
    },
    {
        q: "4. You prefer working on:",
        options: {
            A: "Algorithms",
            B: "Reports",
            C: "Apps",
            D: "Security systems",
            E: "Infrastructure",
            F: "Smart devices",
            G: "Blockchain apps",
            H: "Game mechanics",
            I: "Statistical models",
            J: "Neural networks"
        }
    },
    {
        q: "5. You are most comfortable with:",
        options: {
            A: "Mathematics",
            B: "Statistics",
            C: "UI/UX",
            D: "Risk analysis",
            E: "Networking",
            F: "Sensors",
            G: "Cryptography",
            H: "Physics/Geometry",
            I: "Probability",
            J: "Calculus/Tensors"
        }
    },
    {
        q: "6. Which gives more satisfaction?",
        options: {
            A: "Improving model accuracy",
            B: "Deriving insights",
            C: "Launching product",
            D: "Securing system",
            E: "Scaling servers",
            F: "Automating real-world system",
            G: "Deploying smart contract",
            H: "Player engagement",
            I: "High prediction accuracy",
            J: "AI fooling a human"
        }
    },
    {
        q: "7. You enjoy debugging:",
        options: {
            A: "Model convergence",
            B: "Data inconsistencies",
            C: "UI bugs",
            D: "Security flaws",
            E: "Deployment failures",
            F: "Hardware issues",
            G: "Smart contracts",
            H: "Glitchy physics",
            I: "Overfitting models",
            J: "Vanishing gradients"
        }
    },
    {
        q: "8. You feel proud when:",
        options: {
            A: "AI beats benchmark",
            B: "Dashboard influences decisions",
            C: "App gets users",
            D: "System becomes secure",
            E: "Cloud handles load",
            F: "Device works automatically",
            G: "DApp goes live",
            H: "Game is fun to play",
            I: "Model predicts real events",
            J: "AI generates art/text"
        }
    },
    {
        q: "9. Your thinking style is:",
        options: {
            A: "Mathematical",
            B: "Analytical",
            C: "Practical",
            D: "Defensive",
            E: "Structural",
            F: "Experimental",
            G: "Distributed",
            H: "Creative & Logical",
            I: "Statistical",
            J: "Abstract & Deep"
        }
    },
    {
        q: "10. You enjoy learning about:",
        options: {
            A: "Neural networks",
            B: "Statistical models",
            C: "Web frameworks",
            D: "Cyber threats",
            E: "Cloud tools",
            F: "Embedded systems",
            G: "Consensus algorithms",
            H: "Game engines (Unity)",
            I: "Data patterns",
            J: "Cognitive science"
        }
    }
];

let currentQuestion = 0;
let userAnswers = {}; // Store answers as { qIndex: "A" }

function loadQuestion(index) {
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

    // Update UI
    document.getElementById("currentQNum").innerText = index + 1;
    document.getElementById("progressFill").style.width = ((index + 1) / questions.length) * 100 + "%";

    document.getElementById("prevBtn").disabled = index === 0;

    if (index === questions.length - 1) {
        document.getElementById("nextBtn").innerText = "Finish";
        document.getElementById("nextBtn").classList.add("btn-secondary"); // Change style for finish
    } else {
        document.getElementById("nextBtn").innerText = "Next";
        document.getElementById("nextBtn").classList.remove("btn-secondary");
    }
}

function selectOption(label, qIndex, value) {
    // Visually select
    document.querySelectorAll(".option-label").forEach(el => el.classList.remove("selected"));
    label.classList.add("selected");

    // Check radio
    label.querySelector("input").checked = true;

    // Save answer
    userAnswers[qIndex] = value;
}

function nextQuestion() {
    // Check if answered
    if (!userAnswers[currentQuestion]) {
        alert("Please select an option.");
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        showResults();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
}

function showResults() {
    document.getElementById("quizSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");

    // Calculate Scores
    let scores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0 };
    Object.values(userAnswers).forEach(val => scores[val]++);

    const domainMap = {
        A: { name: "AI General", link: "domain_ai.html", color: "#3b82f6" },
        B: { name: "Data Science", link: "domain_data.html", color: "#10b981" },
        C: { name: "Web/App Dev", link: "domain_web.html", color: "#f59e0b" },
        D: { name: "Cyber Security", link: "domain_security.html", color: "#ef4444" },
        E: { name: "Cloud & DevOps", link: "domain_cloud.html", color: "#8b5cf6" },
        F: { name: "IoT & Embedded", link: "domain_iot.html", color: "#ec4899" },
        G: { name: "Blockchain", link: "domain_blockchain.html", color: "#6366f1" },
        H: { name: "Game Dev", link: "domain_game.html", color: "#f97316" },
        I: { name: "Machine Learning", link: "domain_ml.html", color: "#14b8a6" },
        J: { name: "Deep Learning", link: "domain_dl.html", color: "#1e40af" }
    };

    // Prepare Chart Data
    const labels = Object.keys(scores).map(key => domainMap[key].name);
    const data = Object.values(scores);
    const colors = Object.keys(scores).map(key => domainMap[key].color);

    // Render Chart
    const ctx = document.getElementById('resultChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Domain Affinity Score',
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'white' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: 'white' }
                }
            },
            plugins: {
                legend: { labels: { color: 'white' } }
            }
        }
    });

    // Generate ranked links
    const sortedKeys = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const linkContainer = document.getElementById("domainLinks");
    linkContainer.innerHTML = "";

    sortedKeys.forEach(key => {
        if (scores[key] > 0) { // Only show relevant ones
            const info = domainMap[key];
            linkContainer.innerHTML += `
                <a href="${info.link}" class="card" style="padding: 15px; text-decoration: none; color: white; display:flex; justify-content:space-between; align-items:center; border-left: 5px solid ${info.color}">
                    <span>${info.name}</span>
                    <span style="background: ${info.color}; padding: 2px 8px; border-radius: 4px; color: black; font-weight: bold;">${scores[key]} pts</span>
                </a>
            `;
        }
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("totalQuestions").innerText = questions.length;
    loadQuestion(0);
});
