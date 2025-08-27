'use client'

import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  SquarePen,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SearchDataTable from '@/components/fragments/dashboard/search-data-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CardInformation from '@/components/fragments/dashboard/card-information'
import Swal from 'sweetalert2'
import { DataPembayaranSiswa } from '@/data/pembayaran'
import { useStudentModule } from '@/hooks/useStudentModule'
import { useCategoryPaymentModule } from '@/hooks/use-categoryPayment'
import Loader from '@/components/ui/loader'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'

const DataSelainSpp = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAngkatan, setFilterAngkatan] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // carousel setup dengan API
  const { useGetCategory } = useCategoryPaymentModule()
  const { data: categories = [], isLoading: isLoadingCategory } = useGetCategory()
  const [startIndex, setStartIndex] = useState(0)
  const maxVisible = 4

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1)
  }
  const handleNext = () => {
    if (startIndex < categories.length - maxVisible) setStartIndex(startIndex + 1)
  }

  // ambil data siswa dari API
  const { useGetStudent } = useStudentModule()
  const { data: siswa = [], isLoading, isError } = useGetStudent()

  const filteredData = DataPembayaranSiswa
    .filter((s: any) =>
      searchTerm
        ? s.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.kategoriPembayaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tanggalPembayaran.includes(searchTerm)
        : true,
    )

    .filter((s: any) => (filterAngkatan ? s.angkatan === filterAngkatan : true))
    .filter((s: any) => (filterStatus ? s.status === filterStatus : true))
  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount,
  )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Lunas':
        return 'bg-green-100 text-green-700'
      case 'Belum Lunas':
        return 'bg-yellow-100 text-yellow-700'
      case 'Tunggakan':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading || isLoadingCategory) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    )
  }

  if (isError) {
    return <div className="p-6 text-red-500">Gagal memuat data siswa.</div>
  }

  return (
    <section className="flex flex-col gap-10 w-full">
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color={'blue'}
          title={'Total Data'}
          value={siswa.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={'green'}
          title={'Lunas'}
          value={filteredData.slice(0, showCount).length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTable
          title={'Data Pembayaran'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />

        {/* carousel kategori dari API */}
        <div className="w-full flex items-center">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden flex-1 mx-2">
            <div
              className="flex gap-4 transition-transform duration-500"
              style={{
                transform: `translateX(-${startIndex * (100 / maxVisible)}%)`,
              }}
            >
              {categories.length === 0 ? (
                <p className="text-gray-400">Belum ada kategori</p>
              ) : (
                categories.map((kat: any, i: number) => (
                  <div
                    key={i}
                    className="flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl bg-blue-500"
                  >
                    <p className="text-white font-semibold text-xl">{kat.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            title='button'
            onClick={handleNext}
            disabled={startIndex >= categories.length - maxVisible}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* tabel data siswa */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          <Table className="w-full h-full table-auto bg-white text-gray-700">
            <TableHeader className="text-sm font-semibold text-center">
              <TableRow className="text-center">
                <TableHead className="py-4">No</TableHead>
                <TableHead className="py-4">Nama Siswa</TableHead>
                <TableHead className="py-4">Total Pembayaran</TableHead>
                <TableHead className="py-4">Status</TableHead>
                <TableHead className="py-4">Tanggal Pembayaran</TableHead>
                <TableHead className="py-4">Jurusan</TableHead>
                <TableHead className="py-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-sm divide-y divide-gray-200 text-center">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-gray-400">
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((s: any, idx) => (
                  <TableRow key={s.id}>
                    <TableCell className="py-4 font-medium">{idx + 1}</TableCell>
                    <TableCell className="py-4 font-medium">{s.namaSiswa}</TableCell>
                    <TableCell className="py-4">{s.kategoriPembayaran}</TableCell>
                    <TableCell className="py-4">{s.angkatan}</TableCell>
                    <TableCell className="py-4">{s.totalPembayaran}</TableCell>
                    <TableCell className="py-4">
                      <span
                        className={`inline-block w-24 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          s.status,
                        )}`}
                      >
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">{s.tanggalPembayaran}</TableCell>
                    <TableCell className="py-4">{s.jurusan}</TableCell>
                    <TableCell className="flex w-full gap-2 items-center">
                      <Link href={`/dashboard/siswa/update/${s.id}`}>
                        <Button className="bg-blue-400 text-white cursor-pointer">
                          <SquarePen />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className='fixed inset-0 bg-black/40 z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              className='fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col gap-6'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-xl font-semibold'>Filter</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className='text-gray-500 hover:text-gray-700 text-sm'
                >
                  ✕
                </button>
              </div>
              <div className='flex flex-col gap-4'>
                <label className='flex flex-col text-sm'>
                  Status
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='Lunas'>Lunas</option>
                    <option value='Belum Lunas'>Belum Lunas</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Angkatan
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterAngkatan}
                    onChange={e => setFilterAngkatan(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='2021'>2021</option>
                    <option value='2022'>2022</option>
                    <option value='2023'>2023</option>
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                                    
                    setFilterStatus('')
                    setFilterAngkatan('')
                  }}
                  className='w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-gray-300'
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

export default DataSelainSpp
