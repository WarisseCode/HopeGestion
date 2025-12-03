// Gestion des tickets
let currentTickets = [];
let currentBiens = [];
let currentLocataires = [];
let editingTicketId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    Promise.all([
        loadTickets(),
        loadBiens(),
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

// Charger les tickets
async function loadTickets() {
    try {
        showLoadingSpinner('ticketsTableBody');
        
        const response = await apiRequest(buildUrl('tickets'));
        const tickets = response.data || response;
        
        currentTickets = tickets;
        renderTickets(tickets);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des tickets', 'error');
        // En mode simulation en cas d'erreur
        currentTickets = getDemoTickets();
        renderTickets(currentTickets);
        updateStats();
    }
}

// Charger les biens pour le formulaire
async function loadBiens() {
    try {
        const response = await apiRequest(buildUrl('biens'));
        currentBiens = response.data || response;
    } catch (error) {
        console.error('Erreur:', error);
        currentBiens = getDemoBiens();
    }
}

// Charger les locataires pour le formulaire
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
function getDemoTickets() {
    return [
        {
            id: 1,
            reference: 'TKT-001',
            titre: 'Fuite d\'eau dans la cuisine',
            description: 'Le robinet de la cuisine fuit depuis hier soir. L\'eau continue de couler même après avoir fermé le robinet.',
            categorie: 'Plomberie',
            priorite: 'Haute',
            statut: 'En cours',
            date_creation: '2023-10-15',
            date_resolution: null,
            bien_id: 1,
            locataire_id: 1,
            technicien_assigne: 'Jean Plombier',
            cout_reparation: 15000,
            notes: 'Pièce de rechange nécessaire'
        },
        {
            id: 2,
            reference: 'TKT-002',
            titre: 'Problème de climatisation',
            description: 'La climatisation ne refroidit plus correctement. Bruit anormal lors de son fonctionnement.',
            categorie: 'Climatisation',
            priorite: 'Moyenne',
            statut: 'Ouvert',
            date_creation: '2023-10-10',
            date_resolution: null,
            bien_id: 2,
            locataire_id: 2,
            technicien_assigne: '',
            cout_reparation: 0,
            notes: ''
        },
        {
            id: 3,
            reference: 'TKT-003',
            titre: 'Porte d\'entrée cassée',
            description: 'La poignée de la porte d\'entrée est cassée et la porte ne ferme plus correctement.',
            categorie: 'Menuiserie',
            priorite: 'Faible',
            statut: 'Résolu',
            date_creation: '2023-09-20',
            date_resolution: '2023-09-25',
            bien_id: 3,
            locataire_id: 3,
            technicien_assigne: 'Pierre Menuisier',
            cout_reparation: 8000,
            notes: 'Remplacement de la poignée effectué'
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
        locataireSelect.innerHTML = '<option value="">-- Sélectionner un locataire (optionnel) --</option>';
        currentLocataires.forEach(locataire => {
            const option = document.createElement('option');
            option.value = locataire.id;
            option.textContent = `${locataire.prenom} ${locataire.nom}`;
            locataireSelect.appendChild(option);
        });
    }
    
    // Pour le formulaire d'édition
    const ticketBienSelect = document.getElementById('ticketForm')?.querySelector('#bien_id');
    if (ticketBienSelect) {
        ticketBienSelect.innerHTML = '<option value="">-- Sélectionner un bien --</option>';
        currentBiens.forEach(bien => {
            const option = document.createElement('option');
            option.value = bien.id;
            option.textContent = `${bien.titre} (${bien.type})`;
            ticketBienSelect.appendChild(option);
        });
    }
    
    const ticketLocataireSelect = document.getElementById('ticketForm')?.querySelector('#locataire_id');
    if (ticketLocataireSelect) {
        ticketLocataireSelect.innerHTML = '<option value="">-- Sélectionner un locataire (optionnel) --</option>';
        currentLocataires.forEach(locataire => {
            const option = document.createElement('option');
            option.value = locataire.id;
            option.textContent = `${locataire.prenom} ${locataire.nom}`;
            ticketLocataireSelect.appendChild(option);
        });
    }
}

// Afficher les tickets dans le tableau
function renderTickets(tickets) {
    const tbody = document.getElementById('ticketsTableBody');
    
    if (tickets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-ticket-alt fa-3x"></i>
                        <h3>Aucun ticket trouvé</h3>
                        <p>Commencez par ajouter votre premier ticket</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = tickets.map(ticket => {
        const bien = currentBiens.find(b => b.id === ticket.bien_id) || { titre: 'Inconnu' };
        const locataire = currentLocataires.find(l => l.id === ticket.locataire_id) || { prenom: '', nom: '' };
        
        return `
            <tr>
                <td>
                    <strong>${ticket.reference}</strong>
                    <div class="text-muted">${ticket.categorie || '-'}</div>
                </td>
                <td>${ticket.titre}</td>
                <td>${bien.titre}</td>
                <td>
                    <span class="badge badge-${getPriorityClass(ticket.priorite)}">
                        ${ticket.priorite}
                    </span>
                </td>
                <td>
                    <span class="badge badge-${getStatusClass(ticket.statut)}">
                        ${ticket.statut}
                    </span>
                </td>
                <td>${formatDate(ticket.date_creation)}</td>
                <td>${ticket.technicien_assigne || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon-sm" onclick="editTicket(${ticket.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-sm btn-danger" onclick="deleteTicket(${ticket.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Obtenir la classe CSS pour la priorité
function getPriorityClass(priority) {
    switch (priority) {
        case 'Urgente': return 'danger';
        case 'Haute': return 'warning';
        case 'Moyenne': return 'info';
        case 'Faible': return 'secondary';
        default: return 'secondary';
    }
}

// Obtenir la classe CSS pour le statut
function getStatusClass(status) {
    switch (status) {
        case 'Résolu': return 'success';
        case 'En cours': return 'warning';
        case 'Ouvert': return 'info';
        case 'Fermé': return 'secondary';
        default: return 'secondary';
    }
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentTickets.length;
    const resolus = currentTickets.filter(t => t.statut === 'Résolu').length;
    const enCours = currentTickets.filter(t => t.statut === 'En cours').length;
    const ouverts = currentTickets.filter(t => t.statut === 'Ouvert').length;
    
    document.getElementById('totalTickets').textContent = total;
    document.getElementById('ticketsResolus').textContent = resolus;
    document.getElementById('ticketsEnCours').textContent = enCours;
    document.getElementById('ticketsOuverts').textContent = ouverts;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterTickets(e.target.value);
        }, 300));
    }
}

// Filtrer les tickets
function filterTickets(searchTerm) {
    if (!searchTerm) {
        renderTickets(currentTickets);
        return;
    }
    
    const filtered = currentTickets.filter(ticket => {
        const searchLower = searchTerm.toLowerCase();
        const bien = currentBiens.find(b => b.id === ticket.bien_id) || {};
        const locataire = currentLocataires.find(l => l.id === ticket.locataire_id) || {};
        
        return (
            (ticket.reference && ticket.reference.toLowerCase().includes(searchLower)) ||
            (ticket.titre && ticket.titre.toLowerCase().includes(searchLower)) ||
            (ticket.description && ticket.description.toLowerCase().includes(searchLower)) ||
            (bien.titre && bien.titre.toLowerCase().includes(searchLower)) ||
            (locataire.prenom && locataire.prenom.toLowerCase().includes(searchLower)) ||
            (locataire.nom && locataire.nom.toLowerCase().includes(searchLower)) ||
            (ticket.categorie && ticket.categorie.toLowerCase().includes(searchLower))
        );
    });
    
    renderTickets(filtered);
}

// Rafraîchir la liste
function refreshTickets() {
    Promise.all([
        loadTickets(),
        loadBiens(),
        loadLocataires()
    ]).then(() => {
        populateSelects();
        showToast('Liste actualisée', 'success');
    });
}

// Ouvrir le modal d'ajout/modification
function openAddTicketModal() {
    editingTicketId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un ticket';
    document.getElementById('ticketForm').reset();
    openModal('addTicketModal');
}

// Modifier un ticket
function editTicket(id) {
    const ticket = currentTickets.find(t => t.id === id);
    if (!ticket) return;
    
    editingTicketId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un ticket';
    
    // Remplir le formulaire
    document.getElementById('ticketId').value = ticket.id;
    document.getElementById('bien_id').value = ticket.bien_id || '';
    document.getElementById('locataire_id').value = ticket.locataire_id || '';
    document.getElementById('titre').value = ticket.titre || '';
    document.getElementById('description').value = ticket.description || '';
    document.getElementById('categorie').value = ticket.categorie || '';
    document.getElementById('priorite').value = ticket.priorite || '';
    document.getElementById('date_creation').value = ticket.date_creation || '';
    document.getElementById('technicien_assigne').value = ticket.technicien_assigne || '';
    document.getElementById('cout_reparation').value = ticket.cout_reparation || '';
    document.getElementById('statut').value = ticket.statut || '';
    
    openModal('addTicketModal');
}

// Sauvegarder un ticket
async function saveTicket() {
    const form = document.getElementById('ticketForm');
    const formData = new FormData(form);
    
    const ticketData = {
        reference: generateReference(), // Générer une référence automatiquement
        bien_id: parseInt(formData.get('bien_id')),
        locataire_id: parseInt(formData.get('locataire_id')) || null,
        titre: formData.get('titre'),
        description: formData.get('description'),
        categorie: formData.get('categorie'),
        priorite: formData.get('priorite'),
        date_creation: formData.get('date_creation'),
        technicien_assigne: formData.get('technicien_assigne') || '',
        cout_reparation: parseFloat(formData.get('cout_reparation') || 0),
        statut: formData.get('statut')
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingTicketId) {
                // Modification
                const index = currentTickets.findIndex(t => t.id === editingTicketId);
                if (index !== -1) {
                    currentTickets[index] = {...currentTickets[index], ...ticketData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentTickets.map(t => t.id), 0) + 1;
                currentTickets.push({...ticketData, id: newId});
            }
            
            renderTickets(currentTickets);
            updateStats();
            closeModal('addTicketModal');
            showToast('Ticket enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingTicketId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/tickets/${editingTicketId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(ticketData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/tickets`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(ticketData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addTicketModal');
        loadTickets();
        showToast('Ticket enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du ticket', 'error');
    }
}

// Générer une référence de ticket
function generateReference() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TKT-${year}${month}-${randomNumber}`;
}

// Supprimer un ticket
function deleteTicket(id) {
    document.getElementById('deleteTicketId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeleteTicket() {
    const id = document.getElementById('deleteTicketId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentTickets = currentTickets.filter(t => t.id != id);
            renderTickets(currentTickets);
            updateStats();
            closeModal('deleteModal');
            showToast('Ticket supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadTickets();
        showToast('Ticket supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du ticket', 'error');
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