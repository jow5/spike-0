describe('Exploratory Mongoose Spike to Create and Drop', function(){

var showLog = false;

function dropCollectionForModel(model,done){
    var collNameToDrop = model.collection.name;
    var db = model.db.db;
    db.dropCollection(collNameToDrop, done);
    // done is only called on error
}

function dropCollection(collNameToDrop,db,done){
    db.dropCollection(collNameToDrop, done);
    // done is only called on error
}

it("should create user collection via mongoose model",function(done){
    var mongoose = require('mongoose');
    var connection = mongoose.connect(CONFIG.env.mongoUrl);
    
    var Schema = mongoose.Schema
    var User = new Schema({
        author    : String
      , type      : String
    });
    
    var MyUserModel = mongoose.model('User', User); //create and access the model User
    
    var u = new MyUserModel();
    u.author = 'authorname';

    u.save(function(err, doc){
        if (err) {console.log(err);return done(err);}
        if (showLog) console.log(doc);
        should.exist(doc._id);
        
        MyUserModel.find({}, function (err,docs) {
            if (err) {console.log(err); return done(err);}
            if (showLog) console.log(docs);
            docs.length.should.above(0);
            dropCollectionForModel(u,done);
            //dropCollection('users',u.db.db,done);
           // done();
        });

    }); 

});

});
