import pool from '../../../../lib/db.mjs';

export default async function handler(req, res) {
  const { id } = req.query; // `id` رو از `req.query` بگیر
  
  if (!id) {
    return res.status(400).json({ error: 'Missing ID parameter' });
  }

  if (req.method === 'PUT') {
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
