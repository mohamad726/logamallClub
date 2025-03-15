// 'use client'
// import React, { useEffect, useRef, useState } from 'react';
// import { useRegisteredUsers } from '../hooks';
// import * as XLSX from 'xlsx';
// import { useFormContext } from 'react-hook-form';
// import { FormData1 } from '@/type/type';
// interface User {
//   id: string;
//   phone: string;
//   fullName: string;
//   birthDate: string;
//   province: string;
//   categories: string[];
// }
// interface CategoryCount {
//   [key: string]: {
//     count: number;
//   };
// }
// const SpecialComponent = ({setStep,setIsSpecialUser}:{setIsSpecialUser: React.Dispatch<React.SetStateAction<boolean>>,setStep: React.Dispatch<React.SetStateAction<number>>}) => {
//   const { data, isLoading } = useRegisteredUsers();
//   const [userSearchQuery, setUserSearchQuery] = useState('');
//   const [categorySearchQuery, setCategorySearchQuery] = useState('');
//   const [provinceSearchQuery, setProvinceSearchQuery] = useState('');
//   const soundRef = useRef<HTMLAudioElement | null>(null);
//     const {reset} = useFormContext<FormData1>();
//   const playSound = () => {
//     if (soundRef.current) {
//       soundRef.current.currentTime = 0.5; // بازنشانی صدا برای پخش مجدد سریع
//       soundRef.current.play().catch(() => {}); // جلوگیری از خطای بلاک شدن در برخی مرورگرها
//     }
//   };

//   useEffect(() => {
//     soundRef.current = new Audio('/sound1.mp3'); // بارگذاری فایل صوتی در زمان بارگذاری کامپوننت
//   }, []); // فقط یک‌بار در ابتدا بارگذاری می‌شود
//   const handleExportToExcel = () => {
//     const dataWithCategoriesAsColumns = data.map((item:User) => {

//       const categoriesObj = item.categories.reduce((acc, category, index) => {
//         acc[`category_${index + 1}`] = category;
//         return acc;
//       }, {} as Record<string, string>);

//       return { ...item, ...categoriesObj };
//     });

//     const categoryProvinceCounts = data.reduce((acc: CategoryCount, item: User) => {
//       // اطمینان از اینکه categories همیشه آرایه است
//       const categories = item.categories || [];  // اگر categories وجود نداشت، یک آرایه خالی در نظر بگیریم
    
//       categories.forEach((category) => {
//         if (!acc[category]) {
//           acc[category] = { count: 0 }; // اگر این دسته‌بندی وجود ندارد، مقدار اولیه برای آن قرار داده می‌شود
//         }
//         acc[category].count += 1; // تعداد تکرار این دسته‌بندی را افزایش می‌دهیم
//       });
    
//       return acc;
//     }, {});
    
//     const categoryCountArray = Object.entries(categoryProvinceCounts).map(
//       ([category, details]) => ({
//         category,
//         count: (details as { count: number }).count, // تبدیل `details` به `{ count: number }`
//       })
//     );
//     const ws = XLSX.utils.json_to_sheet(dataWithCategoriesAsColumns);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

//     const summaryData = categoryCountArray.map((item) => ({
//       دسته‌بندی: item.category,
//       'تعداد تکرار': item.count,
//     }));

//     const summarySheet = XLSX.utils.json_to_sheet(summaryData);
//     XLSX.utils.book_append_sheet(wb, summarySheet, 'Category Summary');

//     XLSX.writeFile(wb, 'users_data_with_summary.xlsx');
//   };

//   if (isLoading) {
//     return <div className="text-center p-6">در حال بارگذاری...</div>;
//   }

//   if (!data) {
//     return (
//       <div className="text-center p-6">هیچ داده‌ای برای نمایش وجود ندارد.</div>
//     );
//   }
//   const categoryProvinceCounts = data.reduce((acc: CategoryCount, item: User) => {
//     (item.categories || []).forEach((category) => {
//       if (!acc[category]) {
//         acc[category] = { count: 0 }; // اگر این دسته‌بندی وجود ندارد، مقدار اولیه برای آن قرار داده می‌شود
//       }
//       acc[category].count += 1; // تعداد تکرار این دسته‌بندی را افزایش می‌دهیم
//     });
//     return acc;
//   }, {});
  

//   const categoryCountArray = Object.entries(categoryProvinceCounts).map(
//     ([category, details]) => ({
//       category,
//       count: (details as { count: number }).count, // تبدیل `details` به `{ count: number }`
//     })
//   );

//   // فیلتر کردن لیست کاربران
//   const filteredUsers = data.filter(
//     (item:User) =>
//       item.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//       item.phone.includes(userSearchQuery) ||
//       item.province.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
//       item.categories.some((category) =>
//         category.toLowerCase().includes(userSearchQuery.toLowerCase())
//       )
//   );

//   // فیلتر کردن خلاصه دسته‌بندی‌ها
//   const filteredCategories = categoryCountArray.filter(
//     (item) =>
//       item.category.toLowerCase().includes(categorySearchQuery.toLowerCase())
//   );

