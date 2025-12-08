import dayjs from "dayjs";

export async function computeFinance(
  payments: any[],
  sppPayments: any[],
  expenses: any[]
) {
  const currentYear = dayjs().year();

  // ==========================
  // 1. HITUNG PEMASUKAN NON-SPP
  // ==========================
  const totalNonSPP = payments
    .filter((p) => dayjs(p.date).year() === currentYear)
    .reduce((acc, p) => acc + p.paid, 0);

  // ==========================
  // 2. HITUNG PEMASUKAN SPP
  // ==========================
  const totalSPP = sppPayments
    .filter((p) => p.status === "LUNAS" && p.year == currentYear)
    .reduce((acc, p) => acc + p.nominal, 0);

  // ==========================
  // 3. TOTAL PEMASUKAN
  // ==========================
  const pemasukanTahunan = totalSPP + totalNonSPP;

  // ==========================
  // 4. TOTAL PENGELUARAN
  // ==========================
  const totalPengeluaran = expenses
    .filter((e) => dayjs(e.createdAt).year() === currentYear)
    .reduce((acc, e) => acc + e.amount, 0);

  // ==========================
  // 5. SURPLUS
  // ==========================
  const surplus = pemasukanTahunan - totalPengeluaran;

  // ==========================
  // 6. PERSENTASE (UNTUK FINANCE CARD)
  // ==========================
  const percentageIncome =
    totalPengeluaran > 0
      ? ((pemasukanTahunan - totalPengeluaran) / totalPengeluaran) * 100
      : 0;

  const percentageExpense =
    pemasukanTahunan > 0
      ? -(totalPengeluaran / pemasukanTahunan) * 100
      : 0;

  const percentageSurplus =
    pemasukanTahunan > 0 ? (surplus / pemasukanTahunan) * 100 : 0;

  // ==========================
  // 7. PEMASUKAN BULANAN
  // ==========================
  const monthlyIncome = Array(12).fill(0);

  // non-SPP
  payments.forEach((p) => {
    const idx = dayjs(p.date).month();
    monthlyIncome[idx] += p.paid;
  });

  // SPP
  sppPayments.forEach((p) => {
    if (p.status === "LUNAS") {
      const idx = convertMonthToIndex(p.month);
      if (idx >= 0) monthlyIncome[idx] += p.nominal;
    }
  });

  return {
    pemasukanTahunan,
    totalNonSPP,
    totalSPP,
    totalPengeluaran,
    surplus,
    monthlyIncome,
    percentageIncome,
    percentageExpense,
    percentageSurplus,
  };
}

// helper konversi nama bulan SPP ke index
function convertMonthToIndex(month: string) {
  const m = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];
  return m.indexOf(month);
}
