import pool from '../../../lib/db.mjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phone, full_name, province, birth_date, categories } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO clup (phone, full_name, province, birth_date, categories) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [phone, full_name, province, birth_date, categories]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert data into the database' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM clup');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data from the database' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
