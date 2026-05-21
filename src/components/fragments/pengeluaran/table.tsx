'use client'

import React from 'react'
import { Pencil, Eye, Download, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useExpenseModule } from '@/hooks/expense/useExpense'
import Swal from 'sweetalert2'

export default function TablePengeluaran ({
  title,
  data: propData,
  menu
}: {
  title: string
  menu: string
  data?: any[]
}) {
  const router = useRouter()

  const { useSoftDeleteExpense } = useExpenseModule()
  const { mutate: softDeleteExpense } = useSoftDeleteExpense()

  // Default internal data (kept for backward compatibility)
  const internalData = [
    {
      id: 1,
      tanggal: '2025-10-29',
      nama: 'Bayar Listrik',
      penanggungJawab: 'Pak Dimas',
      kategori: 'Pemeliharaan',
      subKategori: 'Listrik',
      jumlah: 500000,
      status: 'Selesai'
    },
    {
      id: 2,
      tanggal: '2025-10-29',
      nama: 'Gaji Guru Honorer',
      penanggungJawab: 'Pak Hadi',
      kategori: 'Upah Karyawan',
      subKategori: 'Guru',
      jumlah: 2500000,
      status: 'Selesai'
    },
    {
      id: 3,
      tanggal: '2025-10-29',
      nama: 'Langganan Internet',
      penanggungJawab: 'Bu Sinta',
      kategori: 'Pemeliharaan',
      subKategori: 'Internet',
      jumlah: 450000,
      status: 'Proses'
    }
  ]

  // If parent passed data, use it; otherwise fall back to internalData
  const data = propData ?? internalData

  const handleSoftDelete = (id: string) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: 'Penghapusan ini bersifat SOFT DELETE dan bisa dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        softDeleteExpense({ id, isDelete: true })
      }
    })
  }

  const formatTanggal = (dateString: string) => {
    if (!dateString) return '-'

    const date = new Date(dateString)

    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleDownloadPDFPengeluaran = (item: any) => {
    const doc = new jsPDF()

    const title = `PENGELUARAN UNTUK ${item.category?.name?.toUpperCase()} SEKTOR ${item.subCategory?.name?.toUpperCase()}`

    // ===============================
    // HEADER
    // ===============================
    doc.setFontSize(16)
    doc.text('SMK MADINATUL QURAN', 105, 15, { align: 'center' })

    doc.setFontSize(10)
    doc.text('KP KEBON KELAPA JLN SINGASARI, JAWA BARAT, INDONESIA', 105, 21, {
      align: 'center'
    })

    doc.setFontSize(13)
    doc.text(title, 105, 32, { align: 'center' })

    // ===============================
    // HELPER UNTUK BARIS RAPIH
    // labelWidth menentukan posisi titik dua agar rata
    // ===============================
    const addRow = (label: string, value: string, y: number) => {
      const labelWidth = 40 // Semakin besar semakin ke kanan labelnya

      doc.setFontSize(11)
      doc.text(label, 20, y)

      doc.text(':', 20 + labelWidth, y)

      doc.text(value ?? '-', 20 + labelWidth + 3, y)
    }

    // ===============================
    // DETAIL DATA
    // ===============================
    let y = 45

    addRow('Tanggal', item.PayDate, y)
    y += 7

    addRow('Nama', item.description, y)
    y += 7

    addRow('Penanggung', item.PenanggungJawab, y)
    y += 7

    addRow('Kategori', item.category?.name, y)
    y += 7

    addRow('Sub Kategori', item.subCategory?.name, y)
    y += 7

    addRow('Sumber Dana', item.sumber_dana, y)

    // ===============================
    // TABEL JUMLAH + STATUS
    // ===============================
    const tableBody = [
      ['Jumlah Pengeluaran', `Rp ${item.amount.toLocaleString('id-ID')}`],
      ['Status', item.status]
    ]

    autoTable(doc, {
      startY: y + 12,
      head: [['Keterangan', 'Nilai']],
      body: tableBody,
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [200, 255, 200]
      }
    })

    const afterTable = (doc as any).lastAutoTable.finalY + 12

    // ===============================
    // FOOTNOTE
    // ===============================
    doc.setFontSize(10)
    doc.text('Catatan:', 20, afterTable)
    doc.text(
      '1. Kartu ini sebagai tanda pembayaran yang sah',
      20,
      afterTable + 6
    )
    doc.text(
      '2. Jika terdapat perbedaan data, hubungi petugas untuk dicek ulang',
      20,
      afterTable + 12
    )

    // ===============================
    // SAVE PDF
    // ===============================
    doc.save(
      `Pengeluaran-${item.category?.name}-${item.subCategory?.name}-${item.description}.pdf`
    )
  }

  return (
    <div className='p-5 bg-white rounded-xl shadow-sm'>
      <h2 className='text-base font-semibold mb-4 text-gray-800 flex items-center gap-2'>
        Data {title}
      </h2>

      <div className='overflow-x-auto'>
        <table className='w-full text-[12px] text-gray-700'>
          <thead>
            <tr className='bg-gray-100 text-gray-600 text-left font-medium'>
              <th className='py-2 px-2 text-center w-[3%]'>No</th>
              <th className='py-2 px-2 w-[10%]'>Tanggal Pengeluaran</th>
              <th className='py-2 px-2 w-[18%]'>Nama</th>
              <th className='py-2 px-2 w-[10%]'>Penanggung Jawab</th>
              <th className='py-2 px-2 w-[10%]'>Kategori</th>
              <th className='py-2 px-2 w-[10%]'>Prioritas</th>
              <th className='py-2 px-2 w-[10%] text-right'>Jumlah (Rp)</th>
              <th className='py-2 px-2 w-[10%] text-center'>Sumber Dana</th>
              <th className='py-2 px-2 w-[15%] text-center'>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item, index) => (
              <tr
                key={item.id}
                className='hover:bg-gray-50 transition-all text-[12px]'
              >
                <td className='py-2 px-2 text-center text-gray-600'>
                  {index + 1}
                </td>
                <td className='py-2 px-2'>{formatTanggal(item?.PayDate)}</td>
                <td className='py-2 px-2 font-medium text-gray-800'>
                  {item?.description}
                </td>
                <td className='py-2 px-2'>{item?.PenanggungJawab}</td>
                <td className='py-2 px-2'>{item?.category?.name}</td>
                <td className='py-2 px-2'>{item?.Prioritas}</td>
                <td className='py-2 px-2 text-left'>
                  Rp {item?.amount?.toLocaleString('id-ID')}
                </td>
                <td className='py-2 px-2 text-center'>
                  <span
                    className={`inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full `}
                  >
                    {item.sumber_dana}
                  </span>
                </td>
                <td className='py-2 px-2'>
                  <div className='flex justify-center'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => router.push(`update/${item?.id}`)}
                        title='Edit'
                        className='flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-sm hover:scale-105 bg-white group'
                      >
                        <Pencil
                          size={14}
                          className='text-blue-600 group-hover:text-blue-700 transition-colors'
                        />
                      </button>

                      <button
                        onClick={() => router.push(`detail/${item?.id}`)}
                        title='Detail'
                        className='flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all duration-150 ease-in-out hover:shadow-sm hover:scale-105 bg-white group'
                      >
                        <Eye
                          size={14}
                          className='text-green-600 group-hover:text-green-700 transition-colors'
                        />
                      </button>
                      <button
                        title='Download PDF'
                        className='flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all hover:shadow-sm hover:scale-105 bg-white group'
                        onClick={() => handleDownloadPDFPengeluaran(item)}
                      >
                        <Download
                          size={14}
                          className='text-purple-500 group-hover:text-purple-600'
                        />
                      </button>
                      <button
                        title='Soft Delete'
                        onClick={() => handleSoftDelete(item.id)}
                        className='flex items-center justify-center border border-gray-200 rounded-md p-1.5 transition-all hover:shadow-sm hover:scale-105 bg-white group'
                      >
                        <Trash2
                          size={14}
                          className='text-red-500 group-hover:text-red-600 transition-colors'
                        />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total footer
      <div className="flex justify-end mt-3 text-sm font-semibold text-gray-700">
        Total: Rp{" "}
        {data.reduce((sum, i) => sum + i.jumlah, 0).toLocaleString("id-ID")}
      </div> */}
    </div>
  )
}
