"use client";
import { Button } from '@/components/ui/button'
import { PlusCircleIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const limitOptions = [10, 25, 50, 100]

const SearchInput = ({
    onChange,
    searchTerm,
    onLimitChange = (n: number) => { },
    onDateFilterChange = (from: string | null, to: string | null) => { }
}: {
    onChange: any,
    searchTerm: any,
    onLimitChange?: any,
    onDateFilterChange?: any
}) => {

    const router = useRouter()
    const [showLimit, setShowLimit] = useState(false)
    const [showDate, setShowDate] = useState(false)
    const [limit, setLimit] = useState<number>(25)
    const [fromDate, setFromDate] = useState<string | null>(null)
    const [toDate, setToDate] = useState<string | null>(null)

    const limitRef = useRef<HTMLDivElement | null>(null)
    const dateRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const target = e.target as Node
            if (showLimit && limitRef.current && !limitRef.current.contains(target)) setShowLimit(false)
            if (showDate && dateRef.current && !dateRef.current.contains(target)) setShowDate(false)
        }
        window.addEventListener('click', onClick)
        return () => window.removeEventListener('click', onClick)
    }, [showLimit, showDate])

    function applyLimit(n: number) {
        setLimit(n)
        onLimitChange(n)
        setShowLimit(false)
    }

    function applyDate() {
        onDateFilterChange(fromDate, toDate)
        setShowDate(false)
    }

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
                <SearchIcon className='mt-2' />
            </div>

            <div className="ml-auto mt-2 flex items-center gap-3">

                {/* LIMIT BUTTON */}
                <div className="relative" ref={limitRef}>
                    <Button
                        onClick={(e) => { e.stopPropagation(); setShowDate(false); setShowLimit((s) => !s) }}
                        variant="outline"
                        size="sm"
                        className="rounded-xl text-blue-700 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
                    >
                        Limit: <span className='font-medium ml-2'>{limit}</span>
                    </Button>

                    {showLimit && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-2 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-1">
                                {limitOptions.map((opt) => (
                                    <Button
                                        key={opt}
                                        variant="ghost"
                                        size="sm"
                                        className="justify-start w-full text-sm transition-transform duration-200 transform hover:scale-105 hover:bg-blue-50 rounded-md"
                                        onClick={(ev) => { ev.stopPropagation(); applyLimit(opt) }}
                                    >
                                        {opt} / page
                                    </Button>
                                ))}
                            </div>

                            <div className="mt-2 border-t pt-2">
                                <label className="text-xs text-gray-500">Custom</label>
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Custom"
                                    className="w-full mt-1 px-2 py-1 border rounded"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = Number((e.target as HTMLInputElement).value)
                                            if (val > 0) applyLimit(val)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* DATE FILTER BUTTON */}
                <div className="relative" ref={dateRef}>
                    <Button
                        onClick={(e) => { e.stopPropagation(); setShowLimit(false); setShowDate((s) => !s) }}
                        variant="outline"
                        size="sm"
                        className="rounded-xl py-4 text-blue-700 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
                    >
                        Filter Tanggal
                    </Button>

                    {showDate && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs text-gray-500">Dari</label>
                            <input
                                type="date"
                                className="w-full mt-1 px-2 py-1 border rounded"
                                value={fromDate ?? ''}
                                onChange={(e) => setFromDate(e.target.value || null)}
                            />

                            <label className="text-xs text-gray-500 mt-2">Sampai</label>
                            <input
                                type="date"
                                className="w-full mt-1 px-2 py-1 border rounded"
                                value={toDate ?? ''}
                                onChange={(e) => setToDate(e.target.value || null)}
                            />

                            <div className="flex justify-end gap-2 mt-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="transition-transform duration-200 transform hover:scale-105"
                                    onClick={() => { setFromDate(null); setToDate(null); onDateFilterChange(null, null); setShowDate(false) }}
                                >
                                    Reset
                                </Button>

                                <Button
                                    variant="default"
                                    size="sm"
                                    className="transition-transform duration-200 transform hover:scale-105"
                                    onClick={() => applyDate()}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ADD BUTTON */}
                <Button
                    onClick={() => router.push('/dashboard/pengeluaran/input')}
                    className="relative bg-blue-500 hover:bg-blue-600 text-white rounded-full mr-2 p-2 shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105 group"
                    aria-label="Tambah Pengeluaran"
                >
                    <PlusCircleIcon className='font-bold text-white transition-transform duration-200 transform group-hover:scale-110 group-hover:rotate-12' />
                    <span
                        role="tooltip"
                        className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap"
                    >
                        Tambah Data
                    </span>
                </Button>

            </div>
        </div>
    )
}

export default SearchInput
