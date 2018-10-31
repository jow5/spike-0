exports.startServer = function(CONFIG,onStart){

var restify = require('restify');
  
var server = restify.createServer({
  name: CONFIG.app.name,
  version: CONFIG.app.version
});

server.use(restify.acceptParser(server.acceptable))
    .use(restify.queryParser({ mapParams: false }))
    .use(restify.bodyParser()) ;
    
require ('./routes')(server).listen(CONFIG.env.port, CONFIG.env.ip, onStart);

return server;

}

/*  
// Some restify examples

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.urlEncodedBodyParser());

server.use(function slowHandler(req, res, next) {
  setTimeout(function() { return next(); }, 250);
});
*/ /*
var server = require('restify').createServer({
  name: NAME,
  Logger: log,
  formatters: {
    'application/foo': function(req, res, body) {
      if (body instanceof Error) {
        body = body.stack;
      } else if (Buffer.isBuffer(body)) {
        body = body.toString('base64');
      } else {
        switch (typeof(body)) {
        case 'boolean':
        case 'number':
        case 'string':
          body = body.toString();
          break;

        case 'undefined':
          body = '';
          break;

        default:
          body = body === null ? '' : JSON.stringify(body);
          break;
        }

      }
      return body;
    }
  }
});
*/
