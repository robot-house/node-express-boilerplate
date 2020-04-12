require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model');
const { handleError } = require('../util').utils;
const { dbManager: db } = require('../manager');

/**
 *  Middleware to ensure a user is logged in.
 *
 *  @param {Request} req The request object.
 *  @param {Response} res The response object.
 *  @param {Function} next The next function.
 */
const requireLogin = async (req, res, next) => {
  //get token
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied!' });
  } else {
    token = token.replace('Bearer ', '');
  }

  //verify token and get user
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //get user and check exists
    const user = await db.dbFetchById({
      model: UserModel,
      id: decoded.user.id,
      select: ['-password'],
    });

    //check token belongs to user
    if (!user || user.tokens.indexOf(token) <= -1) {
      return res.status(401).json({
        msg: 'Token does not exist for this user, authorization denied!',
      });
    }

    user.tokens = undefined;

    //add user to request object
    req.user = user;

    next();
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  requireLogin,
};
