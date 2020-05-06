let mongoose = require('mongoose');

// Representative Schema
let districtSchema = mongoose.Schema({
  province: {
    type: String,
    required: true
  },
  amphoe: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
});

let District = module.exports = mongoose.model('District', districtSchema);

module.exports.getDistrict = function () {
  return District.find();
}