//   // محاسبه تعداد تکرار استان‌ها
//   const provinceCategoryCounts = data.reduce((acc, item:User) => {
//     if (!acc[item.province]) {
//       acc[item.province] = {};
//     }
//     item.categories.forEach((category) => {
//       if (!acc[item.province][category]) {
//         acc[item.province][category] = 0;
//       }
//       acc[item.province][category] += 1;
//     });
//     return acc;
//   }, {});

//   // پیدا کردن دسته‌بندی پرطرفدارترین برای هر استان
//   const provinceWithMostPopularCategory = Object.entries(provinceCategoryCounts).map(
//     ([province, categories]) => {
//       const mostPopularCategory = Object.entries(categories as User).reduce(
//         (max, [category, count]) => {
//           if (count > max.count) {
//             return { category, count };
//           }
//           return max;
//         },
//         { category: '', count: 0 }
//       );
//       return { province, mostPopularCategory };
//     }
//   );

//   // فیلتر کردن استان‌ها
//   const filteredProvinces = provinceWithMostPopularCategory.filter(
//     (item) =>
//       item.province.toLowerCase().includes(provinceSearchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-green-200 p-6">
//       <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
//         {/* هدر و دکمه دانلود اکسل */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-green-600">
//             خوش آمدید، شما یک کاربر ویژه هستید!
//           </h2>
//           <button
//             onClick={handleExportToExcel}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
//           >
//             دانلود اکسل
//           </button>
//           <button
//   onClick={() => {setIsSpecialUser(false);setStep(0); playSound();reset() }}
//   className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 mt-4"
// >
//   بازگشت
// </button>
//         </div>

//         {/* لیست کاربران با فیلتر */}
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-center text-green-600 mb-2">
//             لیست کاربران ({filteredUsers.length} نفر یافت شد)
//           </h3>

//           {/* باکس جستجو برای لیست کاربران */}
//           <input
//             type="text"
//             placeholder="جستجو در کاربران..."
//             value={userSearchQuery}
//             onChange={(e) => setUserSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none mb-4"
//           />

//           <div className="overflow-y-auto max-h-[50vh]">
//             <ul className="space-y-2 bg-amber-300 p-4 rounded-lg">
//               {filteredUsers.map((item:User, index:number) => (
//                 <li key={index} className="p-2 bg-gray-100 rounded-lg">
//                   <p className="font-bold text-gray-800">
//                     نام: {item.fullName}
//                   </p>
//                   <p className="text-gray-600">تلفن: {item.phone}</p>
//                   <p className="text-gray-600">استان: {item.province}</p>
//                   <p className="text-gray-600">
//                     تاریخ تولد: {item.birthDate || 'نامشخص'}
//                   </p>
//                   <p className="text-gray-600">
//                     دسته‌بندی‌ها: {item.categories.join(', ')}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* خلاصه دسته‌بندی‌ها */}
//         <div>
//           <h3 className="text-xl font-semibold text-center text-green-600 mb-2">
//             خلاصه دسته‌بندی‌ها
//           </h3>

//           {/* باکس جستجو برای دسته‌بندی‌ها */}
//           <input
//             type="text"
//             placeholder="جستجو در دسته‌بندی‌ها..."
//             value={categorySearchQuery}
//             onChange={(e) => setCategorySearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none mb-4"
//           />

//           <div className="w-full mb-8">
//             <h4 className="font-semibold text-center text-green-600 mb-4">
//               دسته‌بندی‌ها
//             </h4>
//             <ul className="space-y-2 bg-amber-300 p-4 rounded-lg">
//               {filteredCategories.map((item, index) => (
//                 <li key={index} className="p-2 bg-gray-100 rounded-lg">
//                   <p className="font-bold text-gray-800">{item.category}</p>
//                   <p className="text-gray-600">تعداد تکرار: {item.count}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* خلاصه استان‌ها */}
//         <div>
//           <h3 className="text-xl font-semibold text-center text-green-600 mb-2">
//             خلاصه استان‌ها
//           </h3>

//           {/* باکس جستجو برای استان‌ها */}
//           <input
//             type="text"
//             placeholder="جستجو در استان‌ها..."
//             value={provinceSearchQuery}
//             onChange={(e) => setProvinceSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none mb-4"
//           />

//           <div className="overflow-y-auto max-h-[50vh]">
//             <ul className="space-y-2 bg-amber-300 p-4 rounded-lg">
//               {filteredProvinces.map((item, index) => (
//                 <li key={index} className="p-2 bg-gray-100 rounded-lg">
//                   <p className="font-bold text-gray-800">{item.province}</p>
//                   <p className="text-gray-600">
//                     دسته‌بندی محبوب: {item.mostPopularCategory.category}
//                   </p>
//                   <p className="text-gray-600">
//                     تعداد تکرار در این دسته‌بندی: {item.mostPopularCategory.count}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpecialComponent;
