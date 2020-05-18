const express = require('express');
const { login } = require('../controller').authController;
const { loginValidator } = require('../validator').authValidator;

const router = express.Router();

/** Log user in */
router.post('/auth/login', loginValidator, login);

module.exports = router;
