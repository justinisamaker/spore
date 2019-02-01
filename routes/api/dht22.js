// get env vars
require('dotenv').load();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dht = require('node-dht-sensor');
const numeral = require('numeral');
const moment = require('moment');

// Load humidity reading model
const Dht22Reading = require('../../models/Dht22Reading');

// @route   POST /api/dht22
// @desc    Take a new relative humidity and temp reading from a DHT22
// @access  Public
router.post('/', (req, res) => {
  dht.read(22, process.env.DHT_PIN, (err, temperature, humidity) => {
    if(!err){
      const newDht22 = new Dht22Reading({
        temperaturevalue: numeral(((temperature * 9/5) + 32)).format('0.0'),
        humidityvalue: numeral(humidity).format('0.0')
      });

      if(global.saveCount === 6){
        newDht22
          .save()
          .then(reading => res.json(reading))
          .then(console.log('saved a new humidity'))
          .catch(err => console.log(err));
      } else {
        res.json(newDht22);
      }
    }
  });
});

// @route   GET /api/dht22
// @desc    Get the latest reading from the DHT22
// @access  Public
router.get('/', (req, res) => {
  Dht22Reading.find()
    .sort({ date: -1 })
    .limit(1)
    .then(reading => res.json(reading))
    .catch(err => res.status(404).json({ nodht22reading: 'There was an error getting the DHT22 reading from the database.'}));
});

// @route   GET /api/dht22/:howMany
// @desc    Get the last X readings from the DHT22
// @access  Public
router.get('/:howMany', (req, res) => {
  Dht22Reading.find()
    .limit(parseInt(req.params.howMany))
    .sort({ date: -1 })
    .then(readings => res.json(readings))
    .catch(err => res.status(404).json({ nodht22reading: 'There was an error getting the DHT22 reading from the database.'}));
});

// @route   GET /api/dht22/last/:unit
// @desc    Get the DHT22 readings from a unit of time (e.g. last/month)
// @access  Public
router.get('/last/:unit', (req, res) => {
  let start = moment().startOf(req.params.unit);
  let end = moment().endOf(req.params.unit);

  Dht22Reading
    .find({
      date: {
        '$gte': start,
        '$lte': end
      }
    })
    .sort({ date: -1 })
    .then(readings => res.json(readings))
    .catch(err => res.status(404).json({ nodht22reading: `There was an error getting the DHT22 reading from the database: ${err}`}));
});


module.exports = router;
