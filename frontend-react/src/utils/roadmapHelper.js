/**
 * Roadmap & API helper utilities for CSE PathFinder
 */

export const getApiBaseUrl = () => {
  // If we are developing locally on Vite (typically port 5173 or similar),
  // we request the backend on port 5000. If we are running in production
  // (Flask serving the static files), we can use relative paths.
  const isLocalDev = window.location.port && window.location.port !== '5000';
  return isLocalDev ? 'http://127.0.0.1:5000' : '';
};

// Subtopics mapping for all 9 CSE domains across all 8 semesters
export const domainSubtopics = {
  ai: {
    1: ["Python Programming Basics", "Data Structures (Lists, Dicts, Sets)", "OOP Principles (Classes, Inheritance)"],
    2: ["Linear Algebra (Matrices, Eigenvalues)", "Probability & Inferential Statistics", "Calculus & Gradient Descent"],
    3: ["Supervised ML (Regression, Trees)", "Unsupervised ML (Clustering, PCA)", "Scikit-Learn Model Training"],
    4: ["Exploratory Data Analysis (EDA)", "Feature Engineering & Preprocessing", "Pipeline Evaluation Metrics"],
    5: ["Artificial Neural Networks (ANN)", "Convolutional Neural Networks (CNN)", "Recurrent Networks & LSTMs", "PyTorch / TensorFlow Frameworks"],
    6: ["Large Language Models & GPT", "Attention & Transformers", "Computer Vision (YOLO & OpenCV)"],
    7: ["Model Packaging (FastAPI)", "Containerization (Docker)", "Cloud AI Deployment (AWS/HuggingFace)"],
    8: ["System Architecture Design", "GitHub Portfolio Development", "Technical Interviews & Placement Prep"]
  },
  data: {
    1: ["SQL Database Queries", "Python Data Manipulation (Pandas)", "Analytical Data Pipelines"],
    2: ["Data Wrangling & Cleaning", "Exploratory Data Analysis (EDA)", "Handling Outliers & Missing Values"],
    3: ["BI Dashboarding (Power BI/Tableau)", "Interactive Visuals (D3.js)", "Data Storytelling & Reporting"],
    4: ["SQL Database Integration", "Data Pipeline Orchestration", "Dashboard Deployment & Sharing"],
    5: ["A/B Testing & Design", "Hypothesis Testing Basics", "Statistical Power & Inference"],
    6: ["Time-Series Forecasting", "Classification & Clustering", "Model Evaluation & Tuning"],
    7: ["Apache Spark Big Data Scale", "Hadoop Distributed File System", "Cloud Data Warehouses (BigQuery/Snowflake)"],
    8: ["End-to-End Pipeline Capstone", "Portfolio Presentation (GitHub)", "Case Study Interviews & Prep"]
  },
  web: {
    1: ["Semantic HTML5 & Modern CSS", "Layout Systems (Flexbox/Grid)", "JavaScript ES6+ & DOM Manipulation"],
    2: ["React Components & JSX", "State Management (Hooks/Context)", "React Router & Navigation"],
    3: ["REST & GraphQL API Design", "Node.js & Express.js Servers", "MongoDB & SQL Schema Design"],
    4: ["Full-Stack CRUD Development", "JWT User Authentication", "Deployments (Render/Vercel)"],
    5: ["WebSocket Real-Time Sync", "Security Middleware & CORS", "Performance Optimization & Caching"],
    6: ["React Native / Flutter Setup", "Mobile UI Layouts", "Native Device API Integrations"],
    7: ["Unity 2D/3D Engine Basics", "C# Scripting & Physics", "WebGL Web Game Engines"],
    8: ["Production SaaS App Capstone", "GitHub Portfolio Organization", "System Design Interviews & Prep"]
  },
  security: {
    1: ["OSI Layers & TCP/IP Architecture", "IP Subnetting & Addressing", "Linux CLI Command Mastery"],
    2: ["Symmetric & Asymmetric Ciphers", "Security Baselines (CIA Triad)", "Cryptographic Protocols (SSL/TLS)"],
    3: ["OWASP Top 10 Exploitation", "Penetration Testing (Metasploit)", "Vulnerability Scanning (Nmap/Nessus)"],
    4: ["Vulnerability Assessment Auditing", "Network Sniffing (Wireshark)", "Server Port Security Hardening"],
    5: ["Incident Response Workflows", "SIEM Log Management (Splunk)", "Firewalls & Access Lists (ACLs)"],
    6: ["Reverse Engineering Binaries", "Assembly Language Basics", "Malware Disassembly (Ghidra)"],
    7: ["Cloud Security Configuration", "DevSecOps Pipeline Security", "Blockchain Ledger Security"],
    8: ["Enterprise Hardening Capstone", "GitHub Security Lab Writeups", "OSCP/Security+ Interview Prep"]
  },
  cloud: {
    1: ["Linux Administration Basics", "Automation Scripting (Bash)", "Cron Jobs & Task Automation"],
    2: ["VPC Configuration & Subnetting", "Firewalls & Security Groups", "Load Balancers & Gateway Routers"],
    3: ["EC2 Compute & S3 Storage", "IAM Access & Permissions Policies", "Multi-Cloud (AWS, Azure, GCP)"],
    4: ["Cloud Architecture Automation", "CI/CD Deployment Pipelines", "Static Web Hosting Setup"],
    5: ["Containerization (Docker)", "Kubernetes Pods & Clusters", "Container Registries (ECR/DockerHub)"],
    6: ["Terraform Syntax & State", "Infrastructure GitOps Pipelines", "Ansible Configuration Playbooks"],
    7: ["SRE Metrics (SLAs, SLOs)", "Auto-Scaling & Load Balancing", "Cloud Observability (Prometheus/Grafana)"],
    8: ["Multi-Cloud Architecture Capstone", "IaC GitHub Portfolio", "Cloud Architect Interviews & Prep"]
  },
  iot: {
    1: ["Ohm's Law & Circuit Analysis", "Breadboarding Sensors", "Digital Logic Gate Circuits"],
    2: ["Embedded C Programming", "Interrupts & Clock Timers", "Register-Level MCU Programming"],
    3: ["Arduino Board Prototyping", "ESP32 Wi-Fi & Bluetooth", "Sensor Interfaces (I2C, SPI, UART)"],
    4: ["Smart Home Automation Hub", "Relay Control & Actuators", "Physical Enclosure Design"],
    5: ["Edge Linux Environments", "Python Hardware Scripting", "Raspberry Pi Board Configurations"],
    6: ["MQTT Publisher/Subscriber", "LoRa / BLE Low Power Networks", "Zigbee Smart Grid Systems"],
    7: ["Firebase Real-Time DB Connect", "AWS IoT Core Operations", "Live Sensor Dashboards"],
    8: ["Industrial IoT Solution Capstone", "Hardware Portfolio Showcase", "Embedded Systems Interview Prep"]
  },
  robotics: {
    1: ["Python & C++ Motion Scripts", "Data Structures for Robot States", "Sensor Data Fusion Algorithms"],
    2: ["Robot Kinematics & Mechanics", "Actuators & Servos Control", "CAD Assembly & Modeling"],
    3: ["Hardware Breadboarding", "Motor Driver Configurations", "Sensor Assembly Layouts"],
    4: ["Autonomous Navigation Design", "Maze-Solving Logic", "Obstacle Avoidance Controls"],
    5: ["Feedback Loop Design (PID)", "Sensor Calibration Systems", "Precision Positioning Controls"],
    6: ["ROS Workspace Config", "Publisher & Subscriber Nodes", "ROS Navigation Stack Basics"],
    7: ["SLAM Mapping & Navigation", "Object Recognition (OpenCV/YOLO)", "Self-Driving Simulation Labs"],
    8: ["Autonomous Robotic Capstone", "GitHub Lab Logs", "Mechatronics Interview Prep"]
  },
  vlsi: {
    1: ["Boolean Algebra Simplification", "Number System Formats", "Digital Logic Gate Circuits"],
    2: ["Combinational Logic (Adders, Mux)", "Sequential Logic (Flip-Flops)", "Logisim Logic Simulation"],
    3: ["RTL Design in Verilog", "Testbench Verification", "Waveform Simulation (ModelSim)"],
    4: ["ALU Design & Simulation", "Finite State Machines (FSM)", "Verification Waveform Audits"],
    5: ["FPGA Synthesis Basics", "Vivado Implementation Flow", "Physical Board Program Testing"],
    6: ["RISC-V/ARM Core Structures", "Processor Pipeline Stages", "Memory Cache Hierarchies"],
    7: ["ASIC Physical Layout Flow", "Placement & Routing Layouts", "Static Timing Analysis"],
    8: ["Processor Silicon Capstone", "Verilog Portfolio (GitHub)", "VLSI Core Design Interview Prep"]
  },
  networking: {
    1: ["OSI Layer Stack Functions", "IP Subnetting & CIDR Masks", "Network Transmission Media"],
    2: ["Cisco IOS Command CLI", "Enterprise Switching & VLANs", "OSPF Routing Protocol Config"],
    3: ["Firewall Access Lists (ACL)", "VPN Tunnel Setup (IPsec)", "Network Address Translation (NAT)"],
    4: ["Campus Network Design Lab", "DHCP Scope Configurations", "Spanning Tree Protocol (STP)"],
    5: ["Wi-Fi Standards (802.11)", "4G/5G Wireless Architecture", "WPA3 Security Configurations"],
    6: ["Wireshark Packet Analysis", "Network Performance Tracing", "Bottleneck Diagnosis Labs"],
    7: ["Software-Defined Networking (SDN)", "OpenFlow Protocol Basics", "Virtual VPC Networks (AWS/Azure)"],
    8: ["SDN Enterprise Capstone", "Network Labs Portfolio", "Cisco CCNA Exam Prep"]
  }
};

