"use client";

import React from "react";
import Image from "next/image";
import PieChart from "@/components/fragments/circle-chart";
import TrafficChart from "@/components/fragments/trafic";

const HomePage = () => {
  return (
    <div>
      <section className='bg-[url("/img/BG-Home.png")] bg-no-repeat bg-cover min-h-screen flex flex-col items-center justify-center p-4 gap-20'>
        <div className="flex items-center gap-2 mb-48">
          <Image src="/img/logo.png" alt="Lap Uang" width={200} height={200} />
          <span className="text-black text-lg">x</span>
          <Image src="/img/SMK.png" alt="Mitra" width={80} height={80} />
        </div>
        <section className="flex flex-wrap justify-center gap-14">
          <div
            className="relative w-72 h-80 rounded-xl shadow-lg p-4 overflow-hidden text-white font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background:
                "linear-gradient(to bottom left, #FF5F48 0%, #FEB676 100%)",
            }}
          >
            <span className="text-3xl font-bold">Dashboard</span>
            <Image
              src="/img/Koran.png"
              alt="Dashboard"
              width={250}
              height={250}
              className="absolute bottom-[-60px] right-[-50px]"
            />
          </div>

          <div
            className="relative w-72 h-80 rounded-xl shadow-lg p-4 overflow-hidden text-white font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background:
                "linear-gradient(to bottom left, #006971 0%, #94E9B8 100%)",
            }}
          >
            <span className="text-3xl font-bold">Pengaturan</span>
            <Image
              src="/img/Pengaturan.png"
              alt="Pengaturan"
              width={240}
              height={240}
              className="absolute bottom-[-70px] right-[-60px]"
            />
          </div>

          <div
            className="relative w-72 h-80 rounded-xl shadow-lg p-4 overflow-hidden text-white font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background:
                "linear-gradient(to bottom left, #D1A2FE 0%, #94E9B8 100%)",
            }}
          >
            <span className="text-3xl font-bold">Pengaturan</span>
            <Image
              src="/img/Pengaturan.png"
              alt="Pengaturan"
              width={240}
              height={240}
              className="absolute bottom-[-70px] right-[-60px]"
            />
          </div>

          <div
            className="relative w-72 h-72 rounded-xl shadow-lg p-4 overflow-hidden text-white font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background:
                "linear-gradient(to bottom left, #FE5B88 0%, #FFB3B4 100%)",
            }}
          >
            <span className="text-3xl font-bold">Log Out</span>
            <Image
              src="/img/logout.png"
              alt="Log Out"
              width={200}
              height={200}
              className="absolute right-[-10px]"
            />
          </div>
        </section>
        <section className="w-full min-h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-5 w-[90%]">
            <h2 className="text-2xl font-bold self-start">Laporan Keuangan</h2>
            <div className="flex flex-row gap-20">
              <PieChart />
              <TrafficChart />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default HomePage;
