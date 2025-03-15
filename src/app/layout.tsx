'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify'; // وارد کردن ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // استایل لازم برای توست‌ها
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="fa" dir="rtl" className="font-regular">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>

        <ToastContainer 
  position="top-right" 
  autoClose={3000} 
  hideProgressBar={false}  // نمایان کردن نوار پیشرفت
  newestOnTop={true}  // نمایش آخرین توست‌ها در بالای سایرین
  closeOnClick={true}  // بسته شدن با کلیک روی توست
  rtl={true}  // پشتیبانی از زبان راست به چپ (مناسب برای فارسی)
  pauseOnFocusLoss={false}  // توقف هنگام از دست دادن فوکوس
  draggable={false}  // غیر فعال کردن درگ
  theme="colored"  // استفاده از تم رنگی
/>
      </body>
    </html>
  );
}
