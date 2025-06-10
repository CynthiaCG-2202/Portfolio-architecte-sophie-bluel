// Sélection des éléments HTML (galerie / filtre)
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");
let allWorks = [];

// Filtre des catégories
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

// Boutons des filtres et le bouton "tous"
function displaycategories(categories) {
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active");
    allButton.dataset.id = 0;
    filtersContainer.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.classList.add("filter-btn");
        button.dataset.id = category.id;
        filtersContainer.appendChild(button);
    });

    const buttons = filtersContainer.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const categoryId = parseInt(button.dataset.id);
            displayFilteredWorks(categoryId);
        });
    });
}

// Projets depuis l'API
async function getworks() {
    const res = await fetch("http://localhost:5678/api/works");
    const works = await res.json();
    allWorks = works;
    return works;
}

// Catégorie depuis l'API
async function getcategories() {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json(); // <-- ajout de await ici
    return categories;
}

// Récupération puis affichage
async function init() {
    const categories = await getcategories();
    displaycategories(categories);
    await getworks();
    displayFilteredWorks(0);
}

init();

function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

// Affiche ou cache la barre admin
function showAdminBar(show) {
    const adminBar = document.getElementById("admin-bar");
    if (!adminBar) return;
    adminBar.classList.toggle("hidden", !show);
}

// Affiche ou cache les filtres
function toggleFilters(show) {
    const filters = document.querySelector(".filters");
    if (!filters) return;
    filters.style.display = show ? "flex" : "none";
}

// Login / Logout
function updateLoginLogoutButton() {
    const btn = document.getElementById("login-logout");
    if (!btn) return;

    if (isLoggedIn()) {
        btn.textContent = "logout";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            localStorage.removeItem("token");
            window.location.reload();
        };
    } else {
        btn.textContent = "login";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            window.location.href = "./Pages/login-page.html";
        };
    }
}

// Btn modifier si connecté
function addEditButtonToProjectsTitle() {
    if (!isLoggedIn()) return;

    const title = document.querySelector("#portfolio h2");
    if (!title) return;

    if (document.getElementById("edit-projects-btn")) return;

    const editBtn = document.createElement("button");
    editBtn.id = "edit-projects-btn";

    // Texte + icône en span pour mieux contrôler le style
    editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> modifier`;

    editBtn.onclick = () => {
        const modal = document.getElementById("modal-edit-projects");
        if (modal) {
            modal.classList.add("active");
            modal.classList.remove("hidden");
        }
    };

    title.appendChild(editBtn);
}

// Fermeture du modal
function setupModalClose() {
    const modal = document.getElementById("modal-edit-projects");
    if (!modal) return;

    const closeBtn = modal.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove("active");
            modal.classList.add("hidden");
        };
    }
}

// À l'événement DOMContentLoaded, lance les setups
document.addEventListener("DOMContentLoaded", () => {
    addEditButtonToProjectsTitle();
    setupModalClose();
    updateLoginLogoutButton();
    showAdminBar(isLoggedIn());
    toggleFilters(!isLoggedIn());
});
