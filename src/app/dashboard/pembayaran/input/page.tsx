'use client'

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useStudentModule } from '@/hooks/useStudentModule'
import { useCategoryPaymentModule } from '@/hooks/use-categoryPayment'
import { useSppPaymentModule } from '@/hooks/use-spp-payment'
import { usePaymentModule } from '@/hooks/use-payment'

const siswaData = [
  { id: '2025A10934', name: 'Daffa Hafidzh Firdaus' },
  { id: '2025A10935', name: 'Ahmad Pratama' },
  { id: '2025A10936', name: 'Siti Aisyah' }
]

const sppData = [
  { bulan: 'Januari', nominal: 'Rp. 250.000', status: 'Lunas' },
  { bulan: 'Februari', nominal: 'Rp. 250.000', status: 'Belum Lunas' },
  { bulan: 'Maret', nominal: 'Rp. 250.000', status: 'Belum Lunas' }
]

const InputPembayaranpage = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>('')
  const [selectedKategori, setSelectedKategori] = useState<string>('spp')
  const [selectIDCateogry, setIDCategory] = useState<string>(
    '13dd5ec7-3c5b-4afb-b430-1ac1f1745c6d'
  )

  const [selectMonth, setSelectMonth] = useState<string>('')
  const [selectStatus, setSelectStatus] = useState<string>('LUNAS')
  const [methodPayments, setMethodPayments] = useState<string>('NORMAL')

  const { useGetStudent } = useStudentModule()
  const { data: siswaMQ, isLoading } = useGetStudent()

  const { useCreateSPPPayment } = useSppPaymentModule()
  const { mutate: createSPPPayment } = useCreateSPPPayment()

  const { useCreatePayment } = usePaymentModule()
  const { mutate: createPayments } = useCreatePayment()

  const { useGetCategory, useDetailCategory } = useCategoryPaymentModule()
  const { data: categoryMQ, isLoading: isLoadingKategori } = useGetCategory()
  const { data: detailCategoryMQ } = useDetailCategory(
    selectIDCateogry || '13dd5ec7-3c5b-4afb-b430-1ac1f1745c6d'
  )

  const siswa = siswaMQ?.find(
    (s: any) => s?.InductNumber === selectedSiswa || s?.name === selectedSiswa
  )

  // console.log(new Date().getMonth() + 1)

  const { useGetByStudentID } = useSppPaymentModule()
  const { data: sppPayments } = useGetByStudentID(siswa?.id)

  // useEffect(() => {
  //   if (selectedKategori !== 'spp') {
  //     setSelectStatus('BELUM LUNAS') // default kalau bukan spp
  //   } else if(selectedKategori == "spp") {
  //     setSelectStatus('BELUM_LUNAS')
  //   }
  // }, [selectedKategori])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (selectedKategori !== 'spp') {
      console.log('submit ke payments')

      console.log(selectIDCateogry);

      const paymentsDTO = {
        studentId: siswa?.id,
        date: `${new Date().toISOString()}`,
        amount: detailCategoryMQ?.data?.nominal,
        method: methodPayments,
        status: selectStatus == 'BELUM_LUNAS' ? 'BELUM LUNAS' : selectStatus,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        typeId: selectIDCateogry || ""
      }

      console.log(paymentsDTO)
      createPayments(paymentsDTO as any)
    } else {
      console.log('submit ke spp')

      const sppPaymentsDTO = {
        studentId: siswa?.id,
        month: selectMonth,
        year: new Date().getFullYear(),
        nominal: 2500000,
        status: selectStatus
      }

      console.log(sppPaymentsDTO)
      createSPPPayment.mutate(sppPaymentsDTO as any)
    }
  }
  // console.log(sppPayments?.spp)

  return (
    <div className='w-full flex justify-center items-center p-8'>
      <section className='w-full bg-white rounded-2xl shadow-md p-6'>
        <form onSubmit={(e: any) => handleSubmit(e)}>
          <div className='flex flex-col gap-6'>
            <h1 className='font-semibold text-2xl'>Input Pembayaran</h1>
            {/* Name + No Induk jadi Combobox */}
            <div className='flex flex-row gap-6'>
              <div className='flex flex-col w-1/2'>
                <label className='text-sm font-medium mb-1'>Nama Siswa</label>
                <Combobox
                  label='Nama Siswa'
                  options={siswaMQ?.map((s: any) => ({
                    label: s.name,
                    value: s.name
                  }))}
                  value={siswa?.name}
                  onChange={setSelectedSiswa}
                  placeholder='Pilih siswa'
                  className='w-full'
                  triggerClassName='border-slate-300'
                  contentClassName='bg-white shadow-lg'
                />
              </div>
              <div className='flex flex-col w-1/2'>
                <label className='text-sm font-medium mb-1'>
                  No induk Siswa
                </label>

                <Combobox
                  label='No Induk'
                  options={siswaMQ?.map((s: any) => ({
                    label: s.InductNumber,
                    value: s.name
                  }))}
                  value={siswa?.InductNumber}
                  onChange={setSelectedSiswa}
                  placeholder='Pilih siswa'
                  className='w-full'
                  triggerClassName='border-slate-300'
                  contentClassName='bg-white shadow-lg'
                />
              </div>
            </div>
            {/* Select kategori pembayaran */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-1'>
                Kategori Pembayaran
              </label>
              <Select
                defaultValue='spp'
                onValueChange={val => {
                  setSelectedKategori(val !== 'spp' ? '' : 'spp')
                  setIDCategory(val == 'spp' ? '' : val)
                }}
              >
                <SelectTrigger className='w-full py-6'>
                  <SelectValue placeholder='Pilih kategori' />
                </SelectTrigger>
                <SelectContent className='bg-gray-50 border-slate-300'>
                  <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    <SelectItem value='spp'>SPP</SelectItem>
                    {categoryMQ?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Jika kategori SPP, tampilkan tabel */}
            {selectedKategori === 'spp' && (
              <div className='flex flex-col'>
                <label className='text-sm font-medium mb-2'>Data SPP</label>
                <Table className='w-full border-collapse'>
                  <TableHeader>
                    <TableRow className='bg-gray-200'>
                      <TableHead className='text-left border border-gray-300'>
                        Bulan
                      </TableHead>
                      <TableHead className='text-left border border-gray-300'>
                        Nominal
                      </TableHead>
                      <TableHead className='text-left border border-gray-300'>
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sppPayments?.spp?.map((item: any, index: number) => (
                      <TableRow key={index} className='hover:bg-gray-100'>
                        <TableCell className='text-left border border-gray-300'>
                          {item.month}
                        </TableCell>
                        <TableCell className='text-left border border-gray-300'>
                          {item.nominal}
                        </TableCell>
                        <TableCell className='text-left border border-gray-300'>
                          {item.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {selectedKategori == 'spp' && (
              <div className='flex flex-col'>
                <label className='text-sm font-medium mb-1'>
                  Bulan pembayaran
                </label>
                <Select
                  defaultValue='Pilih Bulan'
                  onValueChange={val => {
                    setSelectMonth(val)
                  }}
                >
                  <SelectTrigger className='w-full py-6'>
                    <SelectValue placeholder='Pilih kategori' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-50 border-slate-300'>
                    <SelectGroup>
                      <SelectLabel>Bulan</SelectLabel>
                      <SelectItem value='Januari'>Januari</SelectItem>
                      <SelectItem value='Februari'>Februari</SelectItem>
                      <SelectItem value='Maret'>Maret</SelectItem>
                      <SelectItem value='April'>April</SelectItem>
                      <SelectItem value='Mei'>Mei</SelectItem>
                      <SelectItem value='Juni'>Juni</SelectItem>
                      <SelectItem value='Juli'>Juli</SelectItem>
                      <SelectItem value='Agustus'>Agustus</SelectItem>
                      <SelectItem value='September'>September</SelectItem>
                      <SelectItem value='Oktober'>Oktober</SelectItem>
                      <SelectItem value='November'>November</SelectItem>
                      <SelectItem value='Desember'>Desember</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-1'>
                Status Pembayaran
              </label>
              <Select
                defaultValue='Belum Lunas'
                onValueChange={val => {
                  setSelectStatus(val)
                }}
              >
                <SelectTrigger className='w-full py-6'>
                  <SelectValue placeholder='Pilih kategori' />
                </SelectTrigger>
                <SelectContent className='bg-gray-50 border-slate-300'>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value='LUNAS'>Lunas</SelectItem>
                    <SelectItem value='BELUM_LUNAS'>Belum Lunas</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedKategori !== 'spp' && (
              <div className='flex flex-col'>
                <label className='text-sm font-medium mb-1'>
                  Metode Pembayaran
                </label>
                <Select
                  defaultValue='Pilih Metode'
                  onValueChange={val => {
                    setMethodPayments(val)
                  }}
                >
                  <SelectTrigger className='w-full py-6'>
                    <SelectValue placeholder='Pilih kategori' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-50 border-slate-300'>
                    <SelectGroup>
                      <SelectLabel>metode pembayaran</SelectLabel>
                      <SelectItem value='NORMAL'>Normal</SelectItem>
                      <SelectItem value='INSTALMENT'>Cicilan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Nominal cicilan */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium mb-1'>
                Nominal / Cicilan
              </label>
              <div className='w-full border rounded-md p-4 border-slate-300'>
                <p className='font-semibold text-lg'>
                  Rp.{' '}
                  {selectedKategori == 'spp'
                    ? '2.500.000,00'
                    : detailCategoryMQ?.data?.nominal}
                </p>
              </div>
            </div>
            {/* Button */}
            <div className='flex justify-end gap-4 mt-4'>
              <button className='bg-green-600 text-white px-4 py-2 rounded-md'>
                Remove
              </button>
              <button
                type='submit'
                className='bg-blue-600 text-white px-4 py-2 rounded-md'
              >
                Tambah
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default InputPembayaranpage
