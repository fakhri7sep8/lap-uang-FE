"use client";
import { Button } from '@/components/ui/button'
import { Plus, PlusCircleIcon, Search, SearchCodeIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const SearchInput2 = ({ onChange, searchTerm }: { onChange: any, searchTerm: any }) => {
    const router = useRouter()

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-2 w-[80%]">
                <input
                    type="text"
                    placeholder="Work Name"
                    value={searchTerm}
                    onChange={(e) => onChange(e)}
                    className="border border-gray-300 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"

                />
                <SearchIcon className='mt-2'/>

            </div>
            <div className="ml-auto mt-2">
                {/* Plus button with hover animation + tooltip: scale + subtle rotation on icon */}
                <Button onClick={() => router.push('/dashboard/pengeluaran/input2')} className="relative bg-blue-500 hover:bg-blue-600 text-white rounded-full mr-6 p-2 shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105 group" aria-label="Tambah Pengeluaran">
                    <PlusCircleIcon className='font-bold text-white transition-transform duration-200 transform group-hover:scale-110 group-hover:rotate-12' />
                    {/* Tooltip text: hidden by default, appears on group-hover */}
                    <span role="tooltip" className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
                        Tambah Data
                    </span>
                </Button>
                <Button
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl transition-transform duration-200 transform hover:scale-105 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                    Export
                </Button>
            </div>
        </div>
    )
}

export default SearchInput2
