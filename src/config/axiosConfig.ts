import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // در محیط توسعه از localhost و در Vercel از آدرس API استفاده شود
  timeout: 10000,
});

export default api;
