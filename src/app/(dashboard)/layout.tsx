"use client";

import { useState } from "react";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-surface-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div
        className={`fixed top-0 bottom-0 z-30 w-[240px] bg-white shadow-elegant flex flex-col p-3 transition-transform duration-300
          lg:top-4 lg:bottom-4 lg:rounded-2xl lg:w-[18%] lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/T-Logo.png" alt="logo" width={110} height={60} />
          </Link>
          <button
            className="lg:hidden p-1 rounded-md hover:bg-surface-100"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Menu />
      </div>

      {/* RIGHT CONTENT AREA */}
      <div className="w-full lg:w-[82%] lg:absolute lg:right-0 bg-surface-50 flex flex-col h-screen">
        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto min-w-0 px-4 lg:px-6 pb-6">
          <div className="sticky top-0 z-10 pt-4">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
