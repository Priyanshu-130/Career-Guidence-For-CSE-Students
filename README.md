# CSE PathFinder — Career Guidance & Adaptive Assessment Platform

> A transparent, evidence-based career guidance and adaptive diagnostic platform for **B.Tech CSE undergraduates in India**. Combines a deterministic Knowledge Ladder assessment, O*NET RIASEC profiling, India job-market demand data, bilingual learning resources, and ACM/IEEE CS2023 semester roadmaps with full offline fallback.

---

## Core Non-Negotiable Principles

1. **Deterministic Knowledge Ladder**: `2 consecutive correct -> +1 level`; `2 consecutive wrong -> -1 level` + conceptual prerequisite explainer card (`rules_version.json`).
2. **No Forced Guessing (`I don't know` + `Skip question`)**:
   - **I don't know (`IDK`)**: diagnoses foundational gaps transparently without random-guessing distortion.
   - **Skip question**: distinct from `IDK` — counts as neither correct nor incorrect, leaves promotion/demotion streaks unchanged, logs `"skipped"` in the audit trail, re-serves at most once near the end within the 25-item cap, and tracks item skip rate in `/admin` analytics.
3. **Configurable Single-Domain Weighted Recommendation** (`recommendation_config.json`):
   - `Final Score = 0.4 * RIASEC Euclidean Match + 0.3 * Knowledge-Ladder Readiness + 0.3 * India Market Demand`
   - Demand trend scores: `Rising = 1.0`, `Stable = 0.7`, `Saturated` / `Saturated at entry level = 0.4`, `Declining = 0.2`
   - Deterministic tie-breaking: higher RIASEC match wins.
4. **Full Explainability (`Explain my result`)**: Every question decision, ladder transition, weighted score contribution, and explanation of why lower-ranked domains scored below the winner is inspectable.
5. **Resilient Offline Fallback**: Bundles starter question banks, Phase 4 India market datasets, and roadmaps in `frontend-react/src/data/`, falling back to `localStorage` and `sessionStorage` whenever `backend/app.py` is offline.

---

## Architecture & Key Pages

| Route | View | Purpose |
| :--- | :--- | :--- |
| `/` | Home (`Home.jsx`) | Focused 1-line value proposition, 3-step workflow, single **Start Assessment** CTA |
| `/quiz` & `/quiz/:track` | Assessment (`QuizSelection.jsx`, `QuizRunner.jsx`) | Distraction-free single-question view with progress bar, large answer buttons, `I don't know`, and `Skip question` |
| `/results` | My Result (`Results.jsx`) | Single top recommended domain, **Why this one** (max 3 bullets), link to its domain page, and collapsible **Explain my result** audit log |
| `/domains` & `/domain/:id` | Domain Detail (`DomainsList.jsx`, `DomainDetail.jsx`) | 5 structured sections: (1) Overview (3 lines max), (2) Market Demand in India, (3) Market Value Booster, (4) Filterable Resources (`free`/`paid`, `English`/`Hindi`), (5) Semester Roadmap link |
| `/roadmap` & `/roadmap/:id` | Roadmap (`Roadmap.jsx`) | Interactive `roadmap.sh` visual topic graph + 8-semester CS2023 academic breakdown across canonical & hardware domains |
| `/admin` | Admin / Telemetry Console | Hidden from student `Sidebar.jsx` navigation; inspects facility index, IDK rates, skip rates, discrimination index, and item lifecycle (`draft` -> `approved` -> `retired`) |

Student sidebar navigation keeps exactly 4 items: **Home**, **Assessment**, **My Result**, and **Roadmap**. All layouts share the **Data sources and last updated** global footer (`DataSourcesFooter.jsx`).

---

## Phase 4 India Market & Resource Data Foundation (`/data`)

Versioned datasets live in `data/`:
- `data/domains.json` — 7 domains (`web`, `ai`, `data`, `cloud`, `security`, `mobile`, `systems`) mapped with O*NET codes and prerequisites.
- `data/market_demand.json` — Indicative India demand trends (`Rising`, `Stable`, `Declining`, `Saturated at entry level`), INR fresher salary ranges, hot skills, saturated skills, and source URLs.
- `data/market_boosters.json` — Core skills, high-value add-ons, declining skills, and a 3-step upgrade path per domain.
- `data/resources.json` — 56 curated learning resources (8 per domain) categorized by `beginner` / `intermediate` / `advanced`, `free` / `paid`, and `English` / `Hindi` language tags.

Unverified estimates retain `"verified": false` and display source + `last_updated` transparency banners.

---

## Getting Started

### Prerequisites
- **Node.js** (v20+ with native `node --test` runner)
- **Python 3.10+** (optional if running the Flask + SQLite backend; frontend also runs standalone with offline `localStorage` fallback)

### 1. Run Data Validation & Unit Tests
```powershell
# Validate Phase 4 JSON schemas, foreign keys, and 6-month freshness
node scripts/validate_data.js

# Run all 11 Node test suites
cd frontend-react
npm.cmd test
```

### 2. Run Locally (Full Stack)
Terminal 1 — Backend API (`http://127.0.0.1:5000`):
```powershell
python backend/app.py
```

Terminal 2 — React Frontend (`http://localhost:5173`):
```powershell
cd frontend-react
npm.cmd install
npm.cmd run dev
```

### 3. Production Build & Lint
```powershell
cd frontend-react
npm.cmd run build
npx.cmd eslint src/pages/QuizRunner.jsx src/pages/Results.jsx src/pages/DomainDetail.jsx
```

---

## Methodological & Academic Disclosures

- **Indicative Market Metrics**: India demand trends and INR fresher salary ranges reflect aggregated job-board and survey indicators with explicit source URLs and dates (`2026-11-01`). Salaries vary by city, college tier, and company.
- **Educational Hypothesis**: RIASEC matching builds on U.S. Department of Labor O*NET vectors (`domain_mapping_version.json`) under the USDOL Developer License and serves as transparent educational guidance rather than a psychological verdict.
- **Experimental ML Caveat**: Any Random Forest artifacts in `ml/` remain strictly labeled experimental (`ml/MODEL_CARD.md`); production recommendations run exclusively on the deterministic weighted rule-based engine.

---

## Tech Stack
- **Frontend**: React 19, Vite 8, React Router 7, Chart.js, Lucide Icons
- **Backend / Data**: Python Flask (`backend/app.py`), SQLite (`backend/database.db`), versioned JSON datasets (`/data`), browser `localStorage` / `sessionStorage` offline fallback
- **Testing & Validation**: Node `--test`, ESLint, `scripts/validate_data.js`
