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

    const sortedClusters = Object.keys(processScores).sort((a, b) => processScores[b] - processScores[a]);
    const MAX_SCORE = 4.0;
    const topScore = processScores[sortedClusters[0]];
    const secondScore = processScores[sortedClusters[1]];
    const topPercent = (topScore / MAX_SCORE) * 100;
    const secondPercent = (secondScore / MAX_SCORE) * 100;
    const diff = topPercent - secondPercent;
    
    let confidenceLevel = diff > 20 ? "High Confidence" : (diff >= 10 ? "Medium Confidence" : "Low Confidence");
    
    let primaryDomain = clusterMap[sortedClusters[0]].domains[0];
    let secondaryDomains = [];
    
    if (track === "software") {
        clusterMap[sortedClusters[0]].domains.forEach(d => { if (d !== primaryDomain) secondaryDomains.push(d); });
        clusterMap[sortedClusters[1]].domains.forEach(d => { if (d !== primaryDomain) secondaryDomains.push(d); });
    } else {
        secondaryDomains.push(clusterMap[sortedClusters[1]].domains[0]);
    }
    
    const themeColor = track === "software" ? "var(--neon-blue)" : "var(--neon-purple)";
    const themeHighlight = track === "software" ? "#10b981" : "#8b5cf6"; // Green for software, purple for hardware

    const bgStyle = track === "software" ? "rgba(16, 185, 129, 0.1)" : "rgba(139, 92, 246, 0.1)";

    document.getElementById("primaryResultText").innerHTML = `
        <div style="background: ${bgStyle}; border: 1px solid ${themeColor}; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color:${themeColor}; font-size: 1.5rem; margin-top: 0;">Primary Match: ${primaryDomain}</h3>
            <p style="font-size: 1.2rem; font-weight: bold; margin-bottom: 10px;">Confidence Score: <span style="color: ${themeHighlight};">${topPercent.toFixed(1)}%</span> <span style="font-size: 0.9rem; font-weight: normal; color: #9ca3af;">(${confidenceLevel})</span></p>
            <p style="margin-bottom: 0;"><strong>Secondary Matches:</strong> ${secondaryDomains.join(', ')}</p>
        </div>
    `;

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

    const linkContainer = document.getElementById("domainLinks");
    linkContainer.innerHTML = "";
    [primaryDomain, ...secondaryDomains].forEach(domain => {
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
});
