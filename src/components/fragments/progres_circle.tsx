'use client';

import { FC } from 'react';
import { cn } from '@/lib/utils';

interface CircleProgressProps {
  value: number; // angka 0 - 100
  color?: string; // warna stroke, contoh: 'red' atau '#FF0000'
  size?: 'sm' | 'md' | 'lg' | number; // ukuran buletan
  label?: string; // teks di tengah buletan, contoh: '+59%'
  className?: string;
}

const sizeMap = {
  sm: 60,
  md: 70,
  lg: 80,
};

export const CircleProgress: FC<CircleProgressProps> = ({
  value,
  color = '#10B981', // default Tailwind green-500
  size = 'md',
  label,
  className,
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;
  const radius = pixelSize / 2 - 4;
  const stroke = 6;
  const normalizedRadius = radius;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: pixelSize, height: pixelSize }}>
      <svg
        className="rotate-[-90deg]"
        height={pixelSize}
        width={pixelSize}
      >
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={pixelSize / 2}
          cy={pixelSize / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={pixelSize / 2}
          cy={pixelSize / 2}
        />
      </svg>
      <div
        className="absolute font-semibold text-gray dark:text-BLACK"
        style={{ fontSize: pixelSize / 4 }}
      >
        {label ?? `${value}%`}
      </div>
    </div>
  );
};
