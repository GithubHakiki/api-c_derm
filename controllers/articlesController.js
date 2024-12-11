const connection = require('../db');

const getArticles = async (req, res) => {
  const query = `
    SELECT article_id, title, author, source_name, publication_date, abstract, category, source_type, url, created_at
    FROM articles
  `;

  try {
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ message: 'Database query failed' });
  }
};

module.exports = {
  getArticles,
};