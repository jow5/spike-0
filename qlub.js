//
// Constructor for Qlub -- a "supermodel"
//
module.exports = function(mongoose) {
  //var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var modelName ='Qlubs';
  var collection = 'qlubs';
  var _schema = new Schema({
    title: { type: String, required: true }
  });

  // Declaring a private model for internal methods
  var _model = mongoose.model(collection, _schema);
  
  // Creating a register method for convenience
  var _register = function(qlubname, success, fail){
    _model.create({ title: qlubname }, function(e, doc){
      if(e) {
        fail(e);
      } else {
        success(doc);
      }
    });
  };
  // Creating a findByEmail method for convenience
  var _findByTitle = function(title, success, fail){
    _model.findOne({ title: title }, function(e, doc){
      if(e) {
        fail(e);
      } else {
        success(doc);
      }
    });
  }
  // Creating a find method for convenience
  var _find = function(success, fail){
    _model.find({}, function(e, docs){
      if(e) {
        fail(e);
      } else {
        success(docs);
      }
    });
  }

  // Returning properties and methods we'd like to be public
  return {
    register: _register,
    schema: _schema,
    model: _model,
    findByTitle: _findByTitle,
    find: _find
  }
}; 
