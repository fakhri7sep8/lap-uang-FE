"use client";

import React from "react";
import { Pencil, Eye, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type TablePengeluaranProps = {
  title: string;
  menu: string;      // "operasional" | "biaya_makan" | "pemeliharaan" | "upah_karyawan" | dst
  data?: any[];
};

export default function TablePengeluaran({
  title,
  data: propData,
  menu,
}: TablePengeluaranProps) {
  const router = useRouter();

  // Data dummy fallback kalau propData belum dikirim
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

  const data = propData ?? internalData;

  // ⭐ Format tanggal ke DD/MM/YYYY
  const formatTanggal = (value: string | Date | null | undefined) => {
    if (!value) return "-";
    return dayjs(value).format("DD/MM/YYYY");
  };

  // Base path untuk routing pengeluaran
  const basePath = "/dashboard/pengeluaran";

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full">
      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        Data {title}
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
              <th className="py-3 px-3 text-center w-[4%]">No</th>
              <th className="py-3 px-3 w-[10%]">Tanggal Pengeluaran</th>
              <th className="py-3 px-3 w-[20%]">Deskripsi / Nama</th>
              <th className="py-3 px-3 w-[15%]">Penanggung Jawab</th>
              <th className="py-3 px-3 w-[12%]">Kategori</th>
              <th className="py-3 px-3 w-[10%]">Prioritas</th>
              <th className="py-3 px-3 w-[12%] text-right">Jumlah (Rp)</th>
              <th className="py-3 px-3 w-[15%] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item, index) => (
              <tr
                key={item.id ?? index}
                className="hover:bg-gray-50 transition border-b border-gray-100 text-sm"
              >
                {/* NO */}
                <td className="py-3 px-3 text-center text-gray-600">
                  {index + 1}
                </td>

                {/* TANGGAL */}
                <td className="py-3 px-3">
                  {formatTanggal(item?.PayDate ?? item?.createdAt)}
                </td>

                {/* DESKRIPSI */}
                <td className="py-3 px-3 font-medium text-gray-800">
                  {item?.description ?? "-"}
                </td>

                {/* PENANGGUNG JAWAB */}
                <td className="py-3 px-3">
                  {item?.PenanggungJawab ?? "-"}
                </td>

                {/* KATEGORI */}
                <td className="py-3 px-3">
                  {item?.category?.name ?? "-"}
                </td>

                {/* PRIORITAS */}
                <td className="py-3 px-3">
                  {item?.Prioritas ?? "-"}
                </td>

                {/* JUMLAH */}
                <td className="py-3 px-3 text-right">
                  Rp {Number(item?.amount ?? 0).toLocaleString("id-ID")}
                </td>


                {/* AKSI */}
                <td className="py-3 px-3">
                  <div className="flex justify-center gap-2">
                    {/* EDIT */}
                    <button
                      onClick={() =>
                        router.push(`${basePath}/update/${item?.id}`)
                      }
                      title="Edit"
                      className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 bg-white hover:bg-blue-50 hover:shadow-sm transition"
                    >
                      <Pencil size={16} className="text-blue-600" />
                    </button>

                    {/* DETAIL (opsional – sesuaikan rute kalau sudah ada page-nya) */}
                    <button
                      onClick={() =>
                        router.push(`${basePath}/detail/${item?.id}`)
                      }
                      title="Detail"
                      className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 bg-white hover:bg-green-50 hover:shadow-sm transition"
                    >
                      <Eye size={16} className="text-green-600" />
                    </button>

                    {/* DOWNLOAD KWITANSI (opsional – sesuaikan rute/API) */}
                    <button
                      onClick={() =>
                        router.push(`${basePath}/receipt/${item?.id}`)
                      }
                      title="Download Kwitansi"
                      className="flex items-center justify-center border border-gray-200 rounded-md p-1.5 bg-white hover:bg-orange-50 hover:shadow-sm transition"
                    >
                      <Download size={16} className="text-orange-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {(!data || data.length === 0) && (
              <tr>
                <td
                  colSpan={9}
                  className="py-6 text-center text-gray-400 text-sm"
                >
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
