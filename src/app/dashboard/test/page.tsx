"use client";

import React from "react";
import dayjs from "dayjs";
import ExportPreviewButton, { Column } from "@/components/fragments/buttonExcelSiswa";
import { useStudentModule } from "@/hooks/useStudentModule";

export default function Page() {
  const { useGetStudent } = useStudentModule();
  const { data: siswa = [], isLoading, isError } = useGetStudent();

  const columns: Column<any>[] = [
    { header: "No",        key: "__index__",   value: (_s: any, i: number) => i + 1 },
    { header: "Nama",      key: "name" },
    { header: "No. Induk", key: "InductNumber" },
    { header: "Asrama",    key: "dorm" },
    { header: "Angkatan",  key: "generation" },
    { header: "Status",    key: "status" }, // akan berisi ACTIVE / GRADUATION / OUT
    { header: "Jurusan",   key: "major" },
    { header: "Dibuat",    key: "createdAt", value: (s: { createdAt: string | number | Date | dayjs.Dayjs | null | undefined; }) => dayjs(s.createdAt).format("DD MMM YYYY") },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memuat data siswa…</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Gagal memuat data siswa.</p>
      </main>
    );
  }

  // Untuk test: kita pakai semua data siswa tanpa filter/pagination
  const dataUntukExport = Array.isArray(siswa) ? siswa : [];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        🔍 Test Export Siswa (pakai data asli)
      </h1>

      <p className="text-gray-500 text-sm">
        Total siswa terambil: <strong>{dataUntukExport.length}</strong>
      </p>

      <ExportPreviewButton
        data={dataUntukExport}
        columns={columns}
        filename="data-siswa"
        buttonText="Preview & Export"
        previewLimit={20}
      />
    </main>
  );
}
