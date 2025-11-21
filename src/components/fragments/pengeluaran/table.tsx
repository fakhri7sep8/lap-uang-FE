"use client";

import React from "react";
import { Pencil, Eye, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function TablePengeluaran({
  title,
  data: propData,
  menu,
}: {
  title: string;
  menu: string;
  data?: any[];
}) {
  const router = useRouter();

  const internalData = [
    {
      id: 1,
      PayDate: "2025-10-29",
      description: "Bayar Listrik",
      PenanggungJawab: "Pak Dimas",
      category: { name: "Pemeliharaan" },
      Prioritas: "PENTING",
      amount: 500000,
      status: "Selesai",
    },
  ];

  const data = propData ?? internalData;

  // ⭐ Format DD/MM/YYYY
  const formatTanggal = (value: string) => {
    if (!value) return "-";
    return dayjs(value).format("DD/MM/YYYY");
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        Data {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-base text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-sm border-b border-gray-200">
              <th className="py-4 px-4 text-center">No</th>
              <th className="py-4 px-4">Tanggal Pengeluaran</th>
              <th className="py-4 px-4">Nama</th>
              <th className="py-4 px-4">Penanggung Jawab</th>
              <th className="py-4 px-4">Kategori</th>
              <th className="py-4 px-4">Prioritas</th>
              <th className="py-4 px-4 text-right">Jumlah (Rp)</th>
              <th className="py-4 px-4 text-center">Status</th>
              <th className="py-4 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition border-b border-gray-100 text-base"
              >
                {/* NO */}
                <td className="py-4 px-4 text-center">{index + 1}</td>

                {/* ⭐ TANGGAL FORMAT DD/MM/YYYY */}
                <td className="py-4 px-4 text-center">
                  {formatTanggal(item?.PayDate)}
                </td>

                {/* NAMA */}
                <td className="py-4 px-4 font-semibold text-gray-800">
                  {item?.description}
                </td>

                {/* PJ */}
                <td className="py-4 px-4">{item?.PenanggungJawab}</td>

                {/* KATEGORI */}
                <td className="py-4 px-4">{item?.category?.name}</td>

                {/* PRIORITAS */}
                <td className="py-4 px-4">{item?.Prioritas}</td>

                {/* JUMLAH */}
                <td className="py-4 px-4 text-right">
                  Rp {item?.amount?.toLocaleString("id-ID")}
                </td>

                {/* STATUS */}
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

                {/* ACTION BUTTON */}
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => router.push(`update/${item?.id}`)}
                      title="Edit"
                      className="p-2 hover:bg-blue-50 rounded-lg border"
                    >
                      <Pencil size={18} className="text-blue-600" />
                    </button>

                    <button
                      title="Detail"
                      className="p-2 hover:bg-green-50 rounded-lg border"
                    >
                      <Eye size={18} className="text-green-600" />
                    </button>

                    <button
                      title="Download Kwitansi"
                      className="p-2 hover:bg-orange-50 rounded-lg border"
                    >
                      <Download size={18} className="text-orange-600" />
                    </button>
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
