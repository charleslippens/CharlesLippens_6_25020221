// Permet d'importer mongoose

const mongoose = require("mongoose");

// Modèle de données pour une sauce
const sauceSchema = mongoose.Schema({
	userId: { type: String },
	name: { type: String },
	manufacturer: { type: String },
	description: { type: String },
	mainPepper: { type: String },
	heat: { type: Number },
	imageUrl: { type: String },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	usersLiked: { type: Array, default: [] },
	usersDisliked: { type: Array, default: [] },
});

// Permet d'exporter le modèle
module.exports = mongoose.model("Sauce", sauceSchema);
