const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const path = require('path');

const JWT_SECRET = "test123";






router.get("/",(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login")
    }
    res.sendFile(path.join(__dirname, "../views/welcome.html"));

})
router.get("/signup",(req,res)=>{
    const token = req.cookies.token;
    if (token) {
        res.redirect("/")
    }
 
    res.sendFile(path.join(__dirname, "../views/signup.html"));
    

})

router.post("/signup",async (req,res)=>{
    name = req.body.name
    email = req.body.email
    password = req.body.password
    conf_password = req.body.conf_password
    if (password !== conf_password){
        console.log("not match")
        return res.send("Not Match")
    }

    if (password.length < 6) {
        console.log("not match")
        return res.send("il faut 6 caractere au plus ")
    }
    const salt = await bcrypt.genSalt(10); 
    password = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: password });

    try {
        const savedUser = await user.save(); // essaie de sauvegarder
        console.log("Utilisateur enregistré ✅", savedUser);
        const token = jwt.sign(
            { id: user._id },   
            JWT_SECRET
        );
        res.cookie("token", token)
        
        return res.redirect("/")
    } catch (err) {
        if (err.code === 11000) { 
            console.log("Email déjà utilisé ❌");
            return res.send("Erreur : cet email est déjà utilisé !");
        }
        console.log("Erreur lors de l'enregistrement :", err);
        res.send("Erreur serveur, veuillez réessayer plus tard.");
    }

})


router.get("/login",(req,res)=>{
    const token = req.cookies.token;
    if (token) {
        return res.redirect("/")
    }
    res.sendFile(path.join(__dirname, "../views/login.html"));
    
})
router.post("/login",async (req,res)=>{
    email = req.body.email
    password = req.body.password

    try{
        const user = await User.findOne({email})
        if (!user){
            res.send("Email ou mot de passe incorrect")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("Email ou mot de passe incorrect");
        }
        const token = jwt.sign(
            { id: user._id },   
            JWT_SECRET
        );
        res.cookie("token", token)
        
        return res.redirect("/")
    }catch(err){

    }
})





router.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.send("Déconnexion réussie ✅")
});


module.exports = router;