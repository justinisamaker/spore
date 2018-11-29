const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HumidityTargetSchema = new Schema({
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = HumidityTarget = mongoose.model('humiditytarget', HumidityTargetSchema);
