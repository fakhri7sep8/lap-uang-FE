import React, { useEffect, useState } from 'react'

export const Banner = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  return (
    <div className='w-full'>
      <div
        className={
          'transition-all duration-300 flex items-center justify-between'
        }
      >
        <div className="w-full h-56 bg-[url('/img/flayer.png')] bg-no-repeat bg-cover  rounded-lg flex justify-between px-4 items-center p">
          <div className='flex flex-col space-y-2 mb-5'>
            <span className='text-white text-4xl font-bold'>
              Selamat Datang
            </span>
            <span className='text-white text-2xl font-bold'>
              di Aplikasi <span className='text-green-600'>LapUang</span>
            </span>
            <span className='text-white text-2xl font-bold'>
              Ringkasan Laporan Keuangan
            </span>
          </div>

          <div className='backdrop-blur-sm bg-white/10 border-2 border-white/20 rounded-xl p-4 shadow-lg  w-1/5 text-center md:flex hidden'>
            <div className='flex flex-col space-y-1.5 '>
              <div className='text-5xl digital-font font-mono tracking-widest text-black'>
                {formatTime(now)}
              </div>
              <div className='mt-4 text-black text-lg font-semibold'>
                {formatDate(now)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
