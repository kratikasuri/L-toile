const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: 'User created', user: { id: newUser.id, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const pool = require('../config/db');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = existingUser.rows[0];

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = { signup, login };
// ✅ Generate and store OTP
exports.sendOtp = async (req, res) => {
    const { phone } = req.body;
  
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  
    try {
      // Store OTP in DB
      await pool.query(
        'INSERT INTO otp_verification (phone, otp) VALUES ($1, $2)',
        [phone, otp]
      );
  
      // Simulate sending OTP (for now)
      console.log(`OTP for ${phone}: ${otp}`);
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Error sending OTP:', err);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  };