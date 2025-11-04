// src/client/js/app.js

// Identifiants admin
const ADMIN_CREDENTIALS = {
    username: 'root',
    password: 'VYJEve_120508'
};

let isAdminLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Serveur Codex RP - Client Initialisé');
    initializeApp();
});

function initializeApp() {
    loadRegulations();
    setupEventListeners();
}

function setupEventListeners() {
    // Bouton Interface Admin
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', showAdminLogin);
    }

    // Bouton de connexion
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Bouton d'annulation
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideAdminSection);
    }

    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Bouton de gestion des types
    const manageTypesBtn = document.getElementById('manage-types-btn');
    if (manageTypesBtn) {
        manageTypesBtn.addEventListener('click', toggleTypeManagement);
    }

    // Gestion de la touche Entrée dans les champs de connexion
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput && passwordInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                passwordInput.focus();
            }
        });
        
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
}

function loadRegulations() {
    // Utiliser directement la fonction fetchRegulations de regulations.js
    if (typeof fetchRegulations === 'function') {
        fetchRegulations()
            .then(regulations => {
                // Utiliser la fonction displayRegulations de regulations.js
                if (typeof window.displayRegulations === 'function') {
                    window.displayRegulations(regulations);
                } else {
                    displayRegulations(regulations);
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement depuis l\'API:', error);
                // En cas d'erreur API, afficher l'état vide
                displayRegulations([]);
            });
    } else {
        // Pas d'API disponible, mode local - commencer avec une liste vide
        displayRegulations([]);
    }
}

function displayRegulationsByType(regulations, types) {
    // Cette fonction est maintenant obsolète, rediriger vers displayRegulations
    displayRegulations(regulations || []);
}

// Fonction de compatibilité pour l'ancien format
function displayRegulations(regulations) {
    if (!Array.isArray(regulations)) return;
    
    const regulationList = document.getElementById('regulation-list');
    if (!regulationList) return;

    // Utiliser la fonction du fichier regulations.js si disponible
    if (typeof window.displayRegulations === 'function') {
        window.displayRegulations(regulations);
        return;
    }

    // Fallback si la fonction n'est pas disponible
    regulationList.innerHTML = '';

    if (regulations.length === 0) {
        regulationList.innerHTML = `
            <div class="empty-state-main">
                <div class="empty-icon">📋</div>
                <h3>Aucun règlement défini</h3>
                <p>Les règlements du serveur Codex RP seront bientôt disponibles.</p>
                <p>Contactez un administrateur pour plus d'informations.</p>
            </div>
        `;
        return;
    }

    regulations.forEach((regulation, index) => {
        const regulationElement = document.createElement('div');
        regulationElement.className = 'regulation-item';
        
        regulationElement.innerHTML = `
            <div class="regulation-number">${index + 1}</div>
            <div class="regulation-content">
                <h3 class="regulation-title">${regulation.title}</h3>
                <p class="regulation-description">${regulation.description}</p>
            </div>
        `;
        
        regulationList.appendChild(regulationElement);
    });
}

function showAdminLogin() {
    const adminSection = document.getElementById('admin-section');
    const regulationsDisplay = document.getElementById('regulations-display');
    
    if (adminSection && regulationsDisplay) {
        regulationsDisplay.classList.add('hidden');
        adminSection.classList.remove('hidden');
        
        // Focus sur le champ username
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.focus();
        }
    }
}

function hideAdminSection() {
    const adminSection = document.getElementById('admin-section');
    const regulationsDisplay = document.getElementById('regulations-display');
    const loginMessage = document.getElementById('login-message');
    
    if (adminSection && regulationsDisplay) {
        adminSection.classList.add('hidden');
        regulationsDisplay.classList.remove('hidden');
        
        // Nettoyer les champs
        clearLoginForm();
        if (loginMessage) {
            loginMessage.innerHTML = '';
        }
    }
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        showMessage('Connexion réussie !', 'success');
        
        setTimeout(() => {
            showAdminInterface();
        }, 1000);
    } else {
        showMessage('Nom d\'utilisateur ou mot de passe incorrect.', 'error');
        clearLoginForm();
    }
}

function handleLogout() {
    isAdminLoggedIn = false;
    hideAdminSection();
}

function showAdminInterface() {
    const adminLogin = document.querySelector('.admin-login');
    const adminInterface = document.getElementById('admin-interface');
    
    if (adminLogin && adminInterface) {
        adminLogin.classList.add('hidden');
        adminInterface.classList.remove('hidden');
        
        // Charger l'interface d'administration
        if (typeof initializeAdminInterface === 'function') {
            initializeAdminInterface();
        } else {
            // Fallback si la fonction n'est pas disponible
            loadAdminRegulationsManual();
        }
    }
}

function showMessage(message, type) {
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) {
        loginMessage.innerHTML = message;
        loginMessage.className = `message ${type}`;
    }
}

function clearLoginForm() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

async function loadAdminRegulationsManual() {
    try {
        const regulations = await fetchRegulations();
        displayAdminRegulations(regulations);
        createBasicRegulationForm();
    } catch (error) {
        console.error('Erreur lors du chargement des règlements admin:', error);
    }
}

