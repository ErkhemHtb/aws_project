const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_super_securise';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token d\'authentification requis' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token invalide ou expiré' 
            });
        }
        req.user = user;
        next();
    });
};

router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ date: -1 })
            .limit(100);

        res.json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('Erreur récupération messages:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération des messages' 
        });
    }
});

router.post('/post', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const username = req.user.username;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Le message ne peut pas être vide' 
            });
        }

        if (text.length > 280) {
            return res.status(400).json({ 
                success: false, 
                message: 'Le message ne peut pas dépasser 280 caractères' 
            });
        }

        const message = new Message({
            author: username,
            text: text.trim()
        });

        await message.save();

        res.status(201).json({
            success: true,
            message: 'Message publié avec succès',
            data: message
        });

    } catch (error) {
        console.error('Erreur publication message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la publication du message' 
        });
    }
});

module.exports = router;