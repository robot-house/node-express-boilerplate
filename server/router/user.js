const express = require('express');
const {
  getUsers,
  getUser,
  getCurrentUser,
  register,
  updateUser,
} = require('../controller').userController;
const {
  registrationValidator,
  updateValidator,
} = require('../validator').userValidator;
const { requireLogin } = require('../middleware').authMiddleware;

const router = express.Router();

/** Get all Users */
router.get('/users', requireLogin, getUsers); // this can require super user privileges once they exist

/** Get logged in User */
router.get('/user/current', requireLogin, getCurrentUser);

/** Get User */
router.get('/user/:user_id', requireLogin, getUser);

/** Register User */
router.post('/user/register', registrationValidator, register);

/** Update logged in User */
router.put('/user/update', requireLogin, updateValidator, updateUser);

module.exports = router;
