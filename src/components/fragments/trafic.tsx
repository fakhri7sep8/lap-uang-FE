"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

const TrafficChart: React.FC = () => {
  const options: EChartsOption = {
    title: {
      text: "Traffic by Device",
      left: "center",
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"],
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [15000, 30000, 25000, 32000, 12000, 26000],
        type: "bar",
        itemStyle: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          color: (params: any) => {
            const colors = [
              "#FF9800",
              "#00C4B4", 
              "#000000", 
              "#90CAF9", 
              "#B0BEC5", 
              "#A5D6A7", 
            ];
            return colors[params.dataIndex];
          },
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: "40%",
      },
    ],
    grid: {
      top: 40,
      bottom: 30,
      left: 30,
      right: 10,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-[650px] h-[400px]">
      <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default TrafficChart;
