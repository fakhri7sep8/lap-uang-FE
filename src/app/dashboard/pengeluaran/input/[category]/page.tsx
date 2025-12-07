"use client"
import React from 'react'
import InputPengeluaran from '@/components/fragments/pengeluaran/input_pengeluaran'
import { useParams } from 'next/navigation'


export default function Page () {

  const { category } = useParams();
  console.log(category);
  const k = decodeURIComponent(category as string)
  console.log(k);

  return (
    <div className='p-6'>
      ok
      <InputPengeluaran categoryName={k} />
    </div>
  )
}
