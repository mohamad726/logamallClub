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
  type UserData = {
    id: string|number;
    phone: string;
    // سایر فیلدها...
  };
  
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
    setIsSpecialUser(false);
    setPhone(data.phone);
    playSound();
  
    if (data.phone === '09182975917') {
      setIsSpecialUser(true);
      setStep(2);
      return;
    }
  
    if (isLoading) {
      console.log('در حال بارگذاری داده‌ها...');
      return;
    }
  
    // بررسی وجود شماره موبایل در `updatedata`
    const existingUser = updatedata?.find((user: UserData) => user.phone === data.phone);

  
    if (existingUser) {
      // شماره موبایل در دیتابیس وجود دارد، پس باید `PUT` اجرا شود
      console.log('شماره موبایل تکراری است. اطلاعات در حال ویرایش...');
      setStep(step + 1);
  
      await UpdateForm({
        id: existingUser.id,
        data: data,
      });
  
      return; // 👈 جلوگیری از اجرای `POST`
    }
  
    // اگر شماره موبایل جدید باشد، درخواست `POST` ارسال شود
    if (step < 1) {
      setStep(step + 1);
    } else {
      try {
        await mutate(data);
        console.log('داده‌ها با موفقیت ارسال شدند');
        setStep(step + 1);
      } catch (err) {
        console.error('خطا در ارسال داده‌ها:', err);
      }
    }
  };
  
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
