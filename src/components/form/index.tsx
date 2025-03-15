import { FormData1 } from '@/type/type';
import React, { useRef } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Image from 'next/image';
import FieldNumber from './field-number';
import FieldProvinces from './field-provinces';
import FieldPersianName from './FieldPersianName';

const Form = ({ onSubmit }: { onSubmit: SubmitHandler<FormData1> }) => {
  const { handleSubmit, setValue } = useFormContext<FormData1>();

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.6;
      soundRef.current.play().catch(() => {});
    }
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
      className="flex flex-col items-center h-screen w-full pt-60 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/1.png')" }}
    >
      <div className="relative w-[714px] h-[178px]">
        <Image
          src={'/images/Frame.svg'}
          layout="fill"
          objectFit="contain"
          alt="Gallery Image"
          quality={100}
        />
      </div>
      <form
        className="mt-24 flex flex-col gap-14"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* شماره تلفن */}
        <FieldNumber />

        {/* نام و نام خانوادگی */}
        <FieldPersianName />

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

        <FieldProvinces />
        {/* دکمه ثبت */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="shadowBtn p-3 w-[254px] h-[88px] rounded-2xl mt-10 bg-orange-500 text-white hover:bg-orange-600 text-4xl"
          >
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
