"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Pencil } from "lucide-react"; // pastikan sudah install lucide-react

const InpusDataSekolah = () => {
  const [selectedImage, setSelectedImage] = useState("/img/MQ.png");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-4">
      <div className="bg-[#2F956E] text-white w-full py-6 px-10 rounded-2xl h-48">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Input Data Sekolah</h2>
            <p className="text-xl font-semibold">Di Sini!</p>
          </div>
          <button className="bg-white text-green-600 px-6 py-2 rounded-full flex items-center gap-2 shadow">
            ✔ Simpan
          </button>
        </div>
      </div>

      <section className="bg-white w-[95%] rounded-xl shadow-md px-6 py-28 relative bottom-20">
        <div className="flex flex-col gap-6">
          {/* Gambar + tombol ubah */}
          <div className="relative flex justify-center">
            <div className="w-48 h-48 relative">
              <Image
                src={selectedImage}
                alt="Logo Sekolah"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <button
              onClick={handleImageClick}
              className="absolute bottom-2 right-[calc(50%-100px)] bg-white p-2 rounded-full shadow"
              title="Ubah Gambar"
            >
              <Pencil className="w-5 h-5 text-gray-700" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <h3 className="text-lg font-bold">Identitas Sekolah</h3>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">Yayasan</label>
            <input
              type="text"
              value="YAYASAN PESANTEN WISATA AL-ISLAM"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">Instansi/Institusi</label>
            <input
              type="text"
              value="SMK MADINATULQURAN"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>

          <div className="flex items-start gap-4">
            <label className="w-1/4 font-medium pt-2">Alamat</label>
            <textarea
              disabled
              value={`kp.kebon kalapa RT 002 /RW 001 Ds. singasari\nKec. Jonggol , Kab. Bogor`}
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center resize-none"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">Telepon</label>
            <input
              type="text"
              value="08129900457"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">Email</label>
            <input
              type="text"
              value="lapuang@gmail.com"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">Kepala Sekolah</label>
            <input
              type="text"
              value="Lap Uang"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 font-medium">NIP</label>
            <input
              type="text"
              value="20112410008"
              disabled
              className="flex-1 bg-gray-100 rounded px-3 py-2 text-center"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InpusDataSekolah;
