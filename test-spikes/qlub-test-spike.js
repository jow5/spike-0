
// uses test/common.js

// uses global mongoose, CONFIG

describe('qlub model exploratory tests',function(){

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
    var collNameToDrop = supermodel.model.modelName; // model.collection.name;
    console.log('dropping collection %s',collNameToDrop);
    dropCollectionByName(supermodel.model.modelName, mongooseX, done);
    /*
    var mongodb = supermodel.model.db.db 
    mongodb.dropCollection(collNameToDrop, function(err,result){
        if (err != null ) { if (showLog) console.log(err); done(err,result); }
        console.log(result);
    });
    // done is only called on error
    */
}

function xdropCollectionForModel(model,db,after){
    var collNameToDrop = model.collection.name;
    // Verify that the collection exists
    db.collectionNames(collNameToDrop, function(err, names) {
        // console.log('dropping?');
        if (names.length > 0) {
            // console.log('dropping');
            // Drop the collection from this world
            db.dropCollection(collNameToDrop, function(err, result) {
              if (err != null) after(err, null);
                // Verify that the collection is gone
              db.collectionNames(collNameToDrop, function(err, names) {
                if (err != null) after(err, null);
        	    assert.equal(0, names.length);
        	    after();
              });
            });
        } else {
            after();
        }
    });
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


it('should have CONFIG.env.mongoUrl set', function(done){
    should.exist(CONFIG.env.mongoUrl);
    done();
});

it('should be connected to mongoose and open',function(done){
    should.exist(mongoose.connection, 'db should exist');
    should.exist(mongoose.connection.readyState, 'readyState should exist');
    mongoose.connection.readyState.should.be.equal(1);
    done();
});


it('should have collectionNames in the db',function(done){
    var mdb = mongoose.connection.db;
    mdb.collectionNames(function(err, cnames){
        cnames.length.should.be.above(0);
        done();
    });
});

it('should have collections in the db',function(done){
    var mdb = mongoose.connection.db;
    mdb.collections(function(err,colls){
        should.exist(colls);
        done();
    });
});

it('should have todos in the db',function(done){
    var mdb = mongoose.connection.db;
    mdb.collectionsInfo('todos',function(err,cursor){
         if(err != null) return done(err, null);
         cursor.toArray(function(err, documents) {
            if(err != null) return done(err, null);
            // console.log("%j",documents);
            documents.length.should.above(0);
            done();
        });
    });
});


it('should have collection todos',function(done){
    hasCollection('todos',mongoose.connection.db,function(err,has){
        if(err != null) return done(err);
        has.should.equal(true);
        done();
    });
});


it('should show qlubs as collection for model Qlub' , function(done){
    should.exist(Qlub.model.collection);
    should.exist(Qlub.model.collection.name);
    Qlub.model.collection.name.should.equal('qlubs');
    done();
});

it('should drop qlubs from the db if there',function(done){
    dropCollectionForModel(Qlub, mongoose, function(err,res){
        if(err) return done(err);
        if (showLog) {
            console.log(err);
            console.log(res);
        }
        done();
    });
    
});

it('should not have collection qlubs',function(done){
    hasCollection('qlubs',mongoose.connection.db,function(err,has){
        if(err) return done(err);
        has.should.equal(false);
        done();
    });
});


it('should create a mongo collection and insert a document directly ', function(done){
    mongoose.connection.db.createCollection('qlubs', {safe:true}, function(err,collection){
        if (err) return done(err);
        should.exist(collection,'collection created');
        collection.insert({name:'test-qlub-direct'},function(err,docs){
            if (err) return done(err);
            //console.log( docs);
            should.exist(docs, 'document exists');
            docs.length.should.equal(1);
            should.exist(docs[0]._id , 'docs[0]._id exists');
            (docs[0]._id+'').should.have.length.within(24,24);
            done();
            });
    });
});

it('should have collection qlubs',function(done){
    hasCollection('qlubs',mongoose.connection.db,function(err,has){
        if(err) return done(err);
        has.should.equal(true);
        done();
    });
});

it('should find that document', function(done){
    mongoose.connection.db.collection('qlubs', function(err,collection){
        collection.findOne({name:'test-qlub-direct'}, function(err, item) {
            if (err) return done(err);
            should.exist(item);
            should.exist(item.name);
            item.name.should.equal('test-qlub-direct');
            done();
        });
    });
});

it('should drop qlubs from the db if there',function(done){
    dropCollectionForModel(Qlub, mongoose, done);
   // done();
});

});

