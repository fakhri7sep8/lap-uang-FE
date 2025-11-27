'use client'

import DetailExpense from '@/components/fragments/pengeluaran/detail_pengeluaran'
import { useParams } from 'next/navigation'
import React from 'react'

export default function DetailPage() {
  const params = useParams()
  const { id } = params as { id: string }

  return <DetailExpense id={id} />
}
