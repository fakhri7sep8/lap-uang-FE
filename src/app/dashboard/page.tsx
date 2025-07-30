'use client'
import AppSidebar from '@/components/fragments/sidebar-app'
import { Hero1 } from '@/components/ui/hero1'
import Navbar from '@/components/ui/navbar'
import { Sidebar, useSidebar } from '@/components/ui/sidebar'
import React from 'react'
import { ChartPage } from '../test/page'


export const Dashboard = () => {
      const {state} = useSidebar()

  return (
    <section className='w-full'>
      <div className='flex flex-col'>
        <Hero1/>
        {/* <ChartPage/> */}
      </div>
    </section>
  )
}

export default Dashboard