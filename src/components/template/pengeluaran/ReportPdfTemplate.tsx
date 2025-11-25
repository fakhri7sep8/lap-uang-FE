/* eslint-disable jsx-a11y/alt-text */
"use client";

import dayjs from "dayjs";

type ReportPdfTemplateProps = {
  title: string;
  sectionLabel?: string;
  headerLogoUrl?: string;
  sekolah: { nama: string; alamat: string };
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
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <style>
        {`
          @page {
            size: A4;
            margin: 20mm;
          }

          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .no-break {
            page-break-before: auto !important;
            page-break-after: auto !important;
            page-break-inside: avoid !important;
          }

          table {
            page-break-inside: auto !important;
          }

          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        `}
      </style>

      <div
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "10mm 12mm",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        {/* HEADER */}
        <header
          className="avoid-break"
          style={{ display: "flex", alignItems: "center", marginBottom: "8mm" }}
        >
          {headerLogoUrl && (
            <img
              src={headerLogoUrl}
              style={{
                width: "38mm",
                height: "18mm",
                objectFit: "contain",
                marginRight: "6mm",
              }}
            />
          )}

          <div>
            <h1
              style={{
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "2px",
              }}
            >
              {sekolah.nama}
            </h1>
            <p style={{ fontSize: "11px", color: "#475569" }}>
              {sekolah.alamat}
            </p>
          </div>
        </header>

        {/* LINE */}
        <hr style={{ borderColor: "#cbd5e1", marginBottom: "12px" }} />

        {/* TITLE */}
        <h2
          className="avoid-break"
          style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}
        >
          {title}
        </h2>

        {/* PANEL HIJAU */}
        <div
          className="avoid-break"
          style={{
            background: themeColor,
            height: "38px",
            padding: "0 20px",
            borderRadius: "6px",
            marginBottom: "10px",
            color: "white",
            fontSize: "12px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{sectionLabel}</span>
          <span>
            Tahun Ajaran {tahunAjaranMulai}/{tahunAjaranMulai + 1}
          </span>
        </div>

        {/* TABLE */}
        <div style={{ width: "100%", marginBottom: "10mm" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
            }}
          >
            <thead>
              <tr>
                <th style={th}>Tanggal</th>
                <th style={th}>Deskripsi</th>
                <th style={th}>Penanggung Jawab</th>
                <th style={th}>Kategori</th>
                <th style={th}>Nominal</th>
                <th style={th}>SubKategori</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="avoid-break">
                  <td style={td}>
                    {item.PayDate
                      ? dayjs(item.PayDate).format("DD/MM/YYYY")
                      : item.tanggal
                      ? dayjs(item.tanggal).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td style={td}>{item.description ?? "-"}</td>
                  <td style={td}>{item.PenanggungJawab ?? "-"}</td>
                  <td style={td}>{item.category?.name ?? "-"}</td>
                  <td style={td}>
                    {`Rp ${(item.amount ?? item.jumlah ?? 0).toLocaleString(
                      "id-ID"
                    )}`}
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

        {/* PANEL TOTAL — sangat dekat dengan tabel */}
        <div
          className="avoid-break"
          style={{
            background: themeColor,
            height: "40px",
            padding: "0 20px",
            borderRadius: "6px",
            color: "white",
            marginBottom: "6mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 600,
            fontSize: "12px",
          }}
        >
          <span>Total Pengeluaran :</span>
          <span>Rp {totalPengeluaran.toLocaleString("id-ID")}</span>
        </div>

        {/* FOOTER */}
        <footer
          className="avoid-break"
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          <p>Dokumen ini adalah hasil cetak sistem.</p>
          <p>Harap simpan untuk keperluan administrasi.</p>

          <p style={{ marginTop: "6px" }}>{tanggalCetak}</p>
        </footer>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "6px 4px",
  textAlign: "left",
  background: "#f1f5f9",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  padding: "5px 4px",
};
