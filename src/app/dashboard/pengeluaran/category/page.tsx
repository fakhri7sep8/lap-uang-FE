'use client'

import { Wallet, SquarePen, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import SearchDataTable from '@/components/fragments/dashboard/search-data-table-copy'
import { viewPengeluaran } from '@/data/view-pengeluaran'
import { Button } from '@/components/ui/button'
import CardInformation from '@/components/fragments/dashboard/card-information'
import Link from 'next/link'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'

const LihatSemuaPengeluaran = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10) // Limit per page
  const [filterJenis, setFilterJenis] = useState('')
  const [filterBulan, setFilterBulan] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const bulanIndo = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  const getBulan = (tanggal: string) => {
    const dateObj = new Date(tanggal)
    return bulanIndo[dateObj.getMonth()]
  }

  // Filter data sesuai search, jenis pengeluaran, dan bulan
  const filteredData = viewPengeluaran
    .filter(
      p =>
        p.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jenisPengeluaran.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(p => (filterJenis ? p.jenisPengeluaran === filterJenis : true))
    .filter(p => (filterBulan ? getBulan(p.tanggal) === filterBulan : true))

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  )

  const handleDelete = () => {
    alert('delete pengeluaran berjalan')
  }

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID')

  return (
    <section className='flex flex-col gap-10 w-full'>
      {/* Card Info */}
      <section className='grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Pengeluaran'}
          value={viewPengeluaran.length}
          icon={<Wallet size={32} className='text-blue-500' />}
        />
        <CardInformation
          color={'green'}
          title={'Total Ditampilkan'}
          value={paginatedData.length}
          icon={<Wallet size={32} className='text-green-500' />}
        />
      </section>

      {/* Search dan Filter */}
      <section className='w-full flex flex-col gap-6 h-full pb-6'>
        <SearchDataTable
          type='normal'
          title={'Manajemen Pengeluaran'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
        />

        {/* Table */}
        <div className='w-full h-full rounded-xl overflow-hidden bg-white p-1'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead className='text-center py-4'>Tanggal</TableHead>
                <TableHead className='text-center py-4'>Jenis</TableHead>
                <TableHead className='text-center py-4'>Deskripsi</TableHead>
                <TableHead className='text-center py-4'>Jumlah</TableHead>
                <TableHead className='text-center py-4'>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-gray-400'>
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className='py-4'>{p.tanggal}</TableCell>
                    <TableCell className='py-4'>{p.jenisPengeluaran}</TableCell>
                    <TableCell className='py-4'>{p.deskripsi}</TableCell>
                    <TableCell className='py-4 font-semibold'>
                      {formatRupiah(p.amount)}
                    </TableCell>
                    <TableCell className='flex gap-2 justify-center'>
                      <Link href={`/dashboard/pengeluaran/update/${p.id}`}>
                        <Button className='bg-blue-400 text-white'>
                          <SquarePen />
                        </Button>
                      </Link>
                      <Button
                        className='bg-red-500 text-white'
                        onClick={handleDelete}
                      >
                        <Trash2 />
                      </Button>
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

      {/* Filter Drawer */}
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
                <h3 className='text-xl font-semibold'>Filter Pengeluaran</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className='text-gray-500 hover:text-gray-700 text-sm'
                >
                  ✕
                </button>
              </div>
              <div className='flex flex-col gap-4'>
                <label className='flex flex-col text-sm'>
                  Jenis Pengeluaran
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterJenis}
                    onChange={e => {
                      setFilterJenis(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value=''>Semua</option>
                    {[
                      ...new Set(viewPengeluaran.map(p => p.jenisPengeluaran))
                    ].map(jenis => (
                      <option key={jenis} value={jenis}>
                        {jenis}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Bulan
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterBulan}
                    onChange={e => {
                      setFilterBulan(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value=''>Semua</option>
                    {bulanIndo.map(bulan => (
                      <option key={bulan} value={bulan}>
                        {bulan}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setFilterJenis('')
                    setFilterBulan('')
                    setCurrentPage(1)
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

export default LihatSemuaPengeluaran
