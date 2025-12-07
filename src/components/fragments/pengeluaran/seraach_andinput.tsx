'use client'
import { Button } from '@/components/ui/button'
import { CalendarIcon, PlusCircleIcon, SearchIcon } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface SearchInputProps {
  searchTerm: string
  fromDate: Date | null
  toDate: Date | null
  category: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFromDateChange: (date: Date | null) => void
  onToDateChange: (date: Date | null) => void
}

const SearchInput = ({
  searchTerm,
  fromDate,
  toDate,
  category,
  onSearchChange,
  onFromDateChange,
  onToDateChange
}: SearchInputProps) => {
  const router = useRouter()

  return (
    <div className='flex items-center gap-8 mb-6 w-full'>
      {/* SEARCH INPUT */}
      <div className='flex gap-2 w-[60%]'>
        <input
          type='text'
          placeholder='Work Name'
          value={searchTerm}
          onChange={onSearchChange}
          className='border border-gray-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-400'
        />
        <SearchIcon className='mt-2' />
      </div>

      {/* DATE FILTERS */}
      <div className='w-[30%] h-[48px] flex justify-end gap-4 items-center'>
        {/* FROM DATE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-1/2 justify-start text-left font-normal rounded-xl border-blue-500',
                !fromDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4 text-blue-500' />
              {fromDate ? (
                <span className='text-blue-500'>
                  {format(fromDate, 'dd MMM yyyy')}
                </span>
              ) : (
                <span className='text-blue-500'>From Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={fromDate ?? undefined}
              onSelect={d => onFromDateChange(d ?? null)}
            />
          </PopoverContent>
        </Popover>

        {/* TO DATE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-1/2 justify-start text-left font-normal rounded-xl border-blue-500',
                !toDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4 text-blue-500' />
              {toDate ? (
                <span className='text-blue-500'>
                  {format(toDate, 'dd MMM yyyy')}
                </span>
              ) : (
                <span className='text-blue-500'>To Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='single'
              selected={toDate ?? undefined}
              onSelect={d => onToDateChange(d ?? null)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* BUTTONS */}
      <div className='flex gap-4 items-center'>
        <Button
          onClick={() => router.push(`/dashboard/pengeluaran/input/${category}`)}
          className='relative bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105 group'
          aria-label='Tambah Pengeluaran'
        >
          <PlusCircleIcon className='font-bold text-white transition-transform duration-200 transform group-hover:scale-110 group-hover:rotate-12' />

          <span
            role='tooltip'
            className='absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap'
          >
            Tambah Data
          </span>
        </Button>

        <Button
          variant='outline'
          className='border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl transition-transform duration-200 transform hover:scale-105 hover:shadow-md'
        >
          Export
        </Button>
      </div>
    </div>
  )
}

export default SearchInput
