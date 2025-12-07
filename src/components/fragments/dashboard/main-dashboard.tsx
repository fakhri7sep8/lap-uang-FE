import Image from 'next/image'
import FinanceCard from '@/components/fragments/financeCard'
import { Wallet } from 'lucide-react'
import MonthlyGroupedBarChart from '../monthlyFinanceChart'
import DonutPieChart from '../donutChart'
import BarChart from '../candle-new'
import { useDashboardModule } from '@/hooks/useDashboard'
import Loader from '@/components/ui/loader'
import currency from 'currency.js'




export const MainDashboard = () => {
  const { useDataDashboard } = useDashboardModule()
  
  const { data, isLoading } = useDataDashboard()
  console.log(data);
  
  if (isLoading) {
  return (
    <div className='p-6 w-full h-[89vh] flex justify-center items-center'>
      <Loader />
    </div>
  )
}

  return (
    <div className={'flex items-center flex-col gap-6 w-full pb-4'}>
      <div className='w-full flex flex-col gap-4'>
        <div className='w-full flex'>
          <h2 className='text-2xl font-semibold text-[#25BF65]'>
            Ringkasan Pengeluaran
          </h2>
        </div>
        <div className='w-full flex flex-col gap-4  '>
          <div className='w-full flex md:flex-row flex-col gap-4 md:h-[264px] h-screen'>
            <div className='md:w-1/2 w-full bg-finance rounded-2xl flex flex-col gap-2 px-2 py-4 '>
              <div className='w-full h-1/3'>
                <Image
                  src={'/img/Logo.png'}
                  alt='logo'
                  width={150}
                  height={150}
                />
              </div>
              <div className=' w-full h-1/3 flex justify-end items-center pr-6'>
                <span className='text-[#dedede] text-4xl font-semibold flex items-start'>
                  {currency(data?.card?.saldo, { symbol: 'Rp ', separator: '.', decimal: ',' }).format()}
                </span>
              </div>
              <div className=' w-full h-1/3 px-6'>
                <div className='w-full h-full flex justify-between items-center'>
                  <div className='w-1/3 flex flex-col'>
                    <span className='text-[#73F777] text-lg'>owner</span>
                    <span className='text-[#b2b2b2] text-lg'>Lap uang</span>
                  </div>
                  <div className='text-xl w-2/3  text-[#b2b2b2] gap-2 flex justify-end items-end h-full pb-4'>
                    saldo yang tersedia
                    <span className='text-[#73f777]'>saat ini</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='md:w-1/2 w-full flex gap-4'>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pendapatan Tahun Ini'}
                  amount={data?.card?.pendapatan}
                  percentage={data?.card?.pendapatanPercentage}
                  type='income'
                  icon={<Wallet size={44} />}
                />
              </div>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Tahun Ini'}
                  amount={data?.card?.pengeluaran}
                  percentage={data?.card?.pengeluaranPercentage}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
          <div className='w-full flex gap-4 h-[250px] flex-row'>
            <div className='w-1/2 '>
              <FinanceCard
                title={'Pendapatan Selain SPP'}
                amount={data?.card?.pemasukanSelainSpp}
                percentage={data?.card?.pemasukanSelainSppPercentage}
                type='Surplus'
                icon={<Wallet size={44} />}
              />
            </div>
            <div className='w-1/2 flex gap-4'>
              <FinanceCard
                title={'Pendapatan SPP'}
                amount={data?.card?.pemasukanSpp}
                percentage={data?.card?.pemasukanSppPercentage}
                type='expense'
                icon={<Wallet size={44} />}
              />
            </div>
          </div>
          <div className='w-full flex gap-4 h-full flex-row'>
            <div className='w-1/2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out'>
              <h2 className=' text-center font-semibold text-2xl'>
                Pengeluaran tahunan
              </h2>
              <DonutPieChart
                data={[
                  { name: 'Penerimaan', value: data?.card?.pendapatan },
                  { name: 'Pengeluaran', value: data?.card?.pengeluaran },
                ]}
              />
            </div>
            <div className='w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out'>
              <h2 className=' text-center font-semibold text-2xl'>
                Pengeluaran tahunan
              </h2>
              <MonthlyGroupedBarChart
                categories={[
                  'Pendapatan',
                  'Pengeluaran',
                ]}
                monthlyData={data?.card?.statistik?.monthlyData}
              />
            </div>
          </div>
          {/* <div className='w-full flex gap-4 h-full flex-row'>
            <div className='w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out'>
              <BarChart />
            </div>
          </div> */}
        </div>
      </div>
      <div className=''></div>
    </div>
  )
}
