'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function HomePage() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Grafik Waterfall Keuangan',
        subtext: 'Pendapatan & Pengeluaran Harian',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          const tar = params.find((p: any) => p.value !== '-' && p.seriesName !== 'Placeholder');
          if (!tar) return '';
          return `${tar.name}<br/>${tar.seriesName}: Rp ${Number(tar.value).toLocaleString()}`;
        }
      },
      legend: {
        data: ['Expenses', 'Income'],
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 11 }, (_, i) => `Nov ${i + 1}`)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => `Rp ${val / 1000}rb`
        }
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          silent: true,
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
        },
        {
          name: 'Income',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }: any) => value !== '-' ? `+Rp ${Number(value).toLocaleString()}` : ''
          },
          itemStyle: {
            color: '#6fcf97'
          },
          data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
        },
        {
          name: 'Expenses',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'bottom',
            formatter: ({ value }: any) => value !== '-' ? `-Rp ${Number(value).toLocaleString()}` : ''
          },
          itemStyle: {
            color: '#eb5757'
          },
          data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
        }
      ]
    };

    chart.setOption(option);
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div
        ref={chartRef}
        className="w-full max-w-5xl h-[550px] bg-white rounded-xl shadow-md"
      />
    </div>
  );
}
