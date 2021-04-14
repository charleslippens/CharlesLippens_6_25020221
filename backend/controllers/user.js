// Permet d'importer le package bcrypt
const bcrypt = require("bcrypt");
// Permet d'importer le package crypto-js
const cryptoJs = require("crypto-js");
// Permet de créer des tokens et de les vérifier
const jwt = require("jsonwebtoken");
// Permet d'importer le package password-validator
const passwordValidator = require("password-validator");
const MaskData = require("maskdata");
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
	//	const emailCryptoJs = cryptoJs
	//		.HmacSHA512(req.body.email, process.env.EMAIL_RAND_SECRET)
	//		.toString();
	//	console.log(emailCryptoJs);
	if (schemaPassword.validate(req.body.password)) {
		bcrypt
			.hash(req.body.password, 10)
			.then((hash) => {
				const maskedEmail = MaskData.maskEmail2(req.body.email);
				const user = new User({
					// email: req.body.email,
					//	email: cryptoJs
					//		.HmacSHA512(req.body.email, process.env.EMAIL_RAND_SECRET)
					//		.toString(),
					//	email: emailCryptoJs,
					email: maskedEmail,
					password: hash,
				});
				//	console.log(emailCryptoJs);
				user.save()
					.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
					.catch((error) => res.status(400).json({ error }));
			})
			.catch((error) => res.status(500).json({ error }));
	} else {
		throw "Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une lettre majuscule, une lettre minusucle, deux chiffres et un symbole";
	}
};

// Permet à un utilisateur de se connecter
//exports.login = (req, res, next) => {
//	User.findOne({ email: req.body.email });
//on vérifie que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
//	User.findOne({
//		email: cryptoJs.HmacSHA256(req.body.email, process.env.EMAIL_RAND_SECRET).toString(),
//	})

//		.then((user) => {
//			if (!user) {
//				return res.status(401).json({ error: "Utilisateur non trouvé !" });
//			}

//LOGIN pour controler la validité de l'utilisateur
exports.login = (req, res, next) => {
	const maskedEmail = MaskData.maskEmail2(req.body.email);
	User.findOne({ email: maskedEmail })
		//const emailCryptoJs = cryptoJs
		//	.HmacSHA512(req.body.email, process.env.EMAIL_RAND_SECRET)
		//	.toString();
		//console.log(emailCryptoJs);
		//chercher le mail de l'utilisateur chiffré dans la base de donnée s'il existe
		//User.findOne({ email: emailCryptoJs })
		.then((user) => {
			//	console.log(emailCryptoJs);
			if (!user) {
				return res.status(401).json({ error: "utilisateur inexistant" });
			}
			bcrypt
				// on utilise la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
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
