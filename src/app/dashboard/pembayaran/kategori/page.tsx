'use client'

import CardInformation from '@/components/fragments/dashboard/card-information'
import SearchDataTable from '@/components/fragments/dashboard/search-data-table'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { kategoriPembayaran } from '@/data/kategori-pembayaran'
import { useCategoryPaymentModule } from '@/hooks/use-categoryPayment'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const KategoriPembayaran = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const { useGetCategory } = useCategoryPaymentModule()
  const { data } = useGetCategory()
  
  console.log(data);
  return (
    <div className='w-full rounded-xl flex flex-col gap-6 px-2 '>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <CardInformation
          color={'purple'}
          title={''}
          value={''}
          icon={undefined}
        />
        <CardInformation
          color={'green'}
          title={''}
          value={''}
          icon={undefined}
        />
      </div>
      <SearchDataTable
        type=' add create'
        link='/dashboard/pembayaran/kategori/create'
        title={'Management Kategori Pembayaran'}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowFilter={setShowFilter}
        setShowCount={setShowCount}
      />
      <div className='w-full bg-white  dark:text-[#ABB2BF] rounded-xl p-4 flex flex-col  justify-between'>
        <Table className='w-full table-auto bg-white text-gray-700'>
          <TableHeader className='text-sm font-semibold'>
            <TableRow className='text-center'>
              <TableHead className='text-center py-4'>Id</TableHead>
              <TableHead className='text-center py-4'>Nama Kategori</TableHead>
              <TableHead className='text-center py-4'>Semester</TableHead>
              <TableHead className='text-center py-4'>Tahun Ajaran</TableHead>
              <TableHead className='text-center py-4'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='text-sm divide-y divide-slate-300 text-center'>
            {kategoriPembayaran &&
              kategoriPembayaran.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className=' py-4'>{d.id}</TableCell>
                  <TableCell className=' py-4'>{d.nama}</TableCell>
                  <TableCell className=' py-4'>{d.semester}</TableCell>
                  <TableCell className=' py-4'>{d.TA}</TableCell>
                  <TableCell className=' py-4'>
                    <div className='flex gap-4 items-center justify-center'>
                      <Link href={`/dashboard/pembayaran/kategori/update/${d.id}`}>
                        <Button className='bg-blue-500 text-white'>
                          <Edit />
                        </Button>
                      </Link>
                      <Button className='bg-red-500 text-white px-4'>
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className='w-full flex'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
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
                  <select className='mt-1 border border-gray-300 rounded-md px-3 py-2'>
                    <option value=''>Semua</option>
                    <option value='Aktif'>Aktif</option>
                    <option value='Lulus'>Lulus</option>
                    <option value='Keluar'>Keluar</option>
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Jurusan
                  <select className='mt-1 border border-gray-300 rounded-md px-3 py-2'>
                    <option value=''>Semua</option>
                    <option value='TKJ'>TKJ</option>
                    <option value='RPL'>RPL</option>
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button className='w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'>
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

export default KategoriPembayaran
