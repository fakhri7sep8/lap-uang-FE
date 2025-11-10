'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useStudentModule } from '@/hooks/useStudentModule'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select' // pastikan path sesuai
import {
  CircleFadingPlus,
  FileDown,
  FolderDown,
  Send,
  SquarePen,
  Trash
} from 'lucide-react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { readerExcel } from '@/helper/excelReader'
import Loader from '@/components/ui/loader'

const tambahSiswaSchema = Yup.object().shape({
  name: Yup.string().required('Nama wajib diisi'),
  InductNumber: Yup.string().required('No Induk wajib diisi'),
  dorm: Yup.string().required('Asrama wajib diisi'),
  generation: Yup.number()
    .typeError('Angkatan harus berupa angka')
    .required('Angkatan wajib diisi'),
  major: Yup.string().required('Jurusan wajib diisi'),
  status: Yup.string().required('Status wajib diisi'),
  NIS: Yup.string().required('NIS wajib diisi')
})

const TambahSiswa = () => {
  const { useCreateStudent, useCreateBulk } = useStudentModule()
  const { mutate, isPending } = useCreateStudent()
  const { mutate: mutateBulk, isPending: isPendingBulk } = useCreateBulk()
  const initialValue = {
    name: '',
    InductNumber: '',
    dorm: '',
    generation: '',
    major: '',
    status: '',
    NIS: ''
  }
  const [form, setForm] = useState<typeof initialValue[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('form-data-create-student')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  useEffect(() => {
    sessionStorage.setItem('form-data-create-student', JSON.stringify(form))
  }, [form])

  const handleDelete = (index: number) => {
    const session = sessionStorage.getItem('form-data-create-student')
    if (session) {
      const json = JSON.parse(session)
      json.splice(index, 1)
      sessionStorage.setItem('form-data-create-student', JSON.stringify(json))
      setForm(json)
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Tidak ada data yang dapat dihapus',
        icon: 'error'
      })
    }
  }
  const handleCreateForm = () => {
    const session = sessionStorage.getItem('form-data-create-student')
    if (!session) {
      sessionStorage.setItem(
        'form-data-create-student',
        JSON.stringify([initialValue])
      )
      setForm([initialValue])
    } else {
      sessionStorage.setItem(
        'form-data-create-student',
        JSON.stringify([...JSON.parse(session), initialValue])
      )
      setForm([...JSON.parse(session), initialValue])
    }
  }
  const handleReadExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const arr = []
    const ValueExcel = await readerExcel(event)
    // console.log(ValueExcel?.json);
    for (const i in ValueExcel?.json) {
      // console.log(ValueExcel?.json[i]?.NIS);
      arr.push({
        name: (ValueExcel?.json[i] as any).Name || '',
        InductNumber: (ValueExcel?.json[i] as any).No_Induk || '',
        dorm: (ValueExcel?.json[i] as any).Asrama || '',
        generation: (ValueExcel?.json[i] as any).generasi || '',
        major: (ValueExcel?.json[i] as any).jurusan || '',
        status: (ValueExcel?.json[i] as any).status || '',
        NIS: ValueExcel?.json[1]?.NIS || ''
      })
      // console.log(i);
    }
    await mutateBulk(arr)
    // setForm([...form, ...arr])
    // Swal.fire({
    //   icon: 'success',
    //   title: 'File berhasil dibaca!',
    //   text: 'Data sudah siap diproses.'
    // })

    // ✅ reset supaya bisa pilih file yang sama lagi
    event.target.value = ''
  }
  const handleDownloadFormatExcel = () => {
    const link = document.createElement('a')
    link.href = '/xlsx/format_data.xlsx' // path dari folder public
    link.download = 'format_data.xlsx'
    link.click()
  }

  const handleImportClick = () => {
    Swal.fire({
      title: 'Apakah anda sudah mengetahui cara menggunakan fitur ini?',
      // text: 'Pastikan file Excel sesuai format yang ditentukan.',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Lanjut pilih file',
      denyButtonText: 'Download Format',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        // Klik "Lanjut pilih file"
        document.getElementById('file')?.click()
      } else if (result.isDenied) {
        // Klik "Lihat dokumentasi"
        // window.open('/dashboard/siswa/create/doc', '_blank')
        // ganti dengan URL dokumentasi kamu
      } else {
        return
      }
      // Klik cancel = tidak melakukan apa-apa
    })
  }
  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: tambahSiswaSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
        generation: Number(values.generation)
      }
      mutate(payload)
      resetForm()
    }
  })

  const renderField = (label: string, name: string, type = 'text') => (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium'>{label}</label>
      <Input
        type={type}
        name={name}
        value={(formik.values as any)[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={`Masukkan ${label}`}
        className='w-full border-slate-300 py-6'
      />
      {formik.touched[name as keyof typeof formik.touched] &&
        formik.errors[name as keyof typeof formik.errors] && (
          <p className='text-red-600 text-sm'>
            {formik.errors[name as keyof typeof formik.errors] as string}
          </p>
        )}
    </div>
  )

  const renderSelect = (label: string, name: string, options: string[]) => (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium'>{label}</label>
      <Select
        value={(formik.values as any)[name]}
        onValueChange={value => formik.setFieldValue(name, value)}
      >
        <SelectTrigger className='w-full border-slate-300 py-6'>
          <SelectValue placeholder={`Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent className='bg-white border-slate-200'>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formik.touched[name as keyof typeof formik.touched] &&
        formik.errors[name as keyof typeof formik.errors] && (
          <p className='text-red-600 text-sm'>
            {formik.errors[name as keyof typeof formik.errors] as string}
          </p>
        )}
    </div>
  )
  if (isPendingBulk) {
    return (
      <div className='p-6 w-full h-[89vh] flex justify-center items-center'>
        <Loader />
      </div>
    )
  }
  return (
    <section className='w-full rounded-xl p-8 flex flex-col gap-6'>
      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-6'>
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
        <div className='w-full h-full px-4 py-8 bg-white rounded-xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-4'>
            {renderField('Nama Siswa', 'name')}
            {renderField('No Induk', 'InductNumber')}
            {renderField('Angkatan', 'generation')}
            {renderField('Asrama', 'dorm')}
            {renderSelect('Jurusan', 'major', ['RPL', 'TKJ'])}
            {renderSelect('Status', 'status', ['ACTIVE', 'GRADUATION', 'OUT'])}
          </div>
          {renderField('NIS', 'NIS')}
        </div>
        {form.map((item: typeof initialValue, index: number) => (
          <CardFormStudent
            onDelete={() => handleDelete(index)}
            key={index}
            name={item.name}
            inductNumber={item.InductNumber}
            generation={item.generation}
            dorm={item.dorm}
            major={item.major}
            status={item.status}
            index={0}
            dataForm={form}
          />
        ))}
        <button
          onClick={handleImportClick}
          // onClick={() => handleCreateForm()}
          disabled={isPendingBulk}
          className='py-5 hover:bg-purple-500 hover:text-white transition-all cursor-pointer border border-purple-500 text-purple-500 text-lg flex items-center justify-center gap-2 rounded-xl'
        >
          {isPendingBulk ? (
            'Memproses data ...'
          ) : (
            <>
              <FileDown size={24} />
              <span>impor dari excel</span>
            </>
          )}
        </button>
        <input
          title='Import Excel'
          type='file'
          id='file'
          className='hidden'
          disabled={isPendingBulk}
          accept='.xlsx, .xls'
          onChange={handleReadExcel}
        />
        <button
          onClick={() => handleDownloadFormatExcel()}
          className='py-5 hover:bg-blue-500 hover:text-white transition-all cursor-pointer border border-blue-500 text-blue-500 text-lg flex items-center justify-center gap-2 rounded-xl'
        >
          <FileDown size={24} />
          Download format excel
        </button>
        <button
          type='submit'
          className='py-5 hover:bg-green-500 hover:text-white transition-all cursor-pointer border border-green-500 text-green-500 text-lg flex items-center justify-center gap-2 rounded-xl'
        >
          {/* <FileDown size={24} /> */}
          <Send size={24} />

          {isPending ? 'Proses Menyimpan data siswa ...' : 'simpan siswa'}
        </button>
      </form>

    </section>
  )
}

type CardFormStudentProps = React.HTMLAttributes<HTMLDivElement> & {
  onDelete: () => void
  name: string
  inductNumber: string
  generation: string
  dorm: string
  major: string
  status: string
  index: number
  dataForm: {
    name: string
    InductNumber: string
    generation: string
    dorm: string
    major: string
    status: string
  }[]
}

const CardFormStudent = ({
  onDelete,
  name,
  inductNumber,
  generation,
  dorm,
  major,
  status,
  dataForm,
  index,
  ...props
}: CardFormStudentProps) => {
  const [localData, setLocalData] = useState({
    name: name || '',
    inductNumber: inductNumber || '',
    generation: generation || '',
    dorm: dorm || '',
    major: major || '',
    status: status || ''
  })

  return (
    <div
      className='w-full h-full px-4 pt-4 pb-8 bg-white rounded-xl'
      {...props}
    >
      <div className='w-full px-4 flex  justify-end items-center'>
        <div
          title='delete'
          className='cursor-pointer text-red-500 p-2 hover:bg-slate-100 rounded-lg transition-all'
          onClick={() => onDelete()}
        >
          <Trash size={18} />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Nama siswa</label>
          <Input
            onChange={e => setLocalData({ ...localData, name: e.target.value })}
            defaultValue={name || ''}
            placeholder={`Masukkan Nama siswa`}
            className='w-full border-slate-300 py-6'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>No Induk</label>
          <Input
            onChange={e =>
              setLocalData({ ...localData, inductNumber: e.target.value })
            }
            defaultValue={inductNumber || ''}
            placeholder={`Masukkan No Induk`}
            className='w-full border-slate-300 py-6'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Angkatan</label>
          <Input
            onChange={e =>
              setLocalData({ ...localData, generation: e.target.value })
            }
            defaultValue={generation || ''}
            placeholder={`Masukkan Angkatan`}
            className='w-full border-slate-300 py-6'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Asrama</label>
          <Input
            onChange={e => setLocalData({ ...localData, dorm: e.target.value })}
            defaultValue={dorm || ''}
            placeholder={`Masukkan Asrama`}
            className='w-full border-slate-300 py-6'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Jurusan</label>
          <Select>
            <SelectTrigger className='w-full border-slate-300 py-6'>
              <SelectValue
                placeholder={`Pilih Jurusan`}
                defaultValue={major || ''}
              />
            </SelectTrigger>
            <SelectContent className='bg-white border-slate-200'>
              {['RPL', 'TKJ'].map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Jurusan</label>
          <Select>
            <SelectTrigger className='w-full border-slate-300 py-6'>
              <SelectValue
                placeholder={`Pilih Jurusan`}
                defaultValue={status || ''}
              />
            </SelectTrigger>
            <SelectContent className='bg-white border-slate-200'>
              {['ACTIVE', 'GRADUATION', 'OUT'].map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default TambahSiswa
