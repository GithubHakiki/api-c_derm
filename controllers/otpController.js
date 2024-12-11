require('dotenv').config();
const connection = require('../db');
const jwt = require('jsonwebtoken');

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [otpResults] = await connection.query(
      'SELECT * FROM otp JOIN users ON otp.user_id = users.id WHERE users.email = ? AND otp.otp = ? AND otp.expired_at > NOW() AND otp.is_verified = FALSE',
      [email, otp]
    );

    if (otpResults.length === 0) {
      return res.status(400).json('Invalid OTP or OTP expired');
    }

    const user = otpResults[0];

    await connection.query(
      'UPDATE otp SET is_verified = TRUE WHERE user_id = ? AND otp = ?',
      [user.user_id, otp]
    );

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'OTP verified successfully',
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Error verifying OTP');
  }
};

module.exports = {
  verifyOtp
};