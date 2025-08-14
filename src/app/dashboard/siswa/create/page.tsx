"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useStudentModule } from "@/hooks/useStudentModule";

const tambahSiswaSchema = Yup.object().shape({
  name: Yup.string().required("Nama wajib diisi"),
  InductNumber: Yup.string().required("No Induk wajib diisi"),
  dorm: Yup.string().required("Asrama wajib diisi"),
  generation: Yup.number().required("Angkatan wajib diisi"),
  major: Yup.string().required("Jurusan wajib diisi"),
  status: Yup.string().required("Status wajib diisi"),
});

const TambahSiswa = () => {
  const { useCreateStudent } = useStudentModule();
  const { mutate } = useCreateStudent();

  const formik = useFormik({
    initialValues: {
      name: "",
      InductNumber: "",
      dorm: "",
      generation: "",
      major: "",
      status: "",
    },
    validationSchema: tambahSiswaSchema,
    onSubmit: (values, { resetForm }) => {
      const payload = {
        ...values,
        generation: Number(values.generation),
      };
      mutate(payload);
      resetForm();
    },
  });

  const renderField = (label: string, name: string, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <Input
        type={type}
        name={name}
        value={(formik.values as any)[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full border-slate-300"
      />
      {formik.touched[name as keyof typeof formik.touched] &&
        formik.errors[name as keyof typeof formik.errors] && (
          <p className="text-red-600 text-sm">
            {formik.errors[name as keyof typeof formik.errors] as string}
          </p>
        )}
    </div>
  );

  return (
    <section className="w-full bg-white rounded-xl p-8 flex flex-col gap-8">
      <h1 className="font-semibold text-2xl">Tambah Siswa</h1>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField("Nama Siswa", "name")}
          {renderField("No Induk", "InductNumber")}
          {renderField("Angkatan", "generation")}
          {renderField("Asrama", "dorm")}
          {renderField("Jurusan", "major")}
          {renderField("Status", "status")}
        </div>

        <div className="flex flex-row gap-4 justify-end mt-4">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
          >
            Tambah
          </Button>
          <Button
            type="button"
            onClick={() => formik.resetForm()}
            className="bg-red-500 hover:bg-red-600 text-white shadow-md"
          >
            Batal
          </Button>
        </div>
      </form>
    </section>
  );
};

export default TambahSiswa;
