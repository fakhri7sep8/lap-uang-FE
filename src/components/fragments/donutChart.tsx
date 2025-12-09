/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

type DonutPieChartDataItem = {
  value: number;
  name: string;
};

interface DonutPieChartProps {
  data: DonutPieChartDataItem[];
  height?: number;
}

const DonutPieChart: React.FC<DonutPieChartProps> = ({ data, height = 400 }) => {
  const chartRef = useRef<any>(null);
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  // Option tanpa centerValue
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 14
      },
      formatter: (params: any) => {
        return `
          <div style="padding: 6px 8px;">
            <strong>${params.name}</strong><br/>
            Nilai: ${params.value.toLocaleString()}<br/>
            Persentase: ${params.percent}%
          </div>
        `;
      }
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    graphic: [
      {
        id: 'centerText',
        type: 'group',
        left: 'center',
        top: 'center',
        children: [
          {
            type: 'text',
            id: 'dynamicText',
            style: {
              text: totalValue.toLocaleString(),
              fontSize: 30,
              fontWeight: 'bold',
              fill: '#333'
            }
          }
        ]
      }
    ],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: false
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  };

  // Event hanya update graphic text, tidak trigger re-render React
  const onEvents = {
    mouseover: (params: any) => {
      const chart = chartRef.current?.getEchartsInstance();
      if (chart) {
        chart.setOption({
          graphic: {
            id: 'dynamicText',
            style: {
              text: params.value.toLocaleString()
            }
          }
        });
      }
    },
    mouseout: () => {
      const chart = chartRef.current?.getEchartsInstance();
      if (chart) {
        chart.setOption({
          graphic: {
            id: 'dynamicText',
            style: {
              text: totalValue.toLocaleString()
            }
          }
        });
      }
    },
    click: (params: any) => {
      const chart = chartRef.current?.getEchartsInstance();
      if (chart) {
        chart.setOption({
          graphic: {
            id: 'dynamicText',
            style: {
              text: params.value.toLocaleString()
            }
          }
        });
      }
    }
  };

  // Pastikan text di tengah reset ke total saat mount
  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      chart.setOption({
        graphic: {
          id: 'dynamicText',
          style: {
            text: `${totalValue.toLocaleString()}`
          }
        }
      });
    }
  }, [totalValue]);

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={{ height }}
      onEvents={onEvents}
    />
  );
};

export default DonutPieChart;
