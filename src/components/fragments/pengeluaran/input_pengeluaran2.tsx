'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

// Shadcn UI
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SubmitRequestPage () {
  const [dataList, setDataList] = useState([])

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
        amount: Number(values.amount),
        subCategoryId: Number(values.subCategoryId),
        PayDateFormatted: tanggal
      }

      setDataList(prev => [...prev, item] as any)
      resetForm()
    }
  })

  return (
    <div className='min-h-screen p-6 flex flex-col items-center'>
      {/* FORM */}
      <Card className='w-full max-w-3xl mb-10'>
        <CardHeader>
          <CardTitle className='text-xl'>Input Pengeluaran</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className='space-y-5'>
            {/* CATEGORY */}
            <div>
              <Label>Kategori (categoryId)</Label>
              <Input
                name='categoryId'
                placeholder='Masukkan UUID kategori'
                value={formik.values.categoryId}
                onChange={formik.handleChange}
              />
              {formik.errors.categoryId && (
                <p className='text-red-500 text-sm'>
                  {formik.errors.categoryId}
                </p>
              )}
            </div>

            {/* DATE */}
            <div>
              <Label>Tanggal Pembayaran</Label>
              <Input
                type='date'
                name='PayDate'
                value={formik.values.PayDate}
                onChange={formik.handleChange}
              />
              {formik.errors.PayDate && (
                <p className='text-red-500 text-sm'>{formik.errors.PayDate}</p>
              )}
            </div>

            {/* PENERIMA + PJ */}
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <Label>Pihak Penerima</Label>
                <Input
                  name='pihakPenerima'
                  placeholder='Contoh: CV Maju Jaya'
                  value={formik.values.pihakPenerima}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <Label>Penanggung Jawab</Label>
                <Input
                  name='PenanggungJawab'
                  placeholder='Contoh: Pak Arif'
                  value={formik.values.PenanggungJawab}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* ITEM COUNT */}
            <div>
              <Label>Jumlah Item</Label>
              <Input
                name='itemCount'
                placeholder='Contoh: 10'
                value={formik.values.itemCount}
                onChange={formik.handleChange}
              />
            </div>

            {/* METHOD + PRIORITAS */}
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <Label>Metode Pembayaran</Label>
                <Input
                  name='method'
                  placeholder='CASH / CREDIT / TRANSFER'
                  value={formik.values.method}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <Label>Prioritas</Label>
                <Input
                  name='Prioritas'
                  placeholder='BIASA / PENTING / GENTING / SANGATGENTING'
                  value={formik.values.Prioritas}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* SUMBER DANA */}
            <div>
              <Label>Sumber Dana</Label>
              <Input
                name='sumber_dana'
                placeholder='Dana BOS / Kas Sekolah'
                value={formik.values.sumber_dana}
                onChange={formik.handleChange}
              />
            </div>

            {/* UKURAN */}
            <div className='grid sm:grid-cols-2 gap-4'>
              <div>
                <Label>Ukuran</Label>
                <Input
                  name='ukuran'
                  placeholder='Contoh: 20'
                  value={formik.values.ukuran}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <Label>Satuan Ukuran</Label>
                <Input
                  name='satuanUkuran'
                  placeholder='Lembar / Unit / Meter'
                  value={formik.values.satuanUkuran}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

            {/* AMOUNT */}
            <div>
              <Label>Nominal (Rp)</Label>
              <Input
                name='amount'
                type='number'
                placeholder='Contoh: 1500000'
                value={formik.values.amount}
                onChange={formik.handleChange}
              />
            </div>

            {/* SUB CATEGORY */}
            <div>
              <Label>Sub Category Id</Label>
              <Input
                name='subCategoryId'
                placeholder='Contoh: 7'
                value={formik.values.subCategoryId}
                onChange={formik.handleChange}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label>Deskripsi</Label>
              <Textarea
                name='description'
                placeholder='Isi deskripsi pengeluaran'
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </div>

            <Button type='submit' className='w-full'>
              Simpan Pengeluaran
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST OUTPUT */}
      <div className='w-full max-w-3xl space-y-4'>
        {dataList.map((item:any, index) => (
          <Card key={index}>
            <CardContent className='p-5 space-y-3'>
              <div className='flex justify-between'>
                <p className='font-medium'>
                  {item.pihakPenerima} — {item.PayDateFormatted}
                </p>
                <Badge>{item.Prioritas}</Badge>
              </div>

              <div className='grid sm:grid-cols-2 gap-3 text-sm'>
                <p>
                  <b>Kategori:</b> {item.categoryId}
                </p>
                <p>
                  <b>Sub:</b> {item.subCategoryId}
                </p>
                <p>
                  <b>PJ:</b> {item.PenanggungJawab}
                </p>
                <p>
                  <b>Item Count:</b> {item.itemCount}
                </p>
                <p>
                  <b>Jumlah:</b> Rp {item.amount.toLocaleString('id-ID')}
                </p>
                <p>
                  <b>Metode:</b> {item.method}
                </p>
                <p>
                  <b>Sumber Dana:</b> {item.sumber_dana}
                </p>
                <p>
                  <b>Ukuran:</b> {item.ukuran} {item.satuanUkuran}
                </p>
              </div>

              {item.description && (
                <p className='text-gray-600'>{item.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
