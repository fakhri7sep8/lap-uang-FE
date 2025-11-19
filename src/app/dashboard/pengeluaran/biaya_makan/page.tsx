/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { useState, useCallback } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { getAcademicMonths } from "@/lib/expense-months";

const BiayaMakanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["Semua"];

  /* ==========================
        DUMMY DATA BIAYA MAKAN
  ========================== */
  const data = [
    {
      id: 1,
      tanggal: "2025-11-01",
      nama: "Belanja Sayur Mingguan",
      penanggungJawab: "Bu Sinta",
      kategori: "Biaya Makan",
      jumlah: 350000,
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "2025-11-01",
      nama: "Pembelian Beras 50kg",
      penanggungJawab: "Pak Dimas",
      kategori: "Biaya Makan",
      jumlah: 700000,
      status: "Selesai",
    },
    {
      id: 3,
      tanggal: "2025-11-02",
      nama: "Pembelian Gas Dapur",
      penanggungJawab: "Pak Budi",
      kategori: "Biaya Makan",
      jumlah: 240000,
      status: "Proses",
    },
    {
      id: 4,
      tanggal: "2025-11-03",
      nama: "Belanja Lauk Harian",
      penanggungJawab: "Bu Rina",
      kategori: "Biaya Makan",
      jumlah: 420000,
      status: "Selesai",
    },
    {
      id: 5,
      tanggal: "2025-11-03",
      nama: "Pembelian Bumbu Dapur",
      penanggungJawab: "Bu Maya",
      kategori: "Biaya Makan",
      jumlah: 150000,
      status: "Selesai",
    },
    {
      id: 6,
      tanggal: "2025-11-04",
      nama: "Air Minum Galon 10 Buah",
      penanggungJawab: "Pak Dedi",
      kategori: "Biaya Makan",
      jumlah: 65000,
      status: "Proses",
    },
  ];

  /* FILTER */
  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ==========================
        GROUP PER BULAN
  ========================== */
  const tahunAjaranMulai = 2025;
  const months = getAcademicMonths(tahunAjaranMulai);

  const dataPerBulan: Record<string, any> = {};

  filteredData.forEach((item) => {
    const d = new Date(item.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    dataPerBulan[key] = {
      tanggal: item.tanggal,
      nominal: (dataPerBulan[key]?.nominal || 0) + item.jumlah,
      jenis: item.kategori,
    };
  });

  const totalPengeluaran = Object.values(dataPerBulan).reduce(
    (sum: number, row: any) => sum + (row.nominal || 0),
    0
  );

  /* ==========================
        EXPORT PDF
  ========================== */
  const handleExport = useCallback(async () => {
    const element = document.getElementById("report-pdf");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `laporan-biaya-makan.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  }, [filteredData]);

  return (
    <>
      {/* TEMPLATE PDF */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN BIAYA MAKAN"
          sectionLabel="Detail Biaya Makan"
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

      {/* ==========================
            PAGE WRAPPER
      ========================== */}
      <div className="min-h-screen flex flex-col py-7 w-full bg-[#eef3fa] px-3">

        {/* CARDS */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardInformation
            color="blue"
            title="Total Data"
            value={data.length}
            icon={<GraduationCap size={32} className="text-blue-500" />}
          />
          <CardInformation
            color="green"
            title="Data Terfilter"
            value={filteredData.length}
            icon={<Users size={32} className="text-green-500" />}
          />
        </section>

        {/* ⭐⭐⭐ HEADER — MATCHED EXACTLY ⭐⭐⭐ */}
        <div className="flex items-center justify-between mt-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 ">
              Data Pengeluaran Biaya Makan Sekolah
            </h1>
            <p className="text-gray-500 mb-6">
              Data Pengeluaran Sekolah Management.
            </p>
          </div>

          <ExportPDFButton label="Export PDF" onExport={handleExport} />
        </div>

        {/* TABS */}
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

          {/* WHITE WRAPPER LIKE OPERASIONAL */}
          <div className="bg-white w-full px-3 py-5 rounded-b-2xl border border-gray-200 shadow-sm">

            {/* SEARCH */}
            <SearchInput
              onChange={(e: any) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />

            {/* TABLE */}
            <TablePengeluaran2 title="Biaya Makan" data={filteredData} />

          </div>
        </div>
      </div>
    </>
  );
};

export default BiayaMakanPage;
