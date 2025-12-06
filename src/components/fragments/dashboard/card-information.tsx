import React from 'react'

const CardInformation = ({
  title,
  value,
  icon,
  color
}: {
  color: 'blue' | 'yellow' | 'green' | 'red' | "purple"
  title: string
  value: number | string
  icon: React.ReactNode
}) => {
  if (color === 'blue') {
    return (
      <div className='rounded-xl p-9 bg-blue-400  text-white h-40 flex justify-between items-center shadow-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='font-medium text-2xl'>{title}</h2>
          <p className='text-5xl font-medium'>{value}</p>
        </div>
        <div className='bg-blue-100 rounded-full w-20 h-20 flex justify-center items-center'>
          {icon}
        </div>
      </div>
    )
  }

  if (color === 'green') {
    return (
      <div className='rounded-xl p-9 bg-green-400  text-white h-40 flex justify-between items-center shadow-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='font-medium text-2xl'>{title}</h2>
          <p className='text-5xl font-medium'>{value}</p>
        </div>
        <div className='bg-green-100 rounded-full w-20 h-20 flex justify-center items-center'>
          {icon}
        </div>
      </div>
    )
  }

  if (color === 'red') {
    return (
      <div className='rounded-xl p-9 bg-red-400  text-white h-40 flex justify-between items-center shadow-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='font-medium text-2xl'>{title}</h2>
          <p className='text-5xl font-medium'>{value}</p>
        </div>
        <div className='bg-red-100 rounded-full w-20 h-20 flex justify-center items-center'>
          {icon}
        </div>
      </div>
    )
  }

  if (color === 'yellow') {
    return (
      <div className='rounded-xl p-9 bg-yellow-400  text-white h-40 flex justify-between items-center shadow-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='font-medium text-2xl'>{title}</h2>
          <p className='text-5xl font-medium'>{value}</p>
        </div>
        <div className='bg-yellow-100 rounded-full w-20 h-20 flex justify-center items-center'>
          {icon}
        </div>
      </div>
    )
  }

  if (color === "purple") {
    return (
      <div className='rounded-xl p-9 bg-purple-400  text-white h-40 flex justify-between items-center shadow-md'>
        <div className='flex flex-col gap-2'>
          <h2 className='font-medium text-2xl'>{title}</h2>
          <p className='text-5xl font-medium'>{value}</p>
        </div>
        <div className='bg-purple-100 rounded-full w-20 h-20 flex justify-center items-center'>
          {icon}
        </div>
      </div>
    )
  }
}

export default CardInformation
