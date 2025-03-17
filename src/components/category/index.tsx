import { FormData1 } from '@/type/type';
import React, { useState, useEffect, useRef } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useGetFormBuyPhone } from '../hooks';
import Image from 'next/image';
type UserData = {
  id: string|number;
  phone: string;
  // سایر فیلدها...
};

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(watch('categories') || []);
  const { data: updatedata } = useGetFormBuyPhone(watch('phone')); // داده‌ها را از API می‌گیریم
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.5; // بازنشانی صدا برای پخش مجدد سریع
      soundRef.current.play().catch(() => {}); // جلوگیری از خطای بلاک شدن در برخی مرورگرها
    }
  };

  useEffect(() => {
    soundRef.current = new Audio('/sound1.mp3'); // بارگذاری فایل صوتی در زمان بارگذاری کامپوننت
  }, []); // فقط یک‌بار در ابتدا بارگذاری می‌شود

  // استفاده از useEffect برای بروزرسانی مقادیر پیش‌فرض دسته‌بندی‌ها
  useEffect(() => {
    console.log('Updated Data:', updatedata); // برای دیباگ داده‌ها

    // جستجو برای شماره موبایل در داده‌ها
    const existingUser = updatedata?.find((user: UserData) => user.phone === watch('phone'));

    if (existingUser && existingUser.categories) {
      setSelectedCategories(existingUser.categories);
      setValue('categories', existingUser.categories); // بروزرسانی فیلد فرم
    }
  }, [updatedata, setValue, watch]);

  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    setValue('categories', updatedCategories); // بروزرسانی فیلد فرم
    playSound(); // فراخوانی برای پخش صدا
  };

  return (
    <div
      className="flex flex-col items-center h-screen w-full pt-60 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/darak.jpg')" }}
    >
      <div className=" relative w-[858px] h-[192px] ">
        <Image
          src={'/images/Frame.svg'}
          layout="fill"
          objectFit="contain"
          alt={`Gallery Image`}
          quality={100}
        />
      </div>

      {/* لیست دسته‌بندی‌ها */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-14 mt-[136px] ">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={` text-4xl text-center whitespace-nowrap shadowItem yekanBold rounded-lg shadow transition w-[443px] h-[80px] py-3 ${
              selectedCategories.includes(category)
                ? 'bg-orange-500 text-white'
                : 'bg-[#ffffffd9]  text-[#6950A1]'
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
          className={`w-[303px] h-[88px] mt-[136px] rounded-lg text-4xl yekanBold  shadow-lg transition ${
            selectedCategories.length > 0
              ? 'bg-orange-500 text-white '
              : 'bg-[#e9e9e9c5]  text-[#6950A1] cursor-not-allowed'
          }`}
          disabled={selectedCategories.length === 0}
          onClick={handleSubmit(onSubmit)}
        >
          ثبت علاقه‌مندی‌ها
        </button>

        <button
          onClick={() => {
            setStep(0);
            playSound();
            reset();
          }}
          className=" bf- bg-[#c9b3b3d9]  text-[#6950A1]  w-[303px] h-[88px] mt-[136px] rounded-lg text-4xl yekanBold  shadow-lg transition"
        >
          بازگشت
        </button>
      </div>
    </div>
  );
};

export default Category;
