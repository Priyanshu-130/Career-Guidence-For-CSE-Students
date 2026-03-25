document.addEventListener("DOMContentLoaded", () => {
    const rawData = sessionStorage.getItem("quizResults");
    if (!rawData) {
        document.getElementById("primaryResultText").innerHTML = `<p style="color: red;">No quiz results found. Please take the quiz first.</p>`;
        return;
    }

    const data = JSON.parse(rawData);
    const track = data.track; // 'software' or 'hardware'
    const processScores = data.processScores;
    const clusterCategoryCounts = data.clusterCategoryCounts;

    const categoryWeights = {
        "Aptitude": 0.40,
        "Interest": 0.35,
        "Orientation": 0.25
    };

    const categories = ["Orientation", "Interest", "Aptitude"];
    const categoryColors = { "Aptitude": "#3b82f6", "Interest": "#10b981", "Orientation": "#f59e0b" };

    let clusterMap = {};
    let domainMap = {};

    if (track === "software") {
        document.getElementById("resultHeading").style.color = "var(--neon-blue)";
        clusterMap = {
            A: { name: "AI & Intelligence", domains: ["Artificial Intelligence", "Machine Learning", "Deep Learning"], colors: ["#3b82f6", "#14b8a6", "#1e40af"] },
            B: { name: "Data & Analytics", domains: ["Data Science"], colors: ["#10b981"] },
            C: { name: "Product Development", domains: ["Web / App Development", "Game Development"], colors: ["#f59e0b", "#f97316"] },
            D: { name: "Security & Trust", domains: ["Cyber Security", "Blockchain"], colors: ["#ef4444", "#6366f1"] },
            E: { name: "Cloud Infrastructure", domains: ["Cloud Computing"], colors: ["#8b5cf6"] }
        };
        domainMap = {
            "Artificial Intelligence": { link: "domain_ai.html", color: "#3b82f6" },
            "Data Science": { link: "domain_data.html", color: "#10b981" },
            "Web / App Development": { link: "domain_web.html", color: "#f59e0b" },
            "Cyber Security": { link: "domain_security.html", color: "#ef4444" },
            "Cloud Computing": { link: "domain_cloud.html", color: "#8b5cf6" },
            "Blockchain": { link: "domain_blockchain.html", color: "#6366f1" },
            "Game Development": { link: "domain_game.html", color: "#f97316" },
            "Machine Learning": { link: "domain_ml.html", color: "#14b8a6" },
            "Deep Learning": { link: "domain_dl.html", color: "#1e40af" }
        };
    } else {
        document.getElementById("resultHeading").style.color = "var(--neon-purple)";
        clusterMap = {
            A: { name: "IoT & Embedded", domains: ["IoT & Embedded Systems"], colors: ["#ec4899"] },
            B: { name: "Robotics & Automation", domains: ["Robotics & Automation"], colors: ["#8b5cf6"] },
            C: { name: "VLSI & Architecture", domains: ["VLSI & Computer Architecture"], colors: ["#3b82f6"] },
            D: { name: "Networking & Communication", domains: ["Networking & Communication Systems"], colors: ["#10b981"] }
        };
        domainMap = {
            "IoT & Embedded Systems": { link: "domain_iot.html", color: "#ec4899" },
            "Robotics & Automation": { link: "domain_robotics.html", color: "#8b5cf6" },
            "VLSI & Computer Architecture": { link: "domain_vlsi.html", color: "#3b82f6" },
            "Networking & Communication Systems": { link: "domain_networking.html", color: "#10b981" }
        };
    }

    const comparisonData = {
        "Artificial Intelligence": { type: "Software", focus: "Simulating human intelligence", difficulty: "Hard", workStyle: "Logical & Mathematical", skills: "Mathematics, Algorithms, Logic", tools: "Python, TensorFlow, PyTorch", projects: "Chatbot, Pathfinding AI", roles: "AI Engineer, Research Scientist", scope: "Extremely High" },
        "Machine Learning": { type: "Software", focus: "Building systems that learn from data", difficulty: "Hard", workStyle: "Logical & Data-centric", skills: "Statistics, Data Modeling", tools: "Scikit-Learn, Keras", projects: "Price Predictor, Recommendation System", roles: "ML Engineer, Data Scientist", scope: "Very High" },
        "Deep Learning": { type: "Software", focus: "Neural nets & complex pattern recognition", difficulty: "Hard", workStyle: "Logical & Analytical", skills: "Advanced Math, Neural Nets", tools: "PyTorch, CUDA", projects: "Image Optimizer, Voice Recognition", roles: "Research Engineer, DL Spec", scope: "High" },
        "Data Science": { type: "Software", focus: "Extracting insights from complex datasets", difficulty: "Medium", workStyle: "Analytical & Business-oriented", skills: "SQL, Python, Data Viz", tools: "Pandas, Tableau, Jupyter", projects: "Sales Dashboard, Clustering", roles: "Data Scientist, Data Analyst", scope: "Very High" },
        "Web / App Development": { type: "Software", focus: "Building interactive digital platforms", difficulty: "Medium", workStyle: "Creative & Hands-on", skills: "UI/UX, Frontend/Backend Logic", tools: "React, Node.js, Flutter", projects: "E-Commerce Site, Task Tracker App", roles: "Full-Stack Dev, Mobile Dev", scope: "High & Stable" },
        "Game Development": { type: "Software", focus: "Creating interactive entertainment", difficulty: "Medium", workStyle: "Creative & System-based", skills: "C++, C#, 3D Math, Physics", tools: "Unity, Unreal Engine", projects: "2D Platformer, Multiplayer Arena", roles: "Game Programmer, Tech Artist", scope: "High" },
        "Cyber Security": { type: "Software", focus: "Protecting systems & networks from threats", difficulty: "Hard", workStyle: "System-based & Analytical", skills: "Networking, Cryptography", tools: "Wireshark, Kali Linux", projects: "Vulnerability Scanner, Keylogger", roles: "Security Analyst, Pen Tester", scope: "Very High" },
        "Blockchain": { type: "Software", focus: "Decentralized ledgers & smart contracts", difficulty: "Hard", workStyle: "Logical & System-based", skills: "Cryptography, Decentralized Arch", tools: "Solidity, Web3.js, Ethereum", projects: "Crypto Token, DApp Voting", roles: "Blockchain Dev, Smart Contract Eng", scope: "High" },
        "Cloud Computing": { type: "Software", focus: "Deploying & scaling infrastructure online", difficulty: "Medium", workStyle: "System-based & Logical", skills: "Server Management, CI/CD", tools: "AWS, Azure, Docker, Kubernetes", projects: "Serverless API, Scalable Web Hosting", roles: "Cloud Engineer, DevOps Spec", scope: "Very High" },
        "IoT & Embedded Systems": { type: "Hardware", focus: "Connecting physical devices to the internet", difficulty: "Medium", workStyle: "Hands-on & System-based", skills: "C/C++, Microcontrollers", tools: "Arduino, Raspberry Pi", projects: "Smart Sensor, Weather Station", roles: "IoT Developer, Embedded Eng", scope: "High" },
        "Robotics & Automation": { type: "Hardware", focus: "Designing building autonomous robots", difficulty: "Hard", workStyle: "Hands-on & Logical", skills: "Control Systems, Kinematics", tools: "ROS, Sensors, Actuators", projects: "Line Follower, Robotic Arm", roles: "Robotics Engineer, Automation Spec", scope: "High" },
        "VLSI & Computer Architecture": { type: "Hardware", focus: "Designing integrated circuits & microchips", difficulty: "Hard", workStyle: "Logical & System-based", skills: "Digital Logic, FPGA, HDL", tools: "Verilog, Cadence, VHDL", projects: "ALU Design, Custom Processor", roles: "VLSI Design Eng, Verification Eng", scope: "High" },
        "Networking & Communication Systems": { type: "Hardware", focus: "Building and managing data networks", difficulty: "Medium", workStyle: "System-based & Hands-on", skills: "Routing, Protocols, Net Security", tools: "Cisco Tracer, Wireshark", projects: "Topology Design, VPN Server", roles: "Network Eng, Telecom Eng", scope: "Stable & Essential" }
    };

    const sortedClusters = Object.keys(processScores).sort((a, b) => processScores[b] - processScores[a]);
    
    // Total score calculation across all domains
    const totalScore = Object.values(processScores).reduce((sum, score) => sum + score, 0);

    // Edge Case 2: Zero total score
    if (totalScore === 0 || isNaN(totalScore)) {
        document.getElementById("primaryResultText").innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; text-align: center;">
                <h3 style="color: #ef4444; margin-top: 0;">Please complete the quiz to get recommendations.</h3>
                <p>No valid answers were recorded.</p>
                <a href="quiz.html" class="btn">Retake Quiz</a>
            </div>
        `;
        document.getElementById("chartContainer").style.display = "none";
        document.getElementById("domainLinks").style.display = "none";
        return;
    }

    const topScore = processScores[sortedClusters[0]];
    const secondScore = processScores[sortedClusters[1]];
    
    const confidence = (topScore / totalScore) * 100;

    let primaryDomain = clusterMap[sortedClusters[0]].domains[0];
    let secondaryDomain = clusterMap[sortedClusters[1]].domains[0];

    // Some software clusters have multiple domains, if they tied inside cluster, we can't easily compare,
    // so we compare the primary of top cluster and primary of 2nd cluster, which perfectly covers Top 2 domains.

    const themeColor = track === "software" ? "var(--neon-blue)" : "var(--neon-purple)";
    const themeHighlight = track === "software" ? "#10b981" : "#8b5cf6"; 
    const bgStyle = track === "software" ? "rgba(16, 185, 129, 0.1)" : "rgba(139, 92, 246, 0.1)";

    const primaryResultContainer = document.getElementById("primaryResultText");
    const linkContainer = document.getElementById("domainLinks");

    // Edge Case 1: All domains have equal scores 
    // This happens if the top score is equal to the least score (score distribution is totally uniform)
    // Or practically, we compare top 2 and if they are equal, it's a tie. User said:
    // "All domains have equal scores -> Show comparison -> Add message: Your interests are equally distributed"
    const minScore = processScores[sortedClusters[sortedClusters.length - 1]];
    const allEqual = topScore === minScore && totalScore > 0;

    let resultHTML = "";
    
    if (allEqual || topScore === secondScore) {
        // Tied condition
        resultHTML = `
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: #f59e0b; margin-top: 0;">Your interests are equally distributed across multiple domains.</h3>
                <p>Compare the top options to decide.</p>
            </div>
        `;
    } else if (confidence >= 40) {
        // Single Domain UI (High Confidence)
        const dInfo = comparisonData[primaryDomain];
        let reasonStr = `You prefer working with ${dInfo.workStyle.toLowerCase()} patterns, which strongly aligns with ${primaryDomain}.`;
        
        resultHTML = `
            <div style="background: ${bgStyle}; border: 1px solid ${themeColor}; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                <h2 style="color:${themeColor}; margin-top: 0; font-size: 2rem;">Recommended: ${primaryDomain}</h2>
                <div style="font-size: 3rem; font-weight: bold; color: ${themeHighlight}; margin-bottom: 10px; text-shadow: 0 0 10px ${themeHighlight};">
                    ${confidence.toFixed(1)}% Match
                </div>
                <p style="font-size: 1.1rem; max-width: 600px; margin: 0 auto 25px; color: var(--text-primary);">${reasonStr}</p>
                <div style="margin-top: 20px;">
                    <a href="${domainMap[primaryDomain].link}" class="btn" style="background: ${themeColor}; color: black; border-color: ${themeColor}; margin: 10px;">Explore Domain</a>
                    <a href="${domainMap[primaryDomain].link.replace('domain_', 'roadmap_')}" class="btn" style="background: rgba(255,255,255,0.1); color: white; border-color: white; margin: 10px;">Roadmap & Resources</a>
                </div>
            </div>
        `;
    } else {
        // Low Confidence -> Domain Comparison UI
        resultHTML = `
            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: #ef4444; margin-top: 0;">Your interests are distributed across multiple domains.</h3>
                <p>Compare the top options to decide.</p>
            </div>
        `;
    }

    if (allEqual || topScore === secondScore || confidence < 40) {
        // Render comparison table
        const d1 = comparisonData[primaryDomain] || { type: "-", focus: "-", difficulty: "-", workStyle: "-", skills: "-", tools: "-", projects: "-", roles: "-", scope: "-" };
        const d2 = comparisonData[secondaryDomain] || { type: "-", focus: "-", difficulty: "-", workStyle: "-", skills: "-", tools: "-", projects: "-", roles: "-", scope: "-" };
        const link1 = domainMap[primaryDomain]?.link || "#";
        const link2 = domainMap[secondaryDomain]?.link || "#";
        const color1 = domainMap[primaryDomain]?.color || "#fff";
        const color2 = domainMap[secondaryDomain]?.color || "#fff";

        resultHTML += `
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
                <div class="card" style="flex: 1; min-width: 300px; text-align: center; border-color: ${color1}; border-top-width: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <h3 style="color: ${color1}; font-size: 1.5rem; margin-top: 10px;">${primaryDomain}</h3>
                    <p style="color: var(--text-accent); margin-bottom: 20px; font-style: italic;">${d1.focus}</p>
                    <ul style="list-style: none; padding: 0; text-align: left; margin-bottom: 20px; color: #d1d5db;">
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Type:</strong> ${d1.type}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Difficulty:</strong> ${d1.difficulty}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Work Style:</strong> ${d1.workStyle}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Skills:</strong> ${d1.skills}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Tools:</strong> ${d1.tools}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Projects:</strong> ${d1.projects}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Roles:</strong> ${d1.roles}</li>
                        <li style="padding: 10px 0;"><strong>Scope:</strong> ${d1.scope}</li>
                    </ul>
                    <a href="${link1}" class="btn" style="width: 80%; box-sizing: border-box; display: block; margin: 0 auto 10px; background: ${color1}; color: black; border-color:${color1};">Choose This Domain</a>
                    <a href="${link1.replace('domain_', 'roadmap_')}" class="btn-secondary" style="width: 80%; box-sizing: border-box; display: block; margin: 0 auto; color: ${color1}; border-color:${color1};">Roadmap & Resources</a>
                </div>
                
                <div class="card" style="flex: 1; min-width: 300px; text-align: center; border-color: ${color2}; border-top-width: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <h3 style="color: ${color2}; font-size: 1.5rem; margin-top: 10px;">${secondaryDomain}</h3>
                    <p style="color: var(--text-accent); margin-bottom: 20px; font-style: italic;">${d2.focus}</p>
                    <ul style="list-style: none; padding: 0; text-align: left; margin-bottom: 20px; color: #d1d5db;">
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Type:</strong> ${d2.type}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Difficulty:</strong> ${d2.difficulty}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Work Style:</strong> ${d2.workStyle}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Skills:</strong> ${d2.skills}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Tools:</strong> ${d2.tools}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Projects:</strong> ${d2.projects}</li>
                        <li style="padding: 10px 0; border-bottom: 1px solid var(--border-color);"><strong>Roles:</strong> ${d2.roles}</li>
                        <li style="padding: 10px 0;"><strong>Scope:</strong> ${d2.scope}</li>
                    </ul>
                    <a href="${link2}" class="btn" style="width: 80%; box-sizing: border-box; display: block; margin: 0 auto 10px; background: ${color2}; color: black; border-color:${color2};">Choose This Domain</a>
                    <a href="${link2.replace('domain_', 'roadmap_')}" class="btn-secondary" style="width: 80%; box-sizing: border-box; display: block; margin: 0 auto; color: ${color2}; border-color:${color2};">Roadmap & Resources</a>
                </div>
            </div>
            <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #9ca3af; margin-bottom: 15px; font-size: 1.1rem;">Still confused? Try beginner projects from both domains before deciding.</p>
                <a href="quiz.html" class="btn-secondary" style="font-size: 0.9rem; padding: 8px 16px;">Retake Quiz</a>
            </div>
        `;
        linkContainer.style.display = 'none'; // hide the old generic list if comparison is open
    } else {
        // High confidence: showing the single main domain card
        // Below it, show other possibilities for exploring if user wants
        linkContainer.style.display = 'flex';
        linkContainer.innerHTML = `<h3 style="margin-top: 10px; margin-bottom: 20px; color: white;">Other Top Matches</h3>`;
        
        let secondaryDomains = [];
        if (track === "software") {
            clusterMap[sortedClusters[0]].domains.forEach(d => { if (d !== primaryDomain) secondaryDomains.push(d); });
            clusterMap[sortedClusters[1]].domains.forEach(d => { if (d !== primaryDomain) secondaryDomains.push(d); });
        } else {
            secondaryDomains.push(clusterMap[sortedClusters[1]].domains[0]);
        }
        
        // Remove primary from secondary if duplicate, technically it is already protected by condition
        [...secondaryDomains].forEach(domain => {
            const info = domainMap[domain];
            if (info) {
                 linkContainer.innerHTML += `
                    <a href="${info.link}" class="card" style="padding: 15px; text-decoration: none; color: white; display:flex; justify-content:space-between; align-items:center; border-left: 5px solid ${info.color}; margin: 5px 0;">
                        <span>Explore <strong>${domain}</strong></span>
                        <span style="background: ${info.color}; padding: 2px 8px; border-radius: 4px; color: black; font-weight: bold;">>&nbsp;</span>
                    </a>
                `;
            }
        });
    }

    primaryResultContainer.innerHTML = resultHTML;

    // Draw Chart
    const chartDatasets = categories.map(cat => ({
        label: cat + ` (${categoryWeights[cat]*100}%)`,
        data: sortedClusters.map(key => (clusterCategoryCounts[key][cat] * categoryWeights[cat])),
        backgroundColor: categoryColors[cat],
        stack: 'Stack 0',
    }));
    
    const ctx = document.getElementById('resultChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: { labels: sortedClusters.map(key => clusterMap[key].name), datasets: chartDatasets },
        options: { 
            responsive: true, 
            plugins: { 
                title: { display: true, text: `Weighted ${track === 'software' ? 'Software' : 'Hardware'} Scores`, color: 'white', font: { size: 16 } }, 
                legend: { labels: { color: 'white' } } 
            }, 
            scales: { 
                x: { stacked: true, ticks: { color: 'white' } }, 
                y: { stacked: true, max: 4, ticks: { color: 'white' }, grid: { color: '#374151' } } 
            } 
        }
    });

});
