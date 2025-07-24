'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartData {
  name: string;
  value: number;
}

interface DonutChartProps {
  title?: string;
  data: ChartData[];
}

const DonutChart: React.FC<DonutChartProps> = ({ title = 'Pengeluaran tahunan', data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const colorMap: Record<string, string> = {
    'Penerimaan': '#7A6FF0',
    'Pengeluaran': '#F77272',
    'Saldo awal': '#4AD991',
    'Saldo Akhir': '#FACA4B',
  };

  const option = {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
      data: data.map(d => d.name),
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: total.toFixed(2),
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
        },
        labelLine: {
          show: false,
        },
        data: data.map(item => ({
          ...item,
          itemStyle: {
            color: colorMap[item.name] || '#ccc'
          }
        })),
      }
    ],
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default DonutChart;

// Kalo mau isi donut. katanya dari BE nya begini fiz
// 'use client';

// import { useEffect, useState } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import DonutChart from './components/charts/DonutChart';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// export default function DashboardPage() {
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const fetchChartData = async () => {
//       const { data, error } = await supabase
//         .rpc('get_summary_donut'); // Bisa juga dari view atau table

//       if (error) {
//         console.error('Error fetching chart data:', error);
//       } else {
//         const transformed = [
//           { name: 'Penerimaan', value: data.penerimaan },
//           { name: 'Pengeluaran', value: data.pengeluaran },
//           { name: 'Saldo awal', value: data.saldo_awal },
//           { name: 'Saldo Akhir', value: data.saldo_akhir },
//         ];
//         setChartData(transformed);
//       }
//     };

//     fetchChartData();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-center text-lg font-semibold mb-4">Pengeluaran tahunan</h2>
//       <DonutChart data={chartData} />
//     </div>
//   );
// }

