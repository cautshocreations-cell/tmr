// admin.js - Gestion de l'interface d'administration

let currentEditingId = null;
let categories = [];

// Fonction appelée depuis app.js pour charger l'interface admin
async function loadAdminInterface() {
    await loadCategories();
    createRegulationForm();
    loadAdminRegulations();
}

// Charger les catégories de règlements
async function loadCategories() {
    try {
        // Charger depuis l'API
        const response = await fetch('/api/categories');
        if (response.ok) {
            categories = await response.json();
            console.log('✅ Catégories chargées depuis l\'API:', categories.length);
        } else {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showMessage('Erreur lors du chargement des catégories', 'error');
        categories = [];
    }
}

// Fonction pour récupérer une catégorie par ID
function getCategoryById(id) {
    return categories.find(cat => cat.id === id) || categories[0];
}

// Fonction pour ajouter une nouvelle catégorie (pour future implémentation)
async function addCategory(categoryData) {
    try {
        // API call à implémenter plus tard
        // const response = await fetch('/api/categories', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(categoryData)
        // });
        // return await response.json();
        
        // Pour l'instant, ajouter localement
        const newCategory = {
            id: 'cat_' + Date.now(),
            ...categoryData
        };
        categories.push(newCategory);
        
        // Recréer le formulaire pour inclure la nouvelle catégorie
        createRegulationForm();
        
        return newCategory;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de catégorie:', error);
        throw error;
    }
}

// Créer le formulaire d'ajout/modification de règlement
function createRegulationForm() {
    const regulationForm = document.getElementById('regulation-form');
    if (!regulationForm) return;

    // Générer les options de catégories
    let categoryOptions = '';
    if (categories.length === 0) {
        categoryOptions = '<option value="" disabled>Aucune catégorie disponible - Créez-en une d\'abord</option>';
    } else {
        categoryOptions = categories.map(cat => 
            `<option value="${cat.id}" style="color: ${cat.color}">${cat.name}</option>`
        ).join('');
    }

    // Générer les options de gravité
    const severityOptions = `
        <option value="info">📋 Information</option>
        <option value="warning">⚠️ Avertissement</option>
        <option value="major">🚨 Majeur</option>
        <option value="critical">❌ Critique</option>
    `;

    regulationForm.innerHTML = `
        <h3 id="form-title">Ajouter un nouveau règlement</h3>
        <form id="regulation-admin-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="regulation-category">Catégorie *</label>
                    <select id="regulation-category" required>
                        <option value="">Sélectionner une catégorie</option>
                        ${categoryOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="regulation-severity">Gravité *</label>
                    <select id="regulation-severity" required>
                        ${severityOptions}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="regulation-title">Titre du règlement *</label>
                <input type="text" id="regulation-title" placeholder="Ex: Respect mutuel obligatoire" required>
            </div>
            <div class="form-group">
                <label for="regulation-description">Description détaillée *</label>
                <textarea id="regulation-description" 
                         placeholder="Décrivez précisément le règlement et son application..." 
                         required rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="regulation-penalty">Sanctions prévues</label>
                <textarea id="regulation-penalty" 
                         placeholder="Ex: Avertissement → Exclusion temporaire → Bannissement définitif" 
                         rows="2"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="regulation-order">Ordre d'affichage</label>
                    <input type="number" id="regulation-order" placeholder="0" min="0" value="0">
                </div>
                <div class="form-group">
                    <label for="regulation-effective-date">Date d'effet</label>
                    <input type="date" id="regulation-effective-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" id="submit-btn">Ajouter le règlement</button>
                <button type="button" id="preview-btn" class="preview-btn">Aperçu</button>
                <button type="button" id="cancel-edit-btn" class="cancel-btn hidden">Annuler</button>
            </div>
        </form>
        <div id="regulation-preview" class="regulation-preview hidden"></div>
    `;

    // Ajouter les gestionnaires d'événements
    const form = document.getElementById('regulation-admin-form');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const previewBtn = document.getElementById('preview-btn');
    const categorySelect = document.getElementById('regulation-category');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }

    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }

    // Changer la couleur du select selon la catégorie choisie
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = categories.find(cat => cat.id === this.value);
            if (selectedCategory) {
                this.style.borderColor = selectedCategory.color;
                this.style.boxShadow = `0 0 0 2px ${selectedCategory.color}20`;
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }
}

