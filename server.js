const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require("./Router/UserRouter");
const messageRoutes = require("./Router/MessageRouter");

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const uri = "mongodb+srv://macherrab_db_user:CC453RsQAirSupfX@cluster0.osy7yfv.mongodb.net/?appName=Cluster0";
mongoose.connect(uri)
  .then(() => console.log("Connecté à MongoDB Atlas ✅"))
  .catch(err => console.log("Erreur de connexion ❌", err));

app.use("/api", userRoutes);
app.use("/api", messageRoutes);

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));