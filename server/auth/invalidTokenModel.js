var mongoose = require('mongoose');

var InvalidTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('InvalidToken', InvalidTokenSchema);