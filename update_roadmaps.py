import os
import re
from bs4 import BeautifulSoup

DOMAINS = {
    "ai": {"title": "AI, ML & Deep Learning", "steps": [("Step 1: Core Programming", "Master Python, understand data structures, OOP concepts, and learn basic algorithms. Build foundational scripting skills."),("Step 2: Applied Mathematics", "Dive deep into Statistics, Probability, Linear Algebra, and Calculus (derivatives/integrals). These form the backbone of ML/DL."),("Step 3: Machine Learning Algorithms", "Learn Supervised, Unsupervised, and Reinforcement learning. Practice with Scikit-Learn using linear regression, decision trees, SVMs, etc."),("Step 4: Deep Learning & Neural Nets", "Understand ANNs, CNNs, and RNNs. Gain hands-on experience using TensorFlow or PyTorch. Implement backpropagation."),("Step 5: NLP or Computer Vision", "Specialize in Text processing (Transformers, LLMs) or Image processing (YOLO, ResNets) depending on your interest."),("Step 6: Deployment & MLOps", "Learn how to wrap models into APIs (FastAPI/Flask) and deploy using Docker, AWS SageMaker, or Hugging Face Spaces.")], "resources": [("Coursera: DeepLearning.AI", "https://www.coursera.org/specializations/deep-learning", "Comprehensive DL foundation by Andrew Ng."),("Kaggle", "https://www.kaggle.com/", "Datasets, competitions, and notebooks to practice."),("Hugging Face Course", "https://huggingface.co/course", "State-of-the-art NLP and Transformers tutorial."),("YouTube: Andrej Karpathy", "https://www.youtube.com/c/AndrejKarpathy", "In-depth visual and coding tutorials for neural nets.")]},
    "cloud": {"title": "Cloud Computing", "steps": [("Step 1: Fundamentals of IT", "Understand operating systems (Linux/Unix), networking basics, IP addressing, DNS, and basic bash scripting. Learn how the web works."),("Step 2: Virtualization & Containers", "Learn Hypervisors, Virtual Machines, and dive into Docker. Understand containerization principles and how it solves 'works on my machine' problems."),("Step 3: Cloud Provider Basics", "Choose one major cloud provider (AWS, Azure, or GCP). Learn about basic compute (EC2), storage (S3), and networking (VPC) in the cloud. Get a foundational cert (e.g., AWS Cloud Practitioner)."),("Step 4: Infrastructure as Code (IaC)", "Automate provisioning using Terraform or AWS CloudFormation. Learn to version-control your infrastructure code using Git."),("Step 5: DevOps & CI/CD", "Integrate continuous integration and deployment pipelines using GitHub Actions, Jenkins, or GitLab CI. Automate testing and deployments."),("Step 6: Orchestration & Advanced Topics", "Master Kubernetes for orchestrating containers. Dive into serverless architectures, monitoring (Prometheus, Grafana), and cloud security best practices.")], "resources": [("AWS Skill Builder", "https://skillbuilder.aws/", "Official Amazon cloud training and labs."),("Nana's DevOps Bootcamp", "https://www.youtube.com/c/TechWorldwithNana", "Excellent containerization and Kubernetes tutorials."),("A Cloud Guru", "https://acloudguru.com/", "Interactive cloud labs and certification paths."),("Terraform Documentation", "https://developer.hashicorp.com/terraform/tutorials", "Official HashiCorp IaC guides.")]},
    "data": {"title": "Data Science & Analytics", "steps": [("Step 1: Programming & Databases", "Master Python or R. Deeply understand SQL for querying large databases (joins, aggregations, window functions)."),("Step 2: Data Wrangling & EDA", "Use Pandas and NumPy for cleaning messy data. Master Exploratory Data Analysis (EDA) to find patterns and anomalies."),("Step 3: Data Visualization", "Communicate insights visually using Tableau, PowerBI, or Python libraries like Matplotlib, Seaborn, and Plotly."),("Step 4: Applied Statistics", "Learn A/B testing, hypothesis testing, distributions, and inferential statistics to validate business metrics."),("Step 5: Predictive Modeling", "Learn Machine Learning models for forecasting, clustering, and classification to pull predictive insights from data."),("Step 6: Big Data Technologies", "Scale your skills by learning Apache Spark, Hadoop, and navigating data warehouses like Snowflake or BigQuery.")], "resources": [("DataCamp", "https://www.datacamp.com/", "Interactive coding for data science in Python/R/SQL."),("Tableau Public", "https://public.tableau.com/", "Free software to practice BI visualization."),("Google Data Analytics Cert", "https://www.coursera.org/professional-certificates/google-data-analytics", "Comprehensive entry-level data analytics training."),("StatQuest with Josh Starmer", "https://www.youtube.com/c/joshstarmer", "Complex statistics and ML concepts explained simply.")]},
    "iot": {"title": "IoT & Embedded Systems", "steps": [("Step 1: Electronics Fundamentals", "Understand basic circuitry, Ohm's law, digital logic, and read schematics. Familiarize yourself with multimeters and oscilloscopes."),("Step 2: C & C++ Programming", "Master low-level programming in C and C++. Learn about memory management, pointers, and developing for constrained environments."),("Step 3: Microcontrollers", "Start working with Arduino and ESP32. Learn how to interface with sensors (temperature, motion) and actuators (motors)."),("Step 4: IoT Communication Protocols", "Study MQTT, CoAP, HTTP, and WebSockets. Learn wireless communication like Bluetooth Low Energy (BLE), Wi-Fi, LoRa, and Zigbee."),("Step 5: RTOS (Real-Time Operating Systems)", "Move beyond bare-metal to learning FreeRTOS. Manage multi-threading and real-time task scheduling on microcontrollers."),("Step 6: Cloud Integration & Edge Computing", "Connect devices to AWS IoT or Azure IoT Hub. Learn to process data at the edge and deploy OTA (Over-The-Air) firmware updates.")], "resources": [("Arduino Official Tutorials", "https://www.arduino.cc/en/Tutorial/HomePage", "Great for beginners in hardware-software interfacing."),("ESP32 Tutorials", "https://randomnerdtutorials.com/", "Projects connecting hardware to the internet."),("Coursera: IoT Specialization", "https://www.coursera.org/specializations/iot", "From architecture to cloud connectivity."),("Hackaday", "https://hackaday.com/", "Inspiration and breakdowns of hardware projects.")]},
    "networking": {"title": "Networking & Communication Systems", "steps": [("Step 1: Network Fundamentals", "Understand the OSI model, TCP/IP stack, types of networks (LAN/WAN), and basic topologies. Learn binary math for IP addressing."),("Step 2: Switching & Routing", "Configure switches (VLANs, STP) and routers. Learn dynamic routing protocols like OSPF, EIGRP, and BGP."),("Step 3: Network Services", "Deep dive into exactly how DNS, DHCP, NAT, and FTP work. Manage infrastructure addressing schemas."),("Step 4: Network Security", "Implement Firewalls (Cisco ASA, Palo Alto), VPNs (IPSec, SSL), and learn about ACLs and intrusion detection systems (IDS/IPS)."),("Step 5: Wireless & SDN", "Understand 802.11 Wi-Fi standards. Transition into Software Defined Networking (SDN) and network programmability with Python/Ansible."),("Step 6: Cloud Networking", "Learn how networking translates to the cloud (VPCs, Transit Gateways, Load Balancers) and pursue advanced certifications (e.g., CCNP/CCIE).")], "resources": [("Cisco Networking Academy", "https://www.netacad.com/", "Gold standard for practical networking concepts."),("NetworkChuck on YouTube", "https://www.youtube.com/c/NetworkChuck", "Engaging crash courses on subnetting and CCNA topics."),("GNS3 / Packet Tracer", "https://www.gns3.com/", "Essential network simulation tools for practice."),("Professor Messer - CompTIA", "https://www.professormesser.com/", "Free comprehensive networking certification videos.")]},
    "robotics": {"title": "Robotics & Automation", "steps": [("Step 1: Foundational Math & Physics", "Build strong skills in Linear Algebra (matrices for transformations), Calculus, Kinematics, and Dynamics to understand movement."),("Step 2: Core Programming", "Master C++ for high-performance robot control and Python for rapid prototyping and AI integration."),("Step 3: Motors, Sensors & Controllers", "Understand how to interface with DC/Stepper motors, Lidar, cameras, IMUs. Learn basic electronics for integrating these components."),("Step 4: ROS (Robot Operating System)", "Learn ROS/ROS2 framework. Understand nodes, topics, publishers/subscribers, and launch files to tie complex robotic software together."),("Step 5: Control Theory & Path Planning", "Study PID controllers, SLAM (Simultaneous Localization and Mapping), and algorithms like A* or Dijkstra for autonomous navigation."),("Step 6: Machine Vision & AI Integration", "Implement OpenCV for visual reasoning and integrate Reinforcement Learning to build fully autonomous, smart robotic systems.")], "resources": [("ROS Tutorials", "http://wiki.ros.org/ROS/Tutorials", "The official documentation for mastering ROS."),("Modern Robotics", "http://hades.mech.northwestern.edu/index.php/Modern_Robotics", "Excellent textbook and video courses on kinematics."),("Gazebo Simulator", "https://gazebosim.org/home", "Industry standard for simulating robots in 3D physics environments."),("OpenCV Documentation", "https://docs.opencv.org/", "For integrating computer vision into robotic systems.")]},
    "security": {"title": "Cyber Security", "steps": [("Step 1: IT & Networking Foundations", "You cannot secure what you don't understand. Master networking (TCP/IP, DNS, OSI), operating systems (Windows Internals, Linux), and web architectures."),("Step 2: Security Fundamentals", "Learn basic cryptography, security models (CIA triad), and access control mechanisms. Study the CompTIA Security+ syllabus."),("Step 3: Offensive Security (Red Team)", "Learn penetration testing methodologies. Study the OWASP Top 10 vulnerabilities (SQLi, XSS) and practice exploiting them legally on platforms like TryHackMe/HackTheBox."),("Step 4: Defensive Security (Blue Team)", "Understand SIEM operations (Splunk), digital forensics, log analysis, incident response, and how to harden systems against attacks."),("Step 5: Malware Analysis & Reversing", "Learn assembly language, how to safely analyze malware behavior in sandboxes, and reverse engineer binaries."),("Step 6: Specialized Security & Cloud", "Branch out into Cloud Security (AWS/Azure security audits), DevSecOps, or IoT Security. Obtain advanced certs like OSCP or CISSP.")], "resources": [("TryHackMe", "https://tryhackme.com/", "Gamified labs for absolute beginners to advanced pros."),("HackTheBox", "https://www.hackthebox.com/", "Advanced pentesting labs simulating real corporate networks."),("OWASP Foundation", "https://owasp.org/", "The bible for web application security vulnerabilities."),("Cybrary", "https://www.cybrary.it/", "Free security and IT training videos.")]},
    "vlsi": {"title": "VLSI & Computer Architecture", "steps": [("Step 1: Digital Logic Design", "Master Boolean algebra, combinational circuits (multiplexers, adders), and sequential circuits (flip-flops, state machines)."),("Step 2: Hardware Description Languages", "Learn Verilog or VHDL. Understand how to describe hardware behavior and structure via code using tools like ModelSim."),("Step 3: Computer Architecture", "Study instruction set architectures (RISC-V/ARM), pipelining, cache memory hierarchies, and multi-core processing basics."),("Step 4: FPGA Prototyping", "Move code to physical hardware. Learn to synthesize and implement your HDL designs on Xilinx/Altera FPGA development boards."),("Step 5: ASIC Design Flow", "Understand the full Custom IC workflow: RTL compilation, Logic Synthesis, Static Timing Analysis (STA), and equivalence checking."),("Step 6: Physical Design & Verification", "Dive into Floorplanning, Placement & Routing, Layout (using Cadence/Synopsys tools), and functional verification methodologies like UVM.")], "resources": [("NPTEL VLSI Lectures", "https://nptel.ac.in/", "Outstanding in-depth university lectures on IC design."),("RISC-V Documentation", "https://riscv.org/", "Study the open-source instruction set revolutionizing architecture."),("Intel/Xilinx Tutorials", "https://www.xilinx.com/support.html", "Official documentation and labs for FPGA prototyping."),("ASIC World", "http://www.asic-world.com/", "Great reference for Verilog and SystemVerilog code samples.")]},
    "web": {"title": "Web Development", "steps": [("Step 1: Frontend Fundamentals", "Master HTML5 (semantic layout), CSS3 (Flexbox/Grid, responsive design), and vanilla JavaScript (DOM manipulation, ES6+ features)."),("Step 2: Frontend Frameworks", "Learn React.js (or Vue/Angular). Understand component-based architecture, state management (Redux/Zustand), and routing."),("Step 3: Backend & Databases", "Choose a backend stack like Node.js/Express, Python/Django, or Java/Spring. Learn REST APIs, SQL (PostgreSQL) and NoSQL (MongoDB)."),("Step 4: Full Stack Integration", "Connect your frontend to backend securely. Learn Authentication (JWT, OAuth), session management, and API error handling."),("Step 5: Mobile App Development (Optional)", "Translate web skills to mobile using React Native or Flutter to build cross-platform iOS/Android applications."),("Step 6: Deployment & DevOps", "Host static assets on Vercel/Netlify. Deploy backend on Render/AWS. Learn Git workflows, CI/CD basic pipelines, and containerization via Docker.")], "resources": [("The Odin Project", "https://www.theodinproject.com/", "The best open-source, full-stack curriculum available."),("freeCodeCamp", "https://www.freecodecamp.org/", "Interactive coding challenges spanning MERN stack."),("MDN Web Docs", "https://developer.mozilla.org/", "The absolute authority and documentation for web standards."),("React Official Tutorial", "https://react.dev/", "Excellent guide for modern React development.")]}
}

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Comprehensive Roadmap</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .roadmap-container {{ width: 90%; max-width: 900px; margin: 0 auto; padding: 20px; }}
        .step-card {{ background: rgba(0, 243, 255, 0.05); border: 1px solid var(--border-color); border-left: 4px solid var(--neon-blue); padding: 20px; margin-bottom: 20px; border-radius: 8px; transition: transform 0.2s; }}
        .step-card:hover {{ transform: scale(1.02); border-color: var(--neon-blue); box-shadow: 0 0 10px rgba(0,243,255,0.2); }}
        .step-title {{ color: var(--neon-blue); margin-top: 0; font-size: 1.3rem; }}
        .step-desc {{ color: #c9d1d9; font-size: 1.05rem; line-height: 1.6; margin-bottom: 0; }}
        .resource-card {{ background: rgba(188, 19, 254, 0.05); border: 1px solid var(--border-color); border-left: 4px solid var(--neon-purple); padding: 15px; border-radius: 6px; }}
        .resource-card:hover {{ border-color: var(--neon-purple); box-shadow: 0 0 10px rgba(188,19,254,0.2); }}
        .resource-title {{ color: var(--neon-purple); font-weight: bold; font-size: 1.15rem; text-decoration: none; display:block; margin-bottom:5px; }}
        .resource-title:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <nav>
        <div style="font-weight: bold; color: var(--neon-blue);">
            <a href="home.html" style="color: inherit; text-decoration: none;">CSE Path Finder</a>
        </div>
        <div>
            <a href="domain_{key}.html" class="btn-secondary" style="padding: 5px 10px; font-size: 0.8rem; text-decoration: none; border-radius: 5px;">Back to Domain Explorer</a>
        </div>
    </nav>

    <div class="roadmap-container">
        <h1 style="text-shadow: 0 0 15px var(--neon-purple);">{title} <br><span style="color: var(--neon-purple); font-size: 1.5rem; text-shadow:none;">Learning Roadmap & Resources</span></h1>
        
        <p style="text-align: center; max-width: 700px; margin: 0 auto 40px; color: #9ca3af; font-size: 1.1rem;">
            Follow this detailed step-by-step technical roadmap to build your expertise. We have designed 6 critical phases for you, alongside the highest quality learning materials available.
        </p>

        <div style="margin-bottom: 50px;">
            <h2 style="color: var(--neon-blue); text-align: left; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">🛣️ Step-by-Step Learning Path</h2>
            <div style="margin-top: 30px;">
                {timeline_html}
            </div>
        </div>

        <div>
            <h2 style="color: var(--neon-purple); text-align: left; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">📚 Essential Learning Resources</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px;">
                {resources_html}
            </div>
        </div>

        <div style="text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <a href="domain_{key}.html" class="btn">Back to {title} Overview</a>
        </div>
    </div>
</body>
</html>"""

def generate_roadmap_html(key, data):
    timeline = ""
    for step_title, step_desc in data["steps"]:
        timeline += f'''
            <div class="step-card">
                <h4 class="step-title">{step_title}</h4>
                <p class="step-desc">{step_desc}</p>
            </div>'''

    resources = ""
    for r_title, r_link, r_desc in data["resources"]:
        resources += f'''
            <div class="resource-card">
                <a class="resource-title" href="{r_link}" target="_blank">{r_title} ↗</a>
                <p style="margin: 0; color: #9ca3af;">{r_desc}</p>
            </div>'''

    html_content = html_template.format(
        title=data["title"],
        key=key,
        timeline_html=timeline,
        resources_html=resources
    )
    
    with open(f"c:/Users/priya/OneDrive/Desktop/PBL/js/roadmap_{key}.html", "w", encoding="utf-8") as f:
        f.write(html_content)


def strip_domain_html(key):
    filepath = f"c:/Users/priya/OneDrive/Desktop/PBL/js/domain_{key}.html"
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    with open(filepath, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
        
    for detail_section in soup.find_all("div", class_="detail-section"):
        h2 = detail_section.find("h2")
        if h2 and "Roadmap" in h2.text:
            detail_section.decompose()
            
    for card in soup.find_all("div", class_="insight-card"):
        h3 = card.find("h3")
        if h3 and "Learning Resources" in h3.text:
            card.decompose()
            
    # Clean up empty insight grids
    for grid in soup.find_all("div", class_="career-insights-grid"):
        if not grid.find_all("div", class_="insight-card"):
            grid.decompose()
            
    container = soup.find("div", class_="container")
    
    # We will insert a custom block right before the final back button wrapper
    final_div = container.find_all("div", recursive=False)[-1]
    
    roadmap_banner = soup.new_tag("div")
    roadmap_banner['style'] = "background: linear-gradient(145deg, rgba(13, 17, 23, 1), rgba(0, 243, 255, 0.05)); border: 1px solid var(--neon-blue); border-radius: 8px; padding: 40px; text-align: center; margin: 50px 0; box-shadow: 0 0 25px rgba(0, 243, 255, 0.1);"
    
    h2_banner = soup.new_tag("h2")
    h2_banner['style'] = "color: var(--neon-blue); margin-top: 0; margin-bottom: 15px; font-size: 2rem;"
    h2_banner.string = "Ready to start learning?"
    
    p_banner = soup.new_tag("p")
    p_banner['style'] = "color: var(--text-primary); margin-bottom: 30px; font-size: 1.15rem; max-width: 600px; margin-left: auto; margin-right: auto;"
    p_banner.string = "We've crafted a comprehensive step-by-step roadmap and gathered the best learning resources to guide your journey."
    
    a_banner = soup.new_tag("a")
    a_banner['href'] = f"roadmap_{key}.html"
    a_banner['class'] = "btn"
    a_banner['style'] = "font-size: 1.1rem; padding: 15px 30px; background: rgba(0, 243, 255, 0.1);"
    a_banner.string = "View Full Roadmap & Resources ➔"
    
    roadmap_banner.append(h2_banner)
    roadmap_banner.append(p_banner)
    roadmap_banner.append(a_banner)
    
    container.insert(container.contents.index(final_div), roadmap_banner)

    for h2 in soup.find_all("h2"):
        text = h2.text
        new_text = re.sub(r'^\d+\.\s*', '', text)
        if new_text != text:
            h2.string = new_text

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(str(soup))
        
for k, v in DOMAINS.items():
    generate_roadmap_html(k, v)
    strip_domain_html(k)
    print(f"Processed page and roadmap for: {k}")

# Update results.js
with open("c:/Users/priya/OneDrive/Desktop/PBL/js/results.js", "r", encoding="utf-8") as f:
    results_js = f.read()

results_js = results_js.replace('${link1}#roadmap', '${link1.replace("domain_", "roadmap_")}')
results_js = results_js.replace('${link2}#roadmap', '${link2.replace("domain_", "roadmap_")}')
results_js = results_js.replace('${domainMap[primaryDomain].link}#roadmap', '${domainMap[primaryDomain].link.replace("domain_", "roadmap_")}')

# Ensure #roadmap is fully removed in case of mis-replacing
with open("c:/Users/priya/OneDrive/Desktop/PBL/js/results.js", "w", encoding="utf-8") as f:
    f.write(results_js)
print("Updated results.js")

