
// uses test/common.js

// uses global mongoose, CONFIG

describe('mongoose testing example (1)', function(){

var showLog = false;

var createPopulatedCollection = function(collname, mongooseX, done) {
    mongooseX.model(collname, new mongooseX.Schema({ name: String }));
    var Model = mongooseX.connection.model(collname);
    var doc = new Model({name:'testOf'&collname})
    doc.save(function(err,result){
        if (err) return done(err)
        //dbconn.close(done);
        done(null,result);
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

before(function(done){

    mongoose.connect(CONFIG.env.mongoUrl);

    dropCollectionByName('users',mongoose, done); //executes done
    //done();
});

beforeEach(function(done){
    createPopulatedCollection('users', mongoose, done); // executes done
    //done();
});

afterEach(function(done){
   dropCollectionByName('users', mongoose, done); //executes done
});

after(function(done){
    
    done();
});

it('should populate using beforeEach and find result', function(done){
    var collname = 'users';
    mongoose.model(collname, new mongoose.Schema({ name: String }));
    var Model = mongoose.connection.model(collname);
    Model.find({},function(err,result){
        if (err) return done(err);
        result.length.should.equal(1);
        done();  // if unreached, test will generate timeout error
    });
});

});
