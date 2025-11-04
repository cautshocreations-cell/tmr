#!/bin/bash

# Script de déploiement pour OVH
echo "🚀 Préparation du déploiement Codex RP sur OVH..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet."
    exit 1
fi

# Créer le fichier .env de production si il n'existe pas
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env de production..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Éditez le fichier .env avec vos vraies valeurs avant de continuer!"
    echo "   - DB_HOST: L'adresse de votre base de données OVH"
    echo "   - DB_PASSWORD: Le mot de passe de votre base PostgreSQL"
    echo "   - JWT_SECRET: Générez une clé secrète unique"
    echo "   - SESSION_SECRET: Générez une autre clé secrète unique"
fi

# Installer les dépendances de production
echo "📦 Installation des dépendances de production..."
npm ci --only=production

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p logs
mkdir -p uploads

# Copier les fichiers nécessaires pour OVH
echo "📋 Préparation des fichiers pour OVH..."

# Créer un package.json minimal pour OVH si nécessaire
cat > package-deploy.json << EOF
{
  "name": "codex-rp-server",
  "version": "1.0.0",
  "description": "Serveur de règlements Codex RP",
  "main": "src/server/app.js",
  "scripts": {
    "start": "node src/server/app.js",
    "setup-db": "node scripts/setup-database.js"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.8.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "express-rate-limit": "^6.7.0",
    "multer": "^1.4.5"
  }
}
EOF

echo "✅ Préparation terminée!"
echo ""
echo "📝 ÉTAPES SUIVANTES:"
echo "1. 🔐 Éditez le fichier .env avec vos vraies informations"
echo "2. 🐘 Créez une base PostgreSQL sur OVH"
echo "3. 📤 Uploadez les fichiers sur votre hébergement OVH"
echo "4. 🗄️  Exécutez les migrations de base de données"
echo "5. 🚀 Démarrez l'application"
echo ""
echo "📚 Guide détaillé disponible dans README-deployment.md"