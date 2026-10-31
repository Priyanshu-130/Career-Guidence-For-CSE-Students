# Contributing to the CSE PathFinder Assessment Question Bank

Thank you for contributing to the open question bank for CSE PathFinder! High quality, transparently licensed questions ensure students get fair, actionable feedback on their knowledge and genuine career interests.

---

## 1. Quality Over Quantity Standards

Every question in the bank must meet the following criteria before being served to students:
1. **Unambiguous**: A student who understands the concept will not be misled by tricky phrasing or multiple interpretations.
2. **One Definitively Correct Answer**: Objective questions (`knowledge`, `logic`, `guided_activity`) must have exactly one unambiguously correct answer (except for `interest` items which measure preferences and have no right/wrong answer).
3. **Accurate Difficulty Rating (1 to 4)**:
   - `1` = Introductory / Direct recall (e.g. syntax, naming, basic arithmetic).
   - `2` = Foundational application (e.g. simple 2–3 line code trace, basic filtering).
   - `3` = Intermediate problem-solving (e.g. nested conditions, joins, edge cases).
   - `4` = Advanced mastery (e.g. algorithmic complexity, concurrency, subtle error states).
4. **Valid Skill & Prerequisite Tags**: Must match standard ACM CS2023 undergraduate computing curriculum competencies.
5. **Universal "I don't know" Option**: Every question must include an option for *"I don't know / haven't learned this yet"*. Choosing this option is treated as clean diagnostic evidence of level 0 without penalizing the student's confidence.

---

## 2. Review and Lifecycle Process

```
[Draft] ---> (Validator Check) ---> [Reviewed] ---> (Peer Review Checklist) ---> [Approved] ---> Served to Students
```

- **`status: "draft"`**: Any newly authored question or AI-drafted question. **Draft items are never served to students.**
- **`status: "reviewed"`**: An item that has passed automated schema and license validation.
- **`status: "approved"`**: An item that has been verified by a second human reviewer using the checklist below. **Only approved items are loaded by the assessment engine.**

### Reviewer Checklist:
- [ ] No ambiguous wording or grammar issues.
- [ ] Correct answer is included in `options` and verified by running the code snippet.
- [ ] `explanation` clearly explains *why* the answer is correct and why common distractors fail.
- [ ] `explainer_ref` points to an existing conceptual card or official documentation link.
- [ ] Source, license, and attribution fields are complete and authentic.

---

## 3. Strict Content Licensing Guidelines

Every question MUST specify authentic licensing fields. The bank validator will reject any item with missing or disallowed licenses.

| Source | Permitted License | Attribution Requirements |
| :--- | :--- | :--- |
| **O*NET Interest Profiler** | CC BY-ND 4.0 or USDOL Developer License | State USDOL/ETA copyright + state if item was adapted for computing contexts. |
| **Bebras Tasks** | CC-BY-SA 4.0 / CC-BY-SA 3.0 | Attribute original Bebras country task + adaptations must use CC-BY-SA. |
| **Code.org** | CC BY-NC-SA 4.0 | Non-commercial, share-alike attribution. |
| **Original Classmate Work** | CC BY-SA 4.0 / Educational Open Access | Credit the student author / contributor name. |
| **CodeHS** | ❌ **PROHIBITED** | No confirmed open license. External linking out only; **never copy questions**. |

---

## 4. Question Item JSON Template

Copy this template when creating a new question:

```json
{
  "id": "py_know_025",
  "category": "knowledge",
  "topic": "python",
  "skills": ["dictionaries", "lookups"],
  "difficulty": 2,
  "prereqs": ["python-variables", "key-value-concepts"],
  "type": "code-trace",
  "questionText": "What does this Python code print?\n\nd = {'a': 1, 'b': 2}\nprint(d.get('c', 0))",
  "options": [
    "KeyError",
    "0",
    "None",
    "2",
    "I don't know / haven't learned this yet"
  ],
  "answer": "0",
  "explanation": "The dictionary .get(key, default) method returns the default value (0 in this case) if the key is not found in the dictionary, rather than raising a KeyError.",
  "explainer_ref": "exp_py_data_structures",
  "status": "approved",
  "source": "Original CSE PathFinder Question Bank",
  "source_url": "https://docs.python.org/3/library/stdtypes.html#dict.get",
  "license": "CC-BY-SA 4.0",
  "attribution_text": "Authored by CSE PathFinder Curriculum Team.",
  "modified": false
}
```

For interest items (`category: "interest"`):
- Omit `"answer"`.
- Include `"riasec"` (one of `"R"`, `"I"`, `"A"`, `"S"`, `"E"`, `"C"`).
- Options should represent preference ratings (e.g. Likert scale or domain preferences).