// Gérer la soumission du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('regulation-category').value;
    const title = document.getElementById('regulation-title').value.trim();
    const description = document.getElementById('regulation-description').value.trim();
    const severity = document.getElementById('regulation-severity').value;
    const penalty = document.getElementById('regulation-penalty').value.trim();
    const sortOrder = parseInt(document.getElementById('regulation-order').value) || 0;
    const effectiveDate = document.getElementById('regulation-effective-date').value;
    
    if (!categoryId || !title || !description || !severity) {
        alert('Veuillez remplir tous les champs obligatoires (*)');
        return;
    }

    const regulation = { 
        category_id: categoryId,
        title, 
        description,
        severity,
        penalty_description: penalty || null,
        sort_order: sortOrder,
        effective_date: effectiveDate,
        type: categories.find(cat => cat.id === categoryId)?.name || 'Règles Générales'
    };

    try {
        if (currentEditingId) {
            // Mode modification - appel API
            const response = await fetch(`/api/regulations/${currentEditingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regulation)
            });

            if (response.ok) {
                showMessage('Règlement modifié avec succès !', 'success');
                cancelEdit();
                await loadAdminRegulations();
                await refreshRegulations();
            } else {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
        } else {
            // Mode ajout - appel API
            const response = await fetch('/api/regulations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(regulation)
            });

            if (response.ok) {
                showMessage('Règlement ajouté avec succès !', 'success');
                clearForm();
                await loadAdminRegulations();
                await refreshRegulations();
            } else {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        showMessage(`Erreur: ${error.message}`, 'error');
    }
}

// Afficher un message de statut
function showMessage(text, type = 'info') {
    // Supprimer les anciens messages
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Créer le nouveau message
    const message = document.createElement('div');
    message.className = `status-message ${type}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    // Couleurs selon le type
    switch(type) {
        case 'success':
            message.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            message.style.color = 'white';
            break;
        case 'error':
            message.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            message.style.color = 'white';
            break;
        default:
            message.style.background = 'linear-gradient(135deg, #3B82F6, #2563EB)';
            message.style.color = 'white';
    }

    message.textContent = text;
    document.body.appendChild(message);

    // Supprimer automatiquement après 4 secondes
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => message.remove(), 300);
        }
    }, 4000);
}

