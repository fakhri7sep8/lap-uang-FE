'use client'

import { useState, useMemo } from 'react'
import { GraduationCap, Users } from 'lucide-react'
import CardInformation from '@/components/fragments/dashboard/card-information'
import TablePengeluaran from '@/components/fragments/pengeluaran/table'
import SearchInput from '@/components/fragments/pengeluaran/seraach_andinput'
import { useExpenseModule } from '@/hooks/expense/useExpense'

const OperasionalPage = () => {
  const [activeTab, setActiveTab] = useState('Pembangunan')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const tabs = ['Pembangunan', 'Sarana']

  const { useGetExpense } = useExpenseModule()
  const { data: expenses, isLoading, isError } = useGetExpense('operasional')

  // ===================== FILTER =====================
  const filteredData = useMemo(() => {
    if (!expenses?.data) return []

    const search = searchTerm.toLowerCase()

    return expenses.data.filter((item: any) => {
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search)

      const matchTab =
        activeTab === 'Pembangunan'
          ? item?.subCategoryId === 1
          : item?.subCategoryId === 2

      return matchSearch && matchTab
    })
  }, [expenses, searchTerm, activeTab])

  // ===================== NILAI CARD TERFILTER =====================
  const filteredCount = searchTerm.trim() === '' ? 0 : filteredData.length

  return (
    <div className='min-h-screen flex flex-col gap-10 items-center py-7'>
      {/* ====== INFO CARD ====== */}
      <section className='w-full grid grid-cols-2 gap-4'>
        <CardInformation
          color='blue'
          title='Total Data'
          value={filteredData?.length}
          icon={<GraduationCap size={32} className='text-blue-500' />}
        />

        {/* 🟢 CARD TERFILTER — sudah diperbaiki */}
        <CardInformation
          color='green'
          title='Data Terfilter'
          value={filteredCount}
          icon={<Users size={32} className='text-green-500' />}
        />
      </section>

      {/* ====== TABEL DATA ====== */}
      <div className='w-full max-w-6xl rounded-3xl'>
        <div className='px-3'>
          <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
            Data Pengeluaran Sekolah
          </h1>
          <p className='text-gray-500 mb-6'>
            Data pengeluaran operasional dan sarana sekolah.
          </p>
        </div>

        {/* ====== Tabs ====== */}
        <div className='flex flex-col gap-2 p-2'>
          <div className='flex gap-2 mb-[-7]'>
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

          {/* ====== Main Table Card ====== */}
          <div className='bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl'>
            {/* Search */}
            <SearchInput
              onChange={(e: any) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />

            {/* Table */}
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
              <TablePengeluaran
                title='Operasional'
                data={filteredData}
                menu={'operasional'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OperasionalPage
