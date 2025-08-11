"use client";

import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  currentPassword: yup
    .string()
    .required("Current password is required"),
});

function StyledInput({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  toggle,
  show,
}: any) {
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "w-full px-4 py-3 text-sm rounded-xl border bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
          error && touched ? "border-red-500" : "border-gray-300"
        )}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  );
}

interface ModalChangePasswordProps {
  onClose: () => void;
  onSave: (oldPwd: string, newPwd: string) => void;
}

export default function ModalChangePassword({ onClose, onSave }: ModalChangePasswordProps) {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      currentPassword: "",
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      onSave(values.currentPassword, values.newPassword);
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // tunggu animasi selesai
    },
  });

  React.useEffect(() => {
    // memicu transisi saat modal pertama kali muncul
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // beri jeda untuk animasi keluar
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center glass-card bg-opacity-50 transition-opacity">
      <div
        className={cn(
          "transform transition-all duration-300 ease-out",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          "w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative"
        )}
      >
        <button onClick={handleClose} className="absolute top-3 right-4 text-gray-500 hover:text-gray-700">
          ✕
        </button>
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Change your Password</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <StyledInput
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.currentPassword}
              touched={formik.touched.currentPassword}
              toggle={() => setShowCurrentPassword(!showCurrentPassword)}
              show={showCurrentPassword}
            />
            {formik.errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <StyledInput
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.newPassword}
              touched={formik.touched.newPassword}
              toggle={() => setShowNewPassword(!showNewPassword)}
              show={showNewPassword}
            />
            {formik.errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <div
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium rounded-xl px-6 py-2 text-center cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </div>
            <div
              className="bg-green-500 hover:bg-green-600 transition text-white font-medium rounded-xl px-6 py-2 text-center cursor-pointer"
              onClick={formik.handleSubmit as any}
            >
              Save
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
