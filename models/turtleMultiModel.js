const mongoose = require('mongoose')

const TurtleMultiSchema = new mongoose.Schema({
  turtle: {
    type: Number,
    required: true
  },
  horseOdd: {
    type: Number,
    required: true
  },
  multiplier: {
    type: Number,
    required: true
  }
})

module.exports = TurtleMulti = mongoose.model('turtleMulti', TurtleMultiSchema)