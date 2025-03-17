import pool from './db.js'; // وارد کردن اتصال پایگاه داده

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS clup (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) UNIQUE NOT NULL,
      full_name VARCHAR(100),
      province VARCHAR(50),
      birth_date DATE,
      categories TEXT[]
    );
  `;

  try {
    await pool.query(query);
    console.log('✅ جدول `clup` با موفقیت ایجاد شد.');
  } catch (error) {
    console.error('❌ خطا در ایجاد جدول:', error);
  } finally {
    pool.end();
  }
};

createTable();
