require('dotenv').config();
const { UserModel } = require('../model');
const bcrypt = require('bcryptjs');
const { dbManager: db } = require('../manager');
const { fieldValidate, handleError, jwtSign } = require('../util').utils;

/**
 *  Logs a user in. Token will expire in 24 hours.
 *  To log a user out, remove token from local storage on the front end.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @returns {Response} Returns error response early if error.
 */
const login = async (req, res) => {
  if (!fieldValidate(req, res)) return;

  const { email, password } = req.body;

  try {
    let user = await db.dbFetchByfield({
      model: UserModel,
      fieldValue: email,
      fieldName: 'email',
    });
    if (!user) {
      console.log(user);
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    //sign and respond
    jwtSign(res, user);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  login,
};
