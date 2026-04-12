<<<<<<< HEAD
# 🧭 CSE PathFinder: Academic & Career Intelligence Platform

A sophisticated, full-stack Single Page Application (SPA) designed to solve the "Specialization Selection" problem for Computer Science students. It combines situational logic diagnostics with dynamic academic roadmaps.

---

## 🚀 One-Click Start (Windows)
We have automated everything for you. To get the entire project (Backend + Frontend) running:
1.  Navigate to the project root.
2.  Double-click **`start_project.bat`**.
3.  The backend will start in a separate window, and the frontend will start in your current terminal.
4.  Open **http://localhost:5173** to explore!

---

## 🎨 Design Philosophy
Inspired by high-end professional dashboards (Linear, Stripe, Notion), the UI focuses on:
-   **Calm & Confident Aesthetics:** No flashy neon; instead, we use muted indigos, deep slates, and high-quality typography (Inter).
-   **Clarity over Decoration:** Generous spacing and a two-panel layout ensure the student stays focused on the diagnostic content.
-   **Micro-interactions:** Smooth transitions and hover states for a premium, intentional feel.

---

## 🧠 Core Features

### 1. Situational Career Finder
-   **Neuro-Fuzzy Logic Inspiration:** Instead of binary "Yes/No" questions, the engine analyzes logical situational preferences.
-   **Dual Track:** Optimized pathways for both **Software-centric** and **Hardware-integrated** career paths.
-   **Weighted Scoring:** Each response updates a complex score vector across 9 major CSE domains.

### 2. Digital Academic Roadmaps
-   **Phase-based Learning:** Content is divided into 4 years (Foundations -> Fundamentals -> Specialization -> Capstone).
-   **Resource HQ:** Direct links to documentation (AWS, Tensorflow, MDN) and top learning platforms.
-   **Dynamic Context:** Roadmaps shift their focus automatically based on the user's recommended domain.

### 3. Integrated Dashboard (Guest Access)
-   **Zero-Friction Entry:** The current version utilizes a **Guest Access Mode**, allowing instant navigation without connection errors or account overhead.
-   **Local Persistence:** Any progress or results captured are saved to the browser's local storage for a continuous session experience.

---

## 🛠️ Technical Stack

-   **Frontend:** React 19 (Component-based architecture), Vite (Build tool), React Router 7.
-   **Backend:** Python Flask (REST API) with SQLite (Reliable relational storage).
-   **Icons:** Lucide-React.
-   **Packaging:** Standard NPM dependency management.

---

## 📁 Repository Structure

```text
.
├── backend/                # Flask Server logic, Database, and API routes
├── frontend-react/         # React Source (Vite)
│   ├── src/                # Core application code
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Full-page views
│   │   └── context/        # State management (Authentication/Guest logic)
│   └── dist/               # Production-ready frontend build
├── start_project.bat       # Windows All-in-One Startup script
├── technical_report.md     # In-depth technical architecture breakdown
└── README.md               # Main project overview (You are here)
```

---

## 📊 Analytical Methodology
The recommendation engine works by accumulating "Domain Weights." 
- For example, choosing "Analytical Debugging" adds weight to *Cybersecurity* and *Data Science*.
- Choosing "User Experience Design" adds weight to *Frontend Engineering* and *UI/UX*.
At the end of the session, the domain with the highest aggregate weight is presented as the top recommendation with a detailed insight report.

---
*Developed as part of the CSE Project-Based Learning (PBL) Curriculum.*
=======
CSE PathFinder

Career Guidance and Educational Planning System for CSE Students

📌 Overview

CSE PathFinder is a web-based platform designed to help Computer Science Engineering students identify the most suitable career domain based on their interests and problem-solving approach.

The system uses a situational quiz and rule-based scoring engine to recommend a domain and provides a structured 4-year learning roadmap to guide students from beginner to industry-ready level.

🎯 Problem Statement

Computer Science Engineering includes multiple domains such as AI/ML, Web Development, Cybersecurity, and more. Students often:

Lack clarity in early years
Follow trends or peer pressure
Get overwhelmed by scattered resources

👉 This leads to poor decision-making and inefficient learning.

💡 Solution

CSE PathFinder acts as a digital career advisor by:

Evaluating students using a situational quiz
Recommending the most suitable domain
Providing a clear, structured roadmap
Showing confidence score and domain comparison
🧠 Key Features
🎯 Multi-Domain Recommendation System
Supports multiple CSE domains such as:
AI/ML
Data Science
Web Development
Cybersecurity
IoT
VLSI
Cloud Computing
DevOps
Mobile App Development (expandable)
🧪 Situational Quiz Engine
Evaluates thinking patterns instead of direct preferences
📊 Confidence Score + Dashboard
Shows domain-wise score comparison
🗺️ 4-Year Structured Roadmaps
Semester-wise learning plan including:
Topics
Tools
Projects
Certifications
🔐 User Authentication System
Secure login with hashed passwords
⚙️ Tech Stack
Frontend: React
Backend: Flask
Database: SQLite
Authentication: JWT (JSON Web Tokens)
ORM: SQLAlchemy
🏗️ System Architecture

The system follows a 3-tier architecture:

Frontend (React)
User interface
Quiz interaction
Dashboard visualization
Backend (Flask API)
Business logic
Scoring engine
Authentication
Database (SQLite)
Stores users, quiz data, results, and roadmaps
🔄 System Workflow
User → Login/Register → Attempt Quiz → Score Calculation → Domain Recommendation → Dashboard → Roadmap Display
🧮 Scoring Mechanism
Each quiz option maps to one or more domains
Each option has a weight (+1, +2, +3)
Scores are aggregated per domain
📊 Domain Selection:
Highest score → Recommended domain
📈 Confidence Score:
Confidence (%) = (Top Domain Score / Total Score) × 100
🧩 Modules
👤 User Module (Authentication & Profile)
📝 Quiz Module (Question Handling)
⚙️ Recommendation Engine (Scoring Logic)
📊 Dashboard Module (Visualization)
🗺️ Roadmap Module (Learning Path)
🗄️ Database Design

Main Tables:

Users
Questions
Quiz Attempts
Answers
Results
Domains
Roadmaps

Supports scalable multi-domain architecture

🧪 Testing
Unit Testing (Scoring logic)
Integration Testing (API endpoints)
Frontend Testing (UI validation)
End-to-End Testing (Full user flow)
⚠️ Limitations
Rule-based system (no ML yet)
Static roadmaps
Limited domain set (expandable)
No skill gap analysis
🚀 Future Scope
🤖 Machine Learning integration
📊 Personalized recommendations
🧠 Adaptive quiz system
📱 Mobile application
👥 Mentor system
📈 Advanced analytics dashboard
▶️ How to Run the Project
Backend:
pip install -r requirements.txt
python app.py
Frontend:
npm install
npm start
📌 Conclusion

CSE PathFinder transforms career confusion into structured clarity by combining logical evaluation with actionable roadmaps, helping students make informed decisions and follow a clear path toward their goals.
>>>>>>> 78969fc231cdf67f7f4923b11d15f81c15213c32
