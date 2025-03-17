import pool from '../../lib/db.mjs';

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
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { phone, full_name, province, birth_date, categories } = req.body;

    try {
      const result = await pool.query(
        'UPDATE clup SET phone = $1, full_name = $2, province = $3, birth_date = $4, categories = $5 WHERE id = $6 RETURNING *',
        [phone, full_name, province, birth_date, categories, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Record not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update data in the database' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
