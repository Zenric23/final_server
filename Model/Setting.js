const mongoose = require('mongoose');
const Schema = mongoose.Schema

const settingSchema = new Schema({
    type: {
        type: String,
        default: 'admin'
    },
    shipping_fee: {
        type: Number,
        required: true
    },
    transaction_fee: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('Setting', settingSchema)