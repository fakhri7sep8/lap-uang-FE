"use client";

import React from "react";
import { Pencil, Eye, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type TablePengeluaranProps = {
  title: string;
  menu: string;
  data?: any[];
};

export default function TablePengeluaran({
  title,
  data: propData,
  menu,
}: TablePengeluaranProps) {
  const router = useRouter();

  // fallback jika tidak ada propData
  const internalData = [
    {
      id: 1,
      PayDate: "2025-10-29T00:00:00.000Z",
      description: "Bayar Listrik",
      PenanggungJawab: "Pak Dimas",
      category: { name: "Pemeliharaan" },
      Prioritas: "PENTING",
      amount: 500000,
      status: "Selesai",
    },
  ];

  const rawData = propData ?? internalData;

  // 🔥 SORT DATA BY DATE (NEWEST → OLDEST)
  const data = [...rawData].sort((a, b) => {
    const dateA = new Date(a.PayDate ?? a.createdAt);
    const dateB = new Date(b.PayDate ?? b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const formatTanggal = (val: string | Date | undefined) =>
    val ? dayjs(val).format("DD/MM/YYYY") : "-";

  const basePath = "/dashboard/pengeluaran";

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        Data {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
              <th className="py-3 px-3 text-center w-[4%]">No</th>
              <th className="py-3 px-3 w-[10%]">Tanggal Pengeluaran</th>
              <th className="py-3 px-3 w-[20%]">Deskripsi</th>
              <th className="py-3 px-3 w-[15%]">Penanggung Jawab</th>
              <th className="py-3 px-3 w-[12%]">Kategori</th>
              <th className="py-3 px-3 w-[10%]">Prioritas</th>
              <th className="py-3 px-3 w-[12%] text-right">Jumlah (Rp)</th>
              <th className="py-3 px-3 w-[15%] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="hover:bg-gray-50 transition border-b border-gray-100 text-sm"
              >
                <td className="py-3 px-3 text-center">{index + 1}</td>

                <td className="py-3 px-3">
                  {formatTanggal(item.PayDate ?? item.createdAt)}
                </td>

                <td className="py-3 px-3 font-medium text-gray-800">
                  {item.description}
                </td>

                <td className="py-3 px-3">{item.PenanggungJawab}</td>

                <td className="py-3 px-3">{item.category?.name}</td>

                <td className="py-3 px-3">{item.Prioritas ?? "-"}</td>

                <td className="py-3 px-3 text-right">
                  Rp {Number(item.amount ?? 0).toLocaleString("id-ID")}
                </td>

                <td className="py-3 px-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`${basePath}/update/${item.id}`)
                      }
                      title="Edit"
                      className="p-1.5 border border-gray-200 rounded bg-white hover:bg-blue-50"
                    >
                      <Pencil size={16} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() =>
                        router.push(`${basePath}/receipt/${item.id}`)
                      }
                      title="Download Kwitansi"
                      className="p-1.5 border border-gray-200 rounded bg-white hover:bg-orange-50"
                    >
                      <Download size={16} className="text-orange-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
