const Sauce = require("../models/Sauce");
const fs = require("fs");

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

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(404).json({ error }));
};

exports.likeSauce = (req, res, next) => {
	const sauceObject = req.body;
	const userId = sauceObject.userId;
	const like = sauceObject.like;

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

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce modifiée !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
	//res.status(200).json({ message: 'Votre requête a bien été reçue !' });
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
