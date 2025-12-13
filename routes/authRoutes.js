const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { sendOtp } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOtp);


module.exports = router;
