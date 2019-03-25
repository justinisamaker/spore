const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const moment = require('moment');

// Load humidity reading model
const Dht22Reading = require('../../models/Dht22Reading');
const HumiditySetpoint = require('../../models/HumiditySetpoint');

// @route   POST /api/humidity/setpoint
// @desc    Change the humidity setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('humiditySetpoint', parseInt(req.params.targetvalue));
  const newHumiditySetpoint = new HumiditySetpoint({
    humiditysetpointvalue: req.params.targetvalue
  });

  newHumiditySetpoint
    .save()
    .then(res.json(parseInt(req.params.targetvalue)));
});

// @route   GET /api/humidity/setpoint
// @desc    Get the humidity setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  HumiditySetpoint.find()
    .sort({ date: -1 })
    .limit(1)
    .then(reading => res.json(reading[0].humiditysetpointvalue))
    .catch(err => res.status(404).json({ nohumiditysetpoint: 'There was an error getting the humidity setpoint from the database.'}));
});

// @route   GET /api/humidity
// @desc    Get the humidity reading
// @access  Public
router.get('/', (req, res) => {
  Dht22Reading.find()
    .sort({ date: -1 })
    .limit(1)
    .then(reading => res.json(reading[0].humidityvalue))
    .catch(err => res.status(404).json({ nohumidityreading: 'There was an error getting the latest humidity reading from the database.'}));
});

module.exports = router;
