import { viewPengeluaran } from "@/data/view-pengeluaran";

const formatRupiah = (num: number) =>
  "Rp. " + num.toLocaleString("id-ID");

const getBulan = (tanggal: string) => {
  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dateObj = new Date(tanggal);
  return bulanIndo[dateObj.getMonth()];
};

const TablePengeluaran = () => {
  const sortedPengeluaran = [...viewPengeluaran].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-4">
      <table className="w-full table-auto text-gray-700">
        <thead>
          <tr className="border-b text-left text-foreground text-sm">
            <th className="py-2 px-4 font-medium">Bulan</th>
            <th className="py-2 px-4 font-medium">Tanggal Bayar</th>
            <th className="py-2 px-4 font-medium">Jenis Pengeluaran</th>
            <th className="py-2 px-4 font-medium">Keterangan</th>
            <th className="py-2 px-4 font-medium">Jumlah Bayar</th>
          </tr>
        </thead>
        <tbody>
          {sortedPengeluaran.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="py-2 px-4">{getBulan(item.tanggal)}</td>
              <td className="py-2 px-4">{item.tanggal}</td>
              <td className="py-2 px-4">{item.jenisPengeluaran}</td>
              <td className="py-2 px-4">{item.deskripsi}</td>
              <td className="py-2 px-4 text-right">
                {formatRupiah(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePengeluaran;