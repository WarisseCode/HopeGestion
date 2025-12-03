// Gestion des paiements
let currentPaiements = [];
let currentBaux = [];
let currentLocataires = [];
let editingPaiementId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    Promise.all([
        loadPaiements(),
        loadBaux(),
        loadLocataires()
    ]).then(() => {
        populateSelects();
        setupEventListeners();
        updateStats();
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

// Charger les paiements
async function loadPaiements() {
    try {
        showLoadingSpinner('paiementsTableBody');
        
        if (SIMULATION_MODE) {
            // Mode simulation avec données de démonstration
            currentPaiements = getDemoPaiements();
            renderPaiements(currentPaiements);
            updateStats();
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/paiements`);
        if (!response.ok) throw new Error('Erreur lors du chargement des paiements');
        
        currentPaiements = await response.json();
        renderPaiements(currentPaiements);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des paiements', 'error');
        // En mode simulation en cas d'erreur
        currentPaiements = getDemoPaiements();
        renderPaiements(currentPaiements);
        updateStats();
    }
}

// Charger les baux
async function loadBaux() {
    try {
        if (SIMULATION_MODE) {
            currentBaux = getDemoBaux();
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/baux`);
        if (!response.ok) throw new Error('Erreur lors du chargement des baux');
        currentBaux = await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        currentBaux = getDemoBaux();
    }
}

// Charger les locataires
async function loadLocataires() {
    try {
        if (SIMULATION_MODE) {
            currentLocataires = getDemoLocataires();
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/locataires`);
        if (!response.ok) throw new Error('Erreur lors du chargement des locataires');
        currentLocataires = await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        currentLocataires = getDemoLocataires();
    }
}

// Obtenir les données de démonstration des baux
function getDemoBaux() {
    return [
        { id: 1, reference: 'BAIL-001', locataire_id: 1 },
        { id: 2, reference: 'BAIL-002', locataire_id: 2 },
        { id: 3, reference: 'BAIL-003', locataire_id: 3 }
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
function getDemoPaiements() {
    return [
        {
            id: 1,
            reference: 'PAY-001',
            bail_id: 1,
            locataire_id: 1,
            mois_concerne: '2023-10',
            date_paiement: '2023-10-05',
            montant: 170000,
            methode_paiement: 'Mobile Money',
            operateur: 'MTN',
            numero_transaction: 'TXN123456789',
            notes: 'Paiement effectué sans problème',
            statut: 'Validé'
        },
        {
            id: 2,
            reference: 'PAY-002',
            bail_id: 2,
            locataire_id: 2,
            mois_concerne: '2023-10',
            date_paiement: '2023-10-10',
            montant: 280000,
            methode_paiement: 'Virement',
            operateur: '',
            numero_transaction: 'VIR987654321',
            notes: 'Virement bancaire',
            statut: 'Validé'
        },
        {
            id: 3,
            reference: 'PAY-003',
            bail_id: 1,
            locataire_id: 1,
            mois_concerne: '2023-09',
            date_paiement: '2023-09-03',
            montant: 170000,
            methode_paiement: 'Espèces',
            operateur: '',
            numero_transaction: '',
            notes: 'Paiement en espèces',
            statut: 'Validé'
        }
    ];
}

// Remplir les selects
function populateSelects() {
    // Baux
    const bailSelect = document.getElementById('bail_id');
    if (bailSelect) {
        bailSelect.innerHTML = '<option value="">-- Sélectionner un bail --</option>';
        currentBaux.forEach(bail => {
            const option = document.createElement('option');
            option.value = bail.id;
            option.textContent = `${bail.reference}`;
            bailSelect.appendChild(option);
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
    const paiementBailSelect = document.getElementById('paiementForm')?.querySelector('#bail_id');
    if (paiementBailSelect) {
        paiementBailSelect.innerHTML = '<option value="">-- Sélectionner un bail --</option>';
        currentBaux.forEach(bail => {
            const option = document.createElement('option');
            option.value = bail.id;
            option.textContent = `${bail.reference}`;
            paiementBailSelect.appendChild(option);
        });
    }
    
    const paiementLocataireSelect = document.getElementById('paiementForm')?.querySelector('#locataire_id');
    if (paiementLocataireSelect) {
        paiementLocataireSelect.innerHTML = '<option value="">-- Sélectionner un locataire --</option>';
        currentLocataires.forEach(locataire => {
            const option = document.createElement('option');
            option.value = locataire.id;
            option.textContent = `${locataire.prenom} ${locataire.nom}`;
            paiementLocataireSelect.appendChild(option);
        });
    }
}

// Afficher les paiements dans le tableau
function renderPaiements(paiements) {
    const tbody = document.getElementById('paiementsTableBody');
    
    if (paiements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-money-bill-wave fa-3x"></i>
                        <h3>Aucun paiement trouvé</h3>
                        <p>Commencez par ajouter votre premier paiement</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = paiements.map(paiement => {
        const bail = currentBaux.find(b => b.id === paiement.bail_id) || { reference: 'Inconnu' };
        const locataire = currentLocataires.find(l => l.id === paiement.locataire_id) || { prenom: 'Inconnu', nom: '' };
        
        return `
            <tr>
                <td>
                    <strong>${paiement.reference}</strong>
                    <div class="text-muted">${paiement.methode_paiement}</div>
                </td>
                <td>${locataire.prenom} ${locataire.nom}</td>
                <td>${formatMonth(paiement.mois_concerne)}</td>
                <td>${formatDate(paiement.date_paiement)}</td>
                <td>${formatCurrency(paiement.montant)}</td>
                <td>${paiement.operateur || '-'}</td>
                <td>
                    <span class="badge badge-${paiement.statut === 'Validé' ? 'success' : paiement.statut === 'En attente' ? 'warning' : 'secondary'}">
                        ${paiement.statut}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon-sm" onclick="editPaiement(${paiement.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-sm btn-danger" onclick="deletePaiement(${paiement.id})" title="Supprimer">
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

// Formater le mois
function formatMonth(monthString) {
    if (!monthString) return '-';
    const [year, month] = monthString.split('-');
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[parseInt(month) - 1]} ${year}`;
}

// Formater la devise
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentPaiements.length;
    const valides = currentPaiements.filter(p => p.statut === 'Validé').length;
    const enAttente = currentPaiements.filter(p => p.statut === 'En attente').length;
    const revenus = currentPaiements
        .filter(p => p.statut === 'Validé')
        .reduce((sum, paiement) => sum + paiement.montant, 0);
    
    document.getElementById('totalPaiements').textContent = total;
    document.getElementById('paiementsValides').textContent = valides;
    document.getElementById('paiementsEnAttente').textContent = enAttente;
    document.getElementById('revenusTotaux').textContent = formatCurrency(revenus);
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterPaiements(e.target.value);
        }, 300));
    }
    
    // Méthode de paiement
    const methodeSelect = document.getElementById('methode_paiement');
    if (methodeSelect) {
        methodeSelect.addEventListener('change', function() {
            togglePaymentFields(this.value);
        });
    }
}

// Basculer les champs de paiement selon la méthode
function togglePaymentFields(method) {
    const operateurGroup = document.getElementById('operateurGroup');
    const numeroTransactionGroup = document.getElementById('numeroTransactionGroup');
    
    if (method === 'Mobile Money') {
        operateurGroup.style.display = 'block';
        numeroTransactionGroup.style.display = 'block';
    } else {
        operateurGroup.style.display = 'none';
        numeroTransactionGroup.style.display = 'none';
    }
}

// Filtrer les paiements
function filterPaiements(searchTerm) {
    if (!searchTerm) {
        renderPaiements(currentPaiements);
        return;
    }
    
    const filtered = currentPaiements.filter(paiement => {
        const searchLower = searchTerm.toLowerCase();
        const bail = currentBaux.find(b => b.id === paiement.bail_id) || {};
        const locataire = currentLocataires.find(l => l.id === paiement.locataire_id) || {};
        
        return (
            (paiement.reference && paiement.reference.toLowerCase().includes(searchLower)) ||
            (bail.reference && bail.reference.toLowerCase().includes(searchLower)) ||
            (locataire.prenom && locataire.prenom.toLowerCase().includes(searchLower)) ||
            (locataire.nom && locataire.nom.toLowerCase().includes(searchLower)) ||
            (paiement.methode_paiement && paiement.methode_paiement.toLowerCase().includes(searchLower))
        );
    });
    
    renderPaiements(filtered);
}

// Rafraîchir la liste
function refreshPaiements() {
    Promise.all([
        loadPaiements(),
        loadBaux(),
        loadLocataires()
    ]).then(() => {
        populateSelects();
        showToast('Liste actualisée', 'success');
    });
}

// Ouvrir le modal d'ajout/modification
function openAddPaiementModal() {
    editingPaiementId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un paiement';
    document.getElementById('paiementForm').reset();
    
    // Masquer les champs spécifiques
    document.getElementById('operateurGroup').style.display = 'none';
    document.getElementById('numeroTransactionGroup').style.display = 'none';
    
    openModal('addPaiementModal');
}

// Modifier un paiement
function editPaiement(id) {
    const paiement = currentPaiements.find(p => p.id === id);
    if (!paiement) return;
    
    editingPaiementId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un paiement';
    
    // Remplir le formulaire
    document.getElementById('paiementId').value = paiement.id;
    document.getElementById('bail_id').value = paiement.bail_id || '';
    document.getElementById('locataire_id').value = paiement.locataire_id || '';
    document.getElementById('mois_concerne').value = paiement.mois_concerne || '';
    document.getElementById('date_paiement').value = paiement.date_paiement || '';
    document.getElementById('montant').value = paiement.montant || '';
    document.getElementById('methode_paiement').value = paiement.methode_paiement || '';
    document.getElementById('operateur').value = paiement.operateur || '';
    document.getElementById('numero_transaction').value = paiement.numero_transaction || '';
    document.getElementById('notes').value = paiement.notes || '';
    document.getElementById('statut').value = paiement.statut || '';
    
    // Afficher/masquer les champs selon la méthode
    togglePaymentFields(paiement.methode_paiement);
    
    openModal('addPaiementModal');
}

// Sauvegarder un paiement
async function savePaiement() {
    const form = document.getElementById('paiementForm');
    const formData = new FormData(form);
    
    const paiementData = {
        reference: generateReference(), // Générer une référence automatiquement
        bail_id: parseInt(formData.get('bail_id')),
        locataire_id: parseInt(formData.get('locataire_id')),
        mois_concerne: formData.get('mois_concerne'),
        date_paiement: formData.get('date_paiement'),
        montant: parseFloat(formData.get('montant')),
        methode_paiement: formData.get('methode_paiement'),
        operateur: formData.get('operateur') || '',
        numero_transaction: formData.get('numero_transaction') || '',
        notes: formData.get('notes') || '',
        statut: formData.get('statut')
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingPaiementId) {
                // Modification
                const index = currentPaiements.findIndex(p => p.id === editingPaiementId);
                if (index !== -1) {
                    currentPaiements[index] = {...currentPaiements[index], ...paiementData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentPaiements.map(p => p.id), 0) + 1;
                currentPaiements.push({...paiementData, id: newId});
            }
            
            renderPaiements(currentPaiements);
            updateStats();
            closeModal('addPaiementModal');
            showToast('Paiement enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingPaiementId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/paiements/${editingPaiementId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paiementData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/paiements`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paiementData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addPaiementModal');
        loadPaiements();
        showToast('Paiement enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du paiement', 'error');
    }
}

// Générer une référence de paiement
function generateReference() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAY-${year}${month}-${randomNumber}`;
}

// Supprimer un paiement
function deletePaiement(id) {
    document.getElementById('deletePaiementId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeletePaiement() {
    const id = document.getElementById('deletePaiementId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentPaiements = currentPaiements.filter(p => p.id != id);
            renderPaiements(currentPaiements);
            updateStats();
            closeModal('deleteModal');
            showToast('Paiement supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/paiements/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadPaiements();
        showToast('Paiement supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du paiement', 'error');
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