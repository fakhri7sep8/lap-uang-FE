'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

const BillingPieChart = () => {
  // Dummy data (nanti tinggal kamu ganti pake realtime/database)
  const totalTagihan = 120_750_000;
  const tercapai = 23_200_000;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>Rp.{c}',
    },
    legend: {
      show: true,
      bottom: 10,
      left: 'center',
      data: ['Tagihan total', 'Tercapai'],
      textStyle: {
        color: '#333',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        label: {
          show: true,
          formatter: '{b}\nRp.{c}',
          fontSize: 12,
          color: '#666',
          lineHeight: 20,
        },
        labelLine: {
          length: 15,
          length2: 10,
          smooth: true,
        },
        data: [
          {
            value: totalTagihan,
            name: 'Tagihan total',
            itemStyle: { color: '#6BD6A9' },
          },
          {
            value: tercapai,
            name: 'Tercapai',
            itemStyle: { color: '#8B7DF7' },
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="w-full h-[320px] md:h-[388px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default BillingPieChart;
