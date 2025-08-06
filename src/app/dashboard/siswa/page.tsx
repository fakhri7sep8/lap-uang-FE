"use client";

import {
  AlertOctagon,
  Eye,
  GraduationCap,
  ListFilter,
  SlidersHorizontal,
  Users,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const dummyData = [
  {
    id: 1,
    nama: "Ahmad Zaki",
    noRegistrasi: "123456789",
    asrama: "AlexAsrama",
    angkatan: "2021",
    status: "Aktif",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "01 Jan 2023",
  },
  {
    id: 2,
    nama: "Budi Santoso",
    noRegistrasi: "987654321",
    asrama: "BravoAsrama",
    angkatan: "2020",
    status: "Lulus",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "02 Feb 2023",
  },
  {
    id: 3,
    nama: "Citra Lestari",
    noRegistrasi: "112233445",
    asrama: "CharlieAsrama",
    angkatan: "2022",
    status: "Aktif",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "03 Mar 2023",
  },
  {
    id: 4,
    nama: "Dewi Ayu",
    noRegistrasi: "998877665",
    asrama: "DeltaAsrama",
    angkatan: "2021",
    status: "Keluar",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "04 Apr 2023",
  },
  {
    id: 5,
    nama: "Eka Putra",
    noRegistrasi: "556677889",
    asrama: "EchoAsrama",
    angkatan: "2023",
    status: "Aktif",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "05 May 2023",
  },
  {
    id: 6,
    nama: "Fajar Rizki",
    noRegistrasi: "223344556",
    asrama: "FoxtrotAsrama",
    angkatan: "2020",
    status: "Aktif",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "06 Jun 2023",
  },
  {
    id: 7,
    nama: "Gina Sari",
    noRegistrasi: "334455667",
    asrama: "GolfAsrama",
    angkatan: "2019",
    status: "Lulus",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "07 Jul 2023",
  },
  {
    id: 8,
    nama: "Hadi Prasetyo",
    noRegistrasi: "778899001",
    asrama: "HotelAsrama",
    angkatan: "2023",
    status: "Aktif",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "08 Aug 2023",
  },
  {
    id: 9,
    nama: "Intan Permata",
    noRegistrasi: "445566778",
    asrama: "IndiaAsrama",
    angkatan: "2022",
    status: "Keluar",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "09 Sep 2023",
  },
  {
    id: 10,
    nama: "Joko Widodo",
    noRegistrasi: "667788990",
    asrama: "JulietAsrama",
    angkatan: "2021",
    status: "Aktif",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "10 Oct 2023",
  },
];

const LihatSemuaSiswa = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(5);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dummyData
    .filter(
      (s) =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.noRegistrasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.asrama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((s) => (filterStatus ? s.status === filterStatus : true))
    .filter((s) => (filterJurusan ? s.jurusan === filterJurusan : true));

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-700";
      case "Lulus":
        return "bg-yellow-100 text-yellow-700";
      case "Keluar":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="flex flex-col gap-10 w-full ">
      <section className="grid grid-cols-2 gap-4 ">
        <div className="rounded-xl p-9 bg-blue-400  text-white h-40 flex justify-between items-center shadow-md">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-2xl">Jumlah Siswa</h2>
            <p className="text-6xl font-medium">{dummyData.length}</p>
          </div>
          <div className="bg-blue-100 rounded-full w-20 h-20 flex justify-center items-center">
            <GraduationCap size={32} className="text-blue-700" />
          </div>
        </div>
        <div className="rounded-xl bg-green-400 p-9 text-white h-40 flex justify-between items-center shadow-md">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-2xl">Total Data</h2>
            <p className="text-6xl font-medium">
              5
            </p>
          </div>
          <div className="bg-green-100 rounded-full w-20 h-20 flex justify-center items-center">
            <Users size={32} className="text-green-700" />
          </div>
        </div>

      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <h2 className="text-2xl font-semibold w-full">Tabel Siswa</h2>
        <div className="flex items-center gap-4 w-full h-12 ">
          <Input
            type="text"
            placeholder="Cari nama / no. registrasi / asrama..."
            className="w-2/3 h-full  border border-gray-300 rounded-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex items-center gap-4 w-1/3 h-full">
            <button
              onClick={() => setShowFilter(true)}
              className="w-1/2 flex justify-center items-center gap-2  px-6 py-2 h-full bg-green-400 text-white rounded-md shadow-sm hover:bg-green-500 transition"
            >
              <SlidersHorizontal />
              <span>Filter</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-1/2 flex justify-center items-center gap-2 h-full px-6 py-2 bg-blue-400 text-white rounded-md shadow-sm hover:bg-blue-400 transition">
                  <Eye /> <span>Show</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-none w-[120px] px-2">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={String(showCount)}
                  onValueChange={(value) => setShowCount(parseInt(value))}
                >
                  <DropdownMenuRadioItem
                    value="5"
                    className="hover:bg-black/10 transition-all"
                  >
                    5
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="10"
                    className="hover:bg-black/10 transition-all"
                  >
                    10
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="15"
                    className="hover:bg-black/10 transition-all"
                  >
                    15
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-full h-full  shadow-sm">
          <Table className="w-full table-auto bg-white text-gray-700">
            <TableHeader className="bg-gray-100 text-sm font-semibold text-center">
              <TableRow className="text-center">
                <TableHead className="text-center py-4">Id</TableHead>
                <TableHead className="text-center py-4">Nama</TableHead>
                <TableHead className="text-center py-4">
                  No. Registrasi
                </TableHead>
                <TableHead className="text-center py-4">Asrama</TableHead>
                <TableHead className="text-center py-4">Angkatan</TableHead>
                <TableHead className="text-center py-4">Status</TableHead>
                <TableHead className="text-center py-4">Jurusan</TableHead>
                <TableHead className="text-center py-4">Tarif SPP</TableHead>
                <TableHead className="text-center py-4">Dibuat</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-sm divide-y divide-gray-200 text-center">
              {filteredData.slice(0, showCount).map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell className=" py-4">{siswa.id}</TableCell>
                  <TableCell className=" py-4 font-medium">
                    {siswa.nama}
                  </TableCell>
                  <TableCell className=" py-4">{siswa.noRegistrasi}</TableCell>
                  <TableCell className=" py-4">{siswa.asrama}</TableCell>
                  <TableCell className=" py-4">{siswa.angkatan}</TableCell>
                  <TableCell className=" py-4">
                    <span
                      className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        siswa.status
                      )}`}
                    >
                      {siswa.status}
                    </span>
                  </TableCell>
                  <TableCell className=" py-4">{siswa.jurusan}</TableCell>
                  <TableCell className=" py-4">
                    Rp {siswa.spp.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className=" py-4">{siswa.dibuat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col gap-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Filter</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Status
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Keluar">Keluar</option>
                  </select>
                </label>
                <label className="flex flex-col text-sm">
                  Jurusan
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterJurusan}
                    onChange={(e) => setFilterJurusan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="TKJ">TKJ</option>
                    <option value="RPL">RPL</option>
                  </select>
                </label>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setFilterJurusan("");
                  }}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LihatSemuaSiswa;
