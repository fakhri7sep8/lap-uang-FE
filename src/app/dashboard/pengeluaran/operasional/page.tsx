/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";

import ExportPDFButton from "@/components/fragments/ExportPDFButton";
import ReportPdfTemplate from "@/components/template/pengeluaran/ReportPdfTemplate";
import { getAcademicMonths } from "@/lib/expense-months";

const OperasionalPage = () => {
  const [activeTab, setActiveTab] = useState("Pembangunan");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["Pembangunan", "Sarana"];

  // === DATA ASLI (TIDAK DIUBAH) ===
  const data = [
    {
      id: 4,
      tanggal: "2025-10-30",
      nama: "Pembelian ATK",
      penanggungJawab: "Bu Rina",
      kategori: "Operasional",
      subKategori: "ATK",
      jumlah: 350000,
      status: "Selesai",
    },
    {
      id: 5,
      tanggal: "2025-10-30",
      nama: "Biaya Fotokopi Dokumen",
      penanggungJawab: "Pak Arif",
      kategori: "Operasional",
      subKategori: "Dokumen",
      jumlah: 150000,
      status: "Selesai",
    },
    {
      id: 6,
      tanggal: "2025-10-30",
      nama: "Pembelian Tinta Printer",
      penanggungJawab: "Bu Sari",
      kategori: "Operasional",
      subKategori: "Peralatan Ajar",
      jumlah: 280000,
      status: "Proses",
    },
    {
      id: 7,
      tanggal: "2025-10-31",
      nama: "Konsumsi Rapat Guru",
      penanggungJawab: "Bu Maya",
      kategori: "Operasional",
      subKategori: "Konsumsi",
      jumlah: 400000,
      status: "Selesai",
    },
    {
      id: 8,
      tanggal: "2025-10-31",
      nama: "Pembelian Air Galon",
      penanggungJawab: "Pak Dedi",
      kategori: "Operasional",
      subKategori: "Kebutuhan Harian",
      jumlah: 120000,
      status: "Selesai",
    },
    {
      id: 9,
      tanggal: "2025-11-01",
      nama: "Penggantian Kabel Peralatan Ajar",
      penanggungJawab: "Bu Rina",
      kategori: "Operasional",
      subKategori: "Peralatan Ajar",
      jumlah: 95000,
      status: "Proses",
    },
    {
      id: 10,
      tanggal: "2025-11-01",
      nama: "Pembelian Obat P3K",
      penanggungJawab: "Bu Lilis",
      kategori: "Operasional",
      subKategori: "Kesehatan",
      jumlah: 210000,
      status: "Selesai",
    },
  ];

  // === FILTER ===
  const filteredData = data.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subKategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================
  // ⭐ PERBAIKAN UTAMA: TOTAL BULANAN & TOTAL AKHIR
  // ============================================================

  const tahunAjaranMulai = 2025;
  const months = getAcademicMonths(tahunAjaranMulai);

  const dataPerBulan: Record<string, any> = {};

  filteredData.forEach((item) => {
    const d = new Date(item.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    dataPerBulan[key] = {
      tanggal: item.tanggal,
      nominal: (dataPerBulan[key]?.nominal || 0) + item.jumlah, // ⬅ FIX AKUMULASI
      jenis: item.kategori, // ⬅ Sesuai perintah kamu
    };
  });

  const totalPengeluaran = Object.values(dataPerBulan).reduce(
    (sum: number, row: any) => sum + (row.nominal || 0),
    0
  );

  // ============================================================
  // ⭐ PERBAIKAN PAGINATION — minimal & tidak ganggu apapun
  // ============================================================

  const pageSize = 5; // jumlah data per halaman
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ============================================================
  // EXPORT PDF
  // ============================================================

  const handleExport = useCallback(async () => {
    const element = document.getElementById("report-pdf");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `pengeluaran-operasional.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    html2pdf().set(opt).from(element).save();
  }, [filteredData]);

  // ============================================================

  return (
    <div className="min-h-screen flex flex-col gap-10 py-7 w-full bg-[#eef3fa] px-3">

      {/* TOP CARDS */}
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

      {/* MAIN CONTAINER */}
      <div className="w-full">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 ">
              Data Pengeluaran Operasional Sekolah
            </h1>
            <p className="text-gray-500 mb-6">
              Data Pengeluaran Sekolah Management.
            </p>
          </div>

          <ExportPDFButton
            label="Export PDF"
            onExport={handleExport}
            className="h-12"
          />
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

          {/* WHITE WRAPPER */}
          <div className="bg-white w-full px-3 py-5 rounded-b-2xl rounded-e-2xl border border-gray-200 shadow-sm">

            {/* SEARCH */}
            <SearchInput
              onChange={(e: any) => setSearchTerm(e.target.value)}
              searchTerm={searchTerm}
            />

            {/* TABLE — PAGINATION FIXED */}
            <TablePengeluaran2 title={"Operasional"} data={paginatedData} />

            {/* PAGINATION — DINAMIS */}
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

      {/* TEMPLATE PDF */}
      <div className="hidden">
        <ReportPdfTemplate
          title="LAPORAN PENGELUARAN OPERASIONAL"
          sectionLabel="Detail Pengeluaran"
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
    </div>
  );
};

export default OperasionalPage;
