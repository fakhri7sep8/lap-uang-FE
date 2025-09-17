"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  GraduationCap,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CardInformation from "@/components/fragments/dashboard/card-information";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { useArrearsModule } from "@/hooks/use-arreas";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";

const Tunggakan = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // drawer visibility + draft filter (for apply)
  const [showFilter, setShowFilter] = useState(false);
  const [filterMonths, setFilterMonths] = useState<number | null>(null); // applied filter
  const [draftFilterMonths, setDraftFilterMonths] = useState<number | "">(""); // draft in drawer

  const maxVisible = 4;

  // kategori pembayaran
  const { useGetCategory } = useCategoryPaymentModule();
  const { data: categories = [] } = useGetCategory() as any;

  // ambil data tunggakan
  const { useGetArrears } = useArrearsModule();
  const { data: arrears = [], isLoading, isError } = useGetArrears();

  // when opening drawer, initialize draft with currently applied filter
  useEffect(() => {
    if (showFilter) {
      setDraftFilterMonths(filterMonths ?? "");
    }
  }, [showFilter, filterMonths]);

  // filter kategori
  const dataByCategory = selectedCategory
    ? arrears.filter(
        (d: any) =>
          d.type?.name?.toLowerCase() === selectedCategory.name.toLowerCase()
      )
    : arrears;

  // filter search + applied filterMonths
  const filteredData = dataByCategory.filter((p: any) => {
    const lower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      p.student?.name?.toLowerCase().includes(lower) ||
      p.type?.name?.toLowerCase().includes(lower) ||
      String(p.monthsInArrears).includes(lower) ||
      p.status?.toLowerCase().includes(lower);

    const matchesMonths =
      filterMonths === null || p.monthsInArrears === filterMonths;

    return matchesSearch && matchesMonths;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center text-red-500">
        Gagal memuat data tunggakan.
      </div>
    );
  }

  const handlePrev = () => startIndex > 0 && setStartIndex(startIndex - 1);
  const handleNext = () =>
    startIndex < categories.length - maxVisible &&
    setStartIndex(startIndex + 1);

  // badge status (semua merah sesuai permintaan)
  const getStatusBadgeClass = (_status: string) => {
    return "bg-red-500 text-white";
  };

  return (
    <section className="flex flex-col gap-10 w-full">
      {/* Card Information */}
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={arrears.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="red"
          title="Tunggakan"
          value={arrears.filter((a: any) => a.status === "TUNGGAKAN").length}
          icon={<Users size={32} className="text-red-500" />}
        />
      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        {/* Search & Filter */}
        <SearchDataTable
          title={"Data Tunggakan"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter} // penting agar tombol filter di SearchDataTable buka drawer
          setShowCount={setItemsPerPage}
          type={"normal"}
        />

        {/* Carousel kategori */}
        <div className="w-full flex items-center">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="overflow-hidden flex-1 mx-2">
            <div
              className="flex gap-4 transition-transform duration-500"
              style={{
                transform: `translateX(-${startIndex * (100 / maxVisible)}%)`,
              }}
            >
              <div
                onClick={() => setSelectedCategory(null)}
                className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                  !selectedCategory ? "bg-blue-700" : "bg-blue-500"
                }`}
              >
                <p className="text-white font-semibold text-xl">Semua</p>
              </div>
              {categories.map((kat: any, i: number) => (
                <div
                  key={i}
                  onClick={() =>
                    setSelectedCategory({ id: kat.id, name: kat.name })
                  }
                  className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                    selectedCategory?.id === kat.id ? "bg-blue-700" : "bg-blue-500"
                  }`}
                >
                  <p className="text-white font-semibold text-xl">{kat.name}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            disabled={startIndex >= categories.length - maxVisible}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Table */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          <Table className="w-full text-gray-700 text-center">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Bulan Tunggakan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item: any, idx: number) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="border-b"
                  >
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell>{item.student?.name}</TableCell>
                    <TableCell>{item.type?.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      Rp. {Number(item.amount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{item.monthsInArrears} Bulan</TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button className="bg-blue-500 text-white">
                        <Download size={16} />
                      </Button>
                      <Button className="bg-gray-500 text-white">
                        <Info size={16} />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-400 py-6"
                  >
                    Tidak ada data tunggakan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
              transition={{ duration: 0.2 }}
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-lg p-6 flex flex-col gap-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
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

              {/* Filter bulan tunggakan (draft) */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Bulan Tunggakan
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="Masukkan jumlah bulan"
                  value={draftFilterMonths === "" ? "" : draftFilterMonths}
                  onChange={(e) =>
                    setDraftFilterMonths(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Reset both applied and draft (sesuai behavior sebelumnya)
                    setDraftFilterMonths("");
                    setFilterMonths(null);
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Reset Filter
                </button>

                <button
                  onClick={() => {
                    // Apply draft -> applied filter
                    setFilterMonths(
                      draftFilterMonths === "" ? null : Number(draftFilterMonths)
                    );
                    setCurrentPage(1);
                    setShowFilter(false);
                  }}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
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

export default Tunggakan;
