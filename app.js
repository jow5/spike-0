
var CONFIG = require('./config');

CONFIG.env = CONFIG.cloud9;

var onStart = function(){
    console.log('%s listening at %s', server.name, server.url);
};

var server = require('./startServer').startServer(CONFIG, onStart);
