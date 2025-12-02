# 🚀 Guide de Démarrage Rapide - Hope Gestion Immobilière

## Bienvenue !

Ce guide vous aidera à démarrer rapidement avec votre plateforme de gestion immobilière.

---

## ⚡ Démarrage en 3 étapes

### Étape 1 : Accéder à la Plateforme

1. **Ouvrez le fichier** `index.html` dans votre navigateur
2. **OU** utilisez l'onglet **Publish** pour déployer en ligne

### Étape 2 : Se Connecter

Utilisez un des comptes de démonstration :

#### 👨‍💼 Compte Administrateur
```
Email : admin@hopegimmo.bj
Mot de passe : admin123
```

#### 👔 Compte Gestionnaire
```
Email : gestionnaire@hopegimmo.bj
Mot de passe : gest123
```

#### 🏠 Compte Locataire
```
Email : locataire@hopegimmo.bj
Mot de passe : loc123
```

### Étape 3 : Explorer

- **Dashboard** : Vue d'ensemble avec statistiques
- **Biens** : Gestion de vos propriétés
- **Paiements** : Suivi des loyers en FCFA
- **Tickets** : Gestion de la maintenance

---

## 📱 Navigation

### Pour les Gestionnaires/Administrateurs

1. Connectez-vous sur `login.html`
2. Accédez au **Dashboard** principal
3. Menu latéral pour naviguer entre les modules :
   - 📊 Tableau de bord
   - 🏢 Biens immobiliers
   - 👔 Propriétaires
   - 👥 Locataires
   - 📄 Baux & Contrats
   - 💰 Paiements
   - 🎫 Tickets
   - 📁 Documents
   - 🔔 Notifications
   - ⚙️ Paramètres

### Pour les Locataires

1. Connectez-vous sur `login.html`
2. Accédez au **Portail Locataire**
3. Menu simplifié :
   - 🏠 Mon logement
   - 💳 Mes paiements
   - 🎫 Mes tickets
   - 📁 Documents
   - 👤 Mon profil

---

## 🎯 Fonctionnalités Clés

### ✅ Déjà Disponibles

- **Authentification sécurisée** avec gestion des rôles
- **Dashboard interactif** avec graphiques Chart.js
- **Gestion complète des biens** immobiliers
- **Système de paiements** en FCFA
- **Tickets de maintenance** avec workflow
- **Portail locataire** dédié
- **Design responsive** (Mobile, Tablette, Desktop)

### 🔄 En Développement

- Intégration Mobile Money (MTN, Moov)
- Génération automatique de PDF (contrats, quittances)
- Notifications Email/SMS
- Export Excel/PDF avancé

---

## 💡 Astuces Rapides

### Ajouter un Bien

1. Allez sur le Dashboard
2. Cliquez sur **"+ Ajouter un bien"**
3. Remplissez le formulaire (type, adresse, loyer en FCFA)
4. Enregistrez

### Consulter les Statistiques

1. Tableau de bord principal
2. Visualisez :
   - Total des biens
   - Revenus du mois (FCFA)
   - Impayés
   - Tickets ouverts

### Créer un Ticket (Locataire)

1. Portail Locataire
2. Cliquez sur **"Signaler un problème"**
3. Décrivez le problème
4. Suivez l'évolution

### Payer le Loyer (Locataire)

1. Portail Locataire
2. Cliquez sur **"Payer mon loyer"**
3. Choisissez Mobile Money
4. Confirmez le paiement

---

## 🗺️ Structure des Pages

```
Accueil (index.html)
    ├── Connexion (login.html)
    │   ├── Dashboard (dashboard.html) [Gestionnaires/Admin]
    │   │   ├── Biens
    │   │   ├── Propriétaires
    │   │   ├── Locataires
    │   │   ├── Baux
    │   │   ├── Paiements
    │   │   └── Tickets
    │   │
    │   └── Portail Locataire (portail-locataire.html) [Locataires]
    │       ├── Mon logement
    │       ├── Mes paiements
    │       └── Mes tickets
    │
    └── Inscription (register.html)
```

---

