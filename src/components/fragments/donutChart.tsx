"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { useSidebar } from "../ui/sidebar";

interface DonutFinanceChartProps {
  width?: string | number;
  height?: string | number;
  data?: { name: string; value: number }[];
  total?: number;
  title?: string;
}

const DonutFinanceChart: React.FC<DonutFinanceChartProps> = ({
  total = 537.55,
  title = "Pengeluaran Tahunan",
  data = [
    { value: 150, name: "Penerimaan" },
    { value: 200, name: "Pengeluaran" },
    { value: 120, name: "Saldo Awal" },
    { value: 67.55, name: "Saldo Akhir" },
  ],
  width = 500,
  height = 340,
}) => {
  const colorMap: Record<string, string> = {
    Penerimaan: "#6C63FF",
    Pengeluaran: "#FF6B6B",
    "Saldo Awal": "#00D1FF",
    "Saldo Akhir": "#FFD644",
  };
  const { state } = useSidebar();

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: Rp.{c} ({d}%)",
    },
    legend: {
      show: false, // Sembunyikan legend bawaan
    },
    series: [
      {
        name: "Keuangan",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "center",
          formatter: `Rp.${total}`,
          fontSize: 24,
          fontWeight: "bold",
          color: "#333",
        },
        labelLine: {
          show: false,
        },
        data: data.map((item) => ({
          ...item,
          itemStyle: { color: colorMap[item.name] },
        })),
      },
    ],
  };

  return (
    <div
      key={state}
      className={`${
        state == "collapsed"
          ? "rounded-2xl shadow-md bg-white p-4 w-[704px] flex flex-col items-center ml-6 justify-center"
          : "rounded-2xl shadow-md bg-white p-4 flex flex-col items-center justify-center "
      }`}
    >
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ReactECharts
        option={option}
        style={{
          width: typeof width === "number" ? `500px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      />
      {/* Custom legend 2 kolom, 2 baris di bawah chart */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full max-w-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="inline-block rounded-full"
              style={{
                width: 12,
                height: 12,
                background: colorMap[item.name],
              }}
            />
            <span className="text-xs">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutFinanceChart;
