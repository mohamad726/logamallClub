import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonserver-peach.vercel.app/', // آدرس سرور شما
  timeout: 10000, // Timeout به مدت 10 ثانیه
});

export default api;