## 💾 Données de Démonstration

### Biens Préchargés

5 biens immobiliers sont déjà créés :
1. Appartement à Akpakpa, Cotonou - 150 000 FCFA/mois
2. Villa à Haie Vive, Cotonou - 450 000 FCFA/mois
3. Bureau à Porto-Novo - 300 000 FCFA/mois
4. Studio à Cadjehoun, Cotonou - 75 000 FCFA/mois
5. Magasin à Dantokpa, Cotonou - 200 000 FCFA/mois

### Propriétaires Préchargés

3 propriétaires sont enregistrés :
- ADJOVI Marcel (Personne physique)
- KOUDOU Immobilier SARL (Personne morale)
- SANNI Fatouma (Personne physique)

---

## 🔧 Personnalisation

### Modifier les Couleurs

Fichier : `css/style.css`

```css
:root {
    --primary: #259B24;      /* Vert principal */
    --secondary: #FFD700;     /* Or */
    --accent: #E84118;        /* Rouge accent */
}
```

### Ajouter une Ville

Fichier : `js/dashboard.js` ou directement dans la base de données

Villes actuelles :
- Cotonou
- Porto-Novo
- Parakou
- Abomey-Calavi
- Ouidah
- Bohicon
- Djougou
- Natitingou

---

## 📊 KPIs Suivis

### Métriques Principales

1. **Total Biens** : Nombre de propriétés gérées
2. **Revenus du Mois** : Somme des loyers en FCFA
3. **Impayés** : Montant des loyers en retard
4. **Tickets Ouverts** : Nombre de problèmes à résoudre

### Graphiques

- **Revenus mensuels** : Évolution sur 12 mois
- **Répartition des biens** : Par type (Appartement, Villa, etc.)

---

## 🌐 Contexte Béninois

### Monnaie
- Tous les montants en **FCFA** (Franc CFA)
- Format : `150 000 FCFA`

### Paiements
- **MTN Mobile Money** 📱
- **Moov Money** 📱
- Espèces
- Virement bancaire
- Chèque

### Conformité
- **Numéro IFU** pour propriétaires
- **CNI** pour locataires
- Contrats conformes à la législation béninoise

---

## 🆘 Besoin d'Aide ?

### Problèmes Courants

#### "Je ne peux pas me connecter"
- Vérifiez que vous utilisez les bons identifiants
- Essayez un compte de démonstration

#### "Les données ne s'affichent pas"
- Actualisez la page (F5)
- Vérifiez votre connexion Internet
- Ouvrez la console (F12) pour voir les erreurs

#### "Le design ne s'affiche pas correctement"
- Vérifiez que tous les fichiers CSS sont chargés
- Testez sur un navigateur récent (Chrome, Firefox, Edge)

### Navigateurs Supportés

- ✅ Google Chrome (recommandé)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ❌ Internet Explorer (non supporté)

---

## 🎓 Tutoriels Vidéo (À Venir)

- [ ] Comment créer un bien
- [ ] Comment ajouter un locataire
- [ ] Comment générer un contrat
- [ ] Comment suivre les paiements
- [ ] Comment gérer les tickets

---

## 📞 Support

### Contact
- **Email** : contact@hopegimmo.bj
- **Téléphone** : +229 XX XX XX XX
- **Horaires** : Lundi-Vendredi, 8h-18h

### Ressources
- Documentation complète : `README.md`
- FAQ : En développement
- Forum communautaire : Bientôt disponible

---

## 🔄 Mises à Jour

### Version Actuelle : 1.0.0 (MVP)

**Dernière mise à jour** : Décembre 2025

**Prochaines mises à jour prévues** :
- Janvier 2026 : Intégration Mobile Money
- Février 2026 : Génération PDF automatique
- Mars 2026 : Application mobile

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser Hope Gestion Immobilière !

**Conseil** : Commencez par explorer le Dashboard avec le compte Gestionnaire pour découvrir toutes les fonctionnalités.

---

**Hope Gestion Immobilière** - La PropTech au service du Bénin 🇧🇯

*Pour toute question, consultez le `README.md` ou contactez le support.*