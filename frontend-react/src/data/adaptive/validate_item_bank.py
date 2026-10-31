#!/usr/bin/env python3
"""
Item Bank Validator for CSE PathFinder
Rules:
  1. bank_version present and semantic.
  2. Every question has required schema fields: id, category, topic, skills, difficulty, prereqs, type, options, status, plus licensing fields.
  3. Objective questions (knowledge, logic, guided_activity) have 'answer' and 'explanation'.
  4. 'answer' MUST be present in 'options'.
  5. Interest questions have 'riasec' and NO 'answer'.
  6. Every question has 'I don't know' option.
  7. Strict license verification against approved list.
  8. Explainer cards reference check.
  9. Difficulty is strictly integer 1, 2, 3, or 4.
  10. Reports counts per topic, category, and difficulty.
"""

import json
import os
import sys

ALLOWED_LICENSES = [
    "CC-BY-SA 4.0",
    "CC-BY-SA 3.0",
    "CC BY-ND 4.0",
    "CC BY-NC-SA 4.0",
    "USDOL Developer License",
    "Educational Open Access"
]

VALID_CATEGORIES = {"interest", "logic", "knowledge", "guided_activity"}
VALID_TYPES = {"concept", "code-trace", "application", "logic", "practical"}
VALID_STATUSES = {"draft", "reviewed", "approved"}
IDK_SUBSTRING = "don't know"

