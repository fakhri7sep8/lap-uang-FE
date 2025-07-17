import React from "react";

const LoginPage = () => {
  return (
    <div>
      <section className="flex">
        <div className="w-full bg-red-500 h-screen flex items-center justify-center">
          <h1>Login</h1>
        </div>
        <div className="w-full bg-blue-500 h-screen flex items-center justify-center">
          <div className="bg-white h-[80%] w-[70%] flex items-center flex-col gap-8">
            <p>myEdlinks</p>
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-bold text-blue-600">
                Hai , selamat datang kembali
              </h2>
              <p>
                baru di myEdlinks{" "}
                <span className="underline decoration-2 decoration-blue-500 text-blue-500">
                  Daftar Gratis
                </span>
              </p>
            </div>
            <div>
              <input
                type="email"
                name="email"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
