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
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  const [filterAngkatan, setFilterAngkatan] = useState('')
  const [draftAngkatan, setDraftAngkatan] = useState('')
  const [tahunAwal, setTahunAwal] = useState(new Date().getFullYear())
  const [tahunAkhir, setTahunAkhir] = useState(new Date().getFullYear() + 1)

  const [draftTahunAwal, setDraftTahunAwal] = useState('')
  const [draftTahunAkhir, setDraftTahunAkhir] = useState('')

  // ambil hooks dari module
  const { useGetRecapPayments, useDeletePayment } = useSppPaymentModule()
  const {
    data: payments,
    isLoading,
    isError,
    refetch
  } = useGetRecapPayments(tahunAwal, tahunAkhir)

  const angkatanList = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
  const { mutate: deletePayment } = useDeletePayment()

  const filteredData = (payments ?? [])
    ?.filter((s: any) =>
      s?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.filter((s: any) =>
      filterBulan ? s[filterBulan.toLowerCase()] !== undefined : true
    )
    ?.filter((s: any) =>
      filterAngkatan ? s?.generation?.toString() === filterAngkatan : true
    )

  const totalPages = Math.ceil(filteredData.length / showCount)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  )

  const handleDownloadAllPDF = () => {
    if (!payments || payments.length === 0) {
      Swal.fire('Oops!', 'Tidak ada data untuk diunduh.', 'warning')
      return
    }

    const doc = new jsPDF('l', 'mm', 'a4') // landscape agar muat banyak kolom
    doc.setFontSize(14)
    doc.text('REKAP PEMBAYARAN SPP - SMK MADINATUL QURAN', 148, 14, {
      align: 'center'
    })

    const head = [['No', 'Nama', ...months, 'Total Lunas', 'Total Kurang']]

    const body = payments.map((s: any, idx: number) => {
      const getSppNominal = () => {
        if (s.tipeProgram?.toUpperCase() === 'BOARDING') return 2500000
        if (s.tipeProgram?.toUpperCase() === 'FULLDAY') return 1000000
        return 0
      }

      const sppNominal = getSppNominal()

      const lunasMonths = months.filter(
        m => s[m.toLowerCase()]?.toUpperCase() === 'LUNAS'
      ).length

      const totalTagihan = months.length * sppNominal
      const totalLunas = lunasMonths * sppNominal
      const totalKurang = totalTagihan - totalLunas

      return [
        idx + 1,
        s.nama,
        ...months.map(m => s[m.toLowerCase()]?.toUpperCase() || 'BELUM_LUNAS'),
        `Rp ${totalLunas.toLocaleString('id-ID')}`,
        `Rp ${totalKurang.toLocaleString('id-ID')}`
      ]
    })

    autoTable(doc, {
      startY: 22,
      head,
      body,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 255, 240] }
    })

    doc.save(`Rekap-SPP-Semua-Siswa-${new Date().getTime()}.pdf`)
  }

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
  const handleDownloadPDF = (student: any) => {
    const doc = new jsPDF()

    // Helper nominal
    const getSppNominal = () => {
      if (student.tipeProgram?.toUpperCase() === 'BOARDING') return 2500000
      if (student.tipeProgram?.toUpperCase() === 'FULLDAY') return 1000000
      return 0
    }

    const sppNominal = getSppNominal()
    const lunasMonths = months.filter(
      m => student[m.toLowerCase()]?.toUpperCase() === 'LUNAS'
    ).length

    const totalTagihan = months.length * sppNominal
    const totalLunas = lunasMonths * sppNominal
    const totalKurang = totalTagihan - totalLunas

    // ===============================
    // HEADER
    // ===============================
    doc.setFontSize(16)
    doc.text('SMK MADINATUL QURAN', 105, 15, { align: 'center' })

    doc.setFontSize(10)
    doc.text('KP KEBON KELAPA JLN SINGASARI, JAWA BARAT, INDONESIA', 105, 21, {
      align: 'center'
    })

    // Title
    doc.setFontSize(13)
    doc.text('PEMBAYARAN SPP', 105, 33, { align: 'center' })

    // ===============================
    // DATA SISWA
    // ===============================
    let y = 45

    doc.setFontSize(11)
    doc.text(`Nama Siswa : ${student.nama}`, 20, y)
    y += 6
    doc.text(`No Induk    : ${student?.InductNumber}`, 20, y)
    y += 6
    doc.text(`Asrama      : ${student?.dorm}`, 20, y)
    y += 6
    doc.text(`Program     : ${student?.tipeProgram}`, 20, y)
    y += 6
    doc.text(
      `Nominal SPP : Rp ${sppNominal.toLocaleString('id-ID')} / bulan`,
      20,
      y
    )

    // ===============================
    // TABEL BULAN
    // ===============================
    const tableBody = months.map(m => {
      const key = m.toLowerCase()
      const status = (student[key] || 'BELUM_LUNAS').toUpperCase()
      return [m, status]
    })

    autoTable(doc, {
      startY: y + 10,
      head: [['Bulan', 'Status']],
      body: tableBody,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [0, 128, 0], // Hijau tua
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [200, 255, 200] // Hijau muda
      },
      bodyStyles: {
        fillColor: [255, 255, 255] // Putih
      }
    })

    const afterTable = (doc as any).lastAutoTable.finalY + 10

    // ===============================
    // TOTAL PEMBAYARAN
    // ===============================
    doc.setFontSize(12)
    doc.text(
      `Total Tagihan : Rp ${totalTagihan.toLocaleString('id-ID')}`,
      20,
      afterTable
    )
    doc.text(
      `Total Lunas   : Rp ${totalLunas.toLocaleString('id-ID')}`,
      20,
      afterTable + 7
    )
    doc.text(
      `Total Kurang  : Rp ${totalKurang.toLocaleString('id-ID')}`,
      20,
      afterTable + 14
    )

    // ===============================
    // FOOTNOTE TEMPLATE
    // (diambil dari PDF asli yang kamu upload)
    // ===============================
    const catatanStart = afterTable + 26

    doc.setFontSize(10)
    doc.text('Catatan:', 20, catatanStart)
    doc.text(
      '1. Kartu ini sebagai tanda pembayaran yang sah',
      20,
      catatanStart + 6
    )
    doc.text(
      '2. Jika terdapat perbedaan data, hubungi petugas untuk dicek ulang',
      20,
      catatanStart + 12
    )

    doc.save(`Pembayaran-SPP-${student.nama}.pdf`)
  }

  const handleDownloadExcel = () => {
    if (!payments || payments.length === 0) {
      Swal.fire('Oops!', 'Tidak ada data untuk diunduh.', 'warning')
      return
    }

    // Format data untuk Excel
    const excelData = payments.map((s: any, index: number) => {
      const row: any = {
        No: index + 1,
        Nama: s.nama
      }

      months.forEach(m => {
        const key = m.toLowerCase()
        row[m] = s[key] ? s[key].toUpperCase() : 'BELUM_LUNAS'
      })

      return row
    })

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data SPP')

    // Buat file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

    // Simpan file
    const fileName = `rekap-spp-${new Date().getTime()}.xlsx`
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    saveAs(blob, fileName)
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
          title={'Total Data'}
          value={filteredData.length}
          icon={<GraduationCap size={32} className='text-blue-500' />}
        />
        <CardInformation
          color={'green'}
          title={'Lunas'}
          value={filteredData.filter((s: any) => s.status === 'LUNAS').length}
          icon={<Users size={32} className='text-green-500' />}
        />
      </section>

      {/* Table */}
      <section className='w-full flex flex-col gap-6 h-full pb-6'>
        <SearchDataTableSPP
          title={'Data Pembayaran Spp'}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={'normal'}
        />
        
        <Button
          className='w-fit bg-red-600 hover:bg-red-700 text-white ml-2'
          onClick={handleDownloadAllPDF}
        >
          <Download size={16} className='mr-1' /> Export PDF Semua Data
        </Button>
        <div className='w-full h-full rounded-xl overflow-x-auto bg-white px-1 pt-2 pb-4'>
          <Table className='w-full h-full table-auto bg-white text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                {filterBulan ? (
                  <TableHead>{filterBulan}</TableHead>
                ) : (
                  months.map(m => <TableHead key={m}>{m}</TableHead>)
                )}
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-gray-400'>
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((s: any, idx: number) => (
                  <TableRow key={s.id} className='hover:bg-gray-50 transition'>
                    <TableCell>
                      {(currentPage - 1) * showCount + idx + 1}
                    </TableCell>
                    <TableCell className='font-medium'>{s.nama}</TableCell>

                    {filterBulan ? (
                      <TableCell>
                        {getPaymentBadge(s[filterBulan.toLowerCase()])}
                      </TableCell>
                    ) : (
                      months.map(m => (
                        <TableCell key={m}>
                          {getPaymentBadge(s[m.toLowerCase()])}
                        </TableCell>
                      ))
                    )}

                    <TableCell className='flex gap-2 justify-center'>
                      <Button
                        className='bg-blue-500 hover:bg-blue-600 text-white'
                        onClick={handleDownloadExcel}
                      >
                        <Download size={16} className='mr-1' /> Excel
                      </Button>
                      <Button
                        className='bg-green-600 hover:bg-green-700 text-white'
                        onClick={() => handleDownloadPDF(s)}
                      >
                        <Download size={16} className='mr-1' /> PDF
                      </Button>

                      {/* Not available */}
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
                  Bulan
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={draftBulan}
                    onChange={e => setDraftBulan(e.target.value)}
                  >
                    <option value=''>Semua</option>
                    {months.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='flex flex-col text-sm'>
                  Angkatan
                  <input
                    type='text'
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    placeholder='Contoh: 9'
                    value={draftAngkatan}
                    onChange={e => setDraftAngkatan(e.target.value)}
                  />
                </label>

                <label className='flex flex-col text-sm'>
                  Tahun Ajaran
                  <select
                    className='mt-1 border border-gray-300 rounded-md px-3 py-2'
                    value={
                      draftTahunAwal && draftTahunAkhir
                        ? `${draftTahunAwal}/${draftTahunAkhir}`
                        : ''
                    }
                    onChange={e => {
                      const [awal, akhir] = e.target.value.split('/')
                      setDraftTahunAwal(awal)
                      setDraftTahunAkhir(akhir)
                    }}
                  >
                    <option value=''>Pilih Tahun Ajaran</option>

                    {/* Generate otomatis dari tahun sekarang + 5 tahun */}
                    {Array.from({ length: 6 }).map((_, i) => {
                      const start = 2024 + i
                      const end = start + 1
                      return (
                        <option key={i} value={`${start}/${end}`}>
                          {start}/{end}
                        </option>
                      )
                    })}
                  </select>
                </label>
              </div>
              <div className='mt-auto flex flex-col gap-2'>
                <button
                  onClick={() => {
                    setDraftBulan('')
                    setFilterBulan('')
                    setFilterTahun('')
                    setDraftAngkatan('')
                    setFilterAngkatan('')
                  }}
                  className='w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-gray-300'
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => {
                    setFilterBulan(draftBulan)
                    setFilterAngkatan(draftAngkatan)

                    // tahun baru diterapkan
                    if (draftTahunAwal) setTahunAwal(Number(draftTahunAwal))
                    if (draftTahunAkhir) setTahunAkhir(Number(draftTahunAkhir))

                    setShowFilter(false)
                    setCurrentPage(1)
                  }}
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

export default SPP
