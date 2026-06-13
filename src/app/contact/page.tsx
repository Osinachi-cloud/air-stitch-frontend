"use client"

import { useState } from "react"
import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: wire to backend endpoint when available
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section
                className="pt-[64px] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/stitch-backg.png')" }}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">Get In Touch</p>
                    <h1 className="text-[40px] md:text-[58px] font-semibold leading-tight text-black max-w-xl">
                        We&apos;d love to hear from you
                    </h1>
                    <p className="mt-5 text-[15px] text-gray-700 max-w-md leading-relaxed">
                        Have a question, complaint, or just want to say hello? Send us a message and we&apos;ll get back to you within 24 hours.
                    </p>
                </div>
            </section>

            {/* Contact Info + Form */}
            <section className="py-20 bg-white flex-1">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16">

                    {/* Left — contact info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">Contact Details</p>
                            <div className="flex flex-col gap-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-400 mb-0.5">Email</p>
                                        <a href="mailto:help@stitch.com" className="text-[15px] font-medium text-gray-900 hover:underline">
                                            help@stitch.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-400 mb-0.5">Phone</p>
                                        <a href="tel:+2348010101010" className="text-[15px] font-medium text-gray-900 hover:underline">
                                            +234 801 010 1010
                                        </a>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-400 mb-0.5">Support Hours</p>
                                        <p className="text-[15px] font-medium text-gray-900">Mon – Fri, 9am – 6pm WAT</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-100" />

                        {/* Social */}
                        <div>
                            <p className="text-[13px] font-medium text-gray-400 mb-4">Follow Us</p>
                            <div className="flex items-center gap-4">
                                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="bg-[#F7F7F7] rounded-2xl p-8 md:p-10 border border-gray-100">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-[20px] font-semibold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-[14px] text-gray-500 max-w-xs">
                                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                                    className="mt-6 text-[13px] underline text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                <div>
                                    <p className="text-[18px] font-semibold text-gray-900 mb-1">Send us a message</p>
                                    <p className="text-[13px] text-gray-400">We typically respond within 24 hours.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Subject</label>
                                    <select
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors"
                                    >
                                        <option value="" disabled>Select a subject</option>
                                        <option value="order">Order Issue</option>
                                        <option value="measurement">Measurement Help</option>
                                        <option value="tailor">Tailor Enquiry</option>
                                        <option value="refund">Refund Request</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Message</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us how we can help..."
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[14px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white text-[14px] font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
