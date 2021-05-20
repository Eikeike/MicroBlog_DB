const express = require("express");
const router = express.Router();
const {follow, unfollow, search, getInfo, getComments, edit, getLikes} = require('../controllers/userController');
const {authenticate} = require('../middleware/authenticate');

router.route("/follow/:id").get(authenticate, follow); //no middleware because we create a user
router.route("/unfollow/:id").get(authenticate, unfollow); //no middleware because we create a user
router.route("/getInfo/:userName").get(authenticate, getInfo); //no middleware because we create a user
router.route("/getUserComments/:userName").get(authenticate, getComments);
router.route("/getUserLikes/:id").get(authenticate, getLikes);
router.route("/search/:userName").get(authenticate, search );
router.route("/edit").post(authenticate, edit)

module.exports = router;