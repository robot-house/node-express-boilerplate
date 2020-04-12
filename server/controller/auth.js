require('dotenv').config();
const { UserModel } = require('../model');
const bcrypt = require('bcryptjs');
const { dbManager: db } = require('../manager');
const { fieldValidate, handleError, jwtSign } = require('../util').utils;

/**
 *  Logs a user in.
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

/**
 *  Logs a user out.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 */
const logout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Sign-out successful!' });
};

module.exports = {
  login,
  logout,
};
