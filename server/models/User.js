
const config = require('../utils/config');
const mongoose = require('mongoose');
jwt = require('jsonwebtoken');
bcrypt = require('bcryptjs');

// 2. Define the MongoDB schema for the people collection
var UserSchema = new mongoose.Schema({
    name            : {type: String, required: false},
    userName        : {type: String, required: true, index: true, unique: true, sparse: true},
    password        : {type: String, required: true, minLength: 5},
    avatarURL       : {type: String, required: false},
    followersCount  : {type: Number, default: 0},
    followingCount  : {type: Number, default: 0},
    bioText         : {type: String, required: false, default: ''},
    followers       : [{type: mongoose.Schema.ObjectId, ref: "User"}],
    following       : [{type: mongoose.Schema.ObjectId, ref: "User"}],
    posts           : [{type: mongoose.Schema.ObjectId, ref: "Post"}]
});

UserSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//creates a JWT with the user ID (automatically generated as _id)
UserSchema.methods.generateToken = function () {
    return jwt.sign({id: this._id, userName: this.userName}, config.TOKEN_SECRET, {expiresIn: config.TOKEN_EXPIRY});
};

//compares a clear text password with the stored hashed password
UserSchema.methods.checkPassword = async function(pass) {
    return await bcrypt.compare(pass, this.password)
};

//finally compile to create the model from the schema
module.exports = mongoose.model("User", UserSchema);