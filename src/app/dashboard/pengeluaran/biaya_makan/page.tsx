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

// 🔥 modern date filter
import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";

const BiayaMakanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  // 🔥 date filter state
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const tabs = ["Semua"];

  const { useGetExpense } = useExpenseModule();
  const { data: expenses } = useGetExpense("Makan");

  // ========================================
  // FILTERING
  // ========================================
  const filteredData = useMemo(() => {
    if (!expenses?.data) return [];

    const search = searchTerm.toLowerCase();

    return expenses.data.filter((item: any) => {
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search);

      const matchTab = item?.subCategoryId === 13;

      const itemDate = new Date(item.createdAt);

      const matchStart = dateFilter.startDate
        ? itemDate >= new Date(dateFilter.startDate)
        : true;

      const matchEnd = dateFilter.endDate
        ? itemDate <= new Date(dateFilter.endDate)
        : true;

      return matchSearch && matchTab && matchStart && matchEnd;
    });
  }, [expenses, searchTerm, activeTab, dateFilter]);

  // ========================================
  // PDF DATA PER BULAN
  // ========================================
  const dataPerBulan: Record<string, any> = {};
  filteredData.forEach((row: any) => {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    dataPerBulan[key] = {
      tanggal: row.createdAt,
      nominal: (dataPerBulan[key]?.nominal || 0) + row.amount,
      jenis: row.category?.name,
    };
  });

  const totalJumlah = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );

  // ========================================
  // PDF DOWNLOAD
  // ========================================
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

  // ========================================
  // Pagination otomatis
  // ========================================
  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginated = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center py-7">
      {/* HIDDEN TEMPLATE EXPORT */}
      <div className="hidden" id="report-pdf-makan">
        <ReportPdfTemplate
          title="LAPORAN BIAYA MAKAN"
          sectionLabel="Detail Pengeluaran Biaya Makan"
          headerLogoUrl="/img/Logo.png"
          sekolah={{
            nama: "SMK MADINATUL QURAN",
            alamat: "KP KEBON KELAPA, JAWA BARAT",
          }}
          tahunAjaranMulai={2024}
          dataPerBulan={dataPerBulan}
          totalPengeluaran={totalJumlah}
          tanggalCetak={dayjs().format("DD MMMM YYYY")}
        />
      </div>

      {/* INFO CARDS */}
      <section className="w-full grid grid-cols-2 gap-4">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={expenses?.data?.length ?? 0}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Data Terfilter"}
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* MAIN CONTENT */}
      <div className="w-full rounded-3xl">
        {/* TITLE + EXPORT */}
        <div className="pl-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Data Pengeluaran Biaya Makan Sekolah
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

          {/* TABLE CARD */}
          <div className="bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl">
            {/* 🔥 SEARCH FULL WIDTH + FILTER TANGGAL DI KANAN */}
            {/* 🔥 SEARCH + FILTER TANGGAL MIRIP BIAYA MAKAN, TAPI LEBIH RAPI */}

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              {/* Search full kiri, diperlebar */}
              <div className="w-full md:flex-1">
                <SearchInput
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  searchTerm={searchTerm}
                />
              </div>

              {/* Filter tetap pojok kanan tapi tidak mepet */}
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
