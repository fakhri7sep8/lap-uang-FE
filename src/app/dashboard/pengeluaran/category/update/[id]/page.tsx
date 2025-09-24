'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Loader from '@/components/ui/loader'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useCategoryExpense } from '@/hooks/use-expenseCategory'
import { useFormik } from 'formik'
import { useParams } from 'next/navigation'
import React from 'react'
import * as Yup from 'yup'

const categoryExpenseSchema = Yup.object().shape({
  name: Yup.string().required('Nama Kategori Wajib Di isi'),
  nominal: Yup.number().min(1000),
  periode: Yup.string().required('Periode Wajib Di isi'),
  decs: Yup.string().required('keterangan wajib di isi'),
  semester: Yup.number().min(1)
})

const UpdateCategoryExpense = () => {
  const { id: categoryId } = useParams()

  // const {create} = useExpenseModule()
  const { useUpdateCategory, useGetCategoryById } = useCategoryExpense()
  const { mutate, isPending } = useUpdateCategory()
  const { data: categoryData, isLoading } = useGetCategoryById(
    categoryId as string
  )
  console.log(categoryData)
  const formik = useFormik({
    initialValues: categoryData || {
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

      mutate({ id: categoryId as string, payload: values })
    }
  })

  if (isLoading) {
    return (
      <div className='p-6 w-full h-[89vh] flex justify-center items-center'>
        <Loader />
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
              <Label>Nama Kategori</Label>
              <Input
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder='masukan nama kategori'
                className='border-slate-300 rounded-md px-3 py-6'
              />
              {formik.touched.name && formik.errors.name && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.name as any}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-4'>
              <Label>Nama Kategori</Label>
              <Select
                value={formik.values.periode}
                onValueChange={e => formik.setFieldValue('periode', e)}
              >
                <SelectTrigger className='w-full py-6 px-3 border-slate-300 rounded-md text-slate-500'>
                  <SelectValue placeholder='Periode Tahun' />
                </SelectTrigger>
                <SelectContent className='bg-white border-none'>
                  <SelectGroup>
                    <SelectLabel>Periode Tahun</SelectLabel>
                    {Array.from({ length: 4 }, (_, i) => i + 1).map(p => (
                      <SelectItem
                        key={p}
                        value={`${new Date().getFullYear() + p - 1}`}
                      >
                        {p == 1
                          ? new Date().getFullYear()
                          : new Date().getFullYear() + p - 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.periode && formik.errors.periode && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.periode as any}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-4'>
              <Label>Nominal</Label>
              <Input
                name='nominal'
                value={`${Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(formik.values.nominal)}`}
                onChange={e => {
                  // ambil hanya digit
                  const rawValue = e.target.value.replace(/\D/g, '')
                  formik.setFieldValue('nominal', rawValue)
                }}
                type='text'
                placeholder='masukan nominal'
                className='border-slate-300 rounded-md px-3 py-6'
              />
              {formik.touched.nominal && formik.errors.nominal && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.nominal as any}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-4'>
              <Label>Semester</Label>
              <Select
                value={
                  formik.values.semester ? String(formik.values.semester) : ''
                }
                onValueChange={e => formik.setFieldValue('semester', Number(e))}
              >
                <SelectTrigger className='w-full py-6 px-3 border-slate-300 rounded-md text-slate-500'>
                  <SelectValue placeholder='Semester ke-' />
                </SelectTrigger>
                <SelectContent className='bg-white border-none'>
                  <SelectGroup>
                    <SelectLabel>Semester</SelectLabel>
                    {Array.from({ length: 6 }, (_, i) => i + 1).map(p => (
                      <SelectItem key={p} value={String(p)}>
                        Semester ke-{p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {formik.touched.semester && formik.errors.semester && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.semester as any}
                </p>
              )}
            </div>
          </div>

          <div className='w-full h-24 flex flex-col gap-4'>
            <Label htmlFor='decs'>Keterangan</Label>
            <textarea
              id='decs'
              name='decs'
              value={formik.values.decs}
              onChange={e => formik.setFieldValue('decs', e.target.value)}
              placeholder='Masukan keterangan'
              className='border border-slate-300 rounded-md px-3 py-4 h-24 resize-none focus:outline-none focus:ring-2 '
            />
            {formik.touched.decs && formik.errors.decs && (
              <p className='text-red-500 text-sm'>
                {formik.errors.decs as any}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className='w-full mt-6 flex gap-4 justify-end items-end '>
            <Button
              type='submit'
              className='px-8 text-white bg-blue-500 cursor-pointer'
            >
              {isPending ? 'loading...' : 'simpan'}
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

export default UpdateCategoryExpense
