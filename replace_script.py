import re

js_file = r"c:\Users\priya\OneDrive\Desktop\PBL\js\quiz.js"

with open(js_file, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace the questions array and categoryExplanations completely.
# But it's easier to just provide the new block to write.
new_questions_js = """const questions = [
    // Part 1: Orientation
    { category: "Orientation", q: "1. When starting a new project, my first step is usually to:", options: { A: "Determine if intelligence can simplify the problem", B: "Gather and clean the necessary data", C: "Sketch out the user interface and experience", D: "Assess security risks, trust, and architectures", E: "Plan the infrastructure and server requirements", F: "Figure out what physical components are needed" } },
    { category: "Orientation", q: "2. I prefer to work in an environment that is:", options: { A: "Focused on pushing what software can uniquely learn", B: "Driven by evidence, charts, and metrics", C: "Fast-paced, user-centric, and design focused", D: "Secretive, defensive, and rigorously verified", E: "Highly scalable, highly available, and 24/7", F: "Hands-on, combining physical and digital worlds" } },
    { category: "Orientation", q: "3. My approach to learning a new technology is:", options: { A: "Exploring generalized problem-solving agents", B: "Analyzing how it processes tabular data", C: "Building a quick, visually appealing prototype", D: "Testing how easily it can be broken or verified", E: "Deploying it inside a container to see how it runs", F: "Flashing it onto a microcontroller and wiring it" } },
    { category: "Orientation", q: "4. When facing a complex problem, I tend to:", options: { A: "Look for a heuristic or abstract intelligent solution", B: "Look for trends in historical records to guide me", C: "Break it down into user stories and views", D: "Think like an attacker or verify consensus", E: "Automate the solution so it scales indefinitely", F: "Check the physical connections and signals" } },
    { category: "Orientation", q: "5. My ideal daily workflow involves:", options: { A: "Training models and tuning parameters", B: "Building dashboards and cleaning datasets", C: "Writing components, routing, and styling logic", D: "Monitoring logs, pentesting, or writing contracts", E: "Writing automation scripts and managing clusters", F: "Writing C/C++ code for embedded microchips" } },
    { category: "Orientation", q: "6. I naturally gravitate towards:", options: { A: "Making computers act like humans", B: "Telling stories through numbers", C: "Creating beautiful, interactive products", D: "Protecting systems and decentralizing trust", E: "Ensuring systems never go down", F: "Making dumb objects smart" } },

    // Part 2: Interest
    { category: "Interest", q: "7. In my free time, I am most likely to read about:", options: { A: "The latest LLMs and deep neural networks", B: "Data visualization and big data trends", C: "New CSS frameworks or game engines", D: "Cyber attacks and blockchain innovations", E: "Cloud architecture and Kubernetes updates", F: "Raspberry Pi projects and robotics" } },
    { category: "Interest", q: "8. The type of software I find most fascinating is:", options: { A: "Virtual assistants, vision models, and bots", B: "Business intelligence pipelines", C: "Sleek apps and high-fidelity video games", D: "Intrusion detection systems and DeFi protocols", E: "Infrastructure-as-code platforms", F: "Smart home hubs and wearables" } },
    { category: "Interest", q: "9. A tech news headline that would make me click immediately:", options: { A: "AI passes the Turing test in a new domain", B: "How analyzing 10 billion rows revealed hidden behavior", C: "The framework replacing React or Unreal is here", D: "Major tech firm hacked via clever social engineering", E: "New server architecture reduces downtime to zero", F: "Microchip shortage ends, new sensors announced" } },
    { category: "Interest", q: "10. The aspect of computing I want to master is:", options: { A: "Machine Learning and Neural Networks", B: "Data Warehousing and ETL", C: "Full-stack Web and Game Mechanics", D: "Ethical Hacking and Tokenomics", E: "Distributed Systems and Orchestration", F: "Real-time Operating Systems" } },
    { category: "Interest", q: "11. I am most curious about how to:", options: { A: "Make a machine understand context", B: "Find the needle in a haystack of variables", C: "Make an application highly engaging and beautiful", D: "Find an exploit or secure a hyper-ledger", E: "Automate the deployment of 1,000 servers", F: "Read physical analog signals digitally" } },
    { category: "Interest", q: "12. My dream pet project would be:", options: { A: "A personal intelligent agent", B: "A live dashboard tracking global metrics", C: "A social media clone or an indie game", D: "A custom password manager or crypto token", E: "A home lab running my own cloud services", F: "An automated greenhouse hardware setup" } },

    // Part 3: Emotions
    { category: "Emotions", q: "13. I feel most fulfilled when I have:", options: { A: "Created a system that seemingly 'thinks'", B: "Extracted a clear conclusion from messy data", C: "Polished an interface until it's pixel-perfect", D: "Patched a massive vulnerability before disaster", E: "Set up a CI/CD pipeline that 'just works'", F: "Seen a physical motor turn based on my code" } },
    { category: "Emotions", q: "14. The most frustrating part of coding for me is:", options: { A: "When an AI hallucinates or fails to converge", B: "Dealing with missing variables and bad datasets", C: "Cross-browser bugs and visual glitches", D: "When you overlook one tiny security loophole", E: "When a server goes down at 3 AM", F: "Hardware shorts, loose wires, and soldering mistakes" } },
    { category: "Emotions", q: "15. I feel a rush of excitement when:", options: { A: "The model surprises me with a clever answer", B: "The chart suddenly reveals an obvious pattern", C: "The application transitions feel incredibly smooth", D: "I finally gain root access or deploy a contract", E: "My load balancer successfully handles a traffic spike", F: "The LED blinks exactly when it's supposed to" } },
    { category: "Emotions", q: "16. I would feel extremely proud to tell my friends that I:", options: { A: "Built the AI that answers their questions", B: "Discovered a trend that saved a company millions", C: "Built the app or game they use every day", D: "Secured a major network from a foreign attack", E: "Keep the servers for a massive platform running", F: "Programmed the computer inside their car" } },
    { category: "Emotions", q: "17. The type of feedback I value most is:", options: { A: "How conversational and helpful my model is", B: "How accurate and clean my reports are", C: "How beautiful, fun, and intuitive my product is", D: "How impenetrable and transparent my architecture is", E: "How reliable and fast my infrastructure is", F: "How durable and battery-efficient my device is" } },
    { category: "Emotions", q: "18. I feel most relaxed when I am:", options: { A: "Watching a progress bar as a model trains", B: "Writing SQL queries to shape a dataset", C: "Refining the padding, layouts, and sprites", D: "Reading security audit reports or whitepapers", E: "Writing YAML files for Docker configs", F: "Soldering pins to a circuit board" } },

    // Part 4: Personality
    { category: "Personality", q: "19. In a team setting, I am usually the one who:", options: { A: "Suggests using models to automate our tasks", B: "Keeps track of the metrics and KPIs", C: "Advocates for the end-user's experience", D: "Points out the risks, decentralization, and security flaws", E: "Manages the repository and deployment pipelines", F: "Brings in physical hardware to demonstrate a point" } },
    { category: "Personality", q: "20. My tolerance for repetitive, structured work is:", options: { A: "Low—I'd rather train an AI to do it", B: "High—Data cleaning requires extreme patience", C: "Moderate—I like structure but need visual/creative variety", D: "High—Security auditing is all about the fine details", E: "Low—I script everything so I never do it twice", F: "High—Hardware testing requires rigorous repetition" } },
    { category: "Personality", q: "21. When dealing with strict rules and constraints, I:", options: { A: "See them as guidelines a model can learn to navigate", B: "Use them to bound my data tables", C: "Design elegant solutions within those visual constraints", D: "Look for the loopholes in the rules to exploit them", E: "Implement automated checks to enforce them globally", F: "Work within the physical limitations of the hardware" } },
    { category: "Personality", q: "22. My balance between creativity and logic is:", options: { A: "Highly analytical, fascinated by neural creativity", B: "Mostly logical, focusing on factual data truths", C: "Highly creative, blending art with code directly", D: "Highly logical, focusing on defensive strategy", E: "Highly logical, focusing on robust architecture", F: "Balanced, combining physical engineering with coding" } },
    { category: "Personality", q: "23. I handle failure and errors by:", options: { A: "Adjusting my learning rate and retraining", B: "Checking if my underlying data is flawed", C: "Fixing the UI state and trying again", D: "Treating it as a security incident to investigate", E: "Rolling back the server state to a stable version", F: "Checking the power supply and connections" } },
    { category: "Personality", q: "24. When explaining complex things to others, I:", options: { A: "Use predictive analogies about the human brain", B: "Draw a graph or show a statistical chart", C: "Make a quick visual mockup or storyboard", D: "Explain the worst-case scenario if they don't understand", E: "Draw an architecture diagram with boxes and arrows", F: "Show them the physical prototype working" } },

    // Part 5: Aptitude
    { category: "Aptitude", q: "25. I have a natural talent for:", options: { A: "Probability, calculus, and abstract intelligence", B: "Finding inconsistencies in documents or data", C: "Having a good eye for colors, layouts, and interactions", D: "Spotting when a system is flawed or corruptible", E: "Organizing complex, messy systems into neat structures", F: "Fixing broken appliances or electronics" } },
    { category: "Aptitude", q: "26. I can focus deeply for hours when:", options: { A: "Experimenting with neural network layers", B: "Cleaning and transforming a massive spreadsheet", C: "Tweaking styling or level design to get it exactly right", D: "Hunting down a bug in a reverse-engineered binary", E: "Configuring a Linux server cluster from scratch", F: "Writing low-level code for a custom PCB" } },
    { category: "Aptitude", q: "27. The subject I picked up the fastest was:", options: { A: "Advanced Math and AI concepts", B: "Statistics and Excel", C: "Art, Design, or Media Arts", D: "Networking protocols or Cryptography", E: "Bash scripting and Command Line", F: "Physics and Circuits" } },
    { category: "Aptitude", q: "28. People often ask for my help with:", options: { A: "Figuring out how to use new AI tools", B: "Making sense of confusing numbers or reports", C: "Making their presentations or websites look good", D: "Recovering hacked accounts or explaining crypto", E: "Fixing their computer or server connection", F: "Repairing a broken device or gadget" } },
    { category: "Aptitude", q: "29. I am particularly good at spotting:", options: { A: "Patterns in highly complex, multi-dimensional models", B: "Anomalies in a list of numbers", C: "Pixels or interactive elements that are out of place", D: "Phishing emails, scams, or trust loopholes", E: "Inefficiencies in a deployment process", F: "When a hardware component is failing" } },
    { category: "Aptitude", q: "30. When given a massive amount of information, I:", options: { A: "Train a model to understand its underlying distribution", B: "Filter, sort, and visualize it", C: "Create a clean dashboard so a user can read it easily", D: "Hash it, immutably secure it, or find sensitive leaks", E: "Store it efficiently in a distributed database", F: "Process it locally on the edge device" } }
];

let currentQuestion = 0;
let userAnswers = {};
let activeCategory = 0;
let completedCategories = new Set();
let finalRefinedDomain = null; // stores the specific domain choice

const categoryExplanations = {
    "Orientation": {
        A: "Your answers show a strong alignment with AI & Intelligence. You tend to look at problems and think about how algorithmic models can independently learn to solve them effectively.",
        B: "You naturally orient towards Data & Analytics. You are someone who looks for empirical facts and evidence above all else.",
        C: "You gravitate heavily towards Software & Product Development. You care deeply about how things look, feel, and function for the end user.",
        D: "You have a natural instinct for Security & Trust. You look at systems and immediately try to figure out where they are weak or how to remove central authorities.",
        E: "You lean towards Systems & Infrastructure. You think about the big picture and how massive architectures can scale beautifully without downtime.",
        F: "You prefer Hardware & Physical Systems. Rather than just writing software, you like to connect digital code to real-world physical devices."
    },
    "Interest": {
        A: "You are fascinated by the idea of machines that think, generating text/images, and the bleeding edge of AI research.",
        B: "You have a deep love for uncovering hidden narratives that numbers can tell, turning massive datasets into visual business insights.",
        C: "You are always keeping up with the latest trends in internet design, web applications, or rendering engines to build highly interactive experiences.",
        D: "You are captivated by the constant cat-and-mouse game of cyber warfare, ethical hacking, and the transparent trust of blockchains.",
        E: "You find the architecture of the internet fascinating—automating and orchestrating thousands of servers to act as one unified backend.",
        F: "You love playing with gadgets. The idea of writing code that runs on tiny microcontrollers to automate a physical robot is highly interesting to you."
    },
    "Emotions": {
        A: "You experience incredible wonder when a program successfully predicts an outcome or generates a completely human-like response.",
        B: "You find deep peace and satisfaction in taking chaotic information and organizing it into a clean, understandable conclusion.",
        C: "You feel immense pride when you polish a user interface or game loop until it is pixel-perfect and watch someone navigate it happily.",
        D: "You get a huge adrenaline rush from finding a hidden vulnerability or successfully deploying an immutable smart contract safely.",
        E: "You feel accomplished when a massive deployment pipeline you built runs perfectly automatically and the servers stay quiet.",
        F: "You experience pure, tangible joy when your code finally makes a physical LED light blink or a robotic motor turn."
    },
    "Personality": {
        A: "You are highly curious and analytical, entirely willing to endure long training cycles to achieve a massive cognitive breakthrough in a machine.",
        B: "You are highly methodical, exceptionally patient, and strongly value truth and accuracy derived purely from hard data.",
        C: "You possess a rare blend of creativity and practicality. You care deeply about aesthetics, storytelling, and empathy for how your work makes people feel.",
        D: "You are naturally skeptical, highly detail-oriented, and tend towards decentralized thinking, always anticipating worst-case scenarios.",
        E: "You are intensely organized, highly logical, and hate inefficiency. You'll script and automate everything so things run predictably.",
        F: "You are pragmatic, grounded, and prefer tangible results over abstract theories. You like to get your hands dirty with physical components."
    },
    "Aptitude": {
        A: "You have a natural talent for abstract logic, discrete math, and understanding complex integrations mapping dimensional multi-layered models.",
        B: "You naturally excel at spotting hidden anomalies, finding correlations, and organizing massive amounts of statistical information.",
        C: "You have a fantastic eye for visual design, spatial layout, and interactions. You intuitively understand how a user wants to navigate.",
        D: "You are exceptionally gifted at finding flaws in a set of rules, reverse-engineering logic, tracking tokenomics, and spotting deception.",
        E: "You have a strong talent for system design. You can quickly recognize network bottlenecks and create scalable architectures.",
        F: "You learn physical electrical systems extremely quickly, easily understanding circuits, analog signals, and hardware debugging."
    }
};

const clusterMap = {
    A: { name: "AI & Intelligence", domains: ["Artificial Intelligence", "Machine Learning", "Deep Learning"], colors: ["#3b82f6", "#14b8a6", "#1e40af"] },
    B: { name: "Data & Analytics", domains: ["Data Science"], colors: ["#10b981"] },
    C: { name: "Software & Product Dev", domains: ["Web / App Development", "Game Development"], colors: ["#f59e0b", "#f97316"] },
    D: { name: "Security & Trust", domains: ["Cyber Security", "Blockchain"], colors: ["#ef4444", "#6366f1"] },
    E: { name: "Systems & Infrastructure", domains: ["Cloud & DevOps"], colors: ["#8b5cf6"] },
    F: { name: "Hardware & Physical", domains: ["IoT & Embedded Systems"], colors: ["#ec4899"] }
};

const domainMap = {
    "Artificial Intelligence": { link: "domain_ai.html", color: "#3b82f6" },
    "Data Science": { link: "domain_data.html", color: "#10b981" },
    "Web / App Development": { link: "domain_web.html", color: "#f59e0b" },
    "Cyber Security": { link: "domain_security.html", color: "#ef4444" },
    "Cloud & DevOps": { link: "domain_cloud.html", color: "#8b5cf6" },
    "IoT & Embedded Systems": { link: "domain_iot.html", color: "#ec4899" },
    "Blockchain": { link: "domain_blockchain.html", color: "#6366f1" },
    "Game Development": { link: "domain_game.html", color: "#f97316" },
    "Machine Learning": { link: "domain_ml.html", color: "#14b8a6" },
    "Deep Learning": { link: "domain_dl.html", color: "#1e40af" }
};
"""

# Extract the rest of the file after domainMap
remainder_idx = content.find("function switchTab(tabIndex)")
remainder = content[remainder_idx:]

new_content = new_questions_js + "\n" + remainder

with open(js_file, "w", encoding="utf-8") as f:
    f.write(new_content)
