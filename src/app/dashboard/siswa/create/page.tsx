"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

const TambahSiswa = () => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    noInduk: "",
    jenisKelamin: "",
    tanggalLahir: "",
    angkatan: "",
    jurusan: "",
    noTelp: "",
    asrama: "",
    status: "",
    spp: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Data siswa disubmit:", formData);
    // Tambahkan logic simpan ke backend/API di sini
  };

  return (
    <section className="w-full bg-white rounded-xl h-full p-8 text-2xl flex flex-col gap-9">
      <h1 className="font-semibold text-2xl">Tambah Siswa</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Nama Siswa</label>
            <Input
              type="text"
              value={formData.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Alamat</label>
            <Input
              type="text"
              value={formData.alamat}
              onChange={(e) => handleChange("alamat", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">No Induk</label>
            <Input
              type="text"
              value={formData.noInduk}
              onChange={(e) => handleChange("noInduk", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <Input
              type="text"
              value={formData.jenisKelamin}
              onChange={(e) => handleChange("jenisKelamin", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <div className="relative mt-1">
              <Input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                className="w-full pr-10 border-slate-300"
              />
              <CalendarDays
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Angkatan</label>
            <Input
              type="text"
              value={formData.angkatan}
              onChange={(e) => handleChange("angkatan", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">Jurusan</label>
            <Input
              type="text"
              value={formData.jurusan}
              onChange={(e) => handleChange("jurusan", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">No Telp</label>
            <Input
              type="text"
              value={formData.noTelp}
              onChange={(e) => handleChange("noTelp", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
        </div>

        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">Asrama</label>
            <Input
              type="text"
              value={formData.asrama}
              onChange={(e) => handleChange("asrama", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Status</label>
            <Input
              type="text"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border-slate-300"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="text-sm font-medium">SPP</label>
          <Input
            type="number"
            value={formData.spp}
            onChange={(e) => handleChange("spp", e.target.value)}
            className="w-full border-slate-300"
          />
        </div>
      </div>

      <div className="flex flex-row gap-5 justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200"
        >
          Tambah
        </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors duration-200">
          Batal
        </Button>
      </div>
    </section>
  );
};

export default TambahSiswa;
