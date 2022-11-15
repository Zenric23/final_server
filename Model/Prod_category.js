var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Prod_category = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
  
},{ timestamps: true });

module.exports = mongoose.model("Prod_category", Prod_category)