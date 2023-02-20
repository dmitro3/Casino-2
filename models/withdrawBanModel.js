const mongoose = require('mongoose')

const WithdrawBanSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
    expires: 3600 * 24 * 30
  }
})

module.exports = WithdrawBan = mongoose.model('withdrawBan', WithdrawBanSchema)