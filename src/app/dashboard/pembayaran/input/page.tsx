"use client"

import React from "react"
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
  return (
    <div className="w-full flex justify-center items-center p-6">
      <section className="w-full  bg-white rounded-md shadow-md p-6 border border-blue-400">
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

          <div className="flex justify-end gap-4 mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md">
              Remove
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Tambah
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InputPembayaranpage
