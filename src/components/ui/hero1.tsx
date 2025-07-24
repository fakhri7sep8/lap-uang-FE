import React from 'react'
import { useSidebar } from '@/components/ui/sidebar'

export const Hero1 = () => {
    const {state} = useSidebar()
    console.log("Sidebar jalaannnn", state)
  return (
    <div className=''>
        <div key={state} className={`transition-all duration-300 ${state == 'collapsed' ? 'ml-5 flex items-center justify-between' : 'ml-[18rem] flex items-center justify-between'}`}>
            <div className="w-[90%] h-56 bg-black ml-16 mt-5 rounded-lg flex flex-col items-center justify-center space-y-1.5">
                <span className="text-white text-4xl font-bold">Selamat Datang</span>
                <span className="text-white text-2xl font-bold">di Aplikasi LapUang</span>
                <span className="text-white text-2xl font-bold">Ringkasan Laporan Keuangan</span>
            </div>
        </div>
    </div>
  )
}
