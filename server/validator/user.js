const { check } = require('express-validator');

const registrationValidator = [
  check('username', 'Username is required')
    .not()
    .isEmpty()
    .isLength({
      max: 30,
    })
    .withMessage('Username must be no more than 30 characters'),
  check('firstName', 'First name is required')
    .not()
    .isEmpty()
    .isLength({
      max: 30,
    })
    .withMessage('First name must be no more than 30 characters'),
  check('lastName', 'Last name is required')
    .not()
    .isEmpty()
    .isLength({
      max: 30,
    })
    .withMessage('Last name must be no more than 30 characters'),
  check('email', 'Please include a valid email')
    .isEmail()
    .isLength({
      max: 100,
    })
    .withMessage('Email must be no more than 100 characters'),
  check('password', 'Password is required')
    .not()
    .isEmpty()
    .isLength({
      min: 8,
    })
    .withMessage('Password must be at least 8 characters')
    .isLength({
      max: 30,
    })
    .withMessage('Password must be no more than 30 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one capital letter'),
];

const updateValidator = [
  check('username', 'Username must be no more than 30 characters').isLength({
    max: 30,
  }),
  check('firstName', 'First name must be no more than 30 characters').isLength({
    max: 30,
  }),
  check('lastName', 'Last name must be no more than 30 characters').isLength({
    max: 30,
  }),
];

module.exports = {
  registrationValidator,
  updateValidator,
};
