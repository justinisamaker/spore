const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load lights on and off time target models
const LightsOnTime = require('../../models/LightsOnTime');
const LightsOffTime = require('../../models/LightsOffTime');

// @route   POST /api/lights/on/time
// @desc    Set the hour that the lights should turn on in 24 hour time
// @access  Private
router.post('/on/:ontime', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newOnTime = new LightsOnTime({
    targetvalue: req.params.ontime
  });

  newOnTime
    .save()
    .then(onTime => res.json(onTime))
    .catch(err => console.log(err));
});

// @route   POST /api/lights/off/time
// @desc    Set the hour that the lights should turn off in 24 hour time
// @access  Private
router.post('/off/:ontime', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newOffTime = new LightsOffTime({
    targetvalue: req.params.ontime
  });

  newOffTime
    .save()
    .then(offTime => res.json(offTime))
    .catch(err => console.log(err));
});

// @route   GET /api/lights/on
// @desc    Get the hour the lights are supposed to turn on
// @access  Public
router.get('/on', (req, res) => {
  LightsOnTime.find()
    .sort({ date: -1 })
    .limit(1)
    .then(lightsOnTime => res.json(lightsOnTime))
    .catch(err => res.status(404).json({ nohlightsontime: 'No turn on time for lights found.'}));
});

// @route   GET /api/lights/off
// @desc    Get the hour the lights are supposed to turn off
// @access  Public
router.get('/off', (req, res) => {
  LightsOffTime.find()
    .sort({ date: -1 })
    .limit(1)
    .then(lightsOffTime => res.json(lightsOffTime))
    .catch(err => res.status(404).json({ nohlightsofftime: 'No turn off time for lights found.'}));
});


module.exports = router;
