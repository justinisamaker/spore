const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemperatureSetpointSchema = new Schema({
  temperaturesetpointvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = TemperatureSetpoint = mongoose.model('temperaturesetpoint', TemperatureSetpointSchema);
