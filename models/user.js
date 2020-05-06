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
    type: Boolean,
    require: true,
  }
});

let User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function (newUser) {
  return newUser.save();
}

module.exports.getUserByKey = function (pubKey) {
  var query = { pubKey: pubKey };
  return User.findOne(query);
}

