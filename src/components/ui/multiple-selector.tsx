"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";

export interface Option {
  label: string;
  value: string;
  disable?: boolean;
}

interface MultipleSelectorProps {
  defaultOptions: Option[];
  value: Option[];
  onChange: (selected: Option[]) => void;
  selectAll?: boolean; // controlled dari parent
  onSelectAllChange?: (val: boolean) => void;
  placeholder?: string;
  emptyIndicator?: React.ReactNode;
}

const MultipleSelector: React.FC<MultipleSelectorProps> = ({
  defaultOptions,
  value,
  selectAll = false,
  onSelectAllChange,
  onChange,
  placeholder = "Select...",
  emptyIndicator,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!search) return defaultOptions;
    return defaultOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, defaultOptions]);

  const toggleOption = (option: Option) => {
    if (option.value === "__ALL__") {
      const newState = !selectAll;
      onSelectAllChange?.(newState);

      if (newState) {
        // Set semua siswa ke selected
        onChange(defaultOptions);
      } else {
        // Reset semua
        onChange([]);
      }

      return;
    }

    const isSelected = value.some((v) => v.value === option.value);

    const newValue = isSelected
      ? value.filter((v) => v.value !== option.value)
      : [...value, option];

    // pastiin nggak ada duplikat
    const uniqueValue = Array.from(
      new Map(newValue.map((v) => [v.value, v])).values()
    );

    onChange(uniqueValue);
    setSearch("");
    setIsOpen(true);
  };

  // Klik di luar dropdown → tutup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="border border-slate-300 rounded-md p-2 flex flex-wrap gap-1 cursor-text min-h-[44px] items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Badge */}
        {!selectAll &&
          value.map((v) => (
            <span
              key={v.value}
              className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {v.label}
              <button
                type="button"
                className="ml-1 text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(v);
                }}
              >
                ×
              </button>
            </span>
          ))}

        {/* Badge pilih semua */}
        {selectAll && (
          <span className="bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-md text-sm">
            Semua siswa dipilih
          </span>
        )}

        <input
          type="text"
          placeholder={value.length === 0 && !selectAll ? placeholder : ""}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          className="flex-1 outline-none px-1 py-1 min-w-[120px] bg-transparent text-slate-800 dark:text-slate-100"
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-slate-300 rounded-md bg-white dark:bg-slate-800 shadow-md">
          {/* Pilihan Semua */}
          <button
            type="button"
            onClick={() =>
              toggleOption({ label: "Pilih Semua", value: "__ALL__" })
            }
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              selectAll
                ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                : "hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
            }`}
          >
            Pilih Semua
          </button>

          {filteredOptions.length === 0
            ? emptyIndicator || (
                <p className="p-2 text-slate-500 dark:text-slate-400">
                  No options
                </p>
              )
            : filteredOptions.map((opt) => {
                const selected = value.some((v) => v.value === opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disable}
                    onClick={() => toggleOption(opt)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      selected
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        : "hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200"
                    } ${opt.disable ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {opt.label} {selected && "✔"}
                  </button>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default MultipleSelector;
