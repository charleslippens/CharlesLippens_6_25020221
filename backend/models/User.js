// Permet d'importer mongoose
const mongoose = require("mongoose");
// Ajoute le plugin validateur au modèle de données (1 seul email par utilisateur)
const uniqueValidator = require("mongoose-unique-validator");

// Modèle de données pour un utilisateur
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});
// Permet de ne pas avoir plusieurs utilisateurs avec la même adresse mail
userSchema.plugin(uniqueValidator);

// Permet d'exporter le modèle
module.exports = mongoose.model("User", userSchema);
