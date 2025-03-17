import pool from './db.js'; // اتصال به پایگاه داده

const insertData = async () => {
  const query = `
    INSERT INTO clup (phone, full_name, province, birth_date, categories)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  // نمونه داده
  const values = [
    '09218756005', // phone
    'علیرضا رحمانی', // full_name
    'تهران', // province
    '1378/05/15', // birth_date
    ['عطر و لوازم آرایشی بهداشتی', 'لوازم خانه و آشپزخانه'], // categories
  ];

  try {
    const res = await pool.query(query, values);
    console.log(`✅ داده جدید با ID ${res.rows[0].id} اضافه شد.`);
  } catch (error) {
    console.error('❌ خطا در اضافه کردن داده:', error);
  } finally {
    pool.end();
  }
};

insertData();
