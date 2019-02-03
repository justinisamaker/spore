const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// @route   POST /api/co2/setpoint
// @desc    Change the co2 setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  localStorage.setItem('co2Setpoint', parseInt(req.params.targetvalue));
  res.json(parseInt(req.params.targetvalue));
});

// @route   GET /api/co2/setpoint
// @desc    Get the co2 setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  let co2 = parseInt(localStorage.getItem('co2Setpoint'));
  res.json(co2);
});

module.exports = router;
