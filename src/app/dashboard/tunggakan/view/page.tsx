'use client';

import { Calendar, SquarePen, Trash2, Wallet } from 'lucide-react'
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
import SearchDataTable from '@/components/fragments/dashboard/search-data-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CardInformation from '@/components/fragments/dashboard/card-information'
import Swal from 'sweetalert2'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'
import Loader from '@/components/ui/loader'

const dummyTunggakan = [
  {
    id: '1',
    nama: 'Ahmad Fauzi',
    kelas: 'X TKJ 1',
    Bulan: 'Januari',
    status: 'Belum Lunas',
    Tunggakan: 500000,
  },
  {
    id: '2',
    nama: 'Citra Lestari',
    kelas: 'XI RPL 2',
    Bulan: 'Februari',
    status: 'Cicilan',
    Tunggakan: 250000,
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    kelas: 'XII TKJ 3',
    Bulan: 'Maret',
    status: 'Lunas',
    Tunggakan: 0,
  },
  {
    id: '4',
    nama: 'Dewi Anggraini',
    kelas: 'X RPL 1',
    Bulan: 'April',
    status: 'Belum Lunas',
    Tunggakan: 300000,
  },
  {
    id: '5',
    nama: 'Eko Prasetyo',
    kelas: 'XI TKJ 2',
    Bulan: 'Mei',
    status: 'Cicilan',
    Tunggakan: 150000,
  },
];

const Tunggakan = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterKelas, setFilterKelas] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBulan, setFilterBulan] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const tunggakan = dummyTunggakan

  const filteredData = tunggakan
    ?.filter(
      (t: any) =>
        t?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t?.kelas?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((t: any) => (filterStatus ? t.status === filterStatus : true))
    .filter((t: any) => (filterKelas ? t.kelas === filterKelas : true))
    .filter((t: any) => (filterBulan ? t.Bulan === filterBulan : true))

  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  )

  // Hitung total tunggakan
  const totalTunggakan = tunggakan.reduce((acc, curr) => acc + curr.Tunggakan, 0)

  // Cari tunggakan tertinggi
  const tunggakanTertinggi = tunggakan.reduce(
    (max, curr) => (curr.Tunggakan > max ? curr.Tunggakan : max),
    0
  )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Belum Lunas':
        return 'bg-red-100 text-red-700'
      case 'Cicilan':
        return 'bg-yellow-100 text-yellow-700'
      case 'Lunas':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDelete = async (id: string) => {
    Swal.fire('Info', 'Fitur hapus hanya simulasi pada data dummy.', 'info')
  }

  return (
    <section className='w-full min-h-[90vh] flex flex-col gap-10'>
      {/* Kartu informasi */}
      <section className='grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Tunggakan'}
          value={totalTunggakan.toLocaleString('id-ID')}
          icon={<Wallet size={32} className='text-blue-500' />}
        />
        <CardInformation
          color={'red'}
          title={'Tunggakan Tertinggi'}
          value={tunggakanTertinggi.toLocaleString('id-ID')}
          icon={<Calendar size={32} className='text-red-500' />}
        />
      </section>

      {/* Table */}
      <section className='w-full flex flex-col gap-6 h-full pb-6'>
        <SearchDataTable
          title={'Manajemen Tunggakan'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />

        <div className='w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Bulan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jumlah Tunggakan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-gray-400'>
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((t: any, idx: number) => (
                  <TableRow key={t.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className='font-medium'>{t.nama}</TableCell>
                    <TableCell>{t.kelas}</TableCell>
                    <TableCell>{t.Bulan}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block w-24 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell>{t.Tunggakan}</TableCell>
                    <TableCell className='flex gap-2 justify-center'>
                      <Link href={`/dashboard/tunggakan/update/${t.id}`}>
                        <Button className='bg-blue-400 text-white'>
                          <SquarePen />
                        </Button>
                      </Link>
                      <Button
                        className='bg-red-500 text-white px-4'
                        onClick={() => handleDelete(t.id as string)}
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
                    <option value='Belum Lunas'>Belum Lunas</option>
                    <option value='Cicilan'>Cicilan</option>
                    <option value='Lunas'>Lunas</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Kelas
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterKelas}
                    onChange={e => setFilterKelas(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='X TKJ 1'>X TKJ 1</option>
                    <option value='XI TKJ 2'>XI TKJ 2</option>
                    <option value='XII TKJ 3'>XII TKJ 3</option>
                    <option value='X RPL 1'>X RPL 1</option>
                    <option value='XI RPL 2'>XI RPL 2</option>
                    <option value='XII RPL 3'>XII RPL 3</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Bulan
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterBulan}
                    onChange={e => setFilterBulan(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='Januari'>Januari</option>
                    <option value='Februari'>Februari</option>
                    <option value='Maret'>Maret</option>
                    <option value='April'>April</option>
                    <option value='Mei'>Mei</option>
                    <option value='Juni'>Juni</option>
                    <option value='Juli'>Juli</option>
                    <option value='Agustus'>Agustus</option>
                    <option value='September'>September</option>
                    <option value='Oktober'>Oktober</option>
                    <option value='November'>November</option>
                    <option value='Desember'>Desember</option>
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setFilterStatus('')
                    setFilterKelas('')
                    setFilterBulan('')
                  }}
                  className='w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
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

export default Tunggakan
