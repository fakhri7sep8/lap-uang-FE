"use client";

import { useState } from "react";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";
import ExportPDFButton from "@/components/fragments/ExportPDFButton";

const UpahKaryawanPage = () => {
  const [activeTab, setActiveTab] = useState("Guru");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const currentData = dataPerTab[activeTab] || [];

  const filteredData = currentData.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageSize = 5;
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen flex flex-col gap-10 py-7 bg-[#eef3fa] px-3">

      {/* TOP CARDS */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={currentData.length}
          icon={<GraduationCap size={32} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Data Terfilter"}
          value={filteredData.length}
          icon={<Users size={32} className="text-green-500" />}
        />
      </section>

      {/* MAIN BLOCK */}
      <div className="w-full">

        <div className="px-3">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Data Pengeluaran Sekolah
          </h1>
          <p className="text-gray-500 mb-6">Data Pengeluaran Sekolah Management.</p>
        </div>

        <div className="flex flex-col gap-2 px-3">
          {/* TABS */}
          <div className="flex gap-2 -mb-[7px]">
            {Object.keys(dataPerTab).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
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

          {/* TABLE BOX — NOW FULL WIDTH */}
          <div className="bg-white w-full  px-4 py-5 rounded-b-2xl border border-gray-200 shadow-sm">

            {/* SEARCH + BUTTON */}
            <div className="flex justify-between items-center mb-3">
              <SearchInput
                onChange={(e: any) => setSearchTerm(e.target.value)}
                searchTerm={searchTerm}
              />
              <ExportPDFButton
                label="Export"
                onExport={async (action: "check" | "export") => {
                  // no-op: returning void inside an async function satisfies Promise<boolean | void>
                }}
              />
            </div>

            {/* TABLE */}
            <TablePengeluaran2 title={`Data Upah ${activeTab}`} data={paginatedData} />

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

      </div>
    </div>
  );
};

export default UpahKaryawanPage;
