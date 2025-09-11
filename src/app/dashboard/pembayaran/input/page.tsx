"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStudentModule } from "@/hooks/useStudentModule";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { useSppPaymentModule } from "@/hooks/use-spp-payment";
import { usePaymentModule } from "@/hooks/use-payment";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRupiah } from "@/lib/format-rupiah";

const bulanList = [
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

const InputPembayaranpage = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("spp");
  const [selectIDCateogry, setIDCategory] = useState<string>("13dd5ec7-3c5b-4afb-b430-1ac1f1745c6d");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [methodPayments, setMethodPayments] = useState<string>("NORMAL");
  const [cicilanNominal, setCicilanNominal] = useState<number>(0);
  const { useGetStudent } = useStudentModule();
  const { data: siswaMQ } = useGetStudent();
  const { useCreateSPPPayment, useGetByStudentID } = useSppPaymentModule();
  const { mutate: createSPPPayment } = useCreateSPPPayment();
  const { data: sppPayments } = useGetByStudentID(
    siswaMQ?.find(
      (s: any) => s?.InductNumber === selectedSiswa || s?.name === selectedSiswa
    )?.id
  );
  const { useCreatePayment, useUpdatePayment, useGetPaymentsByCNS } = usePaymentModule();
  const { mutate: createPayments } = useCreatePayment();
  const { mutate: updatePayments } = useUpdatePayment();
  const { useGetCategory, useDetailCategory } = useCategoryPaymentModule();
  const { data: categoryMQ } = useGetCategory();
  const { data: detailCategoryMQ } = useDetailCategory(selectIDCateogry);

  const siswa = siswaMQ?.find(
    (s: any) => s?.InductNumber === selectedSiswa || s?.name === selectedSiswa
  );
  const handleCicilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value.replace(/\D/g, "");
  const inputNominal = Number(raw || 0);
  const sudahDibayar = existingPayment?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
  const totalTagihan = detailCategoryMQ?.data?.nominal || 0;
  const sisaTagihan = Math.max(totalTagihan - sudahDibayar, 0);
  const finalNominal = inputNominal > sisaTagihan ? sisaTagihan : inputNominal;

  setCicilanNominal(finalNominal);
};

  const { data: existingPayment } = useGetPaymentsByCNS(
    siswa?.id || "",
    selectIDCateogry || ""
  );

  useEffect(() => {
    if (selectedKategori === "spp" && siswa?.id && sppPayments?.spp) {
      const belumLunasBulan = bulanList.find((bulan) => {
        const dataBulan = sppPayments?.spp?.find(
          (s: any) => s.month === bulan && s.studentId === siswa?.id
        );
        return !dataBulan || dataBulan.status !== "LUNAS";
      });

      if (belumLunasBulan) {
        setSelectedMonths([belumLunasBulan]);
      } else {
        setSelectedMonths([]);
      }
    }
  }, [siswa?.id, sppPayments, selectedKategori]);

  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!siswa) return;

    if (selectedKategori === "spp") {
      selectedMonths.forEach((month) => {
        const sppPaymentsDTO = {
          studentId: siswa?.id,
          month,
          year: new Date().getFullYear(),
          nominal: 2500000,
        };

        const existingSPP = sppPayments?.spp?.find(
          (s: any) => s.month === month && s.studentId === siswa?.id
        );

        if (!existingSPP) {
          createSPPPayment.mutate(sppPaymentsDTO as any);
        }
      });
    } else {
      if (detailCategoryMQ?.data?.type === "NORMAL") {
        const paymentsDTO = {
          studentId: siswa?.id,
          date: new Date().toISOString(),
          amount: detailCategoryMQ?.data?.nominal,
          method: methodPayments,
          year: new Date().getFullYear(),
          typeId: selectIDCateogry || "",
        };

        if (existingPayment?.length > 0) {
          const existing = existingPayment[0];
          updatePayments({ id: existing.id, payload: paymentsDTO });
        } else {
          createPayments(paymentsDTO as any);
          console.log(paymentsDTO);
        }
      }

      if (detailCategoryMQ?.data?.type === "INSTALLMENT") {
        const paymentsDTO = {
          studentId: siswa?.id,
          date: new Date().toISOString(),
          amount: cicilanNominal,
          method: methodPayments,
          year: new Date().getFullYear(),
          typeId: selectIDCateogry || "",
        };

        createPayments(paymentsDTO as any);
        console.log(paymentsDTO);
      }
    }
  };

  const totalNominal =
    selectedKategori === "spp"
      ? 2500000 * selectedMonths.length
      : detailCategoryMQ?.data?.type === "INSTALLMENT"
      ? cicilanNominal
      : detailCategoryMQ?.data?.nominal || 0;

  return (
    <div className="w-full flex justify-center items-center p-8">
      <section className="w-full bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <h1 className="font-semibold text-2xl">Input Pembayaran</h1>

            {/* Nama siswa + induk */}
            <div className="flex flex-row gap-6">
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

            {/* Kategori pembayaran */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Kategori Pembayaran
              </label>
              <Select
                defaultValue="spp"
                onValueChange={(val) => {
                  setSelectedKategori(val !== "spp" ? "" : "spp");
                  setIDCategory(val === "spp" ? "" : val);
                  setSelectedMonths([]);
                }}
              >
                <SelectTrigger className="w-full py-6">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-gray-50 border-slate-300">
                  <SelectGroup>
                    <SelectLabel>Kategori</SelectLabel>
                    <SelectItem value="spp">SPP</SelectItem>
                    {categoryMQ?.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Jika kategori SPP tampilkan history + pilih bulan */}
            {selectedKategori === "spp" && (
              <div className="flex flex-col gap-4">
                {/* History */}
                <div>
                  <label className="text-sm font-medium mb-2">
                    Data SPP (History)
                  </label>
                  <Table className="w-full border-collapse">
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        <TableHead className="text-left border border-gray-300">
                          Bulan
                        </TableHead>
                        <TableHead className="text-left border border-gray-300">
                          Nominal
                        </TableHead>
                        <TableHead className="text-left border border-gray-300">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sppPayments?.spp?.map((item: any, index: number) => (
                        <TableRow key={index} className="hover:bg-gray-100">
                          <TableCell className="border border-gray-300">
                            {item.month}
                          </TableCell>
                          <TableCell className="border border-gray-300">
                            Rp. {item.nominal.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="border border-gray-300">
                            {item.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pilih bulan */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-2">
                    Pilih Bulan Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {bulanList.map((bulan) => {
                      const sudahBayar = sppPayments?.spp?.some(
                        (s: any) =>
                          s.month === bulan &&
                          s.studentId === siswa?.id &&
                          s.status === "LUNAS"
                      );

                      return (
                        <label
                          key={bulan}
                          className={`flex items-center gap-2 border p-2 rounded-md ${
                            sudahBayar ? "opacity-50" : ""
                          }`}
                        >
                          <Checkbox
                            disabled={sudahBayar}
                            checked={selectedMonths.includes(bulan)}
                            onCheckedChange={() => toggleMonth(bulan)}
                          />
                          {bulan}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {detailCategoryMQ?.data?.type === "INSTALLMENT" && (
              <div className="flex flex-col gap-4">
                {/* History cicilan */}
                <div>
                  <label className="text-sm font-medium mb-2">
                    Data Cicilan (History)
                  </label>
                  <Table className="w-full border-collapse">
                    <TableHeader>
                      <TableRow className="bg-gray-200">
                        <TableHead className="text-left border border-gray-300">
                          Nama Siswa
                        </TableHead>
                        <TableHead className="text-left border border-gray-300">
                          Nama Kategori
                        </TableHead>
                        <TableHead className="text-left border border-gray-300">
                          Nominal Dibayar
                        </TableHead>
                        <TableHead className="text-left border border-gray-300">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {existingPayment?.map((item: any, index: number) => {
                        // total sudah dibayar sampai transaksi ini
                        const totalSoFar = existingPayment
                          .slice(0, index + 1)
                          .reduce((acc: number, p: any) => acc + p.amount, 0);

                        const status =
                          totalSoFar >= (detailCategoryMQ?.data?.nominal || 0)
                            ? "LUNAS"
                            : "BELUM_LUNAS";

                        return (
                          <TableRow key={index} className="hover:bg-gray-100">
                            <TableCell className="border border-gray-300">
                              {siswa?.name}
                            </TableCell>
                            <TableCell className="border border-gray-300">
                              {detailCategoryMQ?.data?.name}
                            </TableCell>
                            <TableCell className="border border-gray-300">
                              Rp. {item.amount.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="border border-gray-300">
                              {status}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Input cicilan */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Nominal Cicilan</label>
                  <input
                    type="text"
                    value={cicilanNominal ? formatRupiah(cicilanNominal) : ""}
                    onChange={handleCicilanChange}
                    className="border-slate-300 border rounded-md px-4 py-2"
                    placeholder="Masukkan jumlah cicilan"
                  />
                </div>
              </div>
            )}

            {/* Status pembayaran */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Status Pembayaran
              </label>
              <div className="w-full border rounded-md p-4 border-slate-300">
                <p className="font-semibold text-lg ">
                  {detailCategoryMQ?.data?.type === "INSTALLMENT"
                    ? cicilanNominal >=
                      (detailCategoryMQ?.data?.nominal || 0) -
                        (existingPayment?.reduce(
                          (acc: number, p: any) => acc + p.amount,
                          0
                        ) || 0)
                      ? "LUNAS"
                      : "BELUM_LUNAS"
                    : "LUNAS"}
                </p>
              </div>
            </div>

            {/* Nominal */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Nominal</label>
              <div className="w-full border rounded-md p-4 border-slate-300">
                {detailCategoryMQ?.data?.type === "INSTALLMENT" ? (
                  <p className="font-semibold text-lg">
                    Rp.{" "}
                    {(
                      (detailCategoryMQ?.data?.nominal || 0) -
                      ((existingPayment?.reduce(
                        (acc: number, p: any) => acc + p.amount,
                        0
                      ) || 0) +
                        cicilanNominal)
                    ).toLocaleString("id-ID")}
                  </p>
                ) : (
                  <p className="font-semibold text-lg">
                    Rp. {totalNominal.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-end gap-4 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md">
                Remove
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Tambah
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default InputPembayaranpage;
