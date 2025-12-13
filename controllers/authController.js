const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { createUser, findUserByEmail } = require('../models/userModel');

// SIGNUP CONTROLLER
const signup = async (req, res) => {
    const { name, email, password, phone } = req.body;
  
    try {
      // 1. Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // 2. Check if phone is verified
      const otpCheck = await pool.query(
        `SELECT * FROM otp_verification 
         WHERE phone = $1 AND is_verified = TRUE 
         ORDER BY created_at DESC LIMIT 1`,
        [phone]
      );
  
      if (otpCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Phone number not verified' });
      }
  
      // 3. Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser(name, email, hashedPassword, phone);
  
      // 4. Optional: Clean up OTP entries for that phone
      await pool.query(`DELETE FROM otp_verification WHERE phone = $1`, [phone]);
  
      res.status(201).json({ 
        message: 'User created successfully', 
        user: { id: newUser.id, email: newUser.email } 
      });
    } catch (err) {
      console.error('Signup Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

// LOGIN CONTROLLER
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = existingUser.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

// SEND OTP CONTROLLER
const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ message: 'Phone number is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await pool.query('INSERT INTO otp_verification (phone, otp) VALUES ($1, $2)', [phone, otp]);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP for ${phone}: ${otp}`);
    }
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
  
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }
  
    try {
      // Check OTP in DB (within 5 minutes)
      const result = await pool.query(
        `SELECT * FROM otp_verification 
         WHERE phone = $1 AND otp = $2 AND created_at >= NOW() - INTERVAL '5 minutes'
         ORDER BY created_at DESC LIMIT 1`,
        [phone, otp]
      );
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // ✅ Mark OTP as verified
      await pool.query(
        `UPDATE otp_verification SET is_verified = TRUE 
         WHERE phone = $1 AND otp = $2`,
        [phone, otp]
      );
  
      res.status(200).json({
        message: 'Phone verified successfully',
        phone,
      });
    } catch (err) {
      console.error('OTP verification failed:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// ✅ Export all at once
module.exports = {
    signup,
    login,
    sendOtp,
    verifyOtp,
  };
  
