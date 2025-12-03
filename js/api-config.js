/* =============================================
   API CONFIGURATION
   ============================================= */

// Configuration de l'API
window.API_CONFIG = {
    // Pour utiliser le nouveau backend, changer cette valeur à true
    USE_NEW_BACKEND: true,
    
    // URL de base pour le nouveau backend - à modifier selon l'environnement
    BACKEND_BASE_URL: process.env.BACKEND_URL || 'http://localhost:3000/api',
    
    // URL de base pour l'ancienne API intégrée
    LEGACY_BASE_URL: 'tables'
};

// Fonction pour obtenir l'URL de base appropriée
window.getBaseUrl = function() {
    // En production sur Render, on utilise toujours le nouveau backend
    if (typeof window !== 'undefined' && window.location && window.location.hostname.includes('onrender.com')) {
        // L'URL du backend sur Render sera hopegestion-backend.onrender.com
        // Note: le frontend est hopegestion.onrender.com et le backend hopegestion-backend.onrender.com
        const backendUrl = window.location.hostname.replace('hopegestion', 'hopegestion-backend');
        console.log('Environnement Render détecté, URL du backend:', `https://${backendUrl}/api`);
        return `https://${backendUrl}/api`;
    }
    
    console.log('Environnement local détecté, URL du backend:', window.API_CONFIG.USE_NEW_BACKEND ? window.API_CONFIG.BACKEND_BASE_URL : window.API_CONFIG.LEGACY_BASE_URL);
    return window.API_CONFIG.USE_NEW_BACKEND ? window.API_CONFIG.BACKEND_BASE_URL : window.API_CONFIG.LEGACY_BASE_URL;
};

// Fonction pour construire l'URL complète
window.buildUrl = function(table, id = null, params = {}) {
    const baseUrl = window.getBaseUrl();
    let url = window.API_CONFIG.USE_NEW_BACKEND ? 
        `${baseUrl}/tables/${table}` : 
        `${baseUrl}/${table}`;
    
    if (id) {
        url += `/${id}`;
    }
    
    // Ajouter les paramètres de requête
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
        url += `?${queryString}`;
    }
    
    console.log('URL construite:', url);
    return url;
};

// Fonction utilitaire pour effectuer des requêtes avec gestion d'erreurs améliorée
window.apiRequest = async function(url, options = {}) {
    console.log('Effectuant une requête vers:', url);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        console.log('Réponse reçue:', response.status, response.statusText);
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            // Si c'est une erreur 404, c'est probablement une URL incorrecte
            if (response.status === 404) {
                throw new Error(`Endpoint non trouvé: ${url}. Veuillez vérifier l'URL de l'API.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Vérifier le type de contenu
        const contentType = response.headers.get('content-type');
        console.log('Type de contenu:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else if (contentType && contentType.includes('text/html')) {
            // Si on reçoit du HTML au lieu de JSON, c'est une erreur
            const text = await response.text();
            console.log('Contenu HTML reçu:', text.substring(0, 200));
            throw new Error(`Réponse inattendue du serveur. Type de contenu: ${contentType}. Contenu: ${text.substring(0, 200)}...`);
        } else {
            // Pour les autres types de contenu
            return await response.text();
        }
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        // Gestion spécifique des erreurs réseau
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
        }
        throw error;
    }
};