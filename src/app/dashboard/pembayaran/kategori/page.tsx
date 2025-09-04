"use client";

import { GraduationCap, SquarePen, Trash2, Users } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardInformation from "@/components/fragments/dashboard/card-information";
import Swal from "sweetalert2";
import { useStudentModule } from "@/hooks/useStudentModule";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";

const DataPembayaran = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ state filter baru
  const [filterSemester, setFilterSemester] = useState("");
  const [filterTipeKategori, setFilterTipeKategori] = useState("");
  const [filterNominal, setFilterNominal] = useState("");

  // Ambil data siswa dari API
  const { useGetStudent, useDeleteStudent } = useStudentModule();
  const { useGetCategory, useDeleteCategory } = useCategoryPaymentModule();
  const { data: kategori, isLoading, isError } = useGetCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  // ✅ logika filter
  const filteredData = kategori
    ?.filter((s: any) =>
      searchTerm
        ? s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.TA.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((s: any) =>
      filterSemester ? s.semester.toString() === filterSemester : true
    )
    .filter((s: any) =>
      filterTipeKategori ? s.type === filterTipeKategori : true
    )
    .filter((s: any) =>
      filterNominal ? s.nominal.toString() === filterNominal : true
    );

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Apakah kamu yakin?",
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await deleteCategory.mutate(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">Gagal memuat data siswa.</div>;
  }

  return (
    <section className="flex flex-col gap-10 w-full ">
      {/* Card Info */}
      <section className="grid grid-cols-2 gap-4 ">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={kategori.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Data Terfilter"}
          value={filteredData.slice(0, showCount).length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* Search & Table */}
      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTable
          title={"Manajement Kategori Pembayaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={" add create"}
          link="/dashboard/pembayaran/kategori/create"
        />

        <div className="w-full h-full rounded-xl overflow-hidden bg-white p-1 pr-2">
          <Table className="w-full h-full table-auto bg-white text-gray-700">
            <TableHeader className=" text-sm font-semibold text-center">
              <TableRow className="text-center">
                <TableHead className="text-center py-4">No</TableHead>
                <TableHead className="text-center py-4">Nama Kategori</TableHead>
                <TableHead className="text-center py-4">Semester</TableHead>
                <TableHead className="text-center py-4">Tahun Ajaran</TableHead>
                <TableHead className="text-center py-4">Tipe Kategori</TableHead>
                <TableHead className="text-center py-4">Nominal</TableHead>
                <TableHead className="text-center py-4 w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-sm divide-y divide-gray-200 text-center">
              {filteredData.slice(0, showCount).map((s: any, i: number) => (
                <TableRow key={s.id}>
                  <TableCell className=" py-4 font-medium">{i + 1}</TableCell>
                  <TableCell className=" py-4 font-medium">{s.name}</TableCell>
                  <TableCell className=" py-4 font-medium">{s.semester}</TableCell>
                  <TableCell className=" py-4 font-medium">{s.TA}</TableCell>
                  <TableCell className=" py-4 font-medium">
                    <Badge className="bg-purple-200 py-1 rounded-full px-4 text-purple-500">
                      {s.type}
                    </Badge>
                  </TableCell>
                  <TableCell className=" py-4 font-medium">{s.nominal}</TableCell>
                  <TableCell className="flex gap-2 items-center ">
                    <Link href={`/dashboard/pembayaran/kategori/update/${s.id}`}>
                      <Button className="bg-blue-400 text-white cursor-pointer">
                        <SquarePen />
                      </Button>
                    </Link>
                    <Button
                      className="bg-red-500 text-white cursor-pointer px-4"
                      onClick={() => handleDelete(s.id as string)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Panel Filter */}
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
                {/* Semester */}
                <label className="flex flex-col text-sm">
                  Semester
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                  </select>
                </label>

                {/* Tipe Kategori */}
                <label className="flex flex-col text-sm">
                  Tipe Kategori
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterTipeKategori}
                    onChange={(e) => setFilterTipeKategori(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="NORMAL">Normal</option>
                    <option value="Installment">Installment</option>
                  </select>
                </label>

                {/* Nominal */}
                <label className="flex flex-col text-sm">
                  Nominal
                  <input
                    type="number"
                    placeholder="Masukkan nominal"
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterNominal}
                    onChange={(e) => setFilterNominal(e.target.value)}
                  />
                </label>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setFilterSemester("");
                    setFilterTipeKategori("");
                    setFilterNominal("");
                  }}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-gray-300"
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

export default DataPembayaran;
