import { FormData1 } from '@/type/type';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const provincesList = [
  'تهران',
  'اصفهان',
  'خراسان رضوی',
  'فارس',
  'آذربایجان شرقی',
  'مازندران',
  'کردستان',
  'سیستان و بلوچستان',
  'کرمان',
  'خوزستان',
  'لرستان',
  'قزوین',
  'گلستان',
  'همدان',
  'کرمانشاه',
  'مرکزی',
  'آذربایجان غربی',
  'اردبیل',
  'بوشهر',
  'کهگیلویه و بویراحمد',
  'البرز',
  'یزد',
  'قم',
  'خراسان شمالی',
  'ایلام',
  'چهارمحال و بختیاری',
  'زنجان',
  'سمنان',
  'کاشان',
  'مهران',
  'مشهد',
  'خراسان جنوبی',
];

const FieldProvinces = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredProvinces, setFilteredProvinces] = useState<string[]>([]);

  const { register, setValue } = useFormContext<FormData1>();

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const provinceRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    soundRef.current = new Audio('/sound.mp3'); // مسیر فایل صوتی در public
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        provinceRef.current &&
        !provinceRef.current.contains(event.target as Node)
      ) {
        setFilteredProvinces([]); // بستن لیست
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleInputFocus = () => {
    playSound();
    setFilteredProvinces(provincesList);
  };

  return (
    <div
      ref={provinceRef}
      className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl py-6 px-4 text-[#6950A1] yekanBold"
    >
      <label className="whitespace-nowrap w-full p-4">
        استان خود را وارد کنید:
      </label>
      <input
        type="text"
        inputMode="text"
        {...register('province')}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="w-full bg-white rounded-lg px-4 py-2 shadowInput"
      />
      {filteredProvinces.length > 0 && (
        <ul className="absolute top-[85%] w-[95%] bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10">
          {filteredProvinces.map((province, index) => (
            <li
              key={index}
              className="p-2 hover:bg-purple-100 cursor-pointer"
              onClick={() => handleProvinceSelect(province)}
            >
              {province}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FieldProvinces;
