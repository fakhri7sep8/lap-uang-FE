'use client'

import Image from 'next/image'
import React from 'react'
import { useSidebar } from "@/components/ui/sidebar"
import { IoIosPaper } from "react-icons/io";
import { Poppins } from "next/font/google"
import { Button } from './button'

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function Navbar() {
    const { state } = useSidebar()
    console.log("Sidebar state:", state)

    return (
        <div className="w-full h-14 flex items-center px-4 shadow-md bg-white">
            <div
                key={state} // ini opsional tapi bisa paksa re-render
                className={`transition-all duration-300 ${state == 'collapsed' ? 'ml-0 flex items-center justify-between w-full' : 'ml-[15rem] flex items-center justify-between w-full'
                    }`}
            >
                <Image
                    src="/img/Logo.png"
                    alt="Logo"
                    width={140}
                    height={40}
                />
                <div className={`flex flex-col items-center gap-2 ${poppins.className}`}>
                    {/* <div className={`text-xs font-medium ${poppins.className}`}>Wednesday, 18 July 2025</div> */}
                    <Button variant="outline" size="sm">
                        <IoIosPaper /> Cetak Ringkasan
                    </Button>
                </div>
            </div>

        </div>
    )
}
