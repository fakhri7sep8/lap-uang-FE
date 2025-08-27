'use client'

import React, { useState } from 'react'
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
  const [selectedSiswa, setSelectedSiswa] = useState<string>('Daffa Hafizh')
  const [selectedKategori, setSelectedKategori] = useState<string>('spp')

  const siswa = siswaData.find(
    s => s.id === selectedSiswa || s.name === selectedSiswa
  )

  return (
    <div className='w-full flex justify-center items-center p-8'>
      <section className='w-full bg-white rounded-2xl shadow-md p-6'>
        <div className='flex flex-col gap-6'>
          <h1 className='font-semibold text-2xl'>Input Pembayaran</h1>

          {/* Name + No Induk jadi Combobox */}
          <div className='flex flex-row gap-6'>
            <div className='flex flex-col w-1/2'>
              <label className='text-sm font-medium mb-1'>Nama Siswa</label>
              <Combobox
                label='Nama Siswa'
                options={siswaData.map(s => ({
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
              <label className='text-sm font-medium mb-1'>No induk Siswa</label>

              <Combobox
                label='No Induk'
                options={siswaData.map(s => ({
                  label: s.id,
                  value: s.id
                }))}
                value={siswa?.id}
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
              onValueChange={val => setSelectedKategori(val)}
            >
              <SelectTrigger className='w-full py-6'>
                <SelectValue placeholder='Pilih kategori' />
              </SelectTrigger>
              <SelectContent className='bg-gray-50 border-slate-300'>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  <SelectItem value='spp'>SPP</SelectItem>
                  <SelectItem value='praktikum'>Praktikum</SelectItem>
                  <SelectItem value='kegiatan'>Kegiatan</SelectItem>
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
                  {sppData.map((item, index) => (
                    <TableRow key={index} className='hover:bg-gray-100'>
                      <TableCell className='text-left border border-gray-300'>
                        {item.bulan}
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

          {/* Nominal cicilan */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium mb-1'>
              Nominal / Cicilan
            </label>
            <div className='w-full border rounded-md p-4 border-slate-300'>
              <p className='font-semibold text-lg'>Rp. 2.500.000,00</p>
            </div>
          </div>

          {/* Button */}
          <div className='flex justify-end gap-4 mt-4'>
            <button className='bg-green-600 text-white px-4 py-2 rounded-md'>
              Remove
            </button>
            <button className='bg-blue-600 text-white px-4 py-2 rounded-md'>
              Tambah
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InputPembayaranpage
