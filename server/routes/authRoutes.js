const express = require("express");
const router = express.Router();
const {signup, login, check} = require('../controllers/authController');
const { authenticate } = require("../middleware/authenticate");

router.route("/signup").post(signup); //no middleware because we create a user
router.route("/login").post(login); //no middleware because we log in, no access yet
router.route("/validate").get(authenticate, check)

module.exports = router;