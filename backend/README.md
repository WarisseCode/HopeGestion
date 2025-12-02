# Backend Hope Gestion Immobilière

## 🏗️ Architecture Backend

Ce backend fournit une API REST complète pour l'application Hope Gestion Immobilière avec une base de données SQLite.

## 📁 Structure du Projet

```
backend/
├── server.js              # Point d'entrée du serveur
├── database/
│   ├── db.js              # Configuration de la base de données
├── routes/
│   ├── users.js           # Routes pour les utilisateurs
│   ├── biens.js           # Routes pour les biens
│   ├── proprietaires.js   # Routes pour les propriétaires
│   ├── locataires.js      # Routes pour les locataires
│   ├── baux.js            # Routes pour les baux
│   ├── paiements.js       # Routes pour les paiements
│   ├── tickets.js         # Routes pour les tickets
│   └── notifications.js   # Routes pour les notifications
└── controllers/
    ├── usersController.js # Logique métier pour les utilisateurs
    └── ...                # Autres contrôleurs
```

## 🚀 Installation et Démarrage

1. **Installer les dépendances** :
   ```bash
   cd backend
   npm install
   ```

2. **Démarrer le serveur** :
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

3. **Le serveur sera accessible sur** : `http://localhost:3000`

## 🛠️ Technologies Utilisées

- **Node.js** : Environnement d'exécution JavaScript
- **Express.js** : Framework web pour Node.js
- **SQLite** : Base de données légère et embarquée
- **Cors** : Gestion des requêtes cross-origin
- **Body-parser** : Parsing des corps de requêtes

## 📊 Base de Données

Le backend utilise SQLite comme base de données, ce qui permet :
- Un stockage local des données
- Pas de configuration serveur de base de données requise
- Persistance des données entre les redémarrages

### Tables créées :
1. `users` - Utilisateurs de la plateforme
2. `proprietaires` - Propriétaires immobiliers
3. `biens` - Biens immobiliers
4. `locataires` - Locataires
5. `baux` - Contrats de location
6. `paiements` - Transactions
7. `tickets` - Système de maintenance
8. `notifications` - Notifications

## 🔌 API Endpoints

### Endpoints génériques :
- `GET /api/tables` - Liste des tables disponibles
- `GET /api/tables/{table}` - Liste des éléments d'une table
- `GET /api/tables/{table}/{id}` - Détails d'un élément
- `POST /api/tables/{table}` - Création d'un élément
- `PUT /api/tables/{table}/{id}` - Mise à jour d'un élément
- `DELETE /api/tables/{table}/{id}` - Suppression d'un élément

### Paramètres de requête :
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10)
- `search` - Terme de recherche dans les champs textuels

## 🔐 Comptes de Démonstration

Lors du premier démarrage, les comptes suivants sont créés automatiquement :

1. **Administrateur** :
   - Email : `admin@hopegimmo.bj`
   - Mot de passe : `admin123`

2. **Gestionnaire** :
   - Email : `gestionnaire@hopegimmo.bj`
   - Mot de passe : `gest123`

3. **Locataire** :
   - Email : `locataire@hopegimmo.bj`
   - Mot de passe : `loc123`

## 🔄 Intégration avec le Frontend

Pour connecter le frontend existant à ce backend :

1. Modifiez les appels API dans les fichiers JavaScript du frontend
2. Remplacez les anciennes URLs par `http://localhost:3000/api/tables/{table}`
3. Assurez-vous que le serveur backend est démarré

## 📈 Performance et Scalabilité

- Le backend peut gérer plusieurs requêtes simultanées
- La pagination limite la charge sur la base de données
- Les recherches sont optimisées pour les champs textuels

## 🛡️ Sécurité

- CORS activé pour autoriser les requêtes du frontend
- Validation des paramètres d'entrée
- Gestion des erreurs appropriée

## 📞 Support

Pour toute question concernant le backend, consultez ce README ou contactez l'équipe de développement.