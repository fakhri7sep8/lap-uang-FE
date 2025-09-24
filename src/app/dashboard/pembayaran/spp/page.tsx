'use client'

import { Download, GraduationCap, Users } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import CardInformation from '@/components/fragments/dashboard/card-information'
import Swal from 'sweetalert2'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'
import Loader from '@/components/ui/loader'
import SearchDataTableSPP from '@/components/fragments/dashboard/search-data-table-spp'
import { useSppPaymentModule } from '@/hooks/use-spp-payment'

// daftar bulan global biar konsisten
const months = [
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni'
]

const SPP = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBulan, setFilterBulan] = useState('')
  const [filterTahun, setFilterTahun] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [draftBulan, setDraftBulan] = useState('')

  // ambil hooks dari module
  const { useGetRecapPayments, useDeletePayment } = useSppPaymentModule()
  const { data: payments, isLoading, isError } = useGetRecapPayments()
  const { mutate: deletePayment } = useDeletePayment()

  const filteredData = payments
    ?.filter((s: any) =>
      s?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.filter((s: any) =>
      filterBulan ? s[filterBulan.toLowerCase()] !== undefined : true
    ) || []


  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  )

  const getPaymentBadge = (status: string) => {
    const baseClass =
      'inline-block min-w-[90px] px-2 py-1 rounded-full text-xs font-medium text-center'
    if (status?.toUpperCase() === 'LUNAS') {
      return (
        <span className={`${baseClass} bg-green-100 text-green-500`}>
          {status}
        </span>
      )
    }
    return (
      <span className={`${baseClass} bg-yellow-100 text-yellow-500`}>
        {status || 'Belum Lunas'}
      </span>
    )
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
        deletePayment(id)
      }
    } catch (error) {
      console.error(error)
      Swal.fire('Error', 'Terjadi kesalahan saat menghapus data.', 'error')
    }
  }

  if (isLoading) {
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
    <section className="w-full min-h-[90vh] flex flex-col gap-10">
      {/* Kartu informasi */}
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color={'blue'}
          title={'Total Data'}
          value={filteredData.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={'green'}
          title={'Lunas'}
          value={filteredData.filter((s: any) => s.status === 'LUNAS').length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* Table */}
      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTableSPP
          title={'Data Pembayaran Spp'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />

        <div className="w-full h-full rounded-xl overflow-x-auto bg-white px-1 pt-2 pb-4">
          <Table className="w-full h-full table-auto bg-white text-gray-700">
            <TableHeader className="text-sm font-semibold text-center">
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                {filterBulan
                  ? <TableHead>{filterBulan}</TableHead>
                  : months.map(m => <TableHead key={m}>{m}</TableHead>)
                }
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-sm divide-y divide-gray-200 text-center">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-gray-400">
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((s: any, idx: number) => (
                  <TableRow key={s.id} className="hover:bg-gray-50 transition">
                    <TableCell>{(currentPage - 1) * showCount + idx + 1}</TableCell>
                    <TableCell className="font-medium">{s.nama}</TableCell>

                    {filterBulan
                      ? (
                        <TableCell>
                          {getPaymentBadge(s[filterBulan.toLowerCase()])}
                        </TableCell>
                      )
                      : months.map(m => (
                        <TableCell key={m}>
                          {getPaymentBadge(s[m.toLowerCase()])}
                        </TableCell>
                      ))
                    }

                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        className="bg-blue-500 hover:border-blue-600 hover:bg-white hover:text-blue-400 border text-white cursor-pointer"
                        onClick={() => {
                          Swal.fire({
                            title: "Download data?",
                            text: "Apakah kamu yakin ingin download file ini?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Ya, download",
                            cancelButtonText: "Batal",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire(
                                "Berhasil!",
                                "File berhasil didownload.",
                                "success"
                              );
                            }
                          });
                        }}
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
      </section>

      {/* Drawer Filter */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col gap-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Filter</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Bulan
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={draftBulan}
                    onChange={e => setDraftBulan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    {months.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setDraftBulan('')
                    setFilterBulan('')
                    setFilterTahun('')
                  }}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-gray-300"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => {
                    setFilterBulan(draftBulan)
                    setShowFilter(false)
                    setCurrentPage(1)
                  }}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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

export default SPP
