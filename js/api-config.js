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

// Exporter la configuration
window.API_CONFIG = API_CONFIG;
window.getBaseUrl = getBaseUrl;
window.buildUrl = buildUrl;