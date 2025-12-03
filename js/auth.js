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

// Login as demo account
async function loginAsDemo(role) {
    const demoAccount = DEMO_ACCOUNTS[role];
    
    if (!demoAccount) {
        showAlert('Compte de démonstration non trouvé', 'error');
        return;
    }
    
    showAlert(`Connexion en tant que ${demoAccount.nom}...`, 'info');
    
    // Simulate async operation
    setTimeout(async () => {
        try {
            // Check if demo user exists in database
            const url = window.buildUrl ? 
                window.buildUrl('users', null, {search: demoAccount.email}) : 
                `${API_BASE}/users?search=${demoAccount.email}`;
            
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            const data = window.apiRequest ? 
                await window.apiRequest(url) : 
                await fetch(url).then(res => res.json());
            
            let userId;
            
            if (data.data && data.data.length > 0) {
                // User exists
                userId = data.data[0].id;
            } else {
                // Create demo user
                const createUserUrl = window.buildUrl ? 
                    window.buildUrl('users') : 
                    `${API_BASE}/users`;
                
                // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
                const createdUser = window.apiRequest ? 
                    await window.apiRequest(createUserUrl, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: demoAccount.email,
                            password: btoa(demoAccount.password), // Simple encoding
                            nom: demoAccount.nom,
                            prenom: demoAccount.prenom,
                            telephone: '+229 XX XX XX XX',
                            role: demoAccount.role,
                            actif: true
                        })
                    }) : 
                    await fetch(createUserUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: demoAccount.email,
                            password: btoa(demoAccount.password), // Simple encoding
                            nom: demoAccount.nom,
                            prenom: demoAccount.prenom,
                            telephone: '+229 XX XX XX XX',
                            role: demoAccount.role,
                            actif: true
                        })
                    }).then(res => res.json());
                
                userId = createdUser.id || createdUser.insertId; // Handle both API formats
            }
            
            // Save session
            saveUserSession({
                id: userId,
                email: demoAccount.email,
                nom: demoAccount.nom,
                prenom: demoAccount.prenom,
                role: demoAccount.role
            });
            
            showAlert('Connexion réussie ! Redirection...', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (demoAccount.role === 'locataire') {
                    window.location.href = 'portail-locataire.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            showAlert(error.message || 'Erreur lors de la connexion. Veuillez réessayer.', 'error');
        }
    }, 500);
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        showAlert('Connexion en cours...', 'info');
        
        try {
            // Search for user by email
            const url = window.buildUrl ? 
                window.buildUrl('users', null, {search: email}) : 
                `${API_BASE}/users?search=${email}`;
            
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            const data = window.apiRequest ? 
                await window.apiRequest(url) : 
                await fetch(url).then(res => res.json());
            
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                
                // Simple password check (in production, use proper hashing)
                const storedPassword = atob(user.password);
                
                if (storedPassword === password) {
                    if (user.actif) {
                        saveUserSession({
                            id: user.id,
                            email: user.email,
                            nom: user.nom,
                            prenom: user.prenom,
                            role: user.role
                        });
                        
                        showAlert('Connexion réussie ! Redirection...', 'success');
                        
                        setTimeout(() => {
                            if (user.role === 'locataire') {
                                window.location.href = 'portail-locataire.html';
                            } else {
                                window.location.href = 'dashboard.html';
                            }
                        }, 1000);
                    } else {
                        showAlert('Votre compte a été désactivé. Contactez l\'administrateur.', 'error');
                    }
                } else {
                    showAlert('Email ou mot de passe incorrect', 'error');
                }
            } else {
                showAlert('Email ou mot de passe incorrect', 'error');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            showAlert(error.message || 'Erreur lors de la connexion. Veuillez réessayer.', 'error');
        }
    });
}

// Registration form handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            password: btoa(document.getElementById('password').value), // Simple encoding
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            telephone: document.getElementById('telephone').value,
            role: document.getElementById('role').value,
            actif: true
        };
        
        // Validate password confirmation
        const confirmPassword = document.getElementById('confirm-password').value;
        if (atob(formData.password) !== confirmPassword) {
            showAlert('Les mots de passe ne correspondent pas', 'error');
            return;
        }
        
        showAlert('Création du compte en cours...', 'info');
        
        try {
            // Check if email already exists
            const checkUrl = window.buildUrl ? 
                window.buildUrl('users', null, {search: formData.email}) : 
                `${API_BASE}/users?search=${formData.email}`;
            
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            const checkData = window.apiRequest ? 
                await window.apiRequest(checkUrl) : 
                await fetch(checkUrl).then(res => res.json());
            
            if (checkData.data && checkData.data.length > 0) {
                showAlert('Cet email est déjà utilisé', 'error');
                return;
            }
            
            // Create new user
            const createUserUrl = window.buildUrl ? 
                window.buildUrl('users') : 
                `${API_BASE}/users`;
            
            // Utiliser la nouvelle fonction apiRequest pour une meilleure gestion des erreurs
            const response = window.apiRequest ? 
                await window.apiRequest(createUserUrl, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                }) : 
                await fetch(createUserUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            
            if (response.ok || response.id) {
                const user = response.ok ? await response.json() : response;
                
                showAlert('Compte créé avec succès ! Redirection...', 'success');
                
                // Auto-login
                saveUserSession({
                    id: user.id || user.insertId, // Handle both API formats
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
            } else {
                throw new Error('Erreur lors de la création du compte');
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            showAlert(error.message || 'Erreur lors de la création du compte. Veuillez réessayer.', 'error');
        }
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