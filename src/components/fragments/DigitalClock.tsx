'use client'

import React, { useEffect, useState } from 'react'

export default function DigitalClock() {
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
      hour12: false,
    })

  const formatDate = (date: Date) =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <></>
    // <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-cyan-200">
    //   <div className="text-7xl font-mono tracking-widest digital-font">
    //     {formatTime(now)}
    //   </div>
    //   <div className="mt-4 text-lg font-semibold digital-font">
    //     {formatDate(now)}
    //   </div>
    // </div>
  )
}
