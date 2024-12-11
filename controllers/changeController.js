const bcrypt = require('bcryptjs');
const connection = require('../db');
const { hashPassword } = require('../utils/helpers');

const changeUsername = async (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user.userId;

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required' });
  }

  try {
    const [results] = await connection.query('SELECT id FROM users WHERE name = ?', [newUsername]);
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const [updateResult] = await connection.query('UPDATE users SET name = ? WHERE id = ?', [newUsername, userId]);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed to update username' });
    }

    res.status(200).json({ message: 'Username updated successfully', userId });
  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ error: 'Error updating username' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both old and new passwords are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  try {
    const [results] = await connection.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    
    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    const hashedPassword = await hashPassword(newPassword);
    const [updateResult] = await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed to update password' });
    }

    res.status(200).json({ message: 'Password updated successfully', userId });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Error updating password' });
  }
};

module.exports = {
  changeUsername,
  changePassword
};