// Charger les règlements dans l'interface admin
async function loadAdminRegulations() {
    try {
        // Charger depuis l'API
        const response = await fetch('/api/regulations');
        if (response.ok) {
            const regulations = await response.json();
            displayAdminRegulations(regulations);
            console.log('✅ Règlements admin chargés depuis l\'API:', regulations.length);
        } else {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des règlements admin:', error);
        showMessage('Erreur lors du chargement des règlements', 'error');
        displayAdminRegulations([]);
    }
}

// Éditer un règlement
async function editRegulation(id) {
    try {
        // Récupérer le règlement depuis l'API
        const response = await fetch(`/api/regulations/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const regulation = await response.json();

        // Remplir le formulaire avec les données existantes
        document.getElementById('regulation-category').value = regulation.category_id || '';
        document.getElementById('regulation-title').value = regulation.title || '';
        document.getElementById('regulation-description').value = regulation.description || '';
        document.getElementById('regulation-severity').value = regulation.severity || 'info';
        document.getElementById('regulation-penalty').value = regulation.penalty_description || '';
        document.getElementById('regulation-order').value = regulation.sort_order || 0;
        
        // Date effective
        if (regulation.effective_date) {
            const date = new Date(regulation.effective_date);
            document.getElementById('regulation-effective-date').value = date.toISOString().split('T')[0];
        }
        
        // Déclencher le changement de couleur pour la catégorie
        const categorySelect = document.getElementById('regulation-category');
        if (categorySelect) {
            categorySelect.dispatchEvent(new Event('change'));
        }
        
        // Changer le mode du formulaire
        currentEditingId = id;
        document.getElementById('form-title').textContent = 'Modifier le règlement';
        document.getElementById('submit-btn').textContent = 'Modifier le règlement';
        document.getElementById('cancel-edit-btn').classList.remove('hidden');
        
        // Scroller vers le formulaire
        document.getElementById('regulation-form').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
        });

        showMessage('Mode édition activé', 'info');
    } catch (error) {
        console.error('Erreur lors du chargement du règlement:', error);
        showMessage(`Erreur lors du chargement: ${error.message}`, 'error');
    }
}

// Annuler l'édition
function cancelEdit() {
    currentEditingId = null;
    clearForm();
    document.getElementById('form-title').textContent = 'Ajouter un nouveau règlement';
    document.getElementById('submit-btn').textContent = 'Ajouter le règlement';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
    
    // Réinitialiser la bordure du select de catégorie
    const categorySelect = document.getElementById('regulation-category');
    if (categorySelect) {
        categorySelect.style.borderColor = '';
        categorySelect.style.boxShadow = '';
    }
}

function showPreview() {
    const form = document.getElementById('regulation-admin-form');
    const formData = new FormData(form);
    
    const previewData = {
        title: formData.get('title'),
        description: formData.get('description'),
        categoryId: formData.get('category_id'),
        severity: formData.get('severity'),
        penalty: formData.get('penalty'),
        fineAmount: formData.get('fine_amount')
    };

    // Obtenir le nom de la catégorie
    const categorySelect = document.getElementById('regulation-category');
    const categoryName = categorySelect.options[categorySelect.selectedIndex]?.text || 'Non spécifiée';

    // Créer la prévisualisation
    const previewModal = document.createElement('div');
    previewModal.className = 'preview-modal';
    previewModal.innerHTML = `
        <div class="preview-content">
            <div class="preview-header">
                <h3>Prévisualisation du Règlement</h3>
                <button type="button" class="close-preview" onclick="closePreview()">×</button>
            </div>
            <div class="preview-body">
                <div class="regulation-preview">
                    <div class="regulation-category category-${previewData.categoryId}">
                        ${categoryName}
                    </div>
                    <h4 class="regulation-title">${previewData.title || 'Titre non spécifié'}</h4>
                    <div class="regulation-description">
                        ${previewData.description || 'Description non spécifiée'}
                    </div>
                    <div class="regulation-details">
                        <div class="severity-indicator severity-${previewData.severity}">
                            Sévérité: ${getSeverityLabel(previewData.severity)}
                        </div>
                        ${previewData.penalty ? `<div class="penalty-info">Sanction: ${previewData.penalty}</div>` : ''}
                        ${previewData.fineAmount ? `<div class="fine-info">Amende: ${previewData.fineAmount}€</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="preview-actions">
                <button type="button" class="btn btn-secondary" onclick="closePreview()">Fermer</button>
                <button type="button" class="btn btn-primary" onclick="submitFromPreview()">Confirmer et Enregistrer</button>
            </div>
        </div>
    `;

    document.body.appendChild(previewModal);
}

function getSeverityLabel(severity) {
    const labels = {
        'info': 'Information',
        'warning': 'Avertissement',
        'major': 'Majeure',
        'critical': 'Critique'
    };
    return labels[severity] || severity;
}

function closePreview() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        modal.remove();
    }
}

function submitFromPreview() {
    closePreview();
    const form = document.getElementById('regulation-admin-form');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
}

// Vider le formulaire
function clearForm() {
    const fields = [
        'regulation-category',
        'regulation-title', 
        'regulation-description',
        'regulation-severity',
        'regulation-penalty',
        'regulation-order',
        'regulation-effective-date'
    ];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'date') {
                field.value = new Date().toISOString().split('T')[0];
            } else if (field.type === 'number') {
                field.value = '0';
            } else {
                field.value = '';
            }
        }
    });

    // Réinitialiser la sélection de gravité par défaut
    const severitySelect = document.getElementById('regulation-severity');
    if (severitySelect) {
        severitySelect.value = 'info';
    }
}

// Confirmer et supprimer un règlement
async function deleteRegulationAdmin(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce règlement ? Cette action est irréversible.')) {
        try {
            const response = await fetch(`/api/regulations/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showMessage('Règlement supprimé avec succès', 'success');
                await loadAdminRegulations();
                await refreshRegulations();
            } else {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showMessage(`Erreur lors de la suppression: ${error.message}`, 'error');
        }
    }
}

// Supprimer un règlement des données locales (pour les données de test)
function deleteRegulationFromLocal(id) {
    // Filtrer le règlement à supprimer du stockage local
    const index = demoRegulations.findIndex(reg => reg.id === id);
    if (index !== -1) {
        demoRegulations.splice(index, 1);
        // Mettre à jour l'affichage
        displayAdminRegulations(demoRegulations);
        displayRegulations(demoRegulations);
        showMessage('Règlement d\'exemple supprimé', 'success');
    } else {
        showMessage('Règlement non trouvé', 'error');
    }
}

// Générer un ID unique
function generateId() {
    return 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Fonction pour initialiser l'interface admin (appelée depuis app.js)
function initializeAdminInterface() {
    loadAdminInterface();
}

// Export des fonctions pour les rendre disponibles globalement
window.editRegulation = editRegulation;
window.deleteRegulationAdmin = deleteRegulationAdmin;
window.initializeAdminInterface = initializeAdminInterface;
window.loadCategories = loadCategories;
window.createRegulationForm = createRegulationForm;