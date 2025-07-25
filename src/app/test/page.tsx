import SaldoCard from "@/components/fragments/wallet";
import FinanceSummaryCard from "@/components/fragments/financeCard";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

export const ChartPage: React.FC = () => {
  const { state } = useSidebar();
  return (
    <div className="">
      <div
        key={state}
        className={`transition-all duration-300 ${
          state == "collapsed"
            ? "ml-5 flex items-center justify-between"
            : "ml-[18rem] flex items-center justify-between"
        }`}
      >
        <div className="w-[90%] min-h-56 bg-white ml-16 mt-5 rounded-lg flex flex-row items-start justify-between gap-6 p-6 shadow">
          <div className="flex flex-col gap-6 flex-1">
            <SaldoCard saldo={130000000} ownerName="Lap Uang" />
            <FinanceSummaryCard
              title="Surplus"
              amount={3500000000}
              month="Juli"
              percentage={100}
              color="purple"
              logo="dompet_kosong"
              cardWidth={400}
              cardHeight={200}
            />
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex gap-6">
              <FinanceSummaryCard
                title="Saldo awal bulan ini"
                amount={100000000}
                month="Juli"
                percentage={59}
                color="blue"
                logo="dompet_masuk"
                cardWidth={340}
                cardHeight={200}
              />
              <FinanceSummaryCard
                title="Saldo akhir bulan ini"
                amount={100000000}
                month="Juli"
                percentage={59}
                color="yellow"
                logo="dompet_masuk"
                cardWidth={340}
                cardHeight={200}
              />
            </div>
            <div className="flex gap-6">
              <FinanceSummaryCard
                title="Penerimaan bulan ini"
                amount={10000000}
                month="Juli"
                percentage={59}
                color="green"
                logo="dompet_masuk"
                cardWidth={340}
                cardHeight={200}
              />
              <FinanceSummaryCard
                title="Pengeluaran bulan ini"
                amount={1000000000}
                month="Juli"
                percentage={15}
                color="red"
                logo="dompet_kosong"
                cardWidth={340}
                cardHeight={200}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};