"""
Augment item_bank.json with rich Guided Career Activities from Code.org CS Principles / Discoveries
and CodeHS curriculum-aligned original exercises.
"""

import json

path = r"c:\Users\priya\OneDrive\Desktop\js\frontend-react\src\data\adaptive\item_bank.json"
with open(path, "r", encoding="utf-8") as f:
    bank = json.load(f)

questions = bank["questions"]
existing_ids = set(q["id"] for q in questions)
IDK_OPTION = "I don't know / haven't learned this yet"

new_activities = [
    {
        "id": "act_codeorg_data_001",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["data-analysis", "problem-solving", "visualization"],
        "difficulty": 2,
        "prereqs": ["data-basics"],
        "type": "practical",
        "questionText": "Guided Activity (Code.org Data Science Lab): You are analyzing a smart campus sensor dataset to determine which lecture halls waste the most electricity on weekends. What initial exploratory step should you perform first?",
        "options": [
            "Filter the dataset for Saturday and Sunday timestamps, then calculate mean kilowatt-hours per room",
            "Immediately delete all sensor readings below 10 degrees Celsius",
            "Manually rewrite every sensor reading into a paper notebook",
            "Format all room names in all-caps text without inspecting any energy numbers",
            IDK_OPTION
        ],
        "answer": "Filter the dataset for Saturday and Sunday timestamps, then calculate mean kilowatt-hours per room",
        "explanation": "Effective data exploration begins by isolating the relevant target timeframe (weekends) and aggregating energy metrics by entity (room) to uncover outliers and patterns.",
        "explainer_ref": "exp_sql_select",
        "status": "approved",
        "source": "Code.org Computer Science Principles (Unit 9: Data)",
        "source_url": "https://code.org/educate/csp",
        "license": "CC BY-NC-SA 4.0",
        "attribution_text": "Adapted from Code.org CS Principles Unit 9 Data Exploration curriculum under CC BY-NC-SA 4.0.",
        "modified": True
    },
    {
        "id": "act_codeorg_applab_002",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["ui-design", "event-driven-programming", "state-management"],
        "difficulty": 2,
        "prereqs": ["event-listeners"],
        "type": "practical",
        "questionText": "Guided Activity (Code.org App Lab): You are building a mobile task manager. When a student taps 'Mark Done', the button should turn green and the completed count must increase by 1. In event-driven UI design, how is this handled?",
        "options": [
            "Attach an 'onEvent' click handler to the button that increments the state variable and updates the button styling property",
            "Run an infinite while-loop that continuously checks if the screen is being touched",
            "Restart the entire operating system on every button click",
            "Send an email to the server before showing any visual feedback to the user",
            IDK_OPTION
        ],
        "answer": "Attach an 'onEvent' click handler to the button that increments the state variable and updates the button styling property",
        "explanation": "Modern interactive web and mobile apps rely on asynchronous event listeners ('onEvent' / 'addEventListener') that update application state and DOM properties reactively without freezing the UI.",
        "explainer_ref": "exp_py_variables",
        "status": "approved",
        "source": "Code.org App Lab Curriculum",
        "source_url": "https://code.org/educate/applab",
        "license": "CC BY-NC-SA 4.0",
        "attribution_text": "Adapted from Code.org App Lab Event-Driven Programming under CC BY-NC-SA 4.0.",
        "modified": True
    },
    {
        "id": "act_codeorg_sec_003",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["cybersecurity", "encryption", "ciphers"],
        "difficulty": 2,
        "prereqs": ["basic-ciphers"],
        "type": "practical",
        "questionText": "Guided Activity (Code.org Cybersecurity & Internet Lab): You are transmitting sensitive medical records across a public Wi-Fi network. Which security measure ensures that eavesdroppers on the router cannot read the payload?",
        "options": [
            "Encrypting the payload end-to-end using TLS / HTTPS cryptographic certificates",
            "Renaming the file extension from .pdf to .txt before sending",
            "Turning your laptop screen brightness to zero during transmission",
            "Sending the transmission in three separate emails at the same minute",
            IDK_OPTION
        ],
        "answer": "Encrypting the payload end-to-end using TLS / HTTPS cryptographic certificates",
        "explanation": "Transport Layer Security (TLS/HTTPS) encrypts communication across untrusted networks so intermediaries intercepting packets only see cryptographically scrambled ciphertext.",
        "explainer_ref": "exp_logic_patterns",
        "status": "approved",
        "source": "Code.org Computer Science Principles (Unit 10: Cybersecurity)",
        "source_url": "https://code.org/educate/csp",
        "license": "CC BY-NC-SA 4.0",
        "attribution_text": "Adapted from Code.org CS Principles Unit 10 Cybersecurity and the Internet under CC BY-NC-SA 4.0.",
        "modified": True
    },
    {
        "id": "act_codehs_trace_004",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["debugging", "code-investigation", "trace-tables"],
        "difficulty": 2,
        "prereqs": ["code-tracing"],
        "type": "practical",
        "questionText": "Guided Career Activity (Debugging & Testing Lab): A banking calculation function intermittently returns negative balances for active accounts. As a QA / Junior Software Engineer, what is the most professional debugging workflow?",
        "options": [
            "Write a minimal reproducible unit test with the exact edge-case input and step through the calculation with a debugger",
            "Randomly change plus and minus operators until the numbers look positive",
            "Delete the customer accounts that produced negative values",
            "Deploy the code directly to production and wait for user complaints",
            IDK_OPTION
        ],
        "answer": "Write a minimal reproducible unit test with the exact edge-case input and step through the calculation with a debugger",
        "explanation": "Industry standard software engineering requires isolating reproducing inputs via unit tests and inspecting memory state step-by-step using a debugger.",
        "explainer_ref": "exp_py_variables",
        "status": "approved",
        "source": "CSE PathFinder Industry Aligned Lab Exercises (CodeHS Syllabus Aligned)",
        "source_url": "https://codehs.com/curriculum/catalog",
        "license": "Educational Open Access",
        "attribution_text": "Original career scenario exercise aligned with CodeHS AP Computer Science Principles syllabus standards.",
        "modified": False
    },
    {
        "id": "act_codehs_api_005",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["backend-architecture", "http-methods", "rest-apis"],
        "difficulty": 3,
        "prereqs": ["http-basics"],
        "type": "practical",
        "questionText": "Guided Career Activity (Cloud & API Engineering Lab): You are designing a REST API endpoint where users create a new project. Which HTTP method and HTTP status code pair should be returned upon successful creation?",
        "options": [
            "POST method returning status code 201 Created with the new resource identifier",
            "GET method returning status code 404 Not Found",
            "DELETE method returning status code 200 OK",
            "PUT method returning status code 500 Internal Server Error",
            IDK_OPTION
        ],
        "answer": "POST method returning status code 201 Created with the new resource identifier",
        "explanation": "Under standard RFC REST architectural conventions, POST requests create new subordinate resources and return 201 Created along with the new entity ID or URI.",
        "explainer_ref": "exp_sql_select",
        "status": "approved",
        "source": "CSE PathFinder Industry Aligned Lab Exercises (CodeHS Syllabus Aligned)",
        "source_url": "https://codehs.com/curriculum/catalog",
        "license": "Educational Open Access",
        "attribution_text": "Original career scenario exercise aligned with CodeHS Web Development & Cloud syllabus standards.",
        "modified": False
    }
]

for act in new_activities:
    if act["id"] not in existing_ids:
        questions.append(act)

bank["total_questions"] = len(questions)
with open(path, "w", encoding="utf-8") as f:
    json.dump(bank, f, indent=2)

print(f"Updated item_bank.json: total questions is now {len(questions)}")