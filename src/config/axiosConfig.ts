import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/', // از URL محیطی یا محلی استفاده کنید
  timeout: 10000, // Timeout به مدت 10 ثانیه
});

export default api;
