"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyTokenPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Jika datang dari forgot-password dengan query ?email=...&code=... (dev mode),
    // isi otomatis email & token supaya tidak perlu kirim email sebenarnya.
    const qEmail = searchParams.get("email");
    const qCode = searchParams.get("code");
    if (qEmail) setEmail(qEmail);
    if (qCode) setToken(qCode);
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !token) {
      setError("Email dan token harus diisi.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3232/auth/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Token salah");
        return;
      }

      // simpan session ID ke localStorage
      if (data.resetSessionId) localStorage.setItem("resetSessionId", data.resetSessionId);

      setSuccessMsg("Token valid! Mengarahkan ke halaman ganti password...");

      setTimeout(() => {
        window.location.href = "/auth/change-password";
      }, 1200);
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

        <h2 className="text-2xl font-bold text-center text-gray-900">Verifikasi Token</h2>
        <p className="text-center text-gray-600 text-sm mt-2 mb-6">
          Masukkan email & token yang dikirim ke email.
        </p>

        {/* Dev helper: jika token ada di query param tampilkan agar tidak perlu kirim email */}
        {searchParams.get("code") && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
            Kode (dev): <span className="font-mono">{searchParams.get("code")}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          {/* Email */}
          <label className="block text-sm">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              placeholder="yourmail@gmail.com"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Token */}
          <label className="block text-sm">
            <span className="text-gray-700">Token (6 digit / huruf)</span>
            <input
              type="text"
              maxLength={6}
              placeholder="ABC123"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm tracking-widest text-center focus:ring-2 focus:ring-green-600 outline-none"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </label>

          {/* Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Success */}
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
            {loading ? "Memverifikasi..." : "Verifikasi Token"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Kembali ke{" "}
          <Link href="/auth/login" className="text-green-700 font-semibold hover:underline">
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
