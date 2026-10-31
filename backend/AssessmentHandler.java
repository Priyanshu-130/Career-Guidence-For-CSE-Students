package backend;

import java.sql.*;
import java.util.*;
import java.time.Instant;

/**
 * Java Handlers for CSE PathFinder Adaptive Assessment API
 *
 * Endpoints:
 * - POST /api/assess/profile
 * - GET  /api/assess/next-question
 * - POST /api/assess/answer
 * - GET  /api/assess/mastery/{email}
 * - GET  /api/assess/interests/{email}
 * - POST /api/assess/feedback
 *
 * Principles:
 * - Full evidence history: append-only, NEVER OVERWRITE
 * - SQLite JDBC persistence matching backend schema
 */
public class AssessmentHandler {

    private final String dbUrl;

    public AssessmentHandler(String dbPath) {
        this.dbUrl = "jdbc:sqlite:" + dbPath;
        initSchema();
    }

    public AssessmentHandler() {
        this("backend/database.db");
    }

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(dbUrl);
    }

    public void initSchema() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS assessment_sessions (
                    id TEXT PRIMARY KEY,
                    student_email TEXT NOT NULL,
                    intro_snapshot TEXT NOT NULL,
                    routing_decision TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'in_progress',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            stmt.execute("""
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
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS topic_mastery (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    student_email TEXT NOT NULL,
                    topic TEXT NOT NULL,
                    level INTEGER NOT NULL,
                    confidence TEXT NOT NULL,
                    evidence_count INTEGER NOT NULL DEFAULT 0,
                    last_assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS interest_scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    student_email TEXT NOT NULL,
                    riasec_vector TEXT NOT NULL,
                    domain_affinity TEXT NOT NULL,
                    mapping_version TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS result_feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    result_id TEXT NOT NULL,
                    student_email TEXT NOT NULL,
                    feels_right_rating INTEGER NOT NULL,
                    optional_comment TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """);
        } catch (SQLException e) {
            System.err.println("[AssessmentHandler] Failed to initialize SQLite schema: " + e.getMessage());
        }
    }

    /**
     * POST /api/assess/profile
     * Snapshot intro profile and initialize starting topic placements.
     */
    public Map<String, Object> handleProfile(Map<String, Object> requestBody) throws SQLException {
        String studentEmail = ((String) requestBody.get("student_email")).toLowerCase().trim();
        String sessionId = (String) requestBody.getOrDefault("session_id", "sess_" + UUID.randomUUID().toString().substring(0, 12));
        String introSnapshot = (String) requestBody.getOrDefault("intro_snapshot", "{}");
        String routingDecision = (String) requestBody.getOrDefault("routing_decision", "{}");

        String sqlSession = "INSERT INTO assessment_sessions (id, student_email, intro_snapshot, routing_decision, status) VALUES (?, ?, ?, ?, 'in_progress')";
        String sqlMastery = "INSERT INTO topic_mastery (session_id, student_email, topic, level, confidence, evidence_count, source) VALUES (?, ?, ?, ?, 'low', 0, 'self_report')";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try (PreparedStatement ps = conn.prepareStatement(sqlSession)) {
                ps.setString(1, sessionId);
                ps.setString(2, studentEmail);
                ps.setString(3, introSnapshot);
                ps.setString(4, routingDecision);
                ps.executeUpdate();
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> topics = (Map<String, Object>) requestBody.getOrDefault("initial_placements", Collections.emptyMap());
            try (PreparedStatement ps = conn.prepareStatement(sqlMastery)) {
                for (Map.Entry<String, Object> entry : topics.entrySet()) {
                    ps.setString(1, sessionId);
                    ps.setString(2, studentEmail);
                    ps.setString(3, entry.getKey());
                    int level = 0;
                    if (entry.getValue() instanceof Number) {
                        level = ((Number) entry.getValue()).intValue();
                    }
                    ps.setInt(4, level);
                    ps.addBatch();
                }
                ps.executeBatch();
            }
            conn.commit();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("session_id", sessionId);
        response.put("student_email", studentEmail);
        return response;
    }

    /**
     * GET /api/assess/next-question
     */
    public Map<String, Object> handleNextQuestion(String studentEmail, String topic, String sessionId) throws SQLException {
        String email = studentEmail.toLowerCase().trim();
        Set<String> askedQuestions = new HashSet<>();
        int currentLevel = 1;

        try (Connection conn = getConnection()) {
            // Retrieve asked question IDs for student
            try (PreparedStatement ps = conn.prepareStatement("SELECT question_id FROM assessment_attempts WHERE student_email = ?")) {
                ps.setString(1, email);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        askedQuestions.add(rs.getString("question_id"));
                    }
                }
            }

            // Retrieve latest mastery for topic
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT level FROM topic_mastery WHERE student_email = ? AND topic = ? ORDER BY last_assessed_at DESC LIMIT 1")) {
                ps.setString(1, email);
                ps.setString(2, topic);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        currentLevel = rs.getInt("level");
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "success");
        result.put("topic", topic);
        result.put("current_level", currentLevel);
        result.put("asked_count", askedQuestions.size());
        result.put("assigned_difficulty", currentLevel == 0 ? 1 : Math.min(3, currentLevel));
        result.put("explainer_first", currentLevel == 0);
        return result;
    }

    /**
     * POST /api/assess/answer
     * Append attempt and append new topic mastery checkpoint (NEVER OVERWRITE).
     */
    public Map<String, Object> handleAnswer(Map<String, Object> requestBody) throws SQLException {
        String sessionId = (String) requestBody.get("session_id");
        String studentEmail = ((String) requestBody.get("student_email")).toLowerCase().trim();
        String topic = (String) requestBody.get("topic");
        String questionId = (String) requestBody.get("question_id");
        String category = (String) requestBody.getOrDefault("category", "knowledge");
        String answer = (String) requestBody.getOrDefault("answer", "");
        boolean correct = Boolean.TRUE.equals(requestBody.get("correct"));
        double timeTaken = ((Number) requestBody.getOrDefault("time_taken", 0.0)).doubleValue();
        String bankVersion = (String) requestBody.getOrDefault("bank_version", "1.0.0");
        String rulesVersion = (String) requestBody.getOrDefault("rules_version", "1.0.0");
        boolean isDontKnow = Boolean.TRUE.equals(requestBody.get("is_dont_know")) || answer.contains("I don't know");

        int newLevel = 1;
        String confidence = "low";
        int evidenceCount = 1;
        String transitionEvent = "maintain";
        boolean prerequisiteGuidance = false;

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);

            // 1. Record Attempt
            try (PreparedStatement ps = conn.prepareStatement("""
                INSERT INTO assessment_attempts (session_id, student_email, topic, question_id, category, answer, correct, time_taken, bank_version, rules_version)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """)) {
                ps.setString(1, sessionId);
                ps.setString(2, studentEmail);
                ps.setString(3, topic);
                ps.setString(4, questionId);
                ps.setString(5, category);
                ps.setString(6, answer);
                ps.setInt(7, correct ? 1 : 0);
                ps.setDouble(8, timeTaken);
                ps.setString(9, bankVersion);
                ps.setString(10, rulesVersion);
                ps.executeUpdate();
            }

            // 2. Query previous mastery
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT level, evidence_count FROM topic_mastery WHERE student_email = ? AND topic = ? ORDER BY last_assessed_at DESC LIMIT 1")) {
                ps.setString(1, studentEmail);
                ps.setString(2, topic);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        newLevel = rs.getInt("level");
                        evidenceCount = rs.getInt("evidence_count") + 1;
                    }
                }
            }

            // 3. Query recent 2 attempts for topic
            List<Integer> recentCorrect = new ArrayList<>();
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT correct FROM assessment_attempts WHERE student_email = ? AND topic = ? ORDER BY timestamp DESC LIMIT 2")) {
                ps.setString(1, studentEmail);
                ps.setString(2, topic);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        recentCorrect.add(rs.getInt("correct"));
                    }
                }
            }

            if (correct && recentCorrect.size() >= 2 && recentCorrect.stream().allMatch(c -> c == 1)) {
                if (newLevel < 4) {
                    newLevel += 1;
                    transitionEvent = "promote";
                }
            } else if ((!correct) && recentCorrect.size() >= 2 && recentCorrect.stream().allMatch(c -> c == 0)) {
                if (newLevel > 0) {
                    newLevel -= 1;
                    transitionEvent = "demote";
                    prerequisiteGuidance = true;
                }
            } else if (isDontKnow && newLevel >= 2) {
                newLevel -= 1;
                transitionEvent = "demote";
                prerequisiteGuidance = true;
            }

            confidence = evidenceCount >= 4 ? "high" : (evidenceCount >= 2 ? "medium" : "low");

            // 4. Insert NEW mastery checkpoint (NEVER OVERWRITE)
            try (PreparedStatement ps = conn.prepareStatement("""
                INSERT INTO topic_mastery (session_id, student_email, topic, level, confidence, evidence_count, source)
                VALUES (?, ?, ?, ?, ?, ?, 'assessed')
            """)) {
                ps.setString(1, sessionId);
                ps.setString(2, studentEmail);
                ps.setString(3, topic);
                ps.setInt(4, newLevel);
                ps.setString(5, confidence);
                ps.setInt(6, evidenceCount);
                ps.executeUpdate();
            }

            conn.commit();
        }

        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("new_level", newLevel);
        res.put("confidence", confidence);
        res.put("evidence_count", evidenceCount);
        res.put("transition_event", transitionEvent);
        res.put("prerequisite_guidance", prerequisiteGuidance);
        return res;
    }

    /**
     * GET /api/assess/mastery/{email}
     * Returns latest mastery per topic and full append-only audit trail.
     */
    public Map<String, Object> handleMastery(String studentEmail) throws SQLException {
        String email = studentEmail.toLowerCase().trim();
        Map<String, Map<String, Object>> latest = new LinkedHashMap<>();
        List<Map<String, Object>> history = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "SELECT topic, level, confidence, evidence_count, last_assessed_at, source FROM topic_mastery WHERE student_email = ? ORDER BY last_assessed_at DESC")) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    String topic = rs.getString("topic");
                    row.put("topic", topic);
                    row.put("level", rs.getInt("level"));
                    row.put("confidence", rs.getString("confidence"));
                    row.put("evidence_count", rs.getInt("evidence_count"));
                    row.put("last_assessed_at", rs.getString("last_assessed_at"));
                    row.put("source", rs.getString("source"));

                    history.add(row);
                    if (!latest.containsKey(topic)) {
                        latest.put(topic, row);
                    }
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("current_mastery", latest);
        response.put("history", history);
        return response;
    }

    /**
     * GET /api/assess/interests/{email}
     */
    public Map<String, Object> handleInterests(String studentEmail) throws SQLException {
        String email = studentEmail.toLowerCase().trim();
        List<Map<String, Object>> history = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "SELECT session_id, riasec_vector, domain_affinity, mapping_version, timestamp FROM interest_scores WHERE student_email = ? ORDER BY timestamp DESC")) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("session_id", rs.getString("session_id"));
                    row.put("riasec_vector", rs.getString("riasec_vector"));
                    row.put("domain_affinity", rs.getString("domain_affinity"));
                    row.put("mapping_version", rs.getString("mapping_version"));
                    row.put("timestamp", rs.getString("timestamp"));
                    history.add(row);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("latest", history.isEmpty() ? null : history.get(0));
        response.put("history", history);
        return response;
    }

    /**
     * POST /api/assess/feedback
     * Store "Does this feel right? (1-5)" feedback.
     */
    public Map<String, Object> handleFeedback(Map<String, Object> requestBody) throws SQLException {
        String resultId = String.valueOf(requestBody.getOrDefault("result_id", "unknown"));
        String studentEmail = ((String) requestBody.get("student_email")).toLowerCase().trim();
        int rating = ((Number) requestBody.get("feels_right_rating")).intValue();
        String comment = (String) requestBody.getOrDefault("optional_comment", "");

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO result_feedback (result_id, student_email, feels_right_rating, optional_comment) VALUES (?, ?, ?, ?)")) {
            ps.setString(1, resultId);
            ps.setString(2, studentEmail);
            ps.setInt(3, rating);
            ps.setString(4, comment);
            ps.executeUpdate();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Feedback recorded successfully");
        return response;
    }
}
