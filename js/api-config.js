// Configuration de l'API
window.API_CONFIG = {
    // Pour utiliser le nouveau backend, changer cette valeur à true
    USE_NEW_BACKEND: true,
    
    // Mode simulation pour le développement - à false en production
    SIMULATION_MODE: true,
    
    // URL de base pour le nouveau backend - à modifier selon l'environnement
    BACKEND_BASE_URL: process.env.BACKEND_URL || 'http://localhost:3000/api',
    
    // URL de base pour l'ancienne API intégrée
    LEGACY_BASE_URL: 'tables'
};

// Données de simulation pour le développement
window.SIMULATION_DATA = {
    users: [
        {
            id: 1,
            email: 'admin@hopegimmo.bj',
            password: 'admin123',
            role: 'admin',
            nom: 'Administrateur',
            prenom: 'Système',
            actif: true
        },
        {
            id: 2,
            email: 'gestionnaire@hopegimmo.bj',
            password: 'gest123',
            role: 'gestionnaire',
            nom: 'Kouassi',
            prenom: 'Jean',
            actif: true
        },
        {
            id: 3,
            email: 'locataire@hopegimmo.bj',
            password: 'loc123',
            role: 'locataire',
            nom: 'Adjovi',
            prenom: 'Marie',
            actif: true
        }
    ],
    biens: [
        {
            "id": 1,
            "titre": "Appartement Duplex",
            "type": "appartement",
            "adresse": "123 Rue de l'Indépendance, Cotonou",
            "ville": "Cotonou",
            "superficie": 120,
            "chambres": 3,
            "salles_bain": 2,
            "prix_location": 150000,
            "prix_achat": 25000000,
            "statut": "Disponible",
            "description": "Bel appartement duplex avec vue sur la mer",
            "equipements": [
                "Climatisation",
                "Parking",
                "Balcon"
            ],
            "proprietaire_id": 1
        },
        {
            "id": 2,
            "titre": "Villa Moderne",
            "type": "villa",
            "adresse": "456 Avenue de la Liberté, Porto-Novo",
            "ville": "Porto-Novo",
            "superficie": 250,
            "chambres": 5,
            "salles_bain": 4,
            "prix_location": 250000,
            "prix_achat": 45000000,
            "statut": "Occupé",
            "description": "Villa moderne avec jardin et piscine",
            "equipements": [
                "Piscine",
                "Jardin",
                "Garage"
            ],
            "proprietaire_id": 2
        },
        {
            "id": 3,
            "titre": "Boutique Commerciale",
            "type": "boutique",
            "adresse": "789 Boulevard Triomphal, Parakou",
            "ville": "Parakou",
            "superficie": 80,
            "chambres": 1,
            "salles_bain": 1,
            "prix_location": 100000,
            "prix_achat": 15000000,
            "statut": "En maintenance",
            "description": "Boutique idéalement située dans le centre-ville",
            "equipements": [
                "Vitrine",
                "Stockage",
                "Électricité industrielle"
            ],
            "proprietaire_id": 3
        }
    ],
    proprietaires: [
        {
            "id": 1,
            "type": "personne_physique",
            "prenom": "Jean",
            "nom": "Dupont",
            "entreprise": "",
            "telephone": "+229 97 00 00 00",
            "email": "jean.dupont@email.com",
            "adresse": "123 Rue de l'Indépendance, Cotonou",
            "ville": "Cotonou",
            "ifu": "IFU00123456789"
        },
        {
            "id": 2,
            "type": "personne_morale",
            "prenom": "",
            "nom": "",
            "entreprise": "Société Béninoise Immobilière",
            "telephone": "+229 96 00 00 00",
            "email": "contact@sbi.bj",
            "adresse": "456 Avenue de l'Indépendance, Porto-Novo",
            "ville": "Porto-Novo",
            "ifu": "IFU98765432100"
        },
        {
            "id": 3,
            "type": "personne_physique",
            "prenom": "Marie",
            "nom": "Johnson",
            "entreprise": "",
            "telephone": "+229 95 00 00 00",
            "email": "marie.johnson@email.com",
            "adresse": "789 Boulevard Triomphal, Parakou",
            "ville": "Parakou",
            "ifu": ""
        }
    ],
    locataires: [
        {
            "id": 1,
            "prenom": "Alice",
            "nom": "Martin",
            "telephone": "+229 97 11 11 11",
            "email": "alice.martin@email.com",
            "adresse": "123 Rue de la Paix, Cotonou",
            "ville": "Cotonou",
            "profession": "Comptable",
            "employeur": "Entreprise ABC",
            "cni": "CNI00123456789",
            "contact_urgence": "+229 96 11 11 11",
            "statut": "Actif"
        },
        {
            "id": 2,
            "prenom": "Bob",
            "nom": "Bernard",
            "telephone": "+229 97 22 22 22",
            "email": "bob.bernard@email.com",
            "adresse": "456 Avenue des Martyrs, Porto-Novo",
            "ville": "Porto-Novo",
            "profession": "Ingénieur",
            "employeur": "Tech Solutions",
            "cni": "CNI98765432100",
            "contact_urgence": "+229 96 22 22 22",
            "statut": "En attente"
        },
        {
            "id": 3,
            "prenom": "Claire",
            "nom": "Dubois",
            "telephone": "+229 97 33 33 33",
            "email": "claire.dubois@email.com",
            "adresse": "789 Boulevard Triomphal, Parakou",
            "ville": "Parakou",
            "profession": "Enseignante",
            "employeur": "Ministère de l'Éducation",
            "cni": "CNI45678912300",
            "contact_urgence": "+229 96 33 33 33",
            "statut": "Actif"
        }
    ],
    baux: [
        {
            "id": 1,
            "reference": "BAIL-001",
            "bien_id": 1,
            "locataire_id": 1,
            "date_debut": "2023-01-01",
            "date_fin": "2024-01-01",
            "loyer_base": 150000,
            "charges": 20000,
            "caution": 300000,
            "frais_agence": 50000,
            "type_bail": "Résidentiel",
            "statut": "Actif"
        },
        {
            "id": 2,
            "reference": "BAIL-002",
            "bien_id": 2,
            "locataire_id": 2,
            "date_debut": "2023-03-01",
            "date_fin": "2024-03-01",
            "loyer_base": 250000,
            "charges": 30000,
            "caution": 500000,
            "frais_agence": 75000,
            "type_bail": "Résidentiel",
            "statut": "Actif"
        },
        {
            "id": 3,
            "reference": "BAIL-003",
            "bien_id": 3,
            "locataire_id": 3,
            "date_debut": "2022-06-01",
            "date_fin": "2023-06-01",
            "loyer_base": 100000,
            "charges": 15000,
            "caution": 200000,
            "frais_agence": 30000,
            "type_bail": "Commercial",
            "statut": "Expiré"
        }
    ],
    paiements: [
        {
            "id": 1,
            "reference": "PAY-001",
            "bail_id": 1,
            "locataire_id": 1,
            "mois_concerne": "2023-10",
            "date_paiement": "2023-10-05",
            "montant": 170000,
            "methode_paiement": "Mobile Money",
            "operateur": "MTN",
            "numero_transaction": "TXN123456789",
            "notes": "Paiement effectué sans problème",
            "statut": "Validé"
        },
        {
            "id": 2,
            "reference": "PAY-002",
            "bail_id": 2,
            "locataire_id": 2,
            "mois_concerne": "2023-10",
            "date_paiement": "2023-10-10",
            "montant": 280000,
            "methode_paiement": "Virement",
            "operateur": "",
            "numero_transaction": "VIR987654321",
            "notes": "Virement bancaire",
            "statut": "Validé"
        },
        {
            "id": 3,
            "reference": "PAY-003",
            "bail_id": 1,
            "locataire_id": 1,
            "mois_concerne": "2023-09",
            "date_paiement": "2023-09-03",
            "montant": 170000,
            "methode_paiement": "Espèces",
            "operateur": "",
            "numero_transaction": "",
            "notes": "Paiement en espèces",
            "statut": "Validé"
        }
    ],
    tickets: [
        {
            "id": 1,
            "reference": "TKT-001",
            "titre": "Fuite d'eau dans la cuisine",
            "description": "Le robinet de la cuisine fuit depuis hier soir. L'eau continue de couler même après avoir fermé le robinet.",
            "categorie": "Plomberie",
            "priorite": "Haute",
            "statut": "En cours",
            "date_creation": "2023-10-15",
            "date_resolution": null,
            "bien_id": 1,
            "locataire_id": 1,
            "technicien_assigne": "Jean Plombier",
            "cout_reparation": 15000,
            "notes": "Pièce de rechange nécessaire"
        },
        {
            "id": 2,
            "reference": "TKT-002",
            "titre": "Problème de climatisation",
            "description": "La climatisation ne refroidit plus correctement. Bruit anormal lors de son fonctionnement.",
            "categorie": "Climatisation",
            "priorite": "Moyenne",
            "statut": "Ouvert",
            "date_creation": "2023-10-10",
            "date_resolution": null,
            "bien_id": 2,
            "locataire_id": 2,
            "technicien_assigne": "",
            "cout_reparation": 0,
            "notes": ""
        },
        {
            "id": 3,
            "reference": "TKT-003",
            "titre": "Porte d'entrée cassée",
            "description": "La poignée de la porte d'entrée est cassée et la porte ne ferme plus correctement.",
            "categorie": "Menuiserie",
            "priorite": "Faible",
            "statut": "Résolu",
            "date_creation": "2023-09-20",
            "date_resolution": "2023-09-25",
            "bien_id": 3,
            "locataire_id": 3,
            "technicien_assigne": "Pierre Menuisier",
            "cout_reparation": 8000,
            "notes": "Remplacement de la poignée effectué"
        }
    ],
    documents: [
        {
            "id": 1,
            "titre": "Contrat de bail - Appartement Duplex",
            "type_document": "Contrat",
            "bien_associe": 1,
            "date_creation": "2023-01-15",
            "description": "Contrat de bail signé pour l'appartement duplex",
            "fichier_url": "#",
            "tags": "bail, contrat, 2023"
        },
        {
            "id": 2,
            "titre": "Facture de réparation",
            "type_document": "Facture",
            "bien_associe": 2,
            "date_creation": "2023-05-20",
            "description": "Facture pour les réparations effectuées dans la villa",
            "fichier_url": "#",
            "tags": "facture, réparation, mai 2023"
        },
        {
            "id": 3,
            "titre": "Photos de l'appartement",
            "type_document": "Photo",
            "bien_associe": 1,
            "date_creation": "2022-12-10",
            "description": "Photos prises lors de la visite de l'appartement",
            "fichier_url": "#",
            "tags": "photo, appartement, visite"
        }
    ],
    notifications: [
        {
            "id": 1,
            "titre": "Nouveau paiement reçu",
            "message": "Un paiement de 170 000 FCFA a été reçu pour le bail BAIL-001.",
            "categorie": "paiement",
            "priorite": "normale",
            "statut": "unread",
            "date_creation": "2023-10-15T10:30:00",
            "action_url": "/paiements.html"
        },
        {
            "id": 2,
            "titre": "Ticket de maintenance urgent",
            "message": "Un ticket de maintenance urgent a été créé pour l'appartement Duplex.",
            "categorie": "maintenance",
            "priorite": "haute",
            "statut": "unread",
            "date_creation": "2023-10-14T14:15:00",
            "action_url": "/tickets.html"
        },
        {
            "id": 3,
            "titre": "Bail expirant bientôt",
            "message": "Le bail BAIL-003 expire dans 30 jours. Pensez à renouveler.",
            "categorie": "bail",
            "priorite": "moyenne",
            "statut": "read",
            "date_creation": "2023-10-10T09:00:00",
            "action_url": "/baux.html"
        },
        {
            "id": 4,
            "titre": "Nouveau document téléchargé",
            "message": "Un nouveau contrat a été téléchargé pour la villa moderne.",
            "categorie": "document",
            "priorite": "normale",
            "statut": "read",
            "date_creation": "2023-10-05T16:45:00",
            "action_url": "/documents.html"
        },
        {
            "id": 5,
            "titre": "Paiement en retard",
            "message": "Le paiement pour le bail BAIL-002 est en retard de 5 jours.",
            "categorie": "paiement",
            "priorite": "haute",
            "statut": "unread",
            "date_creation": "2023-10-01T08:20:00",
            "action_url": "/paiements.html"
        }
    ]
};

