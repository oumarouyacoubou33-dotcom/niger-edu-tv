const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Bayanan Shiga (Admin Credentials)
        const ADMIN_USERNAME = "Mrouyac";
        const ADMIN_PASSWORD = "976994mrou";

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            alert("Connexion réussie! (Shiga cikin nasara)");
            // Ajiye matsayin shiga a browser
            localStorage.setItem("isAdminLoggedIn", "true");
            window.location.href = "dashboard.html";
        } else {
            alert("Nom d'utilisateur ou mot de passe incorrect!");
        }
    });
}
