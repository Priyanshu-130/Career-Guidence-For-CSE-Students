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
