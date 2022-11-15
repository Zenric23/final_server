var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//FIXME required options
var Admin = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    default: ''
    // required: true
  },
  pass: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('Admin', Admin)