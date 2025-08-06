/* eslint-disable @typescript-eslint/no-explicit-any */
import { link } from "fs";
import {
  GraduationCap,
  UserPlus,
  Users2,
  Coins,
  Banknote,
  History,
  FileText,
  CircleDollarSign,
  Tags,
  BarChart4,
  Activity,
  CalendarRange,
  Settings,
  School,
  KeyRound,
  HelpCircle,
  BookText,
  Info,
} from "lucide-react";

export function generateMenuDashboard({
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
  setOpenHelp,
}: any) {
  return [
    {
      name: "Manajemen Siswa",
      handleOpen: setOpenStudents,
      icon: <GraduationCap className="mr-2" size={18} />,
      open: openStudents,
      children: [
        {
          name: "Tambah Siswa",
          icon: <UserPlus className="mr-2" size={16} />,
        },
        {
          name: "Lihat Semua Siswa",
          icon: <Users2 className="mr-2" size={16} />,
          link: "/dashboard/siswa",
        },
      ],
    },
    {
      name: "Pembayaran SPP",
      handleOpen: setOpenSPP,
      icon: <Coins className="mr-2" size={18} />,
      open: openSPP,
      children: [
        {
          name: "Input Pembayaran",
          icon: <Banknote className="mr-2" size={16} />,
        },
        {
          name: "Riwayat Pembayaran",
          icon: <History className="mr-2" size={16} />,
          link: "/dashboard/riwayat-pembayaran",
        },
        {
          name: "Kwitansi Pembayaran",
          icon: <FileText className="mr-2" size={16} />,
        },
      ],
    },
    {
      name: "Pengeluaran Sekolah",
      handleOpen: setOpenExpense,
      icon: <CircleDollarSign className="mr-2" size={18} />,
      open: openExpense,
      children: [
        {
          name: "Input Pengeluaran",
          icon: <Banknote className="mr-2" size={16} />,
        },
        {
          name: "Riwayat Pengeluaran",
          icon: <History className="mr-2" size={16} />,
        },
        {
          name: "Kategori Pengeluaran",
          icon: <Tags className="mr-2" size={16} />,
        },
      ],
    },
    {
      name: "laporan Keuangan",
      handleOpen: setOpenReports,
      icon: <BarChart4 className="mr-2" size={18} />,
      open: openReports,
      children: [
        {
          name: "Laporan Arus Kas",
          icon: <Activity className="mr-2" size={16} />,
        },
        {
          name: "Laporan SPP",
          icon: <CalendarRange className="mr-2" size={16} />,
        },
        {
          name: "Laporan",
          icon: <CalendarRange className="mr-2" size={16} />,
        },
        {
          name: "Recap Kwitansi",
          icon: <FileText className="mr-2" size={16} />,
        },
      ],
    },
    {
      name: "Pengaturan Sistem",
      handleOpen: setOpenSettings,
      icon: <Settings className="mr-2" size={18} />,
      open: openSettings,
      children: [
        {
          name: "Profile Sekolah",
          icon: <School className="mr-2" size={16} />,
        },
        {
          name: "Ganti Password",
          icon: <KeyRound className="mr-2" size={16} />,
          link: "dashboard/ganti-password",
        },
      ],
    },
    {
      name: "Bantuan",
      handleOpen: setOpenHelp,
      icon: <HelpCircle className="mr-2" size={18} />,
      open: openHelp,
      children: [
        {
          name: "Tutorial",
          icon: <BookText className="mr-2" size={16} />,
          link: "/dashboard/tutorial",
        },
        {
          name: "Tentang Aplikasi",
          icon: <Info className="mr-2" size={16} />,
        },
      ],
    },
  ];
}
