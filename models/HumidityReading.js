const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HumidityReadingSchema = new Schema({
  humidityvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = HumidityReading = mongoose.model('humidityreading', HumidityReadingSchema);
