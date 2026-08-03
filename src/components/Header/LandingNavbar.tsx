"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
    const router = useRouter()
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

    const handleSearch = () => {
      const term = search.trim()
      if (!term) return
      router.push(`/products?search=${encodeURIComponent(term)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch()
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
          <div className="w-[95%] mx-auto px-3 sm:px-4 flex items-center h-14 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                    src="/images/aistitchLogo-black.png"
                    alt="AirStitch Logo"
                    width={110}
                    height={36}
                    className="h-7 w-auto"
                />
            </Link>

            {/* Nav Links — compact */}
            <ul className="hidden md:flex items-center gap-4 text-[11px] font-medium text-black flex-shrink-0">
                <li><Link href="/about" className="hover:text-primary-600 transition-colors">About</Link></li>
                <li><Link href="/categories" className="hover:text-primary-600 transition-colors">Categories</Link></li>
                <li><Link href="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
            </ul>

            {/* Search Bar — grows to fill remaining space */}
            <div className="hidden md:flex items-center border border-black/20 rounded-md overflow-hidden flex-1 max-w-sm mx-4 bg-white/60 backdrop-blur-sm h-8">
                <input
                    type="text"
                    placeholder="Search styles, tailors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="px-2.5 py-1 text-[11px] leading-none focus:outline-none flex-1 bg-transparent text-black placeholder-black/50"
                />
                <button
                    onClick={handleSearch}
                    className="bg-[#164377] text-white text-[11px] font-semibold px-3 py-1 hover:opacity-90 transition-opacity flex-shrink-0"
                >
                    Search
                </button>
            </div>

            {/* Right: Login + Cart */}
            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                {isLoggedIn ? (
                  <Link href="/Account-Overview" className="flex items-center gap-1.5 text-[11px] font-medium text-black hover:text-primary-600 transition-colors">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full object-cover border border-black/10"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-black/10 text-black flex items-center justify-center text-[9px] font-semibold border border-black/10">
                        {initials || 'U'}
                      </div>
                    )}
                    <span className="hidden md:inline">My Account</span>
                  </Link>
                ) : (
                  <Link href="/login" className="text-[11px] font-medium text-black hover:text-primary-600 flex items-center gap-1 transition-colors">
                      Log in
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                  </Link>
                )}
                <Link href="/cart" className="text-black hover:text-primary-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.28-.27l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </Link>
            </div>
          </div>
        </nav>
    )
}
