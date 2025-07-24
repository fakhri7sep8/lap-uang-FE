'use client'
import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2, ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, History as HistoryIcon, Star, Settings as SettingsIcon, Package, BookText, SlidersHorizontal, Menu, CalendarCheck2, Database, Coins, LucideCircleDollarSign, CircleDollarSignIcon, School, LucideBadgeDollarSign, LogOut, Edit } from "lucide-react"
import React, { useState } from "react"

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
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

import { Poppins } from "next/font/google"

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

// // Menu items.
// const items = [
//     {
//         title: "Home",
//         url: "#",
//         icon: Home,
//     },
//     {
//         title: "Inbox",
//         url: "#",
//         icon: Inbox,
//     },
//     {
//         title: "Calendar",
//         url: "#",
//         icon: Calendar,
//     },
//     {
//         title: "Search",
//         url: "#",
//         icon: Settings,
//     },
//     {
//         title: "Settings",
//         url: "#",
//         icon: Settings,
//     },
// ]

export function AppSidebar() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [openPlayground, setOpenPlayground] = useState(false)
    const [openModels, setOpenModels] = useState(false)
    const [openDocs, setOpenDocs] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)

    return (
        <Sidebar
            className={`${sidebarCollapsed ? "w-16" : "w-64"}  transition-all duration-300 ease-in-out`}
        >
            <div className="flex items-center justify-end p-2 mr-2">
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 rounded hover:bg-gray-200"
                >
                    {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
            {!sidebarCollapsed ? (
                <>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className={`${poppins.className} font-semibold text-lg mb-2`}>Platform</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-4">
                                    {/* Playground Collapsible */}
                                    <Collapsible open={openPlayground} onOpenChange={setOpenPlayground}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton onClick={() => setOpenPlayground(!openPlayground)}>
                                                    <Database className="mr-2" size={18} />
                                                    <span className={`font-semibold ${poppins.className}`}>Menu Data Awal</span>
                                                    {openPlayground ? (
                                                        <ChevronDown className="ml-auto" size={16} />
                                                    ) : (
                                                        <ChevronRight className="ml-auto" size={16} />
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#history">
                                                                <School className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Data Sekolah</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#starred">
                                                                <User2 className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Data Siswa</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#settings">
                                                                <LucideBadgeDollarSign className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Tarif Pemabyaran</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#settings">
                                                                <LogOut className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Pos Biaya Pengeluaran</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                    {/* Models Collapsible */}
                                    <Collapsible open={openModels} onOpenChange={setOpenModels}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton onClick={() => setOpenModels(!openModels)}>
                                                    <Coins className="mr-2" size={18} />
                                                    <span className={`font-semibold ${poppins.className}`}>Menu Income</span>
                                                    {openModels ? (
                                                        <ChevronDown className="ml-auto" size={16} />
                                                    ) : (
                                                        <ChevronRight className="ml-auto" size={16} />
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {/* Isi submenu Models */}
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#model1">
                                                                <Package className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Input Pembayran</span>
                                                            </a>
                                                        </SidebarMenuButton>

                                                        <SidebarMenuButton asChild>
                                                            <a href="#model1">
                                                                <Package className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Input Pembayran</span>
                                                            </a>
                                                        </SidebarMenuButton>

                                                        <SidebarMenuButton asChild>
                                                            <a href="#model1">
                                                                <Package className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Input Pembayran</span>
                                                            </a>
                                                        </SidebarMenuButton>

                                                        <SidebarMenuButton asChild>
                                                            <a href="#model1">
                                                                <Package className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Input Pembayran</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                    {/* Documentation Collapsible */}
                                    <Collapsible open={openDocs} onOpenChange={setOpenDocs}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton onClick={() => setOpenDocs(!openDocs)}>
                                                    <LucideCircleDollarSign className="mr-2" size={18} />
                                                    <span className={`font-semibold ${poppins.className}`}>Menu Expense</span>
                                                    {openDocs ? (
                                                        <ChevronDown className="ml-auto" size={16} />
                                                    ) : (
                                                        <ChevronRight className="ml-auto" size={16} />
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {/* Isi submenu Documentation */}
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#docs1">
                                                                <BookText className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Input Pengeluaran</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                    {/* Settings Collapsible */}
                                    <Collapsible open={openSettings} onOpenChange={setOpenSettings}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton onClick={() => setOpenSettings(!openSettings)}>
                                                    <SlidersHorizontal className="mr-2" size={18} />
                                                    <span className={`font-semibold ${poppins.className}`}>Pengaturan</span>
                                                    {openSettings ? (
                                                        <ChevronDown className="ml-auto" size={16} />
                                                    ) : (
                                                        <ChevronRight className="ml-auto" size={16} />
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {/* Isi submenu Settings */}
                                                    <SidebarMenuSubItem>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#settings1">
                                                                <SettingsIcon className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Ubah Data Sandi</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                        <SidebarMenuButton asChild>
                                                            <a href="#settings1">
                                                                <Edit className="mr-2" size={16} />
                                                                <span className={`${poppins.className}`}>Edit Data Base</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuSubItem>
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
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
                                            className="flex items-center gap-3 py-6 px-2 rounded-md bg-white hover:bg-gray-100 transition-colors"
                                            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                                        >
                                            <img
                                                src="https://github.com/shadcn.png"
                                                alt="avatar"
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col text-left flex-1">
                                                <span className={`${poppins.className} font-semibold text-gray-900 leading-tight`}>shadcn</span>
                                                <span className={`${poppins.className} text-sm text-gray-500 leading-tight`}>m@example.com</span>
                                            </div>
                                            <ChevronUp className="ml-2 text-gray-400" size={18} />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top" className="w-[250px] bg-[#18181b] border border-[#232329] rounded-lg shadow-lg p-0">
                                        {/* Header: Avatar, Name, Email */}
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#232329]">
                                            <img
                                                src="https://github.com/shadcn.png"
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className={`${poppins.className} font-semibold text-white`}>shadcn</div>
                                                <div className={`${poppins.className} text-sm text-gray-400`}>m@example.com</div>
                                            </div>
                                        </div>
                                        {/* Upgrade */}
                                        <DropdownMenuItem className="px-4 py-2 text-white hover:bg-[#232329] cursor-pointer gap-2">
                                            <Star size={18} className="text-yellow-400" />
                                            <span className={`${poppins.className}`}>Upgrade to Pro</span>
                                        </DropdownMenuItem>
                                        {/* Account */}
                                        <DropdownMenuItem className="px-4 py-2 text-white hover:bg-[#232329] cursor-pointer gap-2">
                                            <User2 size={18} className="text-gray-400" />
                                            <span className={`${poppins.className}`}>Account</span>
                                        </DropdownMenuItem>
                                        {/* Billing */}
                                        <DropdownMenuItem className="px-4 py-2 text-white hover:bg-[#232329] cursor-pointer gap-2">
                                            <Package size={18} className="text-gray-400" />
                                            <span className={`${poppins.className}`}>Billing</span>
                                        </DropdownMenuItem>
                                        {/* Notifications */}
                                        <DropdownMenuItem className="px-4 py-2 text-white hover:bg-[#232329] cursor-pointer gap-2">
                                            <Inbox size={18} className="text-gray-400" />
                                            <span className={`${poppins.className}`}>Notifications</span>
                                        </DropdownMenuItem>
                                        {/* Divider */}
                                        <div className="border-t border-[#232329] my-1" />
                                        {/* Log out */}
                                        <DropdownMenuItem className="px-4 py-2 text-white hover:bg-[#232329] cursor-pointer gap-2">
                                            <LogOut size={18} className="text-gray-400" />
                                            <span className={`${poppins.className}`}>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </>
            ) : (
                // Collapsed sidebar: only icons
                <div className="flex flex-col h-full justify-between items-center py-2">
                    <div className="flex flex-col gap-4 mt-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200">
                            <Database size={22} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200">
                            <Coins size={22} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200">
                            <CircleDollarSignIcon size={22} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200">
                            <SlidersHorizontal size={22} />
                        </button>
                    </div>
                    <div className="mb-2">
                        <img
                            src="https://github.com/shadcn.png"
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    </div>
                </div>
            )}
        </Sidebar>
    )
}

export default AppSidebar