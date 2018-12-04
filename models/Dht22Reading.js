const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Dht22ReadingSchema = new Schema({
  temperaturevalue: {
    type: Number,
    required: true
  },
  humidityvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Dht22Reading = mongoose.model('dht22reading', Dht22ReadingSchema);
