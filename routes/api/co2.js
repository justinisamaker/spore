const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load co2 target model
const Co2Target = require('../../models/Co2Target');

// @route   POST /api/co2/setpoint
// @desc    Change the co2 setpoint
// @access  Private
router.post('/setpoint/:targetvalue', passport.authenticate('jwt', { session: false }), (req, res) => {
  const newCo2 = new Co2Target({
    targetvalue: parseInt(req.params.targetvalue)
  });

  global.globalCo2Setpoint = parseInt(req.params.targetvalue);

  newCo2
    .save()
    .then(co2 => res.json(co2))
    .catch(err => console.log(err));
});

// @route   GET /api/co2/setpoint
// @desc    Get the co2 setpoint
// @access  Public
router.get('/setpoint', (req, res) => {
  Co2Target.find()
    .sort({ date: -1 })
    .limit(1)
    .then(co2 => res.json(co2))
    .catch(err => res.status(404).json({ noco2setpoint: 'No co2 setpoint found.'}));
});

module.exports = router;
