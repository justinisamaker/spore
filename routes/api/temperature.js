const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load humidity reading model
const Dht22Reading = require('../../models/Dht22Reading');

// @route   POST /api/temperature/setpoint
// @desc    Change the temperature setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('tempSetpoint', parseInt(req.params.targetvalue));
  res.json(parseInt(req.params.targetvalue));
});

// @route   GET /api/temperature/setpoint
// @desc    Get the temperature setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  let temperature = parseInt(localStorage.getItem('tempSetpoint'));
  res.json(temperature);
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
