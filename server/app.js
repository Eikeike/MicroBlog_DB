// 1. Include Packages
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var logger = require('morgan');
var filter = require('content-filter') 

var config = require('./utils/config')
var errorHandler = require('./middleware/errorHandler');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(filter());

//routes
var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');
var postRoutes = require('./routes/postRoutes');

// Load app routes
app.use('/auth', authRoutes); // all requests to /auth/... are defined here
app.use('/user', userRoutes);
app.use('/posts', postRoutes);

app.use(errorHandler);

module.exports = app;
