"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import CardInformation from "@/components/fragments/dashboard/card-information";
import TablePengeluaran from "@/components/fragments/pengeluaran/table";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import { useExpenseModule } from "@/hooks/expense/useExpense";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";

import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";

const OperasionalPage = () => {
  const [activeTab, setActiveTab] = useState("Pembangunan");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false);

  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const tabs = ["Pembangunan", "Sarana"];

  const { useGetExpense } = useExpenseModule();
  const { data: expenses, isLoading, isError } = useGetExpense("operasional");

  // ========================================
  // SAFELIST DATA (FIX UTAMA)
  // ========================================
  const safeList = useMemo(() => {
    if (Array.isArray(expenses)) return expenses;
    if (Array.isArray(expenses?.data)) return expenses.data;
    return [];
  }, [expenses]);

  // Normalizer
  const normalizeRows = (exp: any) => {
    if (!exp) return [];
    if (Array.isArray(exp)) return exp;
    if (Array.isArray(exp?.data)) return exp.data;
    if (Array.isArray(exp?.data?.data)) return exp.data.data;
    return [];
  };

  // ======================================================
  // FILTERING + SORT NEWEST FIRST
  // ======================================================
  const filteredData = useMemo(() => {
    const rows = normalizeRows(expenses);
    const search = searchTerm.toLowerCase();

    return rows
      .filter((item: any) => {
        const matchSearch =
          item?.description?.toLowerCase().includes(search) ||
          item?.PenanggungJawab?.toLowerCase().includes(search) ||
          item?.category?.name?.toLowerCase().includes(search);

        const matchTab =
          activeTab === "Pembangunan"
            ? item?.subCategoryId === 1
            : item?.subCategoryId === 2;

        const itemDate = new Date(item.createdAt);

        const matchStart = dateFilter.startDate
          ? itemDate >= new Date(dateFilter.startDate)
          : true;

        const matchEnd = dateFilter.endDate
          ? itemDate <= new Date(dateFilter.endDate)
          : true;

        return matchSearch && matchTab && matchStart && matchEnd;
      })
      // SORT → DATA TERBARU DI ATAS
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [expenses, searchTerm, activeTab, dateFilter]);

  // ======================================================
  // PAGINATION
  // ======================================================
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedData = filteredData.slice(startIdx, endIdx);

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalJumlah = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  // ======================================================
  // PDF DOWNLOAD
  // ======================================================
  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-pdf-operasional");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-operasional-${dayjs().format("YYYY-MM-DD")}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();

    setShowPreview(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center py-7">
      {/* ===================================== */}
      {/* HIDDEN PDF TEMPLATE */}
      {/* ===================================== */}
      <div className="hidden">
        <div id="report-pdf-operasional">
          <ReportPdfTemplate
            title="LAPORAN PENGELUARAN OPERASIONAL"
            sectionLabel={`Detail Pengeluaran (${activeTab})`}
            headerLogoUrl="/img/Logo.png"
            sekolah={{
              nama: "SMK MADINATUL QURAN",
              alamat: "KP KEBON KELAPA, JAWA BARAT",
            }}
            tahunAjaranMulai={2024}
            data={filteredData} // sesuai table
            totalPengeluaran={totalJumlah}
            tanggalCetak={dayjs().format("DD MMMM YYYY")}
          />
        </div>
      </div>

      {/* ===================================== */}
      {/* PREVIEW MODAL (SAMA POLA DENGAN PEMELIHARAAN) */}
      {/* ===================================== */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Preview Laporan</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 bg-gray-50">
                <div className="bg-white shadow-md mx-auto border border-gray-200">
                  <ReportPdfTemplate
                    title="LAPORAN PENGELUARAN OPERASIONAL"
                    sectionLabel={`Detail Pengeluaran (${activeTab})`}
                    headerLogoUrl="/img/Logo.png"
                    sekolah={{
                      nama: "SMK MADINATUL QURAN",
                      alamat: "KP KEBON KELAPA, JAWA BARAT",
                    }}
                    tahunAjaranMulai={2024}
                    data={filteredData}
                    totalPengeluaran={totalJumlah}
                    tanggalCetak={dayjs().format("DD MMMM YYYY")}
                  />
                </div>
              </div>

              <div className="p-4 flex justify-end gap-3 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================== */}
      {/* INFO CARDS */}
      {/* ===================================== */}
      <section className="w-full grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={normalizeRows(expenses).length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />

        {/* 🟢 CARD TERFILTER — sudah diperbaiki */}
        <CardInformation
          color="green"
          title="Data Terfilter"
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}
      <div className="w-full rounded-3xl">
        <div className="px-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              Data Pengeluaran Operasional
            </h1>
            <p className="text-gray-500 mb-6">
              Data Pengeluaran Sekolah Management.
            </p>
          </div>

          <ExportPDFButton
            label="Export PDF"
            onExport={async () => {
              setShowPreview(true);
              return true;
            }}
          />
        </div>

        <div className="flex flex-col gap-2 p-2">
          {/* TABS */}
          <div className="flex gap-2 mb-[-7px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-5 py-3 font-medium rounded-t-xl transition-all duration-300 shadow-sm ${
                  activeTab === tab
                    ? "bg-white text-gray-800 shadow-md"
                    : "bg-[#dfe6f4] text-gray-600 hover:bg-[#e6ebf7]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TABLE WRAPPER */}
          <div className="bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl">
            {/* SEARCH + DATE FILTER */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div className="w-full md:flex-1">
                <SearchInput
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  searchTerm={searchTerm}
                />
              </div>

              <div className="w-full md:w-auto flex justify-start md:justify-end">
                <DateRangeFilterModern
                  startDate={dateFilter.startDate}
                  endDate={dateFilter.endDate}
                  onChange={setDateFilter}
                />
              </div>
            </div>

            {/* TABLE */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500 mr-3" />
                Memuat data...
              </div>
            ) : isError ? (
              <p className="text-center text-red-500 py-6">
                Gagal memuat data pengeluaran.
              </p>
            ) : filteredData.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                Tidak ada data ditemukan.
              </p>
            ) : (
              <TablePengeluaran
                title="Operasional"
                data={paginatedData}
                menu={"operasional"}
              />
            )}

            {/* PAGINATION */}

            {/* PAGINATION */}
            {filteredData.length > 0 && (
              <div className="flex w-full justify-between items-center mt-6 flex-wrap gap-4">
                {/* ROWS PER PAGE */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Tampil:
                  </label>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">per halaman</span>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => setCurrentPage(num)}
                          className={`px-3 py-2 rounded-lg border text-sm ${
                            currentPage === num
                              ? "bg-blue-500 text-white"
                              : "bg-white"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages} ({filteredData.length} data)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperasionalPage;
