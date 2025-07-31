import SaldoCard from "@/components/fragments/wallet";
import FinanceSummaryCard from "@/components/fragments/financeCard";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";
import FinanceBarChart from "@/components/fragments/financeBarChart";
import DonutFinanceChart from "@/components/fragments/donutChart";
import TopUpChartBox from "@/components/fragments/sideChart";
import BillingPieChart from "@/components/fragments/pieChart";

export const ChartPage: React.FC = () => {
  const { state } = useSidebar();
  return (
    <div
      key={state}
      className={`transition-all duration-300 ${
        state == "collapsed"
          ? "ml-15 flex items-center justify-between flex-col"
          : "ml-15 flex items-center justify-between flex-col"
      }`}
    >
      <div className="w-full">
        <div
          key={state}
          className={`${
            state == "collapsed"
              ? "w-[90%] min-h-56 mt-5 rounded-lg flex flex-col items-start justify-between ml-10 px-10 py-6 shadow shadow-md"
              : "w-[93%] min-h-56 mt-5 rounded-lg flex flex-col items-start justify-between px-10 py-6 shadow shadow-md"
          }`}
        >
          <div className="w-full mb-4">
            <h1 className="text-2xl font-semibold text-[#25BF65]">
              Ringkasan Keuangan
            </h1>
          </div>
          <div className="w-full flex gap-3">
            <div className="flex flex-col gap-6 flex-1">
              <SaldoCard saldo={130000000} ownerName="Lap Uang" />
              <FinanceSummaryCard
                title="Surplus"
                amount={3500000000}
                month="Juli"
                percentage={100}
                color="purple"
                logo="dompet_kosong"
                cardWidth={'100%'}
                cardHeight={240}

              />
            </div>
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex gap-6">
                <FinanceSummaryCard
                  title="Saldo awal bulan ini"
                  amount={100000000}
                  month="Juli"
                  percentage={59}
                  color="blue"
                  logo="dompet_masuk"
                  cardWidth={'40%'}
                  cardHeight={240}
                />
                <FinanceSummaryCard
                  title="Saldo akhir bulan ini"
                  amount={100000000}
                  month="Juli"
                  percentage={59}
                  color="yellow"
                  logo="dompet_masuk"
                  cardWidth={'40%'}
                  cardHeight={240}
                />
              </div>
              <div className="w-full flex gap-6">
                <FinanceSummaryCard
                  title="Penerimaan bulan ini"
                  amount={10000000}
                  month="Juli"
                  percentage={59}
                  color="green"
                  logo="dompet_masuk"
                  cardWidth={'40%'}
                  cardHeight={240}
                />
                <FinanceSummaryCard
                  title="Pengeluaran bulan ini"
                  amount={1000000000}
                  month="Juli"
                  percentage={15}
                  color="red"
                  logo="dompet_kosong"
                  cardWidth={'40%'}
                  cardHeight={240}
                />
              </div>
            </div>
          </div>
          {/* Batas */}
          <div className="w-full mt-10 flex flex-col md:flex-row gap-6">
            <div className=" md:w-[80%]">
              <FinanceBarChart />
            </div>
            <div className="w-1/2 h-1/2 md:flex justify-center">
              <DonutFinanceChart />
            </div>
          </div>
          {/* batas */}
          <div className="w-full flex justify-end">
            <h2 className="text-2xl font-semibold text-[#25BF65] my-10">
              Ringkasan Penerimaan
            </h2>
          </div>
          <div className="w-full flex flex-col-reverse md:flex-row gap-6">
            <div className="w-full md:w-[50%]">
              <TopUpChartBox width="100%" height="340px" />
            </div>
            <div className="w-1/2 md:w-[50%]">
              <BillingPieChart />
            </div>
          </div>
          <div className="w-full flex">
            <h2 className="text-2xl font-semibold text-[#25BF65] my-10">
              Ringkasan Pengeluaran
            </h2>
          </div>
          {/* Batas */}
          <div className="w-full flex flex-col md:flex-row-reverse gap-6">
            <div className="w-full md:w-[50%]">
              <TopUpChartBox width="100%" height="340px"  />
            </div>
            <div className="w-1/2 md:w-[50%]">
              <BillingPieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
