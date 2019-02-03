// get env vars
require('dotenv').load();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');
const cron = require('node-cron');

// GPIO setup for debugging LED
const Gpio = require('onoff').Gpio;
const debugLed = new Gpio(26, 'out');

// Require routes
const users = require('./routes/api/users');
const humidity = require('./routes/api/humidity');
const temperature = require('./routes/api/temperature');
const co2 = require('./routes/api/co2');
const dht22 = require('./routes/api/dht22');
const relay = require('./routes/api/relay');
const lights = require('./routes/api/lights');

const app = express();

const ip = 'http://127.0.0.1:3001';

// localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./localdata');
}

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport.js')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to mongodb
mongoose
  .connect(db, { dbName: process.env.DB_NAME, useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use routes
app.use('/users', users);
app.use('/api/humidity', humidity);
app.use('/api/temperature', temperature);
app.use('/api/co2', co2);
app.use('/api/dht22', dht22);
app.use('/api/outlet', relay);
app.use('/api/lights', lights);

// Define global variables
global.globalHumidity = null;
global.globalTemperature = null;
global.globalCo2 = null;
global.globalCo2Setpoint = null;
global.saveCount = 0;
global.lightsOnTime = 0;
global.lightsOffTime = 0;

// initialize localstorage vars
let temperatureSetpoint = parseInt(localStorage.getItem('tempSetpoint'));
let humiditySetpoint = parseInt(localStorage.getItem('humiditySetpoint'));

if(temperatureSetpoint == null){ temperatureSetpoint = 70; };
if(humiditySetpoint == null){ humiditySetpoint = 85; };

// Set current time
const currentHour = new Date().getHours();

// Set global variables based on db variables on startup
axios.get(`${ip}/api/humidity/setpoint`)
  .then(res => {
    global.globalHumiditySetpoint = (res.data[0].targetvalue);
  })
  .catch(err => console.log('Error getting startup global humidity: ' + err));

axios.get(`${ip}/api/co2/setpoint`)
  .then(res => {
    global.globalCo2Setpoint = (res.data[0].targetvalue);
  })
  .catch(err => console.log('Error getting startup global Co2: ' + err));

// Start server listening
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Turn all pins off at startup
axios.post(`${ip}/api/outlet/turnoffallpins/0`);

// Get light times, and then check if the lights should be on
axios.get(`${ip}/api/lights/on`)
  .then(res => {
    global.lightsOnTime = (res.data[0].targetvalue);
  })
  .catch(err => console.log('Error getting startup global lights on time: ' + err));

axios.get(`${ip}/api/lights/off`)
  .then(res => {
    global.lightsOffTime = (res.data[0].targetvalue);

    if(currentHour <= global.lightsOffTime && currentHour >= global.lightsOnTime){
      console.log('turning lights on');
      axios.post(`${ip}/api/outlet/lights/0`);
    } else {
      console.log(`${currentHour}: lights shouldnt be on : ${global.lightsOnTime} : ${global.lightsOffTime}`);
    }
  })
  .catch(err => console.log('Error getting startup global lights of time: ' + err));

// Scheduled check for humidity
if(process.env.HAS_DHT22 == 1){
  cron.schedule('*/10 * * * * *', () => {
    axios.post(`${ip}/api/dht22`)
      .then((res) => {
        let humidityRead = Math.round(res.data.humidityvalue);
        let temperatureRead = Math.round(res.data.temperaturevalue);
        let temperatureSetpoint = parseInt(localStorage.getItem('tempSetpoint'));
        let humiditySetpoint = parseInt(localStorage.getItem('humiditySetpoint'));

        if(process.env.HAS_HUMIDIFIER == 1){
          if(humidityRead < humiditySetpoint){
            axios.post(`${ip}/api/outlet/humidifier/0`)
              .then(
                console.log(`Humidity low at ${humidityRead}%, turning humidifier on`)
              );
          } else if(humidityRead > humiditySetpoint){
            axios.post(`${ip}/api/outlet/humidifier/1`)
              .then(
                console.log(`Humidity high at ${humidityRead}%, turning humidifier off`)
              );
          } else if(humidityRead == humiditySetpoint){
            axios.post(`${ip}/api/outlet/humidifier/1`)
              .then(
                console.log(`Humidity stable at ${humidityRead}%, turning humidifier off`)
              );
          } else {
            console.log(`Error in the humidity actions in server.js. Global humidity setpoint is ${humiditySetpoint}%. Humidity read is ${humidityRead}%.`);
          }
        }

        if(process.env.HAS_HEATER == 1){
          if(temperatureRead < temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/0`)
              .then(
                console.log(`Temperature low at ${temperatureRead}ºF, turning heater on`)
              );
          } else if(temperatureRead > temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/1`)
              .then(
                console.log(`Temperature high at ${temperatureRead}ºF, turning heater off`)
              );
          } else if(temperatureRead == temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/1`)
              .then(
                console.log(`Temperature stable at ${temperatureRead}ºF, turning heater off`)
              );
          } else {
            console.log(`Error in the temperature actions in server.js. Global temperature setpoint is ${temperatureSetpoint}ºF. Temperature read is ${temperatureRead}ºF.`);
          }
        }

        if(global.saveCount !== 6){
          global.saveCount++;
        } else {
          global.saveCount = 0;
        }
      });
  });
}
