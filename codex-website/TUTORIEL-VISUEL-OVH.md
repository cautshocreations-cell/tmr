# 🎥 TUTORIEL VIDÉO : Héberger sur OVH (Script détaillé)

*Voici exactement ce que vous verrez à l'écran et ce qu'il faut faire*

---

## 🛒 PARTIE 1 : COMMANDER L'HÉBERGEMENT (10 minutes)

### Écran 1 : Page d'accueil OVH
```
1. Ouvrir navigateur → Aller sur ovh.com/fr
2. Cliquer sur "Hébergement Web" dans le menu
3. Vous voyez 4 offres : Kimsufi, Perso, Pro, Performance

🎯 CHOISIR : "Pro" (environ 10€/mois)
Pourquoi ? Car il inclut Node.js + PostgreSQL
```

### Écran 2 : Configuration domaine
```
Option A - J'ai déjà un domaine :
- Cliquer "J'utilise mon domaine"
- Saisir : mondomaine.fr

Option B - Je veux un nouveau domaine :
- Laisser "Réserver un nouveau domaine"
- Taper : codex-rp.fr (ou autre nom)
- Vérifier disponibilité
```

### Écran 3 : Options supplémentaires
```
✅ COCHER OBLIGATOIREMENT :
- SSL Let's Encrypt (GRATUIT) ← Important !
- Base de données PostgreSQL ← Important !
- CDN ← Optionnel
- Sauvegarde ← Recommandé

❌ NE PAS COCHER :
- Office 365 (inutile)
- Autres services payants
```

### Écran 4 : Récapitulatif
```
Vérifier :
- Hébergement Pro ✓
- Domaine ✓  
- SSL ✓
- PostgreSQL ✓
- Prix total : environ 15-25€

CLIQUER : "Commander"
```

### Écran 5 : Création compte
```
Si nouveau client :
- Email : votre@email.com
- Mot de passe : MotDePasseComplexe123!
- ⚠️ NOTER ces identifiants !

Si déjà client :
- Se connecter normalement
```

### Écran 6 : Paiement
```
- Choisir mode de paiement
- Valider
- ✅ Commande terminée !

📧 Vous recevrez 2-3 emails dans l'heure
```

---

## 📧 PARTIE 2 : APRÈS LA COMMANDE (2 heures d'attente)

### Email 1 : "Votre hébergement est prêt"
```
Contient :
- Serveur FTP : ftp.votre-domaine.fr
- Login FTP : votre-login
- Mot de passe FTP : abc123def
- 📝 NOTER ces infos !
```

### Email 2 : "Accès espace client"
```
Contient :
- Lien : ovh.com/manager
- Identifiant : ab12345-ovh
- 📝 NOTER aussi !
```

---

## 🖥️ PARTIE 3 : ESPACE CLIENT OVH (15 minutes)

### Écran 1 : Connexion
```
1. Aller sur : ovh.com/manager
2. Saisir identifiant client (ex: ab12345-ovh)
3. Saisir mot de passe
4. CLIQUER : "Se connecter"
```

### Écran 2 : Tableau de bord
```
Vous voyez :
├── Hébergements Web (1)
├── Noms de domaine (1)
├── Emails (0)
└── Bases de données (0)

🎯 CLIQUER : "Hébergements Web"
```

### Écran 3 : Votre hébergement
```
Vous voyez :
- votre-domaine.fr
- Status : Actif ✅
- Type : Pro

🎯 CLIQUER : sur votre domaine
```

### Écran 4 : Gestion hébergement
```
Onglets visibles :
- Informations générales
- Multisite ← Important !
- Bases de données ← Important !
- FTP-SSH
- Emails

🎯 COMMENCER PAR : "Bases de données"
```

---

## 🐘 PARTIE 4 : CRÉER LA BASE POSTGRESQL (10 minutes)

### Écran 1 : Liste bases de données
```
Actuellement vide ou avec base MySQL

🎯 CLIQUER : "Créer une base de données"
```

### Écran 2 : Choix du type
```
Types disponibles :
- MySQL ❌
- PostgreSQL ✅ ← Choisir ça !

Version : Laisser la plus récente
🎯 CLIQUER : "Suivant"
```

### Écran 3 : Configuration base
```
Nom de la base : codex_rp
Nom d'utilisateur : codex_user
Mot de passe : MotDePasseSecurise123!

⚠️ NOTER PRÉCIEUSEMENT :
Serveur : postgresql-db123.ovh.net
Port : 5432
Base : codex_rp
User : codex_user
Pass : MotDePasseSecurise123!

🎯 CLIQUER : "Valider"
```

### Écran 4 : Confirmation
```
✅ "Base de données créée"
Temps d'activation : 5-10 minutes

📝 Pendant ce temps, préparer les fichiers...
```

---

