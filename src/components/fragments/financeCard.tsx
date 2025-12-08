/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useEffect, useState } from "react";
import { CircleProgress } from "./progres_circle";

const colorMap: Record<string, string> = {
  green: "#25BF65",
  red: "#FF453A",
  indigo: "#9F9FF8",
};

interface FinanceCardProps {
  title: string;
  amount: number;               // nilai final
  percentage: number;
  icon: any;
  type: "income" | "expense" | "Surplus";
  isLoading?: boolean;          // penanda sedang hitung
}

const FinanceCard: FC<FinanceCardProps> = ({
  title,
  amount,
  percentage,
  icon,
  type,
  isLoading = false,
}) => {

  // COUNTER ANIMASI (naik dari 1 ke amount)
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setDisplayAmount(0); // mulai dari 1 saat loading
      return;
    }

    // jika sudah tidak loading → animasi naik ke nilai asli
    let start = 0;
    const duration = 800; // 0.8 detik
    const steps = 60; // frame
    const increment = amount / steps;

    const interval = setInterval(() => {
      start += increment;
      if (start >= amount) {
        clearInterval(interval);
        setDisplayAmount(amount);
      } else {
        setDisplayAmount(Math.floor(start));
      }
    }, duration / steps);

    return () => clearInterval(interval);

  }, [isLoading, amount]);

  // WARNA PROGRESS CIRCLE
  const [circleColor, setCircleColor] = useState("green");

  useEffect(() => {
    if (percentage < 0 && type === "income") setCircleColor("red");
    else if (percentage < 0 && type === "expense") setCircleColor("green");
    else if (type === "Surplus") setCircleColor(colorMap.indigo);
  }, [percentage, type]);

  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col justify-between w-full h-full p-6">
      <div className="w-full flex items-center h-full">
        <div className="flex flex-col gap-4 items-start w-full h-full">

          <div className="w-full h-1/3 flex justify-between items-center">
            {icon}

            <CircleProgress
              value={Number(percentage.toFixed(2))}
              size="md"
              color={circleColor}
            />
          </div>

          <div className="flex flex-col gap-1 items-start text-start mt-4">
            <p className=" text-sm text-gray-500">{title}</p>

            <p className="text-2xl font-semibold text-gray-900">
              Rp. {displayAmount.toLocaleString("id-ID")}
            </p>

            <p className="text-md text-gray-400">
              Tahun {new Date().getFullYear()}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FinanceCard;
