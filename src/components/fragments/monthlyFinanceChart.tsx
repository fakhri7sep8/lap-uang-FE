"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const MonthlyGroupedBarChart = ({
  categories,
  monthlyData,
}: {
  categories: string[];
  monthlyData: { [month: string]: number[] };
}) => {
  const months = Object.keys(monthlyData); // x-axis
  const series = categories.map((category, i) => ({
    name: category,
    type: "bar",
    data: months.map((month) => monthlyData[month][i]),
    emphasis: { focus: "series" },
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: formatRupiah,
      backgroundColor: "#ffffff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#000",
        fontSize: 12,
        fontWeight: "normal",
      },
      padding: 10,
      extraCssText:
        "box-shadow: 0 0 8px rgba(0, 0, 0, 0.1); border-radius: 6px;",
    },
    legend: {
      top: "top",
      itemWidth: 14,
      itemHeight: 14,
      icon: "rect",
      textStyle: {
        fontSize: 12,
        color: "#333",
      },
      itemGap: 20,
    },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { fontWeight: "bold" },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatRupiah(value),
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e0e0e0",
          type: "dashed",
        },
      },
    },
    grid: {
      top: 60,
      bottom: 50,
      left: 100,
      right: 40,
    },
    series,
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default MonthlyGroupedBarChart;
