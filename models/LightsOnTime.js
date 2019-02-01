const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LightsOnTimeSchema = new Schema({
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = LightsOnTime = mongoose.model('lightsontime', LightsOnTimeSchema);
