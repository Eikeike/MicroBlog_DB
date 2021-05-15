const express = require("express");
const router = express.Router();
const {signup, login} = require('../controllers/authController');

router.route("/signup").post(signup); //no middleware because we create a user
router.route("/login").post(login); //no middleware because we log in, no access yet

module.exports = router;