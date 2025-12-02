const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Création de la base de données
const dbPath = path.join(__dirname, 'hope_gestion.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite :', dbPath);
    // Attendre un peu avant d'initialiser pour s'assurer que la connexion est bien établie
    setTimeout(() => {
      initializeDatabase();
    }, 1000);
  }
});

// Initialisation de la base de données
function initializeDatabase() {
  // Création de la table users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT,
    role TEXT NOT NULL,
    actif BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table users:', err.message);
    } else {
      console.log('Table users créée avec succès');
    }
  });

  // Création de la table proprietaires
  db.run(`CREATE TABLE IF NOT EXISTS proprietaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    type TEXT NOT NULL,
    ifu TEXT,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    nombre_biens INTEGER DEFAULT 0
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table proprietaires:', err.message);
    } else {
      console.log('Table proprietaires créée avec succès');
    }
  });

  // Création de la table biens
  db.run(`CREATE TABLE IF NOT EXISTS biens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE NOT NULL,
    proprietaire_id INTEGER,
    type_bien TEXT NOT NULL,
    adresse TEXT NOT NULL,
    ville TEXT NOT NULL,
    superficie REAL,
    nombre_pieces INTEGER,
    loyer_mensuel REAL,
    caution REAL,
    statut TEXT DEFAULT 'Disponible',
    equipements TEXT,
    photos TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES proprietaires (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table biens:', err.message);
    } else {
      console.log('Table biens créée avec succès');
    }
  });

  // Création de la table locataires
  db.run(`CREATE TABLE IF NOT EXISTS locataires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    date_naissance DATE,
    lieu_naissance TEXT,
    cni TEXT,
    profession TEXT,
    employeur TEXT,
    telephone TEXT,
    email TEXT,
    contact_urgence TEXT,
    statut TEXT DEFAULT 'Actif'
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table locataires:', err.message);
    } else {
      console.log('Table locataires créée avec succès');
    }
  });

  // Création de la table baux
  db.run(`CREATE TABLE IF NOT EXISTS baux (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE NOT NULL,
    bien_id INTEGER NOT NULL,
    locataire_id INTEGER NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    loyer_mensuel REAL NOT NULL,
    caution REAL,
    frais_agence REAL,
    type_bail TEXT NOT NULL,
    conditions TEXT,
    statut TEXT DEFAULT 'Actif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bien_id) REFERENCES biens (id),
    FOREIGN KEY (locataire_id) REFERENCES locataires (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table baux:', err.message);
    } else {
      console.log('Table baux créée avec succès');
    }
  });

  // Création de la table paiements
  db.run(`CREATE TABLE IF NOT EXISTS paiements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE NOT NULL,
    bail_id INTEGER NOT NULL,
    locataire_id INTEGER NOT NULL,
    montant REAL NOT NULL,
    mois_concerne TEXT NOT NULL,
    date_paiement DATE NOT NULL,
    methode_paiement TEXT NOT NULL,
    operateur_mobile TEXT,
    numero_transaction TEXT,
    type_paiement TEXT NOT NULL,
    statut TEXT DEFAULT 'Validé',
    FOREIGN KEY (bail_id) REFERENCES baux (id),
    FOREIGN KEY (locataire_id) REFERENCES locataires (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table paiements:', err.message);
    } else {
      console.log('Table paiements créée avec succès');
    }
  });

  // Création de la table tickets
  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE NOT NULL,
    bail_id INTEGER,
    bien_id INTEGER,
    locataire_id INTEGER,
    titre TEXT NOT NULL,
    description TEXT NOT NULL,
    categorie TEXT,
    priorite TEXT DEFAULT 'Moyenne',
    statut TEXT DEFAULT 'Ouvert',
    technicien_assigne TEXT,
    cout_reparation REAL,
    photos TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bail_id) REFERENCES baux (id),
    FOREIGN KEY (bien_id) REFERENCES biens (id),
    FOREIGN KEY (locataire_id) REFERENCES locataires (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table tickets:', err.message);
    } else {
      console.log('Table tickets créée avec succès');
    }
  });

  // Création de la table notifications
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateur_id INTEGER NOT NULL,
    titre TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    lu BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table notifications:', err.message);
    } else {
      console.log('Table notifications créée avec succès');
    }
  });

  // Attendre que toutes les tables soient créées avant d'insérer les données
  setTimeout(() => {
    // Insertion des données de démonstration
    insertDemoData();
  }, 2000);
}

// Insertion des données de démonstration
function insertDemoData() {
  // Insertion des utilisateurs de démonstration
  const insertUser = db.prepare(`INSERT OR IGNORE INTO users (email, password, nom, prenom, telephone, role, actif) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  
  insertUser.run('admin@hopegimmo.bj', 'admin123', 'Administrateur', 'Système', '+229 XX XX XX XX', 'admin', 1);
  insertUser.run('gestionnaire@hopegimmo.bj', 'gest123', 'Kouassi', 'Jean', '+229 XX XX XX XX', 'gestionnaire', 1);
  insertUser.run('locataire@hopegimmo.bj', 'loc123', 'Adjovi', 'Marie', '+229 XX XX XX XX', 'locataire', 1);
  
  insertUser.finalize();
  console.log('Données de démonstration insérées');
}

module.exports = db;