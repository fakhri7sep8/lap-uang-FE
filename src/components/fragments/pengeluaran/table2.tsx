"use client";

import React from "react";
import dayjs from "dayjs";
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
  ];

  const rawData = propData ?? internalData;

  // 🔥 SORT DATA BASED ON TANGGAL OR createdAt
  const data = [...rawData].sort((a, b) => {
    const dateA = new Date(a.tanggal ?? a.createdAt);
    const dateB = new Date(b.tanggal ?? b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const formatTanggal = (val: string) =>
    dayjs(val).format("DD/MM/YYYY");

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Data {title}</h2>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-base text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-sm">
              <th className="py-4 px-4 text-center">No</th>
              <th className="py-4 px-4">Tanggal</th>
              <th className="py-4 px-4">Nama</th>
              <th className="py-4 px-4">Penanggung Jawab</th>
              <th className="py-4 px-4">Kategori</th>
              <th className="py-4 px-4 text-right">Jumlah (Rp)</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition border-b border-gray-100 text-base"
              >
                <td className="py-4 px-4 text-center">{index + 1}</td>

                <td className="py-4 px-4">
                  {formatTanggal(item.tanggal ?? item.createdAt)}
                </td>

                <td className="py-4 px-4 font-semibold">{item.nama}</td>
                <td className="py-4 px-4">{item.penanggungJawab}</td>
                <td className="py-4 px-4">{item.kategori}</td>

                <td className="py-4 px-4 text-right">
                  Rp {item.jumlah?.toLocaleString("id-ID")}
                </td>

                <td className="py-4 px-4 text-center">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      item.status === "Selesai"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex justify-center gap-3">
                    <button className="p-2 hover:bg-blue-50 rounded-lg border">
                      <Pencil size={18} className="text-blue-600" />
                    </button>

                    <button className="p-2 hover:bg-green-50 rounded-lg border">
                      <Eye size={18} className="text-green-600" />
                    </button>

                    <button className="p-2 hover:bg-orange-50 rounded-lg border">
                      <Download size={18} className="text-orange-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE TABLE */}
      <div className="sm:hidden flex flex-col gap-4">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50"
          >
            <div className="text-sm text-gray-500 mb-2">#{index + 1}</div>

            <div className="flex justify-between">
              <span className="font-semibold">Nama:</span>
              <span>{item.nama}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Tanggal:</span>
              <span>{formatTanggal(item.tanggal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">PJ:</span>
              <span>{item.penanggungJawab}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Kategori:</span>
              <span>{item.kategori}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Jumlah:</span>
              <span>Rp {item.jumlah.toLocaleString("id-ID")}</span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  item.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>

              <div className="flex gap-2">
                <button className="p-2 border rounded-lg hover:bg-blue-50">
                  <Pencil size={16} className="text-blue-600" />
                </button>
                <button className="p-2 border rounded-lg hover:bg-green-50">
                  <Eye size={16} className="text-green-600" />
                </button>
                <button className="p-2 border rounded-lg hover:bg-orange-50">
                  <Download size={16} className="text-orange-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
