import { FaFileInvoiceDollar } from "react-icons/fa";
import { useSidebar } from "../ui/sidebar";

interface SaldoCardProps {
  saldo: number;
  ownerName: string;
  icon?: React.ReactNode;
  cardWidth?: number | string;
  cardHeight?: number | string;
}

export default function SaldoCard({
  saldo,
  ownerName,
  cardWidth = 557,
  cardHeight = 240,
}: SaldoCardProps) {
  const { state } = useSidebar();
  return (
    <div key={state}
      className="rounded-xl p-5 w-full shadow-md flex flex-col justify-between"
      style={{
        backgroundColor: "#CCE2D0",
        width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,
        height: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,
      }}
    >
      <div className="text-sm text-gray-600 text-[20px]">Saldo yang tersedia saat ini</div>

      <div className="text-3xl font-semibold text-gray-800">
        RP. {saldo.toLocaleString("id-ID")}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <div>
          <div>Owner</div>
          <div className="font-medium text-gray-700">{ownerName}</div>
        </div>
        <div className="flex items-center gap-2 text-blue-800 font-semibold">
          <img src="/img/logo.png" alt=""  className="w-26 "/>
        </div>
      </div>
    </div>
  );
}
