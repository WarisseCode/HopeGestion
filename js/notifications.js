// Gestion des notifications
let currentNotifications = [];
let filteredNotifications = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadNotifications();
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

// Charger les notifications
async function loadNotifications() {
    try {
        showLoadingSpinner('notificationsList');
        
        const response = await apiRequest(buildUrl('notifications'));
        const notifications = response.data || response;
        
        currentNotifications = notifications;
        renderNotifications(notifications);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des notifications', 'error');
        // En mode simulation en cas d'erreur
        currentNotifications = getDemoNotifications();
        renderNotifications(currentNotifications);
        updateStats();
    }
}

// Obtenir les données de démonstration
function getDemoNotifications() {
    return [
        {
            id: 1,
            titre: 'Nouveau paiement reçu',
            message: 'Un paiement de 170 000 FCFA a été reçu pour le bail BAIL-001.',
            categorie: 'paiement',
            priorite: 'normale',
            statut: 'unread',
            date_creation: '2023-10-15T10:30:00',
            action_url: '/paiements.html'
        },
        {
            id: 2,
            titre: 'Ticket de maintenance urgent',
            message: 'Un ticket de maintenance urgent a été créé pour l\'appartement Duplex.',
            categorie: 'maintenance',
            priorite: 'haute',
            statut: 'unread',
            date_creation: '2023-10-14T14:15:00',
            action_url: '/tickets.html'
        },
        {
            id: 3,
            titre: 'Bail expirant bientôt',
            message: 'Le bail BAIL-003 expire dans 30 jours. Pensez à renouveler.',
            categorie: 'bail',
            priorite: 'moyenne',
            statut: 'read',
            date_creation: '2023-10-10T09:00:00',
            action_url: '/baux.html'
        },
        {
            id: 4,
            titre: 'Nouveau document téléchargé',
            message: 'Un nouveau contrat a été téléchargé pour la villa moderne.',
            categorie: 'document',
            priorite: 'normale',
            statut: 'read',
            date_creation: '2023-10-05T16:45:00',
            action_url: '/documents.html'
        },
        {
            id: 5,
            titre: 'Paiement en retard',
            message: 'Le paiement pour le bail BAIL-002 est en retard de 5 jours.',
            categorie: 'paiement',
            priorite: 'haute',
            statut: 'unread',
            date_creation: '2023-10-01T08:20:00',
            action_url: '/paiements.html'
        }
    ];
}

