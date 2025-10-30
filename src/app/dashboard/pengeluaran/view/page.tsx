'use client'

import TablePengeluaran from '@/components/fragments/table-pengeluaran'
import CardInformation from '@/components/fragments/dashboard/card-information'
import SearchDataTable from '@/components/fragments/dashboard/search-data-table'
import { CustomPagination } from '@/components/fragments/dashboard/custom-pagination'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { FaMoneyBill, FaRegFile } from 'react-icons/fa6'
import ExportPDFButton from '@/components/fragments/ExportPDFButton'
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
import { Download } from 'lucide-react'
import dayjs from 'dayjs'
import { useExpenseModule } from '@/hooks/use-expense'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PengeluaranViewPage () {
  const [showFilter, setShowFilter] = useState(false)
  const [showCount, setShowCount] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterJenis, setFilterJenis] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // state preview
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const { useGetExpenses } = useExpenseModule()
  const { data: expenses } = useGetExpenses()

  // Filter & Search
  const filteredData = expenses
    ?.filter((item: any) =>
      item?.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item: any) =>
      filterJenis ? item.jenisPengeluaran === filterJenis : true
    )

  const totalData = filteredData?.length ?? 0
  const totalJumlah =
    filteredData?.reduce((acc: number, curr: any) => acc + curr.amount, 0) ?? 0

  const totalPages = Math.ceil(totalData / showCount)
  const paginated = useMemo(() => {
    return filteredData?.slice(
      (currentPage - 1) * showCount,
      currentPage * showCount
    )
  }, [filteredData, currentPage, showCount])

  // ✅ generate PDF tapi untuk preview
  const generatePDFPreview = (data: any[], summary: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    doc.setFontSize(16)
    doc.text('LAPORAN PENGELUARAN', 105, 15, { align: 'center' })
    doc.setFontSize(11)
    doc.text(`Tanggal Export: ${summary.tanggalExport}`, 14, 25)
    doc.text(`Total Data: ${summary.totalData}`, 14, 31)
    doc.text(
      `Total Jumlah: Rp ${summary.totalJumlah.toLocaleString('id-ID')}`,
      14,
      37
    )

    doc.line(14, 40, 196, 40)

    const tableColumn = [
      'No',
      'Keterangan',
      'Jenis',
      'Periode',
      'Nominal (Rp)',
      'Tanggal'
    ]

    const tableRows = data.map((item, index) => [
      index + 1,
      item.description,
      item.category?.name || '-',
      item.category?.periode || '-',
      new Intl.NumberFormat('id-ID').format(item.amount),
      dayjs(item.createdAt).format('DD/MM/YYYY')
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.setFontSize(10)
    doc.text('Mengetahui,', 14, finalY + 8)
    doc.text('_____________________', 14, finalY + 25)
    doc.text('Bendahara', 14, finalY + 32)

    const pdfBlob = doc.output('blob')
    const url = URL.createObjectURL(pdfBlob)
    return { doc, url }
  }

  // ✅ handler tombol export
  const handleExportPDF = () => {
    const data = filteredData || []
    const summary = {
      totalData,
      totalJumlah,
      tanggalExport: dayjs().format('DD MMMM YYYY HH:mm')
    }

    if (!data.length) {
      alert('Tidak ada data untuk diexport.')
      return
    }

    const { url } = generatePDFPreview(data, summary)
    setPreviewURL(url)
    setShowPreview(true)
  }

  // ✅ download dari preview
  const handleDownloadPDF = () => {
    const data = filteredData || []
    const summary = {
      totalData,
      totalJumlah,
      tanggalExport: dayjs().format('DD MMMM YYYY HH:mm')
    }
    const { doc } = generatePDFPreview(data, summary)
    doc.save(`laporan-pengeluaran-${dayjs().format('YYYY-MM-DD')}.pdf`)
    setShowPreview(false)
  }

  return (
    <div className='min-h-full bg-gray-100 flex flex-col items-center py-8'>
      {/* Info Cards */}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <CardInformation
          color='blue'
          title='Total Data'
          value={totalData}
          icon={<FaRegFile size={40} className='text-blue-400' />}
        />
        <CardInformation
          color='green'
          title='Total Jumlah'
          value={'Rp. ' + totalJumlah.toLocaleString('id-ID')}
          icon={<FaMoneyBill size={40} className='text-green-400' />}
        />
      </div>

      {/* Search & Filter */}
      <div className='w-full mb-4'>
        <SearchDataTable
          title='Managemet Pengeluaran'
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type='normal'
        />
      </div>

      {/* Tombol Export */}
      <div className='w-full flex justify-end mb-4'>
        <ExportPDFButton onExport={handleExportPDF} />
      </div>

      {/* Table */}
      <div className='w-full'>
        <div className='rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4'>
          <Table className='w-full text-gray-700'>
            <TableHeader className='text-sm font-semibold text-center'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jenis Pengeluaran</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-sm divide-y divide-gray-200 text-center'>
              {paginated?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-gray-400'>
                    Tidak ada data yang terbaca
                  </TableCell>
                </TableRow>
              ) : (
                paginated?.map((s: any, idx: number) => (
                  <TableRow key={s.id}>
                    <TableCell>{(currentPage - 1) * showCount + (idx + 1)}</TableCell>
                    <TableCell className='font-medium'>{s.description}</TableCell>
                    <TableCell>{s.category.name}</TableCell>
                    <TableCell>{s.category.periode}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(s.amount)}
                    </TableCell>
                    <TableCell>{dayjs(s.createdAt).format('DD MMM YYYY')}</TableCell>
                    <TableCell className='flex gap-2 justify-center'>
                      <Link href={`/dashboard/pengeluaran/category/update/${s.id}`}>
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

          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ===== PREVIEW POPUP ===== */}
      <AnimatePresence>
        {showPreview && previewURL && (
          <motion.div
            className='fixed inset-0 bg-black/60 z-50 flex justify-center items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-white rounded-xl shadow-lg w-[90%] md:w-[80%] lg:w-[70%] h-[85%] flex flex-col overflow-hidden'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {/* Header */}
              <div className='flex justify-between items-center px-6 py-4 border-b'>
                <h2 className='text-lg font-semibold'>Preview Laporan Pengeluaran</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className='text-gray-500 hover:text-gray-700 text-2xl leading-none'
                  title='Tutup preview'
                >
                  ✕
                </button>
              </div>

              {/* Iframe body */}
              <div className='flex-1 bg-gray-50'>
                <iframe
                  src={previewURL}
                  className='w-full h-full border-none rounded-b-xl'
                  title='PDF Preview'
                />
              </div>

              {/* Footer buttons */}
              <div className='flex justify-end gap-3 px-6 py-4 border-t bg-white'>
                <Button variant='outline' onClick={() => setShowPreview(false)}>
                  Batal
                </Button>
                <Button
                  className='bg-red-500 hover:bg-red-600 text-white'
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
