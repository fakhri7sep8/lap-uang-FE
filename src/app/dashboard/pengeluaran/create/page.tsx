"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const jenisPengeluaranList = [
  "Biaya Operasional",
  "Gaji Pegawai",
  "Biaya Pendidikan",
  "Biaya Perawatan",
  "Biaya Liburan",
  "Haol",
  "HSN",
  "Muhharom",
  "Taffarom",
  "Ulangan",
];

const sumberDanaList = ["Kas Sekolah", "Donatur", "Dana BOS", "Lainnya"];

const statusList = ["Normal", "Instalasi"];

const TambahPengeluaran = () => {
  const [formData, setFormData] = useState({
    tanggal: "",
    jenisPengeluaran: "",
    deskripsi: "",
    amount: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Data pengeluaran disubmit:", formData);
    // Tambahkan logic simpan ke backend/API di sini
  };

  return (
    <section className="w-full bg-white rounded-xl h-full p-8 text-2xl flex flex-col gap-9">
      <h1 className="font-semibold text-2xl">Tambah Pengeluaran</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">Tanggal Pengeluaran</label>
            <div className="relative mt-1">
              <Input
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleChange("tanggal", e.target.value)}
                className="w-full pr-10 border-slate-300"
              />
              <CalendarDays
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Jenis Pengeluaran</label>
            <select
              value={formData.jenisPengeluaran}
              onChange={(e) => handleChange("jenisPengeluaran", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-base"
            >
              <option value="">Pilih Jenis Pengeluaran</option>
              {jenisPengeluaranList.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <label className="text-sm font-medium">Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-base resize-none h-24"
              placeholder="Tambahkan deskripsi pengeluaran (opsional)"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium">Jumlah</label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="w-1/2 h-[120%] border-slate-300 text-2xl"
              placeholder="Masukkan jumlah pengeluaran"
			  txtSize="text-base"
            />
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={handleSubmit}
            className="w-1/4 bg-blue-600 text-white rounded-lg px-4 py-2"
          >
            Simpan Pengeluaran
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TambahPengeluaran;
