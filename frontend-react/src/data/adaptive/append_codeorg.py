import json

path = r"c:\Users\priya\OneDrive\Desktop\js\frontend-react\src\data\adaptive\item_bank.json"
with open(path, "r", encoding="utf-8") as f:
    bank = json.load(f)

qs = bank["questions"]
existing_ids = set(q["id"] for q in qs)
IDK_OPTION = "I don't know / haven't learned this yet"

extra_codeorg = [
    {
        "id": "act_codeorg_algo_006",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["algorithms", "compression", "run-length-encoding"],
        "difficulty": 2,
        "prereqs": ["binary-representation"],
        "type": "practical",
        "questionText": "Guided Activity (Code.org Digital Information Lab): In lossless image compression (Run-Length Encoding), the pixel sequence [W, W, W, W, B, B, B, W] is compressed by storing frequencies and colors. What is the standard encoded representation?",
        "options": [
            "4W 3B 1W (4 white, 3 black, 1 white)",
            "8WB (8 mixed black and white)",
            "W4 B3 W1 with half of the image pixels permanently discarded",
            "Delete all black pixels to save 50% file size",
            IDK_OPTION
        ],
        "answer": "4W 3B 1W (4 white, 3 black, 1 white)",
        "explanation": "Run-length encoding (RLE) condenses consecutive identical elements into a count followed by the symbol without losing any visual data (lossless).",
        "explainer_ref": "exp_logic_patterns",
        "status": "approved",
        "source": "Code.org Computer Science Principles (Unit 1: Digital Information)",
        "source_url": "https://code.org/educate/csp",
        "license": "CC BY-NC-SA 4.0",
        "attribution_text": "Adapted from Code.org CS Principles Unit 1 Digital Information compression labs under CC BY-NC-SA 4.0.",
        "modified": True
    },
    {
        "id": "act_codeorg_net_007",
        "category": "guided_activity",
        "topic": "career_activity",
        "skills": ["internet-protocols", "packet-routing", "dns"],
        "difficulty": 2,
        "prereqs": ["network-basics"],
        "type": "practical",
        "questionText": "Guided Activity (Code.org Internet Simulator): A browser requests 'https://example.org'. Before the packet can be routed to the web server, which fundamental Internet lookup protocol translates the human domain name into an IP address?",
        "options": [
            "Domain Name System (DNS)",
            "File Transfer Protocol (FTP)",
            "Simple Mail Transfer Protocol (SMTP)",
            "Dynamic Host Configuration Protocol (DHCP) only",
            IDK_OPTION
        ],
        "answer": "Domain Name System (DNS)",
        "explanation": "The Domain Name System (DNS) acts as the decentralized phonebook of the Internet, translating human-readable hostnames into numeric IP addresses.",
        "explainer_ref": "exp_logic_patterns",
        "status": "approved",
        "source": "Code.org Computer Science Principles (Unit 2: The Internet)",
        "source_url": "https://code.org/educate/csp",
        "license": "CC BY-NC-SA 4.0",
        "attribution_text": "Adapted from Code.org CS Principles Internet Simulator curriculum under CC BY-NC-SA 4.0.",
        "modified": True
    }
]

for item in extra_codeorg:
    if item["id"] not in existing_ids:
        qs.append(item)

bank["total_questions"] = len(qs)
with open(path, "w", encoding="utf-8") as f:
    json.dump(bank, f, indent=2)

print(f"Added extra Code.org activities. Total questions in bank: {len(qs)}")

