"use client";

import React, { useState, useEffect } from "react";
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
import { usePaymentModule } from "@/hooks/use-payment";
import { formatRupiah } from "@/lib/format-rupiah";
import { Send, FileDown, ArrowRight, ArrowRightCircle } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

const InputNonSPP = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectIDCateogry, setIDCategory] = useState<string>();
  const [cicilanNominal, setCicilanNominal] = useState<number>(0);

  const { useGetStudent } = useStudentModule();
  const { useGetCategory, useDetailCategory } = useCategoryPaymentModule();
  const { useCreatePayment, useUpdatePayment, useGetPaymentsByCNS } =
    usePaymentModule();

  const { data: siswaMQ } = useGetStudent();
  const { data: categoryMQ } = useGetCategory();
  const siswa = siswaMQ?.find(
    (s: any) => s.name === selectedSiswa || s.InductNumber === selectedSiswa
  );

  const { data: detailCategoryMQ, isLoading: isLoadingDetail } =
    useDetailCategory(selectIDCateogry);
  const { data: existingPayment, isLoading: isLoadingPayment } =
    useGetPaymentsByCNS(siswa?.id || "", selectIDCateogry || "");

  const isLoadingState = isLoadingDetail || isLoadingPayment;

  const { mutate: createPayments, isPending: isPendingCreate } =
    useCreatePayment();
  const { mutate: updatePayments, isPending: isPendingUpdate } =
    useUpdatePayment();

  const isSubmitting = isPendingCreate || isPendingUpdate;

  // Cicilan input
  const handleCicilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const inputNominal = Number(raw || 0);
    const sudahDibayar =
      existingPayment?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
    const totalTagihan = detailCategoryMQ?.data?.nominal || 0;
    const sisaTagihan = Math.max(totalTagihan - sudahDibayar, 0);
    setCicilanNominal(inputNominal > sisaTagihan ? sisaTagihan : inputNominal);
  };

  // Submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!siswa) return;

    const paymentsDTO = {
      studentId: siswa.id,
      date: new Date().toISOString(),
      method: "NORMAL",
      year: new Date().getFullYear(),
      typeId: selectIDCateogry || "",
      status: "LUNAS",
    };

    if (detailCategoryMQ?.data?.type === "NORMAL") {
      const payload = {
        ...paymentsDTO,
        amount: detailCategoryMQ?.data?.nominal,
      };
      existingPayment?.length > 0
        ? updatePayments({ id: existingPayment[0].id, payload })
        : createPayments(payload as any);
    }

    if (detailCategoryMQ?.data?.type === "INSTALLMENT") {
      createPayments({ ...paymentsDTO, amount: cicilanNominal } as any);
    }
  };

  const totalNominal =
    detailCategoryMQ?.data?.type === "INSTALLMENT"
      ? (detailCategoryMQ?.data?.nominal || 0) -
        (existingPayment?.reduce((acc: any, p: any) => acc + p.amount, 0) || 0)
      : detailCategoryMQ?.data?.nominal || 0;

  const getStatusPembayaran = () => {
    if (detailCategoryMQ?.data?.type === "INSTALLMENT") {
      const sudahDibayar =
        existingPayment && Array.isArray(existingPayment)
          ? existingPayment.reduce((acc: number, p: any) => acc + p.amount, 0)
          : existingPayment?.amount || 0;
      if (sudahDibayar >= (detailCategoryMQ?.data?.nominal || 0))
        return "LUNAS";
      if (sudahDibayar > 0) return "BELUM LUNAS";
      return "BELUM BAYAR";
    }
    if (detailCategoryMQ?.data?.type === "NORMAL") {
      const payments = Array.isArray(existingPayment)
        ? existingPayment
        : existingPayment
        ? [existingPayment]
        : [];
      if (payments.some((p: any) => p.status === "LUNAS")) return "LUNAS";
      if (payments.length > 0) return "BELUM LUNAS";
      return "BELUM BAYAR";
    }
    return "BELUM BAYAR";
  };

  const isAllLunas = getStatusPembayaran() === "LUNAS";

  // Download template
  const downloadTemplate = () => {
    Swal.fire("Download Template", "Template akan segera diunduh.", "info");
  };

  const handleImportClick = () => {
    Swal.fire(
      "Impor Excel",
      "Fitur impor Excel bisa ditambahkan di sini",
      "info"
    );
  };

  return (
    <div className="w-full flex justify-center items-center p-8">
      <section className="w-full bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="font-semibold text-2xl">Input Pembayaran Non-SPP</h1>

          {/* Nama Siswa & No Induk */}
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
              value={selectIDCateogry || ""}
              onValueChange={(val) => setIDCategory(val)}
            >
              <SelectTrigger className="w-full py-6">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-gray-50 border-slate-300">
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {categoryMQ
                    ?.filter((c: any) =>
                      siswa
                        ? c.students.some((s: any) => s.id === siswa.id)
                        : true
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

          {/* Cicilan */}
          {detailCategoryMQ?.data?.type === "INSTALLMENT" && (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={cicilanNominal ? formatRupiah(cicilanNominal) : ""}
                onChange={handleCicilanChange}
                className="border-slate-300 border rounded-md px-4 py-2"
                placeholder="Masukkan jumlah cicilan"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Status Pembayaran
            </label>
            <div className="w-full border rounded-md p-4 border-slate-300">
              {isLoadingState ? (
                <p className="font-medium text-slate-500">Loading...</p>
              ) : (
                <p className="font-semibold text-lg">{getStatusPembayaran()}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nominal</label>
            <div className="w-full border rounded-md p-4 border-slate-300">
              {isLoadingState ? (
                <p className="font-medium text-slate-500">Loading...</p>
              ) : (
                <p className="font-semibold text-lg">
                  Rp. {totalNominal.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>

          {/* Button Section */}
          <div className="flex flex-col items-end gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting || isAllLunas}
              className={`w-full py-5 border text-lg flex items-center justify-center gap-2 rounded-xl transition-all ${
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
              className="w-full py-5 hover:bg-blue-500 hover:text-white transition-all cursor-pointer border border-blue-500 text-blue-500 text-lg flex items-center justify-center gap-2 rounded-xl"
            >
              <FileDown size={24} />
              Download format excel
            </button>

            <button
              type="button"
              onClick={handleImportClick}
              className="w-full py-5 hover:bg-purple-500 hover:text-white transition-all cursor-pointer border border-purple-500 text-purple-500 text-lg flex items-center justify-center gap-2 rounded-xl"
            >
              <FileDown size={24} />
              Impor dari Excel
            </button>
            <Link
              href="/dashboard/pembayaran/input/inputSPP"
              className="w-full py-5 hover:bg-orange-500 hover:text-white transition-all cursor-pointer border border-orange-500 text-orange-500 text-lg flex items-center justify-center gap-2 rounded-xl"
            >
              <ArrowRightCircle size={24} />
              Input Pembayaran SPP
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default InputNonSPP;
