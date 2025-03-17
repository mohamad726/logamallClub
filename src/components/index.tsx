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
    setIsSpecialUser(false);
    setPhone(data.phone);
    playSound();
  
    if (data.phone === '09182975917') {
      setIsSpecialUser(true);
      setStep(2);
      console.log("کاربر خاص شناسایی شد، ولی ارسال ادامه دارد...");
    }
  
    if (isLoading) {
      console.log('در حال بارگذاری داده‌ها...');
      return;
    }
  
    if (updatedata && updatedata.length > 0) {
      const userId = updatedata[0].id;
      console.log("کاربر موجود است، در حال آپدیت...");
      setStep(step + 1);
      UpdateForm({
        id: userId,
        data: data,
      });
    } else {
      console.log("کاربر جدید است، در حال ارسال اطلاعات...");
      try {
        await mutate(data);
        console.log('داده‌ها با موفقیت ارسال شدند');
        setStep(step + 1);
      } catch (err) {
        console.error('خطا در ارسال داده‌ها:', err);
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
