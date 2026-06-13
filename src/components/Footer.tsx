"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    // TODO: wire to backend newsletter endpoint when available
    await new Promise((r) => setTimeout(r, 700));
    setSubscribed(true);
    setLoading(false);
    setForm({ name: "", email: "" });
  };

  return (
    <footer className="bg-[#1D1D1D] text-white px-8 md:px-16 py-14">
      <div className="max-w-7xl mx-auto">

        {/* Main grid: logo+social | 4 link columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Logo + Social — narrow column */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/images/T-Logo.png"
                alt="Stitch Logo"
                width={110}
                height={36}
                className="w-auto h-8 brightness-0 invert"
              />
            </Link>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-normal">Follow us on</p>
              <div className="flex items-center gap-5">
                <a href="#" aria-label="Facebook" className="text-white hover:text-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="text-white hover:text-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="text-white hover:text-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 4 Link columns */}
          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-bold mb-6 text-white">Main</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Categories</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link href="/products" className="hover:text-white transition-colors">Natives</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Casuals</Link></li>
                <li><Link href="/products" className="hover:text-white transition-colors">Corporate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Account</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link href="/Account-Overview" className="hover:text-white transition-colors">Profile</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Orders</Link></li>
                <li><Link href="/Measurements" className="hover:text-white transition-colors">Measurements</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login &amp; Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Business</h4>
              <ul className="space-y-3 text-gray-400 font-light">
                <li><Link href="/login" className="hover:text-white transition-colors">Create a Tailor&apos;s Account</Link></li>
                <li><Link href="/policies" className="hover:text-white transition-colors">Our policies</Link></li>
                <li><Link href="/complaints" className="hover:text-white transition-colors">Complaints</Link></li>
                <li><Link href="/refund" className="hover:text-white transition-colors">Refund</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />

        {/* Newsletter */}
        <div className="bg-[#2a2a2a] rounded-2xl px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left copy */}
          <div className="flex-shrink-0 max-w-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Newsletter</p>
            <h3 className="text-[24px] md:text-[30px] font-semibold text-white leading-snug mb-2">
              Stay in the loop
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get the latest styles, tailor spotlights and exclusive offers straight to your inbox. No spam, ever.
            </p>
          </div>

          {/* Right form / success */}
          {subscribed ? (
            <div className="flex items-center gap-4 bg-[#1d1d1d] border border-gray-700 rounded-xl px-6 py-5 w-full lg:w-auto">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">You&apos;re subscribed!</p>
                <p className="text-gray-400 text-xs mt-0.5">Thanks for joining. We&apos;ll be in touch soon.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full lg:min-w-[420px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="px-4 py-3 rounded-lg bg-[#1d1d1d] border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg bg-[#1d1d1d] border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white text-black text-sm font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                ) : (
                  <>Subscribe to our newsletter <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          )}
        </div>

        <hr className="my-8 border-gray-700" />

        {/* Contact */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <p className="font-bold text-white">
            Contact us{' '}
            <span className="font-light text-gray-400 ml-2">help@stitch.com</span>
            <span className="font-light text-gray-400 ml-6">+2348010101010</span>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© 2023 Stitch Copyright. &nbsp; All rights reserved</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Private Policy</Link>
            <Link href="/terms-of-use" className="hover:text-white transition-colors">Terms of use</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
