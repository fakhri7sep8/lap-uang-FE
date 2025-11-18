// lib/spp-months.ts

export type AcademicMonth = {
  key: string // contoh: "2025-07"
  label: string // contoh: "Juli"
  year: number
  month: number
}

/**
 * Menghasilkan daftar 12 bulan tahun ajaran:
 * Dari Juli (startYear) sampai Juni (startYear + 1)
 */
export const getAcademicMonths = (startYear: number): AcademicMonth[] => {
  const NAMA_BULAN_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  // urutan tahun ajaran: Juli–Juni
  const ORDER = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]

  return ORDER.map((monthIndex) => {
    const year = monthIndex >= 6 ? startYear : startYear + 1
    const monthNumber = monthIndex + 1
    const key = `${year}-${String(monthNumber).padStart(2, '0')}`

    return {
      key,
      label: NAMA_BULAN_ID[monthIndex],
      year,
      month: monthNumber
    }
  })
}
