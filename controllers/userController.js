const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../db');
const { sendOTPEmail } = require('../services/emailService');
const { generateOTP, hashPassword } = require('../utils/helpers');

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const register = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (!validatePassword(password)) {
      return res.status(400).json('Password must be at least 8 characters long and include upper, lower case letters and numbers');
    }

    const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser.length > 0) return res.status(400).json('Email already registered');

    const hashedPassword = await hashPassword(password);

    const [result] = await connection.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', 
      [email, username, hashedPassword]
    );
      
    const otp = generateOTP();
    
    await connection.query(
      'INSERT INTO otp (user_id, otp, expired_at) VALUES (?, ?, ?)', 
      [result.insertId, otp, new Date(Date.now() + 5 * 60 * 1000)]
    );

    sendOTPEmail(email, otp);

    res.status(200).json({
      message: 'Registration successful! Please check your email for OTP.'
    });
  } catch (err) {
    console.error('Error in register:', err.message, err.stack);
    res.status(500).json('Error registering user');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (results.length === 0) return res.status(400).json('User not found');
    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) return res.status(400).json('Invalid password');
    
    const otp = generateOTP();
    
    await connection.query('INSERT INTO otp (user_id, otp, expired_at) VALUES (?, ?, ?)', 
      [user.id, otp, new Date(Date.now() + 5 * 60 * 1000)]);
    
    sendOTPEmail(email, otp);
    
    res.status(200).json({
      message: 'Login successful. OTP sent to your email. Please verify OTP to proceed.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Error logging in');
  }
};

module.exports = {
  register,
  login
};