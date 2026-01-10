// routes/categoryRoutes.js

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryControllers');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

// Protected route to add category
router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().optional(),
  ],
  validate,
  createCategory
);

// Public route to fetch all categories
router.get('/', getAllCategories);

module.exports = router;
