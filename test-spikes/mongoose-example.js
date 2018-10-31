
// uses test/common.js

// uses global mongoose, CONFIG

describe('mongoose testing example', function(){

var showLog = false;

var useConnection = function(mongoose, url , todoThis){
    var conn = mongoose.createConnection();
    if (showLog) conn.on("error",function(err){console.log('>event:error:  %j', err );});
    if (showLog) conn.on("open",function(){console.log('>event:opened - readyState = %d', conn.readyState);});
    conn.open(CONFIG.env.mongoUrl, function(err,result){
        if (showLog) console.log('>conn.open, : readyState = %d', conn.readyState);
        if (err) todoThis(err)
        todoThis(null,conn);
    });
};

var createPopulatedCollection = function(mongoose, connectionUrl,collname, done) {
    useConnection(mongoose,connectionUrl, function(err,connection){
        mongoose.model(collname, new mongoose.Schema({ name: String }));
        var Model = connection.model(collname);
        var doc = new Model({name:'testOf'&collname})
        doc.save(function(err,result){
            if (err) return done(err)
            //dbconn.close(done);
            done(null,result);
        });
    });  
};

var dropCollectionByName = function(collname, connection, done) {
    var collection = connection.collection(collname);
    collection.drop(function(err,result){
        //result is null on err, or true if dropped
        if ((err) && (!(err.errmsg='ns not found')) ) {return done(err)}
        return done(null, result);
    });
};

before(function(done){
    useConnection(mongoose,CONFIG.env.mongoUrl, function(err,connection){
        dropCollectionByName('users',connection,done); //executes done
    });
    //done();
});

beforeEach(function(done){
    createPopulatedCollection(mongoose, CONFIG.env.mongoUrl , 'users' , done); // executes done
    //done();
});

afterEach(function(done){
    useConnection(mongoose,CONFIG.env.mongoUrl, function(err,connection){
        dropCollectionByName('users',connection,done); //executes done
    });
    //done();
});

after(function(done){
    
    done();
});

it('should populate using beforeEach and find result', function(done){
    useConnection(mongoose,CONFIG.env.mongoUrl, function(err,connection){
        var collname = 'users';
        mongoose.model(collname, new mongoose.Schema({ name: String }));
        var Model = connection.model(collname);
        Model.find({},function(err,result){
            if (err) return done(err);
            result.length.should.be.above(0);
            done();
        });
    });
});

});
