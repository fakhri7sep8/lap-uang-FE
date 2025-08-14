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
  const months = Object.keys(monthlyData);

  const source = categories.map((cat, i) => {
    const row: Record<string, string | number> = { category: cat };
    months.forEach((month) => {
      row[month] = monthlyData[month][i];
    });
    return row;
  });

  const option = {
    legend: {
      orient: "horizontal", // atau 'vertical'
      top: "top",
      itemWidth: 14, // lebar kotak
      itemHeight: 14, // tinggi kotak
      icon: "rect", // bentuk kotak
      textStyle: {
        fontSize: 12,
        color: "#333", // warna teks
      },
      itemGap: 20,
    },

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
    dataset: {
      dimensions: ["category", ...months],
      source,
    },
    xAxis: {
      type: "category",
      axisLabel: { fontWeight: "bold" },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#e0e0e0",
          type: "dashed",
        },
      },
    },
    yAxis: {
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
    series: months.map(() => ({ type: "bar" })),
    grid: {
      top: 50,
      bottom: 40,
      left: 120,
      right: 40,
    },
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default MonthlyGroupedBarChart;
