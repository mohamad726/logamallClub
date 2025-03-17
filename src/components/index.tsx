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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<FormData1> = async (data) => {
    if (isSubmitting) return; // 👈 اگر درخواست قبلی در حال انجام است، منتظر بماند
  
    setIsSubmitting(true);
    setIsSpecialUser(false);
    setPhone(data.phone);
    playSound();
  
    if (data.phone === '09182975917') {
      setIsSpecialUser(true);
      setStep(2);
    } else {
      if (isLoading) {
        console.log('در حال بارگذاری داده‌ها...');
        setIsSubmitting(false);
        return;
      }
  
      if (updatedata && updatedata.length > 0) {
        const userId = updatedata[0].id;
        console.log(updatedata);
        setStep(step + 1);
  
        await UpdateForm({
          id: userId,
          data: data,
        });
  
        setIsSubmitting(false);
        return; // 👈 از اجرای `POST` جلوگیری کن
      }
  
      if (step < 1) {
        setStep(step + 1);
      } else {
        try {
          await mutate(data); // ارسال درخواست `POST`
          console.log('داده‌ها با موفقیت ارسال شدند');
          setStep(step + 1);
        } catch (err) {
          console.error('خطا در ارسال داده‌ها:', err);
        }
      }
    }
  
    setIsSubmitting(false); // بعد از ارسال درخواست، مقدار را `false` کن
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
