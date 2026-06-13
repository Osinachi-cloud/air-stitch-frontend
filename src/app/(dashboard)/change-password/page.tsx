"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const DotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v.01M12 12v.01M12 18v.01" />
  </svg>
);

const requirements = [
  { key: "hasMinLength", label: "At least 8 characters" },
  { key: "hasUppercase", label: "One uppercase letter (A–Z)" },
  { key: "hasLowercase", label: "One lowercase letter (a–z)" },
  { key: "hasNumber", label: "One number (0–9)" },
  { key: "hasSpecialChar", label: "One special character (!@#$...)" },
] as const;

type ReqKey = (typeof requirements)[number]["key"];

function getStrength(reqs: Record<ReqKey, boolean>): number {
  return Object.values(reqs).filter(Boolean).length;
}

function StrengthBar({ strength }: { strength: number }) {
  const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["bg-gray-200", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const textColors = ["text-gray-400", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600", "text-green-700"];

  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]}</p>
      )}
    </div>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [reqs, setReqs] = useState<Record<ReqKey, boolean>>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
    hasNumber: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const p = formData.newPassword;
    setReqs({
      hasMinLength: p.length >= 8,
      hasUppercase: /[A-Z]/.test(p),
      hasLowercase: /[a-z]/.test(p),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
      hasNumber: /[0-9]/.test(p),
    });
  }, [formData.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
    setSuccess(false);
  };

  const validate = () => {
    const errs: string[] = [];
    if (!formData.currentPassword) errs.push("Current password is required.");
    if (!formData.newPassword) errs.push("New password is required.");
    if (formData.newPassword && formData.newPassword === formData.currentPassword)
      errs.push("New password must differ from your current password.");
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
      errs.push("Passwords do not match.");
    if (formData.newPassword && !Object.values(reqs).every(Boolean))
      errs.push("Please meet all password requirements.");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const strength = getStrength(reqs);
  const passwordsMatch =
    formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword;

  return (
    <div className="py-6">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 md:p-8 shadow-sm">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Login &amp; Security</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your password and account security</p>
          </div>
        </div>

        <div className="max-w-xl">

          {/* Success Banner */}
          {success && (
            <div className="mb-8 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Password updated successfully</p>
                <p className="text-xs text-green-600 mt-0.5">Your account is now secured with your new password.</p>
              </div>
            </div>
          )}

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Choose a strong, unique password.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                    errors.some((e) => e.toLowerCase().includes("current"))
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <EyeIcon open={show.current} />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-1" />

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Create a new password"
                  className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <EyeIcon open={show.new} />
                </button>
              </div>

              {/* Strength bar */}
              {formData.newPassword.length > 0 && <StrengthBar strength={strength} />}

              {/* Requirements */}
              <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Password requirements</p>
                {requirements.map((r) => (
                  <div key={r.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      reqs[r.key] ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {reqs[r.key] ? <CheckIcon /> : <DotIcon />}
                    </div>
                    <span className={`text-[13px] transition-colors ${reqs[r.key] ? "text-green-700 font-medium" : "text-gray-500"}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                  className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                    passwordsMismatch
                      ? "border-red-400 bg-red-50"
                      : passwordsMatch
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <EyeIcon open={show.confirm} />
                </button>
              </div>
              {passwordsMatch && (
                <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Passwords match
                </p>
              )}
              {passwordsMismatch && (
                <p className="text-xs text-red-500 mt-1.5">Passwords do not match.</p>
              )}
            </div>

            {/* Error list */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <ul className="space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="mt-0.5 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white text-sm font-medium py-3 rounded-xl hover:bg-black transition-colors"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setErrors([]);
                  setSuccess(false);
                }}
                className="flex-1 sm:flex-none sm:px-6 border border-gray-300 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="text-center pt-1">
              <a href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">
                Forgot your current password?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
