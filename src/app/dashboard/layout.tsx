import React from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='w-full h-screen flex bg-[#ededf8] '>
      <section className='w-1/5 h-full p-4'>
        <div className='w-full h-full rounded-xl bg-white'></div>
      </section>
      <section className='w-4/5 flex flex-col gap-2 py-4 pr-6 pl-4  h-full overflow-auto'>
        <div className='w-full h-18 mb-6'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-2 w-2/3'>
              <h1 className='text-3xl font-bold'>Money Report</h1>
              <p className='text-sm'>Friday,december 15th 2025</p>
            </div>
            <div className='w-1/3 h-full flex gap-4 justify-end'>
              <div className='w-12 h-12 bg-white rounded-full'></div>
              <div className='w-12 h-12 bg-white rounded-full'></div>
              <div className='flex gap-4 items-center'>
                <div className='w-12 h-12 bg-white rounded-full'></div>
                <div className='flex flex-col '>
                  <p className='text-xl font-bold'>Dedi Suratman</p>
                  <p className='text-xs'>Administrasi Keuangan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </section>
    </main>
  )
}

export default DashboardLayout
