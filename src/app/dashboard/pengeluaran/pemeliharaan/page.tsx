"use client";
import { useMemo, useState } from "react";
import { GraduationCap, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import { useExpenseModule } from "@/hooks/expense/useExpense";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";

// ⛔ Tambahkan filter tanggal modern 
import DateRangeFilterModern from "@/components/fragments/pengeluaran/DateRangeFilter";

const PemeliharaanPage = () => {
  const [activeTab, setActiveTab] = useState("Listrik");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showPreview, setShowPreview] = useState(false);

  // 🔥 date filter
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const tabs = ["Listrik", "Air", "Internet", "BPJS"];

  const { useGetExpense } = useExpenseModule();
  const { data: expenses, isLoading, isError } = useGetExpense("pemeliharaan");

  const subCategoryMap: Record<string, number> = {
    Listrik: 3,
    Air: 4,
    Internet: 5,
    BPJS: 6,
  };

  const filteredData = useMemo(() => {
    if (!expenses?.data) return [];

    const search = searchTerm.toLowerCase();

    return expenses.data.filter((item: any) => {
      const matchSearch =
        item?.description?.toLowerCase().includes(search) ||
        item?.PenanggungJawab?.toLowerCase().includes(search) ||
        item?.category?.name?.toLowerCase().includes(search);

      const matchTab = item?.subCategoryId === subCategoryMap[activeTab];

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

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + rowsPerPage);

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // PDF — Data Bulanan
  const dataPerBulan: Record<string, any> = {};
  filteredData.forEach((row: any) => {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    dataPerBulan[key] = {
      tanggal: row.createdAt,
      nominal: (dataPerBulan[key]?.nominal || 0) + row.amount,
      jenis: row.category?.name,
    };
  });

  const totalJumlah = filteredData.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-pdf-pemeliharaan");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `laporan-pemeliharaan-${dayjs().format("YYYY-MM-DD")}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();

    setShowPreview(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center py-7">

      {/* HIDDEN PDF TEMPLATE */}
      <div className="hidden">
        <div id="report-pdf-pemeliharaan">
          <ReportPdfTemplate
            title="LAPORAN PEMELIHARAAN SEKOLAH"
            sectionLabel={`Detail Pemeliharaan (${activeTab})`}
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
      </div>

      {/* CARDS */}
      <section className="w-full grid grid-cols-2 gap-4">
        <CardInformation
          color="blue"
          title="Total Data"
          value={expenses?.data?.length ?? 0}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color="green"
          title="Data Terfilter"
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* MAIN CONTENT */}
      <div className="w-full rounded-3xl">

        <div className="px-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Data Pengeluaran Pemeliharaan Sekolah
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

          <div className="bg-white px-4 py-5 rounded-b-2xl rounded-e-2xl">

            {/* 🔥 SEARCH FULL WIDTH + FILTER DI POJOK KANAN */}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

              {/* Search Full */}
              <div className="w-full md:flex-1">
                <SearchInput
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  searchTerm={searchTerm}
                />
              </div>

              {/* Date Filter Right */}
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
                Gagal memuat data pemeliharaan.
              </p>
            ) : filteredData.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                Tidak ada data ditemukan.
              </p>
            ) : (
              <TablePengeluaran2
                title="Pemeliharaan"
                data={paginatedData}
                menu="pemeliharaan"
              />
            )}

            {/* PAGINATION */}
            {filteredData.length > 0 && (
              <div className="flex w-full justify-between items-center mt-6 flex-wrap gap-4">
                
                {/* ROWS PER PAGE */}
                <div className="flex items-center gap-2">
                  <label className="text-sm">Tampil:</label>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-sm">per halaman</span>
                </div>

                {/* PAGE BUTTONS */}
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
      </div>
    </div>
  );
};

export default PemeliharaanPage;
