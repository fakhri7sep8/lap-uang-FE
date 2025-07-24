// pages/chart.tsx

import SaldoCard from "@/components/fragments/wallet";
import FinanceSummaryCard from "@/components/fragments/financeCard";

export default function ChartPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Visualisasi Keuangan Bulanan</h1>
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
            cardWidth={400} // Lebar yang lebih besar untuk kartu ini
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
              <div className=" flex">
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
}
