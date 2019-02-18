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
const fae = require('./routes/api/fae');
const systemStatus = require('./routes/api/systemStatus');

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
app.use('/api/fae', fae);
app.use('/api/systemstatus', systemStatus);

// Define global variables
global.globalHumidity = null;
global.globalTemperature = null;
global.globalCo2 = null;
global.saveCount = 0;
global.faeOverride = false;

// initialize localstorage vars
let temperatureSetpoint = localStorage.getItem('tempSetpoint');
let humiditySetpoint = localStorage.getItem('humiditySetpoint');
let lightsOnTime = localStorage.getItem('lightsOnTime');
let lightsOffTime = localStorage.getItem('lightsOffTime');
let faeMinute = localStorage.getItem('faeSetpoint');
let faeDuration = localStorage.getItem('faeDuration');
let faeHumidityOffset = localStorage.getItem('faeHumidityOffset');

if(isNaN(temperatureSetpoint) || !temperatureSetpoint){
  localStorage.setItem('tempSetpoint', 60);
  temperatureSetpoint = 60;
} else {
  console.log(`Temperature Setpoint: ${temperatureSetpoint}`);
}

if(isNaN(humiditySetpoint) || !humiditySetpoint){
  localStorage.setItem('humiditySetpoint', 85);
  humiditySetpoint = 85;
} else {
  console.log(`Humidity Setpoint: ${humiditySetpoint}`);
}

if(isNaN(lightsOnTime) || !lightsOnTime){
  localStorage.setItem('lightsOnTime', 6);
  lightsOnTime = 6;
} else {
  console.log(`Lights on time: ${lightsOnTime}`);
}

if(isNaN(lightsOffTime) || !lightsOffTime){
  localStorage.setItem('lightsOffTime', 18);
  lightsOffTime = 18;
} else {
  console.log(`Lights off time: ${lightsOffTime}`);
}

if(isNaN(faeMinute) || !faeMinute){
  localStorage.setItem('faeSetpoint', 20);
  faeMinute = 20;
} else {
  console.log(`FAE Minute: ${faeMinute}`);
}

if(isNaN(faeDuration) || !faeDuration){
  localStorage.setItem('faeDuration', 90000);
  faeDuration = 90000;
} else {
  console.log(`FAE Duration: ${faeDuration}`);
}

if(isNaN(faeHumidityOffset) || !faeHumidityOffset){
  localStorage.setItem('faeHumidityOffset', 60000);
  faeHumidityOffset = 60000;
} else {
  console.log(`FAE Humidity Offest: ${faeHumidityOffset}`);
}

// Start server listening
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Turn all pins off at startup
axios.post(`${ip}/api/outlet/turnoffallpins/0`);

// Set current time
const currentHour = new Date().getHours();

// Check if lights should be on
if(process.env.HAS_LIGHT == 1){
  if(currentHour <= lightsOffTime && currentHour >= lightsOnTime){
    axios.post(`${ip}/api/outlet/lights/0`)
      .then( console.log('Light should be on right now.') );
  } else {
    axios.post(`${ip}/api/outlet/lights/1`)
      .then( console.log('Light should be off right now.') );
  }

  // lights cron
  cron.schedule(`* ${lightsOnTime} * * *`, () => {
    axios.post(`${ip}/api/outlet/lights/0`)
      .then( console.log('Turning lights on for scheduled lightsOnTime.') );
  });

  cron.schedule(`* ${lightsOffTime} * * *`, () => {
    axios.post(`${ip}/api/outlet/lights/1`)
      .then( console.log('Turning lights of for scheduled lightsOffTime.') );
  });
}


// FAE cron
if(process.env.HAS_FAE == 1){
  let faeMinute = parseInt(localStorage.getItem('faeSetpoint'));
  let faeDuration = parseInt(localStorage.getItem('faeDuration'));
  let faeHumidityOffset = parseInt(localStorage.getItem('faeHumidityOffset'));

  cron.schedule(`*/${faeMinute} * * * *`, () => {
    global.faeOverride = true;
    axios.post(`${ip}/api/outlet/fae/0`)
      .then( console.log(`Turning fans on for FAE. Occurs every ${faeMinute} minutes.`));

    setTimeout(() => {
      axios.post(`${ip}/api/outlet/humidifier/0`)
        .then( console.log(`Turning humidifier on during FAE at ${faeHumidityOffset}ms`));
    }, faeHumidityOffset);

    setTimeout(() => {
      axios.post(`${ip}/api/outlet/fae/1`)
        .then( console.log(`Turning FAE fans off after ${faeDuration}ms`))
        .then(global.faeOverride = false);
    }, faeDuration);
  });
}

// Scheduled check for humidity
if(process.env.HAS_DHT22 == 1){
  cron.schedule('*/20 * * * * *', () => {
    axios.post(`${ip}/api/dht22`)
      .then((res) => {
        global.globalHumidity = Math.round(res.data.humidityvalue);
        global.globalTemperature = Math.round(res.data.temperaturevalue);
        let temperatureSetpoint = parseInt(localStorage.getItem('tempSetpoint'));
        let humiditySetpoint = parseInt(localStorage.getItem('humiditySetpoint'));

        if(process.env.HAS_HUMIDIFIER == 1){
          if(!faeOverride){
            if(global.globalHumidity < humiditySetpoint){
              axios.post(`${ip}/api/outlet/fae/1`);
              axios.post(`${ip}/api/outlet/humidifier/0`)
                .then(() => {
                  console.log(`Humidity low at ${global.globalHumidity}%, turning humidifier on`);
                  setTimeout(() => {
                    axios.post(`${ip}/api/outlet/humidifier/1`)
                      .then(
                        console.log('Turning humidifier off after 10 seconds')
                      );
                  }, 10000);
                });
            } else if(global.globalHumidity > humiditySetpoint){
              axios.post(`${ip}/api/outlet/fae/0`);
              axios.post(`${ip}/api/outlet/humidifier/1`)
                .then(
                  console.log(`Humidity high at ${global.globalHumidity}%, turning humidifier off`)
                );
            } else if(global.globalHumidity == humiditySetpoint){
              axios.post(`${ip}/api/outlet/fae/1`);
              axios.post(`${ip}/api/outlet/humidifier/1`)
                .then(
                  console.log(`Humidity stable at ${global.globalHumidity}%, turning humidifier off`)
                );
            } else {
              console.log(`Error in the humidity actions in server.js. Global humidity setpoint is ${humiditySetpoint}%. Humidity read is ${humidityRead}%.`);
            }
          }
        }

        if(process.env.HAS_HEATER == 1){
          if(global.globalTemperature < temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/0`)
              .then(
                console.log(`Temperature low at ${global.globalTemperature}ºF, turning heater on`)
              );
          } else if(global.globalTemperature > temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/1`)
              .then(
                console.log(`Temperature high at ${global.globalTemperature}ºF, turning heater off`)
              );
          } else if(global.globalTemperature == temperatureSetpoint){
            axios.post(`${ip}/api/outlet/heater/1`)
              .then(
                console.log(`Temperature stable at ${global.globalTemperature}ºF, turning heater off`)
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

// System Status cron
cron.schedule('1 * * * * *', () => {
  axios.get(`${ip}/api/systemstatus`)
    .then((res) => {
      console.log(`Current system status is ${res.data}`);
    });
});
