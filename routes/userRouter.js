require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware untuk autentikasi token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(403).json('Access denied. No token provided.');

  // Menggunakan JWT_SECRET dari file .env
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json('Invalid or expired token.');

    req.user = user;  // Menyimpan informasi user di request object
    next();
  });
};

// Endpoint untuk mendapatkan data user
router.get('/user', authenticateJWT, (req, res) => {
  const user = req.user;  // Mendapatkan user dari JWT token
  if (user) {
    res.json({ username: user.username, email: user.email });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Endpoint untuk mengganti username dan password
router.put('/user/update', authenticateJWT, async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  // Validasi input
  if (!username && (!oldPassword || !newPassword)) {
    return res.status(400).json('Please provide either username or both old and new password to update.');
  }

  try {
    // Update username jika ada
    if (username) {
      // Simulasi update username (ganti dengan logika database)
      // await UserModel.update({ username }, { where: { id: req.user.id } });
    }

    // Update password jika ada
    if (oldPassword && newPassword) {
      const user = req.user; // Ambil data user dari token
      // Simulasi pengecekan password lama (gunakan bcrypt untuk validasi password)
      // const isMatch = await bcrypt.compare(oldPassword, user.password);
      
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password di database
        // await UserModel.update({ password: hashedPassword }, { where: { id: user.id } });
      } else {
        return res.status(400).json('Old password is incorrect.');
      }
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json('Error updating user.');
  }
});

module.exports = router;
