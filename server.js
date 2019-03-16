// get env vars
require('dotenv').load();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');
const cron = require('node-cron');

// Axios setup
const axiosConfig = {
  proxy:{
    host: '127.0.0.1',
    port: 3001
  }
};

const axiosInstance = axios.create(axiosConfig);

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

// let ip;
// if(process.env.NODE_ENV === 'production'){
//   ip = process.env.IP;
// } else {
//   ip = 'http://localhost:3001';
// }

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

// Serve static assets if in prod
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('/api', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

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


temperatureSetpoint = (temperatureSetpoint == null ? 70 : parseInt(temperatureSetpoint));
humiditySetpoint = (humiditySetpoint == null ? 85 : parseInt(humiditySetpoint));
lightsOnTime = (lightsOnTime == null ? 6 : parseInt(lightsOnTime));
lightsOffTime = (lightsOffTime == null ? 18 : parseInt(lightsOffTime));
faeMinute = (faeMinute == null ? 10 : parseInt(faeMinute));
faeDuration = (faeDuration == null ? 90000 : parseInt(faeDuration));
faeHumidityOffset = (faeHumidityOffset == null ? 60000 : parseInt(faeHumidityOffset));

// Set current time
const currentHour = new Date().getHours();

// Start server listening
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Turn all pins off at startup
if(process.env.NODE_ENV !== 'production'){
  axiosInstance.post(`/api/outlet/turnoffallpins/0`);
}

// FAE cron
if(process.env.NODE_ENV !== 'production'){
  if(process.env.HAS_FAE == 1){
    let faeMinute = parseInt(localStorage.getItem('faeSetpoint'));
    let faeDuration = parseInt(localStorage.getItem('faeDuration'));
    let faeHumidityOffset = parseInt(localStorage.getItem('faeHumidityOffset'));

    cron.schedule(`*/${faeMinute} * * * *`, () => {
      global.faeOverride = true;
      axiosInstance.post(`/api/outlet/fae/0`)
        .then( console.log(`Turning fans on for FAE. Occurs every ${faeMinute} minutes.`));

      setTimeout(() => {
        axiosInstance.post(`/api/outlet/humidifier/0`)
          .then( console.log(`Turning humidifier on during FAE at ${faeHumidityOffset}ms`));
      }, faeHumidityOffset);

      setTimeout(() => {
        axiosInstance.post(`/api/outlet/fae/1`)
          .then( console.log(`Turning FAE fans off after ${faeDuration}ms`))
          .then(global.faeOverride = false);
      }, faeDuration);
    });
  }
}

// Scheduled check for humidity
if(process.env.NODE_ENV !== 'production'){
  if(process.env.HAS_DHT22 == 1){
    cron.schedule('*/10 * * * * *', () => {
      axiosInstance.post(`/api/dht22`)
        .then((res) => {
          global.globalHumidity = Math.round(res.data.humidityvalue);
          global.globalTemperature = Math.round(res.data.temperaturevalue);
          let temperatureSetpoint = parseInt(localStorage.getItem('tempSetpoint'));
          let humiditySetpoint = parseInt(localStorage.getItem('humiditySetpoint'));

          if(process.env.HAS_HUMIDIFIER == 1){
            if(!faeOverride){
              if(global.globalHumidity < humiditySetpoint){
                axiosInstance.post(`/api/outlet/fae/1`);
                axiosInstance.post(`/api/outlet/humidifier/0`)
                  .then(
                    console.log(`Humidity low at ${global.globalHumidity}%, turning humidifier on`)
                  );
              } else if(global.globalHumidity > humiditySetpoint){
                axiosInstance.post(`/api/outlet/fae/0`);
                axiosInstance.post(`/api/outlet/humidifier/1`)
                  .then(
                    console.log(`Humidity high at ${global.globalHumidity}%, turning humidifier off`)
                  );
              } else if(global.globalHumidity == humiditySetpoint){
                axiosInstance.post(`/api/outlet/fae/1`);
                axiosInstance.post(`/api/outlet/humidifier/1`)
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
              axiosInstance.post(`/api/outlet/heater/0`)
                .then(
                  console.log(`Temperature low at ${global.globalTemperature}ºF, turning heater on`)
                );
            } else if(global.globalTemperature > temperatureSetpoint){
              axiosInstance.post(`/api/outlet/heater/1`)
                .then(
                  console.log(`Temperature high at ${global.globalTemperature}ºF, turning heater off`)
                );
            } else if(global.globalTemperature == temperatureSetpoint){
              axiosInstance.post(`/api/outlet/heater/1`)
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
}

// System Status cron
cron.schedule('1 * * * * *', () => {
  axiosInstance.get(`/api/systemstatus`)
    .then((res) => {
      console.log(`Current system status is ${res.data}`);
    });
});
