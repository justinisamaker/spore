const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load temperature target model
const TemperatureTarget = require('../../models/TemperatureTarget');

// @route   POST /api/temperature/setpoint
// @desc    Change the temperature setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newTemperature = new TemperatureTarget({
    targetvalue: req.params.targetvalue
  });

  global.globalTemperature = req.params.targetvalue;

  newTemperature
    .save()
    .then(temperature => res.json(temperature))
    .catch(err => console.log(err));
});

// @route   GET /api/temperature/setpoint
// @desc    Get the temperature setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  TemperatureTarget.find()
    .sort({ date: -1 })
    .limit(1)
    .then(temperature => res.json(temperature))
    .catch(err => res.status(404).json({ notemperaturesetpoint: 'No temperature setpoint found.'}));
});

module.exports = router;
