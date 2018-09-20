let mongoose = require('mongoose');

// Representative Schema
let partySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
});

let Party = module.exports = mongoose.model('Party', partySchema);

module.exports.getParties = function(callback){
    Party.find(callback);
}