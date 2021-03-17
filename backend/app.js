const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");

mongoose
	.connect(
		"mongodb+srv://sdfsdfsd12:sdfsdfsd12@cluster0.xvfqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Permet de créer l'application express

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(bodyParser.json());
app.use(mongoSanitize()); // pour chercher dans les req et supprimer toutes les clés commençant par $ ou contenant "."
app.use(helmet()); // pour sécuriser les en-têtes HTTP
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);
module.exports = app;
