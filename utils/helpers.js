const bcrypt = require('bcryptjs');

// Fungsi untuk menghasilkan OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Fungsi untuk meng-hash password
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) reject(err);
      resolve(hashedPassword);
    });
  });
};

module.exports = {
  generateOTP,
  hashPassword
};
