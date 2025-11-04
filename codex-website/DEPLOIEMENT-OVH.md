# 🚀 Guide Rapide - Hébergement OVH

## ✅ Ce qui a été préparé

Votre application est maintenant prête pour OVH avec :
- ✅ Configuration de production (`.env.example`)
- ✅ Scripts de déploiement automatique
- ✅ Configuration base de données PostgreSQL
- ✅ Fichiers de configuration OVH (.htaccess, PM2)
- ✅ Documentation complète

## 🎯 Options d'hébergement recommandées

### 1. 🌐 OVH Web Hosting (Recommandé pour débuter)
**Prix:** ~5-15€/mois
**Avantages:**
- Node.js supporté
- Base PostgreSQL incluse
- SSL gratuit Let's Encrypt
- Interface simple

**Steps:**
1. Commandez un hébergement Web OVH "Perso" ou "Pro"
2. Activez Node.js dans l'espace client
3. Créez une base PostgreSQL
4. Uploadez vos fichiers via FTP

### 2. 🖥️ OVH VPS (Plus de contrôle)
**Prix:** ~3-20€/mois  
**Avantages:**
- Serveur dédié
- Accès root complet
- Performance supérieure
- Évolutif

**Steps:**
1. Commandez un VPS OVH
2. Installez Ubuntu/Debian
3. Configurez PostgreSQL + PM2
4. Déployez via Git

## 📋 Étapes de déploiement

### Étape 1: Préparer les credentials
```bash
# Copiez et éditez .env
cp .env.example .env
# Éditez .env avec vos vraies informations OVH
```

### Étape 2: Tester localement
```bash
# Installer les dépendances
npm install

# Configurer la base
npm run setup-db

# Tester l'application
npm start
```

### Étape 3: Déployer sur OVH
```bash
# Pour Web Hosting: Uploadez via FTP
# Pour VPS: 
git clone votre-repo
npm install --production
npm run setup-db
pm2 start ecosystem.config.json
```

## 🔧 Configuration OVH requise

### Base de données PostgreSQL:
- Nom: `codex_rp`
- User: `votre_user`
- Pass: `mot_de_passe_securise`
- Host: `postgresql-xxx.ovh.net`

### Domaine:
- Pointer vers l'IP de votre hébergement
- Activer SSL Let's Encrypt

## 🆘 Support

- 📖 Guide détaillé: `README-deployment.md`
- 🔧 Script de setup: `scripts/setup-database.js`
- 📞 Support OVH: https://www.ovh.com/fr/support/

## ⚡ Démarrage rapide

1. **Commandez votre hébergement OVH**
2. **Configurez PostgreSQL dans l'espace client**
3. **Éditez votre fichier `.env`**
4. **Uploadez les fichiers**
5. **Exécutez `npm run setup-db`**
6. **Démarrez avec `npm start`**

🎉 **Votre serveur Codex RP sera en ligne !**