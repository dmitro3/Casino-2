const mongoose = require('mongoose')

const WhiteListSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    expires: 3600 * 24 * 30
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
    expires: 3600 * 24 * 30
  }
})

module.exports = White = mongoose.model('white', WhiteListSchema)