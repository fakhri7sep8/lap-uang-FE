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
import { useCategoryPaymentModule } from "@/hooks/use-categoryPayment";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { use } from "react";
import * as Yup from "yup";

const updateCategorySchema = Yup.object().shape({
  name: Yup.string().required("Nama kategori wajib diisi"),
  semester: Yup.number()
    .required('Semester wajib diisi')
    .min(1, 'Minimal semester 1')
    .max(8, 'Maksimal semester 8'),
  TA: Yup.string().required('Tahun ajaran wajib diisi'),
  type: Yup.string().oneOf(['NORMAL', 'INSTALLMENT'], 'Tipe tidak valid')
})

const getAcademicYears = (count = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const start = currentYear + i;
    const end = start + 1;
    return `${start}/${end}`;
  });
};

const academicYears = getAcademicYears();
const UpdateKategori = () => {
  const { id } = useParams();

  const { useDetailCategory, useUpdateCategory } = useCategoryPaymentModule();
  const { mutate } = useUpdateCategory(id as string);
  const { data, isLoading } = useDetailCategory(id as string);
  console.log(data);

  const formik = useFormik({
    initialValues: {
      name: data?.data?.name,
      semester: data?.data?.semester,
      TA: data?.data?.TA,
      type: data?.data?.type,
      nominal: data?.data?.nominal,
    },
    validationSchema: updateCategorySchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
      mutate.mutate(values);
    },
  });

  console.log(data?.data);

  if (isLoading) {
    return (
      <div className="p-6 w-full h-[89vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className='h-[91vh] pt-16'>
      <div className='bg-white rounded-xl p-8 w-full mx-auto shadow-md h-[50vh] flex flex-col items-center'>
        <h1 className='w-full h-24 text-2xl font-semibold'>
          Update Kategori Pembayaran
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-8 justify-between"
        >
          <div className="w-full h-full grid grid-cols-2 gap-6">
            {/* Nama Kategori */}
            <div className="w-full flex flex-col gap-4">
              <Label>Nama Kategori</Label>
              <Input
                name="name"
                defaultValue={formik.values.name}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                placeholder="masukan nama kategori"
                className="border-slate-300 rounded-md px-3 py-6"
              />
              {formik.touched?.name && formik.errors?.name && (
                <p className="text-red-500 text-sm">
                  {formik.errors?.name as string}
                </p>
              )}
            </div>

            {/* Semester */}
            <div className="w-full flex flex-col gap-4">
              <Label>Semester</Label>
              <Input
                type="number"
                name="semester"
                defaultValue={formik.values.semester}
                onChange={(e) =>
                  formik.setFieldValue("semester", Number(e.target.value))
                }
                placeholder="masukan semester"
                className="border-slate-300 rounded-md px-3 py-6"
              />
              {formik.touched?.semester && formik.errors?.semester && (
                <p className="text-red-500 text-sm">
                  {formik.errors.semester as string}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col gap-4">
              <Label>Tahun Ajaran</Label>
              <Select
                value={formik.values.TA}
                onValueChange={(val) => formik.setFieldValue("TA", val)}
              >
                <SelectTrigger className="w-full py-6 px-3 border-slate-300 rounded-md text-slate-500">
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectGroup className="flex flex-col gap-1">
                    <SelectLabel>Tahun Ajaran</SelectLabel>
                    {academicYears.map((year) => (
                      <SelectItem
                        key={year}
                        value={year}
                        className="hover:bg-gray-50"
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.TA && formik.errors.TA && typeof formik.errors.TA === 'string' && (
                <p className="text-red-500 text-sm">{formik.errors.TA}</p>
              )}
              {formik.touched.TA && Array.isArray(formik.errors.TA) && (
                <p className="text-red-500 text-sm">{formik.errors.TA.join(', ')}</p>
              )}
            </div>

            {/* Tipe Kategori */}
            <div className="w-full flex flex-col gap-4">
              <Label>Tipe Kategori</Label>
              <Select
                value={formik.values.type}
                onValueChange={(val) => formik.setFieldValue("type", val)}
              >
                <SelectTrigger className="w-full py-6 px-3 border-slate-300 rounded-md text-slate-500">
                  <SelectValue placeholder="Pilih Tipe Kategori" />
                </SelectTrigger>
                <SelectContent className="border-none bg-white">
                  <SelectGroup className="flex flex-col gap-1">
                    <SelectLabel>Tipe Kategori</SelectLabel>
                    <SelectItem value="NORMAL" className="hover:bg-gray-50">
                      SPP
                    </SelectItem>
                    <SelectItem
                      value="UANG MASUK"
                      className="hover:bg-gray-50"
                    >
                      Uang Masuk
                    </SelectItem>
                    <SelectItem
                      value="DAFTAR ULANG"
                      className="hover:bg-gray-50"
                    >
                      Daftar Ulang
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-sm">
                  {formik.errors.type as string}
                </p>
              )}
            </div>

            {/* Nominal - full width */}
            <div className="w-full flex flex-col gap-4 col-span-2">
              <Label>Nominal</Label>
              <Input
                type="number"
                name="nominal"
                defaultValue={formik.values.nominal}
                onChange={(e) =>
                  formik.setFieldValue("nominal", Number(e.target.value))
                }
                placeholder="masukan nominal"
                className="border-slate-300 rounded-md px-3 py-6"
              />
              {formik.touched?.nominal && formik.errors?.nominal && (
                <p className="text-red-500 text-sm">
                  {formik.errors.nominal as string}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mt-6 flex gap-4 justify-end items-end">
            <Button type="submit" className="px-8 text-white bg-blue-500">
              Simpan
            </Button>
            <Button
              type="button"
              onClick={() => console.log("Cancel")}
              className="px-8 bg-red-500 text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateKategori;
