'use client'

import Image from 'next/image'
import React from 'react'
import { useSidebar } from "@/components/ui/sidebar"

export default function Navbar() {
    const { state } = useSidebar()
    console.log("Sidebar state:", state)

    return (
        <div className="w-full h-14 flex items-center px-4 shadow-md bg-white">
            <div
                key={state} // ini opsional tapi bisa paksa re-render
                className={`transition-all duration-300 ${state === 'collapsed' ? 'ml-[4rem]' : 'ml-[15rem]'
                    }`}
            >
                <Image
                    src="/img/Logo.png"
                    alt="Logo"
                    width={140}
                    height={40}
                />
            </div>

        </div>
    )
}
