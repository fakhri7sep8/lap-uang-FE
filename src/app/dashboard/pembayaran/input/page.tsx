/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { Label } from "@/components/ui/label";

const bulanList = [
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
];

const bulanListTable = [
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
];

const InputPembayaranpage = () => {
  const [selectedSiswa, setSelectedSiswa] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("spp");
  const [selectIDCateogry, setIDCategory] = useState<string>(
    "13dd5ec7-3c5b-4afb-b430-1ac1f1745c6d"
  );

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [methodPayments, setMethodPayments] = useState<string>("NORMAL");
  const [cicilanNominal, setCicilanNominal] = useState<number>(0);
  const [yearSPP, setYearSPP] = useState(
    `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  );

  // Hooks
  const { useGetStudent } = useStudentModule();
  const { data: siswaMQ } = useGetStudent();
  const { useCreateSPPPayment, useGetByStudentID } = useSppPaymentModule();
  const { mutate: createSPPPayment, isPending: isPendingSpp } =
    useCreateSPPPayment();
  const { data: sppPayments, refetch: refetchSppPayments } = useGetByStudentID(
    siswaMQ?.find(
      (s: any) => s?.InductNumber === selectedSiswa || s?.name === selectedSiswa
    )?.id,
    yearSPP
  );

  const { useCreatePayment, useUpdatePayment, useGetPaymentsByCNS } =
    usePaymentModule();
  const { mutate: createPayments, isPending: isPendingCreate } =
    useCreatePayment();
  const { mutate: updatePayments, isPending: isPendingUpdate } =
    useUpdatePayment();
  const { useGetCategory, useDetailCategory } = useCategoryPaymentModule();
  const { data: categoryMQ } = useGetCategory();
  const { data: detailCategoryMQ } = useDetailCategory(selectIDCateogry);
  const isSubmitting = isPendingSpp || isPendingCreate || isPendingUpdate;

  const siswa = siswaMQ?.find(
    (s: any) => s?.InductNumber === selectedSiswa || s?.name === selectedSiswa
  );

  const { data: existingPayment } = useGetPaymentsByCNS(
    siswa?.id || "",
    selectIDCateogry || ""
  );

  const yearSelect = new Date().getFullYear();

  // Cicilan input
  const handleCicilanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const inputNominal = Number(raw || 0);
    const sudahDibayar =
      existingPayment?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
    const totalTagihan = detailCategoryMQ?.data?.nominal || 0;
    const sisaTagihan = Math.max(totalTagihan - sudahDibayar, 0);
    const totalNominal = detailCategoryMQ?.data?.nominal || 0;
    const paidNominal = detailCategoryMQ?.data?.paid_nominal || 0;
    const remainingNominal = totalNominal - paidNominal;

    setCicilanNominal(inputNominal > sisaTagihan ? sisaTagihan : inputNominal);
  };

  // Auto pilih bulan pertama yang belum lunas
  useEffect(() => {
    if (selectedKategori === "spp" && siswa?.id && sppPayments?.spp) {
      const belumLunasBulan = bulanList.find((bulan) => {
        const dataBulan = sppPayments?.spp?.find(
          (s: any) => s.month === bulan && s.studentId === siswa?.id
        );
        return !dataBulan || dataBulan.status !== "LUNAS";
      });
      setSelectedMonths(belumLunasBulan ? [belumLunasBulan] : []);
    }
  }, [siswa?.id, sppPayments, selectedKategori]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        const idx = bulanList.indexOf(month);
        return prev.filter((m) => bulanList.indexOf(m) < idx);
      } else {
        const idx = bulanList.indexOf(month);
        const bulanSebelumnya = bulanList[idx - 1];

        if (idx === 0 || prev.includes(bulanSebelumnya)) {
          return [...prev, month];
        }
        return prev;
      }
    });
  };

  // Submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!siswa) return;

    if (selectedKategori === "spp") {
      selectedMonths.forEach((month) => {
        const existingSPP = sppPayments?.spp?.find(
          (s: any) => s.month === month && s.studentId === siswa?.id
        );
        if (!existingSPP) {
          createSPPPayment({
            studentId: siswa.id,
            month,
            year: yearSPP,
            nominal: 2500000,
            status: "LUNAS",
          });
        }
      });
    } else {
      const paymentsDTO = {
        studentId: siswa.id,
        date: new Date().toISOString(),
        method: methodPayments,
        year: new Date().getFullYear(),
        typeId: selectIDCateogry || "",
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
    }
  };

  const totalNominal =
    detailCategoryMQ?.data?.type === "INSTALLMENT"
      ? (detailCategoryMQ?.data?.nominal || 0) -
        (existingPayment?.reduce((acc: any, p: any) => acc + p.amount, 0) || 0)
      : selectedKategori === "spp"
      ? 2500000 * selectedMonths.length
      : detailCategoryMQ?.data?.nominal || 0;

  // === Helper Status Pembayaran ===
  const getStatusPembayaran = () => {
    if (selectedKategori === "spp") {
      const totalBulan = bulanList.length;
      const totalLunas =
        sppPayments?.spp?.filter((s: any) => s.status === "LUNAS")?.length || 0;
      if (totalLunas >= totalBulan) return "LUNAS";
      if (totalLunas > 0)
        return `BELUM LUNAS (${totalLunas}/${totalBulan} bulan)`;
      return "BELUM BAYAR";
    }

    if (detailCategoryMQ?.data?.type === "INSTALLMENT") {
      const sudahDibayar =
        existingPayment?.reduce((acc: number, p: any) => acc + p.amount, 0) ||
        0;
      if (sudahDibayar >= (detailCategoryMQ?.data?.nominal || 0))
        return "LUNAS";
      if (sudahDibayar > 0) return "BELUM LUNAS";
      return "BELUM BAYAR";
    }

    return existingPayment?.length > 0 ? "LUNAS" : "BELUM BAYAR";
  };

  return (
    <div className="w-full flex justify-center items-center p-8">
      <section className="w-full bg-white rounded-2xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h1 className="font-semibold text-2xl">Input Pembayaran</h1>

          {/* Nama siswa */}
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

          {/* SPP */}
          {selectedKategori === "spp" && (
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-col gap-2 mb-4">
                <label className="text-sm font-medium">Tahun Ajaran</label>
                <Select
                  defaultValue={`${yearSelect}/${yearSelect + 1}`}
                  onValueChange={(val) => {
                    setYearSPP(val);
                    setTimeout(() => {
                      refetchSppPayments();
                    }, 10);
                  }}
                >
                  <SelectTrigger className="w-full py-6">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50 border-slate-300">
                    <SelectGroup>
                      <SelectLabel>Kategori</SelectLabel>
                      <SelectItem
                        value={`${yearSelect}/${yearSelect + 1}`}
                      >{`${yearSelect}/${yearSelect + 1}`}</SelectItem>
                      <SelectItem
                        value={`${yearSelect + 1}/${yearSelect + 2}`}
                      >{`${yearSelect + 1}/${yearSelect + 2}`}</SelectItem>
                      <SelectItem
                        value={`${yearSelect + 2}/${yearSelect + 3}`}
                      >{`${yearSelect + 2}/${yearSelect + 3}`}</SelectItem>
                      <SelectItem
                        value={`${yearSelect + 3}/${yearSelect + 4}`}
                      >{`${yearSelect + 3}/${yearSelect + 4}`}</SelectItem>
                      <SelectItem
                        value={`${yearSelect + 4}/${yearSelect + 5}`}
                      >{`${yearSelect + 4}/${yearSelect + 5}`}</SelectItem>
                      <SelectItem
                        value={`${yearSelect + 5}/${yearSelect + 6}`}
                      >{`${yearSelect + 5}/${yearSelect + 6}`}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* History SPP */}
              <Table className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-center font-semibold text-slate-700">
                      Bulan
                    </TableHead>
                    <TableHead className="text-center font-semibold text-slate-700">
                      Nominal
                    </TableHead>
                    <TableHead className="text-center font-semibold text-slate-700">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sppPayments?.spp
                    ?.slice()
                    ?.sort(
                      (a: any, b: any) =>
                        bulanListTable.indexOf(a.month) -
                        bulanListTable.indexOf(b.month)
                    )
                    ?.map((item: any, i: number) => (
                      <TableRow
                        key={i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="text-center">
                          {item.month}
                        </TableCell>
                        <TableCell className="text-center">
                          Rp {item.nominal.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-3 py-1 rounded-full text-sm font-medium text-green-700">
                            {item.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Pilih bulan */}
              <div className="grid grid-cols-3 gap-2">
                {bulanList.map((bulan, idx) => {
                  const sudahBayar = sppPayments?.spp?.some(
                    (s: any) =>
                      s.month === bulan &&
                      s.studentId === siswa?.id &&
                      s.status === "LUNAS"
                  );

                  const bulanSebelumnya = bulanList[idx - 1];
                  const harusDisable =
                    sudahBayar ||
                    (idx > 0 &&
                      !selectedMonths.includes(bulanSebelumnya) &&
                      !sppPayments?.spp?.some(
                        (s: any) =>
                          s.month === bulanSebelumnya &&
                          s.studentId === siswa?.id &&
                          s.status === "LUNAS"
                      ));

                  return (
                    <label
                      key={bulan}
                      className={`flex items-center gap-2 border p-2 rounded-md transition-colors ${
                        sudahBayar
                          ? "bg-green-100 border-green-400 text-green-700"
                          : ""
                      }${harusDisable && !sudahBayar ? "opacity-50" : ""}`}
                    >
                      <Checkbox
                        disabled={harusDisable}
                        checked={sudahBayar || selectedMonths.includes(bulan)}
                        onCheckedChange={() => toggleMonth(bulan)}
                        className={`${
                          sudahBayar
                            ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 data-[state=checked]:text-white"
                            : ""
                        }`}
                      />

                      {bulan}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cicilan */}
          {detailCategoryMQ?.data?.type === "INSTALLMENT" && (
            <div className="flex flex-col gap-4">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow className="bg-gray-200">
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nominal Dibayar</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                  {existingPayment?.map((item: any, i: number) => {
                    const totalSoFar = existingPayment
                      .slice(0, i + 1)
                      .reduce((acc: number, p: any) => acc + p.amount, 0);
                    const status =
                      totalSoFar >= (detailCategoryMQ?.data?.nominal || 0)
                        ? "LUNAS"
                        : "BELUM LUNAS";
                    return (
                      <TableRow key={i}>
                        <TableCell>{siswa?.name}</TableCell>
                        <TableCell>{detailCategoryMQ?.data?.name}</TableCell>
                        <TableCell>
                          Rp. {item.amount.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>{status}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <input
                type="text"
                value={cicilanNominal ? formatRupiah(cicilanNominal) : ""}
                onChange={handleCicilanChange}
                className="border-slate-300 border rounded-md px-4 py-2"
                placeholder="Masukkan jumlah cicilan"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Status Pembayaran
            </label>
            <div className="w-full border rounded-md p-4 border-slate-300">
              <p className="font-semibold text-lg">{getStatusPembayaran()}</p>
            </div>
          </div>

          {/* Nominal */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Nominal</label>
            <div className="w-full border rounded-md p-4 border-slate-300">
              <p className="font-semibold text-lg">
                Rp. {totalNominal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end gap-4 mt-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md">
              Remove
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || getStatusPembayaran() === "LUNAS"}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default InputPembayaranpage;
