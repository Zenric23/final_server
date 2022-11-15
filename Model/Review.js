var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  published_date: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Review', Review)
