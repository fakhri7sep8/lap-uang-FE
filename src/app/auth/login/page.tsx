"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useAuthModule } from "@/hooks/useAuthModule";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { useLogin } = useAuthModule();

  const { mutate, isPending } = useLogin();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <div>
      <section className="flex flex-col md:flex-row min-h-screen">
        <div className="hidden md:flex w-1/2 bg-[url('/img/login.png')] bg-cover bg-no-repeat bg-center items-center justify-center"></div>
        <div className="w-full md:w-1/2 bg-[url('/img/bg-login.png')] bg-cover flex items-center justify-center px-6 py-12">
          <div className="glass-card w-full max-w-md flex flex-col justify-center items-center gap-6 rounded-4xl py-6 px-6 md:px-12 bg-white/20 backdrop-blur-md">
            <Image src="/img/logo.png" alt="Logo" width={100} height={100} />
            <h3 className="text-xl font-semibold text-center">
              Selamat Datang Kembali
            </h3>

            <form
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <label>Email address</label>
                <Input
                  type="email"
                  name="email"
                  className="h-9"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label>Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="h-9 pr-12"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <div
                  className="absolute right-4 top-11 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full h-12 text-white rounded-xl mt-4 transition-colors duration-300 ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#22C39E] to-[#006A73] hover:opacity-90"
                  }`}
                >
                  {isPending ? "Loading..." : "Log in"}
                </button>
                <p className="text-[#17A590] text-right text-sm">
                  Lupa password?
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
