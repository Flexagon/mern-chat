const Validator = require('validator');
const isEmpty = require('../utils/isEmpty');

module.exports = function validateRegisterInput(data) {
  const errors = {};
  let {
    email, name, password, password2,
  } = data;

  email = !isEmpty(email) ? email : '';
  name = !isEmpty(name) ? name : '';
  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

  if (!Validator.isEmail(email))
    errors.email = 'Email is invalid';

  if (Validator.isEmpty(email))
    errors.email = 'Email field is required';

  if (!Validator.isLength(name, { min: 2, max: 30 }))
    errors.name = 'Name must be between 2 and 30 characters';

  if (Validator.isEmpty(name))
    errors.name = 'Name field is required';

  if (Validator.isEmpty(password))
    errors.password = 'Password field is required';

  if (!Validator.isLength(password, { min: 6, max: 30 }))
    errors.password = 'Password must be between 6 and 30 characters';

  if (Validator.isEmpty(password2))
    errors.password2 = 'Confirm Password field is required';

  if (!Validator.equals(password, password2))
    errors.password2 = 'Passwords must mutch';

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
