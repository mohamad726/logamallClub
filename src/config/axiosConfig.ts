import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // آدرس سرور شما
  timeout: 10000, // Timeout به مدت 10 ثانیه
});

export default api;
