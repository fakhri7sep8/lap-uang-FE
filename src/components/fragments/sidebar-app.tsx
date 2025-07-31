'use client'
import {
    LayoutDashboard,
    GraduationCap,
    UserPlus,
    Users2,
    Coins,
    Banknote,
    History,
    FileText,
    AlertTriangle,
    CircleDollarSign,
    ArrowDownToLine,
    Tags,
    BarChart4,
    Activity,
    CalendarRange,
    ReceiptText,
    ClipboardList,
    Settings,
    School,
    KeyRound,
    HelpCircle,
    BookText,
    Info,
    ChevronDown,
    ChevronRight,
    Star,
    User2,
    Package,
    Inbox,
    ChevronUp,
    LogOut,
    ChevronLeft,
    Database,
    ShieldUser,
    FileWarning,
    CircleDollarSignIcon,
    SlidersHorizontal,
} from "lucide-react";
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
    useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

import { Poppins } from "next/font/google"

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export function AppSidebar() {
    const { toggleSidebar } = useSidebar()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [openStudents, setOpenStudents] = useState(false);
    const [openSPP, setOpenSPP] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    return (
        <Sidebar
            className={`${sidebarCollapsed ? "w-28 bg-red-500" : "w-64"}  transition-all duration-300 ease-in-out `}
        >
            <>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenuButton
                            className="flex items-center text-center justify-center gap-3 py-6 h-full px-2 rounded-md bg-white hover:bg-gray-100 transition-colors mb-5 flex-col"
                            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                        >
                            <img
                                src="https://github.com/shadcn.png"
                                alt="avatar"
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <div className="flex flex-col text-left flex-1 items-center">
                                <span className={`${poppins.className} font-semibold text-gray-900 leading-tight`}>SMK Madinatul Quran</span>
                                <span className={`${poppins.className} text-sm text-gray-500 leading-tight`}>m@example.com</span>
                            </div>
                        </SidebarMenuButton>
                        <SidebarGroupLabel className={`${poppins.className} font-semibold text-xl mb-5`}>Platform</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Collapsible open={true}>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton>
                                                <LayoutDashboard className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Dashboard Utama</span>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#dashboard-total-siswa">
                                                            <Users2 className="mr-2" size={16} />
                                                            <span className={poppins.className}>Total Siswa</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#dashboard-saldo-kas">
                                                            <CircleDollarSign className="mr-2" size={16} />
                                                            <span className={poppins.className}>Saldo Kas</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#dashboard-pemasukan">
                                                            <Banknote className="mr-2" size={16} />
                                                            <span className={poppins.className}>Pemasukan</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#dashboard-pengeluaran">
                                                            <ArrowDownToLine className="mr-2" size={16} />
                                                            <span className={poppins.className}>Pengeluaran</span>
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </SidebarMenuItem>
                                {/* 👨‍🎓 MANAJEMEN SISWA */}
                                <Collapsible open={openStudents} onOpenChange={setOpenStudents}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenStudents(!openStudents)}>
                                                <GraduationCap className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Manajemen Siswa</span>
                                                {openStudents ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#tambah-siswa">
                                                            <UserPlus className="mr-2" size={16} /> Tambah Siswa
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#lihat-siswa">
                                                            <Users2 className="mr-2" size={16} /> Lihat Semua Siswa
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>

                                {/* 💵 PEMBAYARAN SPP */}
                                <Collapsible open={openSPP} onOpenChange={setOpenSPP}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenSPP(!openSPP)}>
                                                <Coins className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Pembayaran SPP</span>
                                                {openSPP ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#input-pembayaran">
                                                            <Banknote className="mr-2" size={16} /> Input Pembayaran
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#riwayat-pembayaran">
                                                            <History className="mr-2" size={16} /> Riwayat Pembayaran
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#kwitansi">
                                                            <FileText className="mr-2" size={16} /> Kwitansi
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>

                                {/* 📌 TUNGGAKAN */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="#tunggakan">
                                            <AlertTriangle className="mr-2" size={18} />
                                            <span className={`font-semibold ${poppins.className}`}>Tunggakan SPP</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {/* 💸 PENGELUARAN SEKOLAH */}
                                <Collapsible open={openExpense} onOpenChange={setOpenExpense}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenExpense(!openExpense)}>
                                                <CircleDollarSign className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Pengeluaran Sekolah</span>
                                                {openExpense ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#input-pengeluaran">
                                                            <ArrowDownToLine className="mr-2" size={16} /> Input Pengeluaran
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#riwayat-pengeluaran">
                                                            <History className="mr-2" size={16} /> Riwayat Pengeluaran
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#kategori-pengeluaran">
                                                            <Tags className="mr-2" size={16} /> Kategori
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>

                                {/* 📈 LAPORAN KEUANGAN */}
                                <Collapsible open={openReports} onOpenChange={setOpenReports}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenReports(!openReports)}>
                                                <BarChart4 className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Laporan Keuangan</span>
                                                {openReports ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#arus-kas">
                                                            <Activity className="mr-2" size={16} /> Laporan Arus Kas
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#spp-bulanan">
                                                            <CalendarRange className="mr-2" size={16} /> Laporan SPP
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#laporan-pengeluaran">
                                                            <ReceiptText className="mr-2" size={16} /> Laporan
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#rekap-kwitansi">
                                                            <ClipboardList className="mr-2" size={16} /> Rekap Kwitansi
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>

                                {/* ⚙️ PENGATURAN SISTEM */}
                                <Collapsible open={openSettings} onOpenChange={setOpenSettings}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenSettings(!openSettings)}>
                                                <Settings className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Pengaturan Sistem</span>
                                                {openSettings ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#profil-sekolah">
                                                            <School className="mr-2" size={16} /> Profil Sekolah
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#ganti-password">
                                                            <KeyRound className="mr-2" size={16} /> Ganti Password
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                                {/* ❓ BANTUAN */}
                                <Collapsible open={openHelp} onOpenChange={setOpenHelp}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton onClick={() => setOpenHelp(!openHelp)}>
                                                <HelpCircle className="mr-2" size={18} />
                                                <span className={`font-semibold ${poppins.className}`}>Bantuan</span>
                                                {openHelp ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#panduan">
                                                            <BookText className="mr-2" size={16} /> Tutorial
                                                        </a>
                                                    </SidebarMenuButton>
                                                    <SidebarMenuButton asChild>
                                                        <a href="#tentang">
                                                            <Info className="mr-2" size={16} /> Tentang Aplikasi
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
                                <DropdownMenuContent side="top" className="w-[250px] bg-gray-200 backdrop-blur-md bg-opacity-30 border border-black rounded-lg shadow-lg p-0 ml-64">
                                    {/* Header: Avatar, Name, Email */}
                                    <div className="flex items-center gap-3 px-4 py-3 border-b border-black">
                                        <img
                                            src="https://github.com/shadcn.png"
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className={`${poppins.className} font-semibold text-black`}>shadcn</div>
                                            <div className={`${poppins.className} text-sm text-gray-700`}>m@example.com</div>
                                        </div>
                                    </div>
                                    {/* Upgrade */}
                                    <DropdownMenuItem className="px-4 py-2 text-black hover:bg-white gap-2 cursor-pointer hover:font-semibold">
                                        <Star size={18} className="text-yellow-400" />
                                        <span className={`text-black ${poppins.className}`}>Upgrade to Pro</span>
                                    </DropdownMenuItem>
                                    {/* Account */}
                                    <DropdownMenuItem className="px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2">
                                        <User2 size={18} className="text-gray-400" />
                                        <span className={`${poppins.className}`}>Account</span>
                                    </DropdownMenuItem>
                                    {/* Billing */}
                                    <DropdownMenuItem className="px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2">
                                        <Package size={18} className="text-gray-400" />
                                        <span className={`${poppins.className}`}>Billing</span>
                                    </DropdownMenuItem>
                                    {/* Notifications */}
                                    <DropdownMenuItem className="px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2">
                                        <Inbox size={18} className="text-gray-400" />
                                        <span className={`${poppins.className}`}>Notifications</span>
                                    </DropdownMenuItem>
                                    {/* Divider */}
                                    <div className="border-t border-[#232329] my-1" />
                                    {/* Log out */}
                                    <DropdownMenuItem className="px-4 py-2 text-black hover:bg-white hover:font-semibold cursor-pointer gap-2">
                                        <LogOut size={18} className="text-gray-400" />
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