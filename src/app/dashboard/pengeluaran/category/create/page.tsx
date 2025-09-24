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
import currency from 'currency.js'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const categoryExpenseSchema = Yup.object().shape({
  name: Yup.string().required('Nama Kategori Wajib Di isi'),
  nominal: Yup.number().min(1000),
  periode: Yup.string().required('Periode Wajib Di isi'),
  decs: Yup.string().required('keterangan wajib di isi'),
  semester: Yup.number().min(1)
})
const CreateCategoryExpense = () => {
  // const {create} = useExpenseModule()
  const { useCreateCategory } = useCategoryExpense()
  const { mutate, isPending} = useCreateCategory()
  const formik = useFormik({
    initialValues: {
      name: '',
      nominal: 0,
      periode: '',
      decs: '',
      semester: 1
    },
    validationSchema: categoryExpenseSchema,
    enableReinitialize: true,
    onSubmit: values => {
      values.nominal = Number(values.nominal)
      console.log(values)

      mutate(values)
    }
  })

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
          {/* Nama Kategori Full Width */}
          <div className='w-full flex flex-col gap-4'>
            <Label>Nama Kategori</Label>
            <Input
              name='name'
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder='masukan nama kategori'
              className='border-slate-300 rounded-md px-3 py-6 w-full'
            />
            {formik.touched.name && formik.errors.name && (
              <p className='text-red-500 text-sm'>{formik.errors.name}</p>
            )}
          </div>

          <div className='w-full flex flex-col gap-4'>
            <Label htmlFor='decs'>Keterangan</Label>
            <textarea
              id='decs'
              name='decs'
              value={formik.values.decs}
              onChange={e => formik.setFieldValue('decs', e.target.value)}
              placeholder='Masukan keterangan'
              className='border border-slate-300 rounded-md px-3 py-4 h-24 resize-none focus:outline-none focus:ring-2 w-full'
            />
            {formik.touched.decs && formik.errors.decs && (
              <p className='text-red-500 text-sm'>{formik.errors.decs}</p>
            )}
          </div>

          {/* Buttons */}
          <div className='w-full mt-6 flex gap-4 justify-end items-end '>
            <Button
              type='submit'
              className='px-8 text-white bg-blue-500 cursor-pointer'
            >
              {isPending? "loading..." : "simpan"}
            </Button>
            <Button
              type='button'
              onClick={() => formik.resetForm()}
              className='px-8 bg-red-500 text-white cursor-pointer'
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateCategoryExpense
