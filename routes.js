
module.exports = function(server){

/* 
    // User information
    server.get('/api', api); 

    // List of available events for this user
  
    // Available slots for this user for this event
  
    // List of reservations for this user

*/ 
 
// SAMPLE ROUTES for restify
{   
    // send function for sample restify routes
    function send(req, res, next) {
        res.send('hello ' + req.params.name);
        return next();
    }
    function sendJson(req, res, next) {
        res.json({'hello' : req.params.name});
        return next();
    }
    
    server.get('/', function(req,res,next){
     res.send(server.url);
     return next();
    });
    server.get('/echo/:name', function (req, res, next) {
        res.send(req.params);
        return next();
    });
    server.post('/hello', function create(req, res, next) {
        res.send(201, Math.random().toString(36).substr(3, 8));
        return next();
    });
    server.put('/hello', send);
    server.get('/hello/:name', sendJson);
    server.head('/hello/:name', send);
    server.del('hello/:name', function rm(req, res, next) {
        res.send(204);
        return next();
    });
}

// REAL ROUTES for Qlub -- //TODO REFACTOR MOST CODE OUT OF HERE 
{
    var showLog = true;
    var CONFIG = require('./config');
    CONFIG.env = CONFIG.cloud9;
    var mongoose = require('mongoose');
    mongoose.connect(CONFIG.env.mongoUrl);  //  <<<<< IMPORTANT
    
    server.post('/qlubs',function(req,res,next){
        if('useSave' in req.query) {
            var collname = 'qlubs';
            var schema = require('./qlub')(mongoose).schema;
            mongoose.model(collname, schema);
            var Model = mongoose.connection.model(collname);
            var doc = new Model(req.params);
            doc.save(function(err,result){
                if (err) return next(err)
                res.json(result);
                return next();
            });
        } else {  // useRegister
            var Qlub = require('./qlub')(mongoose);
            mongoose.model(Qlub.model.modelName, Qlub.schema);
            Qlub.register(req.params.title,function success(doc){
                res.json(doc);
            }, function fail(err){return next(err);});
        }
    });
 
    server.get('/qlubsWORKS',function(req,res,next){
        useConnection(mongoose,CONFIG.env.mongoUrl, function(err,connection){
            var collname = 'qlubs';
            var schema = require('./qlub')(mongoose).schema;
            mongoose.model(collname, schema);
            var Model = connection.model(collname);
            Model.find({},function(err,result){
                if (err) return next(err)
                res.json(result);
                return next();
            });
        });
    });

    server.get('/qlubs',function(req,res,next){
        var Qlub = require('./qlub')(mongoose);
        mongoose.model(Qlub.model.modelName, Qlub.schema);
        Qlub.find(function success(docs){
            res.json(docs);
            return next();
        }, function fail(err){return next(err);});
    });
    
    server.get('/qlubs/:id',function(req,res,next){ 
        var Qlub = require('./qlub')(mongoose);
        mongoose.model(Qlub.model.modelName, Qlub.schema);
        Qlub.findByTitle(req.params.id,function success(doc){
            res.json(doc);
            return next();
        }, function fail(err){return next(err);});
     });
}

// console.log(server.routes);

// Start it up.

server.on('after', function(req, res, name) {
  req.log.info('%s just finished: %d.', name, res.code);
});

server.on('NotFound', function(req, res) {
  res.send(404, req.url + ' was not found');
});

return server;

}


/*
// restify example routes

server.head('/qlubs/:id', function (req, res, next) {
  res.send({
    hello: req.params.id
  });
  return next();
});

server.put('/qlubs/:id', function (req, res, next) {
  res.send({
    hello: req.params.id
  });
  return next();
});

server.post('/qlubs/:id', function (req, res, next) {
  res.json(201, req.params);
  return next();
});

server.del('/qlubs/:id', function (req, res, next) {
  res.send(204);
  return next();
});

}

*/
