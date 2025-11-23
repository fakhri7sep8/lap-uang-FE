/* eslint-disable jsx-a11y/alt-text */
"use client";

import dayjs from "dayjs";

type ReportPdfTemplateProps = {
  title: string;
  sectionLabel?: string;
  headerLogoUrl?: string;
  sekolah: {
    nama: string;
    alamat: string;
  };
  tahunAjaranMulai: number;
  data: any[];
  totalPengeluaran?: number;
  tanggalCetak: string;
  themeColor?: string;
};

export default function ReportPdfTemplate({
  title,
  sectionLabel = "Detail Pengeluaran",
  headerLogoUrl,
  sekolah,
  tahunAjaranMulai,
  data = [],
  totalPengeluaran = 0,
  tanggalCetak,
  themeColor = "#00D86F",
}: ReportPdfTemplateProps) {
  return (
    <div
      className="flex justify-center py-6"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        id="report-pdf"
        style={{
          width: "750px",
          minHeight: "1123px",
          backgroundColor: "#ffffff",
          padding: "40px 40px",
          boxSizing: "border-box",

          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-10">
          {headerLogoUrl && (
            <img
              src={headerLogoUrl}
              style={{
                width: "140px",
                height: "60px",
                objectFit: "contain",
              }}
            />
          )}

          <div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              {sekolah.nama}
            </h1>

            <p style={{ fontSize: "12px", color: "#475569" }}>
              {sekolah.alamat}
            </p>
          </div>
        </header>

        <hr style={{ borderColor: "#cbd5e1", marginBottom: "32px" }} />

        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
          {title}
        </h2>

        {/* PANEL HIJAU */}
        <div
          style={{
            backgroundColor: themeColor,
            height: "46px",
            padding: "0 24px",
            marginBottom: "24px",
            borderRadius: "6px",
            color: "white",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            letterSpacing: "0.2px",
          }}
        >
          <span style={{ lineHeight: 1 }}>{sectionLabel}</span>
          <span style={{ lineHeight: 1 }}>
            Tahun Ajaran {tahunAjaranMulai}/{tahunAjaranMulai + 1}
          </span>
        </div>

        {/* ========================= */}
        {/* FLEX CONTENT (TABEL) */}
        {/* ========================= */}
        <div style={{ flex: 1 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Tanggal</th>
                <th style={th}>Deskripsi</th>
                <th style={th}>Penanggung Jawab</th>
                <th style={th}>Kategori</th>
                <th style={th}>Nominal</th>
                <th style={th}>Jenis / SubKategori</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <td style={td}>
                    {item.PayDate
                      ? dayjs(item.PayDate).format("DD/MM/YYYY")
                      : item.tanggal
                      ? dayjs(item.tanggal).format("DD/MM/YYYY")
                      : "-"}
                  </td>

                  <td style={td}>{item.description ?? item.nama ?? "-"}</td>

                  <td style={td}>
                    {item.PenanggungJawab ?? item.penanggungJawab ?? "-"}
                  </td>

                  <td style={td}>{item.category?.name ?? item.kategori ?? "-"}</td>

                  <td style={td}>
                    {item.amount || item.jumlah
                      ? `Rp ${Number(item.amount ?? item.jumlah).toLocaleString(
                          "id-ID"
                        )}`
                      : "-"}
                  </td>

                  <td style={td}>
                    {item.subCategory?.name ??
                      item.subKategori ??
                      item.category?.name ??
                      "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================= */}
        {/* TOTAL PENGELUARAN (SELALU DI BAWAH) */}
        {/* ========================= */}
        <div
          style={{
            backgroundColor: themeColor,
            height: "46px",
            padding: "0 24px",
            marginTop: "32px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <span>Total Pengeluaran :</span>
          <span>Rp {totalPengeluaran.toLocaleString("id-ID")}</span>
        </div>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "48px",
            textAlign: "center",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          <p>Dokumen ini adalah hasil cetak sistem.</p>
          <p style={{ marginBottom: "20px" }}>
            Harap simpan untuk keperluan administrasi.
          </p>
          <p>{tanggalCetak}</p>
        </footer>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f1f5f9",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "7px",
};
