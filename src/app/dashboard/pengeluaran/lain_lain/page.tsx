'use client'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import CardInformation from '@/components/fragments/dashboard/card-information'
import { GraduationCap, SquarePen, Trash2, Users } from 'lucide-react'
import TablePengeluaran from '@/components/fragments/pengeluaran/table'
import TablePengeluaran2 from '@/components/fragments/pengeluaran/table'
import SearchInput from '@/components/fragments/pengeluaran/seraach_andinput'
import { useExpenseModule } from '@/hooks/expense/useExpense'
import dayjs from 'dayjs'

const LainLainPage = () => {
  const [activeTab, setActiveTab] = useState('Lain-Lain')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
    const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const tabs = ['Lain-Lain']
  const subCategoryMap: Record<string, number> = {
    "Lain-Lain":14
  };
  const { useGetExpense } = useExpenseModule()
  const { data: expenses, isLoading, isError } = useGetExpense('Other')
    const normalizeRows = (exp: any) => {
    if (!exp) return [];
    if (Array.isArray(exp)) return exp;
    if (Array.isArray(exp?.data)) return exp.data;
    if (Array.isArray(exp?.data?.data)) return exp.data.data;
    return [];
  };

  const filteredData = useMemo(() => {
          const rows = normalizeRows(expenses);
          const search = searchTerm.toLowerCase();
      
          // 💡 PERBAIKAN: Siapkan tanggal filter dengan waktu yang benar (00:00:00 untuk start, 23:59:59 untuk end)
          const filterStartDayjs = dateFilter.startDate 
            ? dayjs(dateFilter.startDate).startOf('day') 
            : null;
      
          const filterEndDayjs = dateFilter.endDate 
            ? dayjs(dateFilter.endDate).endOf('day') 
            : null;
      
          return rows.filter((item: any) => {
            const matchSearch =
              item?.description?.toLowerCase().includes(search) ||
              item?.PenanggungJawab?.toLowerCase().includes(search) ||
              item?.category?.name?.toLowerCase().includes(search);
      
            const matchTab = item?.subCategoryId === subCategoryMap[activeTab];
      
            const itemDate = dayjs(item.PayDate); // Gunakan dayjs untuk item.createdAt
      
            // 💡 Perbandingan inklusif menggunakan Dayjs plugins
            const matchStart = filterStartDayjs
              ? itemDate.isSameOrAfter(filterStartDayjs) 
              : true;
      
            const matchEnd = filterEndDayjs
              ? itemDate.isSameOrBefore(filterEndDayjs) 
              : true;
      
            return matchSearch && matchTab && matchStart && matchEnd;
          });
        }, [expenses, searchTerm, activeTab, dateFilter]);

  return (
    <div className='min-h-screen flex flex-col gap-10 items-center py-7'>
      <section className='w-full grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Data'}
          value={0}
          icon={<GraduationCap size={32} className='text-blue-500' />}
        />
        <CardInformation
          color={'green'}
          title={'Data Terfilter'}
          value={filteredData.length}
          icon={<Users size={32} className='text-green-500' />}
        />
      </section>
      <div className='w-full max-w-6xl rounded-3xl'>
        <div className='px-3'>
          <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
            Data Pengeluaran Sekolah
          </h1>
          <p className='text-gray-500 mb-6'>
            Data Pengeluaran Sekolah Management.
          </p>
        </div>

        {/* Tabs */}
        <div className='flex flex-col gap-2 p-2'>
          <div className=' flex gap-2 mb-[-7]'>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-medium rounded-t-xl transition-all duration-300 shadow-sm ${activeTab === tab
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'bg-[#dfe6f4] text-gray-600 hover:bg-[#e6ebf7]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className='bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl'>
            {/* Search */}
            <SearchInput
              onChange={(e: any) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />
            {isLoading ? (
              <p className='text-center text-gray-500 py-6'>Memuat data...</p>
            ) : isError ? (
              <p className='text-center text-red-500 py-6'>
                Gagal memuat data pengeluaran.
              </p>
            ) : filteredData.length === 0 ? (
              <p className='text-center text-gray-400 py-6'>
                Tidak ada data ditemukan.
              </p>
            ) : (
              <TablePengeluaran title='Pengeluaran Lainnya' data={filteredData} menu={'lain_lain'} />
            )}
            {/* Pagination */}
            <div className='flex justify-center items-center gap-2 mt-6'>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${currentPage === num
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-blue-50'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LainLainPage
