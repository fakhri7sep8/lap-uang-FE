"use client";

import React, { useState } from "react";
import { Loader2, Check, Download } from "lucide-react";

type ExportPDFButtonProps = {
  label?: string;
  onExport: (action: "check" | "export") => Promise<boolean | void>;
  className?: string;
};

export default function ExportPDFButton({
  label = "Export",
  onExport,
  className = "",
}: ExportPDFButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = async () => {
    try {
      const isReady = await onExport("check");
      if (!isReady) {
        console.warn("Data tidak siap untuk export");
        return;
      }

      setStatus("loading");
      await onExport("export");
      setStatus("success");
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
        relative flex items-center justify-between gap-2
        px-6 py-3 rounded-md font-bold text-white
        transition-all duration-200 shadow-md
        bg-rose-600 hover:bg-rose-400 active:scale-[0.98]
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      style={{ minWidth: 120 }}
    >
      {status === "loading" && (
        <>
          <span
            className="flex items-center gap-2"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Loader2 className="animate-spin w-5 h-5 text-white" />
            <span style={{ fontWeight: 700 }}>Menggenerasi...</span>
          </span>
        </>
      )}

      {status === "success" && (
        <>
          <span
            className="flex items-center gap-2"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Check className="w-5 h-5 text-white animate-scaleIn" />
            <span>Berhasil!</span>
          </span>
        </>
      )}

      {status === "idle" && (
        <>
          {/* label kiri */}
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "13px",
            }}
          >
            {label}
          </span>

          {/* icon unduh kanan */}
          <Download className="w-4 h-4 text-white" />
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
