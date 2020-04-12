const { check } = require('express-validator');

const loginValidator = [
  check('email', 'Email is required')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Please include a valid email')
    .isLength({
      max: 100,
    })
    .withMessage('email must be no more than 100 characters'),
  check('password', 'Password is required')
    .not()
    .isEmpty()
    .isLength({
      max: 30,
    })
    .withMessage('Password must be no more than 30 characters'),
];

module.exports = { loginValidator };
