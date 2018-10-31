describe('samples',function(){
    var
        foo = 'bar'
      , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
    
    it('should succeed for chai example tests',function(){
        foo.should.be.a('string');
        foo.should.equal('bar');
        foo.should.have.length(3);
        beverages.should.have.property('tea').with.length(3);
    });
})