const app = require('./app');
var config = require('./utils/config');
var mongoose = require("mongoose");


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => {
  console.log(`Error: Cannot connect to database with URI ${config.MONGO_URI}`)
});
mongoose.connection.once('open', function() {
  console.log("Database connected successfully!");
});
mongoose.connection.on('error', function(err) {
  console.log(`Error: Cannot connect to MongoDB: ${err}`);
});


// Start the server
app.listen(config.LISTEN_PORT, function(){
    console.log('listening on port ' + config.LISTEN_PORT);
});