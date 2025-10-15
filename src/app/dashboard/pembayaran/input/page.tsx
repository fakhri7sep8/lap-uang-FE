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
import * as XLSX from "xlsx";
import { readerExcel } from "@/helper/excelReader";
import { FileDown, Send, Trash, Trash2Icon } from "lucide-react";
import Swal from "sweetalert2";

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
  const [dataSPP, setDataSPP] = useState<any[]>([]);
  const {
    data: sppPayments,
    refetch: refetchSppPayments,
    isLoading: isLoadingSpp,
  } = useGetByStudentID(
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
  const downloadTemplateSPP = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        Nama: "",
        Bulan: "",
        Nominal: 2500000,
        Status: "",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template SPP");
    XLSX.writeFile(wb, "Template-SPP.xlsx");
  };

  const yearSelect = new Date().getFullYear();

  const handleReadExcel = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const result = await readerExcel(event);
      if (!result) return;

      console.log("📘 [STEP 1] Data Excel Diterima:", result.json);

      const siswaList = siswaMQ?.map((s: any) => s.name.toLowerCase());
      const invalidRows = result.json.filter(
        (row: any) => !siswaList.includes((row.Nama || "").toLowerCase())
      );

      if (invalidRows.length > 0) {
        console.warn("❌ [STEP 1.5] Nama siswa tidak ditemukan:", invalidRows);
        Swal.fire({
          icon: "error",
          title: "Nama siswa tidak ditemukan",
          text: invalidRows.map((r: any) => r.Nama).join(", "),
        });
        return;
      }

      Swal.fire({
        title: "Mengimpor data...",
        text: "Mohon tunggu, sedang memproses file Excel kamu",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const bulanOrder = [
        "juli",
        "agustus",
        "september",
        "oktober",
        "november",
        "desember",
        "januari",
        "februari",
        "maret",
        "april",
        "mei",
        "juni",
      ];

      let skippedRows: string[] = [];
      let blockedRows: string[] = [];
      let successRows: string[] = [];

      console.log("📆 [STEP 2] Mulai proses import...");

      // cache lunas sementara
      const tempPaid = new Set<string>();

      for (const row of result.json) {
        const namaExcel = (row.Nama || "").trim().toLowerCase();
        const bulanExcel = (row.Bulan || "").trim().toLowerCase();
        const nominalExcel = Number(row.Nominal);
        const statusExcel = (row.Status || "LUNAS").trim().toLowerCase();

        const siswaMatch = siswaMQ.find(
          (s: any) => s.name.toLowerCase() === namaExcel
        );
        if (!siswaMatch) continue;

        const bulanIdx = bulanOrder.indexOf(bulanExcel);
        if (bulanIdx === -1) continue;

        const paymentsForStudent = sppPayments?.spp?.filter(
          (p: any) => p.studentId === siswaMatch.id
        );

        // --- CEK BULAN SUDAH LUNAS (DB + TEMP) ---
        const sudahLunas =
          paymentsForStudent?.some(
            (p: any) =>
              p.month.toLowerCase() === bulanExcel && p.status === "LUNAS"
          ) || tempPaid.has(`${siswaMatch.id}-${bulanExcel}`);

        if (sudahLunas) {
          skippedRows.push(`${row.Nama} - ${row.Bulan} (Sudah Lunas)`);
          continue;
        }

        // --- CEK BULAN SEBELUMNYA ---
        const bulanSebelumnya = bulanOrder.slice(0, bulanIdx);
        const belumLunasSebelumnya = bulanSebelumnya.filter((bulan) => {
          const paidInDB = paymentsForStudent?.some(
            (p: any) => p.month.toLowerCase() === bulan && p.status === "LUNAS"
          );
          const paidInTemp = tempPaid.has(`${siswaMatch.id}-${bulan}`);
          return !(paidInDB || paidInTemp);
        });

        if (belumLunasSebelumnya.length > 0) {
          blockedRows.push(
            `${row.Nama} - ${
              row.Bulan
            } (Belum bayar ${belumLunasSebelumnya.join(", ")})`
          );
          continue;
        }

        // --- ✅ SUDAH VALID, KIRIM ---
        await createSPPPayment({
          payload: {
            studentId: siswaMatch.id,
            month: capitalize(bulanExcel),
            year: yearSPP,
            nominal: nominalExcel,
            status: statusExcel.toUpperCase(),
          },
          silent: true,
        });

        // simpan ke cache
        tempPaid.add(`${siswaMatch.id}-${bulanExcel}`);
        successRows.push(`${row.Nama} - ${row.Bulan}`);
      }

      console.log("📊 [STEP 3] Hasil akhir import:", {
        successRows,
        skippedRows,
        blockedRows,
      });

      await refetchSppPayments();
      Swal.close();

      if (blockedRows.length > 0 || skippedRows.length > 0) {
        let message = "";
        if (skippedRows.length > 0) {
          message += `❗ Dilewati karena sudah lunas:\n${skippedRows.join(
            "\n"
          )}\n\n`;
        }
        if (blockedRows.length > 0) {
          message += `🚫 Tidak bisa diimpor karena bulan sebelumnya belum lunas:\n${blockedRows.join(
            "\n"
          )}`;
        }

        Swal.fire({
          icon: "warning",
          title: "Sebagian Data Tidak Diimpor",
          text: message,
          customClass: { popup: "text-left whitespace-pre-wrap" },
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Semua data pembayaran berhasil diimpor.",
        });
      }

      event.target.value = "";
    } catch (error) {
      console.error("❌ [ERROR] Import Excel gagal:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Membaca File",
        text: "Pastikan format Excel sesuai template (Nama, Bulan, Nominal, Status)!",
      });
    }
  };

  // ✨ Helper buat kapitalisasi bulan biar tampil rapi
  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleImportClick = () => {
    Swal.fire({
      title: "Apakah anda sudah mengetahui cara menggunakan fitur ini?",
      icon: "warning",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Lanjut pilih file",
      denyButtonText: "Download Format",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("file")?.click();
      } else if (result.isDenied) {
        downloadTemplateSPP();
      }
    });
  };

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

  useEffect(() => {
    setSelectedMonths([]);
    setTimeout(() => {
      refetchSppPayments();
    }, 50);
  }, [siswa, yearSPP]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      const isSelected = prev.includes(month);
      const idx = bulanList.indexOf(month);
      const prevMonth = bulanList[idx - 1];

      const prevPaid =
        sppPayments?.spp?.some(
          (p: any) =>
            p.month === prevMonth &&
            p.studentId === siswa?.id &&
            p.status === "LUNAS"
        ) || false;

      // 🔒 Jika bulan ini auto dari prevPaid → gak bisa di-uncheck
      if (isSelected && prevPaid) {
        return prev;
      }

      // 🔁 toggle normal
      if (isSelected) {
        return prev.filter((m) => m !== month);
      } else {
        if (idx === 0 || prev.includes(prevMonth) || prevPaid) {
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
            payload: {
              studentId: siswa.id,
              month,
              year: yearSPP,
              nominal: 2500000,
              status: "LUNAS",
            },
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
              {/* Tahun Ajaran */}
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
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <SelectItem
                          key={i}
                          value={`${yearSelect + i}/${yearSelect + i + 1}`}
                        >{`${yearSelect + i}/${
                          yearSelect + i + 1
                        }`}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* History SPP */}
              <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                {isLoadingSpp ? (
                  <div className="p-5 space-y-4">
                    {/* Skeleton Header */}
                    <div className="flex justify-between mb-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-5 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md animate-pulse"
                        ></div>
                      ))}
                    </div>

                    {/* Skeleton Rows */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-3 border-t border-slate-100"
                      >
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div
                            key={j}
                            className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-md animate-pulse"
                          ></div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table className="w-full">
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
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === "LUNAS"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {item.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pilih bulan */}
              <div className="flex flex-col gap-3">
                {/* Tombol Select All */}
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={
                      selectedMonths.length ===
                      bulanList.filter(
                        (bulan) =>
                          !sppPayments?.spp?.some(
                            (s: any) =>
                              s.month === bulan &&
                              s.studentId === siswa?.id &&
                              s.status === "LUNAS"
                          )
                      ).length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Pilih semua bulan yang belum lunas
                        const belumLunas = bulanList.filter(
                          (bulan) =>
                            !sppPayments?.spp?.some(
                              (s: any) =>
                                s.month === bulan &&
                                s.studentId === siswa?.id &&
                                s.status === "LUNAS"
                            )
                        );
                        setSelectedMonths(belumLunas);
                      } else {
                        // Kosongkan semua pilihan
                        setSelectedMonths([]);
                      }
                    }}
                  />
                  <Label className="text-sm font-medium">
                    Pilih Semua Bulan
                  </Label>
                </div>

                {/* Daftar bulan */}
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
          <div className="flex flex-col items-end gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 border text-lg flex items-center justify-center gap-2 rounded-xl transition-all
    ${
      isSubmitting
        ? "cursor-not-allowed bg-gray-300 text-gray-500 border-gray-300"
        : "cursor-pointer border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
    }`}
            >
              <Send size={24} />
              {isSubmitting ? "Proses menyimpan data siswa..." : "Simpan"}
            </button>

            <button
              type="button"
              onClick={downloadTemplateSPP}
              className="w-full py-5 hover:bg-blue-500 hover:text-white transition-all cursor-pointer border border-blue-500 text-blue-500 text-lg flex items-center justify-center gap-2 rounded-xl"
            >
              <FileDown size={24} />
              Download format excel
            </button>

            {/* Tombol Impor dari Excel */}
            {/* Tombol Impor dari Excel */}
            <button
              type="button"
              onClick={handleImportClick}
              className="w-full py-5 hover:bg-purple-500 hover:text-white transition-all cursor-pointer border border-purple-500 text-purple-500 text-lg flex items-center justify-center gap-2 rounded-xl"
            >
              <FileDown size={24} />
              Impor dari Excel
            </button>

            {/* Input file yang hidden */}
            <input
              id="file"
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleReadExcel}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default InputPembayaranpage;
