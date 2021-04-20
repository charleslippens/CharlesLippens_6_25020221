// permet d'importer le modèle de données pour une sauce
const Sauce = require("../models/Sauce");
// permet d'importer le package file system
const fs = require("fs");

//permet de créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	console.log(sauce);
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
		.catch((error) => res.status(400).json({ error }));
};

//permet d'afficher une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

//permet de liker ou de disliker une sauce
exports.likeSauce = (req, res, next) => {
	const sauceObject = req.body;
	const userId = sauceObject.userId;
	const like = sauceObject.like;
	console.log("----");
	console.log(req.body);

	Sauce.findOne({ _id: req.params.id }) // Utilisation de la méthode findOne() pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
		.then((sauce) => {
			if (like == 1 && sauce.usersLiked.includes(userId) == false) {
				// vérification si la sauce n'a pas déjà été likée par le même utilisateur
				sauce.usersLiked.push(userId);
				sauce.likes++;
				console.log(sauce);
			} else if (like == -1 && sauce.usersDisliked.includes(userId) == false) {
				// vérification si la sauce n'a pas déjà été dislikée par le même utilisateur
				sauce.usersDisliked.push(userId);
				sauce.dislikes++;
				console.log(sauce);
			} else if (like == 0 && sauce.usersLiked.includes(userId)) {
				// vérification si l'userId est présent
				sauce.likes--;
				let index = sauce.usersLiked.indexOf(userId); // récupération de l'index du userId ciblé
				sauce.usersLiked.splice(index, 1); // suppression l'userId du tableau usersLiked
				console.log(sauce);
			} else if (like == 0 && sauce.usersDisliked.includes(userId)) {
				// vérification si l'userId est présent
				sauce.dislikes--;
				let index = sauce.usersDisliked.indexOf(userId); // récupération de l'index du userId ciblé
				sauce.usersDisliked.splice(index, 1); // suppression de l'userId du tableau usersDisliked
				console.log(sauce);
			}
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					usersLiked: sauce.usersLiked,
					usersDisliked: sauce.usersDisliked,
					dislikes: sauce.dislikes,
					likes: sauce.likes,
					_id: req.params.id,
				}
			)
				.then(() => res.status(200).json({ message: "Sauce modifiée !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(400).json({ error }));
};

//permet de modifier une sauce
//permet de modifier une sauce si on en est le propriétaire grâce à owner.js

exports.modifySauce = (req, res, next) => {
	// vérifie si l'on modifie l'image
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split("/images/")[1];
				// supprime l'image de la sauce
				fs.unlink(`images/${filename}`, () => {
					const sauceObject = {
						...JSON.parse(req.body.sauce),
						imageUrl: `${req.protocol}://${req.get("host")}/images/${
							req.file.filename
						}`,
					};
					// renvoie l'objet Sauce avec la nouvelle image
					Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
						.then(() =>
							res.status(200).json({ message: "La sauce a bien été modifiée !" })
						)
						.catch((error) => res.status(400).json({ error }));
				});
			})
			.catch((error) => res.status(500).json({ error }));
	}
	// si la modification ne concerne pas l'image
	else {
		const sauceObject = { ...req.body };
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => res.status(200).json({ message: "La sauce a bien été modifiée !" }))
			.catch((error) => res.status(400).json({ error }));
	}
};

// exports.modifySauce = (req, res, next) => {
// 	const sauceObject = req.file
// 		? {
// 				...JSON.parse(req.body.sauce),
// 				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
// 		  }
// 		: { ...req.body };

// 	Sauce.findOne({ _id: req.params.id })
// 		.then((sauce) => {
// 			// vérification que ca soit bien l'utilisateur qui a creer la sauce
// 			console.log(req.body);
// 			if (sauce.userId == req.user) {
// 				// La sauce appartient à user en cours ?
// 				//	if (sauce.userId === req.body.userIdAuth) {
// 				const filename = sauce.imageUrl.split("/images/")[1];
// 				fs.unlink(`images/${filename}`, () => {
// 					Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
// 						.then(() => res.status(200).json({ message: "Objet modifié !" }))
// 						.catch((error) => res.status(400).json({ error }));
// 				});
// 				//	}
// 			} else {
// 				throw "Impossible de supprimer la sauce. Elle n'appartient pas à l'utilisateur en cours";
// 			}
// 		})
// 		.catch((error) => res.status(500).json({ error }));
// };

//permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// vérification que sa soit bien l'utilisateur qui a creer la sauce
			//if (sauce.userId === req.userIdAuth) {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
			//	}
		})
		.catch((error) => res.status(500).json({ error }));
};

//permet d'afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
	//res.status(200).json({ message: 'Votre requête a bien été reçue !' });
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