export function getSemesterSubtopics(domainId, semesterNum) {
  return domainSubtopics[domainId]?.[semesterNum] || ["General Theory & Research", "Practical Lab Exercises", "Milestone Assessment Quiz"];
}

export function getSemesterCurriculum(domain) {
  if (!domain) return [];

  // Define tailored mini projects for each domain ID
  const miniProjects = {
    ai: {
      title: "Domain Mini-Project: ML Pipeline",
      desc: "Develop, evaluate, and document an end-to-end Machine Learning pipeline. Implement data preprocessing, exploratory analysis, model training with Scikit-Learn, and performance metric charts."
    },
    data: {
      title: "Domain Mini-Project: Interactive Analytics Dashboard",
      desc: "Construct an interactive BI dashboard (using Streamlit, Dash, or Tableau) driven by SQL database pipelines. Highlight key metrics and trends using exploratory data visualization."
    },
    web: {
      title: "Domain Mini-Project: Full-Stack MERN App",
      desc: "Create and deploy a full-stack CRUD application (e.g., chat workspace, inventory tracker) incorporating JWT authentication, responsive React layouts, and MongoDB/SQL storage."
    },
    security: {
      title: "Domain Mini-Project: Vulnerability Assessment Lab",
      desc: "Conduct a comprehensive security audit and vulnerability assessment on a containerized environment. Compile an industry-standard pentest report detailing exploits and mitigation patches."
    },
    cloud: {
      title: "Domain Mini-Project: IaC Multi-Tier Infrastructure",
      desc: "Provision and deploy a highly-available web app on AWS/Azure using Terraform. Automate deployment with GitHub Actions and establish basic performance monitoring alerts."
    },
    iot: {
      title: "Domain Mini-Project: Smart IoT Hub",
      desc: "Assemble a smart physical environment node using ESP32 or Arduino. Collect real-time sensor data, transmit it via MQTT, and visualize the stream on a real-time web dashboard."
    },
    robotics: {
      title: "Domain Mini-Project: Autonomous Navigation Control",
      desc: "Design and program a simulated or physical robot navigation script. Implement sensor feedback (Ultrasonic/IR) and tuning loops (PID controllers) for precise path routing."
    },
    vlsi: {
      title: "Domain Mini-Project: Custom ALU Processor Block",
      desc: "Write RTL code for a custom Arithmetic Logic Unit (ALU) in Verilog. Construct a verification testbench to validate operations via waveform simulation tools (ModelSim/Vivado)."
    },
    networking: {
      title: "Domain Mini-Project: Corporate Network Design",
      desc: "Design and test a secure multi-department campus network using Cisco Packet Tracer. Configure dynamic routing (OSPF), VLAN divisions, DHCP scopes, and firewall rules."
    }
  };

  const defaultMiniProject = {
    title: "Domain Mini-Project",
    desc: "Develop and document a hands-on technical project utilizing the domain skills and tools acquired so far."
  };

  const capstoneProject = {
    title: "Capstone Project & Industry Prep",
    desc: "Architect, build, and deploy a comprehensive, production-grade project in your domain. Document implementation in a portfolio repository and prepare for technical interviews."
  };

  // Semesters layout mapping
  return [
    {
      semester: 1,
      title: "Semester 1",
      subtitle: "Foundational Skills",
      color: "#6366f1",
      course: domain.curriculum?.year1?.[0] || { title: "Foundations Course 1", desc: "Foundational programming and concepts." }
    },
    {
      semester: 2,
      title: "Semester 2",
      subtitle: "Core Paradigms",
      color: "#4f46e5",
      course: domain.curriculum?.year1?.[1] || { title: "Foundations Course 2", desc: "Core concepts and programming." }
    },
    {
      semester: 3,
      title: "Semester 3",
      subtitle: "Intermediate Systems",
      color: "#8b5cf6",
      course: domain.curriculum?.year2?.[0] || { title: "Intermediate Course 1", desc: "Algorithms and intermediate engineering." }
    },
    {
      semester: 4,
      title: "Semester 4",
      subtitle: "Consolidation & Practice",
      color: "#a855f7",
      course: miniProjects[domain.id] || defaultMiniProject
    },
    {
      semester: 5,
      title: "Semester 5",
      subtitle: "Advanced Trajectory",
      color: "#ec4899",
      course: domain.curriculum?.year3?.[0] || { title: "Advanced Course 1", desc: "Advanced specialization and concepts." }
    },
    {
      semester: 6,
      title: "Semester 6",
      subtitle: "Specialized Electives",
      color: "#f43f5e",
      course: domain.curriculum?.year3?.[1] || { title: "Advanced Course 2", desc: "Specialized frameworks and toolkits." }
    },
    {
      semester: 7,
      title: "Semester 7",
      subtitle: "Systems Deployment & Ops",
      color: "#10b981",
      course: domain.curriculum?.year4?.[0] || { title: "Production & Ops", desc: "Deployment, scale, and operational tools." }
    },
    {
      semester: 8,
      title: "Semester 8",
      subtitle: "Professional Showcase",
      color: "#059669",
      course: capstoneProject
    }
  ];
}
