"use client";

import TablePengeluaran from "@/components/fragments/table-pengeluaran";
import CardInformation from "@/components/fragments/dashboard/card-information";
import { viewPengeluaran } from "@/data/view-pengeluaran";

import { FaMoneyBill, FaRegFile, FaUserGroup } from "react-icons/fa6";

export default function PengeluaranViewPage() {
  // Hitung total data dan total jumlah
  const totalData = viewPengeluaran.length;
  const totalJumlah = viewPengeluaran.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-full bg-gray-100 flex flex-col items-center py-8">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-[90%] mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="/img/Logo.png" alt="LapUang" className="h-8" />
        </div>
        <h1 className="text-2xl font-medium mb-2">Riwayat Pengeluaran</h1>
      </div>

      {/* Card Information */}
      <div className="w-full max-w-[90%] grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CardInformation
          color="blue"
          title="Total Data"
          value={totalData}
          icon={<FaRegFile size={40} className="text-blue-400" />}
        />
        <CardInformation
          color="green"
          title="Total Jumlah"
          value={" RP." +totalJumlah.toLocaleString("id-ID")}
          icon={<FaMoneyBill size={40} className="text-green-400" />}
        />
      </div>

      <div className="w-full max-w-[90%]">
        <TablePengeluaran />
      </div>
    </div>
  );
}