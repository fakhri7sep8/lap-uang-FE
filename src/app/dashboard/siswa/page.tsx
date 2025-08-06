"use client";

import {
  ChevronDown,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Users,
  Pencil,
  Trash,
} from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialData = [
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
    nama: "Fajar Hidayat",
    noRegistrasi: "667788990",
    asrama: "FoxtrotAsrama",
    angkatan: "2022",
    status: "Aktif",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "06 Jun 2023",
  },
  {
    id: 7,
    nama: "Gita Nurhaliza",
    noRegistrasi: "778899001",
    asrama: "GolfAsrama",
    angkatan: "2020",
    status: "Lulus",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "07 Jul 2023",
  },
  {
    id: 8,
    nama: "Hendra Wijaya",
    noRegistrasi: "889900112",
    asrama: "HotelAsrama",
    angkatan: "2021",
    status: "Aktif",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "08 Aug 2023",
  },
  {
    id: 9,
    nama: "Intan Permata",
    noRegistrasi: "990011223",
    asrama: "IndiaAsrama",
    angkatan: "2023",
    status: "Aktif",
    jurusan: "TKJ",
    spp: 500000,
    dibuat: "09 Sep 2023",
  },
  {
    id: 10,
    nama: "Joko Prasetyo",
    noRegistrasi: "101112131",
    asrama: "JulietAsrama",
    angkatan: "2022",
    status: "Keluar",
    jurusan: "RPL",
    spp: 500000,
    dibuat: "10 Oct 2023",
  },

];

const LihatSemuaSiswa = () => {
  const [siswaData, setSiswaData] = useState(initialData);
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(5);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJurusan, setFilterJurusan] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal Edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSiswa, setEditSiswa] = useState<any>(null);

  const handleEdit = (siswa: any) => {
    setEditSiswa(siswa);
    setEditModalOpen(true);
  };

  const handleUpdateSiswa = () => {
    setSiswaData((prev) =>
      prev.map((s) => (s.id === editSiswa.id ? editSiswa : s))
    );
    setEditModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setSiswaData((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filteredData = siswaData
    .filter(
      (s) =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.noRegistrasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.asrama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((s) => (filterStatus ? s.status === filterStatus : true))
    .filter((s) => (filterJurusan ? s.jurusan === filterJurusan : true))
    .filter((s) => (filterAngkatan ? s.angkatan === filterAngkatan : true));

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
    <section className="flex flex-col gap-10 w-full">
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-9 bg-blue-400 text-white h-40 flex justify-between items-center shadow-md">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-2xl">Jumlah Siswa</h2>
            <p className="text-6xl font-medium">{siswaData.length}</p>
          </div>
          <div className="bg-blue-100 rounded-full w-20 h-20 flex justify-center items-center">
            <GraduationCap size={32} className="text-blue-700" />
          </div>
        </div>
        <div className="rounded-xl bg-green-400 p-9 text-white h-40 flex justify-between items-center shadow-md">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-2xl">Total Data</h2>
            <p className="text-6xl font-medium">
              {filteredData.slice(0, showCount).length}
            </p>
          </div>
          <div className="bg-green-100 rounded-full w-20 h-20 flex justify-center items-center">
            <Users size={32} className="text-green-700" />
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <h2 className="text-2xl font-semibold w-full">Tabel Siswa</h2>
        <div className="flex items-center gap-4 w-full h-12">
          <div className="flex items-center w-2/3 h-full px-3 border border-gray-300 rounded-md shadow-sm bg-white">
            <input
              type="text"
              placeholder="Cari nama / no. induk / asrama..."
              className="w-full h-full outline-none bg-transparent pl-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-4 w-1/3 h-full">
            <DropdownMenu>
              <p>Showing</p>
              <DropdownMenuTrigger asChild>
                <button className="w-1/2 flex items-center justify-center gap-2 h-full px-6 py-2 text-white rounded-md bg-green-400 shadow-sm">
                  <span className="text-sm">{showCount}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-none px-2 w-[100px] text-sm">
                <DropdownMenuRadioGroup
                  value={String(showCount)}
                  onValueChange={(value) => setShowCount(parseInt(value))}
                >
                  {[5, 10, 15].map((val) => (
                    <DropdownMenuRadioItem key={val} value={String(val)}>
                      {val}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setShowFilter(true)}
              className="w-1/2 flex justify-center items-center gap-2 px-6 py-2 h-full bg-green-400 text-white rounded-md shadow-sm hover:bg-green-500 transition"
            >
              <SlidersHorizontal />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="w-full h-full shadow-sm">
          <Table className="w-full table-auto bg-white text-gray-700">
            <TableHeader className="bg-gray-100 text-sm font-semibold text-center">
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No. Induk</TableHead>
                <TableHead>Asrama</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Tarif SPP</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm text-center divide-y">
              {filteredData.slice(0, showCount).map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell>{siswa.id}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.noRegistrasi}</TableCell>
                  <TableCell>{siswa.asrama}</TableCell>
                  <TableCell>{siswa.angkatan}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                        siswa.status
                      )}`}
                    >
                      {siswa.status}
                    </span>
                  </TableCell>
                  <TableCell>{siswa.jurusan}</TableCell>
                  <TableCell>
                    Rp {siswa.spp.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{siswa.dibuat}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(siswa)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(siswa.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </TableCell>
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
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col gap-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <h3 className="text-xl font-semibold">Filter</h3>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Status
                  <select
                    className="mt-1 border rounded-md px-3 py-2"
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
                    className="mt-1 border rounded-md px-3 py-2"
                    value={filterJurusan}
                    onChange={(e) => setFilterJurusan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="TKJ">TKJ</option>
                    <option value="RPL">RPL</option>
                  </select>
                </label>
                <label className="flex flex-col text-sm">
                  Angkatan
                  <select
                    className="mt-1 border rounded-md px-3 py-2"
                    value={filterAngkatan}
                    onChange={(e) => setFilterAngkatan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    {[2023, 2022, 2021, 2020, 2019].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setFilterJurusan("");
                    setFilterAngkatan("");
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

      <AnimatePresence>
        {editModalOpen && editSiswa && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-[400px] shadow-lg flex flex-col gap-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-semibold">Edit Siswa</h3>
              <input
                className="border px-3 py-2 rounded-md"
                value={editSiswa.nama}
                onChange={(e) =>
                  setEditSiswa({ ...editSiswa, nama: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded-md"
                value={editSiswa.noRegistrasi}
                onChange={(e) =>
                  setEditSiswa({ ...editSiswa, noRegistrasi: e.target.value })
                }
              />
              <input
                className="border px-3 py-2 rounded-md"
                value={editSiswa.asrama}
                onChange={(e) =>
                  setEditSiswa({ ...editSiswa, asrama: e.target.value })
                }
              />
              <button
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={handleUpdateSiswa}
              >
                Simpan Perubahan
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LihatSemuaSiswa;
