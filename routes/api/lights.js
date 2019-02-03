const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// @route   POST /api/lights/on/time
// @desc    Set the hour that the lights should turn on in 24 hour time
// @access  Private
router.post('/on/:ontime', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('lightsOnTime', parseInt(req.params.ontime));
  res.json(parseInt(req.params.ontime));
});

// @route   POST /api/lights/off/time
// @desc    Set the hour that the lights should turn off in 24 hour time
// @access  Private
router.post('/off/:offtime', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('lightsOffTime', parseInt(req.params.offtime));
  res.json(parseInt(req.params.offtime));
});

// @route   GET /api/lights/on
// @desc    Get the hour the lights are supposed to turn on
// @access  Public
router.get('/on', (req, res) => {
  let lightsOnTime = parseInt(localStorage.getItem('lightsOnTime'));
  res.json(lightsOnTime);
});

// @route   GET /api/lights/off
// @desc    Get the hour the lights are supposed to turn off
// @access  Public
router.get('/off', (req, res) => {
  let lightsOffTime = parseInt(localStorage.getItem('lightsOffTime'));
  res.json(lightsOffTime);
});


module.exports = router;
