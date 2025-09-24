'use client'

import { GraduationCap, SquarePen, Trash2, Users } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
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
import dayjs from 'dayjs'
import { useCategoryExpense } from '@/hooks/use-expenseCategory'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import SearchDataTableKategori from '@/components/fragments/dashboard/search-data-table-kategory'

const LihatSemuaSiswa = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [draftPeriode, setDraftPeriode] = useState('')
  const [periodeFilter, setPeriodeFilter] = useState('')

  // Ambil data siswa dari API
  const { useGetCategories, useDeleteCategory } = useCategoryExpense()
  const { mutate } = useDeleteCategory()
  const { data: categories = [], isLoading, isError } = useGetCategories()

  const filteredData = useMemo(() => {
    return categories
      ?.filter(
        (c: any) =>
          c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c?.periode
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          c?.decs?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      ?.filter((c: any) =>
        periodeFilter ? String(c.periode) === String(periodeFilter) : true
      )
  }, [categories, searchTerm, periodeFilter])
  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginated = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * showCount,
      currentPage * showCount
    )
  }, [filteredData, currentPage, showCount])
  console.log(filteredData)
  const applyFilter = () => {
    setPeriodeFilter(draftPeriode) // aktifkan filter
    setCurrentPage(1) // reset ke halaman pertama
    setShowFilter(false) // tutup drawer
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
        await mutate(id)
      }
    } catch (error) {
      console.error(error)
      Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className='p-6 w-full h-[89vh] flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  if (isError) {
    return <div className='p-6 text-red-500'>Gagal memuat data siswa.</div>
  }

  return (
    <section className='w-full min-h-[90vh] flex flex-col gap-10'>
      {/* Kartu informasi */}
      <section className='grid grid-cols-2 gap-4'>
        <CardInformation
          color={'blue'}
          title={'Total Siswa'}
          value={categories.length}
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
        <SearchDataTableKategori
          title={'Manajement Kategori Pembayaran'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={' add create'}
          link='/dashboard/pengeluaran/category/create'
        />

        <div className='w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-gray-400'>
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((s: any, idx: number) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {(currentPage - 1) * showCount + (idx + 1)}
                    </TableCell>
                    <TableCell className='font-medium'>{s.name}</TableCell>
                    <TableCell>{s.decs}</TableCell>
                    <TableCell>{s.periode}</TableCell>
                    <TableCell>{s.nominal}</TableCell>
                    <TableCell>
                      {dayjs(s.createdAt).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell className='flex gap-2 justify-center'>
                      <Link
                        href={`/dashboard/pengeluaran/category/update/${s.id}`}
                      >
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
                  Periode
                  <Select
                    value={draftPeriode}
                    onValueChange={e => setDraftPeriode(e)}
                  >
                    <SelectTrigger className='w-full py-6 px-3 border-slate-300 rounded-md text-slate-500 mt-2'>
                      <SelectValue placeholder='Periode Tahun' />
                    </SelectTrigger>
                    <SelectContent className='bg-white border-none'>
                      <SelectGroup>
                        <SelectLabel>Periode Tahun</SelectLabel>
                        {Array.from({ length: 4 }, (_, i) => i + 1).map(p => (
                          <SelectItem
                            key={p}
                            value={`${new Date().getFullYear() + p - 1}`}
                          >
                            {p == 1
                              ? new Date().getFullYear()
                              : new Date().getFullYear() + p - 1}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setCurrentPage(1)
                  }}
                  className='w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600'
                >
                  Reset Filter
                </button>
                <button
                  onClick={applyFilter}
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
