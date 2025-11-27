'use client'

import React from 'react'
import { useExpenseModule } from '@/hooks/expense/useExpense'

// Shadcn
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function DetailExpense({ id }: { id: string }) {
  const { useDetailExpense } = useExpenseModule()
  const { data, isLoading } = useDetailExpense(id)

  const expense = data?.data

  if (isLoading) {
    return <p className="text-center mt-20">Loading...</p>
  }

  if (!expense) {
    return <p className="text-center mt-20 text-red-500">Data tidak ditemukan</p>
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center">
      <div className="bg-white w-full rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Detail Pengeluaran</h2>

        <div className="grid sm:grid-cols-2 gap-6">

          <Field label="Kategori" value={expense.category?.name} />
          <Field label="Tanggal Pembayaran" value={new Date(expense.PayDate).toLocaleDateString('id-ID')} />
          <Field label="Pihak Penerima" value={expense.pihakPenerima} />
          <Field label="Penanggung Jawab" value={expense.PenanggungJawab} />
          <Field label="Jumlah Item" value={expense.itemCount} />
          <Field label="Metode Pembayaran" value={<Badge>{expense.method}</Badge>} />
          <Field label="Prioritas" value={<Badge variant="secondary">{expense.Prioritas}</Badge>} />
          <Field label="Sumber Dana" value={expense.sumber_dana} />
          <Field label="Ukuran" value={expense.ukuran} />
          <Field label="Satuan Ukuran" value={expense.satuanUkuran} />

          <Field
            label="Nominal"
            value={`Rp ${Number(expense.amount).toLocaleString('id-ID')}`}
          />
          <Field label="Sub Kategori ID" value={expense.subCategoryId} />

        </div>

        {/* DESKRIPSI */}
        <div className="mt-6 space-y-2">
          <Label>Deskripsi</Label>
          <Textarea
            disabled
            value={expense.description || '-'}
            className="min-h-[120px] bg-gray-100"
          />
        </div>

      </div>
    </div>
  )
}

// COMPONENT FIELD
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="bg-gray-100 rounded-lg px-4 py-3 text-[15px]">
        {value || '-'}
      </div>
    </div>
  )
}
