'use client'

import TablePengeluaran, {
  getBulan
} from '@/components/fragments/table-pengeluaran'
import CardInformation from '@/components/fragments/dashboard/card-information'
import { viewPengeluaran } from '@/data/view-pengeluaran'
import SearchDataTable from '@/components/fragments/dashboard/search-data-table'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { FaMoneyBill, FaRegFile, FaUserGroup } from 'react-icons/fa6'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Download, SquarePen } from 'lucide-react'
import dayjs from 'dayjs'
import { useExpenseModule } from '@/hooks/use-expense'
import currency from 'currency.js'

export default function PengeluaranViewPage () {
  // State untuk search, filter, dan pagination
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterJenis, setFilterJenis] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { useGetExpenses } = useExpenseModule()

  const { data: expenses } = useGetExpenses()

  console.log(expenses)

  // Logic filter dan search
  const filteredData = expenses
    ?.filter((item: any) =>
      item?.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item: any) =>
      filterJenis ? item.jenisPengeluaran === filterJenis : true
    )

  // Pagination
  const totalData = filteredData?.length
  const totalJumlah = filteredData?.reduce(
    (acc: any, curr: any) => acc + curr.amount,
    0
  )
  const totalPages = Math.ceil(filteredData?.length / showCount)
  const paginated = useMemo(() => {
    return filteredData?.slice(
      (currentPage - 1) * showCount,
      currentPage * showCount
    )
  }, [filteredData, currentPage, showCount])

  return (
    <div className='min-h-full bg-gray-100 flex flex-col items-center py-8 '>
      {/* Card Information */}
      <div className='w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <CardInformation
          color='blue'
          title='Total Data'
          value={totalData}
          icon={<FaRegFile size={40} className='text-blue-400' />}
        />
        <CardInformation
          color='green'
          title='Total Jumlah'
          value={' RP.' + totalJumlah?.toLocaleString('id-ID')}
          icon={<FaMoneyBill size={40} className='text-green-400' />}
        />
      </section>

      {/* Search & Filter */}
      <div className='w-full max-w-full mb-4'>
        <SearchDataTable
          title={'Managemet Pengeluaran'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />
      </div>

      {/* Tabel Pengeluaran */}
      <div className='w-full max-w-full'>
        {/* <TablePengeluaran data={paginatedData}/> */}
        <div className='w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jenis pengeluaran</TableHead>
                <TableHead>periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginated?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-gray-400'>
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginated?.map((s: any, idx: number) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {(currentPage - 1) * showCount + (idx + 1)}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {s.description}
                    </TableCell>
                    <TableCell>{s.category.name}</TableCell>
                    <TableCell>{s.category.periode}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(s.amount)}
                    </TableCell>
                    <TableCell>
                      {dayjs(s.createdAt).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell className='flex gap-2 justify-center'>
                      <Link
                        href={`/dashboard/pengeluaran/category/update/${s.id}`}
                      >
                        <Button className='bg-blue-400 text-white'>
                          <Download />
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
      </div>

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
                {/* Tambahkan filter sesuai kebutuhan pengeluaran di sini */}
                <label className='flex flex-col text-sm'>
                  Jenis Pengeluaran
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    <option value='Operasional'>Operasional</option>
                    <option value='Kegiatan'>Kegiatan</option>
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setFilterJenis('')
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
    </div>
  )
}
