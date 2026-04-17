const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_jwt_super_securise";

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Nom d'utilisateur et mot de passe requis"
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 6 caractères"
            });
        }
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Ce nom d'utilisateur est déjà pris"
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = new User({
            username,
            password: hashedPassword
        });
        
        await user.save();
        
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès"
        });
        
    } catch (error) {
        console.error("Erreur signin:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création du compte"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Nom d'utilisateur et mot de passe requis"
            });
        }
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Nom d'utilisateur ou mot de passe incorrect"
            });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: "Connexion réussie",
            token: token,
            username: user.username
        });
        
    } catch (error) {
        console.error("Erreur login:", error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la connexion"
        });
    }
});

module.exports = router;