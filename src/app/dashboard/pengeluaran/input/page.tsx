'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useExpenseModule } from '@/hooks/use-expense'
import { useCategoryExpense } from '@/hooks/use-expenseCategory'
import { useFormik } from 'formik'
import React, { useMemo, useState } from 'react'
import * as Yup from 'yup'
import { Upload } from 'lucide-react'
import useUpload from '@/hooks/use-upload'

const ExpenseSchema = Yup.object().shape({
  amount: Yup.number().default(0),
  categoryId: Yup.string().required('Kategori wajib diisi'),
  description: Yup.string().required('Keterangan wajib diisi'),
  penerima: Yup.string().required('Pihak penerima wajib diisi'),
  jumlahItem: Yup.string().required('Jumlah barang/item wajib diisi'),
  buktiKwitansi: Yup.mixed().nullable()
})

const CreateExpense = () => {
  const [catId, setCatId] = useState('')
  const { useCreateExpense } = useExpenseModule()
  const { mutate } = useCreateExpense()
  const { useGetCategories } = useCategoryExpense()
  const [isLoading, setIsLoading]= useState(false)
  const { data: categories } = useGetCategories()

  const { uploadFile } = useUpload()

  const filterCategoryPengeluaran = useMemo(() => {
    return categories?.find((c: any) => c.id === catId)
  }, [categories, catId])

  const formik = useFormik({
    initialValues: {
      amount: 0,
      categoryId: '',
      description: '',
      penerima: '',
      jumlahItem: '',
      buktiKwitansi: null as File | null
    },
    validationSchema: ExpenseSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      setIsLoading(true)
      if (!values.buktiKwitansi) {
        alert('Bukti kwitansi wajib diisi')
        return
      }

      const uploadResponse = await uploadFile(
        values.buktiKwitansi as File
      ).then(res => res.data)

      // console.log(uploadResponse)
      const payload = {
        date: new Date().toISOString(),
        amount: Number(values.amount),
        categoryId: values.categoryId,
        description: values.description,
        pihakPenerima: values.penerima,
        itemCount: values.jumlahItem,
        kwitansiUrl: uploadResponse?.data.url
      }
      // kalau backend belum support file, nanti form-data
      console.log('submit:', payload)
      mutate.mutate(payload)
      setIsLoading(false)
    }
  })

  if (categories?.length == 0) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        Tidak bisa melakukan pengeluaran jika kategori pengeluarannya masih
        kosong
      </div>
    )
  }

  // console.log(isLoading);

  return (
    <section className='min-h-screen'>
      <div className=' rounded-xl p-8 max-w-full w-full mx-auto  flex flex-col items-center gap-12'>
        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-8 justify-between bg-white px-6 pt-10 pb-6 rounded-2xl'
        >
          {/* kategori & nominal */}
          <div className='w-full grid grid-cols-2 gap-6'>
            <div className='w-full flex flex-col gap-4'>
              <Label>Kategori Pengeluaran</Label>
              <Select
                value={formik.values.categoryId}
                onValueChange={e => {
                  formik.setFieldValue('categoryId', e)
                  setCatId(e)
                }}
              >
                <SelectTrigger className='w-full py-6 px-3 border-slate-300 rounded-md text-slate-500'>
                  <SelectValue placeholder='Kategori Pengeluaran' />
                </SelectTrigger>
                <SelectContent className='bg-white border-none'>
                  <SelectGroup>
                    <SelectLabel>Kategori Pengeluaran</SelectLabel>
                    {categories?.map((c: any, i: number) => (
                      <SelectItem value={c.id} key={i}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.categoryId}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-4'>
              <Label>Nominal</Label>
              <Input
                name='amount'
                value={
                  formik.values.amount
                    ? Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(Number(formik.values.amount))
                    : 'Rp.0'
                }
                onChange={e => {
                  // Hapus semua karakter selain angka
                  const rawValue = e.target.value.replace(/[^0-9]/g, '')
                  // Simpan sebagai number (atau string angka) ke formik
                  formik.setFieldValue(
                    'amount',
                    rawValue ? parseInt(rawValue, 10) : 0
                  )
                }}
                type='text'
                className='border-slate-300 rounded-md px-3 py-6'
              />
            </div>
          </div>

          {/* pihak penerima */}
          <div className='w-full flex flex-col gap-4'>
            <Label>Pihak Penerima</Label>
            <Input
              type='text'
              name='penerima'
              value={formik.values.penerima}
              onChange={formik.handleChange}
              placeholder='Masukkan pihak penerima'
              className='border-slate-300 rounded-md px-3 py-6'
            />
            {formik.touched.penerima && formik.errors.penerima && (
              <p className='text-red-500 text-sm'>{formik.errors.penerima}</p>
            )}
          </div>

          {/* jumlah item */}
          <div className='w-full flex flex-col gap-4'>
            <Label>Jumlah Barang/Item</Label>
            <Input
              type='text'
              name='jumlahItem'
              value={formik.values.jumlahItem}
              onChange={formik.handleChange}
              placeholder='Contoh: 5 buku, 2 meja'
              className='border-slate-300 rounded-md px-3 py-6'
            />
            {formik.touched.jumlahItem && formik.errors.jumlahItem && (
              <p className='text-red-500 text-sm'>{formik.errors.jumlahItem}</p>
            )}
          </div>

          {/* deskripsi */}
          <div className='w-full h-full flex flex-col gap-4'>
            <Label htmlFor='decs'>Keterangan</Label>
            <textarea
              id='decs'
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
              placeholder='Masukan keterangan'
              className='border border-slate-300 rounded-md px-3 py-4 h-48 resize-none focus:outline-none focus:ring-2 '
            />
            {formik.touched.description && formik.errors.description && (
              <p className='text-red-500 text-sm'>
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* upload bukti kwitansi */}
          <div className='w-full flex flex-col gap-4'>
            <Label>Foto Bukti Kwitansi</Label>
            <div
              className={`flex flex-col items-center justify-center w-full border-2 h-64 border-dashed rounded-lg p-6 cursor-pointer transition 
      ${
        formik.values.buktiKwitansi
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:bg-gray-50'
      }
    `}
              onClick={() => document.getElementById('buktiInput')?.click()}
              onDragOver={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onDrop={e => {
                e.preventDefault()
                e.stopPropagation()
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  formik.setFieldValue('buktiKwitansi', e.dataTransfer.files[0])
                }
              }}
            >
              <Upload className='text-gray-500 mb-2' size={32} />
              <p className='text-sm text-gray-600'>
                Klik / drag & drop untuk upload bukti kwitansi
              </p>
              <Input
                id='buktiInput'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={e =>
                  formik.setFieldValue(
                    'buktiKwitansi',
                    e.currentTarget.files?.[0] || null
                  )
                }
              />
              {formik.values.buktiKwitansi && (
                <p className='mt-2 text-sm text-blue-600'>
                  File: {formik.values.buktiKwitansi.name}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className='w-full mt-6 flex gap-4 justify-end items-end '>
            <Button
              type='button'
              onClick={() => formik.resetForm()}
              className='px-8 bg-red-500 text-white cursor-pointer'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='px-8 text-white bg-blue-500 cursor-pointer'
            >
              {isLoading ? 'Menyimpan...' : 'simpan'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateExpense
