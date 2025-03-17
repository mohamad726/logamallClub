import 'dotenv/config'; // برای بارگذاری متغیرهای محیطی
import pkg from 'pg';  // وارد کردن پکیج `pg` به صورت پیش‌فرض
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // از متغیر محیطی DATABASE_URL استفاده کن
  ssl: { rejectUnauthorized: false }
});

export default pool;
