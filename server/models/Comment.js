const config = require("../utils/config");
const mongoose = require("mongoose");
const Post = require("../models/Post");

// 2. Define the MongoDB schema for the Comment collection
var CommentSchema = Post.discriminator('Comment', new mongoose.Schema({
    originalPost: {type: mongoose.Schema.ObjectId, ref: "Post"}
}));

module.exports = CommentSchema;