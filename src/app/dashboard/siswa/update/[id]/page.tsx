/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStudentModule } from "@/hooks/useStudentModule";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

const updateSiswaSchema = Yup.object().shape({
  name: Yup.string().required("wajib di isi"),
  InductNumber: Yup.string().required("wajib di isi"),
  generation: Yup.number().required("wajib di isi"),
  status: Yup.string().required("wajib di isi"),
  major: Yup.string().required("wajib di isi"),
  dorm: Yup.string().required("wajib di isi"),
});

const UpdateSiswa = () => {
  const { id } = useParams();
  const [dataSiswa, setDataSiswa] = useState<any>(null);
  const { useGetStudent, useUpdateStudent } = useStudentModule();
  const { data: siswa, isLoading } = useGetStudent();
  const { mutate: updateSiswa } = useUpdateStudent(id as string);

  const formik = useFormik({
    initialValues: {
      name: dataSiswa?.name || "",
      InductNumber: dataSiswa?.InductNumber || "",
      generation: dataSiswa?.generation || 0,
      status: dataSiswa?.status || "",
      major: dataSiswa?.major || "",
      dorm: dataSiswa?.dorm || "",
    },
    validationSchema: updateSiswaSchema,
    onSubmit: (value) => {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data ini akan diubah",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, ubah!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          updateSiswa.mutate(value); // Panggil di sini
        }
      });
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const found = siswa?.find((s: any) => s.id.toString() === id);
    setDataSiswa(found);
  }, [id, siswa]);

  if (!dataSiswa) return <div className="p-10">Siswa tidak ditemukan</div>;

  return (
    <section className="w-full bg-white rounded-xl h-full p-8 flex flex-col gap-8">
      <h1 className="font-semibold text-2xl">Update Siswa</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Grid 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Siswa</label>
            <Input
              type="text"
              defaultValue={dataSiswa?.name}
              className="w-full border-slate-300"
              onChange={(e) => formik.setFieldValue("name", e.target.value)}
            />
          </div>

          {/* No Induk */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">No Induk</label>
            <Input
              type="text"
              defaultValue={dataSiswa?.InductNumber}
              className="w-full border-slate-300"
              onChange={(e) =>
                formik.setFieldValue("InductNumber", e.target.value)
              }
            />
          </div>

          {/* Angkatan */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Angkatan</label>
            <Input
              type="text"
              defaultValue={dataSiswa?.generation}
              className="w-full border-slate-300"
              onChange={(e) =>
                formik.setFieldValue("generation", Number(e.target.value))
              }
            />
          </div>

          {/* Asrama */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Asrama</label>
            <Input
              type="text"
              value={formik.values.dorm}
              className="w-full border-slate-300"
              onChange={(e) => formik.setFieldValue("dorm", e.target.value)}
            />
          </div>

          {/* Jurusan */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Jurusan</label>
            <Select
              defaultValue={dataSiswa?.major}
              onValueChange={(value) => formik.setFieldValue("major", value)}
            >
              <SelectTrigger className="w-full border-slate-300">
                <SelectValue placeholder="Pilih jurusan" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-300">
                <SelectGroup>
                  <SelectLabel>Jurusan</SelectLabel>
                  <SelectItem value="RPL">RPL</SelectItem>
                  <SelectItem value="TKJ">TKJ</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Status</label>
            <Select
              defaultValue={dataSiswa?.status}
              onValueChange={(value) => formik.setFieldValue("status", value)}
            >
              <SelectTrigger className="w-full border-slate-300">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-300">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="GRADUATION">GRADUATION</SelectItem>
                  <SelectItem value="OUT">OUT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
          >
            Simpan
          </Button>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white shadow-md"
          >
            Batal
          </Button>
        </div>
      </form>
    </section>
  );
};

export default UpdateSiswa;
