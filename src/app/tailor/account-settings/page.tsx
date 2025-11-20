"use client";

import { useState } from "react";

type TabKey = "personal" | "business";

export default function TailorSettingsPage() {
  const [tab, setTab] = useState<TabKey>("personal");

  return (
    <div className="min-h-screen bg-[#F2F6FF] p-6 md:p-10">
      <div className="mx-auto max-w-8xl">
        <TabNav tab={tab} setTab={setTab} />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          {tab === "personal" ? <PersonalForm /> : <BusinessForm />}
        </div>
      </div>
    </div>
  );
}

/* -------------------- BEAUTIFIED TAB NAV -------------------- */
function TabNav({
  tab,
  setTab,
}: {
  tab: TabKey;
  setTab: (k: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string; icon: JSX.Element; hint: string }[] = [
    {
      key: "personal",
      label: "Personal",
      icon: <UserIcon className="h-4 w-4" />,
      hint: "Profile & password",
    },
    {
      key: "business",
      label: "Business",
      icon: <BriefcaseIcon className="h-4 w-4" />,
      hint: "Documents & finance",
    },
  ];

  return (
    <div className="">
      <div className="relative">
        {/* scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="inline-flex rounded-full bg-white shadow-sm border border-gray-200 p-1">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2
                    ${active
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span className={`${active ? "opacity-100" : "opacity-70"} transition`}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- ICONS (tiny inline SVGs) -------------------- */
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
    </svg>
  );
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="1.8" />
      <path strokeWidth="1.8" d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path strokeWidth="1.8" d="M3 12h18" />
    </svg>
  );
}

/* -------------------- PERSONAL FORM -------------------- */
function PersonalForm() {
  return (
    <form className="space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-500">Update your personal details and password</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" defaultValue="OTITOLUWA" />
        <Input label="Username" defaultValue="CHINAZA" />
        <Input label="Phone Number" defaultValue="+234 80656506333" />
        <Input label="Email" defaultValue="Otittoluwachi@gmail.com" />
        <Input label="Address" defaultValue="No. 93 Skyfield Apartments" className="md:col-span-2" />
        <Input label="State" defaultValue="Lagos" />
        <Input label="Country" defaultValue="Nigeria" />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Old Password" type="password" />
          <Input placeholder="New Password" type="password" />
          <Input placeholder="Confirm Password" type="password" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

/* -------------------- BUSINESS FORM -------------------- */
function BusinessForm() {
  return (
    <form className="space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Business Information</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your business details and documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadCard label="Business registration certificate" />
        <UploadCard label="Business premises photo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Business Name *" defaultValue="JOHNNY WORLD FASHION" />
        <Input label="CAC Registration Number *" defaultValue="CHINAZA" />
        <Input label="Business Phone Number" defaultValue="+234 80656506333" />
        <Input label="Business Email" defaultValue="Otittoluwachi@gmail.com" />
        <Input label="Business Website" placeholder="https://..." className="md:col-span-2" />
        <Input label="Business Address *" defaultValue="No. 93 Skyfield Apartments" className="md:col-span-2" />
        <Input label="State" defaultValue="Lagos" />
        <Input label="Country *" defaultValue="Nigeria" />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Name on Card" defaultValue="Otitooluwa Chinaza" placeholder="Name on Card" />
          <Input label="Account Number" defaultValue="0123456789" placeholder="Account Number" />
          <Input label="Expiry Date" defaultValue="03/27" placeholder="MM/YY" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          type="button" 
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

/* -------------------- REUSABLES -------------------- */
function Input({
  label,
  placeholder,
  defaultValue,
  type = "text",
  className = "",
}: {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors duration-200"
      />
    </div>
  );
}

function UploadCard({ label }: { label: string }) {
  return (
    <div className="bg-[#F4F5FA] rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-gray-300 transition-colors duration-200 bg-gray-50/50">
      <div className="mb-3">
        <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Upload {label.toLowerCase()}
        </p>
        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
      </div>
      <button
        type="button"
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        Choose File
      </button>
    </div>
  );
}
