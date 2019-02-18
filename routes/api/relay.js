// get env vars
require('dotenv').load();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Gpio = require('onoff').Gpio;

let pins = {};

// Add pin as new GPIO output if feature flags from dotenv say that we have the feature
process.env.HAS_HUMIDIFIER == 1 ? pins.humidifierPin = new Gpio(process.env.HUMIDIFIER_PIN, 'out') : null;
process.env.HAS_FAE == 1 ? pins.faePin = new Gpio(process.env.FAE_PIN, 'out') : null;
process.env.HAS_CIRCULATION_FAN == 1 ? pins.circulationFanPin = new Gpio(process.env.CIRCULATION_FAN_PIN, 'out') : null;
process.env.HAS_HEATER == 1 ? pins.heaterPin = new Gpio(process.env.HEATER_PIN, 'out') : null;
process.env.HAS_CHILLER == 1 ? pins.chillerPin = new Gpio(process.env.CHILLER_PIN, 'out') : null;
process.env.HAS_LIGHT == 1 ? pins.lightPin = new Gpio(process.env.LIGHT_PIN, 'out') : null;
process.env.HAS_WATER_LEVEL_PUMP == 1 ? pins.waterLevelPumpPin = new Gpio(process.env.WATER_LEVEL_PUMP_PIN, 'out') : null;

// @route   POST /api/outlet/lights
// @desc    Turn lights on or off
// @access  Private
router.post('/:target/:state', (req, res) => {
  let target = req.params.target;
  let state = parseInt(req.params.state);

  let sendRelayResponse = () => {
    res.json({ message: `Relay action: Set ${target} to ${state}`});
  }

  let sendFeatureFlagError = () => {
    res.json({ message: `${target} is not enabled in dotenv feature flags.`});
  }

  switch(target){
    case 'turnoffallpins':
      process.env.HAS_HUMIDIFIER == 1 ? pins.humidifierPin.writeSync(1) : console.log('humidifier not enabled for turnoffallpins');
      process.env.HAS_FAE == 1 ? pins.faePin.writeSync(1) : console.log('fae not enabled for turnoffallpins');
      process.env.HAS_CIRCULATION_FAN == 1 ? pins.circulationFanPin.writeSync(1) : console.log('circulation fan not enabled for turnoffallpins');
      process.env.HAS_HEATER == 1 ? pins.heaterPin.writeSync(1) : console.log('heater not enabled for turnoffallpins');
      process.env.HAS_CHILLER == 1 ? pins.chillerPin.writeSync(1) : console.log('chiller not enabled for turnoffallpins');
     process.env.HAS_LIGHT == 1 ? pins.lightPin.writeSync(1) : console.log('light not enabled for turnoffallpins');
      process.env.HAS_WATER_LEVEL_PUMP == 1 ? pins.waterLevelPumpPin.writeSync(1) : console.log('water level pump not enabled for turnoffallpins');
      break;
    case 'turnonallpins':
      process.env.HAS_HUMIDIFIER == 1 ? pins.humidifierPin.writeSync(0) : console.log('humidifier not enabled for turnoffallpins');
      process.env.HAS_FAE == 1 ? pins.faePin.writeSync(0) : console.log('fae not enabled for turnoffallpins');
      process.env.HAS_CIRCULATION_FAN == 1 ? pins.circulationFanPin.writeSync(1) : console.log('circulation fan not enabled for turnoffallpins');
      process.env.HAS_HEATER == 1 ? pins.heaterPin.writeSync(0) : console.log('heater not enabled for turnoffallpins');
      process.env.HAS_CHILLER == 1 ? pins.chillerPin.writeSync(0) : console.log('chiller not enabled for turnoffallpins');
     process.env.HAS_LIGHT == 1 ? pins.lightPin.writeSync(0) : console.log('light not enabled for turnoffallpins');
      process.env.HAS_WATER_LEVEL_PUMP == 1 ? pins.waterLevelPumpPin.writeSync(0) : console.log('water level pump not enabled for turnoffallpins');
      break;
    case 'humidifier':
      process.env.HAS_HUMIDIFIER == 1 ? pins.humidifierPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'fae':
      process.env.HAS_FAE == 1 ? pins.faePin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'circulation':
      process.env.HAS_CIRCULATION_FAN == 1 ? pins.circulationFanPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'heater':
      process.env.HAS_HEATER == 1 ? pins.heaterPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'chiller':
      process.env.HAS_CHILLER == 1 ? pins.chillerPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'lights':
      process.env.HAS_LIGHT == 1 ? pins.lightPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    case 'waterlevel':
      process.env.HAS_WATER_LEVEL_PUMP == 1 ? pins.waterLevelPumpPin.writeSync(state, () => sendRelayResponse()) : sendFeatureFlagError();
      break;
    default:
      console.log('No pin selected for relay action.');
      break;
  }

  res.json({ message: `Relay action: Set ${target} to ${state}`});
});

module.exports = router;
