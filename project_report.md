# Project Report: CSE PathFinder
**A Professional Career Diagnostic and Educational Roadmap Platform**

---

## 1. Introduction
**CSE PathFinder** is a modern full-stack web application designed to help Computer Science and Engineering students identify their ideal specialization. By utilizing situational logic diagnostics and dynamic academic roadmaps, the platform bridges the gap between general academic learning and specific industry-ready career paths.

## 2. Motivation & Objectives
Computer Science is a vast field with numerous sub-domains (AI, Web, IoT, Cybersecurity, etc.). Students often face decision paralysis when choosing a specialization.
**Key Objectives:**
- Provide clear, logic-based career recommendations.
- Offer actionable 4-year learning paths for each domain.
- Centralize high-quality learning resources (official docs, platforms, communities).
- Track student progress through a personalized dashboard.

## 3. Technology Stack
The project was recently modernized from a static architecture to a professional-grade React framework.

### 3.1 Frontend
- **Framework:** React.js (Component-based architecture)
- **Build Tool:** Vite (for high-speed performance)
- **Design System:** custom Glassmorphism UI (Dark Mode, Blur effects)
- **Icons:** Lucide-React
- **Responsiveness:** Fluid grid layouts and flex-box containers.

### 3.2 Backend
- **Framework:** Python Flask (REST API architecture)
- **Security:** SHA-256 password hashing, CORS protection, and secure session management.

### 3.3 Database
- **Engine:** SQLite (Relational DB)
- **Tables:** `students` (Profile management) and `quiz_results` (Analytical history).

## 4. System Architecture
The application follows a **Decoupled Architecture**:
- **Data Layer:** A centralized `domains.json` stores all domain intelligence, roadmaps, and resources. This allows for content updates without modifying the application code.
- **Service Layer (Flask):** Handles data persistence and authentication logic.
- **Presentation Layer (React):** Manages the user state, routing, and dynamic data rendering.

## 5. Core Features
### 5.1 Situational Logic Quiz
A 30-question diagnostic track for both **Software** and **Hardware** dimensions. Unlike simple multiple-choice tests, these situational questions analyze a student's logical preferences.

### 5.2 Dynamic 4-Year Roadmaps
Strategically structured learning paths divided into:
- **Year 1:** Foundations & Logic
- **Year 2:** Engineering Fundamentals
- **Year 3:** Advanced Specialization
- **Year 4:** Capstone & Industry Preparation

### 5.3 Learning HQ
A curated resource section within each roadmap that connects students directly to industry-standard documentation (MDN, AWS, ROS) and platforms (Kaggle, DataCamp).

## 6. Development & Modernization Process
The project underwent a significant **Modernization Phase**:
1. **Migration:** Refactored 30+ legacy HTML/JS files into an optimized React SPA.
2. **Path Optimization:** Consolidated static links into a dynamic JSON curriculum schema.
3. **Workspace Cleanup:** Purged 43+ legacy assets (approx. 60% reduction in source clutter).
4. **Backend Hardening:** Reconfigured the Flask server to serve the React production build (`dist/`) directly, improving security and performance.

## 7. Conclusion
CSE PathFinder successfully provides a structured, aesthetic, and technically robust solution for student career guidance. Its modular React-Flask-SQLite architecture ensures it can scale to include more domains or AI-driven recommendations in the future.

---
**Report Generated on:** April 12, 2026
