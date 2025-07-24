'use client';

import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

type TopUpHorizontalChartProps = {
  data: number[];
  labels: string[];
};

const TopUpHorizontalChartWithModal: React.FC<TopUpHorizontalChartProps> = ({
  data,
  labels,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getOption = (sliceCount: number) => ({
    xAxis: { max: 'dataMax' },
    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      max: sliceCount,
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        name: 'Top Up',
        type: 'bar',
        data: data,
        realtimeSort: true,
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
        },
      },
    ],
    animationDuration: 0,
    animationDurationUpdate: 0,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  });

  return (
    <div className="w-full">
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <ReactECharts
          option={getOption(4)}
          style={{ height: '240px' }} // 4 * 60
        />
      </div>

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-black/50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-xl max-w-3xl w-full shadow-lg relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>

          <h3 className="text-lg font-semibold mb-4">Detail Top-Up per Bulan</h3>
          <ReactECharts
            option={getOption(12)}
            style={{ height: `${12 * 60}px` }}
          />
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default TopUpHorizontalChartWithModal;
