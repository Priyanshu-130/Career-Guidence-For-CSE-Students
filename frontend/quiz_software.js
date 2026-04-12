const questions = [
    // --- ORIENTATION (10 Questions: Mindset & How You Approach Life) ---
    { category: "Orientation", q: "1. When you face a big, complicated problem, you naturally want to:", options: { A: "Find a smart pattern so it can solve itself automatically next time.", B: "Look at past numbers and facts to find the most logical answer.", C: "Think about how the final solution will look and feel to other people.", D: "Try to find the hidden flaws, loopholes, or rules you can break.", E: "Think about how to build a strong foundation so the problem never happens again." } },
    { category: "Orientation", q: "2. In a college group project, your role is usually:", options: { A: "The thinker who wants the project to act smart and do the work for us.", B: "The analyzer who gathers all the research, facts, and figures.", C: "The designer who makes the final presentation look amazing and creative.", D: "The checker who constantly asks, 'What if something goes wrong here?'", E: "The organizer who makes sure everyone's files are safely stored and shared." } },
    { category: "Orientation", q: "3. If someone gives you a messy box of scattered information, you instinctually:", options: { A: "Try to teach a computer to organize it for you.", B: "Sort it into a clean spreadsheet so you can read the story behind it.", C: "Turn it into a beautiful chart or visual graphic so it's easy to read.", D: "Check to make sure none of the information was stolen or faked.", E: "Put it all into a massive digital vault so it is perfectly organized forever." } },
    { category: "Orientation", q: "4. You believe the best technology is technology that:", options: { A: "Is incredibly smart and can learn on its own like a human.", B: "Can perfectly predict human behavior using math.", C: "Is incredibly fun, beautiful, and connects people globally.", D: "Protects innocent people from being scammed or hacked.", E: "Silently powers the whole internet without anyone ever noticing." } },
    { category: "Orientation", q: "5. When organizing your daily tasks, you usually focus most on:", options: { A: "Automating things so you don't have to do the same work twice.", B: "Tracking exactly how much time everything takes to find efficiencies.", C: "Making your to-do list look visually perfect and color-coded.", D: "Keeping your personal notes completely private and locked down.", E: "Making sure you can access your notes from any device, anywhere, instantly." } },
    { category: "Orientation", q: "6. A really successful day for you feels like:", options: { A: "You built something that learned a new trick all by itself.", B: "You solved a confusing puzzle by looking at all the hidden clues.", C: "You designed something that people loved looking at or playing with.", D: "You fixed a huge mistake before anybody else even realized it was there.", E: "You set up a system that made everyone's life 100 times easier." } },
    { category: "Orientation", q: "7. You would rather completely understand:", options: { A: "How the human brain learns, and how to copy that in software.", B: "How to use math to predict what people will buy next year.", C: "How colors, shapes, and sounds make people feel happy.", D: "How magicians and hackers trick people into giving up secrets.", E: "How millions of computers talk to each other across the ocean." } },
    { category: "Orientation", q: "8. When someone shows you a new app, your brain immediately:", options: { A: "Wonders if the app is smart enough to guess what you want.", B: "Wonders what kind of user data they are collecting from you.", C: "Wonders why they chose that specific button color or animation.", D: "Wonders how easy it would be to hack into the app's files.", E: "Wonders where the servers are located that hold all the pictures." } },
    { category: "Orientation", q: "9. You would describe your main career motivation as:", options: { A: "Creating machines that are smarter than humans.", B: "Finding the hidden truth inside massive piles of facts.", C: "Building things that are incredibly fun and visually stunning.", D: "Acting as a digital bodyguard to protect internet users.", E: "Architecting the invisible backbone that keeps the internet alive." } },
    { category: "Orientation", q: "10. At a party, you are most likely the person who:", options: { A: "Has a deep philosophical conversation about the future of humanity.", B: "Knows random, highly specific trivia facts about everything.", C: "Takes the best photos and cares about the music playlist.", D: "Notices everything going on in the room without drawing attention.", E: "Helps the host set up the speakers, Wi-Fi, and TV before it starts." } },

    // --- INTEREST (10 Questions: Hobbies & Passions) ---
    { category: "Interest", q: "11. The tech news headline you would immediately click is:", options: { A: "'New computer program passes college exams perfectly!'", B: "'How analyzing shopping habits revealed a completely hidden trend!'", C: "'New immersive 3D video game changes the way we play!'", D: "'Major bank hacked: Millions of passwords stolen!'", E: "'New internet technology makes websites load 100 times faster!'" } },
    { category: "Interest", q: "12. In your free time, you prefer exploring:", options: { A: "Talking to ChatGPT or playing with AI image generators.", B: "Reading cool facts, statistics, or watching science documentaries.", C: "Looking at stunning websites, drawing, or playing video games.", D: "Watching movies about secret agents, heists, or clever criminals.", E: "Setting up your own Minecraft server for your friends to play on." } },
    { category: "Interest", q: "13. The feature you find the absolute coolest in an app is:", options: { A: "When it perfectly recommends the exact song you wanted to hear.", B: "When it shows you a year-end review with cool graphs of your habits.", C: "When the scrolling is butter-smooth and the animations are crisp.", D: "When it uses face-ID and heavy encryption so no one else can open it.", E: "When millions of people use it at the same exact time without crashing." } },
    { category: "Interest", q: "14. A genie grants you one skill instantly. You choose to be a master of:", options: { A: "Creating robots that can think completely for themselves.", B: "Reading numbers so well you can predict the stock market.", C: "Designing the most popular video game in the world.", D: "Being an uncatchable digital spy and security expert.", E: "Building a global network of computers that never goes offline." } },
    { category: "Interest", q: "15. The documentary you'd most want to watch tonight is about:", options: { A: "The race to build the world's first super-intelligent robot.", B: "How big companies silently use our browsing habits to sell ads.", C: "The intense art and storytelling behind making a blockbuster movie.", D: "Famous internet hackers and digital bank robbers.", E: "Inside the massive, secret warehouses that hold all of Google's data." } },
    { category: "Interest", q: "16. When your computer or phone starts acting weird, you:", options: { A: "Ask a smart chatbot how to fix it.", B: "Look at your storage and battery stats to see what exactly changed.", C: "Get incredibly annoyed because the beautiful screen is lagging.", D: "Immediately run an antivirus scan to make sure you weren't hacked.", E: "Restart the whole system and check if your internet router is down." } },
    { category: "Interest", q: "17. The industry you'd most like to work in is:", options: { A: "Future Technology and Artificial Brains.", B: "Global Finance, Sports Stats, or Market Research.", C: "Digital Entertainment, Movies, and Social Media.", D: "Global Defense, Privacy, and Cyber Police.", E: "Internet Providers and Massive Tech Companies like Amazon." } },
    { category: "Interest", q: "18. Your favorite type of hackathon project would be:", options: { A: "A bot that automatically generates funny original poems.", B: "A tool that predicts local traffic using years of city records.", C: "A beautifully designed habit-tracking app with smooth animations.", D: "A program that checks exactly how secure your passwords are.", E: "A script that lets you control your entire computer from your phone." } },
    { category: "Interest", q: "19. The social media accounts you enjoy following most are:", options: { A: "People posting crazy AI generated art and futuristic ideas.", B: "Infographic pages that post cool charts and weird statistics.", C: "Artists, graphic designers, and indie game developers.", D: "Ethical hackers sharing crazy stories about how they broke into places.", E: "Computer nerds showing off their crazy multi-monitor desk setups." } },
    { category: "Interest", q: "20. The most exciting 'future tech' concept to you is:", options: { A: "Super-intelligent digital assistants that do our homework for us.", B: "Perfect formulas that can tell you exactly what will happen tomorrow.", C: "Fully immersive, photorealistic Virtual Reality Worlds.", D: "A completely unbreakable, private internet where no one can track you.", E: "Instantaneous, unlimited computer power available anywhere in the world." } },

    // --- APTITUDE (10 Questions: Natural Skills & Talents) ---
    { category: "Aptitude", q: "21. At school, you always found it easiest to learn:", options: { A: "Complex logic puzzles and understanding how the brain works.", B: "Math, statistics, probabilities, and reading charts.", C: "Art, graphic design, psychology, or creative writing.", D: "Solving tricky mysteries, riddles, or spotting when someone is lying.", E: "Organizing your computer, fixing the Wi-Fi, and handling large files." } },
    { category: "Aptitude", q: "22. The \"boring\" task you can actually happily do for hours is:", options: { A: "Training a virtual pet or bot by repeatedly teaching it rules.", B: "Cleaning up a super messy Excel spreadsheet so it looks perfect.", C: "Moving a picture 1 pixel to the left, seeing how it looks, and moving it back.", D: "Reading through a massive list of text specifically looking for one hidden clue.", E: "Sorting thousands of files into perfectly named, nested folders." } },
    { category: "Aptitude", q: "23. When learning something new, your brain is really good at:", options: { A: "Understanding the big picture of how something learns and grows.", B: "Memorizing exact formulas and noticing number patterns.", C: "Visualizing exactly how something will look in 3D space.", D: "Spotting the one tiny mistake that everyone else completely missed.", E: "Understanding how totally different machines connect to each other." } },
    { category: "Aptitude", q: "24. If your friends want to plan a huge trip, you naturally are the one who:", options: { A: "Uses cool new tools to auto-generate the ultimate itinerary.", B: "Calculates the exact budget, travel times, and splits the bill perfectly.", C: "Designs the ultimate photo album and picks the most aesthetic locations.", D: "Makes sure nobody gets scammed and keeps all the passports safe.", E: "Books the flights, hotels, and ensures everything runs on schedule." } },
    { category: "Aptitude", q: "25. You are naturally very good at spotting:", options: { A: "Patterns in how people talk or behave online.", B: "Anomalies, like a single weird number in a huge list of normal numbers.", C: "Slight misalignments in colors, text, or website layouts.", D: "A logical flaw in an argument that someone is trying to hide from you.", E: "A bottleneck where a process is getting slowed down." } },
    { category: "Aptitude", q: "26. You find it incredibly easy to use:", options: { A: "New AI tools like ChatGPT or Midjourney.", B: "Microsoft Excel, Google Sheets, or calculators.", C: "Photoshop, Canva, or website builders.", D: "Password managers, VPNs, and privacy settings.", E: "Windows Task Manager, Command Prompt, or Router settings." } },
    { category: "Aptitude", q: "27. Your memory works best when you are:", options: { A: "Visualizing a branching tree of decisions.", B: "Remembering specific statistics, dates, or numbers.", C: "Visualizing the spatial layout of a room or an app screen.", D: "Remembering common mistakes people make so you can avoid them.", E: "Visualizing a map of how a bunch of different things are wired together." } },
    { category: "Aptitude", q: "28. People often ask for your help when they need to:", options: { A: "Figure out a faster, smarter, or more automated way to do their homework.", B: "Help them understand a confusing math problem or bill.", C: "Make their presentation or personal social media look beautiful.", D: "Figure out if a sketchy email is a scam or a virus.", E: "Fix their completely broken laptop or set up a new TV." } },
    { category: "Aptitude", q: "29. When looking at a massive wall of text, you naturally want to:", options: { A: "Have an AI summarize it for you instantly.", B: "Count how many times certain keywords appear to find the main point.", C: "Add titles, bullet points, and colors to make it actually readable.", D: "Read the fine print at the bottom to see what they are hiding.", E: "Compress it into a smaller file so it doesn't take up space." } },
    { category: "Aptitude", q: "30. The feeling of ultimate satisfaction for you comes from:", options: { A: "Realizing your work fundamentally taught itself something new.", B: "Pulling a perfectly clean, truthful conclusion from a mess of numbers.", C: "Watching a random person smile while using something you visually built.", D: "Knowing you successfully protected your friends from a bad situation.", E: "Watching your system effortlessly handle a crazy amount of work at once." } }
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
        document.querySelectorAll(".tab-btn")[activeCategory].style.borderColor = "#10b981"; 
        
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
    let clusterCategoryCounts = { A: { Aptitude: 0, Interest: 0, Orientation: 0 }, B: { Aptitude: 0, Interest: 0, Orientation: 0 }, C: { Aptitude: 0, Interest: 0, Orientation: 0 }, D: { Aptitude: 0, Interest: 0, Orientation: 0 }, E: { Aptitude: 0, Interest: 0, Orientation: 0 } };
    let totalAnswered = { "Orientation": 0, "Interest": 0, "Aptitude": 0 };
    
    Object.entries(userAnswers).forEach(([qIndex, clusterKey]) => {
        const cat = questions[qIndex].category;
        clusterCategoryCounts[clusterKey][cat]++;
        totalAnswered[cat]++;
    });
    
    let processScores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
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
        track: "software",
        processScores: processScores,
        clusterCategoryCounts: clusterCategoryCounts
    }));
    window.location.href = "results.html";
}

document.addEventListener("DOMContentLoaded", () => { activeCategory = -1; switchTab(0); });

