// Permet d'importer express
const express = require("express");
// Crée un routeur
const router = express.Router();

// Permet d'importer le middleware auth
const auth = require("../middleware/auth");
// Permet d'importer le middleware multer
const multer = require("../middleware/multer-config");
// Permet d'importer le controller sauce
const sauceCtrl = require("../controllers/sauce");
// Permet de vérifier si l'utilisateur est le propritétaire d'une sauce
const owner = require("../middleware/owner");

//route get pour afficher toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);

//route post pour enregistrer des sauces dans la BDD
router.post("/", auth, multer, sauceCtrl.createSauce);

//route getpour afficher une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);

//route put pour modifier une sauce
router.put("/:id", auth, owner, multer, sauceCtrl.modifySauce);

//route post pour liker une sauce
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//route delete pour supprimer une sauce
router.delete("/:id", auth, owner, multer, sauceCtrl.deleteSauce);

// Permet d'exporter le router
module.exports = router;
