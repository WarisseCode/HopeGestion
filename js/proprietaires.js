// Gestion des propriétaires
let currentProprietaires = [];
let editingProprietaireId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadProprietaires();
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

// Charger les propriétaires
async function loadProprietaires() {
    try {
        showLoadingSpinner('proprietairesTableBody');
        
        const response = await apiRequest(buildUrl('proprietaires'));
        const proprietaires = response.data || response;
        
        currentProprietaires = proprietaires;
        renderProprietaires(proprietaires);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des propriétaires', 'error');
        // En mode simulation en cas d'erreur
        currentProprietaires = getDemoProprietaires();
        renderProprietaires(currentProprietaires);
        updateStats();
    }
}

// Obtenir les données de démonstration
function getDemoProprietaires() {
    return [
        {
            id: 1,
            type: 'personne_physique',
            prenom: 'Jean',
            nom: 'Dupont',
            entreprise: '',
            telephone: '+229 97 00 00 00',
            email: 'jean.dupont@email.com',
            adresse: '123 Rue de l\'Indépendance, Cotonou',
            ville: 'Cotonou',
            ifu: 'IFU00123456789'
        },
        {
            id: 2,
            type: 'personne_morale',
            prenom: '',
            nom: '',
            entreprise: 'Société Béninoise Immobilière',
            telephone: '+229 96 00 00 00',
            email: 'contact@sbi.bj',
            adresse: '456 Avenue de l\'Indépendance, Porto-Novo',
            ville: 'Porto-Novo',
            ifu: 'IFU98765432100'
        },
        {
            id: 3,
            type: 'personne_physique',
            prenom: 'Marie',
            nom: 'Johnson',
            entreprise: '',
            telephone: '+229 95 00 00 00',
            email: 'marie.johnson@email.com',
            adresse: '789 Boulevard Triomphal, Parakou',
            ville: 'Parakou',
            ifu: ''
        }
    ];
}

// Afficher les propriétaires dans le tableau
function renderProprietaires(proprietaires) {
    const tbody = document.getElementById('proprietairesTableBody');
    
    if (proprietaires.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-user-tie fa-3x"></i>
                        <h3>Aucun propriétaire trouvé</h3>
                        <p>Commencez par ajouter votre premier propriétaire</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = proprietaires.map(proprietaire => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-${proprietaire.type === 'personne_morale' ? 'building' : 'user'}"></i>
                    </div>
                    <div>
                        <strong>${proprietaire.type === 'personne_morale' ? proprietaire.entreprise : `${proprietaire.prenom} ${proprietaire.nom}`}</strong>
                        <div class="text-muted">${proprietaire.type === 'personne_morale' ? 'Personne morale' : 'Personne physique'}</div>
                    </div>
                </div>
            </td>
            <td>${proprietaire.type === 'personne_morale' ? 'Morale' : 'Physique'}</td>
            <td>
                <div>${proprietaire.telephone || '-'}</div>
                <div class="text-muted">${proprietaire.email || '-'}</div>
            </td>
            <td>${proprietaire.adresse || '-'}</td>
            <td>${proprietaire.ifu || '-'}</td>
            <td>
                <span class="badge badge-success">2 biens</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-sm" onclick="editProprietaire(${proprietaire.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm btn-danger" onclick="deleteProprietaire(${proprietaire.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentProprietaires.length;
    const personnesMorales = currentProprietaires.filter(p => p.type === 'personne_morale').length;
    const personnesPhysiques = total - personnesMorales;
    
    document.getElementById('totalProprietaires').textContent = total;
    document.getElementById('biensGerés').textContent = total * 2; // Simulation
    document.getElementById('personnesMorales').textContent = personnesMorales;
    document.getElementById('personnesPhysiques').textContent = personnesPhysiques;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterProprietaires(e.target.value);
        }, 300));
    }
}

// Filtrer les propriétaires
function filterProprietaires(searchTerm) {
    if (!searchTerm) {
        renderProprietaires(currentProprietaires);
        return;
    }
    
    const filtered = currentProprietaires.filter(proprietaire => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (proprietaire.prenom && proprietaire.prenom.toLowerCase().includes(searchLower)) ||
            (proprietaire.nom && proprietaire.nom.toLowerCase().includes(searchLower)) ||
            (proprietaire.entreprise && proprietaire.entreprise.toLowerCase().includes(searchLower)) ||
            (proprietaire.telephone && proprietaire.telephone.includes(searchTerm)) ||
            (proprietaire.email && proprietaire.email.toLowerCase().includes(searchLower))
        );
    });
    
    renderProprietaires(filtered);
}

