// Permet d'importer le package bcrypt
const bcrypt = require("bcrypt");
// Permet d'importer le package crypto
const crypto = require("crypto");
// Permet de créer des tokens et de les vérifier
const jwt = require("jsonwebtoken");
// Permet d'importer le package password-validator
const passwordValidator = require("password-validator");
// Permet d'importer le modèle de données pour un utilisateur
const User = require("../models/User");

// permet de créer un schéma de validation de mot de passe
const schemaPassword = new passwordValidator();
schemaPassword
	.is()
	.min(8)
	.is()
	.max(20)
	.has()
	.uppercase()
	.has()
	.lowercase()
	.has()
	.digits(2)
	.has()
	.symbols(1)
	.has()
	.not()
	.spaces();

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
	// Cryptage de l'email (réversible)
	let emailCipher = crypto.createCipher("aes-256-ctr", process.env.EMAIL_SECRET);
	let emailCrypted = emailCipher.update(req.body.email, "utf-8", "hex");
	console.log("inscriptionCrypt:");
	console.log(emailCrypted.toString("hex"));
	// test de décryptage
	const emailDecipher = crypto.createDecipher("aes-256-ctr", process.env.EMAIL_SECRET);
	let emailDecrypted = emailDecipher.update(emailCrypted, "hex", "utf-8");
	console.log("inscriptionDecrypt:");
	console.log(emailDecrypted);
	// Cryptage du mot de passe (irréversible)
	if (schemaPassword.validate(req.body.password)) {
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				const user = new User({
					email: emailCrypted,
					password: hash,
				});
				user.save()
					.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
	} else {
		throw "Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une lettre majuscule, une lettre minusucle, deux chiffres et un symbole";
	}
};

//LOGIN pour controler la validité de l'utilisateur
exports.login = (req, res, next) => {
	// Cryptage de l'email (réversible)
	let emailCipher = crypto.createCipher("aes-256-ctr", process.env.EMAIL_SECRET);
	let emailCrypted = emailCipher.update(req.body.email, "utf-8", "hex");
	console.log("loginCrypt:");
	console.log(emailCrypted.toString("hex"));
	// test de décryptage
	const emailDecipher = crypto.createDecipher("aes-256-ctr", process.env.EMAIL_SECRET);
	let emailDecrypted = emailDecipher.update(emailCrypted, "hex", "utf-8");
	console.log("loginDecrypt:");
	console.log(emailDecrypted);
	// Recherche de l'email de l'utilisateur chiffré dans la base de donnée
	User.findOne({ email: emailCrypted })
		.then((user) => {
			// console.log(emailCrypted.toString('hex'));
			if (!user) {
				return res.status(401).json({ error: "utilisateur inexistant" });
			}
			bcrypt
				// Comparaison du mot de passe entré par l'utilisateur avec le hash enregistré dans la BD
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							// on utilise la fonction sign de jsonwebtoken pour encoder un nouveau token
							{ userId: user._id },
							process.env.JWT_RAND_SECRET, //on utilise une chaîne secrète de développement temporaire
							{
								expiresIn: "24h",
							}
						),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
