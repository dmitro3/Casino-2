const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  userName: {
    type: String,
    required: true
  },
  nugAmount: {
    type: Number,
    required: true
  },
  gemAmount: {
    type: Number,
    required: true
  },
  holder: {
    type: Boolean,
    default: false
  },
  rewardData: {
    type: Number,
    default: 0
  },
  spinData: {
    type: Number,
    default: 0
  },
  deviceId: {
    type: String,
    required: true
  },
  spinNum: {
    type: Number,
    required: true
  },
  logIn: {
    type: Boolean,
    required: true
  },
  bonusNugAmount: {
    type: Number,
    required: true
  },
  turtleBet: {
    singleGame: [{
      id: {
        type: Number,
        default: 0
      },
      betAmount: {
        type: Number,
        default: 0,
      }
    }],
    quinellaGame: [{
      id1: {
        type: Number,
        default: 0
      },
      id2: {
        type: Number,
        default: 0
      },
      betAmount: {
        type: Number,
        default: 0
      }
    }]
  }
})

module.exports = User = mongoose.model('user', UserSchema)