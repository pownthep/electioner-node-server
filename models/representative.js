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

module.exports.getReps = function () {
  return Representative.find();
}
module.exports.getRepByDistrict = function (district) {
  var query = { district: district };
  return Representative.find(query);
}

module.exports.getRepByParty = function (party) {
  var query = { party: party };
  return Representative.find(query);
}