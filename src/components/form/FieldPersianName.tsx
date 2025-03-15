import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const persianLetters = [
  '⌫',
  'ا',
  'ب',
  'پ',
  'ت',
  'ث',
  'ج',
  'چ',
  'ح',
  'خ',
  'د',
  'ذ',
  'ر',
  'ز',
  'ژ',
  'س',
  'ش',
  'ص',
  'ض',
  'ط',
  'ظ',
  'ع',
  'غ',
  'ف',
  'ق',
  'ک',
  'گ',
  'ل',
  'م',
  'ن',
  '␣',
  'و',
  'ه',
  'ی',
];

const FieldPersianName = () => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0.6;
      soundRef.current.play().catch(() => {});
    }
  };

  const { register, setValue, watch } = useFormContext();
  useEffect(() => {
    soundRef.current = new Audio('/sound.mp3'); // مسیر فایل صوتی در public
  }, []);
  const handleLetterClick = (
    letter: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    playSound();
    event.preventDefault();
    let newName = name;

    // Backspace key behavior
    if (letter === '⌫') {
      newName = name.length > 0 ? name.slice(0, -1) : name;
    }
    // Space key behavior
    else if (letter === '␣') {
      newName = name + ' ';
    }
    // Regular letter
    else {
      newName = name + letter;
    }

    setName(newName);
    setValue('fullName', newName);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      keyboardRef.current &&
      !keyboardRef.current.contains(event.target as Node)
    ) {
      setShowKeyboard(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative shadow flex items-center w-[500px] h-[80px] bg-[#ffffffe6] text-2xl rounded-2xl justify-center py-6 px-4 text-[#6950A1] yekanBold">
      <label htmlFor="fullName" className="whitespace-nowrap p-2">
        نام و نام خانوادگی:
      </label>
      <input
        id="fullName"
        type="text"
        inputMode="text"
        {...register('fullName')}
        className="w-full border p-2 rounded-lg"
        onChange={(e) => {
          setName(e.target.value);
          setValue('fullName', e.target.value);
        }}
        value={watch('fullName') || ''}
        onClick={() => {
          playSound();
          setShowKeyboard(true);
        }}
        ref={inputRef}
      />
      {showKeyboard && (
        <div
          ref={keyboardRef}
          className="absolute mt-2 top-20 bg-white border border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-9 gap-2 z-50"
        >
          {persianLetters.map((letter, index) => (
            <button
              key={letter}
              className={`
                p-3 
                bg-gray-100 
                rounded-lg 
                text-lg 
                font-bold 
                hover:bg-gray-200 
                ${index === 0 ? 'col-span-2' : ''} 
                ${index === persianLetters.length - 4 ? 'col-span-2' : ''}
              `}
              onClick={(e) => handleLetterClick(letter, e)}
            >
              {letter === '␣' ? '⎵' : letter} {/* نمایش نماد فاصله */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldPersianName;
