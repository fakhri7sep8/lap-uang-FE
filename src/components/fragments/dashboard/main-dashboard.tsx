import Image from "next/image";
import FinanceCard from "@/components/fragments/financeCard";
import { Wallet } from "lucide-react";
import DynamicPieChart from "../pieChart";
import HorizontalProgressChart from "../horizontalBar";
import MonthlyGroupedBarChart from "../monthlyFinanceChart";
import DonutPieChart from "../donutChart";
import CandlestickChart from "../candleStick";
const sampleDates = [
  "2023-11-01",
  "2023-11-02",
  "2023-11-03",
  "2023-11-04",
  "2023-11-05",
  "2023-11-06",
  "2023-11-07",
  "2023-11-08",
  "2023-11-09",
  "2023-11-10",
  "2023-11-11",
  "2023-11-12",
  "2023-11-13",
  "2023-11-14",
  "2023-11-15",
  "2023-11-16",
  "2023-11-17",
  "2023-11-18",
  "2023-11-19",
  "2023-11-20",
  "2023-11-21",
  "2023-11-22",
  "2023-11-23",
  "2023-11-24",
  "2023-11-25",
  "2023-11-26",
  "2023-11-27",
  "2023-11-28",
  "2023-11-29",
  "2023-11-30",
  "2023-12-01",
  "2023-12-02",
  "2023-12-03",
  "2023-12-04",
  "2023-12-05",
  "2023-12-06",
  "2023-12-07",
  "2023-12-08",
  "2023-12-09",
  "2023-12-10",
  "2023-12-11",
  "2023-12-12",
  "2023-12-13",
  "2023-12-14",
  "2023-12-15",
  "2023-12-16",
  "2023-12-17",
  "2023-12-18",
  "2023-12-19",
  "2023-12-20",
  "2023-12-21",
  "2023-12-22",
  "2023-12-23",
  "2023-12-24",
  "2023-12-25",
  "2023-12-26",
  "2023-12-27",
  "2023-12-28",
  "2023-12-29",
  "2023-12-30",
  "2023-12-31",
];

const sampleData = [
  [3431.79, 3460.22, 3401.75, 3480.1],
  [3460.22, 3478.66, 3440.02, 3495.0],
  [3478.66, 3445.12, 3430.55, 3480.77],
  [3445.12, 3459.99, 3431.0, 3467.23],
  [3459.99, 3470.15, 3442.1, 3482.45],
  [3470.15, 3495.88, 3459.77, 3500.0],
  [3495.88, 3503.45, 3480.55, 3515.99],
  [3503.45, 3512.23, 3488.9, 3520.5],
  [3512.23, 3500.88, 3489.0, 3525.8],
  [3500.88, 3519.45, 3495.44, 3530.12],
  [3519.45, 3522.76, 3501.99, 3535.0],
  [3522.76, 3510.33, 3499.2, 3532.0],
  [3510.33, 3530.66, 3500.88, 3541.77],
  [3530.66, 3548.0, 3510.22, 3555.55],
  [3548.0, 3551.88, 3529.1, 3560.88],
  [3551.88, 3533.77, 3520.0, 3562.22],
  [3533.77, 3515.33, 3501.99, 3540.0],
  [3515.33, 3522.01, 3495.33, 3539.8],
  [3522.01, 3544.12, 3508.99, 3555.1],
  [3544.12, 3530.99, 3510.55, 3550.75],
  [3530.99, 3550.0, 3522.88, 3567.88],
  [3550.0, 3571.22, 3530.01, 3588.0],
  [3571.22, 3590.55, 3560.1, 3600.33],
  [3590.55, 3580.66, 3570.22, 3599.0],
  [3580.66, 3599.88, 3560.33, 3608.88],
  [3599.88, 3611.0, 3585.55, 3625.0],
  [3611.0, 3600.77, 3589.44, 3620.44],
  [3600.77, 3588.33, 3575.99, 3610.0],
  [3588.33, 3595.12, 3569.88, 3609.9],
  [3595.12, 3577.77, 3560.0, 3599.88],
  [3577.77, 3588.66, 3550.33, 3605.0],
  [3588.66, 3602.44, 3571.77, 3618.99],
  [3602.44, 3622.55, 3590.12, 3630.0],
  [3622.55, 3610.1, 3598.77, 3629.88],
  [3610.1, 3599.55, 3587.33, 3615.0],
  [3599.55, 3580.77, 3570.11, 3600.0],
  [3580.77, 3568.44, 3550.66, 3590.33],
  [3568.44, 3575.66, 3549.99, 3599.44],
  [3575.66, 3555.88, 3535.33, 3578.88],
  [3555.88, 3530.99, 3520.77, 3560.0],
  [3530.99, 3542.0, 3515.33, 3555.77],
  [3542.0, 3522.33, 3508.44, 3550.0],
  [3522.33, 3500.11, 3490.88, 3530.88],
  [3500.11, 3490.55, 3480.22, 3515.99],
  [3490.55, 3480.33, 3469.44, 3500.77],
  [3480.33, 3492.11, 3460.66, 3505.66],
  [3492.11, 3477.88, 3465.99, 3499.99],
  [3477.88, 3468.22, 3450.55, 3488.88],
  [3468.22, 3475.33, 3445.77, 3489.33],
  [3475.33, 3490.11, 3460.33, 3500.0],
  [3490.11, 3511.55, 3478.88, 3522.33],
  [3511.55, 3500.88, 3480.99, 3515.0],
  [3500.88, 3512.66, 3491.33, 3525.88],
  [3512.66, 3499.77, 3480.44, 3510.33],
  [3499.77, 3508.88, 3475.0, 3520.77],
  [3508.88, 3515.44, 3490.22, 3522.0],
  [3515.44, 3533.22, 3505.11, 3540.0],
  [3533.22, 3548.11, 3515.33, 3559.99],
  [3548.11, 3538.33, 3520.22, 3560.77],
  [3538.33, 3529.1, 3505.88, 3545.44],
  [3529.1, 3510.99, 3488.77, 3530.33],
  [3510.99, 3522.11, 3495.44, 3539.11],
];


