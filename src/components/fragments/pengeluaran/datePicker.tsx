"use client";

import React, { useRef, useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

type DatePickerInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
  };

export default function DatePickerInput({
  value,
  onChange,
  className,
  disabled,
  placeholder = "Pilih tanggal",
  ...props
}: DatePickerInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  /* ===== Outside Click ===== */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* INPUT */}
      <input
        ref={inputRef}
        type="text"
        readOnly
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onClick={() => !disabled && setOpen(true)}
        className={cn(
          "w-full h-11 px-3 text-sm rounded-lg border shadow-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "cursor-pointer bg-white",
          disabled &&
            "bg-gray-100 text-gray-400 cursor-not-allowed",
          className
        )}
        {...props}
      />

      {/* CALENDAR */}
      {open && !disabled && (
        <div className="absolute z-50 mt-2 left-0 bg-white border rounded-xl shadow-lg p-3">
          <Calendar
            mode="single"
            selected={value ? new Date(value as string) : undefined}
            onSelect={(date) => {
              if (!date || !onChange || !inputRef.current) return;

              const formatted = dayjs(date).format("YYYY-MM-DD");

              // Trigger onChange seperti input asli
              const event = {
                target: {
                  value: formatted,
                  name: inputRef.current.name,
                },
              } as React.ChangeEvent<HTMLInputElement>;

              onChange(event);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
