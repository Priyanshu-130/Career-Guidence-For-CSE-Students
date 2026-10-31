# 🎓 CSE PathFinder — Unified Career Guidance & Adaptive Assessment

> An evidence-based, transparent career navigation platform for Computer Science & Engineering (B.Tech CSE) undergraduates. Features topic-level adaptive placement, O*NET RIASEC career interest profiling, and ACM/IEEE CS2023 curriculum alignment.

---

## 📌 Honest Academic & Methodological Limitations (Viva Disclosure)

- **Rule-Based Adaptive Assessment**: The adaptive assessment engine operates on deterministic routing rules (`rules_version 1.0.0`) driven by a validated, curated item bank. It uses a Knowledge Ladder that promotes on 2 consecutive correct answers and demotes on 2 consecutive wrong answers.
- **Hypothesis v1 Career Mapping**: Career domain mappings are grounded in U.S. Department of Labor O*NET RIASEC vectors. They represent an **exploratory starting hypothesis**, not an objective career certainty or psychological verdict.
- **Experimental Machine Learning**: Any Random Forest models included in the ML exploration directory are trained on baseline synthetic benchmark data for curriculum exploration. In production and viva evaluations, the system runs transparently under **Rule-Based Mode (35/35/30)** without fabricating artificial placement success probabilities.
- **Empirical Pilot Study**: The initial pilot validation was conducted with $N = 18$ undergraduate computer science students (including 4 with zero prior programming experience). Read the full findings in [`PILOT_REPORT.md`](file:///c:/Users/priya/OneDrive/Desktop/js/frontend-react/src/data/adaptive/PILOT_REPORT.md).

---

## 🚀 Key Features

1. **Topic-Level Adaptive Assessment (`/assess`)**:
   - Zero-punishment diagnostic placement for beginners and experienced students alike.
   - Separate signals: **Knowledge** (strict correctness on objective items) vs. **Interest** (O*NET activities & behavioral engagement).
   - "I don't know" option on every question to diagnose knowledge gaps without guessing distortion.
   - Auto-triggers explanatory conceptual cards on demotions.
2. **"Explain My Result" & Admin Console (`/admin`)**:
   - Complete plain-English and mathematical breakdown showing which answers, times, and ladder events produced each topic level and domain recommendation.
   - Psychometric item analytics (facility index, IDK rates, discrimination index, and flags for too-easy, too-hard, or confusing questions).
   - Live retirement or re-approval of bank items by curriculum administrators.
3. **6 Verified Live Demonstration Benchmarks**:
   - Scenario 1: No prior programming experience $\rightarrow$ Level 0 onboarding route.
   - Scenario 2: Python experience $\rightarrow$ skips syntax basics straight into Level 2/3.
   - Scenario 3: Java proficiency with SQL novice $\rightarrow$ independent split topic assessment.
   - Scenario 4: High algorithmic foundations $\rightarrow$ deeper Bebras conceptual ladder items.
   - Scenario 5: Intermediate struggle $\rightarrow$ 2 wrong triggers prerequisite demotion & card review.
   - Scenario 6: Creative/Design background vs Systems background $\rightarrow$ customized domain affinity pathways.
4. **Curriculum Roadmap Alignment (`/roadmap/:id`)**:
   - 8-semester course roadmaps aligned with ACM/IEEE CS2023 curriculum guidelines.
   - Verified topic mastery ladder chart embedded directly in student analytics (`/results`).
5. **Open Content Licensing & Transparency**:
   - Fully cited questions sourced from O*NET (USDOL Developer License), Bebras Challenge (CC-BY-SA 4.0), and Code.org (CC BY-NC-SA 4.0).

---

## ⚙️ Routing & Ladder Configuration Rules

Configured in [`rules_version.json`](file:///c:/Users/priya/OneDrive/Desktop/js/frontend-react/src/data/adaptive/rules_version.json):
- **Quiz Question Mix**:
  - **Basic**: ~55% interest, ~25% logic, ~5% knowledge, ~15% guided activity
  - **Medium**: ~20% interest, ~15% logic, ~60% knowledge, ~5% guided activity
  - **Hard**: ~10% interest, ~10% logic, ~75% knowledge, ~5% guided activity
- **Knowledge Ladder**:
  - Promote: **2 consecutive correct answers** $\rightarrow$ level + 1
  - Demote: **2 consecutive incorrect answers** $\rightarrow$ level - 1 (activates prerequisite explainer)
  - Prior evidence skip rule: Students with $\ge 3$ verified correct items assessed within 30 days can skip redundant testing.

---

## 👥 How to Add Questions (Small Bank Growth Plan)

Classmates and curriculum mentors can contribute new questions by following [`CONTRIBUTING.md`](file:///c:/Users/priya/OneDrive/Desktop/js/frontend-react/src/data/adaptive/CONTRIBUTING.md):
1. Copy the JSON item template with all required fields (`id`, `category`, `topic`, `skills`, `difficulty`, `options`, `answer`, `explanation`, `license`).
2. Run the automated bank validator:
   ```bash
   python frontend-react/src/data/adaptive/validate_item_bank.py
   ```
3. New questions start in `status: "draft"`. Once checked against the peer review checklist, they are approved and served by the engine.

---

## 🧪 Running Automated Unit Tests

The test suite validates rules integrity, ladder state transitions, question mix ratios, explainability breakdowns, item analytics, and admin retirement actions:

```bash
cd frontend-react
npm test
```

Or run all adaptive test suites directly:
```bash
node --test src/data/adaptive/adaptiveEngine.test.js src/data/adaptive/analyticsEngine.test.js
```

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite 8, Chart.js, React Router DOM 7, Lucide Icons
- **Backend / Data**: Node.js & Python native services, SQLite (`database.db`), Browser LocalStorage resilient fallback
- **Author**: Priyanshu — B.Tech Computer Science & Engineering Student
