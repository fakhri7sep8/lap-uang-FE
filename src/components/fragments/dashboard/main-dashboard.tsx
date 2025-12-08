"use client";
import AnimatedCounter from "./AnimatedCounter";
import Image from "next/image";
import FinanceCard from "@/components/fragments/financeCard";
import { Wallet } from "lucide-react";
import DonutPieChart from "../donutChart";
import MonthlyGroupedBarChart from "../monthlyFinanceChart";
import BarChart from "../candle-new";

import { useExpenseModule } from "@/hooks/expense/useExpense";
import { usePaymentModule } from "@/hooks/use-payment";
import { useSppPaymentModule } from "@/hooks/use-spp-payment";

import { calculateFinance } from "@/utils/financeCalculator";

export const MainDashboard = () => {
  // ==============================
  // FETCH DATA EXPENSE
  // ==============================
  const { useGetExpense } = useExpenseModule();
  const op = useGetExpense("Operasional");
  const pm = useGetExpense("Pemeliharaan");
  const uk = useGetExpense("Upah Karyawan");
  const mk = useGetExpense("Makan");

  const loadingExpenses =
    op.isLoading || pm.isLoading || uk.isLoading || mk.isLoading;

  const normalizeExpense = (x: any) => {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x?.data)) return x.data;
    if (Array.isArray(x?.data?.data)) return x.data.data;
    return [];
  };

  const allExpenses = [
    ...normalizeExpense(op.data),
    ...normalizeExpense(pm.data),
    ...normalizeExpense(uk.data),
    ...normalizeExpense(mk.data),
  ];

  // ==============================
  // FETCH PEMASUKAN — NON SPP
  // ==============================
  const { useGetPayments } = usePaymentModule();
  const { data: payments, isLoading: loadNonSPP } = useGetPayments();

  const normalizePay = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
  };

  const allPayments = normalizePay(payments);

  // ==============================
  // FETCH PEMASUKAN — SPP
  // ==============================
  const { useGetPayments: useGetSpp } = useSppPaymentModule();
  const { data: sppPayments, isLoading: loadSPP } = useGetSpp();

  const normalizeSPP = (x: any) => {
    if (!x) return [];
    if (Array.isArray(x)) return x;
    if (Array.isArray(x?.data)) return x.data;
    return [];
  };

  const allSpp = normalizeSPP(sppPayments);

  // ==============================
  // ⭐ PAKAI HELPER UNTUK HITUNG SEMUA
  // ==============================
  const {
    saldoSaatIni,
    totalPengeluaran,
    totalPemasukan,
    surplus,
    saldoAwalTahun,
    saldoAkhirTahun,
    pemasukanBulanan,
    monthlyExpense,
    monthlyData,
    percentageExpense,
    percentageIncome,
    percentageSurplus
  } = calculateFinance({
    expenses: allExpenses,
    payments: allPayments,
    spp: allSpp,
    saldoAwalTahun: 1300000,
  });


  const loading = loadSPP || loadNonSPP || loadingExpenses;

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className={"flex items-center flex-col gap-6 w-full pb-4"}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex">
          <h2 className="text-2xl font-semibold text-[#25BF65]">
            Ringkasan Pengeluaran
          </h2>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex md:flex-row flex-col gap-4 md:h-[264px] h-screen">
            {/* PANEL HITAM */}
            <div className="md:w-1/2 w-full bg-finance rounded-2xl flex flex-col gap-2 px-2 py-4 ">
              <div className="w-full h-1/3">
                <Image
                  src={"/img/Logo.png"}
                  alt="logo"
                  width={150}
                  height={150}
                />
              </div>

              <div className=" w-full h-1/3 flex justify-end items-center pr-6">
                <span className="text-[#dedede] text-6xl font-semibold flex items-start">
                  <AnimatedCounter value={saldoSaatIni} />
                </span>
              </div>

              <div className=" w-full h-1/3 px-6">
                <div className="w-full h-full flex justify-between items-center">
                  <div className="w-1/3 flex flex-col">
                    <span className="text-[#73F777] text-lg">owner</span>
                    <span className="text-[#b2b2b2] text-lg">Lap uang</span>
                  </div>

                  <div className="text-xl w-2/3 text-[#b2b2b2] gap-2 flex justify-end items-end h-full pb-4">
                    Saldo yang tersedia
                    <span className="text-[#73f777]">saat ini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KARTU FINANSIAL */}
            <div className="md:w-1/2 w-full flex gap-4">
              <div className="w-1/2">
                <FinanceCard
                  title={"Pendapatan Tahun Ini"}
                  amount={totalPemasukan}
                  percentage={percentageIncome}
                  type="income"
                  icon={<Wallet size={44} />}
                  isLoading={loading}
                />
              </div>

              <div className="w-1/2">
                <FinanceCard
                  title={"Pengeluaran Tahun Ini"}
                  amount={totalPengeluaran}
                  percentage={percentageExpense}
                  type="expense"
                  icon={<Wallet size={44} />}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>

          {/* =========================== */}
          {/* ROW KEDUA */}
          {/* =========================== */}
          <div className="w-full flex gap-4 h-[250px] flex-row">
            <div className="w-1/2 ">
              <FinanceCard
                title={"Surplus Tahun Ini"}
                amount={surplus}
                percentage={percentageSurplus}
                type="Surplus"
                icon={<Wallet size={44} />}
                isLoading={loading}
              />
            </div>

            <div className="w-1/2 flex gap-4">
              <div className="w-1/2">
                <FinanceCard
                  title={"Saldo Awal Tahun"}
                  amount={saldoAwalTahun}
                  percentage={0}
                  type="expense"
                  icon={<Wallet size={44} />}
                  isLoading={loading}
                />
              </div>
              <div className="w-1/2">
                <FinanceCard
                  title={"Saldo Akhir Tahun"}
                  amount={saldoAkhirTahun}
                  percentage={0}
                  type="expense"
                  icon={<Wallet size={44} />}
                  isLoading={loading}
                />
              </div>
            </div>
          </div>

          {/* =========================== */}
          {/* CHART */}
          {/* =========================== */}
          <div className="w-full flex gap-4 h-full flex-row">
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <h2 className=" text-center font-semibold text-2xl">
                Perbandingan Tahunan
              </h2>

              <DonutPieChart
                data={[
                  { name: "Penerimaan", value: totalPemasukan },
                  { name: "Pengeluaran", value: totalPengeluaran },
                ]}
              />
            </div>

            <div className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl">
              <h2 className=" text-center font-semibold text-2xl">
                Ringkasan Bulanan
              </h2>

              <MonthlyGroupedBarChart
                categories={[
                  "Penerimaan",
                  "Pengeluaran",
                  "Saldo awal",
                  "Saldo akhir",
                ]}
                monthlyData={monthlyData}
              />
            </div>
          </div>

          {/* =========================== */}
          {/* BAR CHART TERAKHIR */}
          {/* =========================== */}
          <div className="w-full flex gap-4 h-full flex-row">
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm">
              <BarChart
                pemasukan={pemasukanBulanan}
                pengeluaran={Object.values(monthlyExpense)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
