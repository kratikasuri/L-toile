const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/profile', authenticate, (req, res) => {
  res.status(200).json({
    message: 'You accessed a protected route!',
    userId: req.user.userId,
  });
});

module.exports = router;
