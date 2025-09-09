"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import Loader from "@/components/ui/loader";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import { usePaymentModule } from "@/hooks/use-payment";

const DataSelainSpp = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // carousel setup
  const { useGetCategory } = useCategoryPaymentModule();
  const { data: categories = [], isLoading: isLoadingCategory } =
    useGetCategory();
  const [startIndex, setStartIndex] = useState(0);
  const maxVisible = 4;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };
  const handleNext = () => {
    if (startIndex < categories.length - maxVisible)
      setStartIndex(startIndex + 1);
  };

  // default recap data
  const { useGetRecapPayments, useGetPaymentsByCategory } = usePaymentModule();
  const { data: recap = [], isLoading, isError } = useGetRecapPayments();

  // per kategori
  const { mutate: getPaymentsByCategory, data: paymentsByCategory } =
    useGetPaymentsByCategory();

  useEffect(() => {
    if (selectedCategory) {
      getPaymentsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const filteredData = recap
    .filter((p: any) =>
      searchTerm
        ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .filter((p: any) =>
      filterStatus
        ? p.uang_masuk === filterStatus || p.daftar_ulang === filterStatus
        : true
    );

  const totalPages = Math.ceil(filteredData.length / showCount);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "LUNAS":
        return "bg-green-100 text-green-700";
      case "BELUM_LUNAS":
        return "bg-yellow-100 text-yellow-700";
      case "BELUM LUNAS":
        return "bg-yellow-100 text-yellow-700";
      case "TUNGGAKAN":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading || isLoadingCategory) {
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
    <section className="flex flex-col gap-10 w-full">
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={recap.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Lunas"}
          value={filteredData.slice(0, showCount).length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* Search bar */}
      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTable
          title={"Data Pembayaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
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
              {/* Item khusus "Semua" */}
              <div
                onClick={() => setSelectedCategory(null)}
                className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                  selectedCategory === null ? "bg-blue-700" : "bg-blue-500"
                }`}
              >
                <p className="text-white font-semibold text-xl">Semua</p>
              </div>

              {/* Item hasil map kategori */}
              {categories.length === 0 ? (
                <p className="text-gray-400">Belum ada kategori</p>
              ) : (
                categories.map((kat: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setSelectedCategory(kat.name)}
                    className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-16 rounded-xl cursor-pointer ${
                      selectedCategory === kat.name
                        ? "bg-blue-700"
                        : "bg-blue-500"
                    }`}
                  >
                    <p className="text-white font-semibold text-xl">
                      {kat.name}
                    </p>
                  </div>
                ))
              )}
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
          {selectedCategory ? (
            // DETAIL VIEW (per kategori)
            <Table className="w-full text-gray-700 text-center">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCategory ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      <Loader />
                    </TableCell>
                  </TableRow>
                ) : paymentsByCategory?.data?.length > 0 ? (
                  paymentsByCategory.data.map((item: any, idx: number) => (
                    <TableRow key={item.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.student.name}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.type.name}</TableCell>
                      <TableCell>{item.amount}</TableCell>
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
                        <Button className="bg-blue-500 text-white">
                          <Download size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-400 py-6"
                    >
                      Tidak ada data untuk kategori ini
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            // DEFAULT VIEW (semua kategori kolom)
            <>
              <Table className="w-full h-full table-auto bg-white text-gray-700">
                <TableHeader className="text-sm font-semibold text-center">
                  <TableRow className="text-center">
                    <TableHead className="py-4">No</TableHead>
                    <TableHead className="py-4">Nama Siswa</TableHead>
                    {categories.map((c: any, index: number) => (
                      <TableHead key={index} className="py-4">
                        {c.name}
                      </TableHead>
                    ))}
                    <TableHead className="py-4">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-gray-400">
                        Data not found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((p: any, idx: number) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-center py-4 font-medium">
                          {(currentPage - 1) * showCount + idx + 1}
                        </TableCell>
                        <TableCell className="text-center">{p.name}</TableCell>
                        {p.payments.map((pmt: any, index: number) => (
                          <TableCell key={index} className="text-center">
                            <span
                              className={`inline-block w-24 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                                pmt.status
                              )}`}
                            >
                              {pmt.status}
                            </span>
                          </TableCell>
                        ))}
                        <TableCell className="flex w-full gap-2 items-center justify-center">
                          <Button className="bg-blue-500 text-white">
                            <Download />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </section>
    </section>
  );
};

export default DataSelainSpp;
