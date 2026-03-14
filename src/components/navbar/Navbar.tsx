"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-gray-100/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Left */}
          <Link href="/" onClick={closeMenu} className="flex-shrink-0">
            <Image src="/images/aistitchLogo-black.png" alt="Stitch Logo" width={100} height={100}  className="h-10 mb-4" />

          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#090458] transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#090458] transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              About us
            </Link>
            <Link 
              href="/categories" 
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#090458] transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Categories
            </Link>
            {/* <Link 
              href="/faqs" 
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#090458] transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              FAQs
            </Link> */}
            <Link 
              href="/contact" 
              onClick={closeMenu}
              className="text-gray-700 hover:text-[#090458] transition-colors duration-300 text-xs font-medium whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>

          {/* Get Early Access Button - Right */}
          <div className="hidden md:block flex-shrink-0">
            <Link
              href="/login"
              onClick={closeMenu}
              className="bg-black text-white px-5 py-2 rounded text-xs font-medium hover:bg-white hover:text-black transition-all duration-300 hover:translate-x-0.5 whitespace-nowrap"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg
                className="h-8 w-8"
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
                className="h-8 w-8"
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
        style={{ top: '80px' }}
      >
        <div className="flex flex-col items-center justify-start h-full pt-8 space-y-6 px-4">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="text-gray-700 hover:text-[#090458] text-base py-2 w-full text-center"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={closeMenu}
            className="text-gray-700 hover:text-[#090458] text-base py-2 w-full text-center"
          >
            About
          </Link>
          <Link 
            href="/categories" 
            onClick={closeMenu}
            className="text-gray-700 hover:text-[#090458] text-base py-2 w-full text-center"
          >
            Categories
          </Link>
          <Link 
            href="/contact" 
            onClick={closeMenu}
            className="text-gray-700 hover:text-[#090458] text-base py-2 w-full text-center"
          >
            Contact Us
          </Link>
          {/* <Link 
            href="/about" 
            onClick={closeMenu}
            className="text-gray-700 hover:text-[#090458] text-xl py-2 w-full text-center"
          >
            Login
          </Link> */}
          
          <Link
            href="/login"
            onClick={closeMenu}
            className="bg-black text-white px-8 py-3 rounded text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 mt-4"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





