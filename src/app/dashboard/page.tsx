import React from 'react'

const DashboardPage = () => {
  return (
    <section className='w-full min-h-full flex gap-4'>
      <div className='w-2/3 h-full flex flex-col gap-4'>
        <div className='w-full h-full grid grid-cols-2 gap-4'>
          <div className='w-full h-[300px] bg-white hover:bg-blue-400 transition-all rounded-2xl'></div>
          <div className='w-full h-[300px] bg-white hover:bg-blue-400 transition-all rounded-2xl'></div>
          <div className='w-full h-[300px] bg-white hover:bg-blue-400 transition-all rounded-2xl'></div>
                 </div>
        <div className='w-full h-[100vh] bg-white rounded-2xl'></div>
      </div>
      <div className='w-1/3 h-full  flex flex-col gap-5'>
        <div className='w-full h-4/5 bg-white rounded-2xl'></div>
      </div>
    </section>
  )
}

export default DashboardPage
