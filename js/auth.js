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