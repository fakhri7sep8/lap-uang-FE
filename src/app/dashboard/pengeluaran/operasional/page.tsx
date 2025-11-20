'use client'

import { useState, useMemo, useCallback } from 'react'
import { GraduationCap, Users } from 'lucide-react'
import CardInformation from '@/components/fragments/dashboard/card-information'
import TablePengeluaran from '@/components/fragments/pengeluaran/table'
import SearchInput from '@/components/fragments/pengeluaran/seraach_andinput'
import { useExpenseModule } from '@/hooks/expense/useExpense'
import ExportPDFButton from '@/components/fragments/ExportPDFButton'          // 🔥 EXPORT ADDED
import ReportPdfTemplate from '@/components/template/pengeluaran/ReportPdfTemplate' // 🔥 EXPORT ADDED
import { AnimatePresence, motion } from 'framer-motion'                    // 🔥 EXPORT ADDED
import dayjs from 'dayjs'                                                  // 🔥 EXPORT ADDED

const OperasionalPage = () => {
  const [activeTab, setActiveTab] = useState('Pembangunan')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 🔥 EXPORT STATES
  const [showPreview, setShowPreview] = useState(false)

  const tabs = ['Pembangunan', 'Sarana']

  const { useGetExpense } = useExpenseModule()
  const { data: expenses, isLoading, isError } = useGetExpense('operasional')

  // ============================
  // FILTER
  // ============================
  const filteredData = useMemo(() => {
    if (!expenses?.data) return []

    const search = searchTerm.toLowerCase()

    return expenses.data.filter((item: any) => {
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search)

      const matchTab =
        activeTab === 'Pembangunan'
          ? item?.subCategoryId === 1
          : item?.subCategoryId === 2

      return matchSearch && matchTab
    })
  }, [expenses, searchTerm, activeTab])


  // ============================================================
  // 🔥 EXPORT: Generate data bulanan (sesuai template PDF)
  // ============================================================
  const dataPerBulan: Record<string, any> = {}
  filteredData.forEach((row: any) => {
    const d = new Date(row.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    dataPerBulan[key] = {
      tanggal: row.createdAt,
      nominal: (dataPerBulan[key]?.nominal || 0) + row.amount,
      jenis: row.category?.name,
    }
  })

  const totalJumlah = filteredData.reduce((acc: number, curr: any) => acc + curr.amount, 0)

  // ============================================================
  // 🔥 EXPORT: Buka PREVIEW
  // ============================================================
  const handleOpenPreview = useCallback(async () => {
    setShowPreview(true)
  }, [])

  // ============================================================
  // 🔥 EXPORT: DOWNLOAD PDF
  // ============================================================
  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById('report-pdf')
    if (!element) return

    const html2pdf = (await import('html2pdf.js')).default

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-operasional-${dayjs().format('YYYY-MM-DD')}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()

    setShowPreview(false)
  }, [])


  return (
    <div className="min-h-screen flex flex-col gap-10 items-center py-7">

      {/* ======================================================
          🔥 EXPORT: HIDDEN TEMPLATE (UNTUK DIEXPORT PDF)
      ====================================================== */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN PENGELUARAN OPERASIONAL"
          sectionLabel={`Detail Pengeluaran (${activeTab})`}
          headerLogoUrl="/img/Logo.png"
          sekolah={{
            nama: 'SMK MADINATUL QURAN',
            alamat: 'KP KEBON KELAPA, JAWA BARAT',
          }}
          tahunAjaranMulai={2024}
          dataPerBulan={dataPerBulan}
          totalPengeluaran={totalJumlah}
          tanggalCetak={dayjs().format('DD MMMM YYYY')}
        />
      </div>

      {/* ======================================================
          🔥 EXPORT: MODAL PREVIEW
      ====================================================== */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Preview Laporan</h2>
                <button className="text-gray-500 text-xl" onClick={() => setShowPreview(false)}>
                  ✕
                </button>
              </div>

              <div className="p-5 bg-gray-50">
                <div id="report-pdf" className="bg-white shadow-md mx-auto border border-gray-200">
                  <ReportPdfTemplate
                    title="LAPORAN PENGELUARAN OPERASIONAL"
                    sectionLabel={`Detail Pengeluaran (${activeTab})`}
                    headerLogoUrl="/img/Logo.png"
                    sekolah={{
                      nama: 'SMK MADINATUL QURAN',
                      alamat: 'KP KEBON KELAPA, JAWA BARAT',
                    }}
                    tahunAjaranMulai={2024}
                    dataPerBulan={dataPerBulan}
                    totalPengeluaran={totalJumlah}
                    tanggalCetak={dayjs().format('DD MMMM YYYY')}
                  />
                </div>
              </div>

              <div className="p-4 flex justify-end gap-3 border-t">
                <button className="px-4 py-2 border rounded-lg" onClick={() => setShowPreview(false)}>
                  Batal
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ================================
          UI NORMAL PAGE (TIDAK DIUBAH)
      ================================ */}
      <section className="w-full grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={expenses?.data?.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Data Terfilter"
          value={filteredData?.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      <div className="w-full max-w-6xl rounded-3xl">
        <div className="px-3">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Data Pengeluaran Sekolah
          </h1>
          <p className="text-gray-500 mb-6">
            Data pengeluaran operasional dan sarana sekolah.
          </p>
        </div>


        {/* 🔥 EXPORT BUTTON */}
        <div className="w-full flex justify-end mb-4 pr-3">
          <ExportPDFButton
            label="Export PDF"
            onExport={async () => {
              handleOpenPreview()
              return true
            }}
          />
        </div>


        {/* TABS + TABLE */}
        <div className="flex flex-col gap-2 p-2">

          <div className="flex gap-2 mb-[-7]">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 font-medium rounded-t-xl transition-all duration-300 shadow-sm ${
                  activeTab === tab
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'bg-[#dfe6f4] text-gray-600 hover:bg-[#e6ebf7]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl">
            <SearchInput
              onChange={(e: any) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />

            {isLoading ? (
              <p className="text-center text-gray-500 py-6">Memuat data...</p>
            ) : isError ? (
              <p className="text-center text-red-500 py-6">Gagal memuat data pengeluaran.</p>
            ) : filteredData.length === 0 ? (
              <p className="text-center text-gray-400 py-6">Tidak ada data ditemukan.</p>
            ) : (
              <TablePengeluaran title="Operasional" data={filteredData} />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default OperasionalPage
