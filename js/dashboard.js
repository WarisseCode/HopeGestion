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
    await loadDashboardData();
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

// Charger les données du dashboard
async function loadDashboardData() {
    try {
        showLoadingSpinner('biensTableBody');
        showLoadingSpinner('recentPaiements');
        showLoadingSpinner('recentTickets');
        
        if (SIMULATION_MODE) {
            // Mode simulation avec données de démonstration
            const demoData = getDemoDashboardData();
            renderDashboardData(demoData);
            return;
        }
        
        // Charger toutes les données en parallèle
        const [biensResponse, paiementsResponse, ticketsResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/biens`),
            fetch(`${API_BASE_URL}/paiements?_sort=date_paiement&_order=desc&_limit=5`),
            fetch(`${API_BASE_URL}/tickets?_sort=date_creation&_order=desc&_limit=5`)
        ]);
        
        if (!biensResponse.ok || !paiementsResponse.ok || !ticketsResponse.ok) {
            throw new Error('Erreur lors du chargement des données du dashboard');
        }
        
        const biens = await biensResponse.json();
        const paiements = await paiementsResponse.json();
        const tickets = await ticketsResponse.json();
        
        renderDashboardData({ biens, paiements, tickets });
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des données du dashboard', 'error');
        
        // Mode simulation en cas d'erreur
        const demoData = getDemoDashboardData();
        renderDashboardData(demoData);
    }
}

// Obtenir les données de démonstration du dashboard
function getDemoDashboardData() {
    return {
        biens: [
            {
                id: 1,
                titre: "Appartement Duplex",
                type: "appartement",
                ville: "Cotonou",
                prix_location: 150000,
                statut: "Disponible"
            },
            {
                id: 2,
                titre: "Villa Moderne",
                type: "villa",
                ville: "Porto-Novo",
                prix_location: 250000,
                statut: "Occupé"
            },
            {
                id: 3,
                titre: "Boutique Commerciale",
                type: "boutique",
                ville: "Parakou",
                prix_location: 100000,
                statut: "En maintenance"
            }
        ],
        paiements: [
            {
                id: 1,
                reference: "PAY-001",
                montant: 170000,
                date_paiement: "2023-10-05",
                statut: "Validé"
            },
            {
                id: 2,
                reference: "PAY-002",
                montant: 280000,
                date_paiement: "2023-10-10",
                statut: "Validé"
            }
        ],
        tickets: [
            {
                id: 1,
                reference: "TKT-001",
                titre: "Fuite d'eau dans la cuisine",
                priorite: "Haute",
                statut: "En cours"
            },
            {
                id: 2,
                reference: "TKT-002",
                titre: "Problème de climatisation",
                priorite: "Moyenne",
                statut: "Ouvert"
            }
        ]
    };
}

// Rendre les données du dashboard
function renderDashboardData(data) {
    renderBiens(data.biens);
    renderRecentPaiements(data.paiements);
    renderRecentTickets(data.tickets);
    updateStats(data.biens, data.paiements);
    initializeCharts(data.biens, data.paiements);
}

// Mettre à jour les statistiques
function updateStats(biens, paiements) {
    const totalBiens = biens.length;
    const biensDisponibles = biens.filter(bien => bien.statut === 'Disponible').length;
    const revenusMensuels = paiements
        .filter(p => p.statut === 'Validé')
        .reduce((sum, paiement) => sum + paiements.montant, 0);
    const ticketsOuverts = 2; // Simulation
    
    document.getElementById('totalBiens').textContent = totalBiens;
    document.getElementById('biensDisponibles').textContent = biensDisponibles;
    document.getElementById('revenusMensuels').textContent = formatCurrency(revenusMensuels);
    document.getElementById('ticketsOuverts').textContent = ticketsOuverts;
}

// Initialiser les graphiques
function initializeCharts(biens, paiements) {
    // Graphique de répartition des biens par type
    const biensParType = {};
    biens.forEach(bien => {
        biensParType[bien.type] = (biensParType[bien.type] || 0) + 1;
    });
    
    const typeLabels = Object.keys(biensParType);
    const typeData = Object.values(biensParType);
    
    const typeChartCtx = document.getElementById('biensTypeChart');
    if (typeChartCtx) {
        new Chart(typeChartCtx, {
            type: 'doughnut',
            data: {
                labels: typeLabels,
                datasets: [{
                    data: typeData,
                    backgroundColor: [
                        '#259B24',
                        '#FFD700',
                        '#E84118',
                        '#17A2B8',
                        '#6C757D'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Graphique des revenus mensuels
    const revenusCtx = document.getElementById('revenusChart');
    if (revenusCtx) {
        new Chart(revenusCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Revenus (FCFA)',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 150000, 280000, 0], // Données de démonstration
                    borderColor: '#259B24',
                    backgroundColor: 'rgba(37, 155, 36, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
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