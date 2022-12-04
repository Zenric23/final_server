var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  sizes: [{
    price: {
      type: Double,
      required: true
    },
    size: {
      type: String,
      required: true
    },
     inStock: {
      type: Boolean,
      default: true
    },
  }],
  variants: {
    type: Array
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  animalTags: [
    {
      type: String,     
      required: true
    }
  ] 

}, { timestamps: true });

module.exports = mongoose.model("Product", Product)