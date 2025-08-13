// app/jenis-pengeluaran/page.tsx
"use client";

import { useState } from "react";

interface Entry {
  jenis: string;
  anggaran: number;
}

export default function JenisPengeluaranPage() {
  const [entries, setEntries] = useState<Entry[]>([
    { jenis: "Listrik", anggaran: 3231000000 },
    { jenis: "Muhharom", anggaran: 3231000000 },
    { jenis: "HSN", anggaran: 3231000000 },
    { jenis: "Akhirusannah", anggaran: 3231000000 },
    { jenis: "Ulangan", anggaran: 3231000000 },
  ]);

  const total = entries.reduce((sum, e) => sum + e.anggaran, 0);

  const handleAdd = () => {
    setEntries([...entries, { jenis: "", anggaran: 0 }]);
  };

  const handleChange = (index: number, field: keyof Entry, value: string) => {
    const newEntries = [...entries];
    if (field === "anggaran") {
      newEntries[index][field] = Number(value.replace(/\D/g, ""));
    } else {
      newEntries[index][field] = value;
    }
    setEntries(newEntries);
  };

  const formatRupiah = (num: number) =>
    num.toLocaleString("id-ID");

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              💰
            </div>
            <h1 className="text-2xl font-bold">Jenis Pengeluaran</h1>
          </div>
          <button className="px-5 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition">
            Simpan
          </button>
        </div>

        {/* Info */}
        <div className="px-6 py-4 text-sm text-gray-600 bg-gray-50 border-b">
          Ubah atau tambahkan entri ke daftar ini. Cukup ketik entri yang ada atau tambahkan entri baru di bawah. Jangan lupa klik <b>Simpan</b>!
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-green-50">
                <th className="p-3 text-left text-gray-700 border-b">Jenis Pengeluaran</th>
                <th className="p-3 text-right text-gray-700 border-b">Anggaran Setahun</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-3 border-b">
                    <input
                      type="text"
                      value={entry.jenis}
                      onChange={(e) => handleChange(index, "jenis", e.target.value)}
                      className="w-full border-b border-transparent focus:border-green-500 outline-none bg-transparent"
                    />
                  </td>
                  <td className="p-3 border-b text-right">
                    <input
                      type="text"
                      value={formatRupiah(entry.anggaran)}
                      onChange={(e) => handleChange(index, "anggaran", e.target.value)}
                      className="w-full border-b border-transparent focus:border-green-500 outline-none bg-transparent text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t space-y-3">
          <button
            onClick={handleAdd}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Tambah Entri
          </button>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Jumlah</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
