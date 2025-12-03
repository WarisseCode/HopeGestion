/* =============================================
   API CONFIGURATION
   ============================================= */

// Configuration de l'API
const API_CONFIG = {
    // Pour utiliser le nouveau backend, changer cette valeur à true
    USE_NEW_BACKEND: true,
    
    // URL de base pour le nouveau backend - à modifier selon l'environnement
    BACKEND_BASE_URL: process.env.BACKEND_URL || 'http://localhost:3000/api',
    
    // URL de base pour l'ancienne API intégrée
    LEGACY_BASE_URL: 'tables'
};

// Fonction pour obtenir l'URL de base appropriée
function getBaseUrl() {
    // En production sur Render, on utilise toujours le nouveau backend
    if (typeof window !== 'undefined' && window.location && window.location.hostname.includes('onrender.com')) {
        // L'URL du backend sur Render sera hope-gestion-backend.onrender.com
        const backendUrl = window.location.hostname.replace('hope-gestion-frontend', 'hope-gestion-backend');
        return `https://${backendUrl}/api`;
    }
    
    return API_CONFIG.USE_NEW_BACKEND ? API_CONFIG.BACKEND_BASE_URL : API_CONFIG.LEGACY_BASE_URL;
}

// Fonction pour construire l'URL complète
function buildUrl(table, id = null, params = {}) {
    const baseUrl = getBaseUrl();
    let url = API_CONFIG.USE_NEW_BACKEND ? 
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
    
    return url;
}

// Fonction utilitaire pour effectuer des requêtes avec gestion d'erreurs améliorée
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Retourner le JSON si possible, sinon le texte
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        // Gestion spécifique des erreurs réseau
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
        }
        throw error;
    }
}

// Exporter la configuration
window.API_CONFIG = API_CONFIG;
window.getBaseUrl = getBaseUrl;
window.buildUrl = buildUrl;
window.apiRequest = apiRequest;