import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import React from 'react'

const SelectLimitData = ({ setCount }: { setCount: (count: number) => void }) => {
  return (
    <div className='flex gap-2 items-center'>
      <span>Showing</span>
      <Select onValueChange={(value) => setCount(Number(value))}>
        <SelectTrigger className='w-[80px] bg-blue-400 border-none text-white'>
          <SelectValue placeholder='10' />
        </SelectTrigger>
        <SelectContent className='outline-none border-1 border-slate-300 bg-white'>
          <SelectGroup>
            <SelectLabel>Max fill</SelectLabel>
            <SelectItem value='1' className='hover:bg-slate-100'>1</SelectItem>
            <SelectItem value='5' className='hover:bg-slate-100'>5</SelectItem>
            <SelectItem value='10' className='hover:bg-slate-100'>10</SelectItem>
            <SelectItem value='20' className='hover:bg-slate-100'>20</SelectItem>
            <SelectItem value='30' className='hover:bg-slate-100'>30</SelectItem>
            <SelectItem value='40' className='hover:bg-slate-100'>40</SelectItem>
            <SelectItem value='50' className='hover:bg-slate-100'>50</SelectItem>
            <SelectItem value='100' className='hover:bg-slate-100'>100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectLimitData
