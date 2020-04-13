require('dotenv').config();
const { UserModel } = require('../model');
const bcrypt = require('bcryptjs');
const { dbManager: db } = require('../manager');
const {
  fieldValidate,
  handleError,
  checkItemExists,
  isObjectIdErr,
  jwtSign,
} = require('../util').utils;

/**
 *  Fetches all User objects in collection
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @returns {Response} Returns error response early if error.
 */
const getUsers = async (req, res) => {
  try {
    //get all users
    const users = await db.dbFetchAll({
      model: UserModel,
      select: ['-password', '-tokens'],
    });

    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 *  Fetches specific User object filtered on ID.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 */
const getUser = async (req, res) => {
  try {
    //get user
    const user = await db.dbFetchById({
      model: UserModel,
      id: req.params.user_id,
      select: ['-password', '-tokens'],
    });

    //make sure user exists
    await checkItemExists(user, 'user');

    res.json(user);
  } catch (err) {
    if (isObjectIdErr(res, err)) return;
    handleError(res, err);
  }
};

/**
 *  Fetches the user object for the currently logged in user.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 */
const getCurrentUser = (req, res) => {
  const user = req.user;
  res.json(user);
};

/**
 *  Registers a user.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @returns {Response} Returns error response early if error.
 */
const register = async (req, res) => {
  //check that all fields validate
  if (!fieldValidate(req, res)) return;

  const { username, firstName, lastName, email, password } = req.body;

  try {
    //check to see if email address has already been used
    let user = await db.dbFetchByfield({
      model: UserModel,
      fieldValue: email,
      fieldName: 'email',
    });
    if (user) {
      return res
        .status(409)
        .json({ errors: [{ msg: 'Email address already in use' }] });
    }

    //create new user object
    user = new UserModel({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    //get salt and hash user password with given salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //sign and respond
    jwtSign(res, user);
  } catch (err) {
    handleError(res, err);
  }
};

/**
 *  Updates a user's data.
 *  POST object must contain only fields to be updated.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @returns {Response} Returns error response early if error.
 */
const updateUser = async (req, res) => {
  //check that all fields validate
  if (!fieldValidate(req, res)) return;

  try {
    //get user and check exists
    const user = await db.dbFetchById({
      model: UserModel,
      id: req.user._id,
    });
    await checkItemExists(user, 'user');

    //check and return error if attempt has been made to update email/password
    //this must be done elsewhere with relevant checks
    if ('password' in req.body || 'email' in req.body) {
      return res.status(403).json({
        errors: [{ msg: 'Email and/or password update is forbidden here' }],
      });
    }

    //update given user fields
    for (let attribute in user) {
      if (req.body[attribute]) {
        user[attribute] = req.body[attribute];
      }
    }
    user.meta.whenModified = Date.now();

    await db.dbSave({ item: user });

    //remove users hashed password
    user.password = undefined;
    user.tokens = undefined;

    res.json({ user });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  register,
  updateUser,
};
