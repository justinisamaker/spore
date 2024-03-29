const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if(!Validator.isLength(data.name, { min: 2, max: 30})){
    errors.name = 'Name must be between 2 and 30 characters.';
  }

  if(Validator.isEmpty(data.name)){
    errors.name = 'Name field is required.';
  }

  if(!Validator.isEmail(data.email)){
    errors.email = 'Email is invalid.';
  }

  if(!Validator.isLength(data.username, { min: 3, max: 20})){
    errors.name = 'Username must be between 3 and 20 characters.';
  }

  if(Validator.isEmpty(data.username)){
    errors.username = 'Username field is required.';
  }

  if(!Validator.isAlphanumeric(data.username)){
    errors.username = 'Username may only contain letters and numbers.';
  }

  if(Validator.isEmpty(data.password)){
    errors.password = 'Password field is required.';
  }

  if(!Validator.isLength(data.password, {min: 6, max: 30})){
    errors.password = 'Password must contain between 6 and 30 characters.';
  }

  if(Validator.isEmpty(data.password2)){
    errors.password2 = 'Confirm password field is required.';
  }

  if(!Validator.equals(data.password, data.password2)){
    errors.password2 = 'Passwords must match.';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}
