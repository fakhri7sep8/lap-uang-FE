"use client";
import React from "react";

export default function TutorialPage() {
  const steps = [
    { title: "Masuk / Login ke akun", description: "Gunakan akun dashboard sekolah Anda. Jika belum terdaftar, hubungi admin.", hint: "Gunakan akun dengan peran yang sesuai, misalnya Admin atau Finance." },
    { title: "Buka menu 'Laporan Keuangan'", description: "Klik menu Laporan Keuangan di sidebar dashboard.", hint: "Jika menu tidak terlihat, periksa hak akses Anda di bagian Pengaturan Sistem." },
    { title: "Pilih jenis laporan", description: "Misalnya Laporan Arus Kas, Laporan SPP, Laporan Pengeluaran, atau Recap Kwitansi." },
    { title: "Tentukan periode laporan", description: "Gunakan pilihan periode seperti bulan, triwulan, atau tahun yang ingin ditampilkan.", hint: "Untuk perbandingan, pilih dua periode yang berbeda." },
    { title: "Gunakan filter tambahan jika perlu", description: "Misalnya filter berdasarkan kategori pembayaran, kategori pengeluaran, atau data siswa tertentu." },
    { title: "Unduh atau cetak laporan", description: "Gunakan tombol Download PDF atau Export CSV untuk menyimpan salinan laporan.", hint: "Gunakan aplikasi spreadsheet seperti Excel untuk analisis lebih lanjut." },
    { title: "Akses menu Bantuan", description: "Jika ada kendala atau ketidaksesuaian data, buka menu Bantuan → Tutorial atau Tentang Aplikasi untuk informasi lebih lanjut." }
  ];

  const faqs = [
    { q: "Laporan tidak bisa diunduh, apa penyebabnya?", a: "Periksa koneksi internet, hak akses, atau coba format lain seperti CSV. Jika masih gagal, hubungi tim support." },
    { q: "Bagaimana cara melihat laporan tahun sebelumnya?", a: "Gunakan dropdown periode pada halaman laporan atau unduh arsip di menu Riwayat." },
    { q: "Apakah data laporan sudah diverifikasi?", a: "Periksa bagian metadata laporan untuk informasi nama verifikator dan status verifikasi." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm p-4 border-b -300">
        <h1 className="font-bold text-xl flex items-center gap-2">
          📊 Laporan Keuangan
        </h1>
      </header>

      <main className="p-6 flex flex-col gap-6 max-w-5xl mx-auto">
        <section className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Tutorial Penggunaan</h2>
          <p className="text-gray-600">
            Panduan ini membantu Anda mengakses, membaca, dan mengunduh laporan keuangan sekolah melalui dashboard.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">🛠 Prasyarat</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Akun dengan akses sesuai peran (Admin / Finance)</li>
            <li>Koneksi internet stabil</li>
            <li>Browser modern (Chrome, Edge, Firefox)</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">📌 Langkah-langkah</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className="p-4 border border-slate-300 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
              >
                <div className="flex items-center gap-2 text-sky-600 font-bold mb-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-sky-100 rounded-full">{i + 1}</span>
                  <h4 className="font-semibold">{s.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{s.description}</p>
                {s.hint && (
                  <p className="text-xs text-gray-500 mt-2">💡 {s.hint}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">❓ FAQ</h3>
          {faqs.map((f, i) => (
            <details
              key={i}
              className="border border-slate-300 rounded-lg mb-2 bg-gray-50 overflow-hidden"
            >
              <summary className="p-3 cursor-pointer font-medium hover:bg-gray-100">
                {f.q}
              </summary>
              <div className="p-3 text-sm text-gray-600">{f.a}</div>
            </details>
          ))}
        </section>

        <section className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm">
          <h3 className="font-semibold text-lg">☎ Butuh bantuan?</h3>
          <ul className="mt-2 text-sm space-y-1">
            <li>
              Email:{" "}
              <a
                className="text-sky-600 hover:underline"
                href="mailto:support@perusahaan.example"
              >
                support@perusahaan.example
              </a>
            </li>
            <li>
              Telepon:{" "}
              <a
                className="text-sky-600 hover:underline"
                href="tel:+62210000000"
              >
                +62 21 0000 0000
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-300 p-4 text-center text-sm text-gray-600 mt-6">
        © {new Date().getFullYear()} Lap uang. Semua hak cipta dilindungi.
      </footer>
    </div>
  );
}
