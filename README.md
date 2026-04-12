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
