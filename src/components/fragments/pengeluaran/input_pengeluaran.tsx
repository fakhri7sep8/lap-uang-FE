'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Shadcn
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useSubCategoryExpenseModule } from '@/hooks/expense/useSubCategoryExpense'
import { useCategoryExpenseModule } from '@/hooks/expense/useCategoryExpense'
import { useExpenseModule } from '@/hooks/expense/useExpense'
import DatePicker from './datePicker'

export default function SubmitRequestPage() {
  const [dataList, setDataList] = useState([])

  const { useGetSubCategory } = useSubCategoryExpenseModule()
  const { useGetCategoryExpense } = useCategoryExpenseModule()
  const { data: category } = useGetCategoryExpense()
  const { data: subCategories } = useGetSubCategory()
  const { useCreateExpense } = useExpenseModule()
  const mutate = useCreateExpense()
  // console.log(subCategories)
  // console.log(category)
  const formik = useFormik({
    initialValues: {
      categoryId: '',
      PayDate: '',
      pihakPenerima: '',
      PenanggungJawab: '',
      itemCount: '',
      method: '',
      Prioritas: '',
      sumber_dana: '',
      ukuran: '',
      satuanUkuran: '',
      kwitansiUrl: '',
      amount: '',
      description: '',
      subCategoryId: ''
    },

    validationSchema: Yup.object({
      categoryId: Yup.string().required('Kategori wajib diisi'),
      PayDate: Yup.date().required('Tanggal wajib diisi'),
      pihakPenerima: Yup.string().required('Wajib diisi'),
      PenanggungJawab: Yup.string().required('Wajib diisi'),
      itemCount: Yup.string().required('Jumlah item wajib diisi'),
      method: Yup.string().required('Method wajib diisi'),
      Prioritas: Yup.string().required('Prioritas wajib diisi'),
      sumber_dana: Yup.string().required('Sumber dana wajib diisi'),
      ukuran: Yup.string().required('Ukuran wajib diisi'),
      satuanUkuran: Yup.string().required('Satuan ukuran wajib diisi'),
      amount: Yup.number()
        .typeError('Harus angka')
        .required('Nominal wajib diisi'),
      description: Yup.string(),
      subCategoryId: Yup.number()
        .typeError('Harus angka')
        .required('Subkategori wajib diisi')
    }),

    onSubmit: (values, { resetForm }) => {
      const tanggal = new Date(values.PayDate).toLocaleDateString('id-ID')
      const item = {
        ...values,
        kwitansiUrl: 'https://exmaple.com/pdf',
        PayDate: new Date(values.PayDate).toISOString(),
        amount: Number(values.amount),
        subCategoryId: Number(values.subCategoryId)
        // PayDateFormatted: tanggal
      }
      mutate.mutate(item)
      console.log(item)
      // setDataList(prev => [...prev, item] as any)
      // resetForm()
    }
  })
  // console.log(dataList);

  const inputClass =
    "h-12 px-4 rounded-lg border border-gray-300 bg-white " +
    "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all";
  return (
    <div className='min-h-screen w-full bg-gray-50 flex justify-center'>
      <div className='bg-white w-full  rounded-xl p-8 shadow-sm'>
        <h2 className='text-2xl font-semibold mb-8'>Input Data Pengeluaran</h2>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className='grid grid-cols-1 gap-6'>
          {/* GRID 2 KOLOM */}
          <div className='grid sm:grid-cols-2 gap-6'>
            {/* CATEGORY */}
            <div className='space-y-2'>
              <Label>Kategori</Label>

              <Select
                onValueChange={value =>
                  formik.setFieldValue('categoryId', value)
                }
                value={formik.values.categoryId}
              >
                <SelectTrigger className='h-12 py-6 w-full text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'>
                  <SelectValue placeholder='Pilih Kategori' />
                </SelectTrigger>

                <SelectContent className='border-slate-300 bg-white'>
                  {category?.data?.map((item: any) => (
                    <SelectItem
                      className='hover:bg-slate-100'
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formik.errors.categoryId && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            {/* DATE */}
            <div className='space-y-2'>
              <Label>Tanggal Pembayaran</Label>
              <DatePicker
                name='PayDate'
                value={formik.values.PayDate}
                onChange={formik.handleChange}
                className={inputClass}
              />
              {/* <Input
                type='date'
                name='PayDate'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.PayDate}
                onChange={formik.handleChange}
              /> */}
              {formik.errors.PayDate && (
                <p className='text-red-500 text-sm'>{formik.errors.PayDate}</p>
              )}
            </div>

            {/* PENERIMA */}
            <div className='space-y-2'>
              <Label>Pihak Penerima</Label>
              <Input
                name='pihakPenerima'
                placeholder='Contoh: CV Bangun Jaya'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.pihakPenerima}
                onChange={formik.handleChange}
              />
            </div>

            {/* PENANGGUNG JAWAB */}
            <div className='space-y-2'>
              <Label>Penanggung Jawab</Label>
              <Input
                name='PenanggungJawab'
                placeholder='Contoh: Pak Arif'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.PenanggungJawab}
                onChange={formik.handleChange}
              />
            </div>

            {/* ITEM COUNT */}
            <div className='space-y-2'>
              <Label>Jumlah Item</Label>
              <Input
                name='itemCount'
                placeholder='Contoh: 10'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.itemCount}
                onChange={formik.handleChange}
              />
            </div>

            {/* METODE PEMBAYARAN */}
            <div className='space-y-2'>
              <Label>Metode Pembayaran</Label>

              <Select
                onValueChange={value => formik.setFieldValue('method', value)}
                value={formik.values.method}
              >
                <SelectTrigger className='w-full py-6 h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'>
                  <SelectValue placeholder='Pilih Metode Pembayaran' />
                </SelectTrigger>

                <SelectContent className='border-slate-300 bg-white'>
                  <SelectItem value='CASH' className='hover:bg-slate-100'>
                    CASH
                  </SelectItem>
                  <SelectItem value='CREDIT' className='hover:bg-slate-100'>
                    CREDIT
                  </SelectItem>
                  <SelectItem value='TRANSFER' className='hover:bg-slate-100'>
                    TRANSFER
                  </SelectItem>
                </SelectContent>
              </Select>

              {formik.errors.method && (
                <p className='text-red-500 text-sm'>{formik.errors.method}</p>
              )}
            </div>

            {/* PRIORITAS */}
            <div className='space-y-2'>
              <Label>Prioritas</Label>
              <Select
                onValueChange={value =>
                  formik.setFieldValue('Prioritas', value)
                }
                value={formik.values.Prioritas}
              >
                <SelectTrigger className='w-full h-12 py-6 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'>
                  <SelectValue placeholder='Pilih Prioritas' />
                </SelectTrigger>
                <SelectContent className='border-slate-300 bg-white'>
                  <SelectItem value='BIASA' className='hover:bg-slate-100'>
                    BIASA
                  </SelectItem>
                  <SelectItem value='PENTING' className='hover:bg-slate-100'>
                    PENTING
                  </SelectItem>
                  <SelectItem value='GENTING' className='hover:bg-slate-100'>
                    GENTING
                  </SelectItem>
                  <SelectItem
                    value='SANGATGENTING'
                    className='hover:bg-slate-100'
                  >
                    SANGAT GENTING
                  </SelectItem>
                </SelectContent>
              </Select>

              {formik.errors.Prioritas && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.Prioritas}
                </p>
              )}
            </div>

            {/* SUMBER DANA */}
            <div className='space-y-2'>
              <Label>Sumber Dana</Label>
              <Input
                name='sumber_dana'
                placeholder='Dana BOS / Kas Operasional'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.sumber_dana}
                onChange={formik.handleChange}
              />
            </div>

            {/* UKURAN */}
            <div className='space-y-2'>
              <Label>Ukuran</Label>
              <Input
                name='ukuran'
                placeholder='Contoh: 25'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.ukuran}
                onChange={formik.handleChange}
              />
            </div>

            {/* SATUAN */}
            <div className='space-y-2'>
              <Label>Satuan Ukuran</Label>
              <Input
                name='satuanUkuran'
                placeholder='Unit / Meter / Lembar'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.satuanUkuran}
                onChange={formik.handleChange}
              />
            </div>

            {/* NOMINAL */}
            <div className='space-y-2'>
              <Label>Nominal (Rp)</Label>
              <Input
                name='amount'
                type='number'
                placeholder='1500000'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formik.values.amount}
                onChange={formik.handleChange}
              />
            </div>

            {/* SUBCATEGORY */}
            <div className='space-y-2'>
              <Label>Sub Kategori</Label>

              <Select
                onValueChange={value =>
                  formik.setFieldValue('subCategoryId', Number(value))
                }
                value={
                  formik.values.subCategoryId
                    ? String(formik.values.subCategoryId)
                    : ''
                }
              >
                <SelectTrigger className='w-full py-6 h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'>
                  <SelectValue placeholder='Pilih Sub Kategori' />
                </SelectTrigger>

                <SelectContent className='border-slate-300 bg-white'>
                  {subCategories?.data?.map((sub: any) => (
                    <SelectItem
                      key={sub.subCategoryId}
                      value={String(sub.subCategoryId)}
                    >
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formik.errors.subCategoryId && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.subCategoryId}
                </p>
              )}
            </div>
          </div>
          {/* DESKRIPSI */}
          <div className='space-y-2'>
            <Label>Deskripsi</Label>
            <Textarea
              name='description'
              placeholder='Isi deskripsi pengeluaran...'
              className='min-h-[120px] text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>
          <button
            type='submit'
            className='
    w-full h-14
    flex items-center justify-center gap-3
    text-green-600 
    border border-green-400 
    bg-[#f7f9fa]
    rounded-3xl
    text-lg font-medium
    hover:bg-[#f0fdf4]
    transition-all
  '
          >
            <Send className='h-6 w-6 text-green-500' />
            {mutate.isPending ? 'Sedang Menyimpan Data...' : 'Simpan Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  )
}
