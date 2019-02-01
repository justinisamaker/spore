const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LightsOffTimeSchema = new Schema({
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = LightsOffTime = mongoose.model('lightsofftime', LightsOffTimeSchema);
