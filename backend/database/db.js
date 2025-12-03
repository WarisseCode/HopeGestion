const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Créer/ouvrir la base de données
const db = new sqlite3.Database(path.join(__dirname, 'hope-gestion.db'), (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion à la base de données SQLite réussie');
        initializeDatabase();
    }
});

// Initialiser la base de données avec les tables et données de démonstration
function initializeDatabase() {
    // Créer les tables
    db.serialize(() => {
        // Table users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            telephone TEXT,
            role TEXT NOT NULL,
            actif BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table proprietaires
        db.run(`CREATE TABLE IF NOT EXISTS proprietaires (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL, -- 'personne_physique' ou 'personne_morale'
            nom TEXT NOT NULL,
            prenom TEXT,
            entreprise TEXT,
            telephone TEXT,
            email TEXT,
            adresse TEXT,
            ville TEXT,
            ifu TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table biens
        db.run(`CREATE TABLE IF NOT EXISTS biens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT UNIQUE,
            type_bien TEXT NOT NULL,
            adresse TEXT NOT NULL,
            ville TEXT NOT NULL,
            superficie REAL,
            nombre_pieces INTEGER,
            loyer_mensuel REAL NOT NULL,
            charges_mensuelles REAL DEFAULT 0,
            statut TEXT NOT NULL, -- 'Disponible', 'Occupé', 'En maintenance'
            description TEXT,
            equipements TEXT, -- JSON string
            proprietaire_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table locataires
        db.run(`CREATE TABLE IF NOT EXISTS locataires (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            telephone TEXT,
            email TEXT,
            adresse TEXT,
            ville TEXT,
            profession TEXT,
            employeur TEXT,
            cni TEXT,
            contact_urgence TEXT,
            statut TEXT NOT NULL, -- 'Actif', 'Inactif', 'En attente'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table baux
        db.run(`CREATE TABLE IF NOT EXISTS baux (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT UNIQUE,
            bien_id INTEGER NOT NULL,
            locataire_id INTEGER NOT NULL,
            date_debut DATE NOT NULL,
            date_fin DATE NOT NULL,
            loyer_base REAL NOT NULL,
            charges REAL DEFAULT 0,
            caution REAL,
            frais_agence REAL,
            type_bail TEXT, -- 'Résidentiel', 'Commercial', 'Professionnel'
            conditions_speciales TEXT,
            statut TEXT NOT NULL, -- 'Actif', 'Expiré', 'Résilié'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table paiements
        db.run(`CREATE TABLE IF NOT EXISTS paiements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT UNIQUE,
            bail_id INTEGER NOT NULL,
            locataire_id INTEGER NOT NULL,
            mois_concerne TEXT NOT NULL, -- Format: 'YYYY-MM'
            date_paiement DATE NOT NULL,
            montant REAL NOT NULL,
            methode_paiement TEXT, -- 'Mobile Money', 'Espèces', 'Virement', 'Chèque'
            operateur TEXT, -- 'MTN', 'Moov'
            numero_transaction TEXT,
            statut TEXT NOT NULL, -- 'En attente', 'Validé', 'Rejeté', 'Remboursé'
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table tickets
        db.run(`CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT UNIQUE,
            bien_id INTEGER NOT NULL,
            locataire_id INTEGER,
            titre TEXT NOT NULL,
            description TEXT NOT NULL,
            categorie TEXT, -- 'Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Climatisation'
            priorite TEXT NOT NULL, -- 'Faible', 'Moyenne', 'Haute', 'Urgente'
            statut TEXT NOT NULL, -- 'Ouvert', 'En cours', 'Résolu', 'Fermé'
            date_creation DATE NOT NULL,
            date_resolution DATE,
            technicien_assigne TEXT,
            cout_reparation REAL,
            photos TEXT, -- JSON string with photo URLs
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Table notifications
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            destinataire_id INTEGER NOT NULL,
            type TEXT NOT NULL, -- 'paiement', 'ticket', 'bail', 'systeme'
            titre TEXT NOT NULL,
            message TEXT NOT NULL,
            lien TEXT,
            statut TEXT NOT NULL, -- 'lu', 'non_lu'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Insérer les données de démonstration
        insertDemoData();
    });
}

// Insérer les données de démonstration
function insertDemoData() {
    // Vérifier si les données existent déjà
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification des données:', err.message);
            return;
        }
        
        // Si la base est vide, insérer les données de démonstration
        if (row.count === 0) {
            console.log('Insertion des données de démonstration...');
            
            // Insérer les utilisateurs de démonstration
            const users = [
                {
                    email: 'admin@hopegimmo.bj',
                    password: 'YWRtaW4xMjM=', // 'admin123' encodé en base64
                    nom: 'Administrateur',
                    prenom: 'Système',
                    telephone: '+229 XX XX XX XX',
                    role: 'admin',
                    actif: 1
                },
                {
                    email: 'gestionnaire@hopegimmo.bj',
                    password: 'Z2VzdDEyMw==', // 'gest123' encodé en base64
                    nom: 'Kouassi',
                    prenom: 'Jean',
                    telephone: '+229 XX XX XX XX',
                    role: 'gestionnaire',
                    actif: 1
                },
                {
                    email: 'locataire@hopegimmo.bj',
                    password: 'bG9jMTIz', // 'loc123' encodé en base64
                    nom: 'Adjovi',
                    prenom: 'Marie',
                    telephone: '+229 XX XX XX XX',
                    role: 'locataire',
                    actif: 1
                }
            ];
            
            const userStmt = db.prepare("INSERT INTO users (email, password, nom, prenom, telephone, role, actif) VALUES (?, ?, ?, ?, ?, ?, ?)");
            users.forEach(user => {
                userStmt.run([user.email, user.password, user.nom, user.prenom, user.telephone, user.role, user.actif]);
            });
            userStmt.finalize();
            
            // Insérer des biens de démonstration
            const biens = [
                {
                    reference: 'BIEN-1001',
                    type_bien: 'Appartement',
                    adresse: 'Rue 123, Akpakpa',
                    ville: 'Cotonou',
                    superficie: 85,
                    nombre_pieces: 3,
                    loyer_mensuel: 150000,
                    statut: 'Occupé',
                    description: 'Bel appartement avec vue sur l\'océan'
                },
                {
                    reference: 'BIEN-1002',
                    type_bien: 'Villa',
                    adresse: 'Avenue des Roses, Quartier Latin',
                    ville: 'Cotonou',
                    superficie: 250,
                    nombre_pieces: 5,
                    loyer_mensuel: 450000,
                    statut: 'Disponible',
                    description: 'Villa spacieuse avec jardin et piscine'
                },
                {
                    reference: 'BIEN-1003',
                    type_bien: 'Bureau',
                    adresse: 'Immeuble ABC, 3ème étage',
                    ville: 'Porto-Novo',
                    superficie: 120,
                    nombre_pieces: 2,
                    loyer_mensuel: 200000,
                    statut: 'En maintenance',
                    description: 'Bureau moderne avec climatisation'
                }
            ];
            
            const bienStmt = db.prepare("INSERT INTO biens (reference, type_bien, adresse, ville, superficie, nombre_pieces, loyer_mensuel, statut, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            biens.forEach(bien => {
                bienStmt.run([bien.reference, bien.type_bien, bien.adresse, bien.ville, bien.superficie, bien.nombre_pieces, bien.loyer_mensuel, bien.statut, bien.description]);
            });
            bienStmt.finalize();
            
            console.log('Données de démonstration insérées avec succès');
        } else {
            console.log('Base de données déjà initialisée avec des données');
        }
    });
}

module.exports = db;