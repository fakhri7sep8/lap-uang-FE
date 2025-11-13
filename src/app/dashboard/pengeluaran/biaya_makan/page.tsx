'use client';
import { useState, useMemo } from "react"; // { added useMemo }
import { Button } from "@/components/ui/button";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { GraduationCap, Users } from "lucide-react";
import TablePengeluaran2 from "@/components/fragments/pengeluaran/table2";
import SearchInput from "@/components/fragments/pengeluaran/seraach_andinput";

const BiayaMakanPage = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // <-- default 10 per page

  const tabs = ["Semua"];
  const data = [
    { id: 1, tanggal: "2025-11-01", nama: "Beras untuk kantin", penanggungJawab: "Bu Ani", kategori: "Makanan Siswa", jumlah: 1500000, status: "Selesai" },
    { id: 2, tanggal: "2025-11-02", nama: "Telur (bulk)", penanggungJawab: "Pak Joko", kategori: "Makanan Siswa", jumlah: 450000, status: "Selesai" },
    { id: 3, tanggal: "2025-11-03", nama: "Sayur segar", penanggungJawab: "Bu Sari", kategori: "Makanan Siswa", jumlah: 300000, status: "Selesai" },
    { id: 4, tanggal: "2025-11-05", nama: "Snack lomba antar kelas", penanggungJawab: "Bu Rina", kategori: "Konsumsi Acara", jumlah: 750000, status: "Selesai" },
    { id: 5, tanggal: "2025-11-06", nama: "Air mineral galon", penanggungJawab: "Pak Dedi", kategori: "Kantin", jumlah: 200000, status: "Selesai" },
    { id: 6, tanggal: "2025-11-07", nama: "Bumbu dapur (stok)", penanggungJawab: "Bu Lilis", kategori: "Dapur", jumlah: 250000, status: "Proses" },
    { id: 7, tanggal: "2025-11-08", nama: "Konsumsi rapat guru", penanggungJawab: "Kepsek", kategori: "Konsumsi Rapat", jumlah: 600000, status: "Selesai" },
    { id: 8, tanggal: "2025-11-10", nama: "Roti & susu siswa", penanggungJawab: "Bu Rika", kategori: "Makanan Siswa", jumlah: 520000, status: "Selesai" },
    { id: 9, tanggal: "2025-11-11", nama: "Bahan kue acara OSIS", penanggungJawab: "Panitia OSIS", kategori: "Konsumsi Acara", jumlah: 400000, status: "Proses" },
    { id: 10, tanggal: "2025-11-12", nama: "Minyak goreng (stok)", penanggungJawab: "Pak Wawan", kategori: "Dapur", jumlah: 330000, status: "Selesai" },
    { id: 11, tanggal: "2025-11-13", nama: "Buah potong untuk acara", penanggungJawab: "Bu Maya", kategori: "Konsumsi Acara", jumlah: 270000, status: "Pending" },
    { id: 12, tanggal: "2025-11-14", nama: "Gula & teh untuk kantin", penanggungJawab: "Bu Tuti", kategori: "Kantin", jumlah: 180000, status: "Selesai" }
  ];

  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // dynamic pagination values
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // reset page when filters or pageSize change
  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col gap-10 py-6 px-8 ">
      {/* Kartu informasi */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardInformation
          color={"blue"}
          title={"Total Data"}
          value={data.length}
          icon={<GraduationCap size={36} className="text-blue-500" />}
        />
        <CardInformation
          color={"green"}
          title={"Data Terfilter"}
          value={filteredData.length}
          icon={<Users size={36} className="text-green-500" />}
        />
      </section>

      {/* Konten utama */}
      <section className="w-full bg-white shadow-lg rounded-3xl p-8">
        {/* Header */}
        <div className="pb-4  border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Data Pengeluaran Sekolah
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mt-8 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-sm ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <SearchInput
            onChange={(e: any) => setSearchTerm(e.target.value)}
            searchTerm={searchTerm}
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <div className="w-full">
            <TablePengeluaran2 title={"Oprasional"} data={paginatedData} />
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => handleSetPageSize(Number(e.target.value))}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-500 ml-3">
              {filteredData.length} item(s)
            </span>
          </div>

          <div className="flex justify-center items-center gap-3">
            {Array.from({ length: totalPages }).map((_, i) => {
              const num = i + 1;
              return (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                    currentPage === num
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BiayaMakanPage;
