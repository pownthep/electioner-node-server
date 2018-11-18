let mongoose = require('mongoose');

// Representative Schema
let representativeSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
  }

});

let Representative = module.exports = mongoose.model('Representative', representativeSchema);

module.exports.getReps = function(callback) {
    Representative.find(callback);
}
module.exports.getRepByDistrict = function(district,callback){
	var query = {district: district};
	Representative.find(query, callback);
}

module.exports.getRepByParty = function(party,callback){
	var query = {party: party};
	Representative.find(query, callback);
}