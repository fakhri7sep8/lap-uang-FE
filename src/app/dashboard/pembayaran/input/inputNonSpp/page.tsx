"use client";

import React, { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useStudentModule } from "@/hooks/useStudentModule";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { usePaymentHistoryModule } from "@/hooks/usePaymentHistoryModule";

import { formatRupiah } from "@/lib/format-rupiah";
import { Send, FileDown, ArrowRightCircle } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const InputNonSPP = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [selectIDCategory, setIDCategory] = useState<string>();
  const [cicilanNominal, setCicilanNominal] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { useGetStudent } = useStudentModule();
  const { useGetCategory } = useCategoryPaymentModule();
  const { useCreateHistory, useGetAllHistory } = usePaymentHistoryModule();

  const { data: siswaMQ } = useGetStudent();
  const { data: categoryMQ } = useGetCategory();
  const { data: historyMQ } = useGetAllHistory();

  const { mutate: createHistory } = useCreateHistory();
  const router = useRouter();

  // ===========================
  // Ambil data siswa terpilih
  // ===========================
  const siswa = siswaMQ?.find(
    (s: any) => s.name === selectedSiswa || s.InductNumber === selectedSiswa
  );

  // ===========================
  // Ambil kategori dipilih
  // ===========================
  const selectedCategory = categoryMQ?.find(
    (c: any) => c.id === selectIDCategory
  );

  // ===========================
  // Ambil HISTORY by siswa + kategori
  // ===========================
 const studentHistory = historyMQ?.filter(
  (h: any) =>
    h.studentId === siswa?.id &&
    h.type?.id === selectIDCategory // ← FIX DI SINI !!!
);


  const totalDibayar =
    studentHistory?.reduce((acc: number, h: any) => acc + h.amount, 0) || 0;

  // ===========================
  // Handle Cicilan
  // ===========================
  const handleCicilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const nominal = Number(raw || 0);

    const total = selectedCategory?.nominal || 0;
    const sisa = Math.max(total - totalDibayar, 0);

    setCicilanNominal(nominal > sisa ? sisa : nominal);
  };

  // ===========================
  // Status Pembayaran
  // ===========================
  const getStatusPembayaran = () => {
    if (!siswa || !selectIDCategory) return "- Menunggu input -";

    const total = selectedCategory?.nominal || 0;

    if (totalDibayar >= total) return "LUNAS";
    if (totalDibayar > 0) return "BELUM LUNAS";

    return "BELUM BAYAR";
  };

  const isAllLunas = getStatusPembayaran() === "LUNAS";

  // ===========================
  // Handle Submit
  // ===========================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswa || !selectIDCategory || !selectedCategory) return;

    setIsSubmitting(true);

    const payloadBase = {
      studentId: siswa.id,
      date: new Date().toISOString(),
      method: "NORMAL",
      year: new Date().getFullYear(),
      typeId: selectIDCategory,
      status: "LUNAS",
    };

    const afterSave = () => {
      setIsSubmitting(false);
      router.refresh();
    };

    if (selectedCategory.type === "NORMAL") {
      createHistory(
        { ...payloadBase, amount: selectedCategory.nominal },
        { onSettled: afterSave }
      );
    }

    if (selectedCategory.type === "INSTALLMENT") {
      createHistory(
        { ...payloadBase, amount: cicilanNominal },
        { onSettled: afterSave }
      );
    }
  };

  // ===========================
  // Nominal tampil
  // ===========================
  const totalNominal =
    selectedCategory?.type === "INSTALLMENT"
      ? (selectedCategory?.nominal || 0) - totalDibayar
      : selectedCategory?.nominal || 0;

  // ===========================
  // Drawer action (dummy)
  // ===========================
  const downloadTemplate = () =>
    Swal.fire("Download Template", "Template akan diunduh.", "info");

  const handleImportClick = () =>
    Swal.fire("Impor Excel", "Fitur impor Excel menyusul.", "info");

  // ============================================================
  // ======================= UI =================================
  // ============================================================
  return (
    <div className="w-full flex flex-col justify-center items-center p-8">
      {/* MENU Atas */}
      <div className="flex flex-row gap-6 mb-8 w-full">
        <div
          onClick={() => router.push("/dashboard/pembayaran/input/inputSPP")}
          className="flex-1 py-4 flex items-center justify-center gap-2 border border-orange-500 text-orange-500 text-lg rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white transition"
        >
          <ArrowRightCircle size={24} />
          Input Pembayaran SPP
        </div>

        <div
          onClick={() => router.push("/dashboard/pembayaran/input/inputNonSpp")}
          className="flex-1 py-4 flex items-center justify-center gap-2 bg-orange-500 text-white border border-orange-500 text-lg rounded-xl cursor-pointer hover:bg-white hover:text-orange-500 transition"
        >
          <ArrowRightCircle size={24} />
          Input Pembayaran Non SPP
        </div>
      </div>

      {/* FORM */}
      <section className="w-full bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="font-semibold text-2xl">Input Pembayaran Non-SPP</h1>

          {/* Siswa */}
          <div className="flex gap-6">
            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium mb-1">Nama Siswa</label>
              <Combobox
                label="Nama Siswa"
                options={siswaMQ?.map((s: any) => ({
                  label: s.name,
                  value: s.name,
                }))}
                value={siswa?.name}
                onChange={setSelectedSiswa}
                placeholder="Pilih siswa"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label className="text-sm font-medium mb-1">No Induk</label>
              <Combobox
                label="No Induk"
                options={siswaMQ?.map((s: any) => ({
                  label: s.InductNumber,
                  value: s.name,
                }))}
                value={siswa?.InductNumber}
                onChange={setSelectedSiswa}
                placeholder="Pilih siswa"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Kategori Pembayaran
            </label>
            <Select
              value={selectIDCategory || ""}
              onValueChange={setIDCategory}
            >
              <SelectTrigger className="w-full py-4">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 border-slate-300">
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {categoryMQ
                    ?.filter((c: any) =>
                      siswa ? c.students.some((s: any) => s.id === siswa.id) : true
                    )
                    .map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* TABEL History */}
          {selectedCategory?.type === "INSTALLMENT" &&
            studentHistory?.length > 0 && (
              <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white mt-4">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-center font-semibold">No</TableHead>
                      <TableHead className="text-center font-semibold">Nama Siswa</TableHead>
                      <TableHead className="text-center font-semibold">Kategori</TableHead>
                      <TableHead className="text-center font-semibold">Nominal Dibayar</TableHead>
                      <TableHead className="text-center font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {studentHistory.map((item: any, i: number) => {
                      const totalSoFar = studentHistory
                        .slice(0, i + 1)
                        .reduce((acc: number, h: any) => acc + h.amount, 0);

                      const status =
                        totalSoFar >= (selectedCategory?.nominal || 0)
                          ? "LUNAS"
                          : "BELUM LUNAS";

                      return (
                        <TableRow key={i} className="hover:bg-slate-50">
                          <TableCell className="text-center">{i + 1}</TableCell>
                          <TableCell className="text-center">{siswa?.name}</TableCell>
                          <TableCell className="text-center">
                            {selectedCategory?.name}
                          </TableCell>
                          <TableCell className="text-center">
                            Rp. {item.amount.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-center">{status}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

          {/* Input Cicilan */}
          {selectedCategory?.type === "INSTALLMENT" && (
            <input
              type="text"
              value={cicilanNominal ? formatRupiah(cicilanNominal) : ""}
              onChange={handleCicilanChange}
              placeholder="Masukkan jumlah cicilan"
              className="border-slate-300 border rounded-md px-4 py-2"
            />
          )}

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Status Pembayaran
            </label>
            <div className="w-full border rounded-md p-4 border-slate-300 text-base text-slate-400">
              {getStatusPembayaran()}
            </div>
          </div>

          {/* Nominal */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nominal</label>
            <div className="w-full border rounded-md p-4 border-slate-300 text-base text-slate-400">
              {siswa && selectedCategory
                ? `Rp. ${totalNominal.toLocaleString("id-ID")}`
                : "- Pilih siswa & kategori -"}
            </div>
          </div>

          {/* Button Action */}
          <div className="flex flex-col items-end gap-4 mt-4">
            <button
              type="submit"
              disabled={
                isSubmitting || isAllLunas || !siswa || !selectIDCategory
              }
              className={`w-full py-5 flex items-center justify-center gap-2 text-lg rounded-xl border transition-all ${
                isSubmitting || isAllLunas
                  ? "cursor-not-allowed bg-gray-200 text-gray-600 border-gray-300"
                  : "cursor-pointer border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              }`}
            >
              <Send size={24} />
              {isSubmitting
                ? "Proses menyimpan data siswa..."
                : isAllLunas
                ? "Semua sudah lunas"
                : "Simpan"}
            </button>

            <button
              type="button"
              onClick={downloadTemplate}
              className="w-full py-5 flex items-center justify-center gap-2 text-lg rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
            >
              <FileDown size={24} />
              Download format excel
            </button>

            <button
              type="button"
              onClick={handleImportClick}
              className="w-full py-5 flex items-center justify-center gap-2 text-lg rounded-xl border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition"
            >
              <FileDown size={24} />
              Impor dari Excel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default InputNonSPP;
