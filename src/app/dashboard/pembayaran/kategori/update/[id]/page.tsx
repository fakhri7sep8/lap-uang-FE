"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { useStudentModule } from "@/hooks/useStudentModule";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import currency from "currency.js";

const updateCategorySchema = Yup.object().shape({
  name: Yup.string().required("Nama kategori wajib diisi"),
  semester: Yup.number()
    .required("Semester wajib diisi")
    .min(1, "Minimal semester 1")
    .max(8, "Maksimal semester 8"),
  TA: Yup.string().required("Tahun ajaran wajib diisi"),
  type: Yup.string().oneOf(["NORMAL", "INSTALLMENT"]),
  nominal: Yup.number().min(0, "Nominal minimal 0").required(),
  status: Yup.string().oneOf(["ACTIVE", "NONACTIVE"]).required(),
});

const getAcademicYears = (count = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const start = currentYear + i;
    const end = start + 1;
    return `${start}/${end}`;
  });
};

const academicYears = getAcademicYears();

const formatRupiah = (value: any) =>
  currency(value || 0, {
    symbol: "Rp",
    separator: ".",
    decimal: ",",
    precision: 0,
  }).format();

const UpdateKategori = () => {
  const { id } = useParams();
  const { useDetailCategory, useUpdateCategory } = useCategoryPaymentModule();
  const { useGetStudent } = useStudentModule();

  const { mutate } = useUpdateCategory(id as string);
  const { data, isLoading } = useDetailCategory(id as string);
  const { data: siswaMQ } = useGetStudent();

  const [selectedSiswa, setSelectedSiswa] = useState<Option[]>([]);

  const siswaOptions: Option[] =
    siswaMQ?.map((s: any) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const formik = useFormik({
    initialValues: {
      name: "",
      semester: "",
      TA: "",
      type: "",
      nominal: "",
      status: "",
    },
    validationSchema: updateCategorySchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        studentIds: selectedSiswa.map((s) => s.value),
      };

      mutate.mutate(payload);
    },
  });

  useEffect(() => {
    if (data?.data) {
      formik.setValues({
        name: data.data.name,
        semester: data.data.semester,
        TA: data.data.TA,
        type: data.data.type,
        nominal: data.data.nominal,
        status: data.data.status,
      });

      if (data.data.students) {
        setSelectedSiswa(
          data.data.students.map((s: any) => ({
            label: s.name,
            value: s.id,
          }))
        );
      }
    }
  }, [data]);

  if (isLoading && !data) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="pt-16">
      <div className="rounded-xl bg-white p-8 w-full mx-auto shadow-md flex flex-col items-center">
        <h1 className="w-full text-2xl font-semibold">
          Update Kategori Pembayaran
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-8 mt-6"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Nama */}
            <div className="flex flex-col gap-4">
              <Label>Nama Kategori</Label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="border-slate-300 px-3 py-6"
              />
              {formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            {/* Pilih Siswa */}
            <div className="flex flex-col gap-4">
              <Label>Pilih Siswa</Label>
              <MultipleSelector
                defaultOptions={siswaOptions}
                value={selectedSiswa}
                onChange={setSelectedSiswa}
              />
            </div>

            {/* Semester */}
            <div className="flex flex-col gap-4">
              <Label>Semester</Label>
              <Input
                type="number"
                name="semester"
                value={formik.values.semester}
                onChange={(e) =>
                  formik.setFieldValue("semester", Number(e.target.value))
                }
                className="border-slate-300 px-3 py-6"
              />
              {formik.errors.semester && (
                <p className="text-red-500 text-sm">{formik.errors.semester}</p>
              )}
            </div>

            {/* Tahun Ajaran */}
            <div className="flex flex-col gap-4 ">
              <Label>Tahun Ajaran</Label>
              <Select
                value={formik.values.TA}
                onValueChange={(val) => formik.setFieldValue("TA", val)}
              >
                <SelectTrigger className="py-6 px-3 border-slate-300 w-full">
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>Tahun Ajaran</SelectLabel>
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="flex flex-col gap-4">
              <Label>Tipe Kategori</Label>
              <Select
                value={formik.values.type}
                onValueChange={(val) => formik.setFieldValue("type", val)}
              >
                <SelectTrigger className="py-6 px-3 border-slate-300 w-full">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="INSTALLMENT">Cicilan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-4">
              <Label>Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className="py-6 px-3 border-slate-300 w-full">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="NONACTIVE">Nonactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Nominal */}
            <div className="flex flex-col gap-4 col-span-2">
              <Label>Nominal</Label>
              <Input
                name="nominal"
                value={formatRupiah(formik.values.nominal)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  formik.setFieldValue("nominal", raw ? Number(raw) : "");
                }}
                className="border-slate-300 px-3 py-6"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="submit" className="bg-blue-500 text-white px-8">
              {mutate.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" className="bg-red-500 text-white px-8">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateKategori;
