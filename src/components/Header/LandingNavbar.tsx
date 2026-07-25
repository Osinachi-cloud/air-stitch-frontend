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
    const [scrolled, setScrolled] = useState(false)

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

    useEffect(() => {
      const onScroll = () => {
        setScrolled(window.scrollY > 60)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const isLoggedIn = !!(user?.accessToken || user?.access_token);
    const initials = getInitials(user?.firstName, user?.lastName);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center px-4 md:px-8 py-3 gap-6 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            {/* Logo + Nav Links grouped on the left */}
            <div className="flex items-center gap-6 flex-shrink-0">
                <Link href="/">
                    <Image
                        src="/images/T-Logo.png"
                        alt="AirStitch Logo"
                        width={90}
                        height={30}
                        className="h-6 w-auto brightness-0 invert"
                    />
                </Link>
                <ul className="hidden md:flex items-center gap-5 text-xs font-medium text-black">
                    <li><Link href="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
                    <li><Link href="/about" className="hover:text-primary-600 transition-colors">About</Link></li>
                    <li><Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link></li>
                    <li><Link href="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
                </ul>
            </div>

            {/* Search Bar — grows to fill remaining space */}
            <div className="hidden md:flex items-center border border-black/20 rounded-lg overflow-hidden flex-1 max-w-md mx-auto bg-white/60 backdrop-blur-sm">
                <input
                    type="text"
                    placeholder="Search styles, tailors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary-300 flex-1 bg-transparent text-black placeholder-black/50"
                />
                <button className="bg-brand-gradient text-white text-xs font-semibold px-4 py-1.5 hover:opacity-90 transition-opacity flex-shrink-0">
                    Search
                </button>
            </div>

            {/* Right: Login + Cart */}
            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                {isLoggedIn ? (
                  <Link href="/Account-Overview" className="flex items-center gap-2 text-xs font-medium text-black hover:text-primary-600 transition-colors">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={28}
                        height={28}
                        className="rounded-full object-cover border border-black/10"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-black/10 text-black flex items-center justify-center text-[10px] font-semibold border border-black/10">
                        {initials || 'U'}
                      </div>
                    )}
                    <span className="hidden md:inline">My Account</span>
                  </Link>
                ) : (
                  <Link href="/login" className="text-xs font-medium text-black hover:text-primary-600 flex items-center gap-1 transition-colors">
                      Log in
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676.119-4.296.6-4.296 2.196 0 1.868 1.048 2.868 3.296 2.168h1.136c1.336 0 2.424-.784 2.424-2.07H5.065c-2.149 0-3.896-1.736-3.896-3.896 0-1.008.392-1.96 1.1-2.663.663-.647 1.643-1.05 2.663-1.05h1.136c1.336 0 2.424-.784 2.424-2.07H5.065Z" />
                      </svg>
                  </Link>
                )}
                <Link href="/cart" className="text-black hover:text-primary-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.4-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </Link>
            </div>
        </nav>
    )
}
