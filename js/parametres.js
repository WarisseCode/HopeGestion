// Gestion des paramètres
let currentUsers = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadUsers();
    setupTabs();
    setupEventListeners();
});

// Charger les données utilisateur
function loadUserData() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('userName').textContent = `${userData.prenom} ${userData.nom}`;
        document.getElementById('userRole').textContent = userData.role === 'admin' ? 'Administrateur' : 'Gestionnaire';
        document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${userData.prenom}+${userData.nom}&background=259B24&color=fff`;
        
        // Pré-remplir les informations de l'entreprise
        document.getElementById('nom_entreprise').value = 'Hope Gestion Immobilière';
        document.getElementById('adresse_entreprise').value = '123 Rue de l\'Indépendance, Cotonou';
        document.getElementById('telephone_entreprise').value = '+229 97 00 00 00';
        document.getElementById('email_entreprise').value = 'contact@hopegimmo.bj';
        document.getElementById('site_web').value = 'https://www.hopegimmo.bj';
        document.getElementById('ifu_entreprise').value = 'IFU1234567890123';
    }
}

// Charger les utilisateurs
async function loadUsers() {
    try {
        if (SIMULATION_MODE) {
            // Mode simulation avec données de démonstration
            currentUsers = getDemoUsers();
            renderUsers(currentUsers);
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
        
        currentUsers = await response.json();
        renderUsers(currentUsers);
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des utilisateurs', 'error');
        // En mode simulation en cas d'erreur
        currentUsers = getDemoUsers();
        renderUsers(currentUsers);
    }
}

// Obtenir les données de démonstration
function getDemoUsers() {
    return [
        {
            id: 1,
            prenom: 'Admin',
            nom: 'Principal',
            email: 'admin@hopegimmo.bj',
            role: 'admin',
            telephone: '+229 97 00 00 00',
            statut: 'Actif',
            derniere_connexion: '2023-10-15T10:30:00'
        },
        {
            id: 2,
            prenom: 'Gestionnaire',
            nom: 'Principal',
            email: 'gestionnaire@hopegimmo.bj',
            role: 'gestionnaire',
            telephone: '+229 96 00 00 00',
            statut: 'Actif',
            derniere_connexion: '2023-10-14T14:15:00'
        }
    ];
}

// Afficher les utilisateurs dans le tableau
function renderUsers(users) {
    const tbody = document.querySelector('#users-tab tbody');
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users fa-3x"></i>
                        <h3>Aucun utilisateur trouvé</h3>
                        <p>Commencez par ajouter votre premier utilisateur</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${user.prenom} ${user.nom}</strong>
                        <div class="text-muted">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="badge badge-${user.role === 'admin' ? 'danger' : 'info'}">
                    ${user.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
                </span>
            </td>
            <td>
                <span class="badge badge-${user.statut === 'Actif' ? 'success' : 'secondary'}">
                    ${user.statut}
                </span>
            </td>
            <td>${formatDateTime(user.derniere_connexion)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-sm" onclick="editUser(${user.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm btn-danger" onclick="deleteUser(${user.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Formater la date et l'heure
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Configurer les onglets
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Retirer la classe active de tous les boutons et panneaux
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué et au panneau correspondant
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Aperçu du logo
    const logoInput = document.getElementById('logo_entreprise');
    if (logoInput) {
        logoInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.querySelector('#logoPreview img').src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

// Sauvegarder les paramètres généraux
function saveGeneralSettings() {
    const settings = {
        nom_entreprise: document.getElementById('nom_entreprise').value,
        adresse_entreprise: document.getElementById('adresse_entreprise').value,
        telephone_entreprise: document.getElementById('telephone_entreprise').value,
        email_entreprise: document.getElementById('email_entreprise').value,
        site_web: document.getElementById('site_web').value,
        ifu_entreprise: document.getElementById('ifu_entreprise').value,
        devise: document.getElementById('devise').value,
        langue: document.getElementById('langue').value,
        fuseau_horaire: document.getElementById('fuseau_horaire').value,
        format_date: document.getElementById('format_date').value
    };
    
    // En mode simulation, on affiche simplement un message
    showToast('Paramètres généraux enregistrés avec succès', 'success');
}

// Sauvegarder les préférences de notification
function saveNotificationSettings() {
    const settings = {
        email_notifications: document.getElementById('email_notifications').checked,
        payment_alerts: document.getElementById('payment_alerts').checked,
        maintenance_alerts: document.getElementById('maintenance_alerts').checked,
        lease_alerts: document.getElementById('lease_alerts').checked
    };
    
    // En mode simulation, on affiche simplement un message
    showToast('Préférences de notification enregistrées avec succès', 'success');
}

// Sauvegarder les paramètres de paiement
function savePaymentSettings() {
    const settings = {
        delai_paiement: document.getElementById('delai_paiement').value,
        penalite_retard: document.getElementById('penalite_retard').value,
        methode_defaut: document.getElementById('methode_defaut').value,
        operateur_defaut: document.getElementById('operateur_defaut').value,
        template_facture: document.getElementById('template_facture').value
    };
    
    // En mode simulation, on affiche simplement un message
    showToast('Paramètres de paiement enregistrés avec succès', 'success');
}

// Changer le mot de passe
function changePassword() {
    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Les nouveaux mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('Le nouveau mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    // En mode simulation, on affiche simplement un message
    showToast('Mot de passe changé avec succès', 'success');
    
    // Réinitialiser le formulaire
    document.getElementById('current_password').value = '';
    document.getElementById('new_password').value = '';
    document.getElementById('confirm_password').value = '';
}

// Ouvrir le modal d'ajout d'utilisateur
function openAddUserModal() {
    document.getElementById('userForm').reset();
    document.getElementById('userForm').removeAttribute('data-editing-id');
    openModal('addUserModal');
}

// Modifier un utilisateur
function editUser(id) {
    const user = currentUsers.find(u => u.id === id);
    if (!user) return;
    
    // Remplir le formulaire
    document.getElementById('user_prenom').value = user.prenom;
    document.getElementById('user_nom').value = user.nom;
    document.getElementById('user_email').value = user.email;
    document.getElementById('user_role').value = user.role;
    document.getElementById('user_telephone').value = user.telephone || '';
    
    // Stocker l'ID de l'utilisateur en édition
    document.getElementById('userForm').setAttribute('data-editing-id', id);
    
    openModal('addUserModal');
}

// Sauvegarder un utilisateur
function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    
    const userData = {
        prenom: formData.get('user_prenom'),
        nom: formData.get('user_nom'),
        email: formData.get('user_email'),
        role: formData.get('user_role'),
        telephone: formData.get('user_telephone') || '',
        password: formData.get('user_password')
    };
    
    const editingId = form.getAttribute('data-editing-id');
    
    // Validation
    if (!userData.prenom || !userData.nom || !userData.email || !userData.role) {
        showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (!editingId && !userData.password) {
        showToast('Veuillez saisir un mot de passe', 'error');
        return;
    }
    
    if (userData.password && userData.password.length < 6) {
        showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingId) {
                // Modification
                const index = currentUsers.findIndex(u => u.id == editingId);
                if (index !== -1) {
                    currentUsers[index] = {
                        ...currentUsers[index],
                        prenom: userData.prenom,
                        nom: userData.nom,
                        email: userData.email,
                        role: userData.role,
                        telephone: userData.telephone
                    };
                }
            } else {
                // Ajout
                const newId = Math.max(...currentUsers.map(u => u.id), 0) + 1;
                currentUsers.push({
                    id: newId,
                    prenom: userData.prenom,
                    nom: userData.nom,
                    email: userData.email,
                    role: userData.role,
                    telephone: userData.telephone,
                    statut: 'Actif',
                    derniere_connexion: null
                });
            }
            
            renderUsers(currentUsers);
            closeModal('addUserModal');
            showToast('Utilisateur enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingId) {
            // Modification
            response = fetch(`${API_BASE_URL}/users/${editingId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
        } else {
            // Ajout
            response = fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
        }
        
        response.then(res => {
            if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
            return res.json();
        }).then(() => {
            closeModal('addUserModal');
            loadUsers();
            showToast('Utilisateur enregistré avec succès', 'success');
        });
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement de l\'utilisateur', 'error');
    }
}

// Supprimer un utilisateur
function deleteUser(id) {
    // Empêcher la suppression de l'utilisateur courant
    const currentUser = getUserData();
    if (currentUser && currentUser.id == id) {
        showToast('Vous ne pouvez pas supprimer votre propre compte', 'error');
        return;
    }
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentUsers = currentUsers.filter(u => u.id != id);
            renderUsers(currentUsers);
            showToast('Utilisateur supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            loadUsers();
            showToast('Utilisateur supprimé avec succès', 'success');
        });
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression de l\'utilisateur', 'error');
    }
}

// Voir les sessions actives
function viewActiveSessions() {
    showToast('Fonctionnalité de gestion des sessions à implémenter', 'info');
}

// Voir l'historique des connexions
function viewConnectionHistory() {
    showToast('Fonctionnalité d\'historique des connexions à implémenter', 'info');
}