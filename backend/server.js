const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database/db');

const app = express();
// Utiliser le port fourni par Render ou 3000 par défaut
const PORT = process.env.PORT || 3000;

// Middleware CORS amélioré pour autoriser toutes les origines
app.use(cors({
  origin: true, // Autorise toutes les origines
  credentials: true // Autorise les cookies/credentials si nécessaire
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Hope Gestion Immobilière', 
    version: '1.0.0',
    status: 'running'
  });
});

// Route pour obtenir toutes les tables
app.get('/api/tables', (req, res) => {
  const tables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  res.json({ tables });
});

// Route générique pour obtenir tous les éléments d'une table
app.get('/api/tables/:table', (req, res) => {
  const table = req.params.table;
  const validTables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Table invalide' });
  }
  
  // Gestion de la pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  // Requête de base
  let sql = `SELECT * FROM ${table}`;
  
  // Ajout de la recherche si présente
  if (req.query.search) {
    // Pour simplifier, on cherche dans tous les champs textuels
    sql += ` WHERE `;
    // On va chercher les colonnes de la table pour construire la requête de recherche
    db.all(`PRAGMA table_info(${table})`, (err, columns) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Filtrer les colonnes textuelles pour la recherche
      const textColumns = columns
        .filter(col => col.type.includes('TEXT') || col.type.includes('VARCHAR'))
        .map(col => col.name);
      
      if (textColumns.length > 0) {
        const searchConditions = textColumns
          .map(col => `${col} LIKE '%${req.query.search}%'`)
          .join(' OR ');
        sql += `(${searchConditions}) `;
      }
      
      sql += `LIMIT ${limit} OFFSET ${offset}`;
      
      db.all(sql, [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ data: rows, page, limit, table });
        }
      });
    });
  } else {
    sql += ` LIMIT ${limit} OFFSET ${offset}`;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ data: rows, page, limit, table });
      }
    });
  }
});

// Route pour obtenir un élément spécifique par ID
app.get('/api/tables/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const validTables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Table invalide' });
  }
  
  const sql = `SELECT * FROM ${table} WHERE id = ?`;
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Élément non trouvé' });
    } else {
      res.json({ data: row });
    }
  });
});

// Route pour créer un nouvel élément
app.post('/api/tables/:table', (req, res) => {
  const table = req.params.table;
  const validTables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Table invalide' });
  }
  
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, ...data });
    }
  });
});

// Route pour mettre à jour un élément
app.put('/api/tables/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const validTables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Table invalide' });
  }
  
  const data = req.body;
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  
  db.run(sql, [...values, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Élément non trouvé' });
    } else {
      res.json({ message: 'Élément mis à jour avec succès' });
    }
  });
});

// Route pour supprimer un élément
app.delete('/api/tables/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const validTables = [
    'users', 'proprietaires', 'biens', 'locataires', 
    'baux', 'paiements', 'tickets', 'notifications'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Table invalide' });
  }
  
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Élément non trouvé' });
    } else {
      res.json({ message: 'Élément supprimé avec succès' });
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`API disponible à l'adresse http://localhost:${PORT}`);
});

module.exports = app;