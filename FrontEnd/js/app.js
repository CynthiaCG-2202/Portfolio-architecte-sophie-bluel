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
