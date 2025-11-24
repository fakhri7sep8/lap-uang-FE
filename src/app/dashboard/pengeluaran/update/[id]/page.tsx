"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useExpenseModule } from "@/hooks/expense/useExpense";

export default function UpdatePengeluaranPage() {
  const { id } = useParams();
  const router = useRouter();

  const { useGetExpense, useUpdateExpense } = useExpenseModule();

  // 🔥 Ambil semua data dan cari yg ID cocok
  const { data: expenseData } = useGetExpense("");
  const { mutate } = useUpdateExpense(id as string);

  const [form, setForm] = useState({
    PayDate: "",
    description: "",
    PenanggungJawab: "",
    Prioritas: "",
    amount: 0,
    categoryId: "",
  });

  // 🔥 Set form jika data sudah ready
  useEffect(() => {
    if (!expenseData?.data) return;

    const d = expenseData.data.find((x: any) => x.id == id);
    if (!d) return;

    setForm({
      PayDate: dayjs(d.PayDate).format("YYYY-MM-DD"),
      description: d.description,
      PenanggungJawab: d.PenanggungJawab,
      Prioritas: d.Prioritas,
      amount: Number(d.amount),
      categoryId: d.categoryId,
    });
  }, [expenseData, id]);

  // 🔥 Update
  const updateData = () => {
    Swal.fire({
      title: "Update Data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
    }).then((res) => {
      if (res.isConfirmed) mutate(form);
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border">
      <h2 className="text-2xl font-semibold mb-6">Update Pengeluaran</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* TANGGAL */}
        <div>
          <label className="block mb-1">Tanggal Pengeluaran</label>
          <Input
            type="date"
            value={form.PayDate}
            onChange={(e) => setForm({ ...form, PayDate: e.target.value })}
          />
        </div>

        {/* PJ */}
        <div>
          <label className="block mb-1">Penanggung Jawab</label>
          <Input
            value={form.PenanggungJawab}
            onChange={(e) =>
              setForm({ ...form, PenanggungJawab: e.target.value })
            }
          />
        </div>

        {/* PRIORITAS */}
        <div>
          <label className="block mb-1">Prioritas</label>
          <Select
            value={form.Prioritas}
            onValueChange={(v) => setForm({ ...form, Prioritas: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Prioritas" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="BIASA">BIASA</SelectItem>
              <SelectItem value="PENTING">PENTING</SelectItem>
              <SelectItem value="GENTING">GENTING</SelectItem>
              <SelectItem value="SANGAT_GENTING">SANGAT GENTING</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NOMINAL */}
        <div>
          <label className="block mb-1">Nominal</label>
          <Input
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: Number(e.target.value) })
            }
          />
        </div>

        {/* DESKRIPSI */}
        <div className="col-span-2">
          <label className="block mb-1">Deskripsi</label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <Button onClick={updateData} className="bg-blue-600">
          Simpan
        </Button>

        <Button variant="destructive" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </div>
  );
}
