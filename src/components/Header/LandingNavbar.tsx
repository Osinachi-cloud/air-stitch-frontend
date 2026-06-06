"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export const LandingNavbar = () => {
    const [search, setSearch] = useState("")

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
                <Link href="/login" className="text-[14px] font-medium text-gray-800 hover:text-black flex items-center gap-1.5">
                    Log in
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </Link>
                <Link href="/cart" className="text-black hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="black">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.5 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </Link>
            </div>
        </nav>
    )
}
