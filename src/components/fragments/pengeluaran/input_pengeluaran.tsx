// app/submit-request/page.jsx
"use client";

import React, { useState, useRef } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { File, FileArchive, FileAxis3D, FileAxis3dIcon, FilePlusIcon, X } from "lucide-react";

interface FormValues {
  nama: string;
  penanggungJawab: string;
  kategori: string;
  subKategori: string;
  jumlah: string | number; // allow both since input returns string
  status: string;
  deskripsi: string;
  filePdf: File[]; // allow multiple files
}

type DataItem = Omit<FormValues, "jumlah" | "filePdf"> & {
  no: number;
  tanggal: string;
  jumlah: number; // stored as number for display/formatting
  pdfNames?: string[];
  pdfUrls?: string[];
};

export default function SubmitRequestForm() {
  const [dataList, setDataList] = useState<DataItem[]>([]);

  const formik = useFormik<FormValues>({
    initialValues: {
      nama: "",
      penanggungJawab: "",
      kategori: "",
      subKategori: "",
      jumlah: "",
      status: "",
      deskripsi: "",
      filePdf: [],
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama wajib diisi"),
      penanggungJawab: Yup.string().required("Penanggung jawab wajib diisi"),
      kategori: Yup.string().required("Kategori wajib diisi"),
      subKategori: Yup.string().required("Sub kategori wajib diisi"),
      jumlah: Yup.number()
        .typeError("Jumlah harus berupa angka")
        .positive("Jumlah harus lebih dari 0")
        .required("Jumlah wajib diisi"),
      status: Yup.string().required("Status wajib diisi"),
      deskripsi: Yup.string().max(1000, "Deskripsi maksimal 1000 karakter"),
      filePdf: Yup.array()
        .of(
          Yup.mixed()
            .test("fileType", "Hanya file PDF yang diperbolehkan", (file: any) => {
              if (!file) return true;
              return file && file.type === "application/pdf";
            })
            .test("fileSize", "Ukuran file maksimal 5MB", (file: any) => {
              if (!file) return true;
              return file && file.size <= 5 * 1024 * 1024;
            })
        )
        .max(2, "Maksimal 2 file"),
    }),
    onSubmit: (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
      const tanggal = new Date().toLocaleDateString("id-ID");
      const no = dataList.length + 1; // nomor urut otomatis

      // Ensure jumlah is saved as a number
      const jumlahNumber = Number(values.jumlah);

      const newData: DataItem = {
        no,
        tanggal,
        nama: values.nama,
        penanggungJawab: values.penanggungJawab,
        kategori: values.kategori,
        subKategori: values.subKategori,
        jumlah: jumlahNumber,
        status: values.status,
        deskripsi: values.deskripsi,
      };

      // Jika ada file PDF(s), buat object URL dan nama untuk ditampilkan sebagai link
      if (values.filePdf && values.filePdf.length > 0) {
        newData.pdfNames = values.filePdf.map((f) => f.name);
        try {
          newData.pdfUrls = values.filePdf.map((f) => URL.createObjectURL(f));
        } catch (e) {
          // ignore
        }
      }

      setDataList((prev) => [...prev, newData]);
      resetForm();
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const removeFileAt = (index: number) => {
    const list = [...(formik.values.filePdf || [])];
    list.splice(index, 1);
    formik.setFieldValue("filePdf", list);
    // if no files left, clear native input
    if (list.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
    // clear error if under limit
    if (list.length <= 2) {
      formik.setFieldError("filePdf", undefined as any);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-5xl bg-white p-4 sm:p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-gray-800 text-center">
          Input Data Pengeluaran
        </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Nama</label>
            <input
              name="nama"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nama}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Masukkan nama"
            />
            {formik.touched.nama && formik.errors.nama && (
              <p className="text-red-500 text-sm">{formik.errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Penanggung Jawab</label>
            <input
              name="penanggungJawab"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.penanggungJawab}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Nama penanggung jawab"
            />
            {formik.touched.penanggungJawab && formik.errors.penanggungJawab && (
              <p className="text-red-500 text-sm">{formik.errors.penanggungJawab}</p>
            )}
          </div>
        </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Kategori</label>
            <input
              name="kategori"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.kategori}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Masukkan kategori"
            />
            {formik.touched.kategori && formik.errors.kategori && (
              <p className="text-red-500 text-sm">{formik.errors.kategori}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Sub Kategori</label>
            <input
              name="subKategori"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subKategori}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Masukkan sub kategori"
            />
            {formik.touched.subKategori && formik.errors.subKategori && (
              <p className="text-red-500 text-sm">{formik.errors.subKategori}</p>
            )}
          </div>
        </div>

  <div className="mb-4">
          <label className="block text-gray-700 mb-1">Jumlah (Rp)</label>
          <input
            name="jumlah"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.jumlah as any}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Contoh: 500000"
          />
          {formik.touched.jumlah && formik.errors.jumlah && (
            <p className="text-red-500 text-sm">{formik.errors.jumlah}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Deskripsi (opsional)</label>
          <textarea
            name="deskripsi"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.deskripsi}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            placeholder="Deskripsikan pengeluaran atau catatan tambahan"
          />
          {formik.touched.deskripsi && formik.errors.deskripsi && (
            <p className="text-red-500 text-sm">{formik.errors.deskripsi}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Bukti PDF (opsional)</label>
          <div className="w-full rounded-lg border px-3 py-6 sm:py-10 text-center items-center relative">
            {/* When no file selected: show choose button which opens hidden file input */}
            <div className="w-full flex flex-col gap-2 items-center justify-center mb-1">
              <FileArchive size={55} strokeWidth={1.5} />
              <p className="text-xs text-gray-500">(Hanya file PDF,Max 2 File)</p>
              <label className="mt-2 inline-flex items-center gap-2 bg-green-500 text-white font-semibold text-sm px-4 py-1 rounded-lg cursor-pointer">
                Choose File
                <input
                  ref={fileInputRef}
                  name="filePdf"
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => {
                    const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
                    if (files.length > 2) {
                      // keep only first 2 and set form error
                      formik.setFieldValue("filePdf", files.slice(0, 2));
                      formik.setFieldError("filePdf", "Maksimal 2 file");
                    } else {
                      formik.setFieldValue("filePdf", files);
                      // clear any previous error
                      formik.setFieldError("filePdf", undefined as any);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {/* Show selected files if any */}
              {formik.values.filePdf && formik.values.filePdf.length > 0 && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {formik.values.filePdf.map((f: any, idx: number) => (
                    <div key={idx} className="relative border rounded-md p-3 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileArchive size={20} />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{f.name}</div>
                          <div className="text-xs text-gray-500">{Math.round((f.size ?? 0) / 1024)} KB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Hapus ${f.name}`}
                        onClick={() => removeFileAt(idx)}
                        className="ml-3 text-gray-600 hover:text-red-600 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-1">Maksimal 5MB.</p>
          {formik.errors.filePdf && (
            <p className="text-red-500 text-sm">{formik.errors.filePdf as any}</p>
          )}
        </div>


        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
        >
          Submit Request
        </button>
      </form>

      {/* Tabel hasil input */}
      {dataList.length > 0 && (
        <div className="w-full max-w-3xl mt-10 bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Daftar Pengeluaran
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Penanggung Jawab</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Sub Kategori</th>
                <th className="p-2 border">Jumlah (Rp)</th>
                <th className="p-2 border">Deskripsi</th>
                <th className="p-2 border">Bukti (PDF)</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataList.map((item) => (
                <tr key={item.no} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{item.no}</td>
                  <td className="p-2 border">{item.tanggal}</td>
                  <td className="p-2 border">{item.nama}</td>
                  <td className="p-2 border">{item.penanggungJawab}</td>
                  <td className="p-2 border">{item.kategori}</td>
                  <td className="p-2 border">{item.subKategori}</td>
                  <td className="p-2 border text-right">
                    {Number(item.jumlah).toLocaleString("id-ID")}
                  </td>
                  <td className="p-2 border">{item.deskripsi}</td>
                  <td className="p-2 border">
                    {item.pdfUrls && item.pdfUrls.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {item.pdfUrls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {item.pdfNames?.[i] || `Lihat PDF ${i + 1}`}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 border text-center">{item.status}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
