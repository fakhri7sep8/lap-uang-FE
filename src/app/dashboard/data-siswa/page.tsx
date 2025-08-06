"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Poppins } from "next/font/google";
import * as XLSX from "xlsx";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface StudentData {
  date: string;
  transactionNumber: string;
  studentId: string;
  studentName: string;
  spp: number;
  uangMasuk: number;
  daftarUlang: number;
  muharram: number;
  hsn?: number;
  haul?: number;
  maulid?: number;
  rajab?: number;
  ulangan?: number;
}

const initialData: StudentData[] = [
  {
    date: "20/4/2025",
    transactionNumber: "2001",
    studentId: "2025B10934",
    studentName: "Lap uang",
    spp: 50000,
    uangMasuk: 50000,
    daftarUlang: 50000,
    muharram: 50000,
  },
];

export default function DataSiswaPage() {
  const [data] = useState<StudentData[]>([...Array(58)].map(() => initialData[0]));
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchId, searchName]);

  const filteredData = data.filter((item) => {
    return (
      item.studentId.toLowerCase().includes(searchId.toLowerCase()) &&
      item.studentName.toLowerCase().includes(searchName.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReset = () => {
    setSearchId("");
    setSearchName("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");
    XLSX.writeFile(workbook, "data_siswa.xlsx");
  };

  const totalAll = filteredData.reduce(
    (sum, item) =>
      sum +
      item.spp +
      item.uangMasuk +
      item.daftarUlang +
      item.muharram +
      (item.hsn || 0) +
      (item.haul || 0) +
      (item.maulid || 0) +
      (item.rajab || 0) +
      (item.ulangan || 0),
    0
  );

  return (
    <div className={`min-h-screen px-6 py-8 bg-white ${poppins.variable} font-poppins`}>
      {/* Header */}
      <div className="mb-10 p-6 bg-gray-100 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Siswa</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-600">No Induk</label>
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Masukkan No Induk"
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm text-gray-600">Nama Siswa</label>
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Masukkan Nama Siswa"
              className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-3 font-medium shadow"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="bg-green-600 text-white rounded-xl px-8 py-6 shadow-md w-full md:w-64 text-center">
            <div className="text-lg font-medium">Total Data</div>
            <div className="text-3xl font-bold mb-2">{filteredData.length}</div>
            <div className="text-lg font-medium">Hasil</div>
            <div className="text-3xl font-bold">{filteredData.length}</div>
          </div>
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">No Transaksi</th>
              <th className="px-4 py-3 text-left">No Induk</th>
              <th className="px-4 py-3 text-left">Nama Siswa</th>
              <th className="px-4 py-3 text-right">SPP</th>
              <th className="px-4 py-3 text-right">Uang Masuk</th>
              <th className="px-4 py-3 text-right">Daftar Ulang</th>
              <th className="px-4 py-3 text-right">Muharram</th>
              <th className="px-4 py-3 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.map((item, index) => {
              const total =
                item.spp +
                item.uangMasuk +
                item.daftarUlang +
                item.muharram +
                (item.hsn || 0) +
                (item.haul || 0) +
                (item.maulid || 0) +
                (item.rajab || 0) +
                (item.ulangan || 0);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.transactionNumber}</td>
                  <td className="px-4 py-2">{item.studentId}</td>
                  <td className="px-4 py-2">{item.studentName}</td>
                  <td className="px-4 py-2 text-right">{item.spp.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2 text-right">{item.uangMasuk.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2 text-right">{item.daftarUlang.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2 text-right">{item.muharram.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2 text-right font-semibold">{total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Total dan Pagination */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="bg-white flex gap-1.5 border rounded-xl px-6 py-3 shadow text-right w-full md:w-auto">
          <strong>Jumlah:</strong> {totalAll.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
        </div>
        <div className="flex items-center space-x-2 border border-green-500 rounded-full px-4 py-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="text-green-700 hover:text-green-900"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="text-green-700 hover:text-green-900"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
