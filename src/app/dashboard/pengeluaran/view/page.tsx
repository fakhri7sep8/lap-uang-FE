"use client";

import { SquarePen, Trash2, FileText, Wallet } from "lucide-react";
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
import CardInformation from "@/components/fragments/dashboard/card-information";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import { useBudgetExpenseModule } from "@/hooks/usePengeluaran";
import Loader from "@/components/ui/loader";

export default function PengeluaranViewPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { useGetBudgetExpense, useDeleteBudgetExpense } =
    useBudgetExpenseModule();
  const { data: pengeluaran = [], isLoading } = useGetBudgetExpense();
  const { mutate: deletePengeluaran } = useDeleteBudgetExpense();

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-red-500">Gagal memuat data pengeluaran.</div>
    );
  }

  // Filter logic
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const getBulan = (tanggal: string) => {
    const dateObj = new Date(tanggal);
    return bulanIndo[dateObj.getMonth()];
  };

  const filteredData = pengeluaran
    .filter(
      (item) =>
        item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisPengeluaran.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      filterJenis ? item.jenisPengeluaran === filterJenis : true
    )
    .filter((item) =>
      filterBulan ? getBulan(item.tanggal) === filterBulan : true
    );

  // Pagination
  const totalData = filteredData.length;
  const totalJumlah = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPages = Math.ceil(totalData / showCount);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  return (
    <section className="flex flex-col gap-10 w-full">
      {/* Card Info */}
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={totalData}
          icon={<FileText size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Total Jumlah"
          value={"Rp " + totalJumlah.toLocaleString("id-ID")}
          icon={<Wallet size={32} className="text-green-500" />}
        />
      </section>

      {/* Search & Filter */}
      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTable
          title={"Manajemen Pengeluaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type="normal"
        />

        {/* Table */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          <Table className="w-full h-full table-auto bg-white text-gray-700">
            <TableHeader className="text-sm font-semibold text-center">
              <TableRow>
                <TableHead className="text-center py-4">No</TableHead>
                <TableHead className="text-center py-4">Deskripsi</TableHead>
                <TableHead className="text-center py-4">Jenis</TableHead>
                <TableHead className="text-center py-4">Jumlah</TableHead>
                <TableHead className="text-center py-4">Tanggal</TableHead>
                <TableHead className="text-center py-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm divide-y divide-gray-200 text-center">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-gray-400">
                    Data not found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="py-4 font-medium">
                      {(currentPage - 1) * showCount + index + 1}
                    </TableCell>
                    <TableCell className="py-4">{item.deskripsi}</TableCell>
                    <TableCell className="py-4">
                      {item.jenisPengeluaran}
                    </TableCell>
                    <TableCell className="py-4">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="py-4">{item.tanggal}</TableCell>
                    <TableCell className="flex justify-center gap-2 py-4">
                      <Button className="bg-blue-400 text-white">
                        <SquarePen />
                      </Button>
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => deletePengeluaran(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="w-full mt-4">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>

      {/* Filter Drawer */}
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
                <h3 className="text-xl font-semibold">Filter Pengeluaran</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Jenis Pengeluaran
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </select>
                </label>
                <label className="flex flex-col text-sm">
                  Bulan
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    {bulanIndo.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setFilterJenis("");
                    setFilterBulan("");
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
}
