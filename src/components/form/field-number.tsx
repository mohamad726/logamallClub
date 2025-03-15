import { FormData1 } from '@/type/type';
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

// لیست اعداد صفحه کلید
const numbers = ['⌫', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];

const FieldNumber = () => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FormData1>();

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.6;
      soundRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    soundRef.current = new Audio('/sound.mp3'); // مسیر فایل صوتی در public
  }, []);

  const handleNumberClick = (
    num: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // جلوگیری از اجرای submit فرم
    playSound();
    let newPhoneNumber = phoneNumber;

    if (num === '⌫') {
      playSound();
      newPhoneNumber =
        phoneNumber.length > 0 ? phoneNumber.slice(0, -1) : phoneNumber;
    } else {
      newPhoneNumber = phoneNumber + num;
    }

    setPhoneNumber(newPhoneNumber);
    setValue('phone', newPhoneNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // استفاده از useEffect برای اطمینان از اینکه کد فقط در کلاینت اجرا شود
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowKeyboard(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl justify-center py-6 px-4 text-[#6950A1] yekanBold"
      ref={inputRef}
    >
      <label htmlFor="phone" className="whitespace-nowrap w-full p-4">
        شماره تلفن:
      </label>
      <input
        // ref به input اضافه شده است
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
        className="w-full text-right"
        onFocus={playSound}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          setValue('phone', e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        value={watch('phone') || ''} // مقدار را از react-hook-form دریافت می‌کند
        onClick={() => setShowKeyboard(true)} // کیبورد در اینجا باز می‌شود
      />
      {errors.phone && (
        <p className="absolute text-red-500 text-xl top-12 mt-2">
          {errors.phone.message as string}
        </p>
      )}
      {/* کیبورد مجازی */}
      {showKeyboard && (
        <div className="absolute -left-52 -top-2  mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 px-4 grid grid-cols-3 gap-2 z-50">
          {numbers.map((num, index) => (
            <button
              key={num}
              className={`
                p-4
                px-6 
                bg-gray-200 
                rounded-lg 
                text-2xl 
                font-bold 
                hover:bg-gray-300 
                transition-all 
                ${index === 10 ? 'col-span-3' : 'w-full'}
                ${index === 0 ? 'col-span-3' : 'w-full'}
              `}
              onClick={(e) => handleNumberClick(num, e)} // ارسال event برای جلوگیری از submit
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldNumber;
