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
  party: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  sub_district: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

let Representative = module.exports = mongoose.model('Representative', representativeSchema);

module.exports.getReps = function(callback) {
    Representative.find(callback);
}