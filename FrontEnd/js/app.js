/* Récupération des travaux par API */

fetch('http://localhost:5678/api/works')
    .then(response => response.json()) // Convertit la réponse en JSON
    .then(data => {
        console.log(data); // Affiche les données dans la console
        // Tu peux ensuite parcourir les données pour les afficher
        data.forEach(work => {
            // Exemple : afficher le titre de chaque projet
            console.log(work.title);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des travaux :', error);
    });


/* Galerie de travaux */

const gallery = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(works => {
        works.forEach(work => {
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
    })
    .catch(err => console.error("Erreur lors du chargement des travaux :", err));

/* Filtres par catégories */

fetch("http://localhost:5678/api/categories")
const filtersContainer = document.querySelector(".filters");

fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(categories => {
        // Ajoute un bouton "Tous"
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.dataset.id = 0;
        filtersContainer.appendChild(allButton);

        // Boutons par catégorie
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.dataset.id = category.id;
            filtersContainer.appendChild(button);
        });

        // Gérer les clics
        const buttons = filtersContainer.querySelectorAll("button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const categoryId = parseInt(button.dataset.id);
                displayFilteredWorks(categoryId);
            });
        });
    });

    /* Triage */

    let allWorks = [];

fetch("http://localhost:5678/api/works")
  .then(res => res.json())
  .then(works => {
    allWorks = works;
    displayFilteredWorks(0); // Affiche tous par défaut
  });

function displayFilteredWorks(categoryId) {
  gallery.innerHTML = ""; // Vide la galerie

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
