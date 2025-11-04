const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Client } = require('pg');

async function setupDatabase() {
    console.log('🗄️  Configuration de la base de données Codex RP...');

    // Configuration de connexion
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'codex_rp',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD
    };

    if (!config.password) {
        console.error('❌ Erreur: DB_PASSWORD non défini dans le fichier .env');
        process.exit(1);
    }

    const client = new Client(config);

    try {
        // Connexion à la base
        console.log('🔌 Connexion à la base de données...');
        await client.connect();
        console.log('✅ Connexion réussie');

        // Lecture et exécution du schéma
        console.log('📋 Création des tables...');
        const schemaPath = path.join(__dirname, '../src/server/db/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSQL);
        console.log('✅ Tables créées');

        // Lecture et exécution des données de test
        console.log('📦 Insertion des données initiales...');
        const seedPath = path.join(__dirname, '../src/server/db/seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSQL);
        console.log('✅ Données initiales insérées');

        // Vérification
        console.log('🔍 Vérification de l\'installation...');
        const result = await client.query('SELECT COUNT(*) as count FROM regulation_categories');
        const categoryCount = parseInt(result.rows[0].count);
        console.log(`✅ ${categoryCount} catégories de règlements trouvées`);

        const regResult = await client.query('SELECT COUNT(*) as count FROM regulations');
        const regCount = parseInt(regResult.rows[0].count);
        console.log(`✅ ${regCount} règlements trouvés`);

        console.log('');
        console.log('🎉 Base de données configurée avec succès !');
        console.log('');
        console.log('📋 Prochaines étapes :');
        console.log('1. Démarrez le serveur : npm start');
        console.log('2. Ouvrez votre navigateur : http://localhost:3000');
        console.log('3. Testez l\'interface admin');

    } catch (error) {
        console.error('❌ Erreur lors de la configuration :', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Vérifiez que PostgreSQL est démarré et accessible');
        } else if (error.code === '28P01') {
            console.error('💡 Vérifiez vos identifiants de connexion dans .env');
        } else if (error.code === '3D000') {
            console.error('💡 La base de données n\'existe pas, créez-la d\'abord');
        }
        
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Fonction pour vérifier la connexion uniquement
async function checkConnection() {
    console.log('🔍 Test de connexion à la base de données...');
    
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'codex_rp',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD
    };

    const client = new Client(config);

    try {
        await client.connect();
        console.log('✅ Connexion à la base de données réussie');
        
        const result = await client.query('SELECT version()');
        console.log('📊 Version PostgreSQL :', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
        
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion :', error.message);
        return false;
    } finally {
        await client.end();
    }
}

// Exécution selon l'argument
const command = process.argv[2];

if (command === 'check') {
    checkConnection();
} else {
    setupDatabase();
}

module.exports = { setupDatabase, checkConnection };