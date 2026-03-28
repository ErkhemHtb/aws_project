// CC453RsQAirSupfX
// macherrab_db_user

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const userRoutes = require("./Router/UserRouter");

const app = express();
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



const uri = "mongodb+srv://macherrab_db_user:CC453RsQAirSupfX@cluster0.osy7yfv.mongodb.net/?appName=Cluster0";
const client = mongoose.connect(uri)
  .then(() => console.log("Connecté à MongoDB Atlas ✅"))
  .catch(err => console.log("Erreur de connexion ❌", err));
  



app.use("/", userRoutes);




app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));