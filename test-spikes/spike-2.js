describe('blah',function(){
var showLog = false;

before(function(done){
    mongoose.connect(CONFIG.env.mongoUrl);
    done();
});

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

it('should work',function(done){
    var k, kk;
   // useConnection(mongoose,CONFIG.env.mongoUrl, function(err,connection){
    var connection = mongoose.connection;
        
    var Qlub = require('../qlub')(mongoose);
    console.log('==============');
    for(k in Qlub.model){console.log(k);}
    //console.log(Qlub);
    console.log(mongoose.model('qlubs').db._readyState);
    
            var Model = connection.model('qlubs');
            console.log('--------------');
            for(kk in Model.db){console.log(kk);}
            console.log(Model.db._readyState);
            done();
        });
   // });
    
});
