"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen">

      <div className="w-1/2 bg-[url('/img/login.png')] bg-cover bg-no-repeat bg-center"></div>
      <div className="w-1/2 bg-[url('/img/bg-login.png')] bg-cover bg-no-repeat flex items-center justify-center">
        <div className="bg-white z-10 p-10 rounded-3xl shadow-xl w-[80%] max-w-md flex flex-col items-center gap-6">
          <Image src="/img/logo.png" alt="Logo" width={120} height={120} />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#154168]">
              Hai, selamat datang kembali
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              baru di LapUang?{" "}
              <span className="text-[#00b894] underline cursor-pointer">
                Daftar Gratis
              </span>
            </p>
          </div>

          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            className="h-12"
          />

          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="pr-10 h-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center w-full gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-[#00b894] bg-gray-100 border-gray-300 rounded focus:ring-[#00b894]"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Ingat perangkat ini
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#00b894] text-white rounded-md hover:bg-[#00a383] transition"
          >
            Log in
          </button>

          <p className="text-sm text-[#00b894] underline cursor-pointer text-right w-full">
            Lupa password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
