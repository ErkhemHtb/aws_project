// script.js

const board = document.getElementById('board');

// Fonction pour créer un post-it
function createPostit(x, y) {
    const postit = document.createElement('div');
    postit.className = 'postit';

    // Contenu du post-it (demander à l'utilisateur)
    const text = prompt("Texte du post-it :");
    if (!text) return; // si annulation ou vide, ne pas créer

    // Info de l'auteur et date
    const author = prompt("Votre nom :") || "Anonyme";
    const date = new Date().toLocaleString();

    postit.innerHTML = `
        <div class="content">${text}</div>
        <div class="info">Par ${author} le ${date}</div>
    `;

    // Positionner le post-it au niveau du double-clic
    postit.style.left = x + 'px';
    postit.style.top = y + 'px';

    // Donner un z-index plus élevé pour les post-its récents
    postit.style.zIndex = Date.now();

    board.appendChild(postit);
}

// Événement double-clic sur le board
board.addEventListener('click', (e) => {
    // Éviter que le double-clic sur un post-it déclenche la création
    if (e.target.classList.contains('postit') || e.target.closest('.postit')) return;

    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createPostit(x, y);
});


