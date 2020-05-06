let mongoose = require('mongoose');

// Representative Schema
let electionSchema = mongoose.Schema({
  active: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: false
  }
});

let Election = module.exports = mongoose.model('Election', electionSchema);

module.exports.getElection = function (name) {
  let query = { name: name }
  return Election.findOne(query);
}