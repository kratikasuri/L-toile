const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware'); // to protect POST
const validate = require('../middleware/validate');

router.get('/', getProducts); // Public route
router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().optional(),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
    body('image_url').optional().isURL().withMessage('image_url must be a URL'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  validate,
  addProduct
); // Protected route (admin/user check can be added later)

module.exports = router;

