"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { errorToast, successToast } from "@/hooks/UseToast";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <span role="img" aria-label="Hide password">👁️</span>
  ) : (
    <span role="img" aria-label="Show password">🙈</span>
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
  const colors = ["bg-surface-200", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const textColors = ["text-surface-400", "text-red-500", "text-orange-500", "text-yellow-600", "text-green-600", "text-green-700"];

  return (
    <div className="mt-3">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-surface-200"
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
  const { getUserDetails } = useLocalStorage<User>("customerDetails");
  const stored = getUserDetails();
  const token = stored?.accessToken;

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
  const [isLoading, setIsLoading] = useState(false);

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
    if (!formData.confirmPassword) errs.push("Confirm password is required.");
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
      errs.push("Passwords do not match.");
    // Let the backend validate password strength and old-password correctness
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ChangePassword] handleSubmit fired");

    if (!validate()) {
      console.log("[ChangePassword] client validation failed", errors);
      return;
    }

    // Fallback: try customerDetails first, then userDetails
    let authToken = token;
    if (!authToken) {
      const fallbackRaw = localStorage.getItem("userDetails");
      if (fallbackRaw) {
        try {
          const fallback = JSON.parse(fallbackRaw);
          authToken = fallback?.accessToken || fallback?.access_token;
          console.log("[ChangePassword] fallback token found");
        } catch {
          console.log("[ChangePassword] fallback parse failed");
        }
      }
    }

    if (!authToken) {
      console.log("[ChangePassword] no token found");
      setErrors(["Authentication token not found. Please log in again."]);
      return;
    }

    setIsLoading(true);
    console.log("[ChangePassword] calling fetch...");

    try {
      const endpoint = `${baseUrL}/change-password`;
      console.log("[ChangePassword] endpoint:", endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          password: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      console.log("[ChangePassword] response status:", res.status);
      const data = await res.json();
      console.log("[ChangePassword] response data:", data);

      if (res.ok) {
        setSuccess(true);
        successToast("Password updated successfully");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const msg = data?.message || data?.error || "Failed to update password.";
        setErrors([msg]);
        errorToast(msg);
      }
    } catch (err: any) {
      console.error("[ChangePassword] fetch error:", err);
      const msg = err?.message || "An unexpected error occurred. Please try again.";
      setErrors([msg]);
      errorToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getStrength(reqs);
  const passwordsMatch =
    formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword;

  return (
    <div className="py-6">
      <div className="w-full rounded-2xl border border-surface-100 bg-white p-4 md:p-6 shadow-card">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-display font-bold text-surface-800">Login &amp; Security</h1>
            <p className="text-sm text-surface-500 mt-0.5">Manage your password and account security</p>
          </div>
        </div>

        <div className="max-w-xl">

          {/* Success Banner */}
          {success && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Password updated successfully</p>
                <p className="text-xs text-emerald-600 mt-0.5">Your account is now secured with your new password.</p>
              </div>
            </div>
          )}

          {/* Section label */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-surface-800">Change Password</h2>
              <p className="text-xs text-surface-500">Choose a strong, unique password.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Password */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={show.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className={`w-full px-3 py-2.5 pr-11 border rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all ${
                    errors.some((e) => e.toLowerCase().includes("current"))
                      ? "border-red-400 bg-red-50"
                      : "border-surface-300 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors"
                >
                  <EyeIcon open={show.current} />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-surface-100 pt-1" />

            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={show.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Create a new password"
                  className="w-full px-3 py-2.5 pr-11 border border-surface-200 rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors"
                >
                  <EyeIcon open={show.new} />
                </button>
              </div>

              {/* Strength bar */}
              {formData.newPassword.length > 0 && <StrengthBar strength={strength} />}

              {/* Requirements */}
              <div className="mt-3 bg-surface-50 rounded-xl p-3 space-y-2">
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wide mb-2">Password requirements</p>
                {requirements.map((r) => (
                  <div key={r.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      reqs[r.key] ? "bg-emerald-500 text-white" : "bg-surface-200 text-surface-400"
                    }`}>
                      {reqs[r.key] ? <CheckIcon /> : <DotIcon />}
                    </div>
                    <span className={`text-[13px] transition-colors ${reqs[r.key] ? "text-emerald-700 font-medium" : "text-surface-500"}`}>
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                  className={`w-full px-3 py-2.5 pr-11 border rounded-xl text-sm text-surface-800 placeholder-surface-400 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all ${
                    passwordsMismatch
                      ? "border-red-400 bg-red-50"
                      : passwordsMatch
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-surface-200 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow((p) => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 transition-colors"
                >
                  <EyeIcon open={show.confirm} />
                </button>
              </div>
              {passwordsMatch && (
                <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
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
                disabled={isLoading}
                className={`flex-1 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors ${
                  isLoading ? "bg-surface-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setErrors([]);
                  setSuccess(false);
                }}
                className="flex-1 sm:flex-none sm:px-6 border border-surface-200 text-surface-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="text-center pt-1">
              <a href="/forgot-password" className="text-sm text-surface-500 hover:text-primary-700 underline underline-offset-2 transition-colors">
                Forgot your current password?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
