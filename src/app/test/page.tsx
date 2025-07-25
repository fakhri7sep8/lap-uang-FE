import SaldoCard from "@/components/fragments/wallet";
import FinanceSummaryCard from "@/components/fragments/financeCard";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

export const ChartPage: React.FC = () => {
  const { state } = useSidebar();
  return (
    <div
      key={state}
      className={`p-6 transition-all duration-300 ${
        state == "collapsed"
          ? "ml-15 flex items-center justify-between"
          : "ml-[20rem] flex items-center justify-between"
      }`}
    >
      <div className="flex gap-2.5">
        <div className="flex flex-col justify-start items-stretch mb-8 flex-wrap gap-2.5">
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
        <div className="flex flex-col justify-start items-stretch mb-8 flex-wrap gap-2.5">
          <div className="flex flex-row justify-start items-stretch flex-wrap gap-2.5">
            <FinanceSummaryCard
              title="Saldo awal bulan ini"
              amount={100000000}
              month="Juli"
              percentage={59}
              color="blue"
              logo="dompet_masuk"
              cardWidth={320}
              cardHeight={200}
            />
            <FinanceSummaryCard
              title="Saldo akhir bulan ini"
              amount={100000000}
              month="Juli"
              percentage={59}
              color="yellow"
              logo="dompet_masuk"
              cardWidth={320}
              cardHeight={200}
            />
          </div>
          <div className="flex gap-2.5">
            <FinanceSummaryCard
              title="Penerimaan bulan ini"
              amount={10000000}
              month="Juli"
              percentage={59}
              color="green"
              logo="dompet_masuk"
              cardWidth={320}
              cardHeight={200}
            />
            <FinanceSummaryCard
              title="Pengeluaran bulan ini"
              amount={1000000000}
              month="Juli"
              percentage={15}
              color="red"
              logo="dompet_kosong"
              cardWidth={320}
              cardHeight={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};