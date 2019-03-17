const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HumiditySetpointSchema = new Schema({
  humiditysetpointvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = HumiditySetpoint = mongoose.model('humiditysetpoint', HumiditySetpointSchema);
