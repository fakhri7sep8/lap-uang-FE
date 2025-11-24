"use client";

import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CardInformation from "@/components/fragments/dashboard/card-information";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";
import { useExpenseModule } from "@/hooks/expense/useExpense";

import { AnimatePresence, motion } from "framer-motion";
import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { GraduationCap, Loader2, Users } from "lucide-react";

export default function SemuaPengeluaranPage() {
  const { useGetExpense } = useExpenseModule();

  // 🔥 Ambil semua kategori
  const op = useGetExpense("Operasional");
  const pm = useGetExpense("Pemeliharaan");
  const uk = useGetExpense("Upah Karyawan");
  const mk = useGetExpense("Makan");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false);

  const loading = op.isLoading || pm.isLoading || uk.isLoading || mk.isLoading;

  // 🔥 Gabung semua expense dari semua kategori
  const allExpenses = useMemo(() => {
    if (!op.data?.data || !pm.data?.data || !uk.data?.data || !mk.data?.data)
      return [];

    return [
      ...op.data.data.map((x: any) => ({ ...x, jenis: "Operasional" })),
      ...pm.data.data.map((x: any) => ({ ...x, jenis: "Pemeliharaan" })),
      ...uk.data.data.map((x: any) => ({ ...x, jenis: "Upah Karyawan" })),
      ...mk.data.data.map((x: any) => ({ ...x, jenis: "Makan" })),
    ];
  }, [op.data, pm.data, uk.data, mk.data]);

  // =====================================================
  // FILTERING
  // =====================================================
  const filteredData = useMemo(() => {
    return allExpenses.filter((item: any) => {
      const search = searchTerm.toLowerCase();

      const matchSearch =
        item.description?.toLowerCase().includes(search) ||
        item.PenanggungJawab?.toLowerCase().includes(search) ||
        item.jenis?.toLowerCase().includes(search);

      const itemDate = new Date(item.createdAt);
      const matchStart = dateFilter.startDate
        ? itemDate >= new Date(dateFilter.startDate)
        : true;
      const matchEnd = dateFilter.endDate
        ? itemDate <= new Date(dateFilter.endDate)
        : true;

      return matchSearch && matchStart && matchEnd;
    });
  }, [allExpenses, searchTerm, dateFilter]);

  const totalJumlah = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  // =====================================================
  // PAGINATION
  // =====================================================
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginated = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // =====================================================
  // PDF DOWNLOAD
  // =====================================================
  const handleDownloadPDF = async () => {
    const el = document.getElementById("report-pdf-gabungan");
    if (!el) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-semua-pengeluaran-${dayjs().format(
          "YYYY-MM-DD"
        )}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();

    setShowPreview(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 py-7 px-3">
      {/* ========================== */}
      {/* HIDDEN PDF TEMPLATE */}
      {/* ========================== */}
      <div className="hidden">
        <div id="report-pdf-gabungan">
          <ReportPdfTemplate
            title="LAPORAN SELURUH PENGELUARAN"
            sectionLabel="Detail Semua Pengeluaran"
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

      {/* ========================== */}
      {/* PREVIEW MODAL */}
      {/* ========================== */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh] shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Preview Laporan Semua Pengeluaran
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 bg-gray-50">
                <div className="bg-white border shadow-md">
                  <ReportPdfTemplate
                    title="LAPORAN SELURUH PENGELUARAN"
                    sectionLabel="Detail Semua Pengeluaran"
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

      {/* ========================== */}
      {/* INFO CARDS */}
      {/* ========================== */}
      <section className="grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={allExpenses.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Data Terfilter"
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* ========================== */}
      {/* MAIN TABLE WRAPPER */}
      {/* ========================== */}
      <div className="bg-white rounded-2xl p-5 shadow">
        {/* SEARCH + DATE FILTER */}
        {/* ===================== */}
        {/* HEADER FILTER + SEARCH */}
        {/* ===================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
          {/* SEARCH INPUT */}
          <div className="flex items-center w-full md:w-[60%] bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm">
            <input
              type="text"
              placeholder="Cari nama / no. Induk / asrama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full outline-none text-gray-700"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.8-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* SHOW COUNT */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Showing</span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow cursor-pointer"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <ExportPDFButton
            label="Export PDF"
            onExport={async () => {
              setShowPreview(true);
              return true;
            }}
          />
          {/* FILTER BUTTON */}
          <DateRangeFilterModern
            startDate={dateFilter.startDate}
            endDate={dateFilter.endDate}
            onChange={setDateFilter}
          />

          {/* EXPORT PDF */}
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6 mr-3" />
            Memuat data...
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((row: any, i: number) => (
                <TableRow key={row.id} className="text-center">
                  <TableCell>
                    {(currentPage - 1) * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.jenis}</TableCell>
                  <TableCell>{row.PenanggungJawab}</TableCell>
                  <TableCell>Rp {row.amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    {dayjs(row.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* PAGINATION */}
        <div className="flex justify-end gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded border ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
