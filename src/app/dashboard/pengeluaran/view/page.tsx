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
import { Button } from '@/components/ui/button'
import { Download, Eye, SquarePen, XIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { useExpenseModule } from '@/hooks/use-expense'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Swal from 'sweetalert2'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCategoryExpense } from '@/hooks/use-expenseCategory'

export default function PengeluaranViewPage () {
  // State untuk search, filter, dan pagination
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterJenis, setFilterJenis] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isPopup, setPopup] = useState(false)
  const [dataDetail, setDataDetail] = useState<any>({})
  const [filterAmount, setFilterAmount] = useState<number | undefined>(0)

  const { useGetExpenses } = useExpenseModule()

  const { data: expenses } = useGetExpenses()

  // console.log(expenses)

  // Logic filter dan search
  const filteredData = expenses
    ?.filter(
      (item: any) =>
        item?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.pihakPenerima.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item: any) =>
      filterJenis ? item.jenisPengeluaran === filterJenis : true
    )
    .filter((item: any) =>
      filterAmount ? item.amount === filterAmount : true
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

  const handleFilterData = (id: string) => {
    // console.log(id);
    const filter = paginated?.find((item: any) => item.id === id)
    // console.log(filter);
    setDataDetail(filter)
  }
  const { useGetCategories } = useCategoryExpense()
  const { data: categories } = useGetCategories()

  const handleAlert = () => {
    Swal.fire({
      icon: 'info',
      text: 'fitur dalam proses mengembangan'
    })
  }

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
      </div>

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
                <TableHead>Pihak penerima</TableHead>
                <TableHead>Jumlah Barang</TableHead>
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
                    <TableCell>{s.pihakPenerima}</TableCell>
                    <TableCell>{s.itemCount}</TableCell>
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
                      <Button
                        className='bg-purple-400 text-white'
                        onClick={() => {
                          setPopup(true)
                          handleFilterData(s.id)
                        }}
                      >
                        <Eye />
                      </Button>
                      <Button
                        className='bg-blue-400 text-white'
                        onClick={() => handleAlert()}
                      >
                        <Download />
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
      </div>
      {isPopup && (
        <div className='w-full h-screen bg-black/50 absolute top-0 left-0 z-[999] flex justify-center items-center py-8'>
          <div className='w-2/3 h-full bg-white rounded-2xl flex flex-col gap-4 py-4 px-6 overflow-y-scroll'>
            <h2 className='text-lg font-semibold'>Detail Pengeluaran</h2>
            <div className='grid w-full grid-cols-2 gap-4'>
              <div className='w-full flex flex-col gap-4'>
                <Label htmlFor='decs'>Jenis Pengeluaran</Label>
                <Input
                  id='decs'
                  name='jenis Pengeluaran'
                  type='text'
                  value={dataDetail?.category?.name}
                  placeholder='Masukan keterangan'
                  className='border border-slate-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 '
                  readOnly
                />
              </div>
              <div className='w-full flex flex-col gap-4'>
                <Label htmlFor='decs'>Jumlah Barang</Label>
                <Input
                  id='decs'
                  name='description'
                  type='text'
                  value={dataDetail?.itemCount}
                  placeholder='Masukan keterangan'
                  className='border border-slate-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 '
                  readOnly
                />
              </div>
              <div className='w-full flex flex-col gap-4'>
                <Label htmlFor='decs'>pihak penerima</Label>
                <Input
                  id='decs'
                  name='description'
                  type='text'
                  value={dataDetail?.pihakPenerima}
                  placeholder='Masukan keterangan'
                  className='border border-slate-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 '
                  readOnly
                />
              </div>
              <div className='w-full flex flex-col gap-4'>
                <Label htmlFor='decs'>total Biaya</Label>
                <Input
                  id='decs'
                  name='description'
                  type='text'
                  value={dataDetail?.amount}
                  placeholder='Masukan keterangan'
                  className='border border-slate-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 '
                  readOnly
                />
              </div>
            </div>
            <div className='w-full h-full flex flex-col gap-4'>
              <Label htmlFor='decs'>Keterangan</Label>
              <textarea
                id='decs'
                name='description'
                value={dataDetail?.description}
                placeholder='Masukan keterangan'
                className='border border-slate-300 rounded-md px-3 py-4 h-48 resize-none focus:outline-none focus:ring-2 '
                readOnly
              />
            </div>
            <div className='w-full h-full flex flex-col gap-4'>
              <Label htmlFor='decs'>Bukti Kuitansi</Label>
              <div className='w-full px-6 h-80 overflow-y-scroll'>
                <Image
                  src={dataDetail?.kwitansiUrl}
                  alt='Bukti Kuitansi'
                  layout='responsive'
                  width={500}
                  height={300}
                />
              </div>
            </div>
            <div className='w-24 h-24 rounded-full absolute top-0 left-0 p-6'>
              <div
                className='bg-white rounded-full w-full h-full flex justify-center items-center group hover:scale-110 transition-transform duration-200'
                onClick={() => setPopup(false)}
              >
                <XIcon className='group-hover:rotate-y-[360deg]' />
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className='w-full flex flex-col gap-4'>
                <Label>Jenis Pengeluaran</Label>
                <Select
                  value={filterJenis}
                  onValueChange={e => {
                    setFilterJenis(e)
                  }}
                >
                  <SelectTrigger className='w-full py-6 px-3 border-slate-300 rounded-md text-slate-500'>
                    <SelectValue placeholder='Kategori Pengeluaran' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-none'>
                    <SelectGroup>
                      <SelectLabel>Kategori Pengeluaran</SelectLabel>
                      {categories?.map((c: any, i: number) => (
                        <SelectItem value={c.id} key={i}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full flex flex-col gap-4'>
                <Label htmlFor='decs'>total Biaya</Label>
                <Input
                  id='decs'
                  name='description'
                  type='text'
                  value={filterAmount? Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(Number(filterAmount))
                    : 'Rp.0'}
                  onChange={e => {
                  // Hapus semua karakter selain angka
                  const rawValue = e.target.value.replace(/[^0-9]/g, '')
                  // Simpan sebagai number (atau string angka) ke formik
                  setFilterAmount(Number(rawValue))
                }}
                  placeholder='Masukan keterangan'
                  className='border border-slate-300 rounded-md px-3 py-6 focus:outline-none focus:ring-2 '
                />
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setFilterJenis('')
                    setFilterAmount(0)
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
