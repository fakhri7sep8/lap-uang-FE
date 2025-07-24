/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared'; 

// Registrasi komponen ECharts
echarts.use([
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer
]);

const MonthlyFinanceChart = () => {
  const monthCount = 12;
  const categoryNames = ['Pemasukan', 'Pengeluaran', 'Saldo Awal', 'Saldo Akhir'];
  const categoryCount = categoryNames.length;

  const xAxisData: string[] = [];
  const legendData: string[] = [];
  const dataList: number[][] = [];

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];

  for (let i = 0; i < monthCount; i++) {
    legendData.push(monthNames[i]);
    dataList.push([]);
  }

  xAxisData.push(...categoryNames);

  let currentOverallBalance = 5000000;

  for (let monthIdx = 0; monthIdx < monthCount; monthIdx++) {
    const initialBalanceThisMonth = currentOverallBalance;
    const monthlyIncome = Number((Math.random() * 8000000 + 2000000).toFixed(2));
    const monthlyExpenses = Number((Math.random() * 5000000 + 1000000).toFixed(2));
    const finalBalanceThisMonth = initialBalanceThisMonth + monthlyIncome - monthlyExpenses;
    currentOverallBalance = finalBalanceThisMonth;

    dataList[monthIdx].push(
      monthlyIncome,
      monthlyExpenses,
      initialBalanceThisMonth,
      finalBalanceThisMonth
    );
  }

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        // params can be an array or object depending on the trigger
        const paramArr = Array.isArray(params) ? params : [params];
        let tooltipContent = `Bulan: ${paramArr[0].seriesName}<br/>`;
        paramArr.forEach((param) => {
          tooltipContent += `
            ${param.marker} ${param.name}: <span style="font-weight: bold;">Rp${echarts.format.addCommas(param.value as any) }</span><br/>
          `;
        });
        return tooltipContent;
      }
    },
    legend: {
      data: legendData
    },
    dataZoom: [
      { type: 'slider', start: 0, end: 100 },
      { type: 'inside', start: 0, end: 100 }
    ],
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: 'Rp{value}'
      }
    },
    series: dataList.map((dataForMonth, monthIndex) => ({
      type: 'bar',
      animation: false,
      name: monthNames[monthIndex],
      itemStyle: { opacity: 0.7 },
      data: dataForMonth
    }))
  };

  return <ReactECharts option={option} style={{ height: 500 }} />;
};

export default MonthlyFinanceChart;
