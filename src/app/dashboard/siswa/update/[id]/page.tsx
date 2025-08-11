"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siswa } from "@/data/siswa";
import { CalendarDays } from "lucide-react";

const UpdateSiswa = () => {
  const { id } = useParams();
  const [dataSiswa, setDataSiswa] = useState<any>(null);

  useEffect(() => {
    const found = siswa.find((s) => s.id.toString() === id);
    setDataSiswa(found);
  }, [id]);

  if (!dataSiswa) return <div className="p-10">Siswa tidak ditemukan</div>;

  return (
    <section className="w-full bg-white rounded-xl h-full p-8  text-2xl flex flex-col gap-9">
      <h1 className="font-semibold text-2xl">Update Siswa</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Nama Siswa</label>
            <Input
              type="text"
              defaultValue={dataSiswa.nama}
              className="w-full border-slate-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Alamat</label>
            <Input
              type="text"
              defaultValue={dataSiswa.alamat}
              className="w-full border-slate-300"
            />
          </div>
        </div>
        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">No Induk</label>
            <Input
              type="text"
              defaultValue={dataSiswa.noRegistrasi}
              className="w-full border-slate-300"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <Input
              type="text"
              defaultValue={dataSiswa.jenisKelamin}
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
                defaultValue={dataSiswa.tanggalLahir}
                className="w-full pr-10 border-slate-300"
              />
              <CalendarDays
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">Tanggal Daftar</label>
            <Input
              type="text"
              value={dataSiswa.dibuat}
              className="w-full border-slate-300"
            />
          </div>
        </div>
        <div className="flex flex-row gap-6 w-full">
          <div className="w-1/2">
            <label className="text-sm font-medium">Jurusan</label>
            <Input
              type="text"
              defaultValue={dataSiswa.jurusan}
              className="w-full  border-slate-300"
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm font-medium">No Telp</label>
            <Input
              type="text"
              defaultValue={dataSiswa.noTelp}
              className="w-full border-slate-300"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-5 justify-end">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200">
  Simpan
</Button>
<Button className="bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors duration-200">
  Batal
</Button>

      </div>
    </section>
  );
};

export default UpdateSiswa;
