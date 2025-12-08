"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  pemasukan: number[];
  pengeluaran: number[];
}

const BarChart: React.FC<BarChartProps> = ({ pemasukan, pengeluaran }) => {
  const months = [
    "Jan","Feb","Mar","Apr","Mei","Jun",
    "Jul","Agu","Sep","Okt","Nov","Des",
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Pemasukan",
        data: pemasukan,
        backgroundColor: "rgba(46, 204, 113, 0.8)", // hijau
      },
      {
        label: "Pengeluaran",
        data: pengeluaran,
        backgroundColor: "rgba(231, 76, 60, 0.8)", // merah
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) =>
            `Rp. ${value.toLocaleString("id-ID")}`,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "60vh", paddingTop: "20px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
