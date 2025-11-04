const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const regulationsRoutes = require('./routes/regulations');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../client')));

// Health check endpoint pour Railway
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/regulations', regulationsRoutes);
app.use('/api/admin', adminRoutes);

// Route pour les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const { getAllCategories } = require('./models/regulation.model');
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des catégories' });
    }
});

// Route pour créer une nouvelle catégorie
app.post('/api/categories', async (req, res) => {
    try {
        const { addCategory } = require('./models/regulation.model');
        const { name, description, icon, color, sort_order } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Le nom de la catégorie est requis' });
        }
        
        const category = await addCategory({
            name,
            description,
            icon,
            color,
            sort_order
        }, 'admin'); // TODO: utiliser l'ID de l'utilisateur connecté
        
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
    }
});

// Route pour supprimer une catégorie
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { deleteCategoryById } = require('./models/regulation.model');
        const { id } = req.params;
        
        await deleteCategoryById(id);
        res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
    }
});

// Servir index.html pour toutes les autres routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Codex RP Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});