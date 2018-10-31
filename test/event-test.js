
// uses test/common.js

// uses global mongoose, CONFIG

describe('Event supermodel tests',function(){

var Event
  , showLog = false
;


var dropCollectionByName = function(collname, mongooseX, done) {
    var collection = mongooseX.connection.collection(collname);
    collection.drop(function(err,result){
        //result is null on err, or true if dropped
        if ((err) && (!(err.errmsg='ns not found')) ) {return done(err)}
        return done(null, result);
    });
};

function dropCollectionForModel(supermodel, mongooseX, done){
    var collNameToDrop = supermodel.model.modelName;
    console.log('dropping collection %s',collNameToDrop);
    dropCollectionByName(supermodel.model.modelName, mongooseX, done);
}

before(function(done){
    
    mongoose.connect(CONFIG.env.mongoUrl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    Event = require('../event')(mongoose);
    mongoose.model(Event.model.modelName, Event.schema);

    mongoose.connection.once('open', function(){
        dropCollectionForModel(Event,mongoose,done); // executes done

        //done();
    });
});

after(function(done){
    mongoose.disconnect();
    done();
});

it('should create an instance of event using create', function(done){
    Event.create('test-using-register', function success(event){
        expect(event).to.exist;
        expect(event).to.have.property('_id');
        expect(''+event._id).to.have.length(24);
        done();
    }, function fail(err){ return done(err);});
});

it('should find only one event in the collection' , function(done){
    
    Event.find(function success(docs){
        expect(docs).to.have.length(1);
        done();
    }, function fail(err){ return done(err);});

});


});

