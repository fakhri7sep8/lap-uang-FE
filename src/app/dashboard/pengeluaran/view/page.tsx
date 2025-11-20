
"use client";

import { useState, useCallback } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import SearchDataTable from "@/components/fragments/dashboard/search-data-table";
import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { CustomPagination } from "@/components/fragments/dashboard/custom-pagination";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

/* TABLE UI */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaMoneyBill, FaRegFile } from "react-icons/fa6";

const dummyExpenses = {
  data: [
    {
      id: 1,
      description: "Pembelian ATK untuk kantor",
      jenisPengeluaran: "Operasional",
      periode: "2025",
      amount: 1500000,
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      description: "Pembangunan ruang kelas baru",
      jenisPengeluaran: "Pembangunan",
      periode: "2024/2025",
      amount: 25000000,
      createdAt: "2024-11-05",
    },
    {
      id: 3,
      description: "Perbaikan sarana olahraga",
      jenisPengeluaran: "Sarana",
      periode: "2025",
      amount: 5000000,
      createdAt: "2025-03-18",
    },
    {
      id: 4,
      description: "Biaya listrik dan air",
      jenisPengeluaran: "Operasional",
      periode: "2025",
      amount: 1200000,
      createdAt: "2025-02-02",
    },
  ],
};

export default function PengeluaranViewPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* FILTERING */
  const expenses = dummyExpenses.data;

  const filteredData = expenses
    .filter((item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalData = filteredData.length;
  const totalJumlah = filteredData.reduce((acc, curr) => acc + curr.amount, 0);

  /* PAGINATION */
  const totalPages = Math.ceil(totalData / showCount);
  const paginated = filteredData.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  /* ============================
       PDF PREVIEW (HTML MODE)
     ============================ */

  const handleExport = useCallback(async () => {
    setShowPreview(true);
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    const element = document.getElementById("report-pdf");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-pengeluaran-${dayjs().format("YYYY-MM-DD")}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();

    setShowPreview(false);
  }, []);

  /* ============================
           DATA PER BULAN
     ============================ */

  const tahunAjaranMulai = 2025;
  const dataPerBulan: Record<string, any> = {};

  filteredData.forEach((row) => {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    dataPerBulan[key] = {
      tanggal: row.createdAt,
      nominal: (dataPerBulan[key]?.nominal || 0) + row.amount,
      jenis: row.jenisPengeluaran,
    };
  });

  /* ============================
           RENDER PAGE
     ============================ */

  return (
    <>
      {/* TEMPLATE UNTUK EXPORT */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN PENGELUARAN SEKOLAH"
          sectionLabel="Detail Pengeluaran Sekolah"
          headerLogoUrl="/img/Logo.png"
          sekolah={{
            nama: "SMK MADINATUL QURAN",
            alamat: "KP KEBON KELAPA, JAWA BARAT",
          }}
          tahunAjaranMulai={tahunAjaranMulai}
          dataPerBulan={dataPerBulan}
          totalPengeluaran={totalJumlah}
          tanggalCetak={dayjs().format("DD MMMM YYYY")}
        />
      </div>

      {/* PREVIEW MODAL (HTML) */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh] shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Preview Laporan</h2>
                <button
                  className="text-gray-500 text-xl"
                  onClick={() => setShowPreview(false)}
                >
                  ✕
                </button>
              </div>

              {/* HTML PREVIEW */}
              <div className="p-5 bg-gray-50">
                <div
                  id="report-pdf"
                  className="bg-white shadow-md mx-auto border border-gray-200"
                >
                  <ReportPdfTemplate
                    title="LAPORAN PENGELUARAN SEKOLAH"
                    sectionLabel="Detail Pengeluaran Sekolah"
                    headerLogoUrl="/img/Logo.png"
                    sekolah={{
                      nama: "SMK MADINATUL QURAN",
                      alamat: "KP KEBON KELAPA, JAWA BARAT",
                    }}
                    tahunAjaranMulai={tahunAjaranMulai}
                    dataPerBulan={dataPerBulan}
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

      {/* PAGE UI */}
      <div className="min-h-screen bg-gray-100 py-7 px-3 flex flex-col gap-10">

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardInformation
            color="blue"
            title="Total Data"
            value={totalData}
            icon={<FaRegFile size={32} className="text-blue-400" />}
          />
          <CardInformation
            color="green"
            title="Total Jumlah"
            value={`Rp ${totalJumlah.toLocaleString("id-ID")}`}
            icon={<FaMoneyBill size={32} className="text-green-400" />}
          />
        </div>

        {/* SEARCH */}
        <SearchDataTable
          title="Manajemen Pengeluaran"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowFilter={() => {}}
          setShowCount={setShowCount}
          type="normal"
        />

        {/* BUTTON */}
        <div className="w-full flex justify-end mb-4">
          <ExportPDFButton
            label="Export PDF"
            onExport={async () => {
              handleExport(); 
              return;
            }}
          />
        </div>

        {/* TABLE */}
        <div className="rounded-xl overflow-hidden bg-white px-1 pt-2 pb-4">
          <Table className="w-full text-gray-700">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((row: any, i: number) => (
                <TableRow key={row.id}>
                  <TableCell>{(currentPage - 1) * showCount + i + 1}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.jenisPengeluaran}</TableCell>
                  <TableCell>{row.periode}</TableCell>
                  <TableCell>
                    Rp {row.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {dayjs(row.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}