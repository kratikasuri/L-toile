// controllers/userController.js
const pool = require('../config/db');

const getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query('SELECT id, name, email, phone FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserProfile };
