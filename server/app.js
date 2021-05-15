// 1. Include Packages
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var logger = require('morgan');

var config = require('./utils/config')
var errorHandler = require('./middleware/errorHandler');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');
var postRoutes = require('./routes/postRoutes');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(error => {
  console.log(`Error: Cannot connect to database with URI ${config.MONGO_URI}`)
});
mongoose.connection.once('open', function() {
  console.log("Database connected successfully!");
});
mongoose.connection.on('error', function(err) {
  console.log(`Error: Cannot connect to MongoDB: ${err}`);
});

// Load app routes
app.use('/auth', authRoutes); // all requests to /auth/... are defined here
app.use('/user', userRoutes);
app.use('/posts', postRoutes);

app.use(errorHandler);

module.exports = app;
