const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

//pour afficher toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);

//pour enregistrer des sauces dans la BDD
router.post("/", auth, multer, sauceCtrl.createSauce);

//pour afficher une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);

//pour modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//pour liker une sauce
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = router;
