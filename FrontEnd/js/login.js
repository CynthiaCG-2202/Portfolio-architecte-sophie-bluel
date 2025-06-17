document.querySelector(".login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Connexion réussie
            localStorage.setItem("token", result.token); // Stocker le token
            window.location.href = "../index.html"; // Redirige vers la page d’accueil
        } else {
            // Connexion échouée
            alert("Email ou mot de passe incorrect.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
    }
});

// fonction init à faire
