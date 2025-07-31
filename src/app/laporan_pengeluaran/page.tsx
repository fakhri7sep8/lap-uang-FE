"use client";
import Image from "next/image";
import React, { useState } from "react";

const LaporanKeuangan = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>("Juli");
  const [selectedJenis, setSelectedJenis] = useState<string | null>("");

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const jenisPengeluaran = [
    "Listrik",
    "Qurban",
    "HSN",
    "Haol",
    "Maulid",
    "Rajab",
    "Ulangan",
    "Taffarom",
    "Muharrom",
  ];

  const handleSelectMonth = (month: string) => setSelectedMonth(month);
  const handleSelectJenis = (jenis: string) => setSelectedJenis(jenis);
  const resetMonth = () => setSelectedMonth(null);
  const resetJenis = () => setSelectedJenis(null);

  const dataLaporan = [
    {
      bulan: "Juli",
      tanggal: "7/21/2021",
      jenis: "Haol",
      keterangan: "Setoran santri lama ke THJ",
      jumlah: "RP. 4.993.000",
    },
    {
      bulan: "Juli",
      tanggal: "7/21/2021",
      jenis: "HSN",
      keterangan: "Setoran santri lama ke THJ",
      jumlah: "RP. 4.993.000",
    },
    {
      bulan: "Juli",
      tanggal: "7/21/2021",
      jenis: "Muharrom",
      keterangan: "Setoran santri lama ke THJ",
      jumlah: "RP. 4.993.000",
    },
    {
      bulan: "Juli",
      tanggal: "7/21/2021",
      jenis: "Taffarom",
      keterangan: "Setoran santri lama ke THJ",
      jumlah: "RP. 4.993.000",
    },
    {
      bulan: "Juli",
      tanggal: "7/21/2021",
      jenis: "Ulangan",
      keterangan: "Setoran santri lama ke THJ",
      jumlah: "RP. 4.993.000",
    },
  ];

  return (
    <div className=" flex flex-col gap-10 px-9 py-9 w-full ">
      <section className="flex justify-between items-center flex-row px-9">
        <div className="flex gap-6 flex-row">
          <div className="flex items-center justify-center py-2 w-32 font-medium bg-white border border-[#2F956E] text-[#2F956E] rounded-lg transition duration-200 hover:bg-[#2F956E] hover:text-white cursor-pointer">
            <p>Export Exel</p>
          </div>
          <div className="flex items-center justify-center py-2 w-32 font-medium bg-[#2F956E] text-white border border-[#2F956E] rounded-lg transition duration-200 hover:bg-white hover:text-[#2F956E] cursor-pointer">
            <p>Export Pdf</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center py-2 w-32 font-medium bg-[#2F956E] text-white border border-[#2F956E] rounded-lg transition duration-200 hover:bg-white hover:text-[#2F956E] cursor-pointer">
            <p>Cetak Pdf</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-6  px-9">
        <div className="bg-white rounded-xl p-4 shadow w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter Bulan</h2>
            <button
              onClick={resetMonth}
              className="bg-[#2F956E] text-white px-4 py-1 rounded-md text-sm font-medium"
            >
              Reset filter
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => handleSelectMonth(month)}
                className={`py-2 rounded-md font-medium ${
                  selectedMonth === month
                    ? "bg-[#D1E7DD] text-[#2F956E]"
                    : "bg-[#2F956E] text-white"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter Jenis pengeluaran</h2>
            <button
              onClick={resetJenis}
              className="bg-[#2F956E] text-white px-4 py-1 rounded-md text-sm font-medium"
            >
              Reset filter
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {jenisPengeluaran.map((jenis) => (
              <button
                key={jenis}
                onClick={() => handleSelectJenis(jenis)}
                className={`py-2 rounded-md font-medium ${
                  selectedJenis === jenis
                    ? "bg-[#D1E7DD] text-[#2F956E]"
                    : "bg-[#2F956E] text-white"
                }`}
              >
                {jenis}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className=" px-9">
        <div className="flex justify-between items-center bg-white p-10 rounded-lg shadow-md">
          <Image src="/img/Logo.png" alt="Logo" width={200} height={200} />
          <h2 className="text-3xl font-semibold">Laporan Pengeluaran</h2>
          <Image src="/img/uang.png" alt="Logo" width={100} height={100} />
        </div>
      </section>

      <section className="px-9">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-gray-500 border-b border-dotted">
              <tr>
                <th className="px-6 py-3">Bulan</th>
                <th className="px-6 py-3">Tanggal Bayar</th>
                <th className="px-6 py-3">Jenis pengeluaran</th>
                <th className="px-6 py-3">Keterangan</th>
                <th className="px-6 py-3 text-right">Jumlah Bayar</th>
              </tr>
            </thead>
            <tbody>
              {dataLaporan.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{item.bulan}</td>
                  <td className="px-6 py-4">{item.tanggal}</td>
                  <td className="px-6 py-4">{item.jenis}</td>
                  <td className="px-6 py-4">{item.keterangan}</td>
                  <td className="px-6 py-4 text-right">{item.jumlah}</td>
                </tr>
              ))}
              {dataLaporan.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LaporanKeuangan;
