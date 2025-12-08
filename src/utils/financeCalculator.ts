import dayjs from "dayjs";

export interface ExpenseItem {
  amount: number;
  createdAt: string;
}

export interface PaymentItem {
  paid: number;
  date: string;
}

export interface SppItem {
  month: string;
  nominal: number;
  status: string;
}

export function calculateFinance({
  expenses = [],
  payments = [],
  spp = [],
  saldoAwalTahun = 0, // saldo awal bisa dari API nanti
}: {
  expenses: ExpenseItem[];
  payments: PaymentItem[];
  spp: SppItem[];
  saldoAwalTahun: number;
}) {
  const currentYear = dayjs().year();

  // ==================================
  // 1. TOTAL PENGELUARAN TAHUN INI
  // ==================================
  const totalPengeluaran = expenses
    .filter((e) => dayjs(e.createdAt).year() === currentYear)
    .reduce((sum, e) => sum + e.amount, 0);

  // ==================================
  // 2. PEMASUKAN NON-SPP
  // ==================================
  const pemasukanNonSPP = payments
    .filter((p) => dayjs(p.date).year() === currentYear)
    .reduce((sum, p) => sum + (p.paid || 0), 0);

  // ==================================
  // 3. PEMASUKAN SPP
  // ==================================
  const pemasukanSPP = spp
    .filter((s) => s.status === "LUNAS")
    .reduce((sum, s) => sum + (s.nominal || 0), 0);

  const totalPemasukan = pemasukanNonSPP + pemasukanSPP;

  // ==================================
  // 4. SURPLUS
  // ==================================
  const surplus = totalPemasukan - totalPengeluaran;

  // ==================================
  // 5. SALDO SAAT INI (REAL)
  // ==================================
  const saldoSaatIni = saldoAwalTahun + surplus;

  // ==================================
  // 6. PEMASUKAN BULANAN
  // ==================================
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const pemasukanBulanan = Array(12).fill(0);

  payments.forEach((p) => {
    const idx = dayjs(p.date).month();
    pemasukanBulanan[idx] += p.paid || 0;
  });

  const monthMap = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  spp.forEach((s) => {
    if (s.status === "LUNAS") {
      const idx = monthMap.indexOf(s.month);
      if (idx >= 0) pemasukanBulanan[idx] += s.nominal || 0;
    }
  });

  // ==================================
  // 7. PENGELUARAN BULANAN
  // ==================================
  const monthlyExpense: Record<string, number> = {};
  months.forEach((m) => (monthlyExpense[m] = 0));

  expenses.forEach((ex) => {
    const idx = dayjs(ex.createdAt).month();
    const m = months[idx];
    monthlyExpense[m] += ex.amount;
  });

  // ==================================
  // 8. SALDO PER BULAN
  // ==================================
  const saldoAwalBulanan = Array(12).fill(0);
  const saldoAkhirBulanan = Array(12).fill(0);

  saldoAwalBulanan[0] = saldoAwalTahun;

  for (let i = 0; i < 12; i++) {
    saldoAkhirBulanan[i] =
      saldoAwalBulanan[i] + pemasukanBulanan[i] - monthlyExpense[months[i]];

    if (i < 11) {
      saldoAwalBulanan[i + 1] = saldoAkhirBulanan[i];
    }
  }

  // ==================================
  // 9. DATA UNTUK CHART
  // ==================================
  const monthlyData = Object.fromEntries(
    months.map((m, i) => [
      m,
      [
        pemasukanBulanan[i],
        monthlyExpense[m],
        saldoAwalBulanan[i],
        saldoAkhirBulanan[i],
      ],
    ])
  );
  // ===============================
  // 9. PERSENTASE (UNTUK FINANCE CARD)
  // ===============================
  const percentageIncome =
    totalPengeluaran > 0
      ? ((totalPemasukan - totalPengeluaran) / totalPengeluaran) * 100
      : 0;

  const percentageExpense =
    totalPemasukan > 0 ? -(totalPengeluaran / totalPemasukan) * 100 : 0;

  const percentageSurplus =
    totalPemasukan > 0 ? (surplus / totalPemasukan) * 100 : 0;

  return {
    months,
    totalPengeluaran,
    totalPemasukan,
    surplus,
    saldoAwalTahun,
    saldoAkhirTahun: saldoAkhirBulanan[11],
    saldoSaatIni, // ⭐ REAL SALDO
    pemasukanBulanan,
    monthlyExpense,
    saldoAwalBulanan,
    saldoAkhirBulanan,
    monthlyData,
    percentageExpense,
    percentageIncome,
    percentageSurplus,
  };
}
