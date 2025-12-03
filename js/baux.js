// Gestion des baux
let currentBaux = [];
let currentBiens = [];
let currentLocataires = [];
let editingBailId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    Promise.all([
        loadBaux(),
        loadBiens(),
        loadLocataires()
    ]).then(() => {
        populateSelects();
        setupEventListeners();
    });
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

// Charger les baux
async function loadBaux() {
    try {
        showLoadingSpinner('bauxTableBody');
        
        const response = await apiRequest(buildUrl('baux'));
        const baux = response.data || response;
        
        currentBaux = baux;
        renderBaux(baux);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des baux', 'error');
        // En mode simulation en cas d'erreur
        currentBaux = getDemoBaux();
        renderBaux(currentBaux);
        updateStats();
    }
}

// Charger les biens
async function loadBiens() {
    try {
        const response = await apiRequest(buildUrl('biens'));
        currentBiens = response.data || response;
    } catch (error) {
        console.error('Erreur:', error);
        currentBiens = getDemoBiens();
    }
}

// Charger les locataires
async function loadLocataires() {
    try {
        const response = await apiRequest(buildUrl('locataires'));
        currentLocataires = response.data || response;
    } catch (error) {
        console.error('Erreur:', error);
        currentLocataires = getDemoLocataires();
    }
}

// Obtenir les données de démonstration des biens
function getDemoBiens() {
    return [
        { id: 1, titre: 'Appartement Duplex', type: 'appartement', adresse: '123 Rue de l\'Indépendance, Cotonou' },
        { id: 2, titre: 'Villa Moderne', type: 'villa', adresse: '456 Avenue de la Liberté, Porto-Novo' },
        { id: 3, titre: 'Boutique Commerciale', type: 'boutique', adresse: '789 Boulevard Triomphal, Parakou' }
    ];
}

// Obtenir les données de démonstration des locataires
function getDemoLocataires() {
    return [
        { id: 1, prenom: 'Alice', nom: 'Martin' },
        { id: 2, prenom: 'Bob', nom: 'Bernard' },
        { id: 3, prenom: 'Claire', nom: 'Dubois' }
    ];
}

// Obtenir les données de démonstration
function getDemoBaux() {
    return [
        {
            id: 1,
            reference: 'BAIL-001',
            bien_id: 1,
            locataire_id: 1,
            date_debut: '2023-01-01',
            date_fin: '2024-01-01',
            loyer_base: 150000,
            charges: 20000,
            caution: 300000,
            frais_agence: 50000,
            type_bail: 'Résidentiel',
            statut: 'Actif'
        },
        {
            id: 2,
            reference: 'BAIL-002',
            bien_id: 2,
            locataire_id: 2,
            date_debut: '2023-03-01',
            date_fin: '2024-03-01',
            loyer_base: 250000,
            charges: 30000,
            caution: 500000,
            frais_agence: 75000,
            type_bail: 'Résidentiel',
            statut: 'Actif'
        },
        {
            id: 3,
            reference: 'BAIL-003',
            bien_id: 3,
            locataire_id: 3,
            date_debut: '2022-06-01',
            date_fin: '2023-06-01',
            loyer_base: 100000,
            charges: 15000,
            caution: 200000,
            frais_agence: 30000,
            type_bail: 'Commercial',
            statut: 'Expiré'
        }
    ];
}

// Remplir les selects
function populateSelects() {
    // Biens
    const bienSelect = document.getElementById('bien_id');
    if (bienSelect) {
        bienSelect.innerHTML = '<option value="">-- Sélectionner un bien --</option>';
        currentBiens.forEach(bien => {
            const option = document.createElement('option');
            option.value = bien.id;
            option.textContent = `${bien.titre} (${bien.type})`;
            bienSelect.appendChild(option);
        });
    }
    
    // Locataires
    const locataireSelect = document.getElementById('locataire_id');
    if (locataireSelect) {
        locataireSelect.innerHTML = '<option value="">-- Sélectionner un locataire --</option>';
        currentLocataires.forEach(locataire => {
            const option = document.createElement('option');
            option.value = locataire.id;
            option.textContent = `${locataire.prenom} ${locataire.nom}`;
            locataireSelect.appendChild(option);
        });
    }
    
    // Pour le formulaire d'édition
    const bailBienSelect = document.getElementById('bailForm')?.querySelector('#bien_id');
    if (bailBienSelect) {
        bailBienSelect.innerHTML = '<option value="">-- Sélectionner un bien --</option>';
        currentBiens.forEach(bien => {
            const option = document.createElement('option');
            option.value = bien.id;
            option.textContent = `${bien.titre} (${bien.type})`;
            bailBienSelect.appendChild(option);
        });
    }
    
    const bailLocataireSelect = document.getElementById('bailForm')?.querySelector('#locataire_id');
    if (bailLocataireSelect) {
        bailLocataireSelect.innerHTML = '<option value="">-- Sélectionner un locataire --</option>';
        currentLocataires.forEach(locataire => {
            const option = document.createElement('option');
            option.value = locataire.id;
            option.textContent = `${locataire.prenom} ${locataire.nom}`;
            bailLocataireSelect.appendChild(option);
        });
    }
}

