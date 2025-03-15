import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

function End({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const { reset } = useFormContext();
  const playSound = () => {
    if (soundRef?.current) {
      soundRef.current.currentTime = 0.5; // بازنشانی صدا برای پخش مجدد سریع
      soundRef.current.play().catch(() => {}); // جلوگیری از خطای بلاک شدن در برخی مرورگرها
    }
  };
  useEffect(() => {
    soundRef.current = new Audio('/sound1.mp3'); // مسیر فایل صوتی در public
  }, []);
  return (
    <>
      <div
        className="flex flex-col justify-center items-center h-screen w-full pt-60 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/2.jpg')" }}
      >
        <div className=" relative w-[614px] h-[297px] ">
          <Image
            src={'/images/Frame1.svg'}
            layout="fill"
            objectFit="contain"
            alt={`Gallery Image`}
            quality={100}
          />
        </div>

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
    </>
  );
}

export default End;
