"use client";

import { useState, useMemo } from "react";
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
import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";

import { useExpenseModule } from "@/hooks/expense/useExpense";
import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";

import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SemuaPengeluaranPage() {
  const { useGetExpense } = useExpenseModule();

  const op = useGetExpense("Operasional");
  const pm = useGetExpense("Pemeliharaan");
  const uk = useGetExpense("Upah Karyawan");
  const mk = useGetExpense("Makan");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false);

  const loading = op.isLoading || pm.isLoading || uk.isLoading || mk.isLoading;

  const normalize = (x: any) => {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x?.data)) return x.data;
    if (Array.isArray(x?.data?.data)) return x.data.data;
    return [];
  };

  const allExpenses = useMemo(() => {
    const opRows = normalize(op.data).map((x: any) => ({
      ...x,
      jenis: "Operasional",
    }));
    const pmRows = normalize(pm.data).map((x: any) => ({
      ...x,
      jenis: "Pemeliharaan",
    }));
    const ukRows = normalize(uk.data).map((x: any) => ({
      ...x,
      jenis: "Upah Karyawan",
    }));
    const mkRows = normalize(mk.data).map((x: any) => ({
      ...x,
      jenis: "Makan",
    }));

    return [...opRows, ...pmRows, ...ukRows, ...mkRows];
  }, [op.data, pm.data, uk.data, mk.data]);

  // =====================================================
  // FILTER + SORT DATA TERBARU
  // =====================================================
  const filteredData = useMemo(() => {
    const f = allExpenses.filter((item: any) => {
      const search = searchTerm.toLowerCase();

      const matchSearch =
        item.description?.toLowerCase().includes(search) ||
        item.PenanggungJawab?.toLowerCase().includes(search) ||
        item.jenis?.toLowerCase().includes(search);

      const d = new Date(item.createdAt);

      const matchStart = dateFilter.startDate
        ? d >= new Date(dateFilter.startDate)
        : true;

      const matchEnd = dateFilter.endDate
        ? d <= new Date(dateFilter.endDate)
        : true;

      return matchSearch && matchStart && matchEnd;
    });

    // SORT TERBARU → TERLAMA
    return f.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allExpenses, searchTerm, dateFilter]);

  const totalJumlah = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginated = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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

      {/* HIDDEN PDF TEMPLATE */}
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

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {showPreview && (
          <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh]">

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
                <div className="bg-white border shadow">
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

      {/* CARDS */}
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

      {/* HEADER */}
      <div className="px-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Data Semua Pengeluaran
          </h1>
          <p className="text-gray-500 mb-6">
            Data Semua Pengeluaran Sekolah Management.
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

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-2xl p-5 shadow-md">

        {/* FILTER HEADER */}
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* SEARCH */}
          <div className="w-full md:flex-1">
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm">
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
            </div>
          </div>

          {/* ROW PER PAGE */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Tampil:</span>

              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <span className="text-sm text-gray-600">per halaman</span>
            </div>
          </div>

          {/* DATE FILTER */}
          <div className="w-full md:w-auto flex justify-start md:justify-end">
            <DateRangeFilterModern
              startDate={dateFilter.startDate}
              endDate={dateFilter.endDate}
              onChange={setDateFilter}
            />
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 mr-3" />
            Memuat data...
          </div>
        ) : (
          <div className="w-full overflow-x-auto mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="py-4 px-4 text-center text-xs font-semibold uppercase w-[60px]">
                    No
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase">
                    Tanggal
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase">
                    Keterangan
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase">
                    Jenis
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold uppercase">
                    Penanggung Jawab
                  </th>
                  <th className="py-4 px-4 text-right text-xs font-semibold uppercase">
                    Nominal
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-400"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}

                {paginated.map((row: any, i: number) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4 text-center font-semibold text-gray-700">
                      {(currentPage - 1) * rowsPerPage + i + 1}
                    </td>

                    <td className="py-4 px-4 text-gray-700">
                      {dayjs(row.createdAt).format("DD MMM YYYY")}
                    </td>

                    <td className="py-4 px-4 text-gray-800 font-medium">
                      {row.description}
                    </td>

                    <td className="py-4 px-4 text-gray-700">
                      {row.jenis}
                    </td>

                    <td className="py-4 px-4 text-gray-700">
                      {row.PenanggungJawab}
                    </td>

                    <td className="py-4 px-4 text-right font-semibold text-gray-800">
                      Rp {row.amount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="flex w-full justify-between items-center mt-6 flex-wrap gap-4">

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-40"
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
                          ? "bg-blue-500 text-white border-blue-500"
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
                className="p-2 border rounded-lg disabled:opacity-40"
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
  );
}
