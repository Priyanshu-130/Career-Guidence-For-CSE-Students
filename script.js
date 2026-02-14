// Check authentication on page load
function checkAuth() {
    const user = localStorage.getItem("cse_user");
    const path = window.location.pathname;

    // If not logged in and not on login page, redirect to login
    if (!user && !path.includes("login.html")) {
        window.location.href = "login.html";
    }

    // If logged in and on login page, redirect to home
    if (user && path.includes("login.html")) {
        window.location.href = "home.html";
    }
}

// Simple Login Logic
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    if (username.trim() !== "") {
        localStorage.setItem("cse_user", username);
        window.location.href = "home.html";
    }
}

// Logout Logic
function logout() {
    localStorage.removeItem("cse_user");
    window.location.href = "login.html";
}

// Run check on load
document.addEventListener("DOMContentLoaded", () => {
    // Only check auth if we are not explicitly on the login page (to avoid infinite loops if something is wrong)
    // but the logic inside checkAuth handles includes("login.html")
    checkAuth();
});
