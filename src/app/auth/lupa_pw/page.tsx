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
  confirmPassword: yup
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

export default function ChangePasswordPage() {
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, { setErrors }) => {
      if (values.newPassword !== values.confirmPassword) {
        setErrors({ confirmPassword: "Passwords must match" });
        return;
      }
      console.log("Submitted values:", values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Change your Password</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <StyledInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              show={showConfirmPassword}
            />
            {formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <div
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium rounded-xl px-6 py-2 text-center cursor-pointer"
              onClick={() => formik.resetForm()}
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
