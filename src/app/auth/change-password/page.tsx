"use client";

import { useEffect, useState } from "react";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newPassword || !confirm) {
      setError("Semua field harus diisi.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    const sessionId = localStorage.getItem("resetSessionId");
    if (!sessionId) {
      setError("Tidak ada sesi reset. Silakan ulangi proses.");
      return;
    }

    try {
      setLoading(true);
      const email = sessionStorage.getItem("forgotEmail");
      const res = await fetch("https://lap-uang-be.vercel.app/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetSessionId: sessionId,
          newPassword: newPassword as
            | string
            | number
            | boolean
            | null
            | undefined as any as string, 
            email: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mengganti password");
        return;
      }

      setSuccessMsg("Password berhasil diubah! Mengalihkan...");

      localStorage.removeItem("resetSessionId");
      sessionStorage.removeItem("forgotEmail");

      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
            MQ
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Sekolah Menengah Kejuruan</p>
            <p className="text-lg font-semibold text-gray-900 -mt-1">
              MADINATUL QURAN
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900">
          Ganti Password
        </h2>

        <p className="text-center text-gray-600 text-sm mb-6">
          Masukkan password baru kamu.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Password baru */}
          <label className="block text-sm">
            <span className="text-gray-700">Password Baru</span>
            <input
              type="password"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>

          {/* Konfirmasi */}
          <label className="block text-sm">
            <span className="text-gray-700">Konfirmasi Password</span>
            <input
              type="password"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {successMsg && (
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg hover:bg-green-800 transition"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
