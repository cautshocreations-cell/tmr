# 🎯 GUIDE ULTRA-DÉTAILLÉ : Héberger sur OVH

## 📍 VOUS ÊTES ICI
Votre application fonctionne localement sur votre PC. Maintenant nous allons la mettre en ligne sur OVH.

---

## ÉTAPE 1️⃣ : CHOISIR VOTRE HÉBERGEMENT OVH

### 🤔 Quelle option choisir ?

#### Option A: **OVH Web Hosting** (RECOMMANDÉ pour débuter)
- ✅ **Le plus simple** - Interface graphique
- ✅ **Pas cher** - 5-15€/mois
- ✅ **Support inclus**
- ❌ Moins de contrôle

#### Option B: **OVH VPS** (Pour les utilisateurs avancés)
- ✅ **Plus de contrôle** - Serveur complet
- ✅ **Plus performant**
- ❌ Plus technique
- ❌ Vous devez tout configurer vous-même

### 🛒 COMMANDER L'HÉBERGEMENT (Web Hosting)

1. **Allez sur** : https://www.ovh.com/fr/hebergement-web/
2. **Choisissez** : "Hébergement Perso" ou "Pro" (Pro recommandé pour Node.js)
3. **Domaine** : 
   - Si vous avez déjà un domaine → "J'ai déjà un domaine"
   - Sinon → Achetez un nouveau domaine (ex: codex-rp.fr)
4. **Options à cocher** :
   - ✅ Certificat SSL Let's Encrypt (gratuit)
   - ✅ Base de données PostgreSQL
   - ✅ Sauvegarde automatique
5. **Finaliser** la commande et payer

---

## ÉTAPE 2️⃣ : ACCÉDER À VOTRE ESPACE CLIENT

### 📱 Première connexion
1. **Aller sur** : https://www.ovh.com/manager/
2. **Se connecter** avec vos identifiants reçus par email
3. **Vous devriez voir** :
   - Votre hébergement web
   - Votre nom de domaine
   - Vos bases de données

### 🔍 Interface à explorer
```
Espace Client OVH
├── Hébergements Web
│   ├── Votre-domaine.fr
│   ├── Informations générales
│   ├── Multisite
│   ├── Bases de données
│   └── FTP-SSH
├── Noms de domaine
│   └── Votre-domaine.fr
└── Emails
```

---

## ÉTAPE 3️⃣ : CONFIGURER LA BASE DE DONNÉES

### 🐘 Créer la base PostgreSQL

1. **Dans l'espace client** : 
   - Cliquez sur "Hébergements Web"
   - Sélectionnez votre hébergement
   - Onglet "Bases de données"

2. **Créer une nouvelle base** :
   - Cliquez sur "Créer une base de données"
   - Type : **PostgreSQL**
   - Nom : `codexrp`
   - Mot de passe : `Vyjeve00`

3. **Noter les informations** (IMPORTANT !) :
   ```
   Serveur : postgresql-XXX.ovh.net
   Base : codex_rp
   Utilisateur : codexrp
   Mot de passe : Vyjeve00
   Port : 5432
   ```

### 💾 Où noter ces informations ?
Créez un fichier texte sur votre bureau avec ces infos, vous en aurez besoin !

---

## ÉTAPE 4️⃣ : PRÉPARER VOTRE APPLICATION

### 📝 Modifier le fichier .env

1. **Sur votre PC**, ouvrez le dossier de votre projet
2. **Copiez** `.env.example` et renommez-le `.env`
3. **Ouvrez** `.env` avec un éditeur de texte (Notepad++)
4. **Remplacez** les valeurs :

```bash
# AVANT (exemple)
DB_HOST=localhost
DB_PASSWORD=your_password_here

# APRÈS (avec vos vraies infos OVH)
DB_HOST=postgresql-xxx.ovh.net
DB_NAME=codex_rp
DB_USER=votre_login_ovh
DB_PASSWORD=MotDePasseTrèsSecurisé123!

# Configuration production
NODE_ENV=production
PORT=3000
BASE_URL=https://votre-domaine.fr

# Générez des clés secrètes uniques (utilisez un générateur en ligne)
JWT_SECRET=une_cle_tres_longue_et_compliquee_123456789
SESSION_SECRET=une_autre_cle_tres_longue_et_compliquee_987654321
```

### 🔐 Générer des clés secrètes
1. **Allez sur** : https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
2. **Générez** 2 clés de 256 bits
3. **Copiez-collez** dans JWT_SECRET et SESSION_SECRET

---

## ÉTAPE 5️⃣ : ACTIVER NODE.JS SUR OVH

### ⚙️ Configuration dans l'espace client

1. **Hébergements Web** → Votre hébergement
2. **Onglet "Multisite"**
3. **Cliquez** sur l'icône "roue dentée" à côté de votre domaine
4. **Modifier** :
   - Runtime : **Node.js**
   - Version : **18** (ou plus récente)
   - Point d'entrée : `src/server/app.js`
   - Variables d'environnement : Ajoutez vos variables du fichier .env