// Afficher les baux dans le tableau
function renderBaux(baux) {
    const tbody = document.getElementById('bauxTableBody');
    
    if (baux.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-file-contract fa-3x"></i>
                        <h3>Aucun bail trouvé</h3>
                        <p>Commencez par ajouter votre premier bail</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = baux.map(bail => {
        const bien = currentBiens.find(b => b.id === bail.bien_id) || { titre: 'Inconnu' };
        const locataire = currentLocataires.find(l => l.id === bail.locataire_id) || { prenom: 'Inconnu', nom: '' };
        
        return `
            <tr>
                <td>
                    <strong>${bail.reference}</strong>
                    <div class="text-muted">${bail.type_bail || 'Standard'}</div>
                </td>
                <td>
                    <div>${bien.titre}</div>
                    <div class="text-muted">${bien.adresse || ''}</div>
                </td>
                <td>${locataire.prenom} ${locataire.nom}</td>
                <td>
                    <div>Du ${formatDate(bail.date_debut)}</div>
                    <div class="text-muted">Au ${formatDate(bail.date_fin)}</div>
                </td>
                <td>
                    <div>${formatCurrency(bail.loyer_base)}</div>
                    <div class="text-muted">+ ${formatCurrency(bail.charges)} charges</div>
                </td>
                <td>
                    <span class="badge badge-${bail.statut === 'Actif' ? 'success' : bail.statut === 'Expiré' ? 'warning' : 'secondary'}">
                        ${bail.statut}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon-sm" onclick="editBail(${bail.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-sm btn-danger" onclick="deleteBail(${bail.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Formater la devise
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentBaux.length;
    const actifs = currentBaux.filter(b => b.statut === 'Actif').length;
    const expires = currentBaux.filter(b => b.statut === 'Expiré').length;
    const resilies = total - actifs - expires;
    
    document.getElementById('totalBaux').textContent = total;
    document.getElementById('bauxActifs').textContent = actifs;
    document.getElementById('bauxExpires').textContent = expires;
    document.getElementById('bauxResilies').textContent = resilies;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterBaux(e.target.value);
        }, 300));
    }
}

// Filtrer les baux
function filterBaux(searchTerm) {
    if (!searchTerm) {
        renderBaux(currentBaux);
        return;
    }
    
    const filtered = currentBaux.filter(bail => {
        const searchLower = searchTerm.toLowerCase();
        const bien = currentBiens.find(b => b.id === bail.bien_id) || {};
        const locataire = currentLocataires.find(l => l.id === bail.locataire_id) || {};
        
        return (
            (bail.reference && bail.reference.toLowerCase().includes(searchLower)) ||
            (bien.titre && bien.titre.toLowerCase().includes(searchLower)) ||
            (locataire.prenom && locataire.prenom.toLowerCase().includes(searchLower)) ||
            (locataire.nom && locataire.nom.toLowerCase().includes(searchLower))
        );
    });
    
    renderBaux(filtered);
}

// Rafraîchir la liste
function refreshBaux() {
    Promise.all([
        loadBaux(),
        loadBiens(),
        loadLocataires()
    ]).then(() => {
        populateSelects();
        showToast('Liste actualisée', 'success');
    });
}

// Ouvrir le modal d'ajout/modification
function openAddBailModal() {
    editingBailId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un bail';
    document.getElementById('bailForm').reset();
    openModal('addBailModal');
}

// Modifier un bail
function editBail(id) {
    const bail = currentBaux.find(b => b.id === id);
    if (!bail) return;
    
    editingBailId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un bail';
    
    // Remplir le formulaire
    document.getElementById('bailId').value = bail.id;
    document.getElementById('bien_id').value = bail.bien_id || '';
    document.getElementById('locataire_id').value = bail.locataire_id || '';
    document.getElementById('date_debut').value = bail.date_debut || '';
    document.getElementById('date_fin').value = bail.date_fin || '';
    document.getElementById('loyer_base').value = bail.loyer_base || '';
    document.getElementById('charges').value = bail.charges || '0';
    document.getElementById('caution').value = bail.caution || '';
    document.getElementById('frais_agence').value = bail.frais_agence || '0';
    document.getElementById('type_bail').value = bail.type_bail || '';
    document.getElementById('statut').value = bail.statut || '';
    document.getElementById('conditions_speciales').value = bail.conditions_speciales || '';
    
    openModal('addBailModal');
}

// Sauvegarder un bail
async function saveBail() {
    const form = document.getElementById('bailForm');
    const formData = new FormData(form);
    
    const bailData = {
        reference: generateReference(), // Générer une référence automatiquement
        bien_id: parseInt(formData.get('bien_id')),
        locataire_id: parseInt(formData.get('locataire_id')),
        date_debut: formData.get('date_debut'),
        date_fin: formData.get('date_fin'),
        loyer_base: parseFloat(formData.get('loyer_base')),
        charges: parseFloat(formData.get('charges') || 0),
        caution: parseFloat(formData.get('caution') || 0),
        frais_agence: parseFloat(formData.get('frais_agence') || 0),
        type_bail: formData.get('type_bail'),
        statut: formData.get('statut'),
        conditions_speciales: formData.get('conditions_speciales')
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingBailId) {
                // Modification
                const index = currentBaux.findIndex(b => b.id === editingBailId);
                if (index !== -1) {
                    currentBaux[index] = {...currentBaux[index], ...bailData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentBaux.map(b => b.id), 0) + 1;
                currentBaux.push({...bailData, id: newId});
            }
            
            renderBaux(currentBaux);
            updateStats();
            closeModal('addBailModal');
            showToast('Bail enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingBailId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/baux/${editingBailId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bailData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/baux`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bailData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addBailModal');
        loadBaux();
        showToast('Bail enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du bail', 'error');
    }
}

// Générer une référence de bail
function generateReference() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BAIL-${year}${month}-${randomNumber}`;
}

// Supprimer un bail
function deleteBail(id) {
    document.getElementById('deleteBailId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeleteBail() {
    const id = document.getElementById('deleteBailId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentBaux = currentBaux.filter(b => b.id != id);
            renderBaux(currentBaux);
            updateStats();
            closeModal('deleteModal');
            showToast('Bail supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/baux/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadBaux();
        showToast('Bail supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du bail', 'error');
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