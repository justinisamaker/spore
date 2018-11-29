// get env vars
require('dotenv').load();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const axios = require('axios');
const cron = require('node-cron');

// Require routes
const users = require('./routes/api/users');
const humidity = require('./routes/api/humidity');

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

// Define global variables
global.globalHumidity = 85;

// Set global variables based on db variables on startup
axios.get('http://127.0.0.1:5000/api/humidity/setpoint')
  .then(res => {
    global.globalHumidity = (res.data[0].targetvalue);
  })
  .catch(err => console.log('Error getting startup global humidity: ' + err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
