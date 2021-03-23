// Permet d'importer express
const express = require("express");
// Crée un routeur
const router = express.Router();

// Permet d'importer le controller utilisateurs
const userCtrl = require("../controllers/user");

// Route post pour créer un nouveau compte utilisateur
router.post("/signup", userCtrl.signup);
// Route post pour se connecter à un compte utilisateur
router.post("/login", userCtrl.login);

// Permet d'exporter le router
module.exports = router;
