import React from "react";
import { Pencil, Eye, Download } from "lucide-react";

type PengeluaranItem = {
  id: number;
  tanggal: string;
  nama: string;
  penanggungJawab: string;
  kategori: string;
  subKategori: string;
  jumlah: number;
  status: string;
};

type TablePengeluaranProps = {
  title: string;
  data?: PengeluaranItem[];
};

export default function TablePengeluaran({ title, data }: TablePengeluaranProps) {
  // fallback default data
  const fallbackData = [
    {
      id: 1,
      tanggal: "2025-10-29",
      nama: "Bayar Listrik",
      penanggungJawab: "Pak Dimas",
      kategori: "Pemeliharaan",
      subKategori: "Listrik",
      jumlah: 500000,
      status: "Selesai",
    },
    {
      id: 2,
      tanggal: "2025-10-29",
      nama: "Gaji Guru Honorer",
      penanggungJawab: "Pak Hadi",
      kategori: "Upah Karyawan",
      subKategori: "Guru",
      jumlah: 2500000,
      status: "Selesai",
    },
    {
      id: 3,
      tanggal: "2025-10-29",
      nama: "Langganan Internet",
      penanggungJawab: "Bu Sinta",
      kategori: "Pemeliharaan",
      subKategori: "Internet",
      jumlah: 450000,
      status: "Proses",
    },
  ];

  const finalData = data ?? fallbackData;

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <h2 className="text-base font-semibold mb-4 text-gray-800">
        Data {title}
      </h2>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-[13px] text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left font-medium">
              <th className="py-2 px-2 text-center w-[3%]">No</th>
              <th className="py-2 px-2 w-[10%]">Tanggal</th>
              <th className="py-2 px-2 w-[12%]">Nama</th>
              <th className="py-2 px-2 w-[12%]">Penanggung Jawab</th>
              <th className="py-2 px-2 w-[10%]">Kategori</th>
              <th className="py-2 px-2 w-[12%]">Sub Kategori</th>
              <th className="py-2 px-2 w-[10%] text-right">Jumlah (Rp)</th>
              <th className="py-2 px-2 w-[8%] text-center">Status</th>
              <th className="py-2 px-2 w-[15%] text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {finalData.map((item : any, index : any) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-all">
                <td className="py-2 px-2 text-center">{index + 1}</td>
                <td className="py-2 px-2">{item.tanggal}</td>
                <td className="py-2 px-2 font-medium">{item.nama}</td>
                <td className="py-2 px-2">{item.penanggungJawab}</td>
                <td className="py-2 px-2">{item.kategori}</td>
                <td className="py-2 px-2">{item.subKategori}</td>
                <td className="py-2 px-2 text-right">
                  Rp {item.jumlah.toLocaleString("id-ID")}
                </td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`inline-block px-3 py-0.5 text-[11px] rounded-full font-semibold ${
                      item.status === "Selesai"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex justify-center items-center gap-2">
                    <button className="p-1.5 border rounded-md hover:scale-105 transition">
                      <Pencil size={14} className="text-blue-600" />
                    </button>
                    <button className="p-1.5 border rounded-md hover:scale-105 transition">
                      <Eye size={14} className="text-green-600" />
                    </button>
                    <button className="p-1.5 border rounded-md hover:scale-105 transition">
                      <Download size={14} className="text-orange-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden flex flex-col gap-4">
        {finalData.map((item :any) => (
          <div key={item.id} className="border p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{item.nama}</h3>
              <span
                className={`px-2 py-1 text-[11px] rounded-full ${
                  item.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p><b>Tanggal:</b> {item.tanggal}</p>
              <p><b>Penanggung Jawab:</b> {item.penanggungJawab}</p>
              <p><b>Kategori:</b> {item.kategori}</p>
              <p><b>Sub Kategori:</b> {item.subKategori}</p>
              <p><b>Jumlah:</b> Rp {item.jumlah.toLocaleString("id-ID")}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-3">
              <button className="p-2 border rounded-md">
                <Pencil size={16} className="text-blue-600" />
              </button>
              <button className="p-2 border rounded-md">
                <Eye size={16} className="text-green-600" />
              </button>
              <button className="p-2 border rounded-md">
                <Download size={16} className="text-orange-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