// Rafraîchir la liste
function refreshProprietaires() {
    loadProprietaires();
    showToast('Liste actualisée', 'success');
}

// Basculer entre personne physique/morale
function togglePersonneType() {
    const type = document.getElementById('type').value;
    const entrepriseGroup = document.getElementById('entrepriseGroup');
    const prenomGroup = document.getElementById('prenomGroup');
    const nomGroup = document.getElementById('nomGroup');
    
    if (type === 'personne_morale') {
        entrepriseGroup.style.display = 'block';
        prenomGroup.style.display = 'none';
        nomGroup.querySelector('label').innerHTML = 'Nom du représentant *';
    } else {
        entrepriseGroup.style.display = 'none';
        prenomGroup.style.display = 'block';
        nomGroup.querySelector('label').innerHTML = 'Nom *';
    }
}

// Ouvrir le modal d'ajout/modification
function openAddProprietaireModal() {
    editingProprietaireId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un propriétaire';
    document.getElementById('proprietaireForm').reset();
    document.getElementById('entrepriseGroup').style.display = 'none';
    document.getElementById('prenomGroup').style.display = 'block';
    openModal('addProprietaireModal');
}

// Modifier un propriétaire
function editProprietaire(id) {
    const proprietaire = currentProprietaires.find(p => p.id === id);
    if (!proprietaire) return;
    
    editingProprietaireId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un propriétaire';
    
    // Remplir le formulaire
    document.getElementById('proprietaireId').value = proprietaire.id;
    document.getElementById('type').value = proprietaire.type;
    document.getElementById('prenom').value = proprietaire.prenom || '';
    document.getElementById('nom').value = proprietaire.nom || '';
    document.getElementById('entreprise').value = proprietaire.entreprise || '';
    document.getElementById('telephone').value = proprietaire.telephone || '';
    document.getElementById('email').value = proprietaire.email || '';
    document.getElementById('adresse').value = proprietaire.adresse || '';
    document.getElementById('ville').value = proprietaire.ville || '';
    document.getElementById('ifu').value = proprietaire.ifu || '';
    
    // Afficher/cacher les champs selon le type
    togglePersonneType();
    
    openModal('addProprietaireModal');
}

// Sauvegarder un propriétaire
async function saveProprietaire() {
    const form = document.getElementById('proprietaireForm');
    const formData = new FormData(form);
    
    const proprietaireData = {
        type: formData.get('type'),
        prenom: formData.get('prenom'),
        nom: formData.get('nom'),
        entreprise: formData.get('entreprise'),
        telephone: formData.get('telephone'),
        email: formData.get('email'),
        adresse: formData.get('adresse'),
        ville: formData.get('ville'),
        ifu: formData.get('ifu')
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingProprietaireId) {
                // Modification
                const index = currentProprietaires.findIndex(p => p.id === editingProprietaireId);
                if (index !== -1) {
                    currentProprietaires[index] = {...currentProprietaires[index], ...proprietaireData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentProprietaires.map(p => p.id), 0) + 1;
                currentProprietaires.push({...proprietaireData, id: newId});
            }
            
            renderProprietaires(currentProprietaires);
            updateStats();
            closeModal('addProprietaireModal');
            showToast('Propriétaire enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingProprietaireId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/proprietaires/${editingProprietaireId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(proprietaireData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/proprietaires`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(proprietaireData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addProprietaireModal');
        loadProprietaires();
        showToast('Propriétaire enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du propriétaire', 'error');
    }
}

// Supprimer un propriétaire
function deleteProprietaire(id) {
    document.getElementById('deleteProprietaireId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeleteProprietaire() {
    const id = document.getElementById('deleteProprietaireId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentProprietaires = currentProprietaires.filter(p => p.id != id);
            renderProprietaires(currentProprietaires);
            updateStats();
            closeModal('deleteModal');
            showToast('Propriétaire supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/proprietaires/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadProprietaires();
        showToast('Propriétaire supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du propriétaire', 'error');
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