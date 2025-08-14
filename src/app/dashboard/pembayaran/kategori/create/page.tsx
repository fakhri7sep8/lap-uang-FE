import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-dropdown-menu'
import React from 'react'

const CreateKategori = () => {
  return (
   <section className='bg-white rounded-xl p-8 w-1/2 m-auto shadow-md h-[85vh] flex flex-col gap-8 justify-between items-center'>
  <h1 className='w-full text-2xl font-semibold'>Tambah Kategori Pembayaran</h1>
  <div className='w-full h-1/3 flex flex-col gap-6 '>
    <div className='w-full flex flex-col gap-4'>
      <Label>Nama Kategori</Label>
      <Input
        placeholder='masukan nama kategori'
        className=' border-slate-300 rounded-md px-3 py-6'
      />
    </div>
    <div className='w-full flex flex-col gap-4'>
      <Label>Semester</Label>
      <Input
        placeholder='masukan semester'
        className=' border-slate-300 rounded-md px-3 py-6'
      />
    </div>
    <div className='w-full flex flex-col gap-4'>
      <Label>Tahun Ajaran</Label>
      <Input
        placeholder='masukan tahun ajaran'
        className=' border-slate-300 rounded-md px-3 py-6'
      />
    </div>
  </div>
  <div className='w-full h-1/4 mt-6 flex gap-4 justify-end items-end'>
    <Button className='px-8 text-white bg-blue-500'>Simpan</Button>
    <Button className='px-8 bg-red-500 text-white'>Cancel</Button>
  </div>
</section>

  )
}

export default CreateKategori