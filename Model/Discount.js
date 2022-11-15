var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Discount = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount_percent: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Discount", Discount)