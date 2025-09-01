/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

type ChartData = {
  name: string;
  total: number;
  tercapai: number;
};

interface HorizontalProgressChartProps {
  fullData: ChartData[];
  modalTitle?: string; // Tambah prop untuk judul modal
}

const HorizontalProgressChart: React.FC<HorizontalProgressChartProps> = ({ fullData, modalTitle }) => {
  const [showModal, setShowModal] = useState(false);

  const dataToShow = fullData.slice(0, 4);
  const chartHeight = 60 * dataToShow.length + 60;
  const modalHeight = 60 * fullData.length + 60;
  const totalTercapai = fullData.reduce((acc, curr) => acc + curr.tercapai, 0);

  const getOption = (data: ChartData[]) => {
    const categories = data.map((item) => item.name);
    const totalMax = Math.max(...fullData.map((item) => item.total));
    const backgroundData = data.map(() => totalMax);
    const progressData = data.map((item) => item.tercapai);

    return {
      grid: {
        left: 110,
        right: 40,
        bottom: 60,
        top: 10,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any[]) => {
          const item = params.find((p) => p.seriesName === "Tercapai");
          const value = `Rp.${item.value.toLocaleString("id-ID")}`;
          return `<strong>${item.name}</strong><br />${value}`;
        },
      },
      xAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => `RP.${value.toLocaleString("id-ID")}`,
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#292D32",
            type: "solid",
          },
        },
        max: totalMax,
      },
      yAxis: {
        type: "category",
        data: categories,
        axisTick: { show: false },
        axisLabel: {
          fontWeight: "bold",
          fontSize: 14,
          color: "#374151",
          margin: 20,
        },
      },
      series: [
        {
          name: "Total",
          type: "bar",
          data: backgroundData,
          barWidth: 40,
          itemStyle: {
            color: "#e5e7eb",
            borderRadius: 10,
          },
          barGap: "-100%",
          barCategoryGap: "10%",
          z: 1,
        },
        {
          name: "Tercapai",
          type: "bar",
          data: progressData,
          barWidth: 40,
          itemStyle: {
            color: "#22c55e",
            borderRadius: 10,
          },
          z: 2,
        },
      ],
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">
          RP. {totalTercapai.toLocaleString("id-ID")}
        </h2>
        <p className="text-sm text-gray-500">{modalTitle ? modalTitle : "Rincian Penerimaan Semua Bulan"}</p>
      </div>
      <ReactECharts option={getOption(dataToShow)} style={{ height: chartHeight }} />
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 rounded-full bg-green-500 text-white text-sm shadow-md hover:bg-green-600 transition"
          onClick={() => setShowModal(true)}
        >
          Tampilkan Semua Bulan
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-center mb-4">
              {modalTitle ? modalTitle : "Rincian Penerimaan Semua Bulan"}
            </h3>
            <ReactECharts option={getOption(fullData)} style={{ height: modalHeight }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalProgressChart;