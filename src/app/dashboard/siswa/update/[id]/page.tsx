"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CalendarDays } from "lucide-react";
import { useStudentModule } from "@/hook/useStudentModule";
import { useFormik } from "formik";
import * as Yup from "yup";
const updateSiswaSchema = Yup.object().shape({
  name: Yup.string().required("wajib di isi"),
  InductNumber: Yup.string().required("wajib di isi"),
  generation : Yup.number().required("wajib di isi"),
  status : Yup.string().required("wajib di isi"),
  major : Yup.string().required("wajib di isi"),
  dorm : Yup.string().required("wajib di isi"),
})

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
      updateSiswa.mutate(value);
      // console.log(value);
    },
    enableReinitialize: true,
    

  });

  useEffect(() => {
    const found = siswa?.find((s: any) => s.id.toString() === id);
    setDataSiswa(found);
  }, [id]);

  if (!dataSiswa) return <div className="p-10">Siswa tidak ditemukan</div>;

  return (
    <section className="w-full bg-white rounded-xl h-full p-8 text-2xl flex flex-col gap-9">
      <h1 className="font-semibold text-2xl">Update Siswa</h1>
      <form action="submit" onSubmit={formik.handleSubmit}>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Nama Siswa</label>
              <Input
                type="text"
                defaultValue={dataSiswa?.name}
                className="w-full border-slate-300"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 w-full">
            <div className="w-1/2">
              <label className="text-sm font-medium">No Induk</label>
              <Input
                type="text"
                defaultValue={dataSiswa?.InductNumber}
                className="w-full border-slate-300"
                 onChange={(e) => formik.setFieldValue("InductNumber", e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium">Angkatan</label>
              <Input
                type="text"
                defaultValue={dataSiswa?.generation}
                className="w-full border-slate-300"
                onChange={(e) => formik.setFieldValue("generation", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 w-full">
            <div className="w-1/2">
              <label className="text-sm font-medium">Asrama</label>
              <Input
                type="text"
                value={dataSiswa?.dorm}
                className="w-full border-slate-300"
                onChange={(e) => formik.setFieldValue("dorm", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-6 w-full">
            <div className="w-1/2">
              <label className="text-sm font-medium">Jurusan</label>
              <Input
                type="text"
                defaultValue={dataSiswa?.major}
                className="w-full  border-slate-300"
                onChange={(e) => formik.setFieldValue("major", e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium">Status</label>
              <Input
                type="text"
                defaultValue={dataSiswa?.status}
                className="w-full border-slate-300"
                onChange={(e) => formik.setFieldValue("status", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-5 justify-end mt-6">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-colors duration-200"
          >
            Simpan
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors duration-200">
            Batal
          </Button>
        </div>
      </form>
    </section>
  );
};

export default UpdateSiswa;
