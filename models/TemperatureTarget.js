const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemperatureTargetSchema = new Schema({
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = TemperatureTarget = mongoose.model('temperaturetarget', TemperatureTargetSchema);
