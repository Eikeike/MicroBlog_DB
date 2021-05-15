const config = require("../utils/config");
const mongoose = require("mongoose");

// 2. Define the MongoDB schema for the people collection
var PostSchema = new mongoose.Schema({
  author:       { type: mongoose.Schema.ObjectId, ref: "User" },
  likeCount:    {
                    type: Number,
                    default: 0
                },
  likedBy:      [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  repostCount:  { type: Number, default: 0 },
  repostedBy:   [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments:     [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  postText:     { type: String, required: true },
  postType:     [{ type: String, default: "post" }] //can be post, comment or repost,
  //comment and repost or post and repost
}, {timestamps : true, discriminatorKey: 'kind'});

let PostModel = mongoose.model("Post", PostSchema);

module.exports = PostModel;