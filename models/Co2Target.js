const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Co2TargetSchema = new Schema({
  targetvalue: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Co2Target = mongoose.model('co2target', Co2TargetSchema);
