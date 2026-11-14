import sqlite3
import hashlib
import json
import os
import re
import uuid
import datetime
import warnings
import joblib
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import market_data

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend-react', 'dist'))
DATA_ADAPTIVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend-react', 'src', 'data', 'adaptive'))
DATA_FOUNDATION_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Load pre-trained ML model & TF-IDF vectorizer once at startup (no retraining)
TFIDF_VECTORIZER = None
DOMAIN_MODEL = None
try:
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        vec_path = os.path.join(MODELS_DIR, 'tfidf_vectorizer.pkl')
        mod_path = os.path.join(MODELS_DIR, 'domain_model.pkl')
        if os.path.exists(vec_path) and os.path.exists(mod_path):
            TFIDF_VECTORIZER = joblib.load(vec_path)
            DOMAIN_MODEL = joblib.load(mod_path)
            print(f"[ML] Loaded domain_model.pkl ({len(DOMAIN_MODEL.classes_)} classes) & tfidf_vectorizer.pkl")
except Exception as ml_err:
    print(f"[ML] Warning: failed to load pre-trained models: {ml_err}")

try:
    market_data.init_market_data()
    print("[Market] Indian tech job market cache ready.")
except Exception as mkt_err:
    print(f"[Market] Warning: failed to initialize market data: {mkt_err}")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')

cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins != '*':
    cors_origins = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]

CORS(app, resources={r"/api/*": {"origins": cors_origins}, r"/data/*": {"origins": cors_origins}})