## ⚙️ PARTIE 5 : ACTIVER NODE.JS (5 minutes)

### Écran 1 : Onglet Multisite
```
Vous voyez votre domaine :
votre-domaine.fr - Dossier: www - Runtime: PHP

🎯 CLIQUER : Icône "⚙️" (roue dentée)
```

### Écran 2 : Modification multisite
```
Formulaire ouvert :
- Domaine : votre-domaine.fr ✓
- Dossier racine : www ✓
- Runtime : PHP ← À CHANGER !

🎯 CHANGER : Runtime → Node.js
```

### Écran 3 : Configuration Node.js
```
Nouveaux champs apparus :
- Version Node.js : 18 ← Laisser
- Point d'entrée : index.js ← CHANGER !

🎯 ÉCRIRE : src/server/app.js

Variables d'environnement :
NODE_ENV=production
PORT=3000
(les autres on les ajoutera après)

🎯 CLIQUER : "Suivant" puis "Valider"
```

---

## 📁 PARTIE 6 : PRÉPARER LES FICHIERS (10 minutes)

### Sur votre PC :

### Étape 1 : Modifier .env
```
1. Aller dans votre dossier projet
2. COPIER : .env.example
3. RENOMMER : en .env
4. OUVRIR : avec Notepad++

REMPLACER :
DB_HOST=localhost
PAR :
DB_HOST=postgresql-db123.ovh.net

DB_NAME=codex_rp
DB_USER=codex_user  
DB_PASSWORD=MotDePasseSecurise123!

NODE_ENV=production
BASE_URL=https://votre-domaine.fr
```

### Étape 2 : Créer archive
```
SÉLECTIONNER tous les fichiers SAUF :
❌ node_modules/ (trop lourd)
❌ .git/ (inutile)
❌ *.log (logs locaux)

✅ Tout le reste !

CLIC DROIT → "Ajouter à l'archive"
NOM : codex-rp.zip
```

---

## 🚀 PARTIE 7 : UPLOAD FTP (15 minutes)

### Télécharger FileZilla
```
1. Aller sur : filezilla-project.org
2. Télécharger "FileZilla Client"
3. Installer normalement
```

### Connexion FTP
```
Dans FileZilla :
Hôte : ftp.votre-domaine.fr
Identifiant : votre-login-ftp
Mot de passe : votre-mdp-ftp
Port : 21

🎯 CLIQUER : "Connexion rapide"
```

### Upload des fichiers
```
CÔTÉ GAUCHE (votre PC) :
- Naviguer vers votre dossier projet

CÔTÉ DROIT (serveur OVH) :
- Naviguer vers /www/

🎯 SÉLECTIONNER tous vos fichiers
🎯 GLISSER-DÉPOSER vers la droite

⏱️ Attendre 10-20 minutes...
```

---

## 🔧 PARTIE 8 : CONFIGURATION FINALE (10 minutes)

### Accès SSH (si disponible)
```
Dans l'espace OVH :
Hébergements → FTP-SSH → SSH

Si SSH actif :
1. Terminal/PowerShell sur votre PC
2. Taper : ssh votre-login@ssh.cluster0XX.ovh.net
3. Mot de passe : votre-mdp-ssh
```

### Installation dépendances
```
cd www/
npm install --production
npm run setup-db
```

### Si pas de SSH
```
Retourner dans espace OVH :
Bases de données → phpPgAdmin
Importer manuellement les fichiers SQL
```

---

## ✅ PARTIE 9 : TEST FINAL (5 minutes)

### Premier test
```
1. Ouvrir navigateur
2. Aller sur : https://votre-domaine.fr
3. Attendre 30 secondes (première fois)

✅ VOUS DEVRIEZ VOIR : 
Page d'accueil Codex RP avec logo !
```

### Test interface admin
```
1. CLIQUER : "Interface Admin"
2. Login : admin
3. Password : admin123
4. ✅ DOIT MARCHER !

5. Tester : "Gérer les Types de Règlements"
6. Créer un nouveau type
7. ✅ DOIT SAUVEGARDER !
```

---

## 🔒 PARTIE 10 : SÉCURITÉ (5 minutes)

### Changer mot de passe admin
```
Interface admin → Paramètres
Nouveau mot de passe : MotDePasseComplexe456!
```

### Forcer HTTPS
```
Espace OVH → SSL/TLS
Activer "Redirection automatique HTTPS"
```

---

## 🎉 FÉLICITATIONS !

**Votre site est maintenant en ligne et sécurisé !**

### URLs importantes :
- 🌐 Site : https://votre-domaine.fr
- 🔧 Admin : https://votre-domaine.fr (bouton Interface Admin)
- ❤️ Health : https://votre-domaine.fr/health

### En cas de problème :
- 📞 Support OVH : 1007
- 📧 Tickets : espace client OVH
- 🔍 Logs : espace client → Logs