'use client'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import CardInformation from '@/components/fragments/dashboard/card-information'
import { GraduationCap, SquarePen, Trash2, Users } from 'lucide-react'
import TablePengeluaran from '@/components/fragments/pengeluaran/table'
import TablePengeluaran2 from '@/components/fragments/pengeluaran/table2'
import SearchInput from '@/components/fragments/pengeluaran/seraach_andinput'
import { useExpenseModule } from '@/hooks/expense/useExpense'
// import SearchInput2 from "@/components/fragments/pengeluaran/seraach_andinput2";

const BiayaMakanPage = () => {
  const [activeTab, setActiveTab] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const tabs = ['Semua']
  const { useGetExpense } = useExpenseModule()
  const { data: expenses } = useGetExpense('Makan')
  // console.log(expenses)
  const data = [
    {
      id: 1,
      tanggal: '2025-10-29',
      nama: 'Bayar Listrik',
      penanggungJawab: 'Pak Dimas',
      kategori: 'Pemeliharaan',
      jumlah: 500000,
      status: 'Selesai'
    },
    {
      id: 2,
      tanggal: '2025-10-29',
      nama: 'Gaji Guru Honorer',
      penanggungJawab: 'Pak Hadi',
      kategori: 'Upah Karyawan',
      jumlah: 2500000,
      status: 'Selesai'
    },
    {
      id: 3,
      tanggal: '2025-10-29',
      nama: 'Langganan Internet',
      penanggungJawab: 'Bu Sinta',
      kategori: 'Pemeliharaan',
      jumlah: 450000,
      status: 'Proses'
    }
  ]

   const filteredData = useMemo(() => {
    if (!expenses?.data) return []
  
    return expenses.data.filter((item: any) => {
      const search = searchTerm.toLowerCase()
  
      // Search matching
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search)
  
      // Subcategory filter berdasarkan tab
      const matchTab =
        activeTab === 'semua'
          ? item?.subCategoryId === 13
          : item?.subCategoryId === 13
  
      return matchSearch && matchTab
    })
  }, [expenses, searchTerm, activeTab])

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
          value={filteredData?.length}
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
                className={`px-5 py-3 font-medium rounded-t-xl transition-all duration-300 shadow-sm ${
                  activeTab === tab
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
            <TablePengeluaran title={'Oprasional'} data={filteredData} menu={'biaya_makan'} />

            {/* Pagination */}
            <div className='flex justify-center items-center gap-2 mt-6'>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    currentPage === num
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
export default BiayaMakanPage
