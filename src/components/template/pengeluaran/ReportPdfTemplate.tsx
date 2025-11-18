/* eslint-disable jsx-a11y/alt-text */
"use client";

import { getAcademicMonths } from "@/lib/expense-months";
import type { CSSProperties } from "react";

type ReportPdfTemplateProps = {
  title: string;
  sectionLabel?: string;
  headerLogoUrl?: string;
  sekolah: {
    nama: string;
    alamat: string;
  };
  tahunAjaranMulai: number;
  dataPerBulan?: Record<
    string,
    {
      tanggal?: string | null;
      nominal?: number | null;
      jenis?: string | null;
    }
  >;
  totalPengeluaran: number;
  tanggalCetak: string;
  themeColor?: string;
};

/* ======== STYLE TABLE (SAFE FOR PDF) ======== */
const thStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "8px",
  textAlign: "left",
  fontWeight: 600,
  backgroundColor: "#f1f5f9",
};

const tdStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "7px",
  height: "28px",
};

/* ======== COMPONENT ======== */
export default function ReportPdfTemplate({
  title,
  sectionLabel = "Detail Pengeluaran",
  themeColor = "#00D86F",
  headerLogoUrl,
  sekolah,
  tahunAjaranMulai,
  dataPerBulan = {},
  totalPengeluaran,
  tanggalCetak,
}: ReportPdfTemplateProps) {
  const months = getAcademicMonths(tahunAjaranMulai);
  const tahunAkhir = tahunAjaranMulai + 1;
  const tahunAjaranLabel = `${tahunAjaranMulai}/${tahunAkhir}`;

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
        }}
      >
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-10">
          {headerLogoUrl && (
            <img
              src={headerLogoUrl}
              style={{ width: "140px", height: "60px", objectFit: "contain" }}
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

        {/* TITLE */}
        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
          {title}
        </h2>

        <p style={{ fontSize: "12px", color: "#4b5563", marginBottom: "16px" }}>
          Tahun Ajaran {tahunAjaranLabel}
        </p>

        {/* BAR HIJAU (SAMA PERSIS SPP STYLE) */}
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
            letterSpacing: "0.2px",

            display: "flex",
            alignItems: "center",        // vertikal center
            justifyContent: "space-between", // kiri & kanan
            // jangan pakai lineHeight di parent
          }}
        >
          <span
            style={{
              display: "inline-block",
              margin: 0,
              lineHeight: 1,                 // pastikan teks sendiri tidak punya tinggi berlebih
              transform: "scale(1.06)",     // efek pembesaran
              transformOrigin: "center",    // supaya membesar dari tengah
              transition: "transform .12s ease",
            }}
          >
            {sectionLabel}
          </span>
          <span
            style={{
              display: "inline-block",
              margin: 0,
              lineHeight: 1,
              transform: "scale(1.06)",
              transformOrigin: "center",
              transition: "transform .12s ease",
            }}
          >
            {tahunAjaranLabel}
          </span>
        </div>

        {/* TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Bulan</th>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Pengeluaran</th>
              <th style={thStyle}>Jenis Pengeluaran</th>
            </tr>
          </thead>

          <tbody>
            {months.map((m: any) => {
              const row = dataPerBulan[m.key] || {};
              return (
                <tr key={m.key}>
                  <td style={tdStyle}>{m.label}</td>
                  <td style={tdStyle}>{row.tanggal || ""}</td>
                  <td style={tdStyle}>
                    {row.nominal
                      ? `Rp -${row.nominal.toLocaleString("id-ID")}`
                      : ""}
                  </td>
                  <td style={tdStyle}>{row.jenis || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTAL BAR (FOLLOW SPP STYLE) */}
        <div
          style={{
            backgroundColor: themeColor,
            height: "46px",
            padding: "0 24px",
            marginTop: "32px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            justifyContent: "space-between",
            lineHeight: "1",
          }}
        >
          <span style={{ lineHeight: "1" }}>Total Pengeluaran :</span>
          <span style={{ lineHeight: "1" }}>
            Rp -{totalPengeluaran.toLocaleString("id-ID")}
          </span>
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
