/* =============================================
   DASHBOARD JAVASCRIPT
   ============================================= */

// Check authentication
requireAuth();

// Get current user
const currentUser = getCurrentUser();

// Update user info in topbar
document.addEventListener('DOMContentLoaded', async () => {
    if (currentUser) {
        document.getElementById('userName').textContent = `${currentUser.prenom} ${currentUser.nom}`;
        document.getElementById('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        
        // Update avatar
        const avatar = document.getElementById('userAvatar');
        if (avatar) {
            avatar.src = `https://ui-avatars.com/api/?name=${currentUser.prenom}+${currentUser.nom}&background=259B24&color=fff`;
        }
    }
    
    // Load dashboard data
    await loadDashboardStats();
    await loadRecentPayments();
    await loadRecentTickets();
    await loadBiensTable();
    await initCharts();
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Load biens
        const biensData = await API.get('biens', { limit: 1000 });
        const biens = biensData.data || [];
        
        // Load paiements
        const paiementsData = await API.get('paiements', { limit: 1000 });
        const paiements = paiementsData.data || [];
        
        // Load tickets
        const ticketsData = await API.get('tickets', { limit: 1000 });
        const tickets = ticketsData.data || [];
        
        // Calculate stats
        const totalBiens = biens.length;
        const currentMonth = new Date().toISOString().slice(0, 7);
        
        const revenusMois = paiements
            .filter(p => p.mois_concerne === currentMonth && p.statut === 'Validé')
            .reduce((sum, p) => sum + (p.montant || 0), 0);
        
        const impayes = paiements
            .filter(p => p.statut === 'En attente')
            .reduce((sum, p) => sum + (p.montant || 0), 0);
        
        const ticketsOuverts = tickets.filter(t => t.statut === 'Ouvert' || t.statut === 'En cours').length;
        
        // Update UI
        document.getElementById('totalBiens').textContent = totalBiens;
        document.getElementById('revenusMois').textContent = formatCurrency(revenusMois);
        document.getElementById('impayes').textContent = formatCurrency(impayes);
        document.getElementById('ticketsOuverts').textContent = ticketsOuverts;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showToast('Erreur lors du chargement des statistiques', 'error');
    }
}

// Load recent payments
async function loadRecentPayments() {
    const container = document.getElementById('recentPayments');
    
    try {
        const response = await API.get('paiements', { limit: 5, sort: '-created_at' });
        const payments = response.data || [];
        
        if (payments.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--text-light); padding: 2rem;">Aucun paiement récent</p>';
            return;
        }
        
        // Get locataires data for names
        const locatairesData = await API.get('locataires', { limit: 1000 });
        const locataires = locatairesData.data || [];
        
        container.innerHTML = payments.map(payment => {
            const locataire = locataires.find(l => l.id === payment.locataire_id);
            const locataireNom = locataire ? locataire.nom : 'Locataire inconnu';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${payment.statut === 'Validé' ? 'success' : 'warning'}">
                        <i class="fas fa-${payment.statut === 'Validé' ? 'check' : 'clock'}"></i>
                    </div>
                    <div class="activity-info">
                        <div class="activity-title">${locataireNom}</div>
                        <div class="activity-desc">${payment.type_paiement} - ${formatCurrency(payment.montant)}</div>
                        <div class="activity-meta">
                            <i class="fas fa-calendar"></i>
                            <span>${formatShortDate(payment.date_paiement)}</span>
                            <span class="status-badge ${payment.statut === 'Validé' ? 'disponible' : 'occupe'}">${payment.statut}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading recent payments:', error);
        container.innerHTML = '<p class="text-center" style="color: var(--accent); padding: 2rem;">Erreur de chargement</p>';
    }
}

// Load recent tickets
async function loadRecentTickets() {
    const container = document.getElementById('recentTickets');
    
    try {
        const response = await API.get('tickets', { limit: 5, sort: '-created_at' });
        const tickets = response.data || [];
        
        if (tickets.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--text-light); padding: 2rem;">Aucun ticket récent</p>';
            return;
        }
        
        // Get biens data for addresses
        const biensData = await API.get('biens', { limit: 1000 });
        const biens = biensData.data || [];
        
        container.innerHTML = tickets.map(ticket => {
            const bien = biens.find(b => b.id === ticket.bien_id);
            const bienAdresse = bien ? bien.adresse : 'Bien inconnu';
            
            const priorityClass = {
                'Urgente': 'accent',
                'Haute': 'warning',
                'Moyenne': 'info',
                'Faible': 'success'
            }[ticket.priorite] || 'info';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon ${ticket.statut === 'Résolu' ? 'success' : 'warning'}">
                        <i class="fas fa-${ticket.statut === 'Résolu' ? 'check-circle' : 'exclamation-circle'}"></i>
                    </div>
                    <div class="activity-info">
                        <div class="activity-title">${ticket.titre}</div>
                        <div class="activity-desc">${bienAdresse}</div>
                        <div class="activity-meta">
                            <i class="fas fa-calendar"></i>
                            <span>${formatShortDate(ticket.date_creation)}</span>
                            <span class="status-badge ${ticket.statut === 'Résolu' ? 'disponible' : 'occupe'}">${ticket.statut}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error loading recent tickets:', error);
        container.innerHTML = '<p class="text-center" style="color: var(--accent); padding: 2rem;">Erreur de chargement</p>';
    }
}

// Load biens table
async function loadBiensTable() {
    const tbody = document.getElementById('biensTableBody');
    
    try {
        const response = await API.get('biens', { limit: 10, sort: '-created_at' });
        const biens = response.data || [];
        
        if (biens.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-light);">Aucun bien enregistré</td></tr>';
            return;
        }
        
        tbody.innerHTML = biens.map(bien => `
            <tr>
                <td><strong>${bien.reference || '-'}</strong></td>
                <td>${bien.type_bien || '-'}</td>
                <td>${bien.adresse || '-'}, ${bien.ville || '-'}</td>
                <td><strong>${formatCurrency(bien.loyer_mensuel || 0)}</strong></td>
                <td>
                    <span class="status-badge ${(bien.statut || '').toLowerCase().replace('é', 'e')}">${bien.statut || '-'}</span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn-icon-sm btn-view" onclick="viewBien('${bien.id}')" data-tooltip="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon-sm btn-edit" onclick="editBien('${bien.id}')" data-tooltip="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-sm btn-delete" onclick="deleteBien('${bien.id}')" data-tooltip="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading biens table:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 2rem; color: var(--accent);">Erreur de chargement</td></tr>';
    }
}

// Initialize charts
async function initCharts() {
    try {
        // Revenus chart
        const revenusCtx = document.getElementById('revenusChart');
        if (revenusCtx) {
            new Chart(revenusCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'Revenus (FCFA)',
                        data: [320000, 450000, 380000, 520000, 490000, 610000, 580000, 640000, 590000, 680000, 720000, 750000],
                        borderColor: '#259B24',
                        backgroundColor: 'rgba(37, 155, 36, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' FCFA';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Biens chart
        const biensCtx = document.getElementById('biensChart');
        if (biensCtx) {
            const biensData = await API.get('biens', { limit: 1000 });
            const biens = biensData.data || [];
            
            const typeCounts = {};
            biens.forEach(bien => {
                const type = bien.type_bien || 'Autre';
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            });
            
            new Chart(biensCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(typeCounts),
                    datasets: [{
                        data: Object.values(typeCounts),
                        backgroundColor: [
                            '#259B24',
                            '#FFD700',
                            '#3b82f6',
                            '#fb923c',
                            '#ef4444',
                            '#8b5cf6',
                            '#ec4899',
                            '#14b8a6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Bien actions
function viewBien(id) {
    window.location.href = `bien-details.html?id=${id}`;
}

function editBien(id) {
    window.location.href = `biens.html?edit=${id}`;
}

function deleteBien(id) {
    confirmAction('Êtes-vous sûr de vouloir supprimer ce bien ?', async () => {
        try {
            await API.delete('biens', id);
            showToast('Bien supprimé avec succès', 'success');
            await loadBiensTable();
            await loadDashboardStats();
        } catch (error) {
            console.error('Error deleting bien:', error);
            showToast('Erreur lors de la suppression', 'error');
        }
    });
}