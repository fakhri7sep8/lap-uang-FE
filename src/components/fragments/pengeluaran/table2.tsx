"use client";

import React from "react";
import { Pencil, Eye, Download } from "lucide-react";

export default function TablePengeluaran2({
  title,
  data: propData,
}: {
  title: string;
  data?: any[];
}) {
  const internalData = [
    {
      id: 1,
      tanggal: "2025-10-29",
      nama: "Bayar Listrik",
      penanggungJawab: "Pak Dimas",
      kategori: "Pemeliharaan",
      jumlah: 500000,
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "2025-10-29",
      nama: "Gaji Guru Honorer",
      penanggungJawab: "Pak Hadi",
      kategori: "Upah Karyawan",
      jumlah: 2500000,
      status: "Selesai",
    },
    {
      id: 3,
      tanggal: "2025-10-29",
      nama: "Langganan Internet",
      penanggungJawab: "Bu Sinta",
      kategori: "Pemeliharaan",
      jumlah: 450000,
      status: "Proses",
    },
  ];

  const data = propData ?? internalData;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        Data {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-lg text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-base">
              <th className="py-4 px-4 text-center w-[3%]">No</th>
              <th className="py-4 px-4 w-[12%]">Tanggal Pengeluaran</th>
              <th className="py-4 px-4 w-[18%]">Nama</th>
              <th className="py-4 px-4 w-[15%]">Penanggung Jawab</th>
              <th className="py-4 px-4 w-[12%]">Kategori</th>
              <th className="py-4 px-4 w-[12%] text-right">Jumlah (Rp)</th>
              <th className="py-4 px-4 w-[10%] text-center">Status</th>
              <th className="py-4 px-4 w-[12%] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition-all text-[16px] border-b border-gray-100"
              >
                <td className="py-4 px-4 text-center text-gray-600 font-medium">
                  {index + 1}
                </td>
                <td className="py-4 px-4">{item.tanggal}</td>
                <td className="py-4 px-4 font-semibold text-gray-900">
                  {item.nama}
                </td>
                <td className="py-4 px-4">{item.penanggungJawab}</td>
                <td className="py-4 px-4">{item.kategori}</td>
                <td className="py-4 px-4 text-right font-medium">
                  Rp {item.jumlah.toLocaleString("id-ID")}
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                      item.status === "Selesai"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3">
                      <button
                        title="Edit"
                        className="flex items-center justify-center border border-gray-200 rounded-lg p-2.5 hover:bg-blue-50 hover:shadow-md transition"
                      >
                        <Pencil size={20} className="text-blue-600" />
                      </button>

                      <button
                        title="Detail"
                        className="flex items-center justify-center border border-gray-200 rounded-lg p-2.5 hover:bg-green-50 hover:shadow-md transition"
                      >
                        <Eye size={20} className="text-green-600" />
                      </button>

                      <button
                        title="Download Kwitansi"
                        className="flex items-center justify-center border border-gray-200 rounded-lg p-2.5 hover:bg-orange-50 hover:shadow-md transition"
                      >
                        <Download size={20} className="text-orange-600" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
