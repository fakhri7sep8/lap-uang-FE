"use client";

import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Generic column definition so this component can be reused for any dataset
export type Column<T> = {
  /** Header label shown in preview & used as Excel column name */
  header: string;
  /** Unique key for React rendering */
  key: string;
  /** Optional value extractor/formatter; falls back to row[key] */
  value?: (row: T, index: number) => any;
};

export type ExportPreviewButtonProps<T> = {
  /** Data to export (apply your filtering/pagination BEFORE passing here) */
  data: T[];
  /** Column configuration */
  columns: Column<T>[];
  /** Output filename without extension. Default: "export" */
  filename?: string;
  /** Button label. Default: "Preview & Export" */
  buttonText?: string;
  /** Max rows displayed in preview table (for performance). Default: 20 */
  previewLimit?: number;
  /** Optional Tailwind classes for the trigger button */
  className?: string;
};

function buildRows<T>(data: T[], columns: Column<T>[]): Record<string, any>[] {
  return data.map((row, idx) => {
    const out: Record<string, any> = {};
    for (const col of columns) {
      const raw = col.value ? col.value(row, idx) : (row as any)?.[col.key];
      out[col.header] = raw ?? "";
    }
    return out;
  });
}

function autosizeColumns(rows: Record<string, any>[]) {
  const headers = Object.keys(rows[0] ?? {});
  return headers.map((h) => {
    const maxCell = rows.reduce((acc, r) => {
      const v = r[h];
      const len = (v === null || v === undefined) ? 0 : String(v).length;
      return Math.max(acc, len);
    }, h.length);
    // heuristic width: header length vs max cell length, + 2 padding
    return { wch: Math.min(Math.max(maxCell + 2, 10), 60) };
  });
}

export default function ExportPreviewButton<T = any>(props: ExportPreviewButtonProps<T>) {
  const {
    data,
    columns,
    filename = "export",
    buttonText = "Preview & Export",
    previewLimit = 20,
    className,
  } = props;

  const [open, setOpen] = useState(false);

  // Prepare rows only when dialog opens or dependencies change
  const rows = useMemo(() => buildRows<T>(data, columns), [data, columns]);
  const hasData = rows.length > 0;

  const download = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    // auto column width
    if (rows.length) {
      (ws as any)["!cols"] = autosizeColumns(rows);
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const safeName = filename.replace(/[^a-zA-Z0-9-_]/g, "-");
    XLSX.writeFile(wb, `${safeName}-${dayjs().format("YYYY-MM-DD")}.xlsx`);
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={"bg-emerald-600 text-white gap-2 " + (className ?? "")}
      >
        <FileDown size={16} />
        {buttonText}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-5xl bg-white rounded-2xl shadow-xl border p-6 flex flex-col gap-4"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Preview Data</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm text-gray-500">
                {hasData
                  ? `Menampilkan ${Math.min(rows.length, previewLimit)} dari ${rows.length} baris`
                  : "Tidak ada data untuk diekspor"}
              </div>

              <div className="overflow-auto max-h-[60vh] border rounded-lg">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      {Object.keys(rows[0] ?? {}).map((h) => (
                        <th
                          key={h}
                          className="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, previewLimit).map((r, i) => (
                      <tr key={i} className="odd:bg-white even:bg-gray-50">
                        {Object.keys(r).map((k) => (
                          <td key={k} className="px-3 py-2 align-top border-b border-gray-100">
                            {String(r[k] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button onClick={() => setOpen(false)} variant="secondary" className="bg-gray-200 text-gray-800">
                  Batal
                </Button>
                <Button onClick={download} className="bg-emerald-600 text-white">
                  Download Excel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