DB_FILE = os.environ.get('DB_PATH', os.path.join(os.path.dirname(__file__), 'database.db'))

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            college TEXT NOT NULL,
            year TEXT NOT NULL,
            branch TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_email TEXT NOT NULL,
            quiz_type TEXT NOT NULL,
            recommended_domain TEXT NOT NULL,
            confidence_score REAL,
            all_scores TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_email) REFERENCES students(email)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS student_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_email TEXT NOT NULL,
            domain_id TEXT NOT NULL,
            semester_num INTEGER NOT NULL,
            course_title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Not Started',
            notes TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_email) REFERENCES students(email),
            UNIQUE(student_email, domain_id, semester_num, course_title)
        )
    ''')
    
    # -------------------------------------------------------------
    # Phase 3 Adaptive Assessment Tables (Append-Only Evidence)
    # -------------------------------------------------------------
    c.execute('''
        CREATE TABLE IF NOT EXISTS assessment_sessions (
            id TEXT PRIMARY KEY,
            student_email TEXT NOT NULL,
            intro_snapshot TEXT NOT NULL,
            routing_decision TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'in_progress',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS assessment_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            student_email TEXT NOT NULL,
            topic TEXT NOT NULL,
            question_id TEXT NOT NULL,
            category TEXT NOT NULL,
            answer TEXT NOT NULL,
            correct INTEGER NOT NULL DEFAULT 0,
            time_taken REAL NOT NULL DEFAULT 0.0,
            bank_version TEXT NOT NULL,
            rules_version TEXT NOT NULL,
            metadata TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    try:
        c.execute('ALTER TABLE assessment_attempts ADD COLUMN metadata TEXT')
    except Exception:
        pass
    c.execute('''
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS topic_mastery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            student_email TEXT NOT NULL,
            topic TEXT NOT NULL,
            level INTEGER NOT NULL,
            confidence TEXT NOT NULL,
            evidence_count INTEGER NOT NULL DEFAULT 0,
            last_assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            source TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS interest_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            student_email TEXT NOT NULL,
            riasec_vector TEXT NOT NULL,
            domain_affinity TEXT NOT NULL,
            mapping_version TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS result_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            result_id TEXT NOT NULL,
            student_email TEXT NOT NULL,
            feels_right_rating INTEGER NOT NULL,
            optional_comment TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS domain_assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_email TEXT NOT NULL,
            domain_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            knowledge_score REAL NOT NULL,
            evaluation_report TEXT NOT NULL,
            roadmap_data TEXT NOT NULL,
            trajectory_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_email) REFERENCES students(email),
            UNIQUE(student_email, domain_id)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS domain_selections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_email TEXT UNIQUE NOT NULL,
            primary_domain TEXT NOT NULL,
            secondary_domains TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_email) REFERENCES students(email)
        )
    ''')
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def load_adaptive_json(filename):
    file_path = os.path.join(DATA_ADAPTIVE_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def load_foundation_json(filename):
    file_path = os.path.join(DATA_FOUNDATION_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

# -----------------------------------------------------------------
# Core Routes
# -----------------------------------------------------------------

@app.route('/')
def serve_index():
    if os.path.exists(os.path.join(FRONTEND_DIR, 'index.html')):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return "Backend is running. Frontend build (dist/) not found.", 200

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Backend server is reachable",
        "ml_model_loaded": DOMAIN_MODEL is not None and TFIDF_VECTORIZER is not None
    }), 200

# -----------------------------------------------------------------
# Pre-trained ML Model Inference & Indian Job Market Endpoints
# -----------------------------------------------------------------

DOMAIN_FALLBACK_KEYWORDS = {
    'ai': 'python machine learning deep learning tensorflow llm',
    'data': 'python sql data analysis pandas tableau power bi',
    'web': 'javascript react html css rest api node',
    'security': 'cybersecurity network security owasp cryptography siem',
    'cloud': 'aws docker kubernetes devops cloud linux terraform',
    'systems': 'linux networking troubleshooting itil java python',
    'iot': 'python c++ linux networking embedded',
    'robotics': 'python c++ machine learning computer vision',
    'vlsi': 'hardware architecture c++ linux verification',
    'networking': 'networking tcp/ip firewalls cloud linux',
}

@app.route('/api/predict-domain', methods=['POST'])
def predict_domain():
    if TFIDF_VECTORIZER is None or DOMAIN_MODEL is None:
        return jsonify({
            "status": "error",
            "message": "Pre-trained ML model files are not loaded on the server."
        }), 503

    data = request.json or {}
    raw_skills = data.get('skills', '')
    preferred_domain = str(data.get('preferred_domain', '')).strip().lower()

    if isinstance(raw_skills, list):
        skills_list = [str(s).strip() for s in raw_skills if str(s).strip()]
        skills_text = ', '.join(skills_list)
    else:
        skills_text = str(raw_skills).strip()
        skills_list = [s.strip() for s in re.split(r'[,;\n]+', skills_text) if s.strip()]

    inference_text = skills_text
    if not inference_text:
        if preferred_domain and preferred_domain in DOMAIN_FALLBACK_KEYWORDS:
            inference_text = DOMAIN_FALLBACK_KEYWORDS[preferred_domain]
        else:
            return jsonify({
                "status": "error",
                "message": "Please provide a 'skills' string or array to run domain prediction."
            }), 400

    try:
        features = TFIDF_VECTORIZER.transform([inference_text])
        probs = DOMAIN_MODEL.predict_proba(features)[0]
        classes = list(DOMAIN_MODEL.classes_)

        ranked = sorted(
            zip(classes, probs),
            key=lambda pair: float(pair[1]),
            reverse=True
        )

        top_predictions = [
            {
                "domain_label": str(label),
                "canonical_domain_id": market_data.CANONICAL_DOMAIN_MAP.get(str(label), 'ai'),
                "confidence_pct": round(float(prob) * 100, 1)
            }
            for label, prob in ranked[:3]
        ]

        primary_label = top_predictions[0]["domain_label"]
        market_bundle = market_data.get_domain_market_intelligence(primary_label, skills_list)

        return jsonify({
            "status": "success",
            "input_skills": skills_list,
            "primary_domain": primary_label,
            "canonical_domain_id": top_predictions[0]["canonical_domain_id"],
            "top_predictions": top_predictions,
            "market_insights": market_bundle["market_insights"],
            "skill_gap": market_bundle["skill_gap"],
            "job_listings": market_bundle["job_listings"]
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/market-insights/<domain_id>', methods=['GET'])
def get_market_insights(domain_id):
    raw_skills = request.args.get('skills', '')
    skills_list = [s.strip() for s in re.split(r'[,;\n]+', raw_skills) if s.strip()]
    bundle = market_data.get_domain_market_intelligence(domain_id, skills_list)
    return jsonify({
        "status": "success",
        **bundle
    }), 200

# -----------------------------------------------------------------
# Phase 4 Data Foundation Endpoints (/api/data/* and /data/*.json)
# -----------------------------------------------------------------

@app.route('/api/data/domains', methods=['GET'])
@app.route('/data/domains.json', methods=['GET'])
def get_foundation_domains():
    payload = load_foundation_json('domains.json')
    if payload is None:
        return jsonify({"status": "error", "message": "domains.json not found"}), 404

    domain_id = request.args.get('domain_id', '').strip().lower()
    if domain_id:
        filtered = [d for d in payload.get('domains', []) if d.get('id') == domain_id]
        return jsonify({**payload, "domains": filtered})
    return jsonify(payload)

@app.route('/api/data/domains/<domain_id>', methods=['GET'])
def get_foundation_domain_bundle(domain_id):
    domain_id = domain_id.strip().lower()
    domains_payload = load_foundation_json('domains.json')
    demand_payload = load_foundation_json('market_demand.json')
    boosters_payload = load_foundation_json('market_boosters.json')
    resources_payload = load_foundation_json('resources.json')

    if domains_payload is None:
        return jsonify({"status": "error", "message": "domains.json not found"}), 404

    domain_obj = next((d for d in domains_payload.get('domains', []) if d.get('id') == domain_id), None)
    if not domain_obj:
        return jsonify({"status": "not_found", "message": f"Domain '{domain_id}' not found"}), 404

    demand_obj = next(
        (m for m in (demand_payload or {}).get('market_demand', []) if m.get('domain_id') == domain_id),
        None
    )
    booster_obj = next(
        (b for b in (boosters_payload or {}).get('market_boosters', []) if b.get('domain_id') == domain_id),
        None
    )
    domain_resources = [
        r for r in (resources_payload or {}).get('resources', []) if r.get('domain_id') == domain_id
    ]

    return jsonify({
        "status": "success",
        "domain": domain_obj,
        "market_demand": demand_obj,
        "market_booster": booster_obj,
        "resources": domain_resources
    })

@app.route('/api/data/market-demand', methods=['GET'])
@app.route('/api/data/market_demand', methods=['GET'])
@app.route('/data/market_demand.json', methods=['GET'])
def get_foundation_market_demand():
    payload = load_foundation_json('market_demand.json')
    if payload is None:
        return jsonify({"status": "error", "message": "market_demand.json not found"}), 404

    domain_id = request.args.get('domain_id', '').strip().lower()
    trend = request.args.get('trend', '').strip().lower()
    items = payload.get('market_demand', [])

    if domain_id:
        items = [m for m in items if m.get('domain_id') == domain_id]
    if trend:
        items = [m for m in items if (m.get('demand_trend') or '').lower() == trend]

    if domain_id or trend:
        return jsonify({**payload, "market_demand": items})
    return jsonify(payload)

@app.route('/api/data/market-boosters', methods=['GET'])
@app.route('/api/data/market_boosters', methods=['GET'])
@app.route('/data/market_boosters.json', methods=['GET'])
def get_foundation_market_boosters():
    payload = load_foundation_json('market_boosters.json')
    if payload is None:
        return jsonify({"status": "error", "message": "market_boosters.json not found"}), 404

    domain_id = request.args.get('domain_id', '').strip().lower()
    if domain_id:
        items = [b for b in payload.get('market_boosters', []) if b.get('domain_id') == domain_id]
        return jsonify({**payload, "market_boosters": items})
    return jsonify(payload)

@app.route('/api/data/resources', methods=['GET'])
@app.route('/data/resources.json', methods=['GET'])
def get_foundation_resources():
    payload = load_foundation_json('resources.json')
    if payload is None:
        return jsonify({"status": "error", "message": "resources.json not found"}), 404

    domain_id = request.args.get('domain_id', '').strip().lower()
    cost = request.args.get('cost', '').strip().lower()
    level = request.args.get('level', '').strip().lower()
    res_type = request.args.get('type', '').strip().lower()
    language = request.args.get('language', '').strip().lower()

    items = payload.get('resources', [])
    if domain_id:
        items = [r for r in items if (r.get('domain_id') or '').lower() == domain_id]
    if cost:
        items = [r for r in items if (r.get('cost') or '').lower() == cost]
    if level:
        items = [r for r in items if (r.get('level') or '').lower() == level]
    if res_type:
        items = [r for r in items if (r.get('type') or '').lower() == res_type]
    if language:
        items = [r for r in items if language in (r.get('language') or '').lower()]

    if any([domain_id, cost, level, res_type, language]):
        return jsonify({**payload, "resources": items})
    return jsonify(payload)

@app.route('/<path:filename>')
def serve_frontend(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    college = data.get('college', '').strip()
    year = data.get('year', '').strip()
    branch = data.get('branch', '').strip()

    if not all([name, email, password, college, year, branch]):
        return jsonify({"status": "error", "message": "All fields are required."}), 400

    hashed = hash_password(password)

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            'INSERT INTO students (name, email, password, college, year, branch) VALUES (?, ?, ?, ?, ?, ?)',
            (name, email, hashed, college, year, branch)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Registration successful!"})
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "This email is already registered. Please login instead."}), 409
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required."}), 400

    hashed = hash_password(password)

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT name, email, college, year, branch FROM students WHERE email = ? AND password = ?', (email, hashed))
        row = c.fetchone()
        conn.close()

        if row:
            student = {
                "name": row["name"],
                "email": row["email"],
                "college": row["college"],
                "year": row["year"],
                "branch": row["branch"]
            }
            return jsonify({"status": "success", "student": student})
        else:
            return jsonify({"status": "error", "message": "Invalid email or password."}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/submit-result', methods=['POST'])
def submit_result():
    data = request.json or {}
    student_email = data.get('student_email', '').strip().lower()
    quiz_type = data.get('quiz_type', '')
    recommended_domain = data.get('recommended_domain', '')
    confidence_score = data.get('confidence_score', 0)
    all_scores = json.dumps(data.get('all_scores', {}))

    if not student_email or not quiz_type or not recommended_domain:
        return jsonify({"status": "error", "message": "Missing required fields."}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            'INSERT INTO quiz_results (student_email, quiz_type, recommended_domain, confidence_score, all_scores) VALUES (?, ?, ?, ?, ?)',
            (student_email, quiz_type, recommended_domain, confidence_score, all_scores)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Result saved successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/results/<email>', methods=['GET'])
def get_results(email):
    email = email.strip().lower()
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            'SELECT quiz_type, recommended_domain, confidence_score, all_scores, timestamp FROM quiz_results WHERE student_email = ? ORDER BY timestamp DESC',
            (email,)
        )
        rows = c.fetchall()
        conn.close()

        results = []
        for row in rows:
            results.append({
                "quiz_type": row["quiz_type"],
                "recommended_domain": row["recommended_domain"],
                "confidence_score": row["confidence_score"],
                "all_scores": json.loads(row["all_scores"]) if row["all_scores"] else {},
                "timestamp": row["timestamp"]
            })

        return jsonify({"status": "success", "results": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/progress/<email>', methods=['GET'])
def get_progress(email):
    email = email.strip().lower()
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute(
            'SELECT domain_id, semester_num, course_title, status, notes, updated_at FROM student_progress WHERE student_email = ?',
            (email,)
        )
        rows = c.fetchall()
        conn.close()

        progress = []
        for row in rows:
            progress.append({
                "domain_id": row["domain_id"],
                "semester_num": row["semester_num"],
                "course_title": row["course_title"],
                "status": row["status"],
                "notes": row["notes"] or "",
                "updated_at": row["updated_at"]
            })

        return jsonify({"status": "success", "progress": progress})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/progress', methods=['POST'])
def save_progress():
    data = request.json or {}
    student_email = data.get('student_email', '').strip().lower()
    domain_id = data.get('domain_id', '').strip()
    semester_num = data.get('semester_num')
    course_title = data.get('course_title', '').strip()
    status = data.get('status', 'Not Started').strip()
    notes = data.get('notes', '').strip()

    if not student_email or not domain_id or semester_num is None or not course_title:
        return jsonify({"status": "error", "message": "Missing required fields."}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT id FROM student_progress 
            WHERE student_email = ? AND domain_id = ? AND semester_num = ? AND course_title = ?
        ''', (student_email, domain_id, int(semester_num), course_title))
        row = c.fetchone()
        if row:
            c.execute('''
                UPDATE student_progress SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (status, notes, row["id"]))
        else:
            c.execute('''
                INSERT INTO student_progress (student_email, domain_id, semester_num, course_title, status, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (student_email, domain_id, int(semester_num), course_title, status, notes))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Progress saved successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# -----------------------------------------------------------------
# Phase 3: Adaptive Assessment Handlers
# (POST /api/assess/profile, GET /api/assess/next-question,
#  POST /api/assess/answer, GET /api/assess/mastery/{email},
#  GET /api/assess/interests/{email}, POST /api/assess/feedback)
# -----------------------------------------------------------------

@app.route('/api/assess/profile', methods=['POST'])
def assess_profile():
    data = request.json or {}
    student_email = data.get('student_email', '').strip().lower()
    intro_profile = data.get('intro_profile', {})
    starter_answers = data.get('starter_answers', [])
    session_id = data.get('session_id') or f"sess_{uuid.uuid4().hex[:12]}"

    if not student_email:
        return jsonify({"status": "error", "message": "student_email is required"}), 400

    # Evaluate logic diagnostic score
    correct_logic = 0
    total_logic = 0
    for ans in starter_answers:
        if ans.get('category') == 'logic' or 'logic' in ans.get('question_id', ''):
            total_logic += 1
            if ans.get('correct') or ans.get('isCorrect'):
                correct_logic += 1
    
    strong_logic = (correct_logic / total_logic >= 0.6) if total_logic > 0 else False

    # Derive starting level per topic
    topic_placements = {}
    topics_dict = intro_profile.get('topics', intro_profile) if isinstance(intro_profile, dict) else {}
    for topic, val in topics_dict.items():
        if topic in ['starter_answers', 'starterAnswers']: continue
        level_str = str(val.get('level') if isinstance(val, dict) else val).lower()
        if level_str in ['none', 'beginner', '0']:
            lvl = 1 if strong_logic else 0
        elif level_str in ['basic', 'foundational', '2']:
            lvl = 2
        elif level_str in ['intermediate', '3']:
            lvl = 3
        elif level_str in ['advanced', '4']:
            lvl = 4
        else:
            lvl = 0
        topic_placements[topic] = {
            "topic": topic,
            "level": lvl,
            "confidence": "low",
            "source": "self_report"
        }

    routing_decision = {
        "strong_logic": strong_logic,
        "starter_diagnostic_score": round(correct_logic / total_logic, 2) if total_logic > 0 else 0.0,
        "placements": topic_placements,
        "initial_topic": list(topic_placements.keys())[0] if topic_placements else "python"
    }

    try:
        conn = get_db_connection()
        c = conn.cursor()

        # Save session (never overwrite previous sessions)
        c.execute('''
            INSERT INTO assessment_sessions (id, student_email, intro_snapshot, routing_decision, status)
            VALUES (?, ?, ?, ?, 'in_progress')
        ''', (session_id, student_email, json.dumps(intro_profile), json.dumps(routing_decision)))

        # Insert initial topic_mastery checkpoints (never overwrite, append-only)
        for topic, p in topic_placements.items():
            c.execute('''
                INSERT INTO topic_mastery (session_id, student_email, topic, level, confidence, evidence_count, source)
                VALUES (?, ?, ?, ?, 'low', 0, 'self_report')
            ''', (session_id, student_email, topic, p["level"]))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "session_id": session_id,
            "routing_decision": routing_decision,
            "topic_placements": topic_placements
        }), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/assess/next-question', methods=['GET'])
def assess_next_question():
    student_email = request.args.get('email', '').strip().lower()
    topic = request.args.get('topic', 'python')
    session_id = request.args.get('session_id')
    requested_level = request.args.get('level')

    bank_data = load_adaptive_json('item_bank.json')
    questions = bank_data.get('questions', [])

    # Load previously asked question IDs for this session or student
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT question_id FROM assessment_attempts WHERE student_email = ?', (student_email,))
    asked_ids = set(r["question_id"] for r in c.fetchall())

    # Get current topic level
    level = 1
    if requested_level is not None:
        try:
            level = int(requested_level)
        except ValueError:
            level = 1
    else:
        c.execute('''
            SELECT level FROM topic_mastery 
            WHERE student_email = ? AND topic = ? 
            ORDER BY last_assessed_at DESC LIMIT 1
        ''', (student_email, topic))
        row = c.fetchone()
        if row:
            level = row["level"]
    conn.close()

    # Filter candidate questions matching topic and target difficulty
    target_difficulty = 1 if level in [0, 1] else (2 if level == 2 else 3)
    candidates = [q for q in questions if q.get('topic') == topic and q.get('id') not in asked_ids]
    if not candidates:
        candidates = [q for q in questions if q.get('id') not in asked_ids]
    
    # Match difficulty
    matched = [q for q in candidates if q.get('difficulty') == target_difficulty]
    chosen = matched[0] if matched else (candidates[0] if candidates else None)

    if not chosen:
        return jsonify({"status": "exhausted", "message": "No further unasked questions available"}), 200

    explainer_first = (level == 0)
    return jsonify({
        "status": "success",
        "question": chosen,
        "explainer_first": explainer_first,
        "assigned_difficulty": target_difficulty,
        "level": level
    }), 200

@app.route('/api/assess/answer', methods=['POST'])
def assess_answer():
    data = request.json or {}
    session_id = data.get('session_id')
    student_email = data.get('student_email', '').strip().lower()
    topic = data.get('topic', 'python')
    question_id = data.get('question_id', '')
    category = data.get('category', 'knowledge')
    answer = data.get('answer', '')
    correct = bool(data.get('correct'))
    time_taken = float(data.get('time_taken', 0.0))
    bank_version = data.get('bank_version', '1.0.0')
    rules_version = data.get('rules_version', '1.0.0')
    is_dont_know = bool(data.get('is_dont_know') or ("I don't know" in str(answer)))

    if not student_email or not question_id:
        return jsonify({"status": "error", "message": "student_email and question_id required"}), 400

    conn = get_db_connection()
    c = conn.cursor()

    # 1. Insert attempt into assessment_attempts (never overwrite)
    metadata = json.dumps({
        "selection_reason_code": data.get("selection_reason_code"),
        "evidence_gap_addressed": data.get("evidence_gap_addressed"),
        "post_activity_enjoyment": data.get("post_activity_enjoyment"),
        "post_activity_willingness": data.get("post_activity_willingness"),
        "hint_used": bool(data.get("hint_used", False))
    })
    try:
        c.execute('''
            INSERT INTO assessment_attempts (session_id, student_email, topic, question_id, category, answer, correct, time_taken, bank_version, rules_version, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (session_id, student_email, topic, question_id, category, answer, 1 if correct else 0, time_taken, bank_version, rules_version, metadata))
    except sqlite3.OperationalError:
        c.execute('''
            INSERT INTO assessment_attempts (session_id, student_email, topic, question_id, category, answer, correct, time_taken, bank_version, rules_version)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (session_id, student_email, topic, question_id, category, answer, 1 if correct else 0, time_taken, bank_version, rules_version))

    # 2. Get latest mastery for topic
    c.execute('''
        SELECT level, confidence, evidence_count FROM topic_mastery 
        WHERE student_email = ? AND topic = ? 
        ORDER BY last_assessed_at DESC LIMIT 1
    ''', (student_email, topic))
    row = c.fetchone()

    current_level = row["level"] if row else 1
    evidence_count = (row["evidence_count"] if row else 0) + 1

    # Check last 2 attempts for promote/demote
    c.execute('''
        SELECT correct FROM assessment_attempts 
        WHERE student_email = ? AND topic = ? 
        ORDER BY timestamp DESC LIMIT 2
    ''', (student_email, topic))
    recent_attempts = [r["correct"] for r in c.fetchall()]

    new_level = current_level
    transition_event = 'maintain'
    prerequisite_guidance = False

    if correct and len(recent_attempts) >= 2 and all(a == 1 for a in recent_attempts):
        if current_level < 4:
            new_level = current_level + 1
            transition_event = 'promote'
    elif (not correct) and len(recent_attempts) >= 2 and all(a == 0 for a in recent_attempts):
        if current_level > 0:
            new_level = current_level - 1
            transition_event = 'demote'
            prerequisite_guidance = True
    elif is_dont_know and current_level >= 2:
        new_level = current_level - 1
        transition_event = 'demote'
        prerequisite_guidance = True

    confidence = 'high' if evidence_count >= 4 else ('medium' if evidence_count >= 2 else 'low')

    # 3. Insert NEW topic_mastery checkpoint (NEVER OVERWRITE)
    c.execute('''
        INSERT INTO topic_mastery (session_id, student_email, topic, level, confidence, evidence_count, source)
        VALUES (?, ?, ?, ?, ?, ?, 'assessed')
    ''', (session_id, student_email, topic, new_level, confidence, evidence_count))

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "new_level": new_level,
        "confidence": confidence,
        "transition_event": transition_event,
        "prerequisite_guidance": prerequisite_guidance,
        "evidence_count": evidence_count
    })

@app.route('/api/assess/mastery/<email>', methods=['GET'])
def get_assess_mastery(email):
    email = email.strip().lower()
    conn = get_db_connection()
    c = conn.cursor()

    # Get latest mastery per topic
    c.execute('''
        SELECT topic, level, confidence, evidence_count, last_assessed_at, source 
        FROM topic_mastery 
        WHERE student_email = ? 
        ORDER BY last_assessed_at DESC
    ''', (email,))
    all_rows = c.fetchall()

    latest_by_topic = {}
    history = []
    for r in all_rows:
        item = {
            "topic": r["topic"],
            "level": r["level"],
            "confidence": r["confidence"],
            "evidence_count": r["evidence_count"],
            "last_assessed_at": r["last_assessed_at"],
            "source": r["source"]
        }
        history.append(item)
        if r["topic"] not in latest_by_topic:
            latest_by_topic[r["topic"]] = item

    conn.close()
    return jsonify({
        "status": "success",
        "current_mastery": latest_by_topic,
        "history": history
    })

@app.route('/api/assess/interests/<email>', methods=['GET'])
def get_assess_interests(email):
    email = email.strip().lower()
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('''
        SELECT session_id, riasec_vector, domain_affinity, mapping_version, timestamp 
        FROM interest_scores 
        WHERE student_email = ? 
        ORDER BY timestamp DESC
    ''', (email,))
    rows = c.fetchall()
    conn.close()

    history = []
    for r in rows:
        history.append({
            "session_id": r["session_id"],
            "riasec_vector": json.loads(r["riasec_vector"]) if r["riasec_vector"] else {},
            "domain_affinity": json.loads(r["domain_affinity"]) if r["domain_affinity"] else [],
            "mapping_version": r["mapping_version"],
            "timestamp": r["timestamp"]
        })

    latest = history[0] if history else None
    return jsonify({
        "status": "success",
        "latest": latest,
        "history": history
    })

@app.route('/api/assess/feedback', methods=['POST'])
def assess_feedback():
    data = request.json or {}
    result_id = str(data.get('result_id', 'unknown'))
    student_email = data.get('student_email', '').strip().lower()
    feels_right_rating = data.get('feels_right_rating')
    optional_comment = data.get('optional_comment', '')

    try:
        rating = int(feels_right_rating)
        if rating < 1 or rating > 5:
            return jsonify({"status": "error", "message": "Rating must be between 1 and 5"}), 400
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Rating must be an integer between 1 and 5"}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO result_feedback (result_id, student_email, feels_right_rating, optional_comment)
        VALUES (?, ?, ?, ?)
    ''', (result_id, student_email, rating, optional_comment))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Feedback recorded successfully"})

@app.route('/api/assess/session/<session_id>', methods=['GET'])
def get_session(session_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM assessment_sessions WHERE id = ?', (session_id,))
    row = c.fetchone()
    if not row:
        conn.close()
        return jsonify({"status": "error", "message": "Session not found"}), 404

    c.execute('SELECT * FROM assessment_attempts WHERE session_id = ? ORDER BY timestamp ASC', (session_id,))
    attempts = [dict(r) for r in c.fetchall()]

    c.execute('SELECT * FROM topic_mastery WHERE session_id = ? ORDER BY last_assessed_at ASC', (session_id,))
    mastery = [dict(r) for r in c.fetchall()]

    conn.close()
    return jsonify({
        "status": "success",
        "session": {
            "id": row["id"],
            "student_email": row["student_email"],
            "intro_snapshot": json.loads(row["intro_snapshot"]) if row["intro_snapshot"] else {},
            "routing_decision": json.loads(row["routing_decision"]) if row["routing_decision"] else {},
            "status": row["status"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"]
        },
        "attempts": attempts,
        "mastery": mastery
    })

@app.route('/api/assess/session', methods=['POST'])
def save_session():
    data = request.json or {}
    session_id = data.get('id') or f"sess_{uuid.uuid4().hex[:12]}"
    student_email = data.get('student_email', '').strip().lower()
    intro_snapshot = json.dumps(data.get('intro_snapshot', {}))
    routing_decision = json.dumps(data.get('routing_decision', {}))
    status = data.get('status', 'in_progress')

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT OR REPLACE INTO assessment_sessions (id, student_email, intro_snapshot, routing_decision, status, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ''', (session_id, student_email, intro_snapshot, routing_decision, status))
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "session_id": session_id})

# -----------------------------------------------------------------
# Domain-Specific Assessments, Roadmaps & Comparison Routes
# -----------------------------------------------------------------

@app.route('/api/domain-assessment/save', methods=['POST'])
def save_domain_assessment():
    data = request.json or {}
    student_email = data.get('student_email', '').strip().lower()
    domain_id = data.get('domain_id', '').strip()
    session_id = data.get('session_id') or f"dom_{uuid.uuid4().hex[:10]}"
    knowledge_score = float(data.get('knowledge_score', 0))
    evaluation_report = json.dumps(data.get('evaluation_report', {}))
    roadmap_data = json.dumps(data.get('roadmap_data', {}))
    trajectory_data = json.dumps(data.get('trajectory_data', {}))

    if not student_email or not domain_id:
        return jsonify({"status": "error", "message": "student_email and domain_id are required"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            INSERT INTO domain_assessments (student_email, domain_id, session_id, knowledge_score, evaluation_report, roadmap_data, trajectory_data, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(student_email, domain_id) DO UPDATE SET
                session_id = excluded.session_id,
                knowledge_score = excluded.knowledge_score,
                evaluation_report = excluded.evaluation_report,
                roadmap_data = excluded.roadmap_data,
                trajectory_data = excluded.trajectory_data,
                created_at = CURRENT_TIMESTAMP
        ''', (student_email, domain_id, session_id, knowledge_score, evaluation_report, roadmap_data, trajectory_data))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": f"Domain assessment for {domain_id} saved successfully", "domain_id": domain_id})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/domain-assessment/<email>/<domain_id>', methods=['GET'])
def get_domain_assessment(email, domain_id):
    email = email.strip().lower()
    domain_id = domain_id.strip()
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT student_email, domain_id, session_id, knowledge_score, evaluation_report, roadmap_data, trajectory_data, created_at
            FROM domain_assessments
            WHERE student_email = ? AND domain_id = ?
        ''', (email, domain_id))
        row = c.fetchone()
        conn.close()

        if not row:
            return jsonify({"status": "not_found", "message": f"No assessment recorded for {domain_id}"}), 404

        return jsonify({
            "status": "success",
            "assessment": {
                "student_email": row["student_email"],
                "domain_id": row["domain_id"],
                "session_id": row["session_id"],
                "knowledge_score": row["knowledge_score"],
                "evaluation_report": json.loads(row["evaluation_report"]) if row["evaluation_report"] else {},
                "roadmap_data": json.loads(row["roadmap_data"]) if row["roadmap_data"] else {},
                "trajectory_data": json.loads(row["trajectory_data"]) if row["trajectory_data"] else {},
                "created_at": row["created_at"]
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/domain-assessments/<email>', methods=['GET'])
def get_all_domain_assessments(email):
    email = email.strip().lower()
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT student_email, domain_id, session_id, knowledge_score, evaluation_report, roadmap_data, trajectory_data, created_at
            FROM domain_assessments
            WHERE student_email = ?
            ORDER BY created_at DESC
        ''', (email,))
        rows = c.fetchall()
        conn.close()

        assessments = []
        for row in rows:
            assessments.append({
                "student_email": row["student_email"],
                "domain_id": row["domain_id"],
                "session_id": row["session_id"],
                "knowledge_score": row["knowledge_score"],
                "evaluation_report": json.loads(row["evaluation_report"]) if row["evaluation_report"] else {},
                "roadmap_data": json.loads(row["roadmap_data"]) if row["roadmap_data"] else {},
                "trajectory_data": json.loads(row["trajectory_data"]) if row["trajectory_data"] else {},
                "created_at": row["created_at"]
            })

        return jsonify({"status": "success", "assessments": assessments})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/domain-selection/save', methods=['POST'])
def save_domain_selection():
    data = request.json or {}
    student_email = data.get('student_email', '').strip().lower()
    primary_domain = data.get('primary_domain', '').strip()
    secondary_domains = json.dumps(data.get('secondary_domains', []))

    if not student_email or not primary_domain:
        return jsonify({"status": "error", "message": "student_email and primary_domain are required"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            INSERT INTO domain_selections (student_email, primary_domain, secondary_domains, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(student_email) DO UPDATE SET
                primary_domain = excluded.primary_domain,
                secondary_domains = excluded.secondary_domains,
                updated_at = CURRENT_TIMESTAMP
        ''', (student_email, primary_domain, secondary_domains))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Domain selections updated successfully", "primary_domain": primary_domain})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/domain-selection/<email>', methods=['GET'])
def get_domain_selection(email):
    email = email.strip().lower()
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            SELECT student_email, primary_domain, secondary_domains, updated_at
            FROM domain_selections
            WHERE student_email = ?
        ''', (email,))
        row = c.fetchone()
        conn.close()

        if not row:
            return jsonify({"status": "not_found", "message": "No domain selections recorded"}), 404

        return jsonify({
            "status": "success",
            "selection": {
                "student_email": row["student_email"],
                "primary_domain": row["primary_domain"],
                "secondary_domains": json.loads(row["secondary_domains"]) if row["secondary_domains"] else [],
                "updated_at": row["updated_at"]
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Initialize DB schema on module load
init_db()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    print("=" * 50)
    print("  CSE PathFinder Backend Server")
    print(f"  Listening on host 0.0.0.0, port {port} (debug={debug})")
    print("=" * 50)
    app.run(host='0.0.0.0', port=port, debug=debug)
