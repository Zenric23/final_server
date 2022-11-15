var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
  name: {
    type: String,
    required: true,
  },
  payment_channel: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date()
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


module.exports = mongoose.model('Notification', Notification)