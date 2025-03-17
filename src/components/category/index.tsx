'use client';

import { FormData1 } from '@/type/type';
import React, { useState, useEffect, useRef } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useGetFormBuyPhone } from '../hooks';
import Image from 'next/image';

const categories = [
  'لوازم خانه و آشپزخانه',
  'عطر و لوازم آرایشی بهداشتی',
  'پوشاک، فشن و اکسسوری',
  'ابزارآلات و تجهیزات برقی',
  'کفش و لباس ورزشی',
  'لوازم کمپینگ و سفر',
  'سیسمونی نوزاد',
  'لوازم ورزش و تندرستی',
  'اسباب بازی و لوازم کودک',
  'صنایع دستی و بومی محلی',
  'صوتی تصویری',
  'دکوراسیون خانه و حیاط',
];

const Category = ({
  onSubmit,
  setStep,
}: {
  onSubmit: SubmitHandler<FormData1>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { setValue, watch, handleSubmit, reset } = useFormContext<FormData1>();
  const { data: updatedata } = useGetFormBuyPhone(watch('phone'));
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // مقدار اولیه دسته‌بندی‌های انتخابی بر اساس داده‌های قبلی
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    soundRef.current = new Audio('/sound1.mp3');
  }, []);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.5;
      soundRef.current.play().catch(() => {});
    }
  };

  // وقتی `updatedata` تغییر کند، مقدار دسته‌بندی‌ها را تنظیم کن
  useEffect(() => {
    if (updatedata && updatedata.length > 0 && updatedata[0].categories) {
      setSelectedCategories(updatedata[0].categories);
      setValue('categories', updatedata[0].categories);
    }
  }, [updatedata, setValue]);

  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    setValue('categories', updatedCategories);
    playSound();
  };

  return (
    <div
      className="flex flex-col items-center h-screen w-full pt-60 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/darak.jpg')" }}
    >
      <div className="relative w-[858px] h-[192px]">
        <Image
          src={'/images/Frame.svg'}
          layout="fill"
          objectFit="contain"
          alt="Gallery Image"
          quality={100}
        />
      </div>

      {/* لیست دسته‌بندی‌ها */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-14 mt-[136px]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`text-4xl text-center whitespace-nowrap shadowItem yekanBold rounded-lg shadow transition w-[443px] h-[80px] py-3 ${
              selectedCategories.includes(category)
                ? 'bg-orange-500 text-white'
                : 'bg-[#ffffffd9] text-[#6950A1]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {/* دکمه ثبت */}
        <button
          type="submit"
          className={`w-[303px] h-[88px] mt-[136px] rounded-lg text-4xl yekanBold shadow-lg transition ${
            selectedCategories.length > 0
              ? 'bg-orange-500 text-white'
              : 'bg-[#e9e9e9c5] text-[#6950A1] cursor-not-allowed'
          }`}
          disabled={selectedCategories.length === 0}
          onClick={handleSubmit(onSubmit)}
        >
          ثبت علاقه‌مندی‌ها
        </button>

        {/* دکمه بازگشت */}
        <button
          onClick={() => {
            setStep(0);
            playSound();
            reset();
          }}
          className="bg-[#c9b3b3d9] text-[#6950A1] w-[303px] h-[88px] mt-[136px] rounded-lg text-4xl yekanBold shadow-lg transition"
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default Category;
