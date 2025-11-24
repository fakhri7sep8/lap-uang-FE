import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'

// ✅ Fungsi utility generate PDF pengeluaran
export const generatePDFPengeluaran = (data: any[], summary: any) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // HEADER
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

  // Garis pemisah
  doc.line(14, 40, 196, 40)

  // TABEL DATA
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
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      halign: 'center'
    },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  })

  // FOOTER
  const finalY = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(10)
  doc.text('Mengetahui,', 14, finalY + 8)
  doc.text('_____________________', 14, finalY + 25)
  doc.text('Bendahara', 14, finalY + 32)

  // Simpan file
  doc.save(`laporan-pengeluaran-${dayjs().format('YYYY-MM-DD')}.pdf`)
}
