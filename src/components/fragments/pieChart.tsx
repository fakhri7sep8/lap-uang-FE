/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import ReactECharts from 'echarts-for-react'

// Dummy data, bisa diganti dari API/database

interface typedata {
  name: string;
  value: number;
}

const DynamicPieChart = ({ data }: { data: typedata[]}) => {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: typedata) => {
        const valueFormatted = `Rp.${params.value.toLocaleString('id-ID')}`
        return `<strong>${params.name}</strong><br/>${valueFormatted}`
      }
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: {
        color: '#888'
      }
    },
    series: [
      {
        name: 'Data',
        type: 'pie',
        radius: '60%',
        center: ['50%', '45%'],
        data: data,
        label: {
          formatter: (params: typedata) => {
            const valueFormatted = `Rp.${params.value.toLocaleString('id-ID')}`
            return `{b|${params.name}}\n{v|${valueFormatted}}`
          },
          rich: {
            b: {
              fontSize: 12,
              color: '#666'
            },
            v: {
              fontSize: 13,
              color: '#68C3A3',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          length: 15,
          length2: 20,
          smooth: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }
    ]
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default DynamicPieChart
