// Permet d'importer jsonwebtoken
const jwt = require("jsonwebtoken");
// Permet d'importer lesmodèle de sauce pour la BD
const Sauce = require("../models/Sauce");

// On itialise les tokens utilisateurs pour autoriser les modifications et suppressions des sauces par le propriétaire uniquement
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_RAND_SECRET);
		const userId = decodedToken.userId;
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				if (userId === sauce.userId) {
					next();
				} else {
					throw "Vous ne pouvez modifier ou supprimer la sauce.";
				}
			})
			.catch((error) => res.status(400).json({ error }));
	} catch {
		res.status(401).json({
			error: new Error("Invalid request!"),
		});
	}
};
