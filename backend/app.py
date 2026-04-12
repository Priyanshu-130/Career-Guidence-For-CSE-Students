import sqlite3
import hashlib
import json
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend-react', 'dist'))

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

DB_FILE = os.path.join(os.path.dirname(__file__), 'database.db')

def init_db():
    conn = sqlite3.connect(DB_FILE)
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
    conn.commit()
    conn.close()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def serve_index():
    # If the React dist folder exists, serve index.html
    if os.path.exists(os.path.join(FRONTEND_DIR, 'index.html')):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return "Backend is running. Frontend build (dist/) not found.", 200

@app.route('/api/health')
def health_check():
    return jsonify({"status": "ok", "message": "Backend server is reachable"}), 200

@app.route('/<path:filename>')
def serve_frontend(filename):
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
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
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO students (name, email, password, college, year, branch) VALUES (?, ?, ?, ?, ?, ?)',
            (name, email, hashed, college, year, branch)
        )
        conn.commit()
        conn.close()
        print(f"[REGISTER] New student registered: {name} ({email})")
        return jsonify({"status": "success", "message": "Registration successful!"})
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "This email is already registered. Please login instead."}), 409
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required."}), 400

    hashed = hash_password(password)

    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('SELECT name, email, college, year, branch FROM students WHERE email = ? AND password = ?', (email, hashed))
        row = c.fetchone()
        conn.close()

        if row:
            student = {
                "name": row[0],
                "email": row[1],
                "college": row[2],
                "year": row[3],
                "branch": row[4]
            }
            print(f"[LOGIN] Student logged in: {student['name']} ({student['email']})")
            return jsonify({"status": "success", "student": student})
        else:
            return jsonify({"status": "error", "message": "Invalid email or password."}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/submit-result', methods=['POST'])
def submit_result():
    data = request.json
    student_email = data.get('student_email', '').strip().lower()
    quiz_type = data.get('quiz_type', '')
    recommended_domain = data.get('recommended_domain', '')
    confidence_score = data.get('confidence_score', 0)
    all_scores = json.dumps(data.get('all_scores', {}))

    if not student_email or not quiz_type or not recommended_domain:
        return jsonify({"status": "error", "message": "Missing required fields."}), 400

    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO quiz_results (student_email, quiz_type, recommended_domain, confidence_score, all_scores) VALUES (?, ?, ?, ?, ?)',
            (student_email, quiz_type, recommended_domain, confidence_score, all_scores)
        )
        conn.commit()
        conn.close()
        print(f"[RESULT] Saved: {student_email} -> {recommended_domain} ({confidence_score:.1f}%)")
        return jsonify({"status": "success", "message": "Result saved successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/results/<email>', methods=['GET'])
def get_results(email):
    email = email.strip().lower()
    try:
        conn = sqlite3.connect(DB_FILE)
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
                "quiz_type": row[0],
                "recommended_domain": row[1],
                "confidence_score": row[2],
                "all_scores": json.loads(row[3]) if row[3] else {},
                "timestamp": row[4]
            })

        return jsonify({"status": "success", "results": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("=" * 50)
    print("  CSE PathFinder Backend Server")
    print("  Local URL: http://127.0.0.1:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
