'use client'
import AppSidebar from '@/components/fragment/sidebar-app'
import Navbar from '@/components/ui/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <SidebarProvider>
      <div className='flex w-full min-h-screen'>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
