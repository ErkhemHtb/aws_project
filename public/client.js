let currentUser = null;
let sessionToken = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderApp();
});

function checkAuth() {
    const storedToken = localStorage.getItem('sessionToken');
    const storedUser = localStorage.getItem('username');
    
    if (storedToken && storedUser) {
        sessionToken = storedToken;
        currentUser = storedUser;
    }
}

function renderApp() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        ${renderNavBar()}
        ${currentUser ? renderMessageForm() : ''}
        <div id="messagesContainer" class="messages-container">
            <div class="loading">Chargement des messages...</div>
        </div>
        ${renderModals()}
    `;
    
    if (currentUser) {
        loadMessages();
        // Rafraîchir automatiquement toutes les 5 secondes
        setInterval(loadMessages, 5000);
    }
    
    attachEventListeners();
}

function renderNavBar() {
    return `
        <div class="nav-bar">
            <div class="nav-brand">
                <i class="fab fa-twitter"></i> Mini Twitter
            </div>
            <div class="nav-menu">
                ${currentUser ? `
                    <span class="user-info">
                        <i class="fas fa-user"></i> ${currentUser}
                    </span>
                    <button class="btn" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Déconnexion
                    </button>
                ` : `
                    <button class="btn" onclick="showLoginModal()">
                        <i class="fas fa-sign-in-alt"></i> Connexion
                    </button>
                    <button class="btn btn-primary" onclick="showSignupModal()">
                        <i class="fas fa-user-plus"></i> Créer un compte
                    </button>
                `}
            </div>
        </div>
    `;
}

function renderMessageForm() {
    return `
        <div class="message-form">
            <textarea 
                id="messageInput" 
                class="message-input" 
                placeholder="Quoi de neuf ?" 
                rows="3"
                maxlength="280"
            ></textarea>
            <div class="char-counter">
                <span id="charCount">0</span>/280
            </div>
            <button class="btn btn-primary" onclick="postMessage()" style="width: 100%;">
                <i class="fas fa-paper-plane"></i> Tweeter
            </button>
        </div>
    `;
}

function renderModals() {
    return `
        <!-- Modal Login -->
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <h2><i class="fas fa-sign-in-alt"></i> Connexion</h2>
                <div id="loginError" class="error-message"></div>
                <div class="input-group">
                    <div class="input-box">
                        <i class="fas fa-user"></i>
                        <input type="text" id="loginUsername" placeholder="Nom d'utilisateur">
                    </div>
                </div>
                <div class="input-group">
                    <div class="input-box">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="loginPassword" placeholder="Mot de passe">
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn" onclick="hideLoginModal()">Annuler</button>
                    <button class="btn btn-primary" onclick="login()">Se connecter</button>
                </div>
            </div>
        </div>
        
        <!-- Modal Signup -->
        <div id="signupModal" class="modal">
            <div class="modal-content">
                <h2><i class="fas fa-user-plus"></i> Créer un compte</h2>
                <div id="signupError" class="error-message"></div>
                <div id="signupSuccess" class="success-message"></div>
                <div class="input-group">
                    <div class="input-box">
                        <i class="fas fa-user"></i>
                        <input type="text" id="signupUsername" placeholder="Nom d'utilisateur">
                    </div>
                </div>
                <div class="input-group">
                    <div class="input-box">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="signupPassword" placeholder="Mot de passe">
                    </div>
                </div>
                <div class="input-group">
                    <div class="input-box">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="signupConfirmPassword" placeholder="Confirmer le mot de passe">
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn" onclick="hideSignupModal()">Annuler</button>
                    <button class="btn btn-primary" onclick="signup()">Créer</button>
                </div>
            </div>
        </div>
    `;
}

function attachEventListeners() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            document.getElementById('charCount').textContent = this.value.length;
        });
        
        messageInput.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                postMessage();
            }
        });
    }
}

window.showLoginModal = () => {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('loginError').textContent = '';
};

window.hideLoginModal = () => {
    document.getElementById('loginModal').classList.remove('active');
};

window.showSignupModal = () => {
    document.getElementById('signupModal').classList.add('active');
    document.getElementById('signupError').textContent = '';
    document.getElementById('signupSuccess').textContent = '';
};

window.hideSignupModal = () => {
    document.getElementById('signupModal').classList.remove('active');
};

window.signup = async () => {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    const errorDiv = document.getElementById('signupError');
    const successDiv = document.getElementById('signupSuccess');
    
    errorDiv.textContent = '';
    successDiv.textContent = '';
    
    if (!username || !password) {
        errorDiv.textContent = 'Tous les champs sont requis';
        return;
    }
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Les mots de passe ne correspondent pas';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
        return;
    }
    
    try {
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            successDiv.textContent = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
            setTimeout(() => {
                hideSignupModal();
                showLoginModal();
            }, 1500);
        } else {
            errorDiv.textContent = data.message || 'Erreur lors de la création du compte';
        }
    } catch (error) {
        errorDiv.textContent = 'Erreur de connexion au serveur';
    }
};

window.login = async () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = '';
    
    if (!username || !password) {
        errorDiv.textContent = 'Tous les champs sont requis';
        return;
    }
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionToken = data.token;
            currentUser = username;
            
            localStorage.setItem('sessionToken', sessionToken);
            localStorage.setItem('username', currentUser);
            
            hideLoginModal();
            renderApp();
        } else {
            errorDiv.textContent = data.message || 'Nom d\'utilisateur ou mot de passe incorrect';
        }
    } catch (error) {
        errorDiv.textContent = 'Erreur de connexion au serveur';
    }
};

window.logout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');
    sessionToken = null;
    currentUser = null;
    renderApp();
};

window.postMessage = async () => {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Le message ne peut pas être vide');
        return;
    }
    
    if (text.length > 280) {
        alert('Le message ne peut pas dépasser 280 caractères');
        return;
    }
    
    try {
        const response = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (data.success) {
            input.value = '';
            document.getElementById('charCount').textContent = '0';
            loadMessages();
        } else {
            alert(data.message || 'Erreur lors de la publication');
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
};

async function loadMessages() {
    const container = document.getElementById('messagesContainer');
    
    try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        
        if (data.success) {
            displayMessages(data.messages);
        } else {
            container.innerHTML = '<p style="color: white; text-align: center;">Erreur lors du chargement</p>';
        }
    } catch (error) {
        container.innerHTML = '<p style="color: white; text-align: center;">Erreur de connexion</p>';
    }
}

function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    
    if (!messages || messages.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center;">Aucun message pour le moment</p>';
        return;
    }
    
    container.innerHTML = messages.map(message => {
        const date = new Date(message.date);
        const formattedDate = date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="message-card">
                <div class="message-header">
                    <span class="message-author">
                        <i class="fas fa-user-circle"></i> ${escapeHtml(message.author)}
                    </span>
                    <span class="message-date">${formattedDate}</span>
                </div>
                <div class="message-text">${escapeHtml(message.text)}</div>
            </div>
        `;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}