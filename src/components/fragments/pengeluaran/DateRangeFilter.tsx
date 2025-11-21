"use client";

import { Calendar, ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function DateRangeFilterModern({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
}) {
  const [openPreset, setOpenPreset] = useState(false);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const todayStr = `${yyyy}-${mm}-${dd}`;
  const firstDayOfMonth = `${yyyy}-${mm}-01`;
  const firstDayOfYear = `${yyyy}-01-01`;

  const presets = [
    { label: "Hari ini", start: todayStr, end: todayStr },
    { label: "Bulan ini", start: firstDayOfMonth, end: todayStr },
    { label: "Tahun ini", start: firstDayOfYear, end: todayStr },
  ];

  return (
    <div
      className="
        inline-flex flex-wrap items-end gap-4 mb-4 p-3 
        bg-gray-50 border rounded-xl shadow-sm 
        max-w-max
      "
    >
      {/* Start Date */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Tanggal Mulai</label>
        <div className="flex items-center border px-3 py-2 rounded-lg bg-white shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              onChange({ startDate: e.target.value, endDate })
            }
            className="text-sm bg-transparent outline-none"
          />
        </div>
      </div>

      {/* End Date */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Tanggal Akhir</label>
        <div className="flex items-center border px-3 py-2 rounded-lg bg-white shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              onChange({ startDate, endDate: e.target.value })
            }
            className="text-sm bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="relative">
        <button
          onClick={() => setOpenPreset(!openPreset)}
          className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100 text-sm"
        >
          Presets
          <ChevronDown className="w-4 h-4" />
        </button>

        {openPreset && (
          <div className="absolute bg-white border rounded-lg shadow-lg mt-2 z-10 w-40 p-2">
            {presets.map((p) => (
              <button
                key={p.label}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                onClick={() => {
                  onChange({ startDate: p.start, endDate: p.end });
                  setOpenPreset(false);
                }}
              >
                {p.label}
              </button>
            ))}

            <button
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-red-600"
              onClick={() => {
                onChange({ startDate: "", endDate: "" });
                setOpenPreset(false);
              }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
