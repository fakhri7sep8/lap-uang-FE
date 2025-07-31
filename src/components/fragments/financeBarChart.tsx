'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useSidebar } from '../ui/sidebar';
import { Spline } from 'lucide-react';

interface FinanceBarChartProps {
  width?: string | number;
  height?: string | number;
  title?: string;
}

const FinanceBarChart: React.FC<FinanceBarChartProps> = ({
  width = 800,
  height = 340,
  title = 'Grafik Keuangan Bulanan'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [barSize, setBarSize] = useState(20);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const chartWidth = container.offsetWidth;
      const kategoriCount = 4;
      const bulanCount = 12;
      const totalBar = bulanCount * kategoriCount;
      const barWidth = Math.floor((chartWidth * 0.9) / (totalBar + 20));
      setBarSize(barWidth);
    }
  }, [width]);
   const { state } = useSidebar();

  const option = {
    color: [
      '#6BD6A9', // Penerimaan
      '#8B7DF7', // Pengeluaran
      '#F7C873', // Saldo awal
      '#FF7F7F', // Saldo akhir
      '#4FC3F7', '#FFD54F', '#81C784', '#BA68C8', '#FF8A65', '#A1887F', '#90A4AE', '#DCE775'
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      top: 10,
      itemWidth: 16,
      itemHeight: 16,
      textStyle: {
        fontSize: 14  
      }
    },
    grid: {
      left: '2%',
      right: '4%',
      bottom: '3%',
      top: 80, // kasih jarak buat legend & title
      containLabel: true
    },
    dataset: {
      dimensions: [
        'kategori',
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ],
      source: [
        {
          kategori: 'Penerimaan',
          Jan: 42000000, Feb: 38000000, Mar: 60000000, Apr: 75000000, Mei: 80000000, Jun: 87000000,
          Jul: 66000000, Agu: 70000000, Sep: 67000000, Okt: 65000000, Nov: 58000000, Des: 56000000
        },
        {
          kategori: 'Pengeluaran',
          Jan: 50000000, Feb: 42000000, Mar: 45000000, Apr: 60000000, Mei: 72000000, Jun: 69000000,
          Jul: 62000000, Agu: 61000000, Sep: 59000000, Okt: 60000000, Nov: 57000000, Des: 55000000
        },
        {
          kategori: 'Saldo awal',
          Jan: 30000000, Feb: 35000000, Mar: 38000000, Apr: 70000000, Mei: 74000000, Jun: 76000000,
          Jul: 50000000, Agu: 62000000, Sep: 57000000, Okt: 53000000, Nov: 48000000, Des: 45000000
        },
        {
          kategori: 'Saldo akhir',
          Jan: 47000000, Feb: 46000000, Mar: 50000000, Apr: 95000000, Mei: 93000000, Jun: 87000000,
          Jul: 58000000, Agu: 68000000, Sep: 63000000, Okt: 62000000, Nov: 54000000, Des: 51000000
        }
      ]
    },
    xAxis: {
      type: 'category',
      Splitline: { show: true },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true },
      axisLabel: {
        formatter: (value: number) => 'Rp.' + value.toLocaleString('id-ID')
      }
    },
    barCategoryGap: '30%',
    series: Array.from({ length: 12 }, (_, i) => ({
      type: 'bar',
      name: [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ][i],
      barWidth: barSize,
      emphasis: {
        focus: 'series'
      }
    }))
  };

  return (
    <div
    key={state}
      className={`${
            state == "collapsed"
              ? "rounded-2xl shadow-md bg-white w-full p-4"
              : "rounded-2xl shadow-md bg-white w-full p-4"
          }`}
      ref={containerRef}
      style={{ width }}
    >
      <div className="text-center pt-2 mb-2">
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
      </div>
      <ReactECharts option={option} style={{ width: '100%', height }} />
    </div>
  );
};

export default FinanceBarChart;
