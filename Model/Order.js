var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// FIXME ADD REQUIRED OPTION

var Order = new Schema({
  customer_id: {
    type: String  
  },
  invoice_id: {
    type: String,
  },
  customer_name: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  payment_status: {
    type: String,
    default: 'Pending'
  },
  isDelivered: {
    type: Boolean,
    default: false
  }, 
  phoneNumber: {
    type: String,
    required: true 
  },
  totalPayment: {
    type: Number,
    // required: true
  },
  shipping: {
    address_line_1: {
      type: String,
      // required: true
    },
    address_line_2: {
      type: String
    },
    city: {
      type: String,
      default: 'Kidapawan'
    },
    postal_code: {
      type: String,
      default: '9400'
    },
    country: {
      type: String,
      default: 'Philippines'
    }
  }, 
  payment_method: {
    type: String, 
    default: ''
  },
  payment_channel: {
    type: String,
    default: ''
  },
  shipping_fee: {
    type: Number,
    required: true
  },
  products: [{
   product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
   },
   qty: {  
      type: Number,
      required: true
   },
   size : {
      type: String,
      required: true
   },
   price: {
      type: String,
      required: true
   }
}] 

}, { timestamps: true });

module.exports = mongoose.model('Order', Order)
