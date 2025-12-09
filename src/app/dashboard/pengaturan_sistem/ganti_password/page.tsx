"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuthModule } from "@/hooks/useAuthModule";

export default function GantiPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("passwordlama123");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword] = useState(false);
  const { useChangePassUser } = useAuthModule()
  const mutate = useChangePassUser()
  const handleSavePassword = () => {
    if (!newPassword.trim()) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Password baru tidak boleh kosong!",
        confirmButtonColor: "#d33",
      });
      return;
    }

    Swal.fire({
      title: "Ganti password",
      text: "Anda yakin ingin ganti password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, ganti!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Update password lama menjadi password baru
        setPassword(newPassword);
        setNewPassword("");
        const cookie = Cookie.get('x-auth')
        const decode:any= jwtDecode(cookie as any) 
        const payload = {
          data: {
            newPass: newPassword,
          },
          id: decode?.id
        }
        mutate.mutate(payload)
    
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Ganti Password
        </h2>

        {/* Password Baru */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Password Baru
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-lg p-2 w-full border-gray-300 pr-10"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Password Sekarang */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Password Sekarang
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="border rounded-lg p-2 w-full border-gray-300 bg-gray-50"
          />
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-[#d33] hover:bg-red-600 rounded-lg text-white transition">
            Batal
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            onClick={handleSavePassword}
          >
            {mutate.isPending? "sedang menyimpan": "simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
