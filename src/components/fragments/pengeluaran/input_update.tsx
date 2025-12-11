'use client'

import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Shadcn
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Send } from 'lucide-react'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { formatRupiah } from '@/lib/format-rupiah'

export default function SubmitUpdateExpense ({
  idExpense
}: {
  idExpense: string
}) {
  const [dataList, setDataList] = useState([])

  const { useGetSubCategory } = useSubCategoryExpenseModule()
  const { useGetCategoryExpense } = useCategoryExpenseModule()
  const { data: category } = useGetCategoryExpense()
  const { data: subCategories } = useGetSubCategory()
  const { useDetailExpense, useUpdateExpense } = useExpenseModule()

  const mutate = useUpdateExpense()
  const { data: detailExpense } = useDetailExpense(idExpense)
  const [categorySelectedId, setCategorySelectedId] = useState('')

  useEffect(() => {
    if (detailExpense?.data?.categoryId) {
      setCategorySelectedId(detailExpense.data.categoryId)
    }
  }, [detailExpense])

  // console.log(detailExpense?.data)

  const filter = category?.data?.find(
    (d: any) => d.id == detailExpense?.data?.categoryId
  )
  // console.log(filter);
  const filterSub = subCategories?.data?.filter(
    (d: any) => d?.category?.id == categorySelectedId
  )
  console.log(subCategories?.data[0]?.category?.id)
  console.log(filterSub)

  // console.log(subCategories)
  // console.log(category)
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: detailExpense?.data?.id || '',
      categoryId: detailExpense?.data?.categoryId || '',
      PayDate: detailExpense?.data?.PayDate?.split('T')[0] || '',
      pihakPenerima: detailExpense?.data?.pihakPenerima || '',
      PenanggungJawab: detailExpense?.data?.PenanggungJawab || '',
      itemCount: detailExpense?.data?.itemCount || '',
      method: detailExpense?.data?.method || '',
      Prioritas: detailExpense?.data?.Prioritas || '',
      sumber_dana: detailExpense?.data?.sumber_dana || '',
      ukuran: detailExpense?.data?.ukuran || '',
      satuanUkuran: detailExpense?.data?.satuanUkuran || '',
      kwitansiUrl: detailExpense?.data?.kwitansiUrl || '',
      amount: detailExpense?.data?.amount || '',
      description: detailExpense?.data?.description || '',
      subCategoryId: detailExpense?.data?.subCategoryId ?? null
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
      mutate.mutate({ idExpense: idExpense, data: item })
      // console.log({:id, data:item})
      // setDataList(prev => [...prev, item] as any)
      // resetForm()
    }
  })

  //   useEffect(() => {
  //   formik.setFieldValue('subCategoryId', '')
  // }, [formik, formik.values.categoryId])

  // console.log(dataList);
  return (
    <div className='min-h-screen w-full bg-gray-50 flex justify-center'>
      <div className='bg-white w-full  rounded-xl p-8 shadow-sm'>
        <h2 className='text-2xl font-semibold mb-8'>Update Pengeluaran</h2>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit} className='grid grid-cols-1 gap-6'>
          {/* GRID 2 KOLOM */}
          <div className='grid sm:grid-cols-2 gap-6'>
            {/* CATEGORY */}
            <div className='space-y-2'>
              <Label>Kategori</Label>

              <Select
                onValueChange={value => {
                  formik.setFieldValue('categoryId', value)
                  setCategorySelectedId(value)
                }}
                value={formik.values.categoryId || filter?.id || ''} // ⬅ SET DEFAULT DARI FILTER
              >
                <SelectTrigger className='h-12 py-6 w-full text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'>
                  <SelectValue placeholder='Pilih Kategori' />
                </SelectTrigger>

                <SelectContent className='border-slate-300 bg-white'>
                  {/* Tampilkan HANYA kategori sesuai filter */}
                  {/* Hanya tampilkan sub kategori sesuai filter */}
                  {category?.data?.map((sub: any) => (
                    <SelectItem key={sub.id} value={String(sub.id)}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formik.errors.categoryId && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.categoryId as any}
                </p>
              )}
            </div>

            {/* DATE */}
            <div className='space-y-2'>
              <Label>Tanggal Pembayaran</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full h-12 justify-start text-left font-normal border-gray-300 rounded-lg'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formik.values.PayDate
                      ? format(
                          new Date(formik.values.PayDate),
                          'dd MMMM yyyy',
                          {
                            locale: id
                          }
                        )
                      : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={
                      formik.values.PayDate
                        ? new Date(formik.values.PayDate)
                        : undefined
                    }
                    onSelect={date => {
                      if (date) {
                        formik.setFieldValue('PayDate', date.toISOString())
                      }
                    }}
                    locale={id as any}
                  />
                </PopoverContent>
              </Popover>

              {formik.errors.PayDate && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.PayDate as any}
                </p>
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
                <p className='text-red-500 text-sm'>
                  {formik.errors.method as any}
                </p>
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
                  {formik.errors.Prioritas as any}
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
                type='text'
                placeholder='Rp 0'
                className='h-12 text-[15px] border border-gray-300 rounded-lg focus-visible:ring-green-400'
                value={formatRupiah(Number(formik.values.amount || 0))}
                onChange={e => {
                  let raw = e.target.value.replace(/[^0-9]/g, '')

                  // Jika kosong → set 0 aman
                  if (!raw) raw = '0'

                  formik.setFieldValue('amount', Number(raw))
                }}
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
                  {/* Hanya tampilkan sub kategori sesuai filter */}
                  {filterSub?.map((sub: any) => (
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
                  {formik.errors.subCategoryId as any}
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
            {mutate.isPending
              ? 'Sedang Menyimpan Data...'
              : 'Simpan Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  )
}
