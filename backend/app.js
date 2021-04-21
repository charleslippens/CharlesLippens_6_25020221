// Permet d'importer express
const express = require("express");
// Permet d'importer mongoose
const mongoose = require("mongoose");
// Permet d'importer body-parser
const bodyParser = require("body-parser");
// Permet d'importer express-mongo-sanitize
const mongoSanitize = require("express-mongo-sanitize");
// Permet d'importer helmet
const helmet = require("helmet");
// Permet d'importer le router sauce
const sauceRoutes = require("./routes/sauce");
// Permet d'importer le router utilisateur
const userRoutes = require("./routes/user");
// Permet d'accéder au chemin du système de fichiers
const path = require("path");
// Permet de lire les variables locales d'environnement dans .env
require("dotenv").config();

// pour connecter l'API à la base de données MongoDB
mongoose
	.connect(
		//"mongodb+srv://sdfsdfsd12:sdfsdfsd12@cluster0.xvfqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		process.env.DB_CONNECT,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Permet de créer l'application express
const app = express();

// Middleware CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Reqsuested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

// Transforme le corps de la requête en objet JS
app.use(bodyParser.json());
app.use(mongoSanitize()); // pour chercher dans les req et supprimer toutes les clés commençant par $ ou contenant "."
app.use(helmet()); // Permet de configurer les en-têtes HTTP de manière sécurisée

// Permet d'accéder à la route pour les images
app.use("/images", express.static(path.join(__dirname, "images")));
// Permet d'accéder aux routes pour les sauces
app.use("/api/sauces", sauceRoutes);
// Permet d'accéder aux routes pour les utilisateurs
app.use("/api/auth", userRoutes);
// Permet d'exporter l'application express pour pouvoir y accéder depuis les autres fichiers du projet
module.exports = app;
