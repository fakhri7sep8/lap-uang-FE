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
// import { useExpenseModule } from '@/hooks/use-expense'
// import { useCategoryExpense } from '@/hooks/use-expenseCategory'
// import currency from 'currency.js'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'

const ExpenseSchema = Yup.object().shape({
  amount: Yup.number().default(0),
  categoryId: Yup.string().required('Kategori wajib diisi'),
  description: Yup.string().required('Keterangan wajib diisi')
})
const CreateExpense = () => {
  const [catId, setCatId] = useState('')
  // const {create} = useExpenseModule()
  // const { useCreateCategory } = useCategoryExpense()
  // const { mutate, isPending} = useCreateCategory()
  const { useCreateExpense } = useExpenseModule()
  const { mutate } = useCreateExpense()
  // const { data: expenses } = useGetExpenses()
  const { useGetCategories } = useCategoryExpense()
  const { data: categories } = useGetCategories()
  const filterCategoryPengeluaran = useMemo(() => {
    return categories?.find((c: any) => c.id === catId)
  }, [categories, catId])

  // console.log(categories)
  const formik = useFormik({
    initialValues: {
      amount: 0,
      categoryId: '',
      description: ''
    },
    validationSchema: ExpenseSchema,
    enableReinitialize: true,
    onSubmit: values => {
      values.amount = filterCategoryPengeluaran?.nominal
      // console.log(values)

      // mutate(values)

      mutate.mutate({ date: new Date().toISOString(), ...values })
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

  // console.log(formik.values)
  return (
    <section className='min-h-screen'>
      <div className=' rounded-xl p-8 max-w-full w-full mx-auto  flex flex-col items-center gap-12'>
        {/* <h1 className='w-full text-2xl font-semibold mb-6'>
          Tambah Kategori Pengeluaran
        </h1> */}

        <div className='bg-white  dark:text-[#ABB2BF] w-full h-full border-l-4 border-green-500 shadow-md rounded-md p-6 flex flex-col gap-4 '>
          <div className='flex items-center mb-4'>
            <svg
              className='w-6 h-6 text-green-500 mr-2'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z'
              />
            </svg>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-[#ABB2BF]'>
              Tambah Siswa
            </h2>
          </div>
          <p>
            Tampilan aplikasi yang dimana admin dapat menginput data siswa.
            fitur yang terdapat pada halaman ini admin dapat menginput banyak
            data, mengimpor data dari excel dan juga dapat menginput data siswa
            satu per satu.{' '}
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className='w-full flex flex-col gap-8 justify-between bg-white px-6 pt-10 pb-6 rounded-2xl'
        >
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
                value={`${Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(filterCategoryPengeluaran?.nominal || 0)}`}
                type='text'
                className='border-slate-300 rounded-md px-3 py-6 cursor-default'
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className='text-red-500 text-sm'>{formik.errors.amount}</p>
              )}
            </div>
          </div>

          <div className='w-full h-full flex flex-col gap-4'>
            <Label htmlFor='decs'>Keterangan</Label>
            <textarea
              id='decs'
              name='description'
              value={formik.values.description}
              onChange={e =>
                formik.setFieldValue('description', e.target.value)
              }
              placeholder='Masukan keterangan'
              className='border border-slate-300 rounded-md px-3 py-4 h-48 resize-none focus:outline-none focus:ring-2 '
            />
            {formik.touched.description && formik.errors.description && (
              <p className='text-red-500 text-sm'>
                {formik.errors.description}
              </p>
            )}
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
              {/* {'simpan'} */}
              {mutate.isPending ? 'loading...' : 'simpan'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateExpense
