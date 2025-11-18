import React from 'react'
import InputPengeluaran from '@/components/fragments/pengeluaran/input_pengeluaran'

export const metadata = {
  title: 'Input Pengeluaran',
}

export default function Page() {
  return (
    <div className="p-6">
      <InputPengeluaran />
    </div>
  )
}
