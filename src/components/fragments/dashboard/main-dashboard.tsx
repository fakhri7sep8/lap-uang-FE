import Image from 'next/image'
import FinanceCard from '@/components/fragments/financeCard'
import { Wallet } from 'lucide-react'

export const MainDashboard = () => {
  return (
    <div className={'flex items-center flex-col gap-6 w-full pb-4'}>
      <div className='w-full flex flex-col gap-4'>
        <div className='w-full flex'>
          <h2 className='text-2xl font-semibold text-[#25BF65]'>
            Ringkasan Pengeluaran
          </h2>
        </div>
        <div className='w-full flex flex-col gap-4  '>
          <div className='w-full flex md:flex-row flex-col gap-4 md:h-[250px] h-screen'>
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
                <span className='text-[#dedede] text-6xl font-semibold flex items-start'>
                  Rp.130.000.000
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
                  title={'Pendapatan Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='income'
                  icon={<Wallet size={44} />}
                />
              </div>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
          <div className='w-full flex gap-4 h-[250px] flex-row-reverse'>
            <div className='w-1/2 bg-red-500 '></div>
            <div className='w-1/2 flex gap-4'>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
          <div className='w-full flex gap-4 h-[250px]'>
            <div className='w-1/2 bg-red-500 '></div>
            <div className='w-1/2 flex gap-4'>
              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>

              <div className='w-1/2'>
                <FinanceCard
                  title={'Pengeluaran Bulan Ini'}
                  amount={1230000000}
                  month={'Juli'}
                  percentage={-30}
                  type='expense'
                  icon={<Wallet size={44} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=''></div>
    </div>
  )
}
