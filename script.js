function checkAuth() {
    const user = localStorage.getItem("cse_user");
    const path = window.location.pathname;

    if (!user && !path.includes("login.html")) {
        window.location.href = "login.html";
    }
    if (user && path.includes("login.html")) {
        window.location.href = "home.html";
    }
}
function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    if (username.trim() !== "") {
        localStorage.setItem("cse_user", username);
        window.location.href = "home.html";
    }
}


function logout() {
    localStorage.removeItem("cse_user");
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", () => {


    checkAuth();
});
