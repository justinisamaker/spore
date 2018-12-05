const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load humidity target model
const HumidityTarget = require('../../models/HumidityTarget');

// @route   POST /api/humidity/setpoint
// @desc    Change the humidity setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newHumidity = new HumidityTarget({
    targetvalue: req.params.targetvalue
  });

  global.globalHumidity = req.params.targetvalue;

  newHumidity
    .save()
    .then(humidity => res.json(humidity))
    .catch(err => console.log(err));
});

// @route   GET /api/humidity/setpoint
// @desc    Get the humidity setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  HumidityTarget.find()
    .sort({ date: -1 })
    .limit(1)
    .then(humidity => res.json(humidity))
    .catch(err => res.status(404).json({ nohumiditysetpoint: 'No humidity setpoint found.'}));
});

module.exports = router;
