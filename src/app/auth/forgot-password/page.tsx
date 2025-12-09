"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "sent" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setStatus(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMsg("Masukkan email valid.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://lap-uang-be.vercel.app/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Gagal mengirim email.");
        setStatus("error");
        setLoading(false);
        return;
      }
        sessionStorage.setItem("forgotEmail", email);

      // Simpan email sebelum clear, lalu langsung arahkan ke halaman verify-token
      const sentEmail = email;
      setStatus("sent");
      setEmail("");

      // navigasi ke halaman verify-token dan sertakan email sebagai query param
      router.push(`/auth/verify-token?email=${encodeURIComponent(sentEmail)}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Terjadi kesalahan server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8">
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

        <h2 className="text-2xl font-bold text-center text-gray-900 mt-2">
          Lupa Password?
        </h2>
        <p className="text-center text-gray-600 text-sm mt-2 mb-6">
          Masukkan email kamu untuk menerima kode reset password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourmail@gmail.com"
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </label>

          {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}

          {status === "sent" && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
              Kode reset password telah dikirim ke email kamu.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-700 text-white font-semibold py-2.5 rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-800"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Kode Reset"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-5">
          Sudah ingat password?{" "}
          <Link
            href="/auth/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
