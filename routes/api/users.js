const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load user model
const User = require('../../models/User');

// Load validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   POST /users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  // check if user already registered with this e-mail
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route   POST /users/login
// @desc    Login User / returning JWT token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check if user actually exists
      if(!user){
        errors.email = 'User not found.';
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // User matched, create JWT payload
            const payload = {
              id: user.id,
              name: user.name,
            };

            // Sign the token, set to expire in 12 hours
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 43200 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
      });
  });
});

module.exports = router;
