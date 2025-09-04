"use client";

import React, { useState } from "react";
import Image from "next/image";

const ProfileSekolah = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "edit">("overview");

  return (
    <section className="w-full h-[89vh] bg-white rounded-3xl flex flex-col overflow-hidden mb-6">
      {/* Banner */}
      <div className="w-full h-1/3 bg-[url('/backgrounds/bg-profile.jpeg')] bg-cover relative">
      
      </div>

      {/* Konten */}
      <div className="w-full h-2/3 px-10 py-6 flex gap-10">
        {/* Kolom Kiri */}
        <div className="w-1/3 h-[65vh] bg-gray-50 relative bottom-30 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center p-6">
          {/* Foto Profil */}
          <div className="rounded-full w-30 h-30 flex justify-center items-center">
            <Image
              src="/img/Logo-SMK-MQ.png"
              alt="Logo"
              width={120}
              height={120}
            />
          </div>

          {/* Nama Kepala Sekolah */}
          <div className="w-full flex flex-col items-center gap-1 mt-4">
            <p className="text-xl font-semibold">Andri Kusmayadi</p>
            <p className="font-light text-gray-500">Kepala Sekolah</p>
          </div>

          <div className="w-full text-center mt-4 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">Yayasan</p>
            <p className="font-medium">Pesantren Modern Wisata Al-Islam</p>
          </div>

          <button className="w-full bg-green-600 text-white font-semibold mt-4 py-2 rounded-lg hover:bg-green-700 transition">
            Ubah Yayasan
          </button>

          <div className="w-full flex items-center mt-4 bg-gray-100 rounded-lg overflow-hidden">
            <input
              type="text"
              value="https://smkmadinatulquran.sch.id"
              className="w-full bg-transparent px-2 py-2 text-sm"
              readOnly
            />
            <button className="bg-green-600 text-white px-3 text-sm">
              Salin
            </button>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="w-3/4 h-[460px] bg-gray-50 relative bottom-30 rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">
          {/* Tab Button */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full py-3 font-medium transition rounded-lg ${
                activeTab === "overview"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`w-full py-3 font-medium transition rounded-lg ${
                activeTab === "edit"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Ubah Data Profil
            </button>
          </div>

          {/* Konten berdasarkan Tab */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Telepon :</label>
                <input
                  type="text"
                  defaultValue="08129900457"
                  className="w-full border rounded-lg px-3 py-2"
                  readOnly={activeTab === "overview"}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email :</label>
                <input
                  type="email"
                  defaultValue="lapuang@gmail.com"
                  className="w-full border rounded-lg px-3 py-2"
                  readOnly={activeTab === "overview"}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Kepala Sekolah :</label>
                <input
                  type="text"
                  defaultValue="Pak Andri"
                  className="w-full border rounded-lg px-3 py-2"
                  readOnly={activeTab === "overview"}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">NIP :</label>
                <input
                  type="text"
                  defaultValue="-"
                  className="w-full border rounded-lg px-3 py-2"
                  readOnly={activeTab === "overview"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Alamat :</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                defaultValue="kp.kebon kalapa RT 002 RW 001 Ds. singasari Kec. Jonggol , Kab. Bogor"
                readOnly={activeTab === "overview"}
              />
            </div>

            {/* Tombol Simpan hanya muncul saat Edit */}
            {activeTab === "edit" && (
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition">
                  Simpan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSekolah;
