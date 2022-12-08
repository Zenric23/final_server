const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  },
  pass: {
    type: String,
    unique: true,
    required: true
  },
  // address: [{
  //   adress_line_1: {
  //     type: String,
  //     // required: true
  //   },
  //   address_line_2: {
  //     type: String
  //   },
  //   city: {
  //     type: String,
  //     // required: true
  //   },
  //   postal_code: {
  //     type: String,
  //     // required: true
  //   },
  //   country: {
  //     type: String,
  //     // required: true
  //   },

  // }]

}, { timestamps: true });


module.exports = mongoose.model("Customer", Customer)