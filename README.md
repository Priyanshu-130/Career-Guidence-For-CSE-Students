# 🎓 CSE PathFinder — Career Guidance for CSE Students

A full-stack web application that helps Computer Science & Engineering students explore career domains, take diagnostic quizzes, and get personalized roadmaps based on their interests and strengths.

---

## 🚀 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js + Vite, React Router DOM |
| Backend   | Python Flask, Flask-CORS          |
| Database  | SQLite                            |
| Styling   | Vanilla CSS + Tailwind System     |

---

## ✨ Core Features

- 🔐 **User Authentication** — Register & Login with hashed passwords (SHA-256)
- 🏠 **Dashboard** — Personalized home screen with diagnostic history & research-backed recommendations
- 🗂️ **Domain Explorer** — Browse CSE career domains split into Software & Hardware tracks
- 📄 **Domain Detail** — In-depth info, prerequisite skills, tech stacks, and academic sources for each domain
- 🗺️ **Interactive Roadmaps** — Step-by-step learning roadmap for every domain aligned with B.Tech curriculum
- 🧠 **Career Finder Quiz** — Diagnostic quiz using RIASEC trait matching to recommend the best-fit career domain
- 📊 **Results & History** — View past quiz results with match confidence scores
- ⚡ **One-click Startup** — `start_project.bat` launches both frontend & backend automatically

---

## 📚 Academic & Industry Methodology (Verified Sources)

All features in **CSE PathFinder** are grounded in trusted educational guidelines, academic computer science curricula, and industry market reports:

| Feature | Best Single Source | Rationale & Pedagogical Value |
| :--- | :--- | :--- |
| **1. Career Quizzes & RIASEC Matching** | [O*NET Interest Profiler](https://onetinterestprofiler.org/p/riasec) | Based on the U.S. Department of Labor's career-exploration system. Evaluates student activity preferences to recommend matching engineering specializations. |
| **2. Structured Learning Roadmaps** | [roadmap.sh](https://roadmap.sh/) | Provides clear visual milestone sequences in AI/Data Science, Web Dev, Cybersecurity, Cloud, and DevOps rather than overwhelming text curriculum documents. |
| **3. Year-by-Year Curriculum Alignment** | [ACM/IEEE CS2023 Student Competencies](https://csed.acm.org/final-report/) | Converts the ACM/IEEE undergraduate computer science competencies into structured 1st, 2nd, 3rd, and 4th-year university milestones. |
| **4. Software vs. Hardware/System Tracks** | [ACM/IEEE Computer Engineering Curricula CE2016](https://www.acm.org/binaries/content/assets/education/ce2016-final-report.pdf) | Establishes the relationship between hardware, software, computer architecture, embedded systems, and computer engineering. |
| **5. Project-Based Learning & Capstones** | [UVA CS Experiential Learning & Portfolio Guide](https://guides.lib.virginia.edu/seasthesis/cs) | Demonstrates how computing projects create documented real-world value for portfolios, organizations, and capstone evaluations. |
| **6. Market Demand, Skills, & Locations** | [WEF Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/) | Outlines global growing tech skills (AI, big data, cybersecurity, cloud, and technological literacy) to drive career readiness. |

---

## 📁 Project Structure
```text
js/
├── backend/
│   ├── app.py            # Flask REST API
│   ├── database.db       # SQLite database
│   └── requirements.txt  # Python dependencies
├── frontend-react/
│   └── src/
│       ├── pages/        # All page components
│       ├── components/   # TopNav, Sidebar, MiniQuiz
│       ├── context/      # AuthContext (global auth state)
│       ├── data/         # domains.json, careerQuestions.js
│       └── App.jsx       # Routes & layout
└── start_project.bat     # One-click launcher (Windows)
```

---
**Author**: Priyanshu — B.Tech CSE Student

