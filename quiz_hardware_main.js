const questions = [
    // --- ORIENTATION (10 Questions: Mindset & How You Approach Life) ---
    { category: "Orientation", q: "1. When you look at an everyday object like a fridge or a watch, you wonder:", options: { A: "'Can I connect this to my phone so it sends me notifications?'", B: "'How do the physical gears and motors inside actually move?'", C: "'What does the tiny digital chip inside look like?'", D: "'How does this constantly talk to the internet without a wire?'" } },
    { category: "Orientation", q: "2. Your ideal workspace involves:", options: { A: "Making normal household items 'smart' by adding tiny sensors.", B: "Working with metal parts, wheels, and physical moving machines.", C: "Looking at microscopic electricity flow on a tiny silicon board.", D: "Hooking up millions of cables to make sure the internet never goes down." } },
    { category: "Orientation", q: "3. If you had to build a fun project this weekend, you'd choose:", options: { A: "A tiny sensor that waters your house-plants automatically.", B: "A remote-controlled car that you build completely from scratch.", C: "A confusing puzzle of electrical logic gates on a breadboard.", D: "Setting up a super-fast, private gaming network for your bedroom." } },
    { category: "Orientation", q: "4. You believe the most impactful technology is technology that:", options: { A: "Brings dead objects to life by connecting them to an app.", B: "Can physically do hard, dangerous manual labor instead of humans.", C: "Can process billions of math problems on a chip the size of a coin.", D: "Can seamlessly connect humans across the entire planet instantly." } },
    { category: "Orientation", q: "5. When fixing a broken machine, your first instinct is to:", options: { A: "Check if the battery is dead or if it disconnected from Bluetooth.", B: "Check if a physical gear is jammed or a wire is snapped.", C: "Check if the motherboard got fried by too much electricity.", D: "Check if the router is broken and trace the cable to the wall." } },
    { category: "Orientation", q: "6. A really successful day for you feels like:", options: { A: "Your custom plant monitor successfully sent a text to your phone.", B: "Your physical drone hovered perfectly stable without crashing.", C: "You figured out how memory and logic work together perfectly in a chip.", D: "You finally figured out why your house Wi-Fi kept dropping out." } },
    { category: "Orientation", q: "7. You would rather completely master:", options: { A: "How to program tiny cheap computer chips to be 'smart'.", B: "How to make a machine physically run, walk, or fly safely.", C: "How electricity physically turns into 1s and 0s inside a processor.", D: "How the entire world's internet cables are connected under the ocean." } },
    { category: "Orientation", q: "8. When someone shows you a new gadget, your brain immediately:", options: { A: "Wonders how it can send its data to a nice app on your phone.", B: "Wonders what physical forces are turning its moving parts.", C: "Wonders exactly how its core brain (the processor) works.", D: "Wonders exactly how it sends its radio signals through the air." } },
    { category: "Orientation", q: "9. You would describe your main career motivation as:", options: { A: "Wiring the entire physical world into a smart, interconnected web.", B: "Creating robot helpers that can physically navigate the real world.", C: "Making computers faster, smaller, and significantly more powerful.", D: "Building the invisible data highways that let people communicate." } },
    { category: "Orientation", q: "10. In a group project involving hardware, you are best at:", options: { A: "Tying everything together so it can be controlled by a phone.", B: "Screwing the moving pieces together so it acts like a real vehicle.", C: "Making sure the battery voltage is correct so nothing catches on fire.", D: "Making sure the radio antennas are correctly pointed so it doesn't lose signal." } },

    // --- INTEREST (10 Questions: Hobbies & Passions) ---
    { category: "Interest", q: "11. The tech news headline you would immediately click is:", options: { A: "'New smart-city streetlights drastically reduce energy waste!'", B: "'New autonomous factory robots completely change how things are built!'", C: "'Revolutionary new computer chip is smaller than a grain of rice!'", D: "'New internet technology makes global downloading 100 times faster!'" } },
    { category: "Interest", q: "12. In your free time, you prefer exploring:", options: { A: "Watching videos about crazy 'Smart Home' setups.", B: "Watching Boston Dynamics videos of robots doing backflips.", C: "Watching videos of how classic retro video game consoles pull off graphics.", D: "Watching videos about how undersea cables power the global internet." } },
    { category: "Interest", q: "13. The hardware feature you find the absolute coolest is:", options: { A: "A smartwatch that accurately tracks your heartbeat while you sleep.", B: "A mechanical arm that can catch a fast-moving ball in mid-air.", C: "A microscopic processing core operating perfectly without melting.", D: "A massive satellite dish that talks to the Space Station." } },
    { category: "Interest", q: "14. A genie grants you one skill instantly. You choose to be a master of:", options: { A: "Designing completely futuristic smart-houses.", B: "Designing life-like physical humanoid robots.", C: "Designing the fastest computing chips in the world.", D: "Securing and speeding up the world's telecommunications." } },
    { category: "Interest", q: "15. The documentary you'd most want to watch tonight is about:", options: { A: "How smart devices like Alexa are changing modern living.", B: "The intense engineering behind NASA's Mars Rovers.", C: "Inside a multi-billion dollar factory that builds silicon chips.", D: "The secret engineering of the world’s largest internet data centers." } },
    { category: "Interest", q: "16. When examining an old broken toy, you immediately:", options: { A: "Wonder if you can take its buttons and wire them to your computer.", B: "Look at its hinges and joints to see how it used to walk.", C: "Wonder what specific circuit board is hidden under the plastic.", D: "Look for its antenna to check how the remote control sent signals." } },
    { category: "Interest", q: "17. The industry you'd most like to work in is:", options: { A: "Smart Agriculture and remote medical monitoring devices.", B: "Space exploration, automated delivery flying drones, and self-driving cars.", C: "Building parts for PlayStation, Xbox, or Apple iPhones.", D: "Global satellite communication and 6G cellular networks." } },
    { category: "Interest", q: "18. Your favorite type of college project would be:", options: { A: "A smart mirror that displays the weather and connects to Spotify.", B: "A small motorized robot car that avoids walls on its own.", C: "Taking apart an old calculator to see exactly how it adds numbers.", D: "Setting up a private, securely encrypted walkie-talkie network." } },
    { category: "Interest", q: "19. The social media accounts you enjoy following most are:", options: { A: "Tech reviewers who show off the newest smart gadgets.", B: "People building crazy 3D printed mechanical robot arms.", C: "Computer nerds who build custom, water-cooled gaming PCs.", D: "Tech experts explaining how 5G towers and the internet work." } },
    { category: "Interest", q: "20. The most exciting 'future tech' concept to you is:", options: { A: "A world where every single physical object connects to the internet.", B: "A world where human labor is entirely replaced by humanoid machines.", C: "A world where computers become so tiny they fit inside human blood.", D: "A world with instantaneous, zero-latency internet everywhere on Earth." } },

    // --- APTITUDE (10 Questions: Natural Skills & Talents) ---
    { category: "Aptitude", q: "21. You naturally grasp this concept incredibly fast:", options: { A: "How a tiny thermometer sensor reads a room and sends an alert.", B: "Physics, gravity, friction, and how things physically balance.", C: "Logic puzzles involving AND, OR, and NOT gates.", D: "How the mail system routes letters from one city to another." } },
    { category: "Aptitude", q: "22. The \"boring\" task you can actually happily do for hours is:", options: { A: "Troubleshooting why your smart TV won't sync with your phone.", B: "Calibrating a physical 3D printer until it prints perfectly without stringing.", C: "Looking at a huge diagram of electrical wires to find one mistake.", D: "Testing every single Wi-Fi channel to find the one with the least lag." } },
    { category: "Aptitude", q: "23. When building a physical project, your brain excels at:", options: { A: "Programming a tiny cheap chip to do one specific task repeatedly.", B: "Translating math into physical motor movements.", C: "Structuring hundreds of logic gates into a working calculator.", D: "Figuring out the absolute fastest path a signal can travel." } },
    { category: "Aptitude", q: "24. If a huge system suddenly breaks, you intuitively know how to:", options: { A: "Check if the power died or if it disconnected from the Cloud.", B: "Check the physical gears to see if something is jammed.", C: "Check if it short-circuited or if a wire was plugged deeply wrong.", D: "Check the router and trace exactly where the internet signal dropped." } },
    { category: "Aptitude", q: "25. You are naturally very good at spotting:", options: { A: "Why a tiny device's battery is dying way too fast.", B: "Physical imbalances or inefficiencies in how a machine moves.", C: "A poorly optimized logic path that slows down a computer's \"brain\".", D: "A bottleneck in how data travels physically from point A to point B." } },
    { category: "Aptitude", q: "26. You find it incredibly easy to learn:", options: { A: "How to use tiny cheap computers like Arduinos or Raspberry Pis.", B: "How to 3D model physical parts in software like AutoCAD or Blender.", C: "How binary numbers (101010) actually represent real math.", D: "How an IP Address works and what a Router actually does." } },
    { category: "Aptitude", q: "27. Your memory works best when you are:", options: { A: "Visualizing an app that turns on real-world lights.", B: "Visualizing how a physical machine's gears will turn.", C: "Visualizing the exact layout of a tiny green circuit board.", D: "Visualizing exactly how a text message bounces from tower to tower." } },
    { category: "Aptitude", q: "28. People often ask for your help when they need to:", options: { A: "Make a random old device connect to their phone or Bluetooth.", B: "Fix a drone, RC car, or toy that isn't moving right.", C: "Understand how electricity actually turns into a video game on a screen.", D: "Fix their completely broken Wi-Fi router or home internet speed." } },
    { category: "Aptitude", q: "29. When looking at a huge machine, you naturally want to:", options: { A: "Find the button that lets it talk to the internet.", B: "Find the main motors that do the heavy lifting.", C: "Find the 'brain' board that controls all the logic.", D: "Find the communication ports where all the cables plug in." } },
    { category: "Aptitude", q: "30. The feeling of ultimate satisfaction for you comes from:", options: { A: "Seeing a tiny sensor successfully send data to your phone perfectly.", B: "Watching a robot you built autonomously avoid crashing into a wall.", C: "Designing an impeccably fast and powerful digital processor chip.", D: "Watching your custom internet cables route data globally at light speed." } }
];

