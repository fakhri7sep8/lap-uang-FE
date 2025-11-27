"use client"
import React from 'react'
import InputPengeluaran from '@/components/fragments/pengeluaran/input_pengeluaran'
import { useParams } from 'next/navigation';
import SubmitUpdateExpense from '@/components/fragments/pengeluaran/input_update';

// export const metadata = {
//   title: 'Input Pengeluaran'
// }

export default function Page() {
  const {id} = useParams();
  return (
    <div className='p-6'>
      <SubmitUpdateExpense id={id as string} />
    </div>
  )
}
