"use client";
import { useAuthModule } from "@/hook/useAuthModule";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import ModalChangePassword from "@/components/ui/changeModal";


interface JwtPayload {
  email: string;
  userId?: string;
  role?: string;
  exp?: number;
}

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("***************");
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  const { useChangePassword } = useAuthModule();
  const changePasswordMutation = useChangePassword();

  useEffect(() => {
    const token = Cookie.get("x-auth");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Token tidak valid:", error);
      }
    }
  }, []);

  const handleChangePasswordPopup = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-96 py-10 relative">
      <h1 className="text-lg font-semibold mb-6 absolute top-6 left-6">
        Account Settings
      </h1>

      <div className="p-6 rounded-lg w-full pt-20">
        <label htmlFor="name" className="text-sm font-medium cursor-pointer">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          defaultValue="ihsan pratama"
          className="w-full mt-1 mb-4 px-3 py-2 rounded-md shadow-md text-gray-400 bg-white"
        />

        <label htmlFor="email" className="text-sm font-medium cursor-pointer">
          Your Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full mt-1 mb-4 px-3 py-2 rounded-md shadow-md bg-white text-gray-400"
        />

        <label htmlFor="password" className="text-sm font-medium cursor-pointer">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showNewPassword ? "text" : "password"}
            value={password}
            disabled
            className="w-full mt-1 px-3 py-2 rounded-md shadow-md bg-white pr-10 text-gray-300"
          />
          <div
            className="absolute top-2 right-3 cursor-pointer"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? (
              <EyeOff className="w-5 h-5 text-gray-600" />
            ) : (
              <Eye className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>

        <p
          className="text-green-600 text-sm mt-1 mb-4 cursor-pointer hover:underline"
          onClick={handleChangePasswordPopup}
        >
          Change
        </p>

        <div className="mt-6 p-6 rounded-md shadow-md bg-white">
          <p className="text-green-600 font-medium text-sm hover:underline cursor-pointer">
            delete my account
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Are you sure you want to
            <br />
            permanently delete your account?
            <br />
            This action cannot be undone.
          </p>
        </div>
      </div>

      {isModalOpen && (
        <ModalChangePassword
          onClose={() => setIsModalOpen(false)}
          onSave={(oldPwd: string, newPwd: string) => {
            const token = Cookie.get("x-auth");
            if (!token) {
              Swal.fire("Oops!", "Token tidak ditemukan", "error");
              return;
            }

            try {
              const decoded = jwtDecode<JwtPayload>(token);
              const payload = {
                email: decoded.email,
                oldPassword: oldPwd,
                newPassword: newPwd,
              };
              changePasswordMutation.mutate(payload);
            } catch (error) {
              console.error("Gagal decode token:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default Settings;