export const MainDashboard = () => {
  return (
    <div className={"flex items-center flex-col gap-6 w-full pb-4"}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex">
          <h2 className="text-2xl font-semibold text-[#25BF65]">
            Ringkasan Pengeluaran
          </h2>
        </div>
        <div className="w-full flex flex-col gap-4  ">
          <div className="w-full flex md:flex-row flex-col gap-4 md:h-[264px] h-screen">
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
                  Rp.130.000.000
                </span>
              </div>
              <div className=" w-full h-1/3 px-6">
                <div className="w-full h-full flex justify-between items-center">
                  <div className="w-1/3 flex flex-col">
                    <span className="text-[#73F777] text-lg">owner</span>
                    <span className="text-[#b2b2b2] text-lg">Lap uang</span>
                  </div>
                  <div className="text-xl w-2/3  text-[#b2b2b2] gap-2 flex justify-end items-end h-full pb-4">
                    saldo yang tersedia
                    <span className="text-[#73f777]">saat ini</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full flex gap-4">
              <div className="w-1/2">
                <FinanceCard
                  title={"Pendapatan Tahun Ini"}
                  amount={1230000000}
                  
                  percentage={-30}
                  type="income"
                  icon={<Wallet size={44} />}
                />
              </div>
              <div className="w-1/2">
                <FinanceCard
                  title={"Pengeluaran Tahun Ini"}
                  amount={1230000000}
                  
                  percentage={-30}
                  type="expense"
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4 h-[250px] flex-row">
            <div className="w-1/2 ">
              <FinanceCard
                title={"Pengeluaran Tahun Ini"}
                amount={1230000000}
                
                percentage={-30}
                type="Surplus"
                icon={<Wallet size={44} />}
              />
            </div>
            <div className="w-1/2 flex gap-4">
              <div className="w-1/2">
                <FinanceCard
                  title={"Pengeluaran Tahun Ini"}
                  amount={1230000000}
                  
                  percentage={-30}
                  type="expense"
                  icon={<Wallet size={44} />}
                />
              </div>
              <div className="w-1/2">
                <FinanceCard
                  title={"Pengeluaran Tahun Ini"}
                  amount={1230000000}
                  
                  percentage={-30}
                  type="expense"
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex gap-4 h-full flex-row">
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <h2 className=" text-center font-semibold text-2xl">
                Pengeluaran tahunan
              </h2>
              <DonutPieChart
                data={[
                  { name: "Penerimaan", value: 30000000 },
                  { name: "Pengeluaran", value: 25000000 },
                  { name: "Saldo awal", value: 40000000 },
                  { name: "Saldo akhir", value: 45000000 },
                ]}
              />
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <h2 className=" text-center font-semibold text-2xl">
                Pengeluaran tahunan
              </h2>
              <MonthlyGroupedBarChart
                categories={[
                  "Penerimaan",
                  "Pengeluaran",
                  "Saldo awal",
                  "Saldo akhir",
                ]}
                monthlyData={{
                  Jan: [43000000, 44000000, 60000000, 30000000],
                  Feb: [35000000, 33000000, 48000000, 20000000],
                  Mar: [51000000, 39000000, 56000000, 29000000],
                  Apr: [45000000, 47000000, 50000000, 35000000],
                  Mei: [62000000, 50000000, 61000000, 44000000],
                  Jun: [82000000, 68000000, 83000000, 56000000],
                  Jul: [67000000, 59000000, 75000000, 47000000],
                  Agu: [71000000, 60000000, 72000000, 50000000],
                  Sep: [40000000, 37000000, 45000000, 30000000],
                  Okt: [58000000, 54000000, 62000000, 43000000],
                  Nov: [63000000, 49000000, 64000000, 52000000],
                  Des: [54000000, 43000000, 57000000, 41000000],
                }}
              />
            </div>
          </div>
          <div className="w-full flex gap-4 h-full flex-row">
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <CandlestickChart
                data={sampleDates.map((date, idx) => ({
                  date,
                  values: sampleData[idx] as [number, number, number, number],
                }))}
              />
            </div>
          </div>
          <div className="w-full flex gap-4 h-full flex-row-reverse">
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <DynamicPieChart
                data={[
                  { name: "Tagihan total", value: 120750000 },
                  { name: "Tercapai", value: 23200000 },
                  { name: "Sisa", value: 97550000 },
                  { name: "Biaya Operasional", value: 11250000 },
                ]}
              />
            </div>
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <HorizontalProgressChart
              modalTitle="Detail Pemasukan"
                fullData={[
                  { name: "Akhi...", total: 20000000, tercapai: 13000000 },
                  { name: "Rajab", total: 18000000, tercapai: 17000000 },
                  { name: "HSN", total: 15000000, tercapai: 9000000 },
                  { name: "Haol", total: 25000000, tercapai: 14000000 },
                  { name: "Syaban", total: 17000000, tercapai: 15000000 },
                  { name: "Ramadhan", total: 20000000, tercapai: 19000000 },
                  { name: "Syawal", total: 16000000, tercapai: 12000000 },
                  { name: "Dzulqaidah", total: 21000000, tercapai: 18000000 },
                  { name: "Dzulhijjah", total: 22000000, tercapai: 19000000 },
                  { name: "Muharram", total: 20000000, tercapai: 15000000 },
                  { name: "Safar", total: 18000000, tercapai: 14000000 },
                  { name: "Rabiul Awal", total: 19000000, tercapai: 17000000 },
                ]}
              />
            </div>
          </div>
          <div className="w-full flex gap-4 h-full flex-row">
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <DynamicPieChart
                data={[
                  { name: "Tagihan total", value: 120750000 },
                  { name: "Tercapai", value: 23200000 },
                  { name: "Sisa", value: 97550000 },
                  { name: "Biaya Operasional", value: 11250000 },
                ]}
              />
            </div>
            <div className="w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out">
              <HorizontalProgressChart modalTitle="Detail Pengeluaran"
                fullData={[
                  { name: "Akhi...", total: 20000000, tercapai: 13000000 },
                  { name: "Rajab", total: 18000000, tercapai: 17000000 },
                  { name: "HSN", total: 15000000, tercapai: 9000000 },
                  { name: "Haol", total: 25000000, tercapai: 14000000 },
                  { name: "Syaban", total: 17000000, tercapai: 15000000 },
                  { name: "Ramadhan", total: 20000000, tercapai: 19000000 },
                  { name: "Syawal", total: 16000000, tercapai: 12000000 },
                  { name: "Dzulqaidah", total: 21000000, tercapai: 18000000 },
                  { name: "Dzulhijjah", total: 22000000, tercapai: 19000000 },
                  { name: "Muharram", total: 20000000, tercapai: 15000000 },
                  { name: "Safar", total: 18000000, tercapai: 14000000 },
                  { name: "Rabiul Awal", total: 19000000, tercapai: 17000000 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};
