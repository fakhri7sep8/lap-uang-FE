"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <section className="flex gap-0">
        <div className="w-full bg-[url('/img/login.png')] bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center"></div>
        <div className="w-full bg-[url('/img/bg-login.png')]  bg-no-repeat bg-inherit bg-cover  h-screen flex items-center justify-center ">
          <div className=" h-[85%] w-[70%] flex items-center justify-center flex-col gap-8  rounded-xl ">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="mb-4"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <h2 className="text-3xl font-bold text-[#154168]">
                Hai, selamat datang kembali
              </h2>
              <p className="text-sm text-gray-600">
                baru di myEdlinks?{" "}
                <span className="underline decoration-2 decoration-blue-500 text-blue-500 cursor-pointer">
                  Daftar Gratis
                </span>
              </p>
            </div>
            <div className="w-full">
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="h-14"
              />
            </div>
            <div className="relative w-full ">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="pr-10 h-14" // padding kanan supaya icon tidak menutupi text
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="w-full flex flex-col gap-4">
              <button
                type="submit"
                className="w-full h-14 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Masuk
              </button>
              <p className="text-sm text-blue-600 mt-2 underline decoration-2 decoration-blue-500 text-right">
                Lupa kata sandi
              </p>
            </div>
            <div className="border-t border-y-2 border-y-[#ECF1F6]  py-4 w-full flex flex-row items-center gap-5">
              <input
                title="input"
                type="checkbox"
                id="accept"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <p>Ingat perangkat ini</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
