'use client'
import AppSidebar from '@/components/fragments/sidebar-app'
import Navbar from '@/components/ui/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className='flex w-full h-full'>
        <AppSidebar />
        <div className='flex flex-col w-full gap-6'>
          <Navbar />
          <div className='w-full px-6'>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
