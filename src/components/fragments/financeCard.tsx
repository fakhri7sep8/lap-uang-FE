import { FC } from "react";
import { CircleProgress } from "./progres_circle"; // pastikan ini adalah komponen milikmu

const colorMap: Record<string, string> = {
  green: "#25BF65",
  red: "#FF453A",
  velvet: "#9F9FF8",
  blue: "#6186CC",
  yellow: "#F4CF3B",
};

interface CardWithCircleProps {
  logo: string;
  logoWidth?: number | string;
  logoHeight?: number | string;
  color?: keyof typeof colorMap;
  title: string;
  amount: number;
  month: string;
  percentage: number;
  cardWidth?: number | string;
  cardHeight?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
}

const CardWithCircle: FC<CardWithCircleProps> = ({
  logo,
  logoWidth = 50,
  logoHeight = 50,
  color = "green",
  title,
  amount,
  month,
  percentage,
  cardWidth = 180,
  cardHeight = 140,
  paddingX = 24, // default px-4 => 1rem => 16px
  paddingY = 16, // default py-4
}) => {
  const circleColor = colorMap[color] || colorMap.green;

  return (
    <div
      className="bg-white rounded-xl shadow-md flex flex-col justify-between"
      style={{
        width: typeof cardWidth === "number" ? `${cardWidth}px` : cardWidth,
        height: typeof cardHeight === "number" ? `${cardHeight}px` : cardHeight,
        paddingLeft: typeof paddingX === "number" ? `${paddingX}px` : paddingX,
        paddingRight: typeof paddingX === "number" ? `${paddingX}px` : paddingX,
        paddingTop: typeof paddingY === "number" ? `${paddingY}px` : paddingY,
        paddingBottom: typeof paddingY === "number" ? `${paddingY}px` : paddingY,
      }}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col gap-3.5">
          <img
            src={`/img/${logo}.png`}
            alt={logo}
            style={{
              width:
                typeof logoWidth === "number" ? `${logoWidth}px` : logoWidth,
              height:
                typeof logoHeight === "number" ? `${logoHeight}px` : logoHeight,
            }}
          />
          <div className="flex flex-col gap-2 items-start text-start">
            <p className="text-lg text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-900">
              Rp. {amount.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-gray-400">Bulan {month}</p>
          </div>
        </div>

        <div className="mb-20">
          <CircleProgress value={percentage} size="lg" color={circleColor} />
        </div>
      </div>
    </div>
  );
};

export default CardWithCircle;
