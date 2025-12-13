const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { signup, login, sendOtp, verifyOtp } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');
const validate = require('../middleware/validate');

router.get('/profile', authenticate, getUserProfile);

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').isMobilePhone().withMessage('Valid phone is required'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post(
  '/send-otp',
  [body('phone').isMobilePhone().withMessage('Valid phone is required')],
  validate,
  sendOtp
);

router.post(
  '/verify-otp',
  [
    body('phone').isMobilePhone().withMessage('Valid phone is required'),
    body('otp').isLength({ min: 4, max: 6 }).withMessage('OTP is required'),
  ],
  validate,
  verifyOtp
);

module.exports = router;
