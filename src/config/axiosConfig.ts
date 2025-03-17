import axios from 'axios';

const api = axios.create({
  baseURL: 'https://logamall-club.vercel.app/clup/api/', // آدرس سرور خود در ورسل
  timeout: 10000, // Timeout به مدت 10 ثانیه
});

export default api;
