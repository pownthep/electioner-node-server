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
  age: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
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
  image: {
    type: String,
    required: true
  }
});

let Representative = module.exports = mongoose.model('Representative', representativeSchema);

module.exports.getReps = function(callback) {
    Representative.find(callback);
}