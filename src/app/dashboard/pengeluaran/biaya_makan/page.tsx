/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import TablePengeluaran from "@/components/fragments/pengeluaran/table";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import { useExpenseModule } from "@/hooks/expense/useExpense";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";

import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";

const BiayaMakanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const tabs = ["Semua"];
    const subCategoryMap: Record<string, number> = {
    Semua:13
  };
  const { useGetExpense } = useExpenseModule();
  const { data: expenses } = useGetExpense("Makan");

  // ⭐ NORMALIZER: agar `.filter` tidak error
  const normalizeRows = (exp: any) => {
    if (!exp) return [];
    if (Array.isArray(exp)) return exp;
    if (Array.isArray(exp?.data)) return exp.data;
    if (Array.isArray(exp?.data?.data)) return exp.data.data;
    return [];
  };

  // ==========================
  // FILTERING
  // ==========================
   const filteredData = useMemo(() => {
            const rows = normalizeRows(expenses);
            const search = searchTerm.toLowerCase();
        
            // 💡 PERBAIKAN: Siapkan tanggal filter dengan waktu yang benar (00:00:00 untuk start, 23:59:59 untuk end)
            const filterStartDayjs = dateFilter.startDate 
              ? dayjs(dateFilter.startDate).startOf('day') 
              : null;
        
            const filterEndDayjs = dateFilter.endDate 
              ? dayjs(dateFilter.endDate).endOf('day') 
              : null;
        
            return rows.filter((item: any) => {
              const matchSearch =
                item?.description?.toLowerCase().includes(search) ||
                item?.PenanggungJawab?.toLowerCase().includes(search) ||
                item?.category?.name?.toLowerCase().includes(search);
        
              const matchTab = item?.subCategoryId === subCategoryMap[activeTab];
        
              const itemDate = dayjs(item.PayDate); // Gunakan dayjs untuk item.createdAt
        
              // 💡 Perbandingan inklusif menggunakan Dayjs plugins
              const matchStart = filterStartDayjs
                ? itemDate.isSameOrAfter(filterStartDayjs) 
                : true;
        
              const matchEnd = filterEndDayjs
                ? itemDate.isSameOrBefore(filterEndDayjs) 
                : true;
        
              return matchSearch && matchTab && matchStart && matchEnd;
            });
          }, [expenses, searchTerm, activeTab, dateFilter]);

  const totalJumlah = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  // ==========================
  // PDF DOWNLOAD
  // ==========================
  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-pdf-makan");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-biaya-makan-${dayjs().format("YYYY-MM-DD")}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();

    setShowPreview(false);
  };

  // ==========================
  // PAGINATION
  // ==========================
  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginated = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center py-7">

      {/* ========================== */}
      {/* HIDDEN PDF TEMPLATE */}
      {/* ========================== */}
      <div className="hidden">
        <div id="report-pdf-makan">
          <ReportPdfTemplate
            title="LAPORAN BIAYA MAKAN"
            sectionLabel="Detail Pengeluaran Biaya Makan"
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
      {/* PDF PREVIEW MODAL */}
      {/* ========================== */}
      <AnimatePresence>
        {showPreview && (
          <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white w-full max-w-4xl rounded-xl overflow-auto max-h-[90vh]">
              
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
                    title="LAPORAN BIAYA MAKAN"
                    sectionLabel="Detail Pengeluaran Biaya Makan"
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
      <section className="w-full grid grid-cols-2 gap-4">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={normalizeRows(expenses).length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Data Terfilter"}
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* ========================== */}
      {/* MAIN CONTENT */}
      {/* ========================== */}
      <div className="w-full rounded-3xl">
        <div className="px-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              Data Pengeluaran Biaya Makan  
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

        {/* TABS */}
        <div className="flex flex-col gap-2 p-2">
          <div className="flex gap-2 mb-[-7px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
            <TablePengeluaran
              title={"Biaya Makan"}
              data={paginated}
              menu={"biaya_makan"}
            />

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {[...Array(totalPages)].map((_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      currentPage === num
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BiayaMakanPage;
