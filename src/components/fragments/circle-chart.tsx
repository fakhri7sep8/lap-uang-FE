"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

const PieChart: React.FC = () => {
  const pieOption: EChartsOption = {
    series: [
      {
        name: "Laporan Keuangan",
        type: "pie",
        radius: ["60%", "80%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: true,
          position: "center",
          formatter: "{a|64}\n{b|Jobs}",
          rich: {
            a: {
              fontSize: 28,
              fontWeight: "bold",
              color: "#111827",
            },
            b: {
              fontSize: 16,
              color: "#9CA3AF",
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 20, name: "Done", itemStyle: { color: "#4CAF50" } },
          { value: 20, name: "Overdue work", itemStyle: { color: "#F44336" } },
          {
            value: 12,
            name: "Work finished late",
            itemStyle: { color: "#FF9800" },
          },
          { value: 12, name: "Processing", itemStyle: { color: "#2196F3" } },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <ReactECharts
        option={pieOption}
        style={{ height: "300px", width: "250px" }}
      />
      <div className="mt-4 flex flex-row justify-center gap-6 text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Done</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Overdue work</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span>Work finished late</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