let currentQuestion = 0;
let userAnswers = {};
let activeCategory = 0;
let completedCategories = new Set();
let currentTopCluster = null;

const categoryWeights = {
    "Aptitude": 0.40,
    "Interest": 0.35,
    "Orientation": 0.25
};

function switchTab(tabIndex) {
    if (activeCategory === tabIndex && currentQuestion !== tabIndex * 10 && currentQuestion !== 0) return;
    
    document.querySelectorAll(".tab-btn").forEach((btn, idx) => {
        if (idx === tabIndex) btn.classList.add("active");
        else btn.classList.remove("active");
    });
    activeCategory = tabIndex;
    
    let startQ = tabIndex * 10;
    
    document.getElementById("questionContainer").classList.remove("hidden");
    document.getElementById("nextBtn").classList.remove("hidden");
    document.getElementById("prevBtn").classList.remove("hidden");
    loadQuestion(startQ);
    
    checkFinishPossibility();
}

function checkFinishPossibility() {
    if (completedCategories.size === 3) {
        document.getElementById("finishQuizBtn").classList.remove("hidden");
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
    html += `   </div></div>`;
    container.innerHTML = html;

    document.getElementById("currentQNum").innerText = (index % 10) + 1;
    document.getElementById("totalQuestions").innerText = "10";
    document.getElementById("progressFill").style.width = (((index % 10) + 1) / 10) * 100 + "%";

    let catStart = activeCategory * 10;
    document.getElementById("prevBtn").disabled = index === catStart;
    
    if (index === 29) {
        document.getElementById("nextBtn").innerText = "Finish Quiz";
        document.getElementById("nextBtn").classList.add("btn-secondary");
    } else {
        document.getElementById("nextBtn").innerText = "Next Question";
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
    let catStart = activeCategory * 10;
    
    if (currentQuestion < catStart + 9) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        completedCategories.add(activeCategory);
        document.querySelectorAll(".tab-btn")[activeCategory].style.borderColor = "#8b5cf6"; 
        
        if (activeCategory < 2) {
            switchTab(activeCategory + 1);
        } else {
            document.getElementById("finishQuizBtn").classList.remove("hidden");
            document.getElementById("nextBtn").classList.add("hidden");
        }
    }
}

function prevQuestion() {
    let catStart = activeCategory * 10;
    if (currentQuestion > catStart) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    } else if (activeCategory > 0) {
        switchTab(activeCategory - 1);
        loadQuestion((activeCategory * 10) + 9);
    }
}

