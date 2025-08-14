'use client'
import React from 'react'
import { Banner } from '@/components/fragments/Banner'
import { MainDashboard } from '@/components/fragments/dashboard/main-dashboard'

const Dashboard = () => {
  return (
    <section className='w-full h-full'>
      <div className='flex flex-col gap-4'>
        <Banner />
        <MainDashboard />
      </div>
    </section>
  )
}

export default Dashboard
