const express = require("express");
const {authenticate} = require('../middleware/authenticate')
const router = express.Router();
const {createPost, feed, toggleLike, toggleRepost, getComments, getLikes, searchPost} = require('../controllers/postController');

router.route("/create").post(authenticate, createPost);
router.route("/feed").get(authenticate, feed);
router.route("/toggleLike/:id").get(authenticate, toggleLike);
router.route("/toggleRepost/:id").get(authenticate, toggleRepost);
router.route("/getLikes/:id").get(authenticate, getLikes);
router.route("/getComments").post(authenticate, getComments);
router.route("/search").post(authenticate, searchPost);

module.exports = router;