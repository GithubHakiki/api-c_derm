const connection = require('../db');

const logout = async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    await connection.query('INSERT INTO blacklisted_tokens (token) VALUES (?)', [token]);
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error blacklisting token' });
  }
};

module.exports = { 
    logout 
};