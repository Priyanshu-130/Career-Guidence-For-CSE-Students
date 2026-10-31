# Machine Learning Model Card: Career Role Prediction (Random Forest)

---

## 1. Model Details

- **Model Name**: CSE PathFinder Career Role Classifier (Experimental)
- **Model Architecture**: Random Forest Classifier (`ensemble.RandomForestClassifier` from Scikit-Learn)
- **Model Version**: 1.0.0-experimental
- **Model Status**: **EXPERIMENTAL ONLY**. The deterministic rule-based engine remains the default production system.
- **Primary Metrics Reported**: **Match Score** (heuristic alignment score on a 0–100 scale). **Never reported as "probability" or "accuracy"** because the model is not calibrated on real-world employment outcomes.

---

## 2. Training Data Source & Provenance

- **Dataset File**: `backend/test_data.csv`
- **Total Samples**: 20,000 rows
- **Total Features**: 38 input features + 1 target column (`Suggested Job Role`)
- **Target Classes**: 34 unique computer science and engineering job titles (e.g., Software Engineer, Data Architect, UX Designer, Information Security Analyst, Network Security Administrator).
- **Data Origin**: **Synthetic benchmark dataset**. 
  - The dataset was generated algorithmically through rule-based random sampling rather than empirically collected student or graduate career trajectories.
  - Class distribution: 33 of the 34 classes contain almost identical synthetic frequencies (~530 to ~600 rows each), while `Network Security Administrator` contains an overrepresented 1,112 rows.

---

## 3. Features & Known Data Quality Issues

The input features comprise:
1. **Academic Subject Scores**: Operating Systems, Algorithms, Programming Concepts, Software Engineering, Computer Networks, Electronics, Computer Architecture, Mathematics, Communication Skills.
2. **Behavioral & Extracurricular Ratings**: Hours working per day, Logical quotient rating, hackathons, coding skills rating, public speaking points, can work long time before system, self-learning capability, certifications, workshops, olympiads, reading/writing skills, memory capability.
3. **Spurious / Questionable Personal Attributes**:
   - `In a Realtionship?` (spurious binary flag with typo in dataset column)
   - `Gentle or Tuff behaviour?` (subjective temperament attribute)
   - `Interested Type of Books` (categories like *Prayer books*, *Cookbooks*, *Romance*, *Childrens*)
   - `Salary/work` (priority trade-off)
   - `Introvert` (binary self-rating)

### Key Finding on Spurious Correlations:
The model exhibits high apparent feature importance on variables like `Interested Type of Books` and `In a Realtionship?`. In real-world educational counseling, personal relationship status or preference for cookbooks has **zero proven causal or predictive bearing** on whether a student will succeed as a Database Administrator or UX Designer. These correlations are artifacts of the synthetic data generation script.

---

## 4. Cross-Validation Results & Critical Caveats

| Validation Strategy | Synthetic CV Metric | Real-World Validity |
| :--- | :--- | :--- |
| **5-Fold Cross Validation on `test_data.csv`** | ~85%–88% | **Unvalidated / Invalid for Real Students** |

> [!CAUTION]
> **Cross-Validation Caveat**:
> High cross-validation accuracy on synthetic or small benchmark data measures only the model's ability to memorize the synthetic generator's internal heuristics. **It does NOT predict real-world student success or career satisfaction.** Presenting synthetic CV metrics to students as "88% career prediction accuracy" is scientifically dishonest and prohibited in CSE PathFinder.

---

## 5. Ethical Considerations & Limitations

1. **No Stereotyping**: Algorithms must never steer students away from technical fields based on personality tags like "introvert" or relationship status.
2. **Non-Verdict Policy**: Predictions are heuristic suggestions, never authoritative verdicts or gates.
3. **Intended Use**: Academic research comparison, exploratory contrast with deterministic O*NET RIASEC mapping, and educational demonstration of ML limitations.
4. **Disallowed Use**: Formal academic counseling, admission screening, hiring filtering, or track restriction.

---

## 6. Architecture & Deployment Strategy

- **Rule-Based Engine as Default**: The production platform defaults to the multi-component rule-based engine:
  $$\text{Final Domain Match} = (0.35 \times \text{Interest RIASEC}) + (0.35 \times \text{Self-Reported Profile}) + (0.30 \times \text{Verified Technical Readiness})$$
- **Explicit Labeling**: The Random Forest option in the UI and `ConfigHandler` is strictly labeled **"Experimental Random Forest"**.
- **Display Terminology**: Outputs are displayed strictly as **"Match Score"**, never "probability" or "accuracy".
- **Feature Fallback**: When verified topic levels (Level 0–4) replace self-reported ratings, students without completed adaptive assessments automatically fall back to their self-reported baseline profile.
- **No Synthetic Retraining**: Under no circumstances will the team retrain the model on augmented synthetic data and present it as "improved accuracy".

---

## 7. Post-Pilot Recalibration Plan

1. **Pilot Telemetry**: Collect anonymous validation ratings ("Does this feel right? (1-5)") and optional qualitative feedback across the pilot cohort.
2. **Comparative Evaluation**: Compare student satisfaction between the O*NET-derived rule-based engine and the experimental Random Forest model.
3. **Retraining Gate**: A statistical machine learning model will **only be retrained if a representative, verified sample of real CSE student progression data ($N \ge 1,000$ real profiles) is collected with ethical consent**. If the pilot sample size is insufficient, the system will maintain the transparent rule-based engine and state the data limitation openly.
