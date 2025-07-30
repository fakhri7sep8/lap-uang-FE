"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface RowData {
  name: string;
  amount: number;
}

const initialData: RowData[] = [
  { name: "Listrik", amount: 3231000000 },
  { name: "Muhharom", amount: 3231000000 },
  { name: "HSN", amount: 3231000000 },
  { name: "Akhirusannah", amount: 3231000000 },
  { name: "Ulangan", amount: 3231000000 },
];

export default function JenisPengeluaranPage() {
  const [rows, setRows] = useState<RowData[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ name: "", amount: "" });
  const [errors, setErrors] = useState({ name: "", amount: "" });

  const handleConfirmAdd = () => {
    const errs = {
      name: newEntry.name.trim() === "" ? "Wajib diisi" : "",
      amount: newEntry.amount.trim() === "" ? "Wajib diisi" : "",
    };
    setErrors(errs);
    if (errs.name || errs.amount) return;

    setRows([
      ...rows,
      {
        name: newEntry.name,
        amount: parseInt(newEntry.amount.replace(/\D/g, "")) || 0,
      },
    ]);
    setNewEntry({ name: "", amount: "" });
    setShowModal(false);
  };

  const updateRow = (index: number, key: keyof RowData, value: string) => {
    const updated = [...rows];
    if (key === "amount") {
      const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
      updated[index][key] = numeric;
    } else {
      updated[index][key] = value as any;
    }
    setRows(updated);
  };

  const deleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const handleDeleteConfirm = (index: number) => {
    Swal.fire({
      title: "Yakin hapus entri ini?",
      text: "Data akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRow(index);
        Swal.fire("Dihapus!", "Entri berhasil dihapus.", "success");
      }
    });
  };

  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="relative min-h-screen p-6 space-y-6 bg-gray-50">
      <div
        className={`transition-all duration-500 ease-in-out ${
          showModal ? "blur-sm scale-[0.98] opacity-70" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Jenis Pengeluaran</h1>
          <button className="border border-green-600 text-green-700 hover:bg-green-50 rounded-lg px-5 py-2">
            Simpan
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-2">
          Ubah atau tambahkan entri ke daftar ini. Jangan lupa klik <strong>Simpan</strong> sebelum melanjutkan.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full mt-4 border rounded-xl overflow-hidden bg-white">
            <thead className="bg-gray-100 text-sm text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 border-b">Jenis Pengeluaran</th>
                <th className="px-4 py-3 border-b text-right">Anggaran Setahun</th>
                <th className="px-4 py-3 border-b text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateRow(i, "name", e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-gray-800"
                      placeholder="Tulis nama pengeluaran"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      value={row.amount.toLocaleString("id-ID")}
                      onChange={(e) => updateRow(i, "amount", e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-gray-800 text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteConfirm(i)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Hapus entri"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium shadow-md mt-2 mb-4"
        >
          Tambah Entri
        </button>

        <div className="flex justify-between items-center border-t pt-4 text-lg font-semibold text-gray-800">
          <span>Jumlah</span>
          <span>{total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Pengeluaran</h2>
            <div className="space-y-2">
              <input
                placeholder="Jenis Pengeluaran"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <input
                placeholder="Anggaran Tahunan"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>
            <button
              onClick={handleConfirmAdd}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            >
              Tambah
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