// Afficher les notifications dans la liste
function renderNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash fa-3x"></i>
                <h3>Aucune notification</h3>
                <p>Vous n'avez aucune notification pour le moment</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.statut === 'unread' ? 'unread' : ''}" 
             onclick="viewNotificationDetail(${notification.id})">
            <div class="notification-icon">
                <i class="${getNotificationIcon(notification.categorie)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-header">
                    <h4>${notification.titre}</h4>
                    <span class="notification-time">${formatTimeAgo(notification.date_creation)}</span>
                </div>
                <p class="notification-message">${notification.message}</p>
                <div class="notification-meta">
                    <span class="notification-category badge badge-${getCategoryClass(notification.categorie)}">
                        ${getCategoryLabel(notification.categorie)}
                    </span>
                    ${notification.priorite === 'haute' ? 
                        '<span class="notification-priority badge badge-danger">Prioritaire</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Obtenir l'icône de notification
function getNotificationIcon(category) {
    switch (category) {
        case 'paiement': return 'fas fa-money-bill-wave';
        case 'maintenance': return 'fas fa-wrench';
        case 'bail': return 'fas fa-file-contract';
        case 'document': return 'fas fa-file-alt';
        default: return 'fas fa-bell';
    }
}

// Obtenir la classe CSS pour la catégorie
function getCategoryClass(category) {
    switch (category) {
        case 'paiement': return 'success';
        case 'maintenance': return 'warning';
        case 'bail': return 'info';
        case 'document': return 'primary';
        default: return 'secondary';
    }
}

// Obtenir le libellé de la catégorie
function getCategoryLabel(category) {
    switch (category) {
        case 'paiement': return 'Paiement';
        case 'maintenance': return 'Maintenance';
        case 'bail': return 'Bail';
        case 'document': return 'Document';
        default: return 'Général';
    }
}

// Formater le temps écoulé
function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Il y a ${minutes} min${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentNotifications.length;
    const unread = currentNotifications.filter(n => n.statut === 'unread').length;
    const read = total - unread;
    const urgent = currentNotifications.filter(n => n.priorite === 'haute').length;
    
    document.getElementById('totalNotifications').textContent = total;
    document.getElementById('unreadNotifications').textContent = unread;
    document.getElementById('readNotifications').textContent = read;
    document.getElementById('urgentNotifications').textContent = urgent;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Filtres
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    
    if (filterType) {
        filterType.addEventListener('change', filterNotifications);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', filterNotifications);
    }
}

// Filtrer les notifications
function filterNotifications() {
    const typeFilter = document.getElementById('filterType')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    
    filteredNotifications = currentNotifications.filter(notification => {
        const typeMatch = typeFilter === 'all' || notification.categorie === typeFilter;
        const statusMatch = statusFilter === 'all' || notification.statut === statusFilter;
        return typeMatch && statusMatch;
    });
    
    renderNotifications(filteredNotifications);
}

// Voir le détail d'une notification
function viewNotificationDetail(id) {
    const notification = currentNotifications.find(n => n.id === id);
    if (!notification) return;
    
    // Marquer comme lu
    if (notification.statut === 'unread') {
        markAsRead(id);
    }
    
    // Remplir le modal
    document.getElementById('detailTitle').textContent = notification.titre;
    document.getElementById('detailDate').textContent = formatDate(notification.date_creation);
    document.getElementById('detailCategory').textContent = getCategoryLabel(notification.categorie);
    document.getElementById('detailMessage').textContent = notification.message;
    
    // Configurer le bouton d'action
    const actionButton = document.getElementById('actionButton');
    if (actionButton) {
        if (notification.action_url) {
            actionButton.style.display = 'inline-block';
            actionButton.onclick = () => window.location.href = notification.action_url;
        } else {
            actionButton.style.display = 'none';
        }
    }
    
    openModal('notificationDetailModal');
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Marquer toutes les notifications comme lues
function markAllAsRead() {
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentNotifications = currentNotifications.map(notification => ({
                ...notification,
                statut: 'read'
            }));
            
            filteredNotifications = [...currentNotifications];
            renderNotifications(filteredNotifications);
            updateStats();
            showToast('Toutes les notifications ont été marquées comme lues', 'success');
            return;
        }
        
        // Mode API réelle
        fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                loadNotifications();
                showToast('Toutes les notifications ont été marquées comme lues', 'success');
            } else {
                throw new Error('Erreur lors du marquage des notifications');
            }
        });
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du marquage des notifications', 'error');
    }
}

// Effacer toutes les notifications
function clearAllNotifications() {
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentNotifications = [];
            filteredNotifications = [];
            renderNotifications(filteredNotifications);
            updateStats();
            showToast('Toutes les notifications ont été effacées', 'success');
            return;
        }
        
        // Mode API réelle
        fetch(`${API_BASE_URL}/notifications/clear-all`, {
            method: 'DELETE'
        }).then(response => {
            if (response.ok) {
                loadNotifications();
                showToast('Toutes les notifications ont été effacées', 'success');
            } else {
                throw new Error('Erreur lors de l\'effacement des notifications');
            }
        });
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'effacement des notifications', 'error');
    }
}

// Marquer une notification comme lue
async function markAsRead(id) {
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            const notification = currentNotifications.find(n => n.id === id);
            if (notification) {
                notification.statut = 'read';
                updateStats();
            }
            return;
        }
        
        // Mode API réelle
        await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PUT'
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Créer une nouvelle notification
function createNotification(title, message, category = 'general', priority = 'normal', actionUrl = null) {
    const notification = {
        titre: title,
        message: message,
        categorie: category,
        priorite: priority,
        statut: 'unread',
        date_creation: new Date().toISOString(),
        action_url: actionUrl
    };
    
    if (SIMULATION_MODE) {
        // En mode simulation, ajouter à la liste
        const newId = Math.max(...currentNotifications.map(n => n.id), 0) + 1;
        currentNotifications.unshift({...notification, id: newId});
        filteredNotifications = [...currentNotifications];
        renderNotifications(filteredNotifications);
        updateStats();
        return;
    }
    
    // En mode API réelle, envoyer à l'API
    fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(notification)
    }).then(response => {
        if (response.ok) {
            loadNotifications(); // Recharger pour afficher la nouvelle notification
        }
    }).catch(error => {
        console.error('Erreur lors de la création de la notification:', error);
    });
}