// Fonction pour obtenir l'URL de base appropriée
window.getBaseUrl = function() {
    // En mode simulation, on ne fait pas d'appels API
    if (window.API_CONFIG.SIMULATION_MODE) {
        console.log('Mode simulation activé - pas d\'appels API');
        return null;
    }
    
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
    // En mode simulation, on ne construit pas d'URL
    if (window.API_CONFIG.SIMULATION_MODE) {
        console.log('Mode simulation activé - URL non construite pour:', table, id, params);
        return null;
    }
    
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
    // En mode simulation, retourner des données simulées
    if (window.API_CONFIG.SIMULATION_MODE) {
        console.log('Mode simulation - requête simulée:', url, options);
        
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Extraire la table de l'URL pour la simulation
        if (url && typeof url === 'string' && url.includes('/tables/')) {
            const tableMatch = url.match(/\/tables\/([^\/\?]+)/);
            if (tableMatch && tableMatch[1]) {
                const table = tableMatch[1];
                
                // Si c'est une recherche
                if (url.includes('search=')) {
                    const searchMatch = url.match(/search=([^&]+)/);
                    if (searchMatch && searchMatch[1]) {
                        const searchTerm = decodeURIComponent(searchMatch[1]);
                        const filteredData = window.SIMULATION_DATA[table]?.filter(item => 
                            item.email === searchTerm
                        ) || [];
                        
                        return { data: filteredData };
                    }
                }
                
                // Retourner toutes les données de la table
                return { data: window.SIMULATION_DATA[table] || [] };
            }
        } else if (typeof url === 'string') {
            // Si l'URL est une chaîne simple (nom de la table), retourner les données
            return { data: window.SIMULATION_DATA[url] || [] };
        }
        
        // Par défaut, retourner des données vides
        return { data: [] };
    }
    
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
