# Changelog

All notable milestone changes across Phases 1–7 of **CSE PathFinder**.

## [Phase 7] — Polish, Offline Resilience, Responsiveness & Documentation (2026-11-14)
### Fixed & Improved
- **Offline Persistence**: Added `DOMAIN_ASSESSMENTS` (`cpath_domain_assessments`) and `LATEST_RESULTS` (`cpath_latest_quiz_results`) to `STORAGE_KEYS` in `frontend-react/src/services/apiService.js` so offline domain roadmaps and completed assessment results do not store under `undefined` keys.
- **Cross-Page Offline Reloads**: Persisted completed results to `localStorage` (`cpath_latest_quiz_results`) in `QuizRunner.jsx`, read `current_mastery || mastery` and offline cache fallback in `Results.jsx`, and updated `RoadmapEntry` in `App.jsx` to resolve the user's latest domain offline.
- **Responsive Breakpoints (`360px`, `768px`, `1280px`)**: Expanded responsive layout rules in `frontend-react/src/index.css` covering narrow `360px` viewports (preventing button/card overflow), `768px` tablet stacking, and `1280px` desktop widths.
- **End-to-End Verification & Docs**: Added `frontend-react/src/pages/phase7EndToEndPolish.test.js`, updated `README.md`, and created `CHANGELOG.md`.

## [Phase 6] — Single-Domain Weighted Recommendation Engine
### Added
- **Configurable Scoring (`recommendation_config.json`)**: Externalized factor weights (`0.4` RIASEC, `0.3` Knowledge-Ladder Readiness, `0.3` India Market Demand) and trend score mappings (`Rising=1.0`, `Stable=0.7`, `Saturated=0.4`, `"Saturated at entry level"=0.4`, `Declining=0.2`).
- **Recommendation Engine (`recommendationEngine.js`)**: Implemented 6D RIASEC Euclidean distance matching, weighted candidate scoring, deterministic RIASEC tie-breaking, concise `"Why this one"` generation (max 3 bullets), and per-domain `"whyRankedLower"` explanations.
- **Focused Results View (`Results.jsx`)**: Updated Results to display strictly the single winning specialization, max 3 `"Why this one"` bullets, primary button to its `/domain/:id` page, and full weighted breakdown + runner-up rankings inside the `"Explain my result"` toggle.
- **Tests (`phase6Recommendation.test.js`)**: Verified weights, demand mappings, Euclidean distance, tie-breaking determinism regardless of candidate ordering, and Results/Explainability integration.

## [Phase 5] — Domain Detail Restructure & Global Data Sources Footer
### Added
- **Phase 4 Data Loader (`phase4DataLoader.js`)**: Unified `/data/*.json` loader supporting canonical Phase 4 domains (`web`, `ai`, `data`, `cloud`, `security`, `mobile`, `systems`) and legacy hardware aliases (`iot`, `robotics`, `vlsi`, `networking`), plus level grouping and cost/language filtering.
- **Structured Domain Page (`DomainDetail.jsx`)**: Removed inline mini-quizzes and organized content into 5 sections: (1) Overview clamped to 3 lines, (2) Market Demand in India (trend, INR fresher range, `last_updated`), (3) Market Value Booster (core, high-value add-ons, declining/saturated skills, 3-step upgrade path), (4) Resources grouped by level and filterable by Free/Paid and English/Hindi, (5) Link to `/roadmap/:id`.
- **Global Footer (`DataSourcesFooter.jsx`)**: Added data-source attributions, indicative disclaimer, and last-updated stamp across public, protected student, and admin layouts.
- **Tests (`phase5DomainPage.test.js`)**: Verified loader aliases, filtering, 5-section order, `MiniQuiz` removal, and footer integration.

## [Phase 4] — Versioned India Market & Resource Data Foundation
### Added
- **Versioned JSON Datasets (`/data`)**: Seeded `domains.json`, `market_demand.json`, `market_boosters.json`, and `resources.json` across 7 CSE domains with 56 resources (`8` per domain), flagging unverified entries with `"verified": false`.
- **Backend Endpoints (`backend/app.py`)**: Added `/api/data/domains`, `/api/data/domains/<domain_id>`, `/api/data/market-demand`, `/api/data/market-boosters`, and `/api/data/resources`.
- **Schema & Freshness Validator (`scripts/validate_data.js`)**: Automated check for schema validity, referential integrity, minimum resource counts, broken URLs, and 6-month freshness (`183` days) paired with `phase4DataFoundation.test.js`.

## [Phase 3] — Non-Destructive "Skip Question" Assessment Action
### Added
- **Skip Action (`QuizRunner.jsx`, `adaptiveEngine.js`, `domainAdvisorAgent.js`)**: Added **Skip question** alongside **I don't know** on every assessment item. Skipped items leave promotion/demotion streaks intact, log `"skipped"` in the audit trail, re-serve at most once near the end within the 25-item cap, and record `skipRate` in `analyticsEngine.js` + `/admin`.
- **Unit Tests**: Added streak, logging, re-serve limit, and 25-item cap tests in `adaptiveEngine.test.js`, `analyticsEngine.test.js`, and `domainAdvisorAgent.test.js`.

## [Phase 2] — Vellum WCAG AA Design System & Readability Polish
### Improved
- Introduced CSS design tokens in `frontend-react/src/index.css` (`16px` minimum body text, `8px` spacing scale, WCAG AA contrast colors, visible `:focus-visible` keyboard outlines, and loading/empty/error states).
- Redesigned quiz runner and results flow into focused single-question screens with one primary action per view.

## [Phase 1] — UI Decluttering & Simplified Navigation
### Changed
- Removed student-facing telemetry strips and system panels, simplified sidebar navigation (`Sidebar.jsx`) to 4 items (**Home**, **Assessment**, **My Result**, **Roadmap**), streamlined `Home.jsx`, and moved the telemetry/psychometrics console to a hidden `/admin` route.
