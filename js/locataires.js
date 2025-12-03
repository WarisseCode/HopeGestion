// Gestion des locataires
let currentLocataires = [];
let editingLocataireId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadLocataires();
    setupEventListeners();
});

// Charger les données utilisateur
function loadUserData() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('userName').textContent = `${userData.prenom} ${userData.nom}`;
        document.getElementById('userRole').textContent = userData.role === 'admin' ? 'Administrateur' : 'Gestionnaire';
        document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${userData.prenom}+${userData.nom}&background=259B24&color=fff`;
    }
}

// Charger les locataires
async function loadLocataires() {
    try {
        showLoadingSpinner('locatairesTableBody');
        
        const response = await apiRequest(buildUrl('locataires'));
        const locataires = response.data || response;
        
        currentLocataires = locataires;
        renderLocataires(locataires);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des locataires', 'error');
        // En mode simulation en cas d'erreur
        currentLocataires = getDemoLocataires();
        renderLocataires(currentLocataires);
        updateStats();
    }
}

// Obtenir les données de démonstration
function getDemoLocataires() {
    return [
        {
            id: 1,
            prenom: 'Alice',
            nom: 'Martin',
            telephone: '+229 97 11 11 11',
            email: 'alice.martin@email.com',
            adresse: '123 Rue de la Paix, Cotonou',
            ville: 'Cotonou',
            profession: 'Comptable',
            employeur: 'Entreprise ABC',
            cni: 'CNI00123456789',
            contact_urgence: '+229 96 11 11 11',
            statut: 'Actif'
        },
        {
            id: 2,
            prenom: 'Bob',
            nom: 'Bernard',
            telephone: '+229 97 22 22 22',
            email: 'bob.bernard@email.com',
            adresse: '456 Avenue des Martyrs, Porto-Novo',
            ville: 'Porto-Novo',
            profession: 'Ingénieur',
            employeur: 'Tech Solutions',
            cni: 'CNI98765432100',
            contact_urgence: '+229 96 22 22 22',
            statut: 'En attente'
        },
        {
            id: 3,
            prenom: 'Claire',
            nom: 'Dubois',
            telephone: '+229 97 33 33 33',
            email: 'claire.dubois@email.com',
            adresse: '789 Boulevard Triomphal, Parakou',
            ville: 'Parakou',
            profession: 'Enseignante',
            employeur: 'Ministère de l\'Éducation',
            cni: 'CNI45678912300',
            contact_urgence: '+229 96 33 33 33',
            statut: 'Actif'
        }
    ];
}

// Afficher les locataires dans le tableau
function renderLocataires(locataires) {
    const tbody = document.getElementById('locatairesTableBody');
    
    if (locataires.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-users fa-3x"></i>
                        <h3>Aucun locataire trouvé</h3>
                        <p>Commencez par ajouter votre premier locataire</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = locataires.map(locataire => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <strong>${locataire.prenom} ${locataire.nom}</strong>
                        <div class="text-muted">${locataire.profession || '-'}</div>
                    </div>
                </div>
            </td>
            <td>
                <div>${locataire.telephone || '-'}</div>
                <div class="text-muted">${locataire.email || '-'}</div>
            </td>
            <td>${locataire.profession || '-'}</td>
            <td>${locataire.employeur || '-'}</td>
            <td>${locataire.cni || '-'}</td>
            <td>
                <span class="badge badge-${locataire.statut === 'Actif' ? 'success' : locataire.statut === 'En attente' ? 'warning' : 'secondary'}">
                    ${locataire.statut}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-sm" onclick="editLocataire(${locataire.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm btn-danger" onclick="deleteLocataire(${locataire.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentLocataires.length;
    const actifs = currentLocataires.filter(l => l.statut === 'Actif').length;
    const enAttente = currentLocataires.filter(l => l.statut === 'En attente').length;
    const inactifs = total - actifs - enAttente;
    
    document.getElementById('totalLocataires').textContent = total;
    document.getElementById('locatairesActifs').textContent = actifs;
    document.getElementById('locatairesEnAttente').textContent = enAttente;
    document.getElementById('locatairesInactifs').textContent = inactifs;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterLocataires(e.target.value);
        }, 300));
    }
}

// Filtrer les locataires
function filterLocataires(searchTerm) {
    if (!searchTerm) {
        renderLocataires(currentLocataires);
        return;
    }
    
    const filtered = currentLocataires.filter(locataire => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (locataire.prenom && locataire.prenom.toLowerCase().includes(searchLower)) ||
            (locataire.nom && locataire.nom.toLowerCase().includes(searchLower)) ||
            (locataire.telephone && locataire.telephone.includes(searchTerm)) ||
            (locataire.email && locataire.email.toLowerCase().includes(searchLower)) ||
            (locataire.profession && locataire.profession.toLowerCase().includes(searchLower))
        );
    });
    
    renderLocataires(filtered);
}

// Rafraîchir la liste
function refreshLocataires() {
    loadLocataires();
    showToast('Liste actualisée', 'success');
}

// Ouvrir le modal d'ajout/modification
function openAddLocataireModal() {
    editingLocataireId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un locataire';
    document.getElementById('locataireForm').reset();
    openModal('addLocataireModal');
}

// Modifier un locataire
function editLocataire(id) {
    const locataire = currentLocataires.find(l => l.id === id);
    if (!locataire) return;
    
    editingLocataireId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un locataire';
    
    // Remplir le formulaire
    document.getElementById('locataireId').value = locataire.id;
    document.getElementById('prenom').value = locataire.prenom || '';
    document.getElementById('nom').value = locataire.nom || '';
    document.getElementById('telephone').value = locataire.telephone || '';
    document.getElementById('email').value = locataire.email || '';
    document.getElementById('adresse').value = locataire.adresse || '';
    document.getElementById('ville').value = locataire.ville || '';
    document.getElementById('profession').value = locataire.profession || '';
    document.getElementById('employeur').value = locataire.employeur || '';
    document.getElementById('cni').value = locataire.cni || '';
    document.getElementById('contact_urgence').value = locataire.contact_urgence || '';
    document.getElementById('statut').value = locataire.statut || '';
    
    openModal('addLocataireModal');
}

// Sauvegarder un locataire
async function saveLocataire() {
    const form = document.getElementById('locataireForm');
    const formData = new FormData(form);
    
    const locataireData = {
        prenom: formData.get('prenom'),
        nom: formData.get('nom'),
        telephone: formData.get('telephone'),
        email: formData.get('email'),
        adresse: formData.get('adresse'),
        ville: formData.get('ville'),
        profession: formData.get('profession'),
        employeur: formData.get('employeur'),
        cni: formData.get('cni'),
        contact_urgence: formData.get('contact_urgence'),
        statut: formData.get('statut')
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingLocataireId) {
                // Modification
                const index = currentLocataires.findIndex(l => l.id === editingLocataireId);
                if (index !== -1) {
                    currentLocataires[index] = {...currentLocataires[index], ...locataireData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentLocataires.map(l => l.id), 0) + 1;
                currentLocataires.push({...locataireData, id: newId});
            }
            
            renderLocataires(currentLocataires);
            updateStats();
            closeModal('addLocataireModal');
            showToast('Locataire enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingLocataireId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/locataires/${editingLocataireId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(locataireData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/locataires`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(locataireData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addLocataireModal');
        loadLocataires();
        showToast('Locataire enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du locataire', 'error');
    }
}

// Supprimer un locataire
function deleteLocataire(id) {
    document.getElementById('deleteLocataireId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeleteLocataire() {
    const id = document.getElementById('deleteLocataireId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentLocataires = currentLocataires.filter(l => l.id != id);
            renderLocataires(currentLocataires);
            updateStats();
            closeModal('deleteModal');
            showToast('Locataire supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/locataires/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadLocataires();
        showToast('Locataire supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du locataire', 'error');
    }
}

// Fonction helper pour le debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}