const { getAllProducts, createProduct } = require('../models/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, image_url, stock, category } = req.body;
  console.log('payload', req.body);
  try {
    const product = await createProduct({ name, description, price, image_url, stock, category });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};
