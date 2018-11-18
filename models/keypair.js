let mongoose = require('mongoose');

// Representative Schema
let keypairSchema = mongoose.Schema({
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  streamName: {
    type: String,
    required: true
  }
});

let Keypair = module.exports = mongoose.model('Keypair', keypairSchema);

module.exports.getKeyByStreamName = function(streamName,callback){
    let query = {streamName:streamName}
    Keypair.findOne(query,callback);
}