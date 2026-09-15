package com.csepathfinder;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.File;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class App {

    private static final int PORT = 5000;
    private static final String DB_FILE = "backend-java/database.db";

    public static void main(String[] args) {
        try {
            File dbDir = new File("backend-java");
            if (!dbDir.exists()) {
                dbDir.mkdirs();
            }

            initDatabase();

            HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", PORT), 0);

            // API Routes
            server.createContext("/api/health", new HealthHandler());
            server.createContext("/api/register", new RegisterHandler());
            server.createContext("/api/login", new LoginHandler());
            server.createContext("/api/submit-result", new SubmitResultHandler());
            server.createContext("/api/results/", new GetResultsHandler());
            server.createContext("/api/progress/", new GetProgressHandler());
            server.createContext("/api/progress", new SaveProgressHandler());

            server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());

            System.out.println("==================================================");
            System.out.println("  CSE PathFinder Java Backend Server");
            System.out.println("  Listening on http://127.0.0.1:" + PORT);
            System.out.println("==================================================");

            server.start();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:" + DB_FILE);
    }

    private static void initDatabase() {
        try {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException ignored) {}

        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    college TEXT NOT NULL,
                    year TEXT NOT NULL,
                    branch TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            """);

            stmt.execute("""
                CREATE TABLE IF NOT EXISTS quiz_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_email TEXT NOT NULL,
                    quiz_type TEXT NOT NULL,
                    recommended_domain TEXT NOT NULL,
                    confidence_score REAL,
                    all_scores TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_email) REFERENCES students(email)
                );
            """);

            stmt.execute("""
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
                );
            """);
            System.out.println("[DB] SQLite database initialized at " + DB_FILE);
        } catch (SQLException e) {
            System.err.println("[DB] SQLite driver check: " + e.getMessage());
        }
    }

    private static String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return password;
        }
    }

    private static void enableCors(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) {
        try {
            enableCors(exchange);
            byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(statusCode, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws Exception {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    // Custom robust JSON parser
    private static Map<String, String> parseJsonMap(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.trim().isEmpty()) return map;

        String clean = json.trim();
        if (clean.startsWith("{")) clean = clean.substring(1);
        if (clean.endsWith("}")) clean = clean.substring(0, clean.length() - 1);

        int len = clean.length();
        int braceCount = 0;
        int bracketCount = 0;
        boolean inQuotes = false;
        StringBuilder currentPair = new StringBuilder();

        for (int i = 0; i < len; i++) {
            char c = clean.charAt(i);
            if (c == '"' && (i == 0 || clean.charAt(i - 1) != '\\')) {
                inQuotes = !inQuotes;
            } else if (!inQuotes) {
                if (c == '{') braceCount++;
                else if (c == '}') braceCount--;
                else if (c == '[') bracketCount++;
                else if (c == ']') bracketCount--;
            }

            if (c == ',' && !inQuotes && braceCount == 0 && bracketCount == 0) {
                processPair(currentPair.toString(), map);
                currentPair.setLength(0);
            } else {
                currentPair.append(c);
            }
        }
        if (currentPair.length() > 0) {
            processPair(currentPair.toString(), map);
        }
        return map;
    }

    private static void processPair(String pair, Map<String, String> map) {
        int idx = pair.indexOf(':');
        if (idx > 0) {
            String k = pair.substring(0, idx).trim().replaceAll("^\"|\"$", "");
            String v = pair.substring(idx + 1).trim();
            if (v.startsWith("\"") && v.endsWith("\"")) {
                v = v.substring(1, v.length() - 1);
            }
            map.put(k, v);
        }
    }

    // 1. GET /api/health
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            sendJsonResponse(exchange, 200, "{\"status\":\"ok\",\"message\":\"Java Backend server is reachable\"}");
        }
    }

    // 2. POST /api/register
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                Map<String, String> json = parseJsonMap(body);

                String name = json.getOrDefault("name", "").trim();
                String email = json.getOrDefault("email", "").trim().toLowerCase();
                String password = json.getOrDefault("password", "");
                String college = json.getOrDefault("college", "").trim();
                String year = json.getOrDefault("year", "").trim();
                String branch = json.getOrDefault("branch", "").trim();

                if (name.isEmpty() || email.isEmpty() || password.isEmpty() || college.isEmpty() || year.isEmpty() || branch.isEmpty()) {
                    sendJsonResponse(exchange, 400, "{\"status\":\"error\",\"message\":\"All fields are required.\"}");
                    return;
                }

                String hashed = hashPassword(password);

                try (Connection conn = getConnection();
                     PreparedStatement pstmt = conn.prepareStatement("INSERT INTO students (name, email, password, college, year, branch) VALUES (?, ?, ?, ?, ?, ?)")) {
                    pstmt.setString(1, name);
                    pstmt.setString(2, email);
                    pstmt.setString(3, hashed);
                    pstmt.setString(4, college);
                    pstmt.setString(5, year);
                    pstmt.setString(6, branch);
                    pstmt.executeUpdate();

                    System.out.println("[JAVA REGISTER] Registered: " + name + " (" + email + ")");
                    sendJsonResponse(exchange, 200, "{\"status\":\"success\",\"message\":\"Registration successful!\"}");
                } catch (SQLException e) {
                    if (e.getMessage() != null && e.getMessage().contains("UNIQUE")) {
                        sendJsonResponse(exchange, 409, "{\"status\":\"error\",\"message\":\"This email is already registered. Please login instead.\"}");
                    } else {
                        sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
                    }
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 3. POST /api/login
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 405, "{\"status\":\"error\",\"message\":\"Method Not Allowed\"}");
                return;
            }

            try {
                String body = readRequestBody(exchange);
                Map<String, String> json = parseJsonMap(body);
                String email = json.getOrDefault("email", "").trim().toLowerCase();
                String password = json.getOrDefault("password", "");

                if (email.isEmpty() || password.isEmpty()) {
                    sendJsonResponse(exchange, 400, "{\"status\":\"error\",\"message\":\"Email and password are required.\"}");
                    return;
                }

                String hashed = hashPassword(password);

                try (Connection conn = getConnection();
                     PreparedStatement pstmt = conn.prepareStatement("SELECT name, email, college, year, branch FROM students WHERE email = ? AND password = ?")) {
                    pstmt.setString(1, email);
                    pstmt.setString(2, hashed);
                    try (ResultSet rs = pstmt.executeQuery()) {
                        if (rs.next()) {
                            String name = rs.getString("name");
                            String col = rs.getString("college");
                            String yr = rs.getString("year");
                            String br = rs.getString("branch");

                            String respJson = String.format("{\"status\":\"success\",\"student\":{\"name\":\"%s\",\"email\":\"%s\",\"college\":\"%s\",\"year\":\"%s\",\"branch\":\"%s\"}}",
                                    name, email, col, yr, br);
                            System.out.println("[JAVA LOGIN] Logged in: " + name + " (" + email + ")");
                            sendJsonResponse(exchange, 200, respJson);
                        } else {
                            sendJsonResponse(exchange, 401, "{\"status\":\"error\",\"message\":\"Invalid email or password.\"}");
                        }
                    }
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 4. POST /api/submit-result
    static class SubmitResultHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            try {
                String body = readRequestBody(exchange);
                Map<String, String> json = parseJsonMap(body);

                String email = json.getOrDefault("student_email", "").trim().toLowerCase();
                String quizType = json.getOrDefault("quiz_type", "");
                String recommendedDomain = json.getOrDefault("recommended_domain", "");
                String confStr = json.getOrDefault("confidence_score", "0");
                double confScore = confStr.isEmpty() ? 0.0 : Double.parseDouble(confStr);
                String allScores = json.getOrDefault("all_scores", "{}");

                try (Connection conn = getConnection();
                     PreparedStatement pstmt = conn.prepareStatement("INSERT INTO quiz_results (student_email, quiz_type, recommended_domain, confidence_score, all_scores) VALUES (?, ?, ?, ?, ?)")) {
                    pstmt.setString(1, email);
                    pstmt.setString(2, quizType);
                    pstmt.setString(3, recommendedDomain);
                    pstmt.setDouble(4, confScore);
                    pstmt.setString(5, allScores);
                    pstmt.executeUpdate();

                    sendJsonResponse(exchange, 200, "{\"status\":\"success\",\"message\":\"Result saved successfully!\"}");
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 5. GET /api/results/{email}
    static class GetResultsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            try {
                String path = exchange.getRequestURI().getPath();
                String email = path.substring(path.lastIndexOf('/') + 1).trim().toLowerCase();

                try (Connection conn = getConnection();
                     PreparedStatement pstmt = conn.prepareStatement("SELECT quiz_type, recommended_domain, confidence_score, all_scores, timestamp FROM quiz_results WHERE student_email = ? ORDER BY timestamp DESC")) {
                    pstmt.setString(1, email);
                    try (ResultSet rs = pstmt.executeQuery()) {
                        StringBuilder sb = new StringBuilder("{\"status\":\"success\",\"results\":[");
                        boolean first = true;
                        while (rs.next()) {
                            if (!first) sb.append(",");
                            first = false;
                            String scores = rs.getString("all_scores");
                            if (scores == null || scores.trim().isEmpty() || !scores.trim().startsWith("{")) {
                                scores = "{}";
                            } else {
                                scores = scores.trim();
                            }
                            sb.append("{\"quiz_type\":\"").append(rs.getString("quiz_type") == null ? "" : rs.getString("quiz_type")).append("\",")
                              .append("\"recommended_domain\":\"").append(rs.getString("recommended_domain") == null ? "" : rs.getString("recommended_domain")).append("\",")
                              .append("\"confidence_score\":").append(rs.getDouble("confidence_score")).append(",")
                              .append("\"all_scores\":").append(scores).append(",")
                              .append("\"timestamp\":\"").append(rs.getString("timestamp") == null ? "" : rs.getString("timestamp")).append("\"}");
                        }
                        sb.append("]}");
                        sendJsonResponse(exchange, 200, sb.toString());
                    }
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 6. GET /api/progress/{email}
    static class GetProgressHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            try {
                String path = exchange.getRequestURI().getPath();
                String email = path.substring(path.lastIndexOf('/') + 1).trim().toLowerCase();

                try (Connection conn = getConnection();
                     PreparedStatement pstmt = conn.prepareStatement("SELECT domain_id, semester_num, course_title, status, notes, updated_at FROM student_progress WHERE student_email = ?")) {
                    pstmt.setString(1, email);
                    try (ResultSet rs = pstmt.executeQuery()) {
                        StringBuilder sb = new StringBuilder("{\"status\":\"success\",\"progress\":[");
                        boolean first = true;
                        while (rs.next()) {
                            if (!first) sb.append(",");
                            first = false;
                            sb.append(String.format("{\"domain_id\":\"%s\",\"semester_num\":%d,\"course_title\":\"%s\",\"status\":\"%s\",\"notes\":\"%s\",\"updated_at\":\"%s\"}",
                                    rs.getString("domain_id"),
                                    rs.getInt("semester_num"),
                                    rs.getString("course_title"),
                                    rs.getString("status"),
                                    rs.getString("notes") == null ? "" : rs.getString("notes"),
                                    rs.getString("updated_at")));
                        }
                        sb.append("]}");
                        sendJsonResponse(exchange, 200, sb.toString());
                    }
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }

    // 7. POST /api/progress
    static class SaveProgressHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendJsonResponse(exchange, 204, "");
                return;
            }
            try {
                String body = readRequestBody(exchange);
                Map<String, String> json = parseJsonMap(body);

                String email = json.getOrDefault("student_email", "").trim().toLowerCase();
                String domainId = json.getOrDefault("domain_id", "").trim();
                int semNum = Integer.parseInt(json.getOrDefault("semester_num", "1"));
                String courseTitle = json.getOrDefault("course_title", "").trim();
                String status = json.getOrDefault("status", "Not Started").trim();
                String notes = json.getOrDefault("notes", "").trim();

                try (Connection conn = getConnection()) {
                    PreparedStatement checkStmt = conn.prepareStatement("SELECT id FROM student_progress WHERE student_email = ? AND domain_id = ? AND semester_num = ? AND course_title = ?");
                    checkStmt.setString(1, email);
                    checkStmt.setString(2, domainId);
                    checkStmt.setInt(3, semNum);
                    checkStmt.setString(4, courseTitle);
                    ResultSet rs = checkStmt.executeQuery();

                    if (rs.next()) {
                        int id = rs.getInt("id");
                        PreparedStatement updateStmt = conn.prepareStatement("UPDATE student_progress SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                        updateStmt.setString(1, status);
                        updateStmt.setString(2, notes);
                        updateStmt.setInt(3, id);
                        updateStmt.executeUpdate();
                    } else {
                        PreparedStatement insertStmt = conn.prepareStatement("INSERT INTO student_progress (student_email, domain_id, semester_num, course_title, status, notes) VALUES (?, ?, ?, ?, ?, ?)");
                        insertStmt.setString(1, email);
                        insertStmt.setString(2, domainId);
                        insertStmt.setInt(3, semNum);
                        insertStmt.setString(4, courseTitle);
                        insertStmt.setString(5, status);
                        insertStmt.setString(6, notes);
                        insertStmt.executeUpdate();
                    }
                    sendJsonResponse(exchange, 200, "{\"status\":\"success\",\"message\":\"Progress saved successfully!\"}");
                }
            } catch (Exception e) {
                sendJsonResponse(exchange, 500, "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }
    }
}
