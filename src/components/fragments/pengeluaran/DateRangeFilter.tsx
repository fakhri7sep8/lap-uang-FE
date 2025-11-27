"use client";

import {
  CalendarIcon,
  ChevronsDown,
  Calendar,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

type Props = {
  startDate: string;
  endDate: string;
  onChange: (value: { startDate: string; endDate: string }) => void;
};

export default function DateRangeFilterModern({
  startDate,
  endDate,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [showStartCal, setShowStartCal] = useState(false);
  const [showEndCal, setShowEndCal] = useState(false);

  // ✅ TEMP STATE (UNTUK UI)
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const [startMonth, setStartMonth] = useState<Date>(new Date());
  const [endMonth, setEndMonth] = useState<Date>(new Date());

  const containerRef = useRef<HTMLDivElement>(null);

  const startDateObj = tempStartDate
    ? new Date(tempStartDate)
    : null;

  /* ===== Outside Click ===== */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowStartCal(false);
        setShowEndCal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== Sinkron bulan end ===== */
  useEffect(() => {
    if (startDateObj) {
      setEndMonth(startDateObj);
    }
  }, [tempStartDate]);

  /* ===== Calendar UI ===== */
  const calendarClassNames = {
    caption: "hidden",
    table: "w-full mt-2",
    head_row:
      "grid grid-cols-7 text-center text-xs text-neutral-500 font-medium",
    head_cell: "py-1",
    row: "grid grid-cols-7 text-center",
    cell: "relative",
    day: `
      h-9 w-9 mx-auto flex items-center justify-center
      rounded-full text-sm font-medium text-neutral-700
      hover:bg-neutral-200 transition cursor-pointer
    `,
    day_selected: `
      bg-neutral-300 text-neutral-900 font-semibold
    `,
    day_today: "border border-neutral-400 font-semibold",
    day_outside: "text-neutral-300",
    day_disabled: "text-neutral-300 opacity-40 cursor-not-allowed",
  };

  /* ===== APPLY FILTER (INI YANG DIPAKAI PARENT) ===== */
  const applyFilter = () => {
    if (!tempStartDate || !tempEndDate) return;
    if (dayjs(tempEndDate).isBefore(dayjs(tempStartDate))) return;

    onChange({
      startDate: tempStartDate,
      endDate: tempEndDate,
    });

    setOpen(false);
    setShowStartCal(false);
    setShowEndCal(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full mb-4">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100 text-sm"
      >
        <CalendarIcon className="w-4 h-4" />
        Filter Tanggal
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronsDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            className="absolute right-0 z-50 mt-2 w-80 bg-white border rounded-xl shadow-lg p-4"
          >
            <h4 className="text-xs font-semibold text-gray-500 mb-3">
              Pilih Rentang Tanggal
            </h4>

            <div className="space-y-5">
              {/* START */}
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex justify-between items-center px-3 py-2 border rounded-lg cursor-pointer text-sm",
                    !tempStartDate && "text-gray-400"
                  )}
                  onClick={() => {
                    setShowStartCal(!showStartCal);
                    setShowEndCal(false);
                  }}
                >
                  {tempStartDate
                    ? dayjs(tempStartDate).format("DD MMM YYYY")
                    : "Mulai"}
                  <Calendar className="w-4 h-4" />
                </div>

                {showStartCal && (
                  <ShadCalendar
                    mode="single"
                    month={startMonth}
                    onMonthChange={setStartMonth}
                    selected={
                      tempStartDate
                        ? new Date(tempStartDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setTempStartDate(
                        dayjs(date).format("YYYY-MM-DD")
                      );
                      setShowStartCal(false);
                    }}
                    classNames={calendarClassNames}
                  />
                )}
              </div>

              {/* END */}
              <div className="space-y-2">
                <div
                  className={cn(
                    "flex justify-between items-center px-3 py-2 border rounded-lg cursor-pointer text-sm",
                    !tempEndDate && "text-gray-400"
                  )}
                  onClick={() => {
                    setShowEndCal(!showEndCal);
                    setShowStartCal(false);
                  }}
                >
                  {tempEndDate
                    ? dayjs(tempEndDate).format("DD MMM YYYY")
                    : "Sampai"}
                  <Calendar className="w-4 h-4" />
                </div>

                {showEndCal && (
                  <ShadCalendar
                    mode="single"
                    month={endMonth}
                    selected={
                      tempEndDate
                        ? new Date(tempEndDate)
                        : undefined
                    }
                    disabled={(date) =>
                      startDateObj ? date < startDateObj : false
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setTempEndDate(
                        dayjs(date).format("YYYY-MM-DD")
                      );
                      setShowEndCal(false);
                    }}
                    classNames={calendarClassNames}
                  />
                )}
              </div>
            </div>

            <button
              onClick={applyFilter}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm"
            >
              Terapkan Filter
            </button>

            <button
              onClick={() => {
                setTempStartDate("");
                setTempEndDate("");
                onChange({ startDate: "", endDate: "" });
                setOpen(false);
              }}
              className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm"
            >
              Reset Filter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
