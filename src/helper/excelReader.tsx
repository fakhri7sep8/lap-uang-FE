import * as XLSX from "xlsx";

export const readerExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
  return new Promise<{ json: any; oop: XLSX.WorkSheet } | null>((resolve) => {
    const file = e.target.files?.[0];
    if (!file) return resolve(null);

    const reader = new FileReader();

    reader.onload = (evt: any) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // 🧠 Ambil semua data mentah
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
        const rows: any[] = [];

        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row: any = {};
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = worksheet[cellAddress];
            row[C] = cell ? cell.v : "";
          }
          rows.push(row);
        }

        // 🚀 Konversi ke JSON pakai baris pertama sebagai header
        const headers = Object.values(rows[0]).map((h: any) =>
          String(h).trim().toLowerCase()
        );
        const json = rows.slice(1).map((r: any) => {
          const obj: any = {};
          headers.forEach((h: any, idx: number) => {
            obj[h.charAt(0).toUpperCase() + h.slice(1)] =
              r[idx] !== undefined ? r[idx] : "";
          });
          return obj;
        });

        // console.log("📘 [readerExcel] Hasil parsing full:", json);

        resolve({ json, oop: worksheet });
      } catch (error) {
        console.error("❌ Gagal baca Excel:", error);
        resolve(null);
      }
    };

    reader.readAsBinaryString(file);
  });
};
