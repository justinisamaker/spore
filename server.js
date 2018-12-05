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
const dht22 = require('./routes/api/dht22');

const app = express();

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
app.use('/api/dht22', dht22);

// Define global variables
global.globalHumidity = 85;
global.saveCount = 0;

// Set global variables based on db variables on startup
axios.get('http://127.0.0.1:3001/api/humidity/setpoint')
  .then(res => {
    global.globalHumidity = (res.data[0].targetvalue);
  })
  .catch(err => console.log('Error getting startup global humidity: ' + err));

// Start server listening
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Scheduled check for humidity
cron.schedule('*/10 * * * * *', () => {
  axios.post('http://127.0.0.1:3001/api/dht22')
    .then((res) => {
      if(process.env.DEBUG === 'TRUE'){
        let humidityRead = res.data.humidityvalue;
        let temperatureRead = res.data.temperaturevalue;
        console.log(`humidity: ${humidityRead} || temperature: ${temperatureRead}`);

        (humidityRead <= global.globalHumidity) ? debugLed.writeSync(1) : debugLed.writeSync(0);
      }

      if(global.saveCount !== 6){
        global.saveCount++;
      } else {
        global.saveCount = 0;
      }
    });
});
