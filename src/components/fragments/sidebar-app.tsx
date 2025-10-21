/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {
  LayoutDashboard,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  User2,
  ChevronUp,
  LogOut
} from 'lucide-react'
import React, { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'

import { Poppins } from 'next/font/google'
import { generateMenuDashboard } from '@/lib/menuDashboard'
import Image from 'next/image'
import Link from 'next/link'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export function AppSidebar () {
  const [openSub, setOpenSub] = useState<string | null>(null)
  const [openStudents, setOpenStudents] = useState(false)
  const [openSPP, setOpenSPP] = useState(false)
  const [openExpense, setOpenExpense] = useState(false)
  const [openReports, setOpenReports] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  const menuDashboard = generateMenuDashboard({
    openStudents,
    setOpenStudents,
    openSPP,
    setOpenSPP,
    openExpense,
    setOpenExpense,
    openReports,
    setOpenReports,
    openSettings,
    setOpenSettings,
    openHelp,
    setOpenHelp
  })

  return (
    <Sidebar
      className={` bg-white transition-all duration-300 ease-in-out border-r border-slate-200 `}
    >
      <>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenuButton className='flex items-center text-center justify-center gap-3 py-6 h-full px-2 rounded-md bg-white hover:bg-gray-100 transition-colors mb-5 flex-col'>
              <Image
                width={300}
                height={300}
                src='https://github.com/shadcn.png'
                alt='avatar'
                className='w-14 h-14 rounded-full object-cover'
              />
              <div className='flex flex-col text-left flex-1 items-center'>
                <span
                  className={`${poppins.className} font-semibold text-gray-900 leading-tight`}
                >
                  SMK Madinatul Quran
                </span>
                <span
                  className={`${poppins.className} text-sm text-gray-500 leading-tight`}
                >
                  m@example.com
                </span>
              </div>
            </SidebarMenuButton>
            <SidebarGroupLabel
              className={`${poppins.className} font-semibold text-xl mb-5`}
            >
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboard className='mr-2' size={18} />
                    <Link href='https://laporan-uang-sekolah.vercel.app/dashboard'>
                      <span className={`font-semibold ${poppins.className}`}>
                        Dashboard Utama
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* 📌 TUNGGAKAN */}
               
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href='/dashboard/tunggakan'
                      className='flex items-center'
                    >
                      <AlertTriangle className='mr-2' size={18} />
                      <span className={`font-semibold ${poppins.className}`}>
                        Tunggakan
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {menuDashboard.map(
                  (
                    menu: {
                      name: string
                      children: any[]
                      handleOpen: any
                      open: boolean
                      icon: React.ReactNode
                    },
                    i: number
                  ) => (
                    <Collapsible
                      key={i}
                      open={menu.open}
                      onOpenChange={menu.handleOpen}
                    >
                      <SidebarMenuItem>
                        {/* ========== LEVEL 1 (Main Menu) ========== */}
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            onClick={() => menu.handleOpen(!menu.open)}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center'>
                              {menu.icon}
                              <span
                                className={`font-semibold ${poppins.className}`}
                              >
                                {menu.name}
                              </span>
                            </div>
                            {menu.open ? (
                              <ChevronDown className='ml-auto' size={16} />
                            ) : (
                              <ChevronRight className='ml-auto' size={16} />
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {/* ========== LEVEL 2 (Submenu) ========== */}
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {menu.children?.map((child, j) =>
                              child.children && child.children.length > 0 ? (
                                // Submenu yang punya anak lagi (Level 3)
                                <Collapsible
                                  key={j}
                                  open={openSub === child.name}
                                  onOpenChange={() =>
                                    setOpenSub(
                                      openSub === child.name ? null : child.name
                                    )
                                  }
                                >
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                      onClick={() =>
                                        setOpenSub(
                                          openSub === child.name
                                            ? null
                                            : child.name
                                        )
                                      }
                                      className='pl-6 flex items-center justify-between'
                                    >
                                      <div className='flex items-center'>
                                        {child.icon}
                                        <span
                                          className={`${poppins.className}`}
                                        >
                                          {child.name}
                                        </span>
                                      </div>
                                      {openSub === child.name ? (
                                        <ChevronDown size={14} />
                                      ) : (
                                        <ChevronRight size={14} />
                                      )}
                                    </SidebarMenuButton>
                                  </CollapsibleTrigger>

                                  {/* ========== LEVEL 3 (Nested Items) ========== */}
                                  <CollapsibleContent>
                                    {child.children.map(
                                      (sub: any, k: number) => (
                                        <SidebarMenuButton
                                          asChild
                                          key={k}
                                          className='pl-10'
                                        >
                                          <Link href={sub.link || '#'}>
                                            {sub.icon}
                                            <span>{sub.name}</span>
                                          </Link>
                                        </SidebarMenuButton>
                                      )
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                              ) : (
                                // Submenu tanpa anak (langsung link)
                                <SidebarMenuButton
                                  asChild
                                  key={j}
                                  className='pl-6'
                                >
                                  <Link href={child.link || '#'}>
                                    {child.icon}
                                    <span>{child.name}</span>
                                  </Link>
                                </SidebarMenuButton>
                              )
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className='flex items-center gap-3 py-6 px-2 rounded-md bg-white hover:bg-gray-100 transition-colors'
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <Image
                      width={300}
                      height={300}
                      src='https://github.com/shadcn.png'
                      alt='avatar'
                      className='w-9 h-9 rounded-full object-cover'
                    />
                    <div className='flex flex-col text-left flex-1'>
                      <span
                        className={`${poppins.className} font-semibold text-gray-900 leading-tight`}
                      >
                        shadcn
                      </span>
                      <span
                        className={`${poppins.className} text-sm text-gray-500 leading-tight`}
                      >
                        m@example.com
                      </span>
                    </div>
                    <ChevronUp className='ml-2 text-gray-400' size={18} />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side='top'
                  className='w-[250px] bg-gray-200 backdrop-blur-md bg-opacity-30 border border-black rounded-lg shadow-lg p-0 ml-64'
                >
                  {/* Header: Avatar, Name, Email */}
                  <div className='flex items-center gap-3 px-4 py-3 border-b border-black'>
                    <Image
                      width={300}
                      height={300}
                      src='https://github.com/shadcn.png'
                      alt='avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div>
                      <div
                        className={`${poppins.className} font-semibold text-black`}
                      >
                        shadcn
                      </div>
                      <div
                        className={`${poppins.className} text-sm text-gray-700`}
                      >
                        m@example.com
                      </div>
                    </div>
                  </div>

                  {/* Account */}
                  <DropdownMenuItem className='px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2'>
                    <User2 size={18} className='text-gray-400' />
                    <span className={`${poppins.className}`}>Account</span>
                  </DropdownMenuItem>
                  {/* Divider */}
                  <div className='border-t border-[#232329] my-1' />
                  {/* Log out */}
                  <DropdownMenuItem className='px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2'>
                    <LogOut size={18} className='text-gray-400' />
                    <span className={`${poppins.className}`}>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </>
    </Sidebar>
  )
}

export default AppSidebar
