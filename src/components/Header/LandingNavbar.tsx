"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface UserData {
  firstName?: string;
  lastName?: string;
  profileImage?: string | null;
  accessToken?: string;
  access_token?: string;
}

const getInitials = (firstName?: string, lastName?: string): string => {
  const f = firstName?.trim()?.[0] || '';
  const l = lastName?.trim()?.[0] || '';
  return (f + l).toUpperCase();
};

export const LandingNavbar = () => {
    const [search, setSearch] = useState("")
    const [user, setUser] = useState<UserData | null>(null)

    const loadUser = () => {
      const stored = localStorage.getItem('userDetails');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    useEffect(() => {
      loadUser();
      const handleUpdate = () => loadUser();
      window.addEventListener('userDetailsUpdated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
      return () => {
        window.removeEventListener('userDetailsUpdated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      };
    }, []);

    const isLoggedIn = !!(user?.accessToken || user?.access_token);
    const initials = getInitials(user?.firstName, user?.lastName);
    const displayName = user?.firstName || 'User';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center px-6 md:px-12 py-4 bg-white/60 backdrop-blur-md gap-8">
            {/* Logo + Nav Links grouped on the left */}
            <div className="flex items-center gap-8 flex-shrink-0">
                <Link href="/">
                    <Image
                        src="/images/T-Logo.png"
                        alt="AirStitch Logo"
                        width={110}
                        height={36}
                        className="h-auto brightness-0"
                    />
                </Link>
                <ul className="hidden md:flex items-center gap-6 text-[14px] font-medium text-gray-800">
                    <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
                    <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                    <li><Link href="/categories" className="hover:text-black transition-colors">Categories</Link></li>
                    <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                </ul>
            </div>

            {/* Search Bar — grows to fill remaining space */}
            <div className="hidden md:flex items-center border border-black rounded overflow-hidden flex-1 max-w-[700px] mx-auto">
                <input
                    type="text"
                    placeholder=""
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-1 text-sm outline-none flex-1 bg-white"
                />
                <button className="bg-black text-white text-sm px-5 py-1 hover:bg-gray-800 transition-colors flex-shrink-0">
                    Search
                </button>
            </div>

            {/* Right: Login + Cart */}
            <div className="flex items-center gap-4 ml-auto flex-shrink-0">
                {isLoggedIn ? (
                  <Link href="/Account-Overview" className="flex items-center gap-2 text-[14px] font-medium text-gray-800 hover:text-black">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold border border-gray-200">
                        {initials || 'U'}
                      </div>
                    )}
                    <span>{displayName}</span>
                  </Link>
                ) : (
                  <Link href="/login" className="text-[14px] font-medium text-gray-800 hover:text-black flex items-center gap-1.5">
                      Log in
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="[PHONE NUMBER_REDACTED]" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 [PHONE NUMBER_REDACTED] 7.5 0ZM4.501 20.118a7.5 7.5 [PHONE NUMBER_REDACTED]A17.933 17.933 [PHONE NUMBER_REDACTED]c-2.676 [PHONE NUMBER_REDACTED].632Z" />
                      </svg>
                  </Link>
                )}
                <Link href="/cart" className="text-black hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="[PHONE NUMBER_REDACTED]" fill="black">
                        <path d="M7 18c-1.1 [PHONE NUMBER_REDACTED]S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 [PHONE NUMBER_REDACTED]l.03-.12.9-1.63H19c.75 [PHONE NUMBER_REDACTED]l3.58-6.49A1 1 [PHONE NUMBER_REDACTED]H5.21l-.94-2H1zm16 16c-1.1 [PHONE NUMBER_REDACTED]s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </Link>
            </div>
        </nav>
    )
}
