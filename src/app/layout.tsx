'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

      </body>
    </html>
  );
}
