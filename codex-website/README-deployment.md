# Guide de Déploiement OVH - Codex RP

## 🎯 Prérequis

- Compte OVH avec hébergement Web ou VPS
- Domaine configuré chez OVH
- Accès FTP/SSH à votre hébergement

## 📋 Étapes de Déploiement

### 1. 🐘 Configuration Base de Données PostgreSQL

#### Option A: OVH Web Hosting
1. Connectez-vous à votre espace client OVH
2. Allez dans `Hébergements web` → Votre hébergement
3. Onglet `Bases de données`
4. Créez une nouvelle base PostgreSQL
5. Notez les informations de connexion

#### Option B: OVH VPS
1. Connectez-vous en SSH à votre VPS
2. Installez PostgreSQL :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```
3. Configurez PostgreSQL :
```bash
sudo -u postgres createuser --interactive
sudo -u postgres createdb codex_rp
```

### 2. ⚙️ Configuration du projet

#### Modifiez le fichier `.env` avec vos vraies valeurs :
```bash
# Base de données OVH
DB_HOST=your-db-host.ovh.net
DB_PORT=5432
DB_NAME=codex_rp
DB_USER=your_username
DB_PASSWORD=your_secure_password

# Configuration production
NODE_ENV=production
PORT=3000
BASE_URL=https://votre-domaine.ovh

# Sécurité (générez des clés uniques)
JWT_SECRET=votre_cle_jwt_super_secrete_unique
SESSION_SECRET=votre_cle_session_super_secrete_unique
```

### 3. 📤 Upload des fichiers

#### Via FTP (OVH Web Hosting) :
1. Utilisez FileZilla ou WinSCP
2. Uploadez tous les fichiers sauf :
   - `node_modules/`
   - `.git/`
   - `*.log`

#### Via SSH (OVH VPS) :
```bash
# Cloner le repository
git clone https://github.com/votre-repo/codex-website.git
cd codex-website/codex-website

# Installer les dépendances
npm install --production
```

### 4. 🗄️ Initialisation de la base de données

```bash
# Exécuter le schéma
node scripts/setup-database.js

# Ou manuellement via psql :
psql -h your-db-host.ovh.net -U your_username -d codex_rp -f src/server/db/schema.sql
psql -h your-db-host.ovh.net -U your_username -d codex_rp -f src/server/db/seed.sql
```

### 5. 🚀 Démarrage de l'application

#### OVH Web Hosting :
- L'application démarre automatiquement avec `npm start`
- Configurez le point d'entrée sur `src/server/app.js`

#### OVH VPS :
```bash
# Installation de PM2 pour la gestion des processus
npm install -g pm2

# Démarrage de l'application
pm2 start src/server/app.js --name "codex-rp"

# Configuration pour redémarrage automatique
pm2 startup
pm2 save
```

## 🔧 Configuration DNS et SSL

### DNS :
1. Dans l'espace client OVH → Domaines
2. Zone DNS → Ajouter une entrée A ou CNAME
3. Pointez vers l'IP de votre hébergement

### SSL (Certificat gratuit) :
1. Espace client OVH → SSL Gratuit
2. Activez Let's Encrypt pour votre domaine

## 📊 Monitoring et Maintenance

### Logs :
```bash
# Voir les logs de l'application
pm2 logs codex-rp

# Logs du système (VPS)
tail -f /var/log/nginx/access.log
```

### Sauvegarde base de données :
```bash
# Sauvegarde quotidienne automatique
0 2 * * * pg_dump -h your-db-host.ovh.net -U your_username codex_rp > backup-$(date +\%Y\%m\%d).sql
```

### Mise à jour :
```bash
# Pull des dernières modifications
git pull origin main

# Redémarrage de l'application
pm2 restart codex-rp
```

## 🔗 URLs importantes

- **Site web** : https://votre-domaine.ovh
- **API** : https://votre-domaine.ovh/api
- **Admin** : https://votre-domaine.ovh (bouton Interface Admin)
- **Health check** : https://votre-domaine.ovh/health

## 🆘 Dépannage

### Erreur de connexion base de données :
1. Vérifiez les credentials dans `.env`
2. Testez la connexion : `psql -h HOST -U USER -d DATABASE`
3. Vérifiez que PostgreSQL accepte les connexions externes

### Application ne démarre pas :
1. Vérifiez les logs : `pm2 logs`
2. Vérifiez que le port 3000 est libre
3. Vérifiez les permissions des fichiers

### 502 Bad Gateway :
1. Vérifiez que l'application est démarrée
2. Configurez le proxy nginx (VPS)
3. Vérifiez les ports et firewall

## 📞 Support

- Documentation OVH : https://docs.ovh.com
- Support technique : Espace client OVH
- Node.js sur OVH : https://docs.ovh.com/fr/hosting/nodejs/