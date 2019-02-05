const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route   GET /api/systemstatus
// @desc    Get the fae setpoint
// @access  Public
router.get('/', (req, res) => {
  let humiditySetpoint = parseInt(localStorage.getItem('humiditySetpoint'));
  let temperatureSetpoint = parseInt(localStorage.getItem('tempSetpoint'));

  let humidityDiff = Math.abs(global.globalHumidity - humiditySetpoint);
  let temperatureDiff = Math.abs(global.globalTemperature - temperatureSetpoint);

  if( humidityDiff <= 5 && temperatureDiff <= 5 ){
    res.json('stable');
  } else {
    res.json('adjusting');
  }
});

module.exports = router;
