"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  GraduationCap,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
import Loader from "@/components/ui/loader";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";
import { axiosClient } from "@/lib/axiosClient";
import { AnimatePresence, motion } from "framer-motion";

const DataSelainSpp = () => {
  const [showCount, setShowCount] = useState<any>(10);
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [startIndex, setStartIndex] = useState<any>(0);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [showFilter, setShowFilter] = useState(false);
  const maxVisible = 4;
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [filterAngkatan, setFilterAngkatan] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [recap, setRecap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<number[]>([]);

  // Fetch data payment-types + student status
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/payment-types/with-status");
      const listKategori = res.data.data || [];
      setCategories(listKategori);

      const siswaUnique: any = {};
      const generationsSet = new Set<number>();

      listKategori.forEach((kategori: any) => {
        kategori.students?.forEach((s: any) => {
          if (!siswaUnique[s.id]) {
            siswaUnique[s.id] = {
              id: s.id,
              name: s.name,
              generation: s.generation,
            };
            generationsSet.add(s.generation); // ambil generation
          }
        });
      });

      setRecap(Object.values(siswaUnique));
      setFilterOptions(Array.from(generationsSet).sort((a, b) => b - a)); // urut desc
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredData: any[] = recap.filter((p: any) => {
    const matchesSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesGeneration = filterAngkatan
      ? p.generation.toString() === filterAngkatan
      : true;

    return matchesSearch && matchesGeneration;
  });

  const totalPages: any = Math.ceil(filteredData.length / showCount);
  const paginatedData: any[] = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  const getStatusBadgeClass = (status: string) => {
    const baseStyle =
      "inline-block w-28 text-center px-3 py-1 rounded-full text-xs font-medium transition-transform duration-150 hover:scale-105";

    switch ((status || "").toUpperCase()) {
      case "LUNAS":
        return `${baseStyle} bg-green-100 text-green-700`;
      case "BELUM LUNAS":
        return `${baseStyle} bg-yellow-100 text-yellow-700`;
      case "TUNGGAKAN":
        return `${baseStyle} bg-red-100 text-red-700`;
      case "NYICIL":
        return `${baseStyle} bg-purple-100 text-purple-700`;
      default:
        return `${baseStyle} bg-gray-50 text-gray-500`;
    }
  };

  const handlePrev = () => startIndex > 0 && setStartIndex(startIndex - 1);
  const handleNext = () =>
    startIndex < categories.length - maxVisible &&
    setStartIndex(startIndex + 1);

  if (loading) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-10 w-full">
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={recap.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Kategori Aktif"
          value={categories.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      <section className="w-full flex flex-col gap-6 h-full pb-6">
        <SearchDataTable
          title={"Data Pembayaran"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={setShowFilter}
          setShowCount={setShowCount}
          type={"normal"}
        />

        {/* === CAROUSEL FIXED (NORMAL + INSTALLMENT = SAME MECHANISM) === */}
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
              {/* tombol Semua */}
              <div
                onClick={() => setSelectedCategory(null)}
                className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-12 rounded-xl cursor-pointer ${
                  !selectedCategory ? "bg-blue-700" : "bg-blue-500"
                }`}
              >
                <p className="text-white font-semibold text-base">Semua</p>
              </div>

              {categories.map((kat: any) => (
                <div
                  key={kat.id}
                  onClick={() => setSelectedCategory(kat)}
                  className={`flex-[0_0_calc(100%/4-1rem)] flex justify-center items-center h-12 rounded-xl cursor-pointer ${
                    selectedCategory?.id === kat.id
                      ? "bg-blue-700"
                      : "bg-blue-500"
                  }`}
                >
                  <p className="text-white font-semibold text-base">
                    {kat.name}
                  </p>
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

        {/* ==== TABLE ==== */}
        <div className="w-full h-full rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          {selectedCategory ? (
            <Table className="w-full text-gray-700 text-center">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Dibayar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedCategory.students?.length > 0 ? (
                  selectedCategory.students.map((s: any, idx: number) => {
                    const pembayaran = selectedCategory.payments?.find(
                      (p: any) => p.studentId === s.id
                    );

                    return (
                      <TableRow key={s.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{selectedCategory.name}</TableCell>
                        <TableCell>
                          Rp.{" "}
                          {selectedCategory.nominal?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          Rp. {pembayaran?.paid?.toLocaleString("id-ID") || 0}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                              s.status
                            )}`}
                          >
                            {s.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button className="bg-blue-500 text-white">
                            <Download size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-400 py-6"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Table className="w-full text-gray-700 text-center">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  {categories.map((c: any) => (
                    <TableHead key={c.id}>{c.name}</TableHead>
                  ))}
                  <TableHead>Aksi</TableHead>
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
                      <TableCell>
                        {(currentPage - 1) * showCount + idx + 1}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>

                      {categories.map((c: any) => {
                        const student = c.students?.find(
                          (s: any) => s.name === p.name
                        );

                        const status = student?.status;

                        return (
                          <TableCell key={c.id}>
                            {status ? (
                              <span
                                className={`inline-block w-24 text-center px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-28 px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                                🚫 Tidak Ada
                              </span>
                            )}
                          </TableCell>
                        );
                      })}

                      <TableCell className="flex gap-2 justify-center">
                        <Button className="bg-blue-500 text-white">
                          <Download />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
      <AnimatePresence>
        {showFilter && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFilter(false)}
            />

            {/* DRAWER */}
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

              {/* FILTER CONTENT */}
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm">
                  Angkatan
                  <select
                    className="mt-1 border border-gray-300 rounded-md px-3 py-2"
                    value={filterAngkatan}
                    onChange={(e) => setFilterAngkatan(e.target.value)}
                  >
                    <option value="">Semua</option>
                    {filterOptions.map((gen) => (
                      <option key={gen} value={gen}>
                        {gen}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* BUTTONS */}
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => {
                    setFilterAngkatan("");
                  }}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-md"
                >
                  Reset
                </button>

                <button
                  onClick={() => setShowFilter(false)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                  Terapkan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DataSelainSpp;
