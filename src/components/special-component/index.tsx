import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useRegisteredUsers } from '../hooks';
import { useFormContext } from 'react-hook-form';
type Customer = {
  row: number;
  phone: string;
  province: string;
  categories: string[];
};

const SpecialComponent = ({setStep,setIsSpecialUser}:{setIsSpecialUser: React.Dispatch<React.SetStateAction<boolean>>,setStep: React.Dispatch<React.SetStateAction<number>>}) => {
  const { data,isPending } = useRegisteredUsers(); // دریافت داده‌های خام


  const [customerData, setCustomerData] = useState<Customer[]>([]);

console.log(customerData)


  const {reset} = useFormContext();
    const soundRef = useRef<HTMLAudioElement | null>(null);
    const playSound = () => {
      if (soundRef.current) {
        soundRef.current.currentTime = 0.5; // بازنشانی صدا برای پخش مجدد سریع
        soundRef.current.play().catch(() => {}); // جلوگیری از خطای بلاک شدن در برخی مرورگرها
      }
    };
  
    useEffect(() => {
      soundRef.current = new Audio('/sound1.mp3'); // بارگذاری فایل صوتی در زمان بارگذاری کامپوننت
    }, []);
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedData = data?.map((item, index) => ({
        row: index + 1, // شماره ردیف
        phone: item.phone || 'نامشخص', // در صورت نبود مقدار
        province: item.province || 'نامشخص',
        categories: item.categories || [],
      }));
      setCustomerData(formattedData);
    }
  }, [data]);
  const [phoneSearch, setPhoneSearch] = useState<string>('');
  const [provinceSearch, setProvinceSearch] = useState<string>('');
  const [categorySearch, setCategorySearch] = useState<string>('');

  const filteredCustomerData = customerData.filter((customer) => {
    return (
      customer.phone.includes(phoneSearch) &&
      customer.province.includes(provinceSearch) &&
      customer.categories.some((cat) => cat.includes(categorySearch))
    );
  });

  const categoryCount: { [key: string]: number } = {};
  customerData.forEach((customer) => {
    customer.categories.forEach((category) => {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
  });

  const [categorySearchForSecondTable, setCategorySearchForSecondTable] =
    useState<string>('');

  const filteredCategoryData = Object.entries(categoryCount).filter(
    ([category]) =>
      category
        .toLowerCase()
        .includes(categorySearchForSecondTable.toLowerCase())
  );

  const provinceCategoryCount: { [key: string]: { [key: string]: number } } =
    {};
  customerData.forEach((customer) => {
    if (!provinceCategoryCount[customer.province]) {
      provinceCategoryCount[customer.province] = {};
    }
    customer.categories.forEach((category) => {
      provinceCategoryCount[customer.province][category] =
        (provinceCategoryCount[customer.province][category] || 0) + 1;
    });
  });

  const [provinceSearchForThirdTable, setProvinceSearchForThirdTable] =
    useState<string>('');

  // فیلتر کردن استان‌ها
  const filteredProvinceData = Object.entries(provinceCategoryCount).filter(
    ([province]) =>
      province.toLowerCase().includes(provinceSearchForThirdTable.toLowerCase())
  );

  // برای هر استان، دسته‌بندی با بیشترین تعداد تکرار را پیدا می‌کنیم
  const provinceWithMaxCategory: [
    string,
    { category: string; count: number }
  ][] = filteredProvinceData.map(([province, categoryCounts]) => {
    const maxCategory = Object.entries(categoryCounts).reduce(
      (max, [category, count]) =>
        count > max.count ? { category, count } : max,
      { category: '', count: 0 }
    );
    return [province, maxCategory];
  });
  const downloadExcel = () => {
    const ws1 = XLSX.utils.json_to_sheet(filteredCustomerData.map(customer => ({
      "ردیف": customer.row,
      "شماره تلفن": customer.phone,
      "استان": customer.province,
      "دسته‌های انتخاب‌شده": customer.categories.join('، '),
    })));

    const ws2 = XLSX.utils.json_to_sheet(filteredCategoryData.map(([category, count]) => ({
      "دسته‌بندی": category,
      "تعداد تکرار": count,
    })));

    const ws3 = XLSX.utils.json_to_sheet(provinceWithMaxCategory.map(([province, { category, count }]) => ({
      "استان": province,
      "محبوب‌ترین دسته": category,
      "تعداد": count,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "مشتریان");
    XLSX.utils.book_append_sheet(wb, ws2, "گزارش دسته‌بندی");
    XLSX.utils.book_append_sheet(wb, ws3, "گزارش استان");

    // برای دانلود فایل اکسل
    XLSX.writeFile(wb, 'Customer_Report.xlsx');
  };
  const goBack = () => {
    setIsSpecialUser(false)
    setStep(0)
    playSound()
    reset()
  };
  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col pt-20 items-center min-h-screen bg-gradient-to-r from-indigo-300 to-purple-400 p-8">
      <h2 className="text-4xl font-bold text-white mb-8">
        خلاصه اطلاعات مشتریان
      </h2>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <button
            onClick={goBack}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            برگشت
          </button>

          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            خروجی اکسل
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="جستجو بر اساس شماره موبایل..."
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-right"
          />
          <input
            type="text"
            placeholder="جستجو بر اساس استان..."
            value={provinceSearch}
            onChange={(e) => setProvinceSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-right"
          />
          <input
            type="text"
            placeholder="جستجو بر اساس دسته‌بندی..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-right"
          />
        </div>

        {/* جدول اول */}
        <div>
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
            مشخصات کلی مشتریان
          </h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="px-4 py-3 text-center">ردیف</th>
                <th className="px-4 py-3 text-center">شماره تلفن</th>
                <th className="px-4 py-3 text-center">استان</th>
                <th className="px-4 py-3 text-center">دسته‌های انتخاب‌شده</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomerData.length > 0 ? (
                filteredCustomerData.map((customer, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-indigo-50 transition duration-300"
                  >
                    <td className="px-4 py-3 text-center">{customer.row}</td>
                    <td className="px-4 py-3 text-center">{customer.phone}</td>
                    <td className="px-4 py-3 text-center">
                      {customer.province}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {customer.categories.join('، ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    نتیجه‌ای یافت نشد!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* جدول دوم: گزارش دسته‌بندی */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">
            گزارش دسته‌بندی
          </h3>
          <input
            type="text"
            placeholder="جستجو بر اساس دسته‌بندی..."
            value={categorySearchForSecondTable}
            onChange={(e) => setCategorySearchForSecondTable(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-right mb-4"
          />
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="px-4 py-3 text-center">دسته‌بندی</th>
                <th className="px-4 py-3 text-center">تعداد تکرار</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategoryData.length > 0 ? (
                filteredCategoryData.map(([category, count], index) => (
                  <tr key={index} className="border-b hover:bg-green-50">
                    <td className="px-4 py-3 text-center">{category}</td>
                    <td className="px-4 py-3 text-center">{count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-center text-gray-500"
                  >
                    نتیجه‌ای یافت نشد!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* جدول سوم: گزارش استان */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-red-700 mb-4">
            گزارش استان
          </h3>
          <input
            type="text"
            placeholder="جستجو بر اساس استان..."
            value={provinceSearchForThirdTable}
            onChange={(e) => setProvinceSearchForThirdTable(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-right mb-4"
          />
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-red-100 text-red-800">
                <th className="px-4 py-3 text-center">استان</th>
                <th className="px-4 py-3 text-center">محبوب‌ترین دسته</th>
                <th className="px-4 py-3 text-center">تعداد</th>
              </tr>
            </thead>
            <tbody>
              {provinceWithMaxCategory.length > 0 ? (
                provinceWithMaxCategory.map(
                  ([province, { category, count }], index) => (
                    <tr key={index} className="border-b hover:bg-red-50">
                      <td className="px-4 py-3 text-center">{province}</td>
                      <td className="px-4 py-3 text-center">{category}</td>
                      <td className="px-4 py-3 text-center">{count}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3  text-center text-gray-500"
                  >
                    نتیجه‌ای یافت نشد!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpecialComponent;
