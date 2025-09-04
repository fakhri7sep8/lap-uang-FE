"use client";


import TablePengeluaran, { getBulan } from "@/components/fragments/table-pengeluaran";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { viewPengeluaran } from "@/data/view-pengeluaran";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaMoneyBill, FaRegFile, FaUserGroup } from "react-icons/fa6";

export default function PengeluaranViewPage() {
  // State untuk search, filter, dan pagination
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterBulan, setFilterBulan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Logic filter dan search
  const filteredData = viewPengeluaran
    .filter(
      (item) =>
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisPengeluaran.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => (filterJenis ? item.jenisPengeluaran === filterJenis : true))
    .filter((item) =>
      filterBulan ? getBulan(item.tanggal) === filterBulan : true
    );

  // Pagination
  const totalData = filteredData.length;
  const totalJumlah = filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPages = Math.ceil(filteredData.length / showCount);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center py-8 ">
      {/* Card Information */}
      <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CardInformation
          color="blue"
          title="Total Data"
          value={totalData}
          icon={<FaRegFile size={40} className="text-blue-400" />}
        />
        <CardInformation
          color="green"
          title="Total Jumlah"
          value={" RP." +totalJumlah.toLocaleString("id-ID")}
          icon={<FaMoneyBill size={40} className="text-green-400" />}
        />
      </div>

      {/* Search & Filter */}
      <div className="w-full max-w-full mb-4">
        <SearchDataTable
          title={"Managemet Pengeluaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={"normal"}
        />
      </div>

      {/* Tabel Pengeluaran */}
      <div className="w-full max-w-full">
        <TablePengeluaran data={paginatedData}/>
      </div>
      {/* Pagination */}
      <div className="w-full max-w-full mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

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
                {/* Tambahkan filter sesuai kebutuhan pengeluaran di sini */}
                <label className="flex flex-col text-sm">
                  Jenis Pengeluaran
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterJenis}
                    onChange={e => setFilterJenis(e.target.value)}
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
                    onChange={e => setFilterBulan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    <option value="Januari">Januari</option>
                    <option value="Februari">Februari</option>
                    <option value="Maret">Maret</option>
                    <option value="April">April</option>
                    <option value="Mei">Mei</option>
                    <option value="Juni">Juni</option>
                    <option value="Juli">Juli</option>
                    <option value="Agustus">Agustus</option>
                    <option value="September">September</option>
                    <option value="Oktober">Oktober</option>
                    <option value="November">November</option>
                    <option value="Desember">Desember</option>
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
    </div>
  );
}