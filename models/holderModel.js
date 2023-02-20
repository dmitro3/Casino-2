const mongoose = require('mongoose')

const HolderSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true
  },
  nftAmount: {
    type: Number,
    required: true
  },
  player: {
    type: Boolean,
    default: false
  }
})

module.exports = Holder = mongoose.model('holder', HolderSchema)