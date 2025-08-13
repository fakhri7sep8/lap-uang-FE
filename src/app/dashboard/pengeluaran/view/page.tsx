"use client";

import { viewPengeluaran } from "@/data/view-pengeluaran";

const formatRupiah = (num: number) =>
  "RP. " + num.toLocaleString("id-ID");

// Fungsi untuk ambil nama bulan dari tanggal
const getBulan = (tanggal: string) => {
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const dateObj = new Date(tanggal);
  return bulanIndo[dateObj.getMonth()];
};

// Urutkan data berdasarkan bulan (atau tanggal)
const sortedPengeluaran = [...viewPengeluaran].sort((a, b) => {
  const bulanA = new Date(a.tanggal).getMonth();
  const bulanB = new Date(b.tanggal).getMonth();
  return bulanA - bulanB;
});

const TablePengeluaran = () => (
  <div className="bg-white rounded-xl shadow p-4 mt-4">
    <table className="w-full table-auto text-gray-700">
      <thead>
        <tr className="border-b text-left text-gray-400 text-sm">
          <th className="py-2 px-4 font-medium">Bulan</th>
          <th className="py-2 px-4 font-medium">Tanggal Bayar</th>
          <th className="py-2 px-4 font-medium">Jenis pengeluaran</th>
          <th className="py-2 px-4 font-medium">Keterangan</th>
          <th className="py-2 px-4 font-medium">jumlah bayar</th>
        </tr>
      </thead>
      <tbody>
        {sortedPengeluaran.map((item) => (
          <tr key={item.id} className="border-b last:border-b-0">
            <td className="py-2 px-4">{getBulan(item.tanggal)}</td>
            <td className="py-2 px-4">{item.tanggal}</td>
            <td className="py-2 px-4">{item.jenisPengeluaran}</td>
            <td className="py-2 px-4">{item.deskripsi}</td>
            <td className="py-2 px-4">{formatRupiah(item.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function PengeluaranViewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-[90%] mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/img/Logo.png" alt="LapUang" className="h-8" />
        </div>
        <h1 className="text-2xl font-medium mb-2">Riwayat Pengeluaran</h1>
      </div>
      <div className="w-full max-w-[90%]">
        <TablePengeluaran />
      </div>
    </div>
  );
}