function createBasicRegulationForm() {
    const regulationForm = document.getElementById('regulation-form');
    if (!regulationForm) return;

    regulationForm.innerHTML = `
        <h3>Ajouter un nouveau règlement</h3>
        <form id="regulation-admin-form">
            <input type="text" id="regulation-title" placeholder="Titre du règlement" required>
            <textarea id="regulation-description" placeholder="Description du règlement" required></textarea>
            <button type="submit">Ajouter le règlement</button>
        </form>
    `;

    const form = document.getElementById('regulation-admin-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const title = document.getElementById('regulation-title').value.trim();
            const description = document.getElementById('regulation-description').value.trim();
            
            if (!title || !description) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            const regulation = { title, description };
            
            try {
                // Simuler l'ajout pour la démo
                console.log('Ajout du règlement:', regulation);
                alert('Règlement ajouté avec succès');
                // Vider le formulaire
                document.getElementById('regulation-title').value = '';
                document.getElementById('regulation-description').value = '';
                // Recharger les règlements
                loadRegulations();
            } catch (error) {
                console.error('Erreur lors de l\'ajout:', error);
            }
        });
    }
}

// Fonctions pour la gestion des types de règlements
function toggleTypeManagement() {
    const typeForm = document.getElementById('type-form');
    const typeList = document.getElementById('admin-type-list');
    
    if (typeForm && typeList) {
        const isHidden = typeForm.classList.contains('hidden');
        
        if (isHidden) {
            typeForm.classList.remove('hidden');
            typeList.classList.remove('hidden');
            loadTypeManagement();
        } else {
            typeForm.classList.add('hidden');
            typeList.classList.add('hidden');
        }
    }
}

function loadTypeManagement() {
    createTypeForm();
    displayAdminTypes();
}

function createTypeForm() {
    const typeForm = document.getElementById('type-admin-form');
    if (!typeForm) return;

    typeForm.addEventListener('submit', handleTypeSubmit);
    
    const cancelBtn = document.getElementById('type-cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelTypeEdit);
    }
}

async function handleTypeSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('type-name').value.trim();
    const description = document.getElementById('type-description').value.trim();
    
    if (!name) {
        alert('Veuillez saisir un nom pour le type');
        return;
    }

    const type = { 
        name, 
        description,
        color: '#3B82F6', // Couleur par défaut
        icon: 'shield' // Icône par défaut
    };
    
    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(type)
        });

        if (response.ok) {
            const newCategory = await response.json();
            alert('Type de règlement ajouté avec succès');
            
            // Vider le formulaire
            document.getElementById('type-name').value = '';
            document.getElementById('type-description').value = '';
            
            // Recharger les catégories dans l'interface admin
            if (typeof loadCategories === 'function') {
                await loadCategories();
            }
            
            // Recréer le formulaire de règlement avec les nouvelles catégories
            if (typeof createRegulationForm === 'function') {
                createRegulationForm();
            }
        } else {
            const error = await response.json();
            alert(`Erreur: ${error.error || 'Erreur lors de l\'ajout du type'}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du type:', error);
        alert('Erreur de connexion lors de l\'ajout du type');
    }
}

async function displayAdminTypes() {
    const typeList = document.getElementById('admin-type-list');
    if (!typeList) return;

    try {
        const response = await fetch('/api/categories');
        if (response.ok) {
            const categories = await response.json();
            
            typeList.innerHTML = '';

            if (categories.length === 0) {
                typeList.innerHTML = '<p class="no-data">Aucun type de règlement défini</p>';
                return;
            }

            categories.forEach(category => {
                const typeItem = document.createElement('div');
                typeItem.className = 'admin-regulation-item';
                
                typeItem.innerHTML = `
                    <div class="admin-regulation-content">
                        <h4 style="color: ${category.color || '#3B82F6'}">${category.name}</h4>
                        <p>${category.description || 'Aucune description'}</p>
                    </div>
                    <div class="admin-regulation-actions">
                        <button class="edit-btn" onclick="editType('${category.id}')">Modifier</button>
                        <button class="delete-btn" onclick="deleteType('${category.id}')">Supprimer</button>
                    </div>
                `;
                
                typeList.appendChild(typeItem);
            });
        } else {
            typeList.innerHTML = '<p class="error">Erreur lors du chargement des types</p>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des types:', error);
        typeList.innerHTML = '<p class="error">Erreur de connexion</p>';
    }
}

function editType(id) {
    console.log('Édition du type ID:', id);
    alert('Fonction d\'édition des types à implémenter');
}

async function deleteType(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de règlement ?')) {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Type supprimé avec succès');
                await displayAdminTypes();
                
                // Recharger les catégories dans l'interface admin
                if (typeof loadCategories === 'function') {
                    await loadCategories();
                }
                
                // Recréer le formulaire de règlement avec les catégories mises à jour
                if (typeof createRegulationForm === 'function') {
                    createRegulationForm();
                }
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.error || 'Erreur lors de la suppression'}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur de connexion lors de la suppression');
        }
    }
}

function cancelTypeEdit() {
    document.getElementById('type-name').value = '';
    document.getElementById('type-description').value = '';
    document.getElementById('type-form-title').textContent = 'Ajouter un nouveau type';
    document.getElementById('type-submit-btn').textContent = 'Ajouter le type';
    document.getElementById('type-cancel-btn').classList.add('hidden');
}

// Rendre les fonctions disponibles globalement
window.editType = editType;
window.deleteType = deleteType;