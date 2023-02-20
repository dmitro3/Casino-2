const mongoose = require('mongoose')

const HackerSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    expires: 3600 * 24 * 30
  },
  reason: {
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

module.exports = Hack = mongoose.model('hack', HackerSchema)