def validate_bank(item_bank_path, explainer_cards_path):
    print("==================================================")
    print(" CSE PathFinder — Adaptive Item Bank Validator")
    print("==================================================")
    print(f"Loading item bank: {item_bank_path}")

    if not os.path.exists(item_bank_path):
        print(f"[FATAL] Item bank file not found: {item_bank_path}")
        return False

    with open(item_bank_path, "r", encoding="utf-8") as f:
        bank = json.load(f)

    # 1. Bank version check
    bank_version = bank.get("bank_version")
    if not bank_version:
        print("[FAIL] Missing top-level 'bank_version' field.")
        return False
    print(f"[OK] bank_version: {bank_version}")

    questions = bank.get("questions", [])
    print(f"[INFO] Total items in bank: {len(questions)}")

    # Load explainers for reference check
    valid_explainer_ids = set()
    if os.path.exists(explainer_cards_path):
        with open(explainer_cards_path, "r", encoding="utf-8") as f:
            expl_data = json.load(f)
            for exp in expl_data.get("explainers", []):
                valid_explainer_ids.add(exp.get("id"))
        print(f"[OK] Loaded {len(valid_explainer_ids)} explainer cards for reference verification.")

    errors = []
    seen_ids = set()

    # Metrics collectors
    counts_by_topic = {}
    counts_by_difficulty = {1: 0, 2: 0, 3: 0, 4: 0}
    counts_by_category = {}
    counts_by_status = {}
    sources_catalog = {}

    for idx, q in enumerate(questions):
        prefix = f"Item #{idx+1} [id: {q.get('id', 'MISSING')}]:"

        # Unique ID
        q_id = q.get("id")
        if not q_id:
            errors.append(f"{prefix} Missing required 'id'.")
        elif q_id in seen_ids:
            errors.append(f"{prefix} Duplicate ID '{q_id}'.")
        else:
            seen_ids.add(q_id)

        # Category
        cat = q.get("category")
        if cat not in VALID_CATEGORIES:
            errors.append(f"{prefix} Invalid category '{cat}'. Must be one of {VALID_CATEGORIES}.")
        counts_by_category[cat] = counts_by_category.get(cat, 0) + 1

        # Topic
        topic = q.get("topic")
        if not topic:
            errors.append(f"{prefix} Missing required 'topic'.")
        else:
            counts_by_topic[topic] = counts_by_topic.get(topic, 0) + 1

        # Skills & Prereqs
        skills = q.get("skills")
        if not isinstance(skills, list) or len(skills) == 0:
            errors.append(f"{prefix} 'skills' must be a non-empty list.")
        
        prereqs = q.get("prereqs")
        if not isinstance(prereqs, list):
            errors.append(f"{prefix} 'prereqs' must be a list (can be empty).")

        # Difficulty
        diff = q.get("difficulty")
        if diff not in [1, 2, 3, 4]:
            errors.append(f"{prefix} 'difficulty' must be an integer 1, 2, 3, or 4 (found: {diff}).")
        else:
            counts_by_difficulty[diff] = counts_by_difficulty.get(diff, 0) + 1

        # Type
        q_type = q.get("type")
        if q_type not in VALID_TYPES:
            errors.append(f"{prefix} Invalid type '{q_type}'. Must be one of {VALID_TYPES}.")

        # Question text
        q_text = q.get("questionText")
        if not q_text or len(q_text.strip()) < 5:
            errors.append(f"{prefix} Missing or overly brief 'questionText'.")

        # Options
        options = q.get("options")
        if not isinstance(options, list) or len(options) < 3:
            errors.append(f"{prefix} 'options' must be a list of at least 3 choices.")
        else:
            # Check for "I don't know" option
            has_idk = any(IDK_SUBSTRING in opt.lower() for opt in options)
            if not has_idk:
                errors.append(f"{prefix} Missing required 'I don't know' option in choices.")

        # Status
        status = q.get("status")
        if status not in VALID_STATUSES:
            errors.append(f"{prefix} Invalid status '{status}'. Must be one of {VALID_STATUSES}.")
        counts_by_status[status] = counts_by_status.get(status, 0) + 1

        # Licensing fields
        source = q.get("source")
        if not source:
            errors.append(f"{prefix} Missing required 'source'.")
        if "codehs" in str(source).lower():
            errors.append(f"{prefix} CodeHS content is prohibited (unconfirmed license). External links only.")

        license_name = q.get("license")
        if not license_name or license_name not in ALLOWED_LICENSES:
            errors.append(f"{prefix} Disallowed or missing license '{license_name}'. Allowed: {ALLOWED_LICENSES}.")

        attr_text = q.get("attribution_text")
        if not attr_text or len(attr_text.strip()) < 10:
            errors.append(f"{prefix} Missing or insufficient 'attribution_text'.")

        if not isinstance(q.get("modified"), bool):
            errors.append(f"{prefix} 'modified' must be a boolean.")

        # Record attribution for Credits generation
        key = (source, license_name, q.get("source_url", ""))
        if key not in sources_catalog:
            sources_catalog[key] = {
                "source": source,
                "license": license_name,
                "source_url": q.get("source_url", ""),
                "attribution_text": attr_text,
                "item_count": 0
            }
        sources_catalog[key]["item_count"] += 1

        # Explainer reference sanity
        exp_ref = q.get("explainer_ref")
        if exp_ref and valid_explainer_ids and exp_ref not in valid_explainer_ids:
            errors.append(f"{prefix} 'explainer_ref' '{exp_ref}' does not match any card in explainerCards.json.")

        # Logic / Knowledge / Guided Activity specifics
        if cat in ["knowledge", "logic", "guided_activity"]:
            answer = q.get("answer")
            if not answer:
                errors.append(f"{prefix} Objective items must specify 'answer'.")
            elif options and answer not in options:
                errors.append(f"{prefix} Answer '{answer}' was NOT found in the options list!")
            
            explanation = q.get("explanation")
            if not explanation or len(explanation.strip()) < 10:
                errors.append(f"{prefix} Objective items must provide a comprehensive 'explanation'.")

        # Interest specifics
        elif cat == "interest":
            riasec = q.get("riasec")
            if riasec not in ["R", "I", "A", "S", "E", "C"]:
                errors.append(f"{prefix} Interest items must specify valid 'riasec' code (R, I, A, S, E, or C).")
            if "answer" in q and q["answer"] is not None:
                errors.append(f"{prefix} Interest items must NOT have an 'answer' (they are subjective preference ratings).")

    # Final verdict
    if errors:
        print(f"\n[FAIL] Validator found {len(errors)} error(s):")
        for e in errors[:25]:
            print(f"  - {e}")
        if len(errors) > 25:
            print(f"  ... and {len(errors) - 25} more errors.")
        return False

    print("\n--------------------------------------------------")
    print(" ALL VALIDATION CHECKS PASSED PERFECTLY!")
    print("--------------------------------------------------")

    print("\n[METRICS: Breakdown by Topic]")
    for t, c in sorted(counts_by_topic.items()):
        print(f"  • {t:22}: {c} items")

    print("\n[METRICS: Breakdown by Difficulty]")
    for d, c in sorted(counts_by_difficulty.items()):
        print(f"  • Difficulty {d} (Level {d}): {c} items")

    print("\n[METRICS: Breakdown by Category]")
    for cat, c in sorted(counts_by_category.items()):
        print(f"  • {cat:16}: {c} items")

    print("\n[METRICS: Breakdown by Review Status]")
    for s, c in sorted(counts_by_status.items()):
        print(f"  • {s:12}: {c} items (Serving only 'approved')")

    # Generate Credits data artifact
    credits_list = list(sources_catalog.values())
    credits_path = os.path.join(os.path.dirname(item_bank_path), "credits_data.json")
    with open(credits_path, "w", encoding="utf-8") as f:
        json.dump({"credits": credits_list}, f, indent=2)
    print(f"\n[OK] Generated Credits data artifact: {credits_path}")

    return True

if __name__ == "__main__":
    base_dir = r"c:\Users\priya\OneDrive\Desktop\js\frontend-react\src\data\adaptive"
    bank_p = os.path.join(base_dir, "item_bank.json")
    expl_p = os.path.join(base_dir, "explainerCards.json")
    success = validate_bank(bank_p, expl_p)
    sys.exit(0 if success else 1)

