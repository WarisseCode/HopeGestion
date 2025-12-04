/* =============================================
   HOPE GESTION IMMOBILIÈRE - MAIN JAVASCRIPT
   ============================================= */

// Utility Functions
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-BJ', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        }).format(date);
};

const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
};

const generateReference = (prefix) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
};

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// API Helper Functions
const API = {
    async get(table, params = {}) {
        // Use the new buildUrl function if available
        let url;
        if (typeof window.buildUrl === 'function') {
            url = window.buildUrl(table, null, params);
        } else {
            const queryString = new URLSearchParams(params).toString();
            url = `tables/${table}${queryString ? '?' + queryString : ''}`;
        }
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url);
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }
        } catch (error) {
            console.error(`Error fetching ${table}:`, error);
            throw error;
        }
    },
    
    async getById(table, id) {
        // Use the new buildUrl function if available
        const url = typeof window.buildUrl === 'function' ? 
            window.buildUrl(table, id) : 
            `tables/${table}/${id}`;
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url);
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }
        } catch (error) {
            console.error(`Error fetching ${table}/${id}:`, error);
            throw error;
        }
    },
    
    async create(table, data) {
        // Use the new buildUrl function if available
        const url = typeof window.buildUrl === 'function' ? 
            window.buildUrl(table) : 
            `tables/${table}`;
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url, {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
            } else {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }
        } catch (error) {
            console.error(`Error creating ${table}:`, error);
            throw error;
        }
    },
    
    async update(table, id, data) {
        // Use the new buildUrl function if available
        const url = typeof window.buildUrl === 'function' ? 
            window.buildUrl(table, id) : 
            `tables/${table}/${id}`;
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
            } else {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }
        } catch (error) {
            console.error(`Error updating ${table}/${id}:`, error);
            throw error;
        }
    },
    
    async patch(table, id, data) {
        // Use the new buildUrl function if available
        const url = typeof window.buildUrl === 'function' ? 
            window.buildUrl(table, id) : 
            `tables/${table}/${id}`;
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url, {
                    method: 'PATCH',
                    body: JSON.stringify(data)
                });
            } else {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            }
        } catch (error) {
            console.error(`Error patching ${table}/${id}:`, error);
            throw error;
        }
    },
    
    async delete(table, id) {
        // Use the new buildUrl function if available
        const url = typeof window.buildUrl === 'function' ? 
            window.buildUrl(table, id) : 
            `tables/${table}/${id}`;
        
        try {
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            if (typeof window.apiRequest === 'function') {
                return await window.apiRequest(url, {
                    method: 'DELETE'
                });
            } else {
                const response = await fetch(url, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return true;
            }
        } catch (error) {
            console.error(`Error deleting ${table}/${id}:`, error);
            throw error;
        }
    }
};

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${getTypeIcon(type)}"></i>
        </div>
        <div class="toast-content">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Obtenir l'icône selon le type de toast
function getTypeIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

// Loading Spinner
function showLoadingSpinner(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <tr>
                <td colspan="100%" class="text-center">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Chargement en cours...</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Afficher un message vide
function showEmptyState(elementId, message = "Aucune donnée disponible") {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <tr>
                <td colspan="100%" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox fa-3x"></i>
                        <h3>${message}</h3>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Formatter une date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Formatter une date avec heure
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

// Formatter un montant en devise
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
    }).format(amount);
}

// Formatter un pourcentage
function formatPercentage(value) {
    if (value === null || value === undefined) return '-';
    return `${value}%`;
}

// Initialiser la protection des pages
function initializePageProtection() {
    // Vérifier si la fonction existe dans auth.js
    if (typeof window.initializePageProtection === 'function') {
        window.initializePageProtection();
    }
}

// Initialiser les écouteurs d'événements communs
function initializeCommonEvents() {
    // Toggle sidebar sur mobile
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Fermer les modals avec la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Fermer les modals en cliquant en dehors
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', function() {
    initializePageProtection();
    initializeCommonEvents();
    
    // Initialiser les tooltips
    initializeTooltips();
});

// Initialiser les tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        // Créer le tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        // Afficher le tooltip au survol
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = (rect.top - 10) + 'px';
            tooltip.classList.add('show');
        });
        
        // Cacher le tooltip
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });
    });
}

// Fonction de débogage
function debug(message) {
    if (window.DEBUG_MODE) {
        console.log(`[DEBUG] ${message}`);
    }
}

// Fonction pour copier du texte dans le presse-papiers
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copié dans le presse-papiers', 'success');
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        showToast('Erreur lors de la copie', 'error');
    }
}

// Fonction pour imprimer un élément
function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Impression</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}