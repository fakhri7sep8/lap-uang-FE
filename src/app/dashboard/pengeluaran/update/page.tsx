'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useStudentModule } from '@/hooks/useStudentModule'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Swal from 'sweetalert2'

// === Format Rupiah ===
const formatRupiah = (value: string) => {
  if (!value) return ''
  const number = value.replace(/\D/g, '')
  return new Intl.NumberFormat('id-ID').format(Number(number))
}

const updateSchema = Yup.object().shape({
  nama: Yup.string().required('Wajib di isi'),
  penanggungJawab: Yup.string().required('Wajib di isi'),
  kategori: Yup.string().required('Wajib di isi'),
  subKategori: Yup.string().required('Wajib di isi'),
  jumlah: Yup.number().required('Wajib di isi'),
  status: Yup.string().required('Wajib di isi')
})

const UpdateSiswa = () => {
  const { id } = useParams()
  const [dataSiswa, setDataSiswa] = useState<any>(null)

  const { useGetStudent, useUpdateStudent } = useStudentModule()
  const { data: siswa } = useGetStudent()
  const { mutate } = useUpdateStudent(id as string)

  useEffect(() => {
    const found = siswa?.find((s: any) => s.id.toString() === id)
    setDataSiswa(found)
  }, [id, siswa])

  const formik = useFormik({
    initialValues: {
      nama: dataSiswa?.nama || '',
      penanggungJawab: dataSiswa?.penanggungJawab || '',
      kategori: dataSiswa?.kategori || '',
      subKategori: dataSiswa?.subKategori || '',
      jumlah: dataSiswa?.jumlah ? formatRupiah(dataSiswa.jumlah.toString()) : '',
      status: dataSiswa?.status || ''
    },
    validationSchema: updateSchema,
    enableReinitialize: true,
    onSubmit: values => {
      const sendToBackend = {
        ...values,
        jumlah: Number(values.jumlah.replace(/\D/g, '')) // kirim angka murni
      }

      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data akan diperbarui',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, ubah!',
        cancelButtonText: 'Batal'
      }).then(res => {
        if (res.isConfirmed) mutate(sendToBackend)
      })
    }
  })

  if (!dataSiswa) return <div className='p-10'>Data tidak ditemukan</div>

  return (
    <section className='w-full bg-white rounded-2xl h-full p-8 shadow-sm border border-slate-200'>
      <h1 className='font-semibold text-2xl mb-4'>Update Data</h1>

      <form onSubmit={formik.handleSubmit} className='space-y-6'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

          {/* NAMA */}
          <div>
            <label className='text-sm font-medium text-gray-600'>Nama</label>
            <Input
              value={formik.values.nama}
              onChange={e => formik.setFieldValue('nama', e.target.value)}
              className='mt-1 py-6 border-slate-300'
            />
          </div>

          {/* PENANGGUNG JAWAB */}
          <div>
            <label className='text-sm font-medium text-gray-600'>Penanggung Jawab</label>
            <Input
              value={formik.values.penanggungJawab}
              onChange={e => formik.setFieldValue('penanggungJawab', e.target.value)}
              className='mt-1 py-6 border-slate-300'
            />
          </div>

          {/* KATEGORI */}
          <div>
            <label className='text-sm font-medium text-gray-600'>Kategori</label>
            <Input
              value={formik.values.kategori}
              onChange={e => formik.setFieldValue('kategori', e.target.value)}
              className='mt-1 py-6 border-slate-300'
            />
          </div>

          {/* SUB KATEGORI */}
          <div>
            <label className='text-sm font-medium text-gray-600'>Sub Kategori</label>
            <Input
              value={formik.values.subKategori}
              onChange={e => formik.setFieldValue('subKategori', e.target.value)}
              className='mt-1 py-6 border-slate-300'
            />
          </div>

          {/* JUMLAH (RUPIAH OTOMATIS) */}
          <div>
            <label className='text-sm font-medium text-gray-600'>
              Jumlah (Rp)
            </label>
            <Input
              value={formik.values.jumlah}
              onChange={e => {
                const formatted = formatRupiah(e.target.value)
                formik.setFieldValue('jumlah', formatted)
              }}
              className='mt-1 py-6 border-slate-300'
            />
          </div>

          {/* STATUS DROPDOWN */}
          <div>
            <label className='text-sm font-medium text-gray-600'>Status</label>
            <Select
              value={formik.values.status}
              onValueChange={val => formik.setFieldValue('status', val)}
            >
              <SelectTrigger className='mt-1 py-6 border-slate-300'>
                <SelectValue placeholder='Pilih status' />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value='ACTIVE'>ACTIVE</SelectItem>
                  <SelectItem value='NON-ACTIVE'>NON-ACTIVE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* BUTTON */}
        <div className='flex justify-end gap-4 pt-4 border-t border-slate-200'>
          <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white shadow-md px-8'>
            Simpan
          </Button>

          <Button type='button' className='bg-red-500 hover:bg-red-600 text-white shadow-md px-8'>
            Batal
          </Button>
        </div>

      </form>
    </section>
  )
}

export default UpdateSiswa
