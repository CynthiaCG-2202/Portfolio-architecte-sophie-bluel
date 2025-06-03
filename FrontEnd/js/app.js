// Sélection des éléments
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");
let allWorks = [];

// Fonction d'affichage des projets filtrés
function displayFilteredWorks(categoryId) {
    gallery.innerHTML = "";

    const filteredWorks = categoryId === 0
        ? allWorks
        : allWorks.filter(work => work.categoryId === categoryId);

    filteredWorks.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

// Récupération des travaux depuis l’API
fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(works => {
        allWorks = works;
        displayFilteredWorks(0); // Affiche tous les projets au chargement
    })
    .catch(error => console.error("Erreur lors de la récupération des travaux :", error));

// Récupération des catégories depuis l’API et création des boutons filtres
fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(categories => {
        // Ajoute un bouton "Tous"
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.classList.add("filter-btn", "active");
        allButton.dataset.id = 0;
        filtersContainer.appendChild(allButton);

        // Ajoute les boutons pour chaque catégorie
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.classList.add("filter-btn");
            button.dataset.id = category.id;
            filtersContainer.appendChild(button);
        });

        // Écouteurs d’événements pour les boutons
        const buttons = filtersContainer.querySelectorAll("button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                // Retirer la classe "active" de tous les boutons
                buttons.forEach(btn => btn.classList.remove("active"));
                // Ajouter la classe "active" au bouton cliqué
                button.classList.add("active");

                const categoryId = parseInt(button.dataset.id);
                displayFilteredWorks(categoryId);
            });
        });
    })
    .catch(error => console.error("Erreur lors de la récupération des catégories :", error));
