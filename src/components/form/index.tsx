import { FormData1 } from '@/type/type';
import React, { useState, useRef } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Image from 'next/image';

const provincesList = [
  'تهران', 'اصفهان', 'خراسان رضوی', 'فارس', 'آذربایجان شرقی', 'مازندران', 
  'کردستان', 'سیستان و بلوچستان', 'کرمان', 'خوزستان', 'لرستان', 'قزوین', 
  'گلستان', 'همدان', 'کرمانشاه', 'مرکزی', 'آذربایجان غربی', 'اردبیل', 
  'بوشهر', 'کهگیلویه و بویراحمد', 'البرز', 'یزد', 'قم', 'خراسان شمالی', 
  'ایلام', 'چهارمحال و بختیاری', 'زنجان', 'سمنان', 'کاشان', 'مهران', 
  'مشهد', 'خراسان جنوبی'
];

const Form = ({ onSubmit }: { onSubmit: SubmitHandler<FormData1> }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState<string[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useFormContext<FormData1>();

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.6;
      soundRef.current.play().catch(() => {});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound();
    const value = e.target.value;
    setInputValue(value);

    const filteredResults = provincesList.filter((province) =>
      province.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProvinces(filteredResults);
  };

  const handleProvinceSelect = (province: string) => {
    setValue('province', province);
    playSound();
    setInputValue(province);
    setFilteredProvinces([]);
  };

  const handleDateChange = (date: DateObject | null) => {
    playSound();
    if (date) {
      setValue('birthDate', `${date.year}/${date.month}/${date.day}`, {
        shouldValidate: false,
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center pt-[240px] w-[1080px] h-[1920px] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/1.png')" }}
    >
      <div className="relative w-[714px] h-[178px]">
        <Image src={'/images/Frame.svg'} layout="fill" objectFit="contain" alt="Gallery Image" quality={100} />
      </div>

      <form className="mt-24 flex flex-col gap-14" onSubmit={handleSubmit(onSubmit)}>
        {/* شماره تلفن */}
        <div className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl justify-center py-6 px-4 text-[#6950A1] yekanBold">
          <label htmlFor="phone" className="whitespace-nowrap w-full p-4">شماره تلفن:</label>
          <input
            id="phone"
            type="tel"
            autoFocus
            inputMode="tel"
            {...register('phone', {
              required: 'شماره تلفن الزامی است',
              pattern: {
                value: /^09[0-9]{8,9}$/,
                message: 'لطفاً شماره تلفن معتبر وارد کنید.',
              },
            })}
            className="w-full"
            onFocus={playSound}
          />
          {errors.phone && <p className="absolute text-red-500 text-xl top-12 mt-2">{errors.phone.message as string}</p>}
        </div>

        {/* نام و نام خانوادگی */}
        <div className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl justify-center py-6 px-4 text-[#6950A1] yekanBold">
          <label htmlFor="fullName" className="whitespace-nowrap w-full p-4">نام و نام‌خانوادگی:</label>
          <input
            type="text"
            inputMode="text"
            {...register('fullName')}
            className="w-full"
            onFocus={playSound}
          />
        </div>

        {/* تاریخ تولد */}
        <div className="relative shadow flex justify-between items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl py-6 px-4 text-[#6950A1] yekanBold">
          <label className="whitespace-nowrap w-1/3 p-4">تاریخ تولد:</label>
          <DatePicker
            onChange={handleDateChange}
            calendar={persian}
            locale={persian_fa}
            inputClass="py-2.5 px-3.5 rounded-md w-full border outline-none bg-white text-center"
            maxDate={new DateObject().subtract(5, 'year')}
            currentDate={new DateObject().subtract(5, 'year')}
            containerStyle={{ width: '40%' }}
          />
        </div>

        {/* استان */}
        <div className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl py-6 px-4 text-[#6950A1] yekanBold">
          <label className="whitespace-nowrap w-full p-4">استان خود را وارد کنید:</label>
          <input
            type="text"
            inputMode="text"
            {...register('province')}
            value={inputValue}
            onChange={handleInputChange}
            className="w-full bg-white rounded-lg px-4 py-2 shadowInput"
            onFocus={playSound}
          />
          {filteredProvinces.length > 0 && (
            <ul className="absolute top-[85%] w-[95%] bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10">
              {filteredProvinces.map((province, index) => (
                <li key={index} className="p-2 hover:bg-purple-100 cursor-pointer" onClick={() => handleProvinceSelect(province)}>
                  {province}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* دکمه ثبت */}
        <div className="flex justify-center">
          <button type="submit" className="shadowBtn p-3 w-[254px] h-[88px] rounded-2xl mt-10 bg-orange-500 text-white hover:bg-orange-600 text-4xl">
            ثبت و عضویت
          </button>
        </div>
      </form>

      {/* تگ صوتی */}
      <audio ref={soundRef} src="/sound.mp3" preload="auto"></audio>
    </div>
  );
};

export default Form;
