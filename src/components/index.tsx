'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Form from './form';
import Category from './category';
import End from './end';
import SpecialComponent from './special-component';
import { useCreateForm, useGetFormBuyPhone, useUpdateClup } from './hooks';
import { FormData1 } from '@/type/type';

const Home = () => {
  // ایجاد ref برای صدای تایپ
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // تابع پخش صدا هنگام تایپ

  const [step, setStep] = useState<number>(0);
  const [phone, setPhone] = useState<string>('');
  const [isSpecialUser, setIsSpecialUser] = useState<boolean>(false);
  const { mutate } = useCreateForm();
  const methods = useForm<FormData>();
  const { data: updatedata, isLoading } = useGetFormBuyPhone(phone);

  const { mutate: UpdateForm } = useUpdateClup();
  const playSound = () => {
    if (soundRef?.current) {
      soundRef.current.currentTime = 0.5; // بازنشانی صدا برای پخش مجدد سریع
      soundRef.current.play().catch(() => {}); // جلوگیری از خطای بلاک شدن در برخی مرورگرها
    }
  };
  useEffect(() => {
    soundRef.current = new Audio('/sound1.mp3'); // مسیر فایل صوتی در public
  }, []);
  const onSubmit: SubmitHandler<FormData1> = async (data) => {
    updatedata('updatedata',updatedata)
    setIsSpecialUser(false);
    setPhone(data.phone);
    playSound();
    // بررسی شماره موبایل خاص (مثال: 09182975917)
    if (data.phone === '09182975917') {
      setIsSpecialUser(true);
      setStep(2); // هدایت به مرحله 2 برای کاربر خاص
    } else {
      // اگر داده‌ها هنوز در حال بارگذاری هستند، منتظر می‌مانیم
      if (isLoading) {
        console.log('در حال بارگذاری داده‌ها...');
        return;
      }

      if (updatedata && updatedata.length > 0) {
        // اگر شماره موبایل تکراری باشد
        // آپدیت اطلاعات موجود
        const userId = updatedata[0].id; // استخراج id از اولین عنصر داده‌ها
        console.log(updatedata);
        setStep(step + 1);
        // ارسال `id` داینامیک و داده‌ها به سرور
        UpdateForm({
          id: userId, // استفاده از `id` داینامیک
          data: data,
        });
      } else {
        if (step < 1) {
          // اگر شماره موبایل جدید باشد، مرحله اول را نشان می‌دهیم
          setStep(step + 1);
        } else {
          // شماره موبایل جدید است، ارسال درخواست
          try {
            await mutate(data); // ارسال درخواست برای شماره موبایل جدید
            console.log('داده‌ها با موفقیت ارسال شدند');
            setStep(step + 1); // تغییر مرحله
          } catch (err) {
            console.error('خطا در ارسال داده‌ها:', err);
          }
        }
      }
    }
  };
  console.log(isSpecialUser);
  return (
    <div className="flex justify-center  items-center w-full h-screen bg-gray-600">
      <FormProvider {...methods}>
        {isSpecialUser ? (
          <SpecialComponent
            setStep={setStep}
            setIsSpecialUser={setIsSpecialUser}
          />
        ) : step === 0 ? (
          <Form onSubmit={onSubmit} />
        ) : step === 1 ? (
          <Category onSubmit={onSubmit} setStep={setStep} />
        ) : (
          <End setStep={setStep} />
        )}
      </FormProvider>
    </div>
  );
};

export default Home;
