"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'glass shadow-elegant' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Left */}
          <Link href="/" onClick={closeMenu} className="flex-shrink-0">
            <Image src="/images/aistitchLogo-black.png" alt="Stitch Logo" width={90} height={30}  className="h-7 w-auto" />

          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-surface-700 hover:text-primary-600 transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="text-surface-700 hover:text-primary-600 transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              About us
            </Link>
            <Link
              href="/categories"
              onClick={closeMenu}
              className="text-surface-700 hover:text-primary-600 transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Categories
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="text-surface-700 hover:text-primary-600 transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>

          {/* Profile / Login Button - Right */}
          <div className="hidden md:block flex-shrink-0">
            {isLoggedIn ? (
              <Link
                href="/Account-Overview"
                onClick={closeMenu}
                className="flex items-center gap-2"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full object-cover border border-primary-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#164377] text-white flex items-center justify-center text-[10px] font-semibold">
                    {initials || 'U'}
                  </div>
                )}
                <span className="text-xs font-medium text-surface-700">{displayName}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="bg-[#164377] text-white px-4 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-all duration-300 whitespace-nowrap shadow-card"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-surface-700 hover:text-primary-600 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-40 transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col items-center justify-start h-full pt-8 space-y-4 px-4">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="text-surface-700 hover:text-primary-600 text-sm py-2 w-full text-center"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={closeMenu}
            className="text-surface-700 hover:text-primary-600 text-sm py-2 w-full text-center"
          >
            About
          </Link>
          <Link 
            href="/categories" 
            onClick={closeMenu}
            className="text-surface-700 hover:text-primary-600 text-sm py-2 w-full text-center"
          >
            Categories
          </Link>
          <Link 
            href="/contact" 
            onClick={closeMenu}
            className="text-surface-700 hover:text-primary-600 text-sm py-2 w-full text-center"
          >
            Contact Us
          </Link>
          
          {isLoggedIn ? (
            <Link
              href="/Account-Overview"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 mt-4"
            >
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover border border-primary-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#164377] text-white flex items-center justify-center text-xs font-semibold">
                  {initials || 'U'}
                </div>
              )}
              <span className="text-sm font-medium text-surface-700">{displayName}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="bg-[#164377] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-all duration-300 mt-4 shadow-card"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





