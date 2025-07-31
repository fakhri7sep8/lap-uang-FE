import Image from "next/image";
import React from "react";

const SaldoAkhirTahun = () => {
  return (
    <div className="py-8 px-8 flex flex-col gap-12 items-center justify-center">
      <section className="flex flex-row items-center justify-center gap-20 w-full">
        <div>
          <Image src="/img/uang.png" alt="Uang" width={200} height={200} />
        </div>
        <div className="flex flex-col gap-5 w-[45%]">
          <h1 className="font-semibold text-3xl">Saldo Akhir Tahun</h1>
          <p className="text-gray-500 text-xl">
            ubah Nilai Saldo Awal ke daftar ini cukup ketik di Bawah kolom
            jumlah tekan simpan dan Lanjutkan Proses
          </p>
        </div>
      </section>
      <section className="flex flex-row items-center gap-10 bg-[#EBF9EF] py-5 px-5 w-[70%] rounded-md">
        <div>
          <Image
            src="/img/tanda_seru.png"
            alt="Tanda Seru"
            width={30}
            height={30}
          />
        </div>
        <div>
          <p className="text-xl font-light">
            Pastikan jumlah saldo sesuai laporan tahun sebelumnya.
          </p>
        </div>
      </section>
      <section className="flex flex-col gap-4 w-[70%]">
        <label className="text-gray-700 font-medium text-lg">Jumlah</label>
        <div className="flex flex-row border border-gray-500 px-6 py-4 gap-9 rounded-md ">
          <p className="font-semibold text-xl">RP. 130.000.000</p>
        </div>
        <button
          type="submit"
          className=" w-full bg-[#2F936E] text-white py-2 rounded-md text-lg font-medium transition duration-200"
        >
          Simpan
        </button>
      </section>
      <section className="bg-[#EBF9EF] w-[70%] rounded-md px-6 py-4">
  <h2 className="font-semibold text-lg  border-b border-gray-400">Riwayat Saldo</h2>
  <div className="overflow-x-auto">
    <table className="w-full text-left text-black">
      <thead>
        <tr className="border-b border-gray-400">
          <th className="py-2">Tahun</th>
          <th className="py-2">Tanggal</th>
          <th className="py-2">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-400">
          <td className="py-2">2026</td>
          <td className="py-2">10 Jan 2026</td>
          <td className="py-2">RP.180.000.000</td>
        </tr>
        <tr className="border-b border-gray-400">
          <td className="py-2">2025</td>
          <td className="py-2">10 Jan 2025</td>
          <td className="py-2">RP.1.880.000.000</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

    </div>
  );
};

export default SaldoAkhirTahun;
