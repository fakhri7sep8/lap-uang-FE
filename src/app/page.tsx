'use client'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { readerExcel } from '@/helper/excelReader'

export default function Home () {
  const handlePDF = () => {
    const doc = new jsPDF()
    doc.text('Hello World!', 10, 10)

    // Buka preview di tab baru
    window.open(doc.output('bloburl'), '_blank')
  }


  const handleReadExcel =async (event: React.ChangeEvent<HTMLInputElement>) => {
    const ValueExcel = await readerExcel(event)
    console.log(ValueExcel);
  }
  return (
    <main className='min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center space-y-8 bg-white rounded-3xl shadow-xl p-10 animate-fade-in'>
        <h1 className='text-4xl font-bold text-blue-800'>Selamat Datang 👋</h1>
        <p className='text-gray-600 text-lg'>
          Project ini adalah contoh aplikasi Next.js yang menggunakan Tailwind
          CSS untuk styling dan Formik untuk pengelolaan form. Anda dapat
          melakukan login, register, dan verifikasi email.
        </p>
        <Button onClick={handlePDF}>lihat pdf</Button>
        <input type="file" accept='.xlsx, .xls' onChange={handleReadExcel} title='Import Excel' />
        <div className='flex justify-center gap-6 mt-6'>
          <Link href='/auth/login'>
            <button className='hover:bg-white border bg-blue-600 text-white border-blue-600 hover:text-blue-600 w-32 h-10  rounded-full  transition'>
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
