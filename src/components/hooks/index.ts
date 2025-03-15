
import { getFormBuyPhoneApi, getRegisteredUsersApi, submitFormApi, updateClupApi } from '@/services';
import { FormData1 } from '@/type/type';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData1) => {
      return submitFormApi(data); // فراخوانی تابع ارسال فرم
    },
    onSuccess: () => {
      // در صورت موفقیت می‌توانید کوئری‌ها را بی‌اعتبار کنید یا هر کار دیگری که نیاز دارید
      queryClient.invalidateQueries({ queryKey: ['formData'] }); // اگر نیاز به بی‌اعتبار کردن کوئری خاصی دارید
    },
    onError: (error) => {
      console.error('Error submitting form:', error);
    },
  });
};

export const useRegisteredUsers = () => {
  return useQuery({
    queryKey: ['registeredUsers'], // کلید منحصر به فرد برای کوئری
    queryFn: getRegisteredUsersApi, // فراخوانی تابع API برای دریافت لیست افراد ثبت‌نامی
  });
};



export const useGetFormBuyPhone = (phone: string) => {
  return useQuery({
    queryKey: ['formByPhone', phone], // کلید منحصر به فرد با شماره تلفن
    queryFn: () => getFormBuyPhoneApi(phone), // فراخوانی API و ارسال شماره تلفن
    enabled: !!phone, // بررسی اینکه شماره تلفن وجود داشته باشد
  });
};



export const useUpdateClup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData1 }) => updateClupApi(id, data), // ارسال `id` و `data` به API
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clupData'] });
    },
    onError: (error) => {
      console.error('خطا در به‌روزرسانی داده‌ها:', error);
    },
  });
};