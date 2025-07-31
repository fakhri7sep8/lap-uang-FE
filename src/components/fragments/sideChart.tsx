'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Dialog } from '@headlessui/react'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

type DataType = {
  name: string
  value: number
}

type Props = {
  width?: string | number
  height?: string | number
}

// Simulasi pengambilan data dari "database"
const fetchDataFromDatabase = async (): Promise<DataType[]> => {
  const dummyData = [
    'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
    'Jumadil Ula', 'Jumadil Akhir', 'Rajab', 'Sya\'ban',
    'Ramadhan', 'Syawal', 'Zulkaidah', 'Zulhijjah',
  ].map((name) => ({
    name,
    value: Math.floor(Math.random() * 30000000 + 5000000),
  }))
  
  return new Promise((resolve) => setTimeout(() => resolve(dummyData), 500))
}

const BarChartWithModal = ({ width = '100%', height = 300 }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<DataType[]>([])
  const fullTotal = data.reduce((sum, item) => sum + item.value, 0)

  useEffect(() => {
    const load = async () => {
      const result = await fetchDataFromDatabase()
      setData(result)
    }
    load()
  }, [])

  const shortData = data.slice(0, 4)

  const buildOption = (
    data: DataType[],
    barWidth = 30,
    barCategoryGap = '20%',
    isModal = false,
  ) => {
    return {
      title: {
        text: 'RP. ' + fullTotal.toLocaleString('id-ID'),
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#12B76A',
        },
        subtext: 'Rincian penerimaan',
        subtextStyle: {
          fontSize: 14,
          color: '#666',
        },
      },
      grid: {
        left: isModal ? 90 : 80  ,
        right: '5%',
        top: 60,
        bottom: 20,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 50000000 ,
        axisLabel: {
          formatter: (value: number) => 'Rp.' + value.toLocaleString('id-ID'),
          fontSize: 12,
          
        },
        splitLine: { show: true },
      },
      yAxis: {
        type: 'category',
        data: data.map((item) => item.name),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          fontSize: 12,
        },
        splitLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map(() => 50000000),
          barWidth,
          itemStyle: {
            color: '#D1FADF',
            borderRadius: [6, 6, 6, 6],
          },
          barGap: '-100%',
          barCategoryGap,
          z: 0,
        },
        {
          type: 'bar',
          data: data.map((item) => item.value),
          barWidth,
          itemStyle: {
            color: '#12B76A',
            borderRadius: [6, 6, 6, 6],
          },
          z: 1,
        },
      ],
    }
  }

  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">Loading data chart...</div>
  }

  return (
    <div className="bg-white rounded-xl shadow w-full h-full flex flex-col p-10">
      <div onClick={() => setIsOpen(true)} style={{ width, height, cursor: 'pointer' }}>
        <ReactECharts
          option={buildOption(shortData)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen bg-black/50 p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-4xl w-full p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">Detail 12 Bulan</Dialog.Title>
            <ReactECharts
              option={buildOption(data, 28, '10%', true)}
              style={{ height: '600px', width: '100%' }}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Tutup
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default BarChartWithModal
