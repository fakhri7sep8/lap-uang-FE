/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

interface CandlestickDataItem {
  date: string;
  values: [number, number, number, number];
}

interface CandlestickChartProps {
  data: CandlestickDataItem[];
  date?: any;
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, date, height = 400 }) => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      backgroundColor: "rgba(245, 245, 245, 0.8)",
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      textStyle: {
        color: "#000",
      },
      formatter: (params: any) => {
        const item = params[0];
        const [open, close, low, high] = item.data;
        const displayDate = date?.[item.dataIndex] || data[item.dataIndex]?.date;
        return `
          <strong>${displayDate}</strong><br/>
          Open: ${open}<br/>
          Close: ${close}<br/>
          Low: ${low}<br/>
          High: ${high}
        `;
      },
    },
    xAxis: {
      type: "category",
      data: date || data.map((item) => item.date),
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: "dataMin",
      max: "dataMax",
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        type: "candlestick",
        name: "Harga",
        data: data.map((item) => item.values),
        itemStyle: {
          color: "#4CAF50",
          color0: "#F44336",
          borderColor: "#4CAF50",
          borderColor0: "#F44336",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

export default CandlestickChart;
