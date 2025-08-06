import { Input } from '@headlessui/react'
import { Search, SlidersHorizontal } from 'lucide-react'
import React from 'react'
import SelectLimitData from './select-dataLimit'

const SearchDataTable = ({
  searchTerm,
  setSearchTerm,
  setShowFilter,
  setShowCount,
  title
}: {
  title: string
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
  setShowCount: React.Dispatch<React.SetStateAction<number>>
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-2xl font-semibold w-full'>{title}</h2>
      <div className='flex items-center gap-4 w-full h-12 '>
        <div className='w-2/3 h-full border border-slate-200  bg-white rounded-md flex flex-row-reverse gap-2 items-center px-4'>
          <Search className='' />
          <Input
            type='text'
            placeholder='Cari nama / no. registrasi / asrama...'
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

export default SearchDataTable
