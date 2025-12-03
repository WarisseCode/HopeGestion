/* =============================================
   AUTHENTICATION JAVASCRIPT
   ============================================= */

// Configuration
const API_BASE = 'tables';

// Import API configuration
// Note: This will be dynamically loaded in the HTML files

// Demo accounts
const DEMO_ACCOUNTS = {
    admin: {
        email: 'admin@hopegimmo.bj',
        password: 'admin123',
        role: 'admin',
        nom: 'Administrateur',
        prenom: 'Système'
    },
    gestionnaire: {
        email: 'gestionnaire@hopegimmo.bj',
        password: 'gest123',
        role: 'gestionnaire',
        nom: 'Kouassi',
        prenom: 'Jean'
    },
    locataire: {
        email: 'locataire@hopegimmo.bj',
        password: 'loc123',
        role: 'locataire',
        nom: 'Adjovi',
        prenom: 'Marie'
    }
};

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertEl = document.getElementById('alert-message');
    if (!alertEl) return;
    
    alertEl.textContent = message;
    alertEl.className = `alert alert-${type}`;
    alertEl.style.display = 'flex';
    
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 5000);
}

// Save user session
function saveUserSession(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Check if authenticated
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
}

// Login as demo account - VERSION SIMPLIFIEE SANS APPELS RESEAU
async function loginAsDemo(role) {
    const demoAccount = DEMO_ACCOUNTS[role];
    
    if (!demoAccount) {
        showAlert('Compte de démonstration non trouvé', 'error');
        return;
    }
    
    showAlert(`Connexion en tant que ${demoAccount.nom}...`, 'info');
    
    // Simulation directe sans aucun appel réseau
    setTimeout(() => {
        // Trouver l'utilisateur dans les données de simulation
        const userData = {
            id: role === 'admin' ? 1 : role === 'gestionnaire' ? 2 : 3,
            email: demoAccount.email,
            nom: demoAccount.nom,
            prenom: demoAccount.prenom,
            role: demoAccount.role
        };
        
        // Save session
        saveUserSession(userData);
        
        showAlert('Connexion réussie ! Redirection...', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            if (demoAccount.role === 'locataire') {
                window.location.href = 'portail-locataire.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    }, 500);
}

// Login form handler - VERSION SIMPLIFIEE SANS APPELS RESEAU
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        showAlert('Connexion en cours...', 'info');
        
        // Simulation directe sans aucun appel réseau
        setTimeout(() => {
            // Vérifier si c'est un compte de démonstration
            let userData = null;
            
            if (email === 'admin@hopegimmo.bj' && password === 'admin123') {
                userData = {
                    id: 1,
                    email: 'admin@hopegimmo.bj',
                    nom: 'Administrateur',
                    prenom: 'Système',
                    role: 'admin'
                };
            } else if (email === 'gestionnaire@hopegimmo.bj' && password === 'gest123') {
                userData = {
                    id: 2,
                    email: 'gestionnaire@hopegimmo.bj',
                    nom: 'Kouassi',
                    prenom: 'Jean',
                    role: 'gestionnaire'
                };
            } else if (email === 'locataire@hopegimmo.bj' && password === 'loc123') {
                userData = {
                    id: 3,
                    email: 'locataire@hopegimmo.bj',
                    nom: 'Adjovi',
                    prenom: 'Marie',
                    role: 'locataire'
                };
            }
            
            if (userData) {
                saveUserSession(userData);
                showAlert('Connexion réussie ! Redirection...', 'success');
                
                setTimeout(() => {
                    if (userData.role === 'locataire') {
                        window.location.href = 'portail-locataire.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                showAlert('Email ou mot de passe incorrect', 'error');
            }
        }, 500);
    });
}

// Registration form handler - VERSION SIMPLIFIEE SANS APPELS RESEAU
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        showAlert('Création du compte en cours...', 'info');
        
        // Simulation directe sans aucun appel réseau
        setTimeout(() => {
            showAlert('Compte créé avec succès ! Redirection...', 'success');
            
            // Auto-login avec des données simulées
            const formData = {
                email: document.getElementById('email').value,
                nom: document.getElementById('nom').value,
                prenom: document.getElementById('prenom').value,
                role: document.getElementById('role').value
            };
            
            saveUserSession({
                id: Date.now(),
                email: formData.email,
                nom: formData.nom,
                prenom: formData.prenom,
                role: formData.role
            });
            
            setTimeout(() => {
                if (formData.role === 'locataire') {
                    window.location.href = 'portail-locataire.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1500);
        }, 500);
    });
}

// Check authentication on protected pages
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Check role permissions
function requireRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
        window.location.href = 'dashboard.html';
    }
}

// Gestion de l'authentification
let currentUsers = [];

// Charger les utilisateurs
async function loadUsers() {
    try {
        // En mode simulation, utiliser les données simulées
        if (window.API_CONFIG.SIMULATION_MODE) {
            currentUsers = window.SIMULATION_DATA.users || [];
            return currentUsers;
        }
        
        const response = await apiRequest(buildUrl('users'));
        currentUsers = response.data || response;
        return currentUsers;
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des utilisateurs', 'error');
        // En mode simulation en cas d'erreur
        currentUsers = window.SIMULATION_DATA.users || [];
        return currentUsers;
    }
}

// Fonction de connexion
async function login(email, password) {
    try {
        showLoading(true);
        
        // En mode simulation, vérifier les identifiants dans les données simulées
        if (window.API_CONFIG.SIMULATION_MODE) {
            const users = await loadUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Stocker les informations de l'utilisateur
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                
                showLoading(false);
                showToast('Connexion réussie!', 'success');
                
                // Rediriger vers le dashboard après un court délai
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
                return true;
            } else {
                showLoading(false);
                showToast('Identifiants incorrects', 'error');
                return false;
            }
        }
        
        // Requête vers l'API en mode normal
        const response = await apiRequest(buildUrl('users', null, { search: email }));
        const users = response.data || response;
        
        if (users && users.length > 0) {
            const user = users[0];
            // Vérifier le mot de passe (en production, cela devrait être fait côté serveur)
            if (user.password === password) {
                // Stocker les informations de l'utilisateur
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('isLoggedIn', 'true');
                
                showLoading(false);
                showToast('Connexion réussie!', 'success');
                
                // Rediriger vers le dashboard après un court délai
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
                
                return true;
            }
        }
        
        showLoading(false);
        showToast('Identifiants incorrects', 'error');
        return false;
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showLoading(false);
        showToast('Erreur de connexion: ' + error.message, 'error');
        return false;
    }
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return !!localStorage.getItem('currentUser');
}

// Obtenir les données de l'utilisateur connecté
function getUserData() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Déconnexion
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Vérifier le rôle de l'utilisateur
function hasRole(requiredRole) {
    const user = getUserData();
    if (!user) return false;
    
    // Admin a accès à tout
    if (user.role === 'admin') return true;
    
    // Gestionnaire a accès aux mêmes fonctionnalités qu'admin
    if (user.role === 'gestionnaire' && requiredRole !== 'admin') return true;
    
    // Locataire n'a accès qu'à ses propres fonctionnalités
    return user.role === requiredRole;
}

// Rediriger si non autorisé
function redirectToLoginIfNotAuthenticated() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Rediriger selon le rôle
function redirectBasedOnRole() {
    const user = getUserData();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    switch (user.role) {
        case 'admin':
        case 'gestionnaire':
            window.location.href = 'dashboard.html';
            break;
        case 'locataire':
            window.location.href = 'portail-locataire.html';
            break;
        default:
            window.location.href = 'login.html';
    }
}

// Initialiser la protection des pages
function initializePageProtection() {
    // Ne pas protéger les pages publiques
    const publicPages = ['index.html', 'login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (publicPages.includes(currentPage)) {
        // Si l'utilisateur est déjà connecté, le rediriger
        if (isAuthenticated() && currentPage === 'login.html') {
            redirectBasedOnRole();
        }
        return;
    }
    
    // Protéger les pages privées
    if (!redirectToLoginIfNotAuthenticated()) {
        return;
    }
    
    // Vérifier les permissions spécifiques à la page
    const user = getUserData();
    const pagePermissions = {
        'dashboard.html': ['admin', 'gestionnaire'],
        'portail-locataire.html': ['locataire'],
        'biens.html': ['admin', 'gestionnaire'],
        'proprietaires.html': ['admin', 'gestionnaire'],
        'locataires.html': ['admin', 'gestionnaire'],
        'baux.html': ['admin', 'gestionnaire'],
        'paiements.html': ['admin', 'gestionnaire'],
        'tickets.html': ['admin', 'gestionnaire'],
        'documents.html': ['admin', 'gestionnaire'],
        'notifications.html': ['admin', 'gestionnaire'],
        'parametres.html': ['admin']
    };
    
    const requiredRoles = pagePermissions[currentPage];
    if (requiredRoles && !requiredRoles.some(role => hasRole(role))) {
        // Rediriger vers la page appropriée selon le rôle
        redirectBasedOnRole();
    }
}