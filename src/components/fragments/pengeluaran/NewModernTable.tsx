"use client";

import React from "react";
import dayjs from "dayjs";

type Column = {
  label: string;
  key: string;
  align?: "left" | "center" | "right";
  format?: (value: any, row: any) => any;
};

type ModernTableProps = {
  data: any[];
  columns: Column[];
  title?: string;
};

export default function NewModernTable({
  data = [],
  columns = [],
  title,
}: ModernTableProps) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* TITLE */}
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-4 px-6 font-semibold uppercase tracking-wide text-xs ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}

            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-4 px-6 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.format
                      ? col.format(row[col.key], row)
                      : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
