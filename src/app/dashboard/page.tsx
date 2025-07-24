'use client'
import AppSidebar from '@/components/fragments/sidebar-app'
import { Hero1 } from '@/components/ui/hero1'
import Navbar from '@/components/ui/navbar'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'

export const Dashboard = () => {
  return (
    <section className='w-full'>
      <div className='flex flex-col'>
        <Hero1/>
      </div>
    </section>
  )
}

export default Dashboard