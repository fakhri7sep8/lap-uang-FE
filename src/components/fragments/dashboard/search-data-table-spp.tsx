import { Input } from '@headlessui/react'
import { CirclePlus, Search, SlidersHorizontal } from 'lucide-react'
import React from 'react'
import SelectLimitData from './select-dataLimit'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const SearchDataTableSPP = ({
  searchTerm,
  setSearchTerm,
  setShowFilter,
  setShowCount,
  title,
  link = "/",
  type 
}: {
  title: string
  link?: string
  type: ' add create' | 'normal'
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
  setShowCount: React.Dispatch<React.SetStateAction<number>>
}) => {
  if (type === ' add create') {
    return (
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold w-full'>{title}</h2>
        <div className='flex items-center gap-4 w-full h-12 '>
          <div className='w-2/3 h-full border border-slate-200  bg-white rounded-md flex flex-row-reverse gap-2 items-center px-4'>
            <Search className='' />
            <Input
              type='text'
              placeholder='Cari nama / bulan / status'
              className='w-full h-full outline-none focus-visible:outline-none ring-0 focus:ring-0 border-none shadow-none'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='flex items-center flex-row-reverse gap-4 w-1/3 h-full'>
            <Link href={link} className='h-full'>
              <button
                title='add'
                className='h-full w-[60px]  rounded-md flex justify-center items-center bg-green-400 text-white hover:bg-green-500 transition-all'
              >
                <CirclePlus />
              </button>
            </Link>
            <button
              onClick={() => setShowFilter(true)}
              className=' flex justify-center items-center gap-2  px-6 py-2 h-full bg-purple-400 text-white rounded-md shadow-sm hover:bg-purple-500 transition'
            >
              <SlidersHorizontal />
              <span>Filter</span>
            </button>

            <SelectLimitData setCount={setShowCount} />
          </div>
        </div>
      </div>
    )
  }
  if (type === 'normal') {
    return (
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl font-semibold w-full'>{title}</h2>
        <div className='flex items-center gap-4 w-full h-12 '>
          <div className='w-2/3 h-full border border-slate-200  bg-white rounded-md flex flex-row-reverse gap-2 items-center px-4'>
            <Search className='' />
            <Input
              type='text'
              placeholder='Cari nama / no. Induk / asrama...'
              className='w-full h-full outline-none focus-visible:outline-none ring-0 focus:ring-0 border-none shadow-none'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='flex items-center flex-row-reverse gap-4 w-1/3 h-full'>
            <button
              onClick={() => setShowFilter(true)}
              className='w-1/2 flex justify-center items-center gap-2  px-6 py-2 h-full bg-green-400 text-white rounded-md shadow-sm hover:bg-green-500 transition'
            >
              <SlidersHorizontal />
              <span>Filter</span>
            </button>

            <SelectLimitData setCount={setShowCount} />
          </div>
        </div>
      </div>
    )
  }
}

export default SearchDataTableSPP
