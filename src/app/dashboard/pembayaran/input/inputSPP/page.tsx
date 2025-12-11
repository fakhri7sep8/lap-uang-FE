/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import React, { useEffect, useState } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useStudentModule } from '@/hooks/useStudentModule'
import { useSppPaymentModule } from '@/hooks/use-spp-payment'
import { Label } from '@/components/ui/label'
import { ArrowRightCircle, FileDown, Send } from 'lucide-react'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { readerExcel } from '@/helper/excelReader'

const bulanList = [
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

const bulanListTable = [...bulanList]

const InputSPPPage = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>('')
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [yearSPP, setYearSPP] = useState(
    `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  )

  const { useGetStudent } = useStudentModule()
  const { data: siswaMQ } = useGetStudent()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { useCreateSPPPayment, useGetByStudentID } = useSppPaymentModule()
  const { mutate: createSPPPayment } = useCreateSPPPayment()

  const siswa = siswaMQ?.find(
    (s: any) => s.InductNumber === selectedSiswa || s.name === selectedSiswa
  )

  const {
    data: sppPayments,
    refetch: refetchSppPayments,
    isLoading: isLoadingSpp
  } = useGetByStudentID(siswa?.id, yearSPP)

  useEffect(() => {
    setSelectedMonths([])
    setTimeout(() => refetchSppPayments(), 50)
  }, [siswa, yearSPP])

  // Auto pilih bulan pertama yg belum lunas
  useEffect(() => {
    if (siswa && sppPayments?.spp) {
      const bulanBelum = bulanList.find(b => {
        const status = sppPayments.spp.find((p: any) => p.month === b)
        return !status || status.status !== 'LUNAS'
      })
      bulanBelum && setSelectedMonths([bulanBelum])
    }
  }, [siswa, sppPayments])

  const toggleMonth = (bulan: string) => {
    setSelectedMonths(prev =>
      prev.includes(bulan) ? prev.filter(x => x !== bulan) : [...prev, bulan]
    )
  }

  const handleImportClick = () => {
    Swal.fire({
      title: 'Apakah anda sudah mengetahui cara menggunakan fitur ini?',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Lanjut pilih file',
      denyButtonText: 'Download Format',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        document.getElementById('file')?.click()
      } else if (result.isDenied) {
        downloadTemplateSPP()
      }
    })
  }

  const getNominalSPP = () => {
    if (!siswa?.tipeProgram) return 2500000
    return siswa?.tipeProgram === 'FULLDAY' ? 1000000 : 2500000
  }

  const router = useRouter()

  const startYear = siswa?.InductYear || new Date().getFullYear()
  const yearOptions = [0, 1, 2].map(
    i => `${startYear + i}/${startYear + i + 1}`
  )

  const downloadTemplateSPP = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        Nama: '',
        Bulan: '',
        Nominal: 2500000,
        Status: ''
      }
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template SPP')
    XLSX.writeFile(wb, 'Template-SPP.xlsx')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!siswa) return

    setIsSubmitting(true)

    try {
      await Promise.all(
        selectedMonths.map(
          bulan =>
            new Promise<void>(resolve => {
              createSPPPayment(
                {
                  payload: {
                    studentId: siswa.id,
                    month: bulan,
                    year: yearSPP,
                    nominal: getNominalSPP(),
                    status: 'LUNAS'
                  }
                },
                {
                  onSuccess: () => resolve(),
                  onError: () => resolve()
                }
              )
            })
        )
      )

      setSelectedMonths([])
      refetchSppPayments()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReadExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const result = await readerExcel(event)
      if (!result) return

      console.log('📘 [STEP 1] Data Excel Diterima:', result.json)

      const siswaList = siswaMQ?.map((s: any) => s.name.toLowerCase().trim())
      const invalidRows = result.json.filter(
        (row: any) => !siswaList.includes((row.Nama || '').toLowerCase().trim())
      )

      if (invalidRows.length > 0) {
        console.warn('❌ [STEP 1.5] Nama siswa tidak ditemukan:', invalidRows)
        Swal.fire({
          icon: 'error',
          title: 'Nama siswa tidak ditemukan',
          text: invalidRows.map((r: any) => r.Nama).join(', ')
        })
        return
      }

      Swal.fire({
        title: 'Mengimpor data...',
        text: 'Mohon tunggu, sedang memproses file Excel kamu',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })

      const bulanOrder = [
        'juli',
        'agustus',
        'september',
        'oktober',
        'november',
        'desember',
        'januari',
        'februari',
        'maret',
        'april',
        'mei',
        'juni'
      ]

      const skippedRows: string[] = []
      const blockedRows: string[] = []
      const successRows: string[] = []

      console.log('📆 [STEP 2] Mulai proses import...')

      // cache lunas sementara
      const tempPaid = new Set<string>()

      for (const row of result.json) {
        const namaExcel = (row.Nama || '').trim().toLowerCase()
        const bulanExcel = (row.Bulan || '').trim().toLowerCase()
        const nominalExcel = Number(row.Nominal)
        const statusExcel = (row.Status || 'LUNAS').trim().toLowerCase()

        const siswaMatch = siswaMQ.find(
          (s: any) => s.name.toLowerCase() === namaExcel
        )
        if (!siswaMatch) continue

        const bulanIdx = bulanOrder.indexOf(bulanExcel)
        if (bulanIdx === -1) continue

        const paymentsForStudent = sppPayments?.spp?.filter(
          (p: any) => p.studentId === siswaMatch.id
        )

        // --- CEK BULAN SUDAH LUNAS (DB + TEMP) ---
        const sudahLunas =
          paymentsForStudent?.some(
            (p: any) =>
              p.month.toLowerCase() === bulanExcel && p.status === 'LUNAS'
          ) || tempPaid.has(`${siswaMatch.id}-${bulanExcel}`)

        if (sudahLunas) {
          skippedRows.push(`${row.Nama} - ${row.Bulan} (Sudah Lunas)`)
          continue
        }

        // --- CEK BULAN SEBELUMNYA ---
        const bulanSebelumnya = bulanOrder.slice(0, bulanIdx)
        const belumLunasSebelumnya = bulanSebelumnya.filter(bulan => {
          const paidInDB = paymentsForStudent?.some(
            (p: any) => p.month.toLowerCase() === bulan && p.status === 'LUNAS'
          )
          const paidInTemp = tempPaid.has(`${siswaMatch.id}-${bulan}`)
          return !(paidInDB || paidInTemp)
        })

        if (belumLunasSebelumnya.length > 0) {
          blockedRows.push(
            `${row.Nama} - ${
              row.Bulan
            } (Belum bayar ${belumLunasSebelumnya.join(', ')})`
          )
          continue
        }

        // --- ✅ SUDAH VALID, KIRIM ---
        await createSPPPayment({
          payload: {
            studentId: siswaMatch.id,
            month: capitalize(bulanExcel),
            year: yearSPP,
            nominal: nominalExcel,
            status: statusExcel.toUpperCase()
          },
          silent: true
        })

        // simpan ke cache
        tempPaid.add(`${siswaMatch.id}-${bulanExcel}`)
        successRows.push(`${row.Nama} - ${row.Bulan}`)
      }

      console.log('📊 [STEP 3] Hasil akhir import:', {
        successRows,
        skippedRows,
        blockedRows
      })

      await refetchSppPayments()
      Swal.close()

      if (blockedRows.length > 0 || skippedRows.length > 0) {
        let message = ''
        if (skippedRows.length > 0) {
          message += `❗ Dilewati karena sudah lunas:\n${skippedRows.join(
            '\n'
          )}\n\n`
        }
        if (blockedRows.length > 0) {
          message += `🚫 Tidak bisa diimpor karena bulan sebelumnya belum lunas:\n${blockedRows.join(
            '\n'
          )}`
        }

        Swal.fire({
          icon: 'warning',
          title: 'Sebagian Data Tidak Diimpor',
          text: message,
          customClass: { popup: 'text-left whitespace-pre-wrap' }
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Semua data pembayaran berhasil diimpor.'
        })
      }

      event.target.value = ''
    } catch (error) {
      console.error('❌ [ERROR] Import Excel gagal:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membaca File',
        text: 'Pastikan format Excel sesuai template (Nama, Bulan, Nominal, Status)!'
      })
    }
  }

  function capitalize (str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <div className='p-8 w-full flex justify-center flex-col'>
      {/* Navigation Buttons */}
      <div className='flex flex-row gap-6 mb-8 w-full'>
        <div
          onClick={() => router.push('/dashboard/pembayaran/input/inputSPP')}
          className='flex-1 py-4 flex items-center justify-center gap-2 bg-orange-500 text-white border border-orange-500 text-lg rounded-xl cursor-pointer 
             hover:bg-white hover:text-orange-500 transition'
        >
          <ArrowRightCircle size={24} />
          Input Pembayaran SPP
        </div>

        <div
          onClick={() => router.push('/dashboard/pembayaran/input/inputNonSpp')}
          className='flex-1 py-4 flex items-center justify-center gap-2 border border-orange-500 text-orange-500 text-lg rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white transition'
        >
          <ArrowRightCircle size={24} />
          Input Pembayaran Non-SPP
        </div>
      </div>
      <section className='bg-white shadow-md rounded-2xl p-6 w-full flex flex-col gap-4'>
        <h1 className='text-2xl font-semibold mb-4'>Input Pembayaran SPP</h1>

        {/* Pilih Siswa */}
        <div className='flex gap-6 mb-4'>
          <div className='w-1/2 '>
            <label className='block mb-1'>Nama Siswa</label>
            <Combobox
              options={siswaMQ?.map((s: any) => ({
                label: s.name,
                value: s.name
              }))}
              value={siswa?.name}
              onChange={setSelectedSiswa}
              placeholder='Pilih siswa'
            />
          </div>
          <div className='w-1/2 '>
            <label className='block mb-1'>No Induk</label>
            <Combobox
              options={siswaMQ?.map((s: any) => ({
                label: s.InductNumber,
                value: s.InductNumber
              }))}
              value={siswa?.InductNumber}
              onChange={setSelectedSiswa}
              placeholder='Pilih No Induk'
            />
          </div>
        </div>

        {/* Tahun Ajaran */}
        <div className='flex w-full flex-col gap-2 mb-4'>
          <label className='text-sm font-medium'>Tahun Ajaran</label>
          <Select
            defaultValue={yearOptions[0]}
            onValueChange={val => {
              setYearSPP(val)
              setTimeout(() => refetchSppPayments(), 10)
            }}
          >
            <SelectTrigger className='w-full py-6'>
              <SelectValue placeholder='Pilih tahun ajaran' />
            </SelectTrigger>
            <SelectContent className='bg-gray-50 border-slate-300'>
              <SelectGroup>
                <SelectLabel>Tahun Ajaran</SelectLabel>
                {yearOptions.map((val, idx) => (
                  <SelectItem key={idx} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* History SPP */}
        <div className='w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white mb-4'>
          {isLoadingSpp ? (
            <div className='p-5 space-y-4'>
              <div className='flex justify-between mb-2'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-5 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md animate-pulse'
                  ></div>
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className='flex justify-between items-center py-3 border-t border-slate-100'
                >
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div
                      key={j}
                      className='h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md animate-pulse'
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <Table className='w-full'>
              <TableHeader>
                <TableRow className='bg-slate-50'>
                  <TableHead className='text-center font-semibold text-slate-700'>
                    Bulan
                  </TableHead>
                  <TableHead className='text-center font-semibold text-slate-700'>
                    Nominal
                  </TableHead>
                  <TableHead className='text-center font-semibold text-slate-700'>
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sppPayments?.spp
                  ?.slice()
                  ?.sort(
                    (a: any, b: any) =>
                      bulanListTable.indexOf(a.month) -
                      bulanListTable.indexOf(b.month)
                  )
                  .map((item: any, i: number) => (
                    <TableRow
                      key={i}
                      className='hover:bg-slate-50 transition-colors'
                    >
                      <TableCell className='text-center'>
                        {item.month}
                      </TableCell>
                      <TableCell className='text-center'>
                        Rp {item.nominal.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className='text-center'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'LUNAS'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pilih Bulan */}
        <div className='flex flex-col gap-3 mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Checkbox
              checked={
                selectedMonths.length ===
                bulanList.filter(
                  bulan =>
                    !sppPayments?.spp?.some(
                      (s: any) =>
                        s.month === bulan &&
                        s.studentId === siswa?.id &&
                        s.status === 'LUNAS'
                    )
                ).length
              }
              onCheckedChange={checked => {
                if (checked) {
                  const belumLunas = bulanList.filter(
                    bulan =>
                      !sppPayments?.spp?.some(
                        (s: any) =>
                          s.month === bulan &&
                          s.studentId === siswa?.id &&
                          s.status === 'LUNAS'
                      )
                  )
                  setSelectedMonths(belumLunas)
                } else {
                  setSelectedMonths([])
                }
              }}
            />
            <Label className='text-sm font-medium'>Pilih Semua Bulan</Label>
          </div>

          <div className='grid grid-cols-3 gap-2'>
            {bulanList.map((bulan, idx) => {
              const sudahBayar = sppPayments?.spp?.some(
                (s: any) =>
                  s.month === bulan &&
                  s.studentId === siswa?.id &&
                  s.status === 'LUNAS'
              )

              const bulanSebelumnya = bulanList[idx - 1]
              const harusDisable =
                sudahBayar ||
                (idx > 0 &&
                  !selectedMonths.includes(bulanSebelumnya) &&
                  !sppPayments?.spp?.some(
                    (s: any) =>
                      s.month === bulanSebelumnya &&
                      s.studentId === siswa?.id &&
                      s.status === 'LUNAS'
                  ))

              return (
                <label
                  key={bulan}
                  className={`flex items-center gap-2 border p-2 rounded-md transition-colors ${
                    sudahBayar
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : ''
                  }${harusDisable && !sudahBayar ? 'opacity-50' : ''}`}
                >
                  <Checkbox
                    disabled={harusDisable}
                    checked={sudahBayar || selectedMonths.includes(bulan)}
                    onCheckedChange={() => toggleMonth(bulan)}
                    className={`${
                      sudahBayar
                        ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white'
                        : ''
                    }`}
                  />
                  {bulan}
                </label>
              )
            })}
          </div>
          {/* Total Nominal */}
          <div className='flex flex-col mt-4'>
            <label className='text-sm font-medium mb-1'>Total tagihan</label>
            <div className='w-full border rounded-md p-4 border-slate-300'>
              <p className='font-semibold text-lg'>
                Rp.{' '}
                {(getNominalSPP() * selectedMonths.length).toLocaleString(
                  'id-ID'
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col items-end gap-4 mt-4'>
            {/* Submit Button */}

            <button
              type='submit'
              disabled={!siswa || isSubmitting}
              className={`w-full py-5 border text-lg flex items-center justify-center gap-2 rounded-xl transition-all ${
                !siswa || isSubmitting
                  ? 'cursor-not-allowed bg-gray-200 text-gray-600 border-gray-300'
                  : 'cursor-pointer border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
              }`}
            >
              <Send size={24} />
              {isSubmitting ? 'Sedang menyimpan...' : 'Simpan Pembayaran'}
            </button>

            {/* Download Template */}
            <button
              type='button'
              onClick={downloadTemplateSPP}
              className='w-full py-5 hover:bg-blue-500 hover:text-white transition-all cursor-pointer border border-blue-500 text-blue-500 text-lg flex items-center justify-center gap-2 rounded-xl'
            >
              <FileDown size={24} />
              Download format excel
            </button>

            {/* Impor dari Excel */}
            <button
              type='button'
              onClick={handleImportClick}
              className='w-full py-5 hover:bg-purple-500 hover:text-white transition-all cursor-pointer border border-purple-500 text-purple-500 text-lg flex items-center justify-center gap-2 rounded-xl'
            >
              <FileDown size={24} />
              Impor dari Excel
            </button>

            {/* Input file hidden */}
            <input
            title='file'
              id='file'
              type='file'
              accept='.xlsx, .xls'
              className='hidden'
              onChange={handleReadExcel}
            />
          </div>
        </form>
      </section>
    </div>
  )
}

export default InputSPPPage
