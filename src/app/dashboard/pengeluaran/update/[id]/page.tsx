"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useExpenseModule } from "@/hooks/expense/useExpense";

export default function UpdatePengeluaranPage() {
  const { id } = useParams();
  const router = useRouter();

  const { useGetExpense, useUpdateExpense } = useExpenseModule();

  const { data: expenseData } = useGetExpense("");
  const { mutate } = useUpdateExpense(id as string);

  const [form, setForm] = useState({
    categoryId: "",
    PayDate: "",
    PihakPenerima: "",
    PenanggungJawab: "",
    JumlahItem: "",
    MetodePembayaran: "",
    Prioritas: "",
    SumberDana: "",
    Ukuran: "",
    SatuanUkuran: "",
    amount: 0,
    SubKategori: "",
    description: "",
  });

  useEffect(() => {
    if (!expenseData?.data) return;

    const d = expenseData.data.find((x: any) => x.id == id);
    if (!d) return;

    setForm({
      categoryId: d.categoryId || "",
      PayDate: dayjs(d.PayDate).format("YYYY-MM-DD"),
      PihakPenerima: d.PihakPenerima || "",
      PenanggungJawab: d.PenanggungJawab || "",
      JumlahItem: d.JumlahItem || "",
      MetodePembayaran: d.MetodePembayaran || "",
      Prioritas: d.Prioritas || "",
      SumberDana: d.SumberDana || "",
      Ukuran: d.Ukuran || "",
      SatuanUkuran: d.SatuanUkuran || "",
      amount: Number(d.amount) || 0,
      SubKategori: d.SubKategori || "",
      description: d.description || "",
    });
  }, [expenseData, id]);

  const updateData = () => {
    Swal.fire({
      title: "Update Data?",
      text: "Apakah Anda yakin ingin memperbarui data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16A34A",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
    }).then((res) => {
      if (res.isConfirmed) mutate(form);
    });
  };

  // Button batal → balik ke halaman sebelumnya
  const cancelUpdate = () => {
    Swal.fire({
      title: "Batalkan perubahan?",
      text: "Perubahan yang belum disimpan akan hilang.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Kembali",
    }).then((res) => {
      if (res.isConfirmed) router.back();
    });
  };

  const inputClass =
    "h-12 px-4 rounded-lg border border-gray-300 bg-white " +
    "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all";

  return (
    <div className="p-10 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold mb-10">Update Pengeluaran</h2>

      <div className="grid grid-cols-2 gap-x-10 gap-y-6">

        {/* Kategori */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Kategori</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
          >
            <option value="">Pilih Kategori</option>
            <option value="1">Kategori 1</option>
            <option value="2">Kategori 2</option>
          </select>
        </div>

        {/* Tanggal */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Tanggal Pembayaran</label>
          <input
            type="date"
            value={form.PayDate}
            onChange={(e) => setForm({ ...form, PayDate: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Pihak Penerima */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Pihak Penerima</label>
          <input
            value={form.PihakPenerima}
            onChange={(e) => setForm({ ...form, PihakPenerima: e.target.value })}
            className={inputClass}
            placeholder="Contoh: CV Bangun Jaya"
          />
        </div>

        {/* Penanggung Jawab */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Penanggung Jawab</label>
          <input
            value={form.PenanggungJawab}
            onChange={(e) => setForm({ ...form, PenanggungJawab: e.target.value })}
            className={inputClass}
            placeholder="Contoh: Pak Arif"
          />
        </div>

        {/* Jumlah Item */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Jumlah Item</label>
          <input
            value={form.JumlahItem}
            onChange={(e) => setForm({ ...form, JumlahItem: e.target.value })}
            className={inputClass}
            placeholder="Contoh: 10"
          />
        </div>

        {/* Metode Pembayaran */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
          <select
            value={form.MetodePembayaran}
            onChange={(e) =>
              setForm({ ...form, MetodePembayaran: e.target.value })
            }
            className={inputClass}
          >
            <option value="">Pilih Metode Pembayaran</option>
            <option value="TRANSFER">Transfer</option>
            <option value="TUNAI">Tunai</option>
          </select>
        </div>

        {/* Prioritas */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Prioritas</label>
          <select
            value={form.Prioritas}
            onChange={(e) =>
              setForm({ ...form, Prioritas: e.target.value })
            }
            className={inputClass}
          >
            <option value="">Pilih Prioritas</option>
            <option value="BIASA">Biasa</option>
            <option value="PENTING">Penting</option>
            <option value="GENTING">Genting</option>
          </select>
        </div>

        {/* Sumber Dana */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Sumber Dana</label>
          <input
            value={form.SumberDana}
            onChange={(e) => setForm({ ...form, SumberDana: e.target.value })}
            className={inputClass}
            placeholder="Dana BOS / Kas Operasional"
          />
        </div>

        {/* Ukuran */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Ukuran</label>
          <input
            value={form.Ukuran}
            onChange={(e) => setForm({ ...form, Ukuran: e.target.value })}
            className={inputClass}
            placeholder="Contoh: 25"
          />
        </div>

        {/* Satuan Ukuran */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Satuan Ukuran</label>
          <input
            value={form.SatuanUkuran}
            onChange={(e) => setForm({ ...form, SatuanUkuran: e.target.value })}
            className={inputClass}
            placeholder="Unit / Meter / Lembar"
          />
        </div>

        {/* Nominal */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nominal (Rp)</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
            className={inputClass}
            placeholder="1500000"
          />
        </div>

        {/* Sub Kategori */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Sub Kategori</label>
          <select
            value={form.SubKategori}
            onChange={(e) =>
              setForm({ ...form, SubKategori: e.target.value })
            }
            className={inputClass}
          >
            <option value="">Pilih Sub Kategori</option>
            <option value="A">Sub A</option>
            <option value="B">Sub B</option>
          </select>
        </div>

        {/* DESKRIPSI */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 bg-white 
            hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
            placeholder="Isi deskripsi pengeluaran..."
          ></textarea>
        </div>
      </div>

      {/* BUTTON ACTION */}
      <div className="flex justify-end mt-6 gap-6">
        <button
          onClick={cancelUpdate}
          className="px-6 py-2 bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-200 transition-all"
        >
          Batal
        </button>

        <button
          onClick={updateData}
          className="px-8 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-all flex items-center gap-2"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
