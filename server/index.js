const app = require('./app');
var config = require('./utils/config');

// Start the server
app.listen(config.LISTEN_PORT, function(){
    console.log('listening on port ' + config.LISTEN_PORT);
});