const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SetpointSchema = new Schema({
  targetmodifier: {
    type: String,
    required: true
  }
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Setpoint = mongoose.model('setpoint', SetpointSchema);
