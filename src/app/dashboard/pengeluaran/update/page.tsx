'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  deskripsi: Yup.string().required('Wajib di isi'),
  penanggungJawab: Yup.string().required('Wajib di isi'),
  kategori: Yup.string().required('Wajib di isi'),
  prioritas: Yup.string().required('Wajib di isi'),
  jumlahItem: Yup.number().nullable(),
  nominal: Yup.string().required('Wajib di isi'),
  tanggalPembayaran: Yup.string().nullable()
})

const UpdateSiswa = () => {
  const { id } = useParams()
  const router = useRouter()
  // Dummy data sementara untuk mengisi kolom input
  const dummyData = {
    deskripsi: 'Buku Tulis',
    penanggungJawab: 'Bendahara',
    kategori: 'Operasional',
    prioritas: 'BIASA',
    jumlahItem: 10,
    ukuran: 25,
    satuanUkuran: 'Unit',
    nominal: 1500000,
    tanggalPembayaran: '',
    pihakPenerima: 'CV Bangun Jaya',
    metodePembayaran: '',
    sumberDana: '',
    subKategori: ''
  }

  const [dataSiswa, setDataSiswa] = useState<any>(dummyData)

  const { useGetStudent, useUpdateStudent } = useStudentModule()
  const { data: siswa } = useGetStudent()
  const { mutate } = useUpdateStudent(id as string)

  useEffect(() => {
    const found = siswa?.find((s: any) => s.id.toString() === id)
    if (found) setDataSiswa(found)
  }, [id, siswa])

  const formik = useFormik({
    initialValues: {
      deskripsi: dataSiswa?.deskripsi || '',
      penanggungJawab: dataSiswa?.penanggungJawab || '',
      kategori: dataSiswa?.kategori || '',
      prioritas: dataSiswa?.prioritas || '',
      jumlahItem: dataSiswa?.jumlahItem || '',
      ukuran: dataSiswa?.ukuran || '',
      satuanUkuran: dataSiswa?.satuanUkuran || '',
      nominal: dataSiswa?.nominal ? formatRupiah(dataSiswa.nominal.toString()) : '',
      tanggalPembayaran: dataSiswa?.tanggalPembayaran || '',
      pihakPenerima: dataSiswa?.pihakPenerima || '',
      metodePembayaran: dataSiswa?.metodePembayaran || '',
      sumberDana: dataSiswa?.sumberDana || '',
      subKategori: dataSiswa?.subKategori || ''
    },
    validationSchema: updateSchema,
    enableReinitialize: true,
    onSubmit: values => {
      const sendToBackend = {
        ...values,
        jumlahItem: values.jumlahItem ? Number(values.jumlahItem) : undefined,
        ukuran: values.ukuran ? Number(values.ukuran) : undefined,
        nominal: Number(values.nominal.replace(/\D/g, '')) // kirim angka murni
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
  // Form akan tetap ditampilkan menggunakan `dummyData` bila data asli belum tersedia

  return (
    <section className='w-full bg-white rounded-2xl h-full p-8 shadow-sm border border-slate-200'>
      <h1 className='font-semibold text-2xl mb-4'>Update Data</h1>

      <form onSubmit={formik.handleSubmit} className='space-y-6'>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

          <div>
            <label className='text-sm font-medium text-gray-600'>Kategori</label>
            <Select
              value={formik.values.kategori}
              onValueChange={val => formik.setFieldValue('kategori', val)}
            >
              <SelectTrigger className='mt-1 w-full py-6 border-slate-300 bg-white'>
                <SelectValue placeholder='Pilih Kategori' />
              </SelectTrigger>

              <SelectContent className='bg-white border border-slate-300'>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  <SelectItem value='Operasional'>Operasional</SelectItem>
                  <SelectItem value='Pembangunan'>Pembangunan</SelectItem>
                  <SelectItem value='Lainnya'>Lainnya</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Tanggal Pembayaran</label>
            <Input
              type='date'
              value={formik.values.tanggalPembayaran}
                onChange={e => formik.setFieldValue('tanggalPembayaran', e.target.value)}
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Pihak Penerima</label>
            <Input
              value={formik.values.pihakPenerima}
              onChange={e => formik.setFieldValue('pihakPenerima', e.target.value)}
                placeholder='Contoh: CV Bangun Jaya'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Penanggung Jawab</label>
            <Input
              value={formik.values.penanggungJawab}
              onChange={e => formik.setFieldValue('penanggungJawab', e.target.value)}
                placeholder='Contoh: Pak Arif'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Jumlah Item</label>
            <Input
              type='number'
              value={formik.values.jumlahItem}
              onChange={e => formik.setFieldValue('jumlahItem', e.target.value)}
                placeholder='Contoh: 10'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Metode Pembayaran</label>
            <Select
              value={formik.values.metodePembayaran}
              onValueChange={val => formik.setFieldValue('metodePembayaran', val)}
            >
              <SelectTrigger className='mt-1 w-full py-6 border-slate-300 bg-white'>
                <SelectValue placeholder='Pilih Metode Pembayaran' />
              </SelectTrigger>

              <SelectContent className='bg-white border border-slate-300'>
                <SelectGroup>
                  <SelectLabel>Metode</SelectLabel>
                  <SelectItem value='Cash'>Cash</SelectItem>
                  <SelectItem value='Credit'>Credit</SelectItem>
                  <SelectItem value='Transfer'>Transfer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Prioritas</label>
            <Select
              value={formik.values.prioritas}
              onValueChange={val => formik.setFieldValue('prioritas', val)}
            >
              <SelectTrigger className='mt-1 w-full py-6 border-slate-300 bg-white'>
                <SelectValue placeholder='Pilih Prioritas' />
              </SelectTrigger>

              <SelectContent className='bg-white border border-slate-300'>
                <SelectGroup>
                  <SelectLabel>Prioritas</SelectLabel>
                  <SelectItem value='BIASA'>BIASA</SelectItem>
                  <SelectItem value='PENTING'>PENTING</SelectItem>
                  <SelectItem value='GENTING'>GENTING</SelectItem>
                  <SelectItem value='SANGAT GENTING'>SANGAT GENTING</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Sumber Dana</label>
            <Input
              value={formik.values.sumberDana}
              onChange={e => formik.setFieldValue('sumberDana', e.target.value)}
                placeholder='Dana BOS / Kas Operasional'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Ukuran</label>
            <Input
              type='number'
              value={formik.values.ukuran}
              onChange={e => formik.setFieldValue('ukuran', e.target.value)}
                placeholder='Contoh: 25'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Satuan Ukuran</label>
            <Input
              value={formik.values.satuanUkuran}
              onChange={e => formik.setFieldValue('satuanUkuran', e.target.value)}
                placeholder='Unit / Meter / Lembar'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Nominal (Rp)</label>
            <Input
              value={formik.values.nominal}
              onChange={e => {
                const formatted = formatRupiah(e.target.value)
                formik.setFieldValue('nominal', formatted)
              }}
                placeholder='1500000'
                className='mt-1 py-6 border-slate-300'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Sub Kategori</label>
            <Select
              value={formik.values.subKategori}
              onValueChange={val => formik.setFieldValue('subKategori', val)}
            >
              <SelectTrigger className='mt-1 w-full py-6 border-slate-300 bg-white'>
                <SelectValue placeholder='Pilih Sub Kategori' />
              </SelectTrigger>

              <SelectContent className='bg-white border border-slate-300'>
                <SelectGroup>
                  <SelectLabel>Sub Kategori</SelectLabel>
                  <SelectItem value='ATK'>ATK</SelectItem>
                  <SelectItem value='Konstruksi'>Konstruksi</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='md:col-span-2'>
            <label className='text-sm font-medium text-gray-600'>Deskripsi</label>
            <Textarea
              value={formik.values.deskripsi}
              onChange={e => formik.setFieldValue('deskripsi', e.target.value)}
              placeholder='Isi deskripsi pengeluaran...'
              className='mt-1 py-6 border-slate-300'
            />
          </div>

        </div>

        {/* BUTTON */}
        <div className='flex justify-end gap-4 pt-4 border-t border-slate-200'>
          <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white shadow-md px-8'>
            Simpan
          </Button>

          <Button type='button' onClick={() => router.back()} className='bg-red-500 hover:bg-red-600 text-white shadow-md px-8'>
            Batal
          </Button>
        </div>

      </form>
    </section>
  )
}

export default UpdateSiswa
