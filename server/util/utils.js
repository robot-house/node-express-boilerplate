require('dotenv').config();
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { ValidationError } = require('./customError');
const { dbManager: db } = require('../manager');

/** Error checks and validation utils */

/**
 *  Validates model fields.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @returns {Boolean} True if validation is successful,
 *  false (with error response) otherwise.
 */
const fieldValidate = (req, res) => {
  let didValidate = true;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error)[0];
    res.status(400).json({ error: firstError });
    didValidate = false;
  }
  return didValidate;
};

/**
 *  Logs and sends an error along with its error code.
 *
 *  @param {Request} res The request object.
 *  @param {Error} err The caught error.
 */
const handleError = (res, err) => {
  console.error(err.stack);
  const code = err.code ? err.code : 500;
  res.status(code).json({ msg: err.message });
};

/**
 *  Checks whether an error is an Object ID Error.
 *
 *  @param {Response} res The response object.
 *  @param {Error} err The caught error.
 *  @returns {Boolean} True if Object ID Error, false otherwise.
 */
const isObjectIdErr = (res, err) => {
  if (err.kind == 'ObjectId' || err.message.includes('ObjectId')) {
    res.status(400).json({ msg: 'Not a valid ID' });
    return true;
  } else {
    return;
  }
};

/**
 *  Checks whether a queried entry exists.
 *
 *  @param {Object} item The entry to be checked.
 *  @param {String} name A string name used to describe the item.
 *  @returns {Promise} Resolved if entry exists else rejected.
 */
const checkItemExists = (item, name) => {
  return new Promise(function (resolve, reject) {
    item
      ? resolve()
      : reject(
          new ValidationError(
            `${name.charAt(0).toUpperCase() + name.slice(1)} not found`,
            404
          )
        );
  });
};

/** Authentication utils */

/**
 *  Creates a signed JWT and responds with token and user details.
 *
 *  @param {Response} res The response object.
 *  @param {Object} user A user object.
 */
const jwtSign = async (res, user) => {
  //get needed data from user object
  const { _id, fullName, email } = user;
  const payload = {
    user: {
      id: _id,
    },
  };
  //expires in 24 hours
  const expires = 86400;

  //create and send jwt and user details in response
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: expires },
    async (err, token) => {
      if (err) throw err;
      res.json({ token, user: { _id, fullName, email } });
    }
  );
};

module.exports = {
  fieldValidate,
  handleError,
  checkItemExists,
  isObjectIdErr,
  jwtSign,
};
