
import { link } from 'fs'
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
  Soup
} from 'lucide-react'
import { Children } from 'react'

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
  setOpenHelp
}: any) {
  return [
    {
      name: 'Manajemen Siswa',
      handleOpen: setOpenStudents,
      icon: <GraduationCap className='mr-2' size={18} />,
      open: openStudents,
      children: [
        {
          name: 'Tambah Siswa',
          icon: <UserPlus className='mr-2' size={16} />,
          link: '/dashboard/siswa/create',
          children: null
        },
        {
          name: 'Lihat Semua Siswa',
          icon: <Users2 className='mr-2' size={16} />,
          link: '/dashboard/siswa/view',
          children: null
        }
      ]
    },
    {
      name: 'Pembayaran Siswa',
      handleOpen: setOpenSPP,
      icon: <Coins className='mr-2' size={18} />,
      open: openSPP,
      children: [
        {
          name: 'Kategori Pembayaran',
          icon: <Banknote className='mr-2' size={16} />,
          link: '/dashboard/pembayaran/kategori',
          children: null
        },
        {
          name: 'Input Pembayaran',
          icon: <History className='mr-2' size={16} />,
          link: '/dashboard/pembayaran/input',
          children: null
        },
        {
          name: 'Data SPP',
          icon: <FileText className='mr-2' size={16} />,
          link: '/dashboard/pembayaran/spp',
          children: null
        },
        {
          name: 'Data Selain SPP',
          icon: <FileText className='mr-2' size={16} />,
          link: '/dashboard/pembayaran/other/view',
          children: null
        }
      ]
    },
    {
      name: 'Pengeluaran Sekolah',
      handleOpen: setOpenExpense,
      icon: <CircleDollarSign className='mr-2' size={18} />,
      open: openExpense,
      children: [
        {
          name: 'Operasional',
          icon: <Tags className='mr-2' size={16} />,
          link: '/dashboard/pengeluaran/operasional',
          open: openExpense,
          children: null
        },
        {
          name: 'Pemeliharaan',
          icon: <Banknote className='mr-2' size={16} />,
          link: '/dashboard/pengeluaran/pemeliharaan',
          open: openExpense,
          children: null
        },
        {
          name: 'Upah Kariawan',
          icon: <Banknote className='mr-2' size={16} />,
          link: '/dashboard/pengeluaran/upah_kariawan',
          children: null
        },
        {
          name: 'Biaya Makan',
          icon: <Soup className='mr-2' size={16} />,
          link: '/dashboard/pengeluaran/biaya_makan',
          children: null
        },
        {
          name: 'Lain',
          icon: <History className='mr-2' size={16} />,
          link: '/dashboard/pengeluaran/view',
          children: null
        },

      ]
    },
    // {
    //   name: 'laporan Keuangan',
    //   handleOpen: setOpenReports,
    //   icon: <BarChart4 className='mr-2' size={18} />,
    //   open: openReports,
    //   children: [
    //     {
    //       name: 'Laporan Arus Kas',
    //       icon: <Activity className='mr-2' size={16} />,
    //       children: null
    //     },
    //     {
    //       name: 'Laporan SPP',
    //       icon: <CalendarRange className='mr-2' size={16} />,
    //       children: null
    //     },
    //     {
    //       name: 'Laporan',
    //       icon: <CalendarRange className='mr-2' size={16} />,
    //       children: null
    //     },
    //     {
    //       name: 'Recap Kwitansi',
    //       icon: <FileText className='mr-2' size={16} />,
    //       children: null
    //     }
    //   ]
    // },
    {
      name: 'Pengaturan Sistem',
      handleOpen: setOpenSettings,
      icon: <Settings className='mr-2' size={18} />,
      open: openSettings,
      children: [
        {
          name: 'Profile Sekolah',
          icon: <School className='mr-2' size={16} />,
          children: null
        },
        {
          name: 'Ganti Password',
          icon: <KeyRound className='mr-2' size={16} />,
          link: '/dashboard/pengaturan_sistem/ganti_password',
          children: null
        }
      ]
    },
    // {
    //   name: 'Bantuan',
    //   handleOpen: setOpenHelp,
    //   icon: <HelpCircle className='mr-2' size={18} />,
    //   open: openHelp,
    //   children: [
    //     {
    //       name: 'Tutorial',
    //       icon: <BookText className='mr-2' size={16} />,
    //       link: '/dashboard/tutorial',
    //       children: null
    //     },
    //     {
    //       name: 'Tentang Aplikasi',
    //       icon: <Info className='mr-2' size={16} />,
    //       children: null
    //     }
    //   ]
    // }
  ]
}
