const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// @route   POST /api/fae/setpoint
// @desc    Change the fae setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('faeSetpoint', parseInt(req.params.targetvalue));
  res.json(parseInt(req.params.targetvalue));
});

// @route   POST /api/fae/duration
// @desc    Change the fae duration
// @access  Private
router.post('/setpoint/duration/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('faeDuration', parseInt(req.params.targetvalue));
  res.json(parseInt(req.params.targetvalue));
});

// @route   POST /api/fae/humidityoffset
// @desc    Change the time that the humidity turns on during fae
// @access  Private
router.post('/setpoint/humidityoffset/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('faeHumidityOffset', parseInt(req.params.targetvalue));
  res.json(parseInt(req.params.targetvalue));
});

// @route   GET /api/fae/setpoint
// @desc    Get the fae setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  let fae = parseInt(localStorage.getItem('faeSetpoint'));
  res.json(fae);
});

// @route   GET /api/fae/duration
// @desc    Get the fae duration
// @access  Public
router.get('/duration', (req, res) => {
  let fae = parseInt(localStorage.getItem('faeDuration'));
  res.json(fae);
});

// @route   GET /api/fae/humidityoffset
// @desc    Get the duration of the humidifier turning on during FAE
// @access  Public
router.get('/humidityoffset', (req, res) => {
  let fae = parseInt(localStorage.getItem('faeHumidityOffset'));
  res.json(fae);
});

module.exports = router;
