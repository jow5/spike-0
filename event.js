//
// Constructor for Event -- a "supermodel"
//
module.exports = function(mongoose) {
  //var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var modelName ='Events';
  var collection = 'events';
  var _schema = new Schema({
      qlub : { type: ObjectId, required: true }
    , title: { type: String, required: true }
    , timeStart : {type: Date, required: true }
    , capacity : {type: Number, required: true }
    , confirmed : [{name:String, email:String }] // todo: substitute an object?
    , waitlist : [{name:String, email:String, priority:Number }] // todo: substitute an object?
  });

  // Declaring a private model for internal methods
  var _model = mongoose.model(collection, _schema);
  
  // Creating a create method for convenience
  var _create = function(qlub, title, timeStart, capacity, success, fail){
    _model.create({ qlub: qlub, title:title, timeStart:timeStart, capacity:capacity }, function(e, doc){
      if(e) {
        fail(e);
      } else {
        success(doc);
      }
    });
  };
  // Creating a findByEmail method for convenience
  var _findById = function(id, success, fail){
    _model.findOne({ _id: id }, function(e, doc){
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
    create: _create,
    schema: _schema,
    model: _model,
    findById: _findById,
    find: _find
  }
}; 
