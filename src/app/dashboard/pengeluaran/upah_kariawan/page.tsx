/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { getAcademicMonths } from "@/lib/expense-months";

const UpahKaryawanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ======================
        DATA
  ====================== */
  const dataPerTab: Record<string, any[]> = {
    Guru: [
      {
        id: 1,
        tanggal: "2025-10-29",
        nama: "Gaji Guru Honorer",
        penanggungJawab: "Pak Hadi",
        kategori: "Upah Karyawan",
        subKategori: "Guru",
        jumlah: 2500000,
        status: "Selesai",
      },
    ],
    Staf: [
      {
        id: 2,
        tanggal: "2025-10-28",
        nama: "Gaji Staf TU",
        penanggungJawab: "Bu Rina",
        kategori: "Upah Karyawan",
        subKategori: "Staf",
        jumlah: 1800000,
        status: "Selesai",
      },
    ],
    Satpam: [
      {
        id: 3,
        tanggal: "2025-10-28",
        nama: "Gaji Satpam",
        penanggungJawab: "Pak Budi",
        kategori: "Upah Karyawan",
        subKategori: "Satpam",
        jumlah: 2000000,
        status: "Selesai",
      },
    ],
    Tukang: [],
    Dapur: [],
    Laundry: [],
  };

  const allData = Object.values(dataPerTab).flat();

  const currentData =
    activeTab === "Semua" ? allData : dataPerTab[activeTab] || [];

  const filteredData = currentData.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ======================
        DATA PER BULAN
  ====================== */
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
    (s: number, r: any) => s + (r.nominal || 0),
    0
  );

  /* ======================
        EXPORT PDF
  ====================== */
  const handleExport = useCallback(async () => {
    const element = document.getElementById("report-pdf");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `laporan-upah-karyawan.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  }, [filteredData]);

  /* ======================
        PAGINATION
  ====================== */
  const pageSize = 5;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* PDF TEMPLATE (hidden) */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN UPAH KARYAWAN"
          sectionLabel="Detail Upah Karyawan"
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

      {/* PAGE */}
      <div className="min-h-screen flex flex-col py-7 bg-[#eef3fa] px-3 w-full">

        {/* TOP CARDS */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <CardInformation
            color="blue"
            title="Total Data"
            value={currentData.length}
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Data Pengeluaran Upah Karyawan Sekolah
            </h1>
            <p className="text-gray-500 mb-6">
              Data Pengeluaran Sekolah Management.
            </p>
          </div>

        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-[1px]">
          {["Semua", ...Object.keys(dataPerTab)].map((tab) => (
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

        {/* WHITE WRAPPER */}
        <div className="bg-white w-full px-3 py-5 rounded-b-2xl border border-gray-200 shadow-sm">

          <div className="flex w-full justify-between items-center mb-4">
            <div className="w-full">

          <SearchInput
            onChange={(e: any) => setSearchTerm(e.target.value)}
            searchTerm={searchTerm}
          />
            </div>
          <ExportPDFButton label="Export PDF" onExport={handleExport} />
            
          </div>

          <TablePengeluaran2
            title={`Upah ${activeTab}`}
            data={paginatedData}
          />

          {/* PAGINATION */}
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
    </>
  );
};

export default UpahKaryawanPage;
