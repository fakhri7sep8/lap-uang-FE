"use client";

import { Calendar, ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DateRangeFilterModern({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  const applyFilter = () => {
    setOpen(false);
  };

  const resetFilter = () => {
    onChange({ startDate: "", endDate: "" });
    setOpen(false);
  };

  return (
    <div className="relative inline-block mb-4">
      {/* BUTTON UTAMA */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm 
        hover:bg-gray-100 transition-all text-sm"
      >
        <Calendar className="w-4 h-4" />
        Filter Tanggal
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute mt-2 right-0 bg-white border rounded-xl shadow-lg w-64 p-4 z-20"
          >
            <h4 className="text-xs font-semibold text-gray-500 mb-3">
              Pilih Rentang Tanggal
            </h4>

            {/* DATE INPUTS */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-600">Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    onChange({ startDate: e.target.value, endDate })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none 
                  shadow-sm bg-white hover:border-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    onChange({ startDate, endDate: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none 
                  shadow-sm bg-white hover:border-gray-400 transition-all"
                />
              </div>
            </div>

            {/* BUTTON TERAPKAN */}
            <button
              onClick={applyFilter}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm 
              hover:bg-blue-700 transition-all shadow-sm"
            >
              Terapkan Filter
            </button>

            {/* RESET */}
            <button
              onClick={resetFilter}
              className="w-full mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm 
              hover:bg-red-100 transition-all"
            >
              Reset Filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
