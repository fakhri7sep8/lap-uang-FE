"use client"

import React, { useState } from "react"
import Swal from "sweetalert2"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const InputPembayaranpage = () => {
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = () => {
    // contoh: bisa jalankan logika download di sini
    setIsDownloaded(true)
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "File berhasil di-download",
      confirmButtonColor: "#3085d6",
    })
  }

  const handleTambah = () => {
    if (!isDownloaded) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Silakan download dulu sebelum menambah data!",
        confirmButtonColor: "#3085d6",
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Data Ditambahkan",
      text: "Data berhasil ditambahkan!",
      confirmButtonColor: "#3085d6",
    })
  }

  return (
    <div className="w-full flex justify-center items-center p-6">
      <section className="w-full bg-white rounded-md shadow-md p-6 ">
        <div className="flex flex-col gap-6">
          <h1 className="font-semibold text-2xl">Input Pembayaran</h1>

          <div className="flex flex-row gap-6">
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium mb-1">nama siswa</label>
              <input
                type="text"
                defaultValue="Daffa hafidzh firdaus"
                className="w-full border rounded-md p-2 border-slate-300"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium mb-1">No Induk</label>
              <input
                type="text"
                defaultValue="2025A10934"
                className="w-full border rounded-md p-2 border-slate-300"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Kategori Pembayaran</label>
            <Select defaultValue="spp">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 border-slate-300">
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  <SelectItem value="spp">Spp</SelectItem>
                  <SelectItem value="gedung">Praktikum</SelectItem>
                  <SelectItem value="seragam">Kegiatan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nominal / Cicilan</label>
            <div className="w-full border rounded-md p-4 border-slate-300">
              <p className="font-semibold text-lg">RP.2.500.000,00</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Download
            </button>
            <div className="flex gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button
                onClick={handleTambah}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InputPembayaranpage
