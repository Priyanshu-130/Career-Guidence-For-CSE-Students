const API_BASE = "http://127.0.0.1:5000";

function getStudent() {
    const raw = sessionStorage.getItem("cse_student");
    if (raw) {
        try { return JSON.parse(raw); } catch (e) { return null; }
    }
    return null;
}

function checkAuth() {
    const student = getStudent();
    const path = window.location.pathname;

    if (!student && !path.includes("login.html")) {
        window.location.href = "login.html";
    }
    if (student && path.includes("login.html")) {
        window.location.href = "home.html";
    }
}

function logout() {
    sessionStorage.removeItem("cse_student");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
