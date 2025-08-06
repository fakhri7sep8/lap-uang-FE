/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react'
import { CircleProgress } from './progres_circle' // pastikan ini adalah komponen milikmu

const colorMap: Record<string, string> = {
  green: '#25BF65',
  red: '#FF453A',
  indigo: '#9F9FF8'
}

interface CardWithCircleProps {
  title: string
  amount: number
  month: string
  percentage: number
  icon: any
  type: "income"| "expense" | "Surplus"
}

const CardWithCircle: FC<CardWithCircleProps> = ({
  title,
  amount,
  month,
  percentage,
  icon,
  type
}) => {
  const [circleColor, setCircleColor] = useState("green")
 useEffect(() => {
  if (percentage < 0 && type == "income") {
    setCircleColor('red')
  } else if(percentage < 0 && type =="expense") {
    setCircleColor('green')
  } else if( type == 'Surplus'){
    setCircleColor(colorMap.indigo)
  }
}, [percentage,type])


  return (
    <div className='bg-white rounded-2xl  shadow-sm flex flex-col justify-between w-full h-full p-6'>
      <div className='w-full flex items-center h-full'>
        <div className='flex flex-col gap-4 items-start w-full h-full'>
          <div className='w-full h-1/3 flex justify-between items-center'>
            {icon}
            <div className=''>
              <CircleProgress
                value={percentage}
                size='md'
                color={circleColor}
              />
            </div>
          </div>
          <div className='flex flex-col gap-1 items-start text-start mt-4'>
            <p className=' text-sm text-gray-500'>{title}</p>
            <p className='text-2xl font-semibold text-gray-900'>
              Rp. {amount.toLocaleString('id-ID')}
            </p>
            <p className='text-md text-gray-400'>Bulan {month}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardWithCircle
