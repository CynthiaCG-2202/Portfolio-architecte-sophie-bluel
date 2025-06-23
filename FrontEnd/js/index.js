// Sélection des éléments HTML (galerie / filtre)
const gallery = document.querySelector(".gallery");
const filtersContainer = document.querySelector(".filters");

// Filtre des catégories
function displayFilteredWorks(categoryId, works) {
    gallery.innerHTML = "";

    const filteredWorks = categoryId === 0
        ? works
        : works.filter(work => work.categoryId === categoryId);

    filteredWorks.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id;  // Ajout pour faciliter suppression

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
function displaycategories(categories, works) {
    filtersContainer.innerHTML = ""; // Vide au cas où

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
            displayFilteredWorks(categoryId, works);
        });
    });
}

// Projets depuis l'API
async function getworks() {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const works = await res.json();
        return works;
    } catch (error) {
        console.error("Erreur lors de la récupération des travaux :", error);
        return [];  // Retourne un tableau vide si erreur
    }
}

// Catégorie depuis l'API
async function getcategories() {
    try {
        const res = await fetch("http://localhost:5678/api/categories");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const categories = await res.json();
        return categories;
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        return [];  // Retourne un tableau vide si erreur
    }
}

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

    editBtn.addEventListener("click", () => {
        const modal = document.getElementById("modal-edit-projects");
        if (modal) {
            modal.classList.add("active");
            modal.classList.remove("hidden");
        }
    });

    title.appendChild(editBtn);
}

// Fermeture du modal
function setupModalClose() {
    const modal = document.getElementById("modal-edit-projects");
    if (!modal) return;

    const closeBtn = modal.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            modal.classList.add("hidden");
        });
    }

    // Clic en dehors du contenu modal
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("active");
            modal.classList.add("hidden");
        }
    });
}

// Rajouté pour le modal avec suppression par icône en coin
function displayWorksInModal(works) {
    const modalGallery = document.querySelector("#modal-edit-projects .modal-gallery");
    if (!modalGallery) return;

    modalGallery.innerHTML = ""; // Vide le contenu

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.id = work.id;

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // Bouton supprimer
        const btnSuppr = document.createElement("button");
        btnSuppr.classList.add("btn-suppr");
        btnSuppr.dataset.id = work.id;
        btnSuppr.setAttribute("aria-label", "Supprimer l'image");

        btnSuppr.innerHTML = '<i class="fa-solid fa-trash"></i>';

        figure.appendChild(img);
        figure.appendChild(btnSuppr);
        modalGallery.appendChild(figure);
    });
    // ajouter event dans la const au dessus
    modalGallery.querySelectorAll(".btn-suppr").forEach(btn => { // à supprimer
        btn.addEventListener("click", async (e) => { // à remonter
            const idToDelete = e.target.closest("button").dataset.id;

            const confirmed = confirm("Voulez-vous vraiment supprimer ce travail ?");
            if (!confirmed) return;

            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5678/api/works/${idToDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Erreur lors de la suppression");
                const works = await getworks();
                displayFilteredWorks(0, works);
                displayWorksInModal(works); // à mettre les trois lignes init

            } catch (err) {
                alert(err.message);
                console.error(err);
            }
        });
    });
}

// Rajouté pour éviter la duplication des images
let modalSwitchingInitialized = false; //

function setupModalSwitching(categories) {
    if (modalSwitchingInitialized) return;
    modalSwitchingInitialized = true;

    const btnOpenAdd = document.getElementById("open-add-photo");
    const viewGallery = document.querySelector(".modal-gallery-view");
    const viewAdd = document.querySelector(".modal-add-view");
    const backBtn = viewAdd.querySelector(".back-btn");

    const categorySelect = document.getElementById("category");
    const imageInput = document.getElementById("image-input");
    const previewContainer = document.getElementById("preview-container");

    categorySelect.innerHTML = "";
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    btnOpenAdd.addEventListener("click", () => {
        viewGallery.classList.add("hidden");
        viewAdd.classList.remove("hidden");
    });

    backBtn.addEventListener("click", () => {
        viewAdd.classList.add("hidden");
        viewGallery.classList.remove("hidden");

        document.getElementById("photo-form").reset();
        previewContainer.classList.add("hidden");
        previewImage.src = "";
    });

    const uploadPlaceholder = document.getElementById("upload-placeholder");
    const previewWrapper = document.getElementById("preview-wrapper");
    const previewImage = document.getElementById("preview-image");
    const form = document.getElementById("photo-form");
    const validateBtn = form.querySelector(".btn-modal");
    const titleInput = document.getElementById("title");

    // Fonction pour activer/désactiver le bouton
    function updateValidateButtonState() {
        const file = imageInput.files[0];
        const title = titleInput.value.trim();
        const category = categorySelect.value;
        validateBtn.disabled = !(file && title && category);
    }

    // Image sélectionnée
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            previewImage.src = URL.createObjectURL(file);
            previewWrapper.classList.remove("hidden");
            uploadPlaceholder.classList.add("hidden");
        }
        updateValidateButtonState();
    });

    // Met à jour le bouton valider en fonction des champs
    titleInput.addEventListener("input", updateValidateButtonState);
    categorySelect.addEventListener("change", updateValidateButtonState);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const file = imageInput.files[0];
        const title = document.getElementById("title").value;
        const category = categorySelect.value;

        if (!file || !title || !category) {
            alert("Tous les champs sont requis.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", category);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Erreur lors de l'ajout de l'image");
            const works = await getworks();
            displayFilteredWorks(0, works);
            displayWorksInModal(works); // mettre simplement les trois mêmes lignes
            viewAdd.classList.add("hidden");
            viewGallery.classList.remove("hidden");
        } catch (err) {
            alert(err.message);
        }
    });
}



// Récupération puis affichage
async function init() {
    const works = await getworks();
    displayFilteredWorks(0, works);
    displayWorksInModal(works); // mettre les trois premières dans la fonction init (copier coller)
    const categories = await getcategories();
    displaycategories(categories, works);
    addEditButtonToProjectsTitle();
    setupModalClose();
    updateLoginLogoutButton();
    showAdminBar(isLoggedIn());
    toggleFilters(!isLoggedIn());
    setupModalSwitching(categories);
}

init();
