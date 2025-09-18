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

const BarChart = () => {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "Mei",
      "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ],
    datasets: [
      {
        label: "Pemasukan",
        data: [
          40000000000, 45000000000, 55000000000, 67000000000,
          75000000000, 82000000000, 90000000000, 87000000000,
          72000000000, 53000000000, 32000000000, 15000000000
        ],
        backgroundColor: "rgba(46, 204, 113, 0.8)", // hijau
      },
      {
        label: "Pengeluaran",
        data: [
          57000000000, 78000000000, 55000000000, 38000000000,
          49000000000, 32000000000, 34000000000, 43000000000,
          51000000000, 68000000000, 67000000000, 46000000000
        ],
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
          usePointStyle: true,   // biar jadi bulat/kotak kecil
          boxWidth: 12,          // lebar box
          boxHeight: 12,         // tinggi box
          padding: 20,           // jarak antar label
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return `Rp. ${value.toLocaleString("id-ID")}`;
          },
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
