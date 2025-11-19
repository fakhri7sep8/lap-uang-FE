/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";

/* Sama seperti operasional */
import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { getAcademicMonths } from "@/lib/expense-months";

const PemeliharaanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["Semua"];

  /* DATA PEMELIHARAAN */
  const data = [
    {
      id: 1,
      tanggal: "2025-11-02",
      nama: "Perbaikan AC",
      penanggungJawab: "Pak Dimas",
      kategori: "Pemeliharaan",
      jumlah: 850000,
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "2025-11-02",
      nama: "Service Komputer",
      penanggungJawab: "Pak Hadi",
      kategori: "Pemeliharaan",
      jumlah: 650000,
      status: "Proses",
    },
    {
      id: 3,
      tanggal: "2025-11-03",
      nama: "Perbaikan Lampu Aula",
      penanggungJawab: "Bu Sinta",
      kategori: "Pemeliharaan",
      jumlah: 320000,
      status: "Selesai",
    },
  ];

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================================================================
  // ⭐ METODE EXPORT PDF—PERSIS SAMA DENGAN OPERASIONAL
  // ==================================================================

  const tahunAjaranMulai = 2025;
  const months = getAcademicMonths(tahunAjaranMulai);

  const dataPerBulan: Record<string, any> = {};

  filteredData.forEach((item) => {
    const d = new Date(item.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    dataPerBulan[key] = {
      tanggal: item.tanggal,
      nominal: (dataPerBulan[key]?.nominal || 0) + item.jumlah,
      jenis: item.kategori, // pemeliharaan
    };
  });

  const totalPengeluaran = Object.values(dataPerBulan).reduce(
    (sum: number, row: any) => sum + (row.nominal || 0),
    0
  );

  const handleExport = useCallback(async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("report-pdf");
    if (!element) return;

    html2pdf()
      .set({
        margin: 10,
        filename: "laporan-pemeliharaan.pdf",
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  }, [filteredData]);

  // ==================================================================
  // ⭐ PAGINATION (tidak diubah sama sekali)
  // ==================================================================
  const pageSize = 5;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* TEMPLATE PDF (hidden) */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN PEMELIHARAAN SEKOLAH"
          sectionLabel="Detail Pemeliharaan"
          headerLogoUrl="/img/Logo.png"
          sekolah={{
            nama: "SMK MADINATUL QURAN",
            alamat: "KP KEBON KELAPA, JAWA BARAT",
          }}
          tahunAjaranMulai={tahunAjaranMulai}
          dataPerBulan={dataPerBulan}
          totalPengeluaran={totalPengeluaran}
          tanggalCetak="23 Juli 2026"
        />
      </div>

      {/* PAGE UTAMA */}
      <div className="min-h-screen flex flex-col gap-10 py-7 w-full bg-[#eef3fa] px-3">

        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardInformation
            color={"blue"}
            title={"Total Data"}
            value={data.length}
            icon={<GraduationCap size={32} className="text-blue-500" />}
          />
          <CardInformation
            color={"green"}
            title={"Data Terfilter"}
            value={filteredData.length}
            icon={<Users size={32} className="text-green-500" />}
          />
        </section>

        <div className="w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Data Pengeluaran Pemeliharaan Sekolah
              </h1>
              <p className="text-gray-500 mb-6">
                Data seluruh aktivitas pemeliharaan di lingkungan sekolah.
              </p>
            </div>

            <ExportPDFButton label="Export PDF" onExport={handleExport} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 -mb-[7px]">
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

            <div className="bg-white w-full px-3 py-5 rounded-b-2xl border border-gray-200 shadow-sm">

              <SearchInput
                onChange={(e: any) => setSearchTerm(e.target.value)}
                searchTerm={searchTerm}
              />

              <TablePengeluaran2 title={"Pemeliharaan"} data={paginatedData} />

              <div className="flex justify-center items-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PemeliharaanPage;
