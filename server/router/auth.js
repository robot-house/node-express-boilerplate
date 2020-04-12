const express = require('express');
const { login, logout } = require('../controller').authController;
const { requireLogin } = require('../middleware').authMiddleware;
const { loginValidator } = require('../validator').authValidator;

const router = express.Router();

/** Log user in */
router.post('/auth/login', loginValidator, login);

/** Log user out */
router.post('/auth/logout', requireLogin, logout);

module.exports = router;
