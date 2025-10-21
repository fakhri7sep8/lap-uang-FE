"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import * as Yup from "yup";
import currency from "currency.js";

const createCategorySchema = Yup.object().shape({
  name: Yup.string().required("Nama kategori wajib diisi"),
  semester: Yup.number()
    .required("Semester wajib diisi")
    .min(1, "Minimal semester 1")
    .max(8, "Maksimal semester 8"),
  TA: Yup.string().required("Tahun ajaran wajib diisi"),
  type: Yup.string().oneOf(["NORMAL", "INSTALLMENT"], "Tipe tidak valid"),
  nominal: Yup.number()
    .required("Nominal wajib diisi")
    .min(0, "Nominal minimal 0"),
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
const formatRupiah = (value: number | string) =>
  currency(value || 0, {
    symbol: "Rp",
    separator: ".",
    decimal: ",",
    precision: 0,
  }).format();

const CreateKategori = () => {
  const { useCreateCategory } = useCategoryPaymentModule();
  const { mutate } = useCreateCategory();

  const formik = useFormik({
    initialValues: {
      name: "",
      semester: "",
      TA: "",
      type: "",
      nominal: "",
    },
    validationSchema: createCategorySchema,
    onSubmit: (values) => {
      console.log("Create category:", values);
      mutate.mutate(values);
    },
  });

  return (
    <section className="min-h-screen pt-10">
      <div className="bg-white rounded-xl p-8 max-w-full w-full mx-auto shadow-md flex flex-col items-center">
        <h1 className="w-full text-2xl font-semibold mb-6">
          Tambah Kategori Pembayaran
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col gap-8 justify-between"
        >
          <div className="w-full grid grid-cols-2 gap-6">
            {/* Nama Kategori */}
            <div className="w-full flex flex-col gap-4">
              <Label>Nama Kategori</Label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="masukan nama kategori"
                className="border-slate-300 rounded-md px-3 py-6"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            {/* Semester */}
            <div className="w-full flex flex-col gap-4">
              <Label>Semester</Label>
              <Select
                value={formik.values.semester.toString()}
                onValueChange={(val) =>
                  formik.setFieldValue("semester", Number(val))
                }
              >
                <SelectTrigger className="w-full py-6 px-3 border-slate-300 rounded-md text-slate-500">
                  <SelectValue placeholder="Pilih Semester" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
                  <SelectGroup>
                    <SelectLabel>Semester</SelectLabel>
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        {sem}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.semester && formik.errors.semester && (
                <p className="text-red-500 text-sm">{formik.errors.semester}</p>
              )}
            </div>

            {/* Tahun Ajaran */}
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
              {formik.touched.TA && formik.errors.TA && (
                <p className="text-red-500 text-sm">{formik.errors.TA}</p>
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
                      Normal
                    </SelectItem>

                    <SelectItem
                      value="INSTALLMENT"
                      className="hover:bg-gray-50"
                    >
                      Cicilan
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-sm">{formik.errors.type}</p>
              )}
            </div>

            {/* Nominal */}
            <div className="w-full flex flex-col gap-4 ">
              <Label>Nominal</Label>
              <Input
                type="text"
                name="nominal"
                value={formatRupiah(formik.values.nominal)}
                onChange={(e) => {
                  // Ambil hanya angka dari input
                  const rawValue = e.target.value.replace(/[^0-9]/g, "");
                  // Simpan ke formik sebagai number
                  formik.setFieldValue(
                    "nominal",
                    rawValue ? Number(rawValue) : ""
                  );
                }}
                placeholder="masukan nominal"
                className="border-slate-300 text-slate-500 rounded-md px-3 py-6"
              />
              {formik.touched.nominal && formik.errors.nominal && (
                <p className="text-red-500 text-sm">{formik.errors.nominal}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full mt-6 flex gap-4 justify-end items-end">
            <Button
              type="submit"
              className="px-8 text-white bg-blue-500"
              disabled={mutate.isPending} // disable saat loading
            >
              {mutate.isPending ? "Loading..." : "Simpan"}
            </Button>
            <Button
              type="button"
              onClick={() => formik.resetForm()}
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

export default CreateKategori;
