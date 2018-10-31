describe('routes-init',function(){
    var showLog = false;
    var server, client;
    
    if (showLog) console.log('routes-init running');
    
    var loadClient = function(clientUrl){
        return restify.createJsonClient({
                url: clientUrl
        });
    };
        
    before(function(done){
        if (showLog) console.log('before running');
           
        server = require('../startServer').startServer(CONFIG, loadClient);
        
        server.on('listening', function(){
            if (showLog) console.log('server listening');
            //client = loadClient('http://ip.jsontest.com/');
            client = loadClient(server.url);
            done();
        });
     });
    
    it('should configure Mocha in advance',function(done){
        if (showLog) console.log('test running');
        should.exist(restify, 'restify exists');
        should.exist(CONFIG, 'CONFIG exists');
        should.exist(CONFIG.cloud9, 'CONFIG.cloud9 exists');
        should.exist(CONFIG.env,'CONFIG.env not set');
        done();
    });

    it('should set up server', function(done){
        should.exist(server);
        done();
    });
    
    it('should set up client', function(done){
        should.exist(client);
        client.get.should.be.a('function','client.get not a function');
        done();
    });
    
    it('should get response from client',function(done){
        if (showLog) console.log('get response test running');
        client.get('/', function(err, req, res, obj) {
          if (showLog) console.log('get running');
          assert.ifError(err);
          should.exist(obj, 'response obj missing');
          if (showLog) console.log('%j', obj);
          done();
        });
    });
    
    it('should get response from client /hello/test',function(done){
        if (showLog) console.log('get response test running');
        client.get('/hello/test', function(err, req, res, obj) {
          assert.ifError(err);
          if (showLog) console.log('%j', obj);
          should.exist(obj.hello);
          obj.hello.should.equal('test');
          done();
        });
    });

    it('should post a document to /qlubs?useSave and receive a valid object',function(done){
        client.post('/qlubs?useSave',{title:'test-qlub-useSave'},function(err,req,res,obj){
            if (err) return done(err);
            should.exist(obj._id,'created qlub has _id');
            done();
        });
    });

    it('should post a document to /qlubs and receive a valid object',function(done){
        client.post('/qlubs',{title:'test-qlub-useRegister'},function(err,req,res,obj){
            if (err) return done(err);
            should.exist(obj._id,'created qlub has _id');
            done();
        });
    });

    it('should get /qlubs and receive at least one valid object',function(done){
        client.get('/qlubs',function(err,req,res,obj){
            if (err) return done(err);
            expect(obj).to.be.an('array');
            expect(obj).to.have.length.above(0);
            done();
        });
    });

    it('should get /qlubs/test-qlub and receive one valid object',function(done){
        client.get('/qlubs/test-qlub-useRegister',function(err,req,res,obj){
            if (err) return done(err);
            if (showLog) console.log('2. got back: %j',obj);
            expect(obj).to.have.ownProperty('_id');
            done();
        });
    });

});

