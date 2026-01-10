const pool = require('../config/db');

const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
};

const createProduct = async ({ name, description, price, image_url, stock, category}) => {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, image_url, stock, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, image_url, stock, category]
    );
    return result.rows[0];
  };
  

module.exports = {
  getAllProducts,
  createProduct
};
