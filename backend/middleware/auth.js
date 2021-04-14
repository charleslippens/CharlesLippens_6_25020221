// Permet d'importer jsonwebtoken
const jwt = require("jsonwebtoken");

// Permet de vérifier le token envoyé par le frontend
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_RAND_SECRET);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "User ID non valide";
		} else {
			//req.user = userId;
			//req.body.userIdAuth = userId;
			//console.log(req.body);
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Requête non authentifiée"),
		});
	}
};