### 📋 Variables d'environnement à ajouter :
```
NODE_ENV=production
DB_HOST=postgresql-xxx.ovh.net
DB_NAME=codex_rp
DB_USER=votre_login_ovh
DB_PASSWORD=MotDePasseTrèsSecurisé123!
JWT_SECRET=votre_cle_jwt
SESSION_SECRET=votre_cle_session
```

---

## ÉTAPE 6️⃣ : UPLOADER VOS FICHIERS

### 📁 Préparer les fichiers à envoyer

**Ne PAS envoyer** :
- ❌ `node_modules/` (trop lourd)
- ❌ `.git/` (inutile)
- ❌ `*.log` (logs locaux)
- ❌ `.env` (contient vos mots de passe locaux)

**À envoyer** :
- ✅ Tout le dossier `src/`
- ✅ `package.json`
- ✅ `scripts/`
- ✅ Tous les fichiers `.md`

### 🚀 Upload via FTP

1. **Téléchargez FileZilla** : https://filezilla-project.org/
2. **Informations de connexion FTP** (dans votre espace client OVH) :
   ```
   Serveur : ftp.votre-domaine.fr
   Login : votre_login_ftp
   Mot de passe : votre_mdp_ftp
   Port : 21
   ```
3. **Connectez-vous** avec FileZilla
4. **Naviguez** vers le dossier `www/` sur le serveur
5. **Glissez-déposez** tous vos fichiers (sauf ceux exclus)

### ⏱️ Temps d'attente
L'upload peut prendre 10-30 minutes selon votre connexion.

---

## ÉTAPE 7️⃣ : CONFIGURER LA BASE DE DONNÉES

### 🔧 Accès SSH (si disponible)

1. **Dans l'espace OVH** : Hébergements → SSH
2. **Activer SSH** si pas déjà fait
3. **Se connecter** :
   ```bash
   ssh votre_login@ssh.cluster0XX.hosting.ovh.net
   ```

4. **Aller dans votre dossier** :
   ```bash
   cd www/
   ```

5. **Installer les dépendances** :
   ```bash
   npm install --production
   ```

6. **Configurer la base** :
   ```bash
   npm run setup-db
   ```

### 🎯 Si SSH n'est pas disponible
Vous devrez configurer la base manuellement via phpPgAdmin dans l'espace client.

---

## ÉTAPE 8️⃣ : TESTER VOTRE SITE

### 🌐 Première visite

1. **Ouvrez votre navigateur**
2. **Allez sur** : `https://votre-domaine.fr`
3. **Vous devriez voir** : Votre site Codex RP !

### ✅ Tests à effectuer

1. **Page d'accueil** : Doit s'afficher correctement
2. **Interface Admin** : Cliquer sur le bouton "Interface Admin"
3. **Connexion admin** : 
   - Login : `admin`
   - Password : `admin123` (à changer !)
4. **Ajouter un type** : Créer un nouveau type de règlement
5. **Ajouter un règlement** : Créer un nouveau règlement

### 🔍 En cas de problème

**Page blanche ou erreur 500** :
- Vérifiez les logs dans l'espace client OVH
- Vérifiez que Node.js est bien activé
- Vérifiez les variables d'environnement

**Erreur base de données** :
- Vérifiez les credentials dans les variables d'environnement
- Testez la connexion à la base depuis l'espace client

---

## ÉTAPE 9️⃣ : SÉCURISER VOTRE INSTALLATION

### 🔐 Changements obligatoires

1. **Changer le mot de passe admin** :
   - Connectez-vous à l'interface admin
   - Changez le mot de passe par défaut

2. **Activer HTTPS** :
   - Dans l'espace OVH : SSL/TLS
   - Activer "Forcer HTTPS"

3. **Sauvegardes** :
   - Configurer les sauvegardes automatiques
   - Tester une restauration

---

## 🆘 AIDE ET SUPPORT

### 📞 Si vous êtes bloqué

1. **Support OVH** : 
   - Téléphone : 1007 (gratuit)
   - Chat en ligne sur ovh.com
   - Tickets via l'espace client

2. **Documentation OVH** :
   - https://docs.ovh.com/fr/hosting/
   - Guides Node.js spécifiques

3. **Forums communautaires** :
   - Stack Overflow
   - Reddit r/webdev

### 🔧 Diagnostic automatique

Si quelque chose ne marche pas, utilisez :
```bash
npm run check-db  # Teste la connexion base
```

---

## ✅ CHECKLIST FINALE

- [ ] Hébergement OVH commandé et activé
- [ ] Base PostgreSQL créée et configurée
- [ ] Fichier .env configuré avec les bonnes valeurs
- [ ] Node.js activé sur l'hébergement
- [ ] Fichiers uploadés via FTP
- [ ] Base de données initialisée
- [ ] Site accessible en HTTPS
- [ ] Interface admin fonctionnelle
- [ ] Mots de passe changés
- [ ] Sauvegardes configurées

🎉 **FÉLICITATIONS ! Votre site est en ligne !**