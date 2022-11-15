var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Delivery = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Delivery", Delivery)