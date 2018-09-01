let mongoose = require('mongoose');

// User Schema
let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

let Article = module.exports = mongoose.model('User', userSchema);
