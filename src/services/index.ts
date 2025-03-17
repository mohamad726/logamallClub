import api from '@/config/axiosConfig';
import { FormData1 } from '@/type/type';

export const submitFormApi = async (data: FormData1) => {
  try {
    // ارسال درخواست POST به آدرس endpoint
    const response = await api.post('/clup/', data);
    return response.data; // برگرداندن داده‌های پاسخ به کامپوننت
  } catch (error) {
    console.error('خطا در ارسال داده‌ها:', error);
    throw error; // پرتاب خطا برای مدیریت در سطح کامپوننت
  }
};

export const getRegisteredUsersApi = async () => {
  try {
    const response = await api.get('/clup'); // آدرس API برای دریافت لیست افراد ثبت‌نامی
    return response.data;
  } catch (error) {
    console.error('Fetching registered users failed:', error);
    throw error;
  }
};

export const getFormBuyPhoneApi = async (phone: string) => {
  try {
    const response = await api.get(`/clup?phone=${phone}`); // فیلتر کردن با کوئری
    return response.data;
  } catch (error) {
    throw new Error('خطا در دریافت داده‌ها');
  }
};



export const updateClupApi = async (id:string, data: FormData1) => {
  try {
    // ارسال PUT به آدرس داینامیک با استفاده از `id`
    const response = await api.put(`/clup/${id}`, data); // استفاده از `id` در URL
    return response.data;
  } catch (error) {
    console.error("Clup update failed:", error);
    throw error;
  }
};