let mongoose = require('mongoose');

// User Schema
let userSchema = mongoose.Schema({
  pubKey: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  voted: {
    type: Number,
    require: true
  }
});

let User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
  newUser.save(callback);
}

module.exports.getUserByKey = function(pubKey, callback){
	var query = {pubKey: pubKey};
	User.findOne(query, callback);
}

