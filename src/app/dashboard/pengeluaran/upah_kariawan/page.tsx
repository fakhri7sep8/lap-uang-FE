'use client'
import { useEffect, useMemo, useState } from 'react'
import { GraduationCap, Users } from 'lucide-react'
import CardInformation from '@/components/fragments/dashboard/card-information'
import TablePengeluaran from '@/components/fragments/pengeluaran/table'
import SearchInput from '@/components/fragments/pengeluaran/seraach_andinput'
import { useExpenseModule } from '@/hooks/expense/useExpense'

const UpahKariawanPage = () => {
  const [activeTab, setActiveTab] = useState('Guru')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const tabs = ['Guru', 'Staf', 'Satpam', 'Tukang', 'Dapur', 'Laundry']

  const { useGetExpense } = useExpenseModule()
  const { data: expenses, isLoading, isError } = useGetExpense('Upah Karyawan')

  // ====== MAP TAB → subCategoryId ======
  const subCategoryMap: Record<string, number> = {
    Guru: 7,
    Staf: 8,
    Satpam: 9,
    Tukang: 10,
    Dapur: 11,
    Laundry: 12
  }

  // ====== DATE FILTER STATES ======
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)

  // ========================= FILTERING =========================
  const filteredData = useMemo(() => {
    if (!expenses?.data) return []

    return expenses?.data?.data?.filter((item: any) => {
      const search = searchTerm.toLowerCase()

      // === ASUMSI FIELD TANGGAL ===
      const itemDate = item?.createdAt ? new Date(item.createdAt) : ""

      // Search filter
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search)

      // Tab filter
      const matchTab = item?.subCategoryId === subCategoryMap[activeTab]

      // Date filter
      const matchFromDate = fromDate ? itemDate >= fromDate : true
      const matchToDate = toDate ? itemDate <= toDate : true

      return matchSearch && matchTab && matchFromDate && matchToDate
    })
  }, [expenses, searchTerm, activeTab, fromDate, toDate])

  // ========================= PAGINATION =========================
  const startIndex = (currentPage - 1) * limit
  const paginatedData = filteredData.slice(startIndex, startIndex + limit)
  const totalPages = Math.ceil(filteredData.length / limit)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab, fromDate, toDate])

  // ====== HANDLERS ======
  const handleSearchChange = (e: any) => setSearchTerm(e.target.value)
  const handleFromDateChange = (date: Date | null) => setFromDate(date)
  const handleToDateChange = (date: Date | null) => setToDate(date)

  return (
    <div className='min-h-screen flex flex-col gap-10 items-center py-7'>
      {/* ====== INFO CARD ====== */}
      <section className='w-full grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Data'}
          value={expenses?.data?.data?.length || 0}
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
            Data Upah / Gaji Karyawan Sekolah.
          </p>
        </div>

        {/* ====== Tabs ====== */}
        <div className='flex flex-col gap-2 p-2'>
          <div className='flex gap-2 mb-[-7]'>
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

          {/* ====== Main Table Card ====== */}
          <div className='bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl'>
            {/* Search + Date Filter */}
            <SearchInput
              searchTerm={searchTerm}
              fromDate={fromDate}
              toDate={toDate}
              onSearchChange={handleSearchChange}
              onFromDateChange={handleFromDateChange}
              onToDateChange={handleToDateChange}
            />

            {/* Table / Loading / Error State */}
            {isLoading ? (
              <p className='text-center text-gray-500 py-6'>Memuat data...</p>
            ) : isError ? (
              <p className='text-center text-red-500 py-6'>
                Gagal memuat data upah karyawan.
              </p>
            ) : filteredData.length === 0 ? (
              <p className='text-center text-gray-400 py-6'>
                Tidak ada data ditemukan.
              </p>
            ) : (
              <TablePengeluaran
                title={'Upah Karyawan'}
                data={paginatedData}
                menu={'upah_kariawan'}
              />
            )}

            {/* Pagination */}
            <div className='flex justify-center items-center gap-2 mt-6'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
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

export default UpahKariawanPage
