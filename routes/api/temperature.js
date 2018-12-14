const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load temperature target model
const TemperatureTarget = require('../../models/TemperatureTarget');

// Load humidity reading model
const Dht22Reading = require('../../models/Dht22Reading');

// @route   POST /api/temperature/setpoint
// @desc    Change the temperature setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newTemperature = new TemperatureTarget({
    targetvalue: parseInt(req.params.targetvalue)
  });

  global.globalTemperature = parseInt(req.params.targetvalue);

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

// @route   GET /api/temperature
// @desc    Get the temperature reading
// @access  Public
router.get('/', (req, res) => {
  Dht22Reading.find()
    .sort({ date: -1 })
    .limit(1)
    .then(reading => res.json(reading[0].temperaturevalue))
    .catch(err => res.status(404).json({ notemperaturereading: 'There was an error getting the latest temperature reading from the database.'}));
});

module.exports = router;
