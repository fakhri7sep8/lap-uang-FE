'use client'

import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils' // opsional jika kamu pakai helper className merge

type ExportPDFButtonProps = {
  onExport?: () => void // fungsi export (optional)
  label?: string // teks di tombol
  className?: string
}

const ExportPDFButton = ({
  onExport,
  label = 'Export ke PDF',
  className
}: ExportPDFButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      if (onExport) await onExport()
    } catch (error) {
      console.error('Gagal export PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200',
        className
      )}
    >
      <FileDown size={18} />
      {loading ? 'Sedang menyiapkan...' : label}
    </Button>
  )
}

export default ExportPDFButton