function calculateWeightedScores() {
    let clusterCategoryCounts = { A: { Aptitude: 0, Interest: 0, Orientation: 0 }, B: { Aptitude: 0, Interest: 0, Orientation: 0 }, C: { Aptitude: 0, Interest: 0, Orientation: 0 }, D: { Aptitude: 0, Interest: 0, Orientation: 0 } };
    let totalAnswered = { "Orientation": 0, "Interest": 0, "Aptitude": 0 };
    
    Object.entries(userAnswers).forEach(([qIndex, clusterKey]) => {
        const cat = questions[qIndex].category;
        clusterCategoryCounts[clusterKey][cat]++;
        totalAnswered[cat]++;
    });
    
    let processScores = { A: 0, B: 0, C: 0, D: 0 };
    Object.keys(processScores).forEach(cluster => {
        let w = 0;
        let oriDenom = totalAnswered["Orientation"] || 1;
        let intDenom = totalAnswered["Interest"] || 1;
        let aptDenom = totalAnswered["Aptitude"] || 1;

        let normApt = (clusterCategoryCounts[cluster]["Aptitude"] / aptDenom) * 4;
        let normInt = (clusterCategoryCounts[cluster]["Interest"] / intDenom) * 4;
        let normOri = (clusterCategoryCounts[cluster]["Orientation"] / oriDenom) * 4;

        w += normApt * categoryWeights["Aptitude"];
        w += normInt * categoryWeights["Interest"];
        w += normOri * categoryWeights["Orientation"];
        processScores[cluster] = w;
        
        clusterCategoryCounts[cluster] = { Aptitude: normApt, Interest: normInt, Orientation: normOri };
    });
    return { processScores, clusterCategoryCounts };
}

function showFinalResults() {
    if (Object.keys(userAnswers).length === 0) {
        alert("You must answer at least one question to get a result!");
        return;
    }
    let { processScores, clusterCategoryCounts } = calculateWeightedScores();
    sessionStorage.setItem("quizResults", JSON.stringify({
        track: "hardware",
        processScores: processScores,
        clusterCategoryCounts: clusterCategoryCounts
    }));
    window.location.href = "results.html";
}

document.addEventListener("DOMContentLoaded", () => { activeCategory = -1; switchTab(0); });
