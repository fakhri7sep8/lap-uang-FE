"use client";

import React, { useState } from "react";
import { Loader2, Check } from "lucide-react";

type ExportPDFButtonProps = {
  label?: string;
  onExport: (action: "check" | "export") => Promise<boolean | void>;
  className?: string;
};

export default function ExportPDFButton({
  label = "Export PDF",
  onExport,
  className = "",
}: ExportPDFButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async () => {
    try {
      // === 1. CEK DULU Apakah siap export ===
      const isReady = await onExport("check");
      if (!isReady) {
        console.warn("Data tidak siap untuk export");
        return; // ❗ kalau tidak siap: JANGAN loading
      }

      // === 2. Baru mulai loading ===
      setStatus("loading");

      // === 3. Jalankan proses export PDF sesungguhnya ===
      await onExport("export");

      // === 4. Set success ===
      setStatus("success");

      // === 5. Reset tombol ===
      setTimeout(() => setStatus("idle"), 1200);
    } catch (err) {
      console.error("Export error:", err);
      setStatus("idle");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className={`
        relative px-5 py-3 rounded-xl font-semibold text-white 
        transition-all duration-300 shadow-md
        bg-gradient-to-r from-blue-600 to-blue-500
        hover:from-blue-500 hover:to-blue-400
        active:scale-[0.97]
        disabled:opacity-70 disabled:cursor-not-allowed
        flex items-center gap-2
        ${className}
      `}
    >
      {status === "loading" && (
        <>
          <Loader2 className="animate-spin w-5 h-5 text-white" />
          <span>Menggenerasi...</span>
        </>
      )}

      {status === "success" && (
        <>
          <Check className="w-5 h-5 text-white animate-scaleIn" />
          <span>Berhasil!</span>
        </>
      )}

      {status === "idle" && (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M6 21h12" />
          </svg>
          <span>{label}</span>
        </>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </button>
  );
}
