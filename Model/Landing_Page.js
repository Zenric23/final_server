const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LandingPage = new Schema({
    image: {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      },
    aboutUs: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('LandingPage', LandingPage)