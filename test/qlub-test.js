
// uses test/common.js

// uses global mongoose, CONFIG

describe('Qlub supermodel tests',function(){

var Qlub
  , showLog = false
;

function hasCollection(name, mongodb, processResult){ // calls processResult(err, boolean)
    var mdb = mongodb;
    mdb.collectionsInfo(name,function(err,cursor){
         if(err != null) return after(err, null);
         cursor.toArray(function(err, documents) {
            if(err != null) return after(err, null);
            processResult(null, documents.length > 0);
        });
    });
};

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

    Qlub = require('../qlub')(mongoose);
    mongoose.model(Qlub.model.modelName, Qlub.schema);

    mongoose.connection.once('open', function(){
        dropCollectionForModel(Qlub,mongoose,done); // executes done

        //done();
    });
});

after(function(done){
    mongoose.disconnect();
    done();
});

it('should create an instance of qlub using register', function(done){
    Qlub.register('test-using-register', function success(qlub){
        expect(qlub).to.exist;
        expect(qlub).to.have.property('_id');
        expect(''+qlub._id).to.have.length(24);
        done();
    }, function fail(err){ return done(err);});
});

it('should find the instance just saved', function(done){

    Qlub.findByTitle('test-using-register', function success(qlub){
        should.exist(qlub);
        expect(qlub).to.have.property('_id');
        expect(''+qlub._id).to.have.length(24);
        done();
    }, function fail(err){ return done(err);});
});

it('should find only one record in the collection' , function(done){
    
    Qlub.find(function success(docs){
        expect(docs).to.have.length(1);
        done();
    }, function fail(err){ return done(err);});

});


});

