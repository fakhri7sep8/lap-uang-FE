/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { GraduationCap, SquarePen, Trash2, Users } from 'lucide-react'
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
import { useStudentModule } from '@/hooks/useStudentModule'

const LihatSemuaSiswa = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterJurusan, setFilterJurusan] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAsrama, setFilterAsrama] = useState('')
  const [filterAngkatan, setFilterAngkatan] = useState('')

  // Ambil data siswa dari API
  const { useGetStudent, useDeleteStudent } = useStudentModule()
  const { data: siswa = [], isLoading, isError } = useGetStudent()
  const { mutateAsync: deleteStudent } = useDeleteStudent()

  const filteredData = siswa
    ?.filter(
      (s: any) =>
        s?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s?.InductNumber?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s?.dorm?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((s: any) => (filterStatus ? s.status === filterStatus : true))
    .filter((s: any) => (filterJurusan ? s.major === filterJurusan : true))
    .filter((s: any) => (filterAsrama ? s.dorm === filterAsrama : true))
    .filter((s: any) =>
      filterAngkatan ? String(s.generation) === filterAngkatan : true
    )

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700'
      case 'Lulus':
        return 'bg-yellow-100 text-yellow-700'
      case 'Keluar':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Apakah kamu yakin?',
        text: 'Data yang dihapus tidak bisa dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        await deleteStudent(id)
        await Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success')
      }
    } catch (error) {
      console.error(error)
      Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error')
    }
  }

  if (isLoading) {
    return <div className='p-6'>Loading data siswa...</div>
  }

  if (isError) {
    return <div className='p-6 text-red-500'>Gagal memuat data siswa.</div>
  }

  return (
    <section className='flex flex-col gap-10 w-full'>
      {/* Kartu informasi */}
      <section className='grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Siswa'}
          value={siswa.length}
          icon={<GraduationCap size={32} className='text-blue-500' />}
        />
        <CardInformation
          color={'green'}
          title={'Total Data'}
          value={filteredData.slice(0, showCount).length}
          icon={<Users size={32} className='text-green-500' />}
        />
      </section>

      {/* Table */}
      <section className='w-full flex flex-col gap-6 h-full pb-6'>
        <SearchDataTable
          title={'Managemet Siswa'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />

        <div className='w-full h-full rounded-xl overflow-hidden bg-white p-1'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No. Induk</TableHead>
                <TableHead>Asrama</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {filteredData.slice(0, showCount).map((s: any, idx: number) => (
                <TableRow key={s.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className='font-medium'>{s.name}</TableCell>
                  <TableCell>{s.InductNumber}</TableCell>
                  <TableCell>{s.dorm}</TableCell>
                  <TableCell>{s.generation}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        s.status
                      )}`}
                    >
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell>{s.major}</TableCell>
                  <TableCell>{s.createdAt}</TableCell>
                  <TableCell className='flex gap-2 justify-center'>
                    <Link href={`/dashboard/siswa/update/${s.id}`}>
                      <Button className='bg-blue-400 text-white'>
                        <SquarePen />
                      </Button>
                    </Link>
                    <Button
                      className='bg-red-500 text-white px-4'
                      onClick={() => handleDelete(s.id as string)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    <option value='ACTIVE'>Aktif</option>
                    <option value='Lulus'>Lulus</option>
                    <option value='Keluar'>Keluar</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Jurusan
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterJurusan}
                    onChange={e => setFilterJurusan(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='TKJ'>TKJ</option>
                    <option value='RPL'>RPL</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Asrama
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterAsrama}
                    onChange={e => setFilterAsrama(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='Asrama 1'>Asrama 1</option>
                    <option value='Asrama 2'>Asrama 2</option>
                    <option value='Asrama 3'>Asrama 3</option>
                    <option value='Asrama 4'>Asrama 4</option>
                    <option value='Asrama 5'>Asrama 5</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Angkatan
                  <input
                    type='number'
                    placeholder='Misal: 1, 2, 3'
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterAngkatan}
                    onChange={e => setFilterAngkatan(e.target.value)}
                  />
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setFilterStatus('')
                    setFilterJurusan('')
                    setFilterAsrama('')
                    setFilterAngkatan('')
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

export default LihatSemuaSiswa
