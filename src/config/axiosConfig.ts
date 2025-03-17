import axios from 'axios';

const api = axios.create({
  baseURL: 'https://logamall-club-v3.vercel.app/', // آدرس سرور شما در ورسل
  timeout: 10000, // Timeout به مدت 10 ثانیه
});

export default api;
