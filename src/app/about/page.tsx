import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section
                className="pt-[64px] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/stitch-backg.png')" }}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">About Us</p>
                    <h1 className="text-[40px] md:text-[58px] font-semibold leading-tight text-black max-w-2xl">
                        Africa&apos;s first made-to-measure online tailor marketplace
                    </h1>
                    <p className="mt-6 text-[15px] md:text-[16px] text-gray-700 max-w-xl leading-relaxed">
                        AirStitch connects you with skilled tailors who craft clothing that fits your body, your style, and your budget — without leaving your home.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">Our Story</p>
                        <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900 leading-snug mb-6">
                            Born out of a frustration with ill-fitting clothes
                        </h2>
                        <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                            We noticed that most people struggle to find clothes that fit perfectly off the rack — and visiting a tailor felt outdated, time-consuming, and unreliable. AirStitch was built to change that.
                        </p>
                        <p className="text-[15px] text-gray-600 leading-relaxed">
                            By bringing tailors online, we make custom clothing accessible to everyone, while giving skilled artisans a platform to reach customers they never could before.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] relative">
                        <Image
                            src="/images/stitch-backg.png"
                            alt="Our story"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-[#F7F7F7]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-6">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-semibold text-gray-900 mb-3">Our Mission</h3>
                            <p className="text-[15px] text-gray-600 leading-relaxed">
                                To make custom-fitted clothing effortless and affordable for everyone in Africa, while empowering tailors with the tools and reach they deserve.
                            </p>
                        </div>
                        <div className="bg-black rounded-2xl p-10 border border-gray-900 shadow-sm">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-6">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-semibold text-white mb-3">Our Vision</h3>
                            <p className="text-[15px] text-gray-300 leading-relaxed">
                                A world where every person wears clothes made specifically for them — and every skilled tailor has access to a global market.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">How It Works</p>
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900 mb-14 max-w-lg leading-snug">
                        Getting custom clothes has never been this simple
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                step: "01",
                                title: "Browse & Choose",
                                desc: "Explore styles across Natives, Casuals, Corporate and more. Pick a design you love from our catalogue of tailors.",
                            },
                            {
                                step: "02",
                                title: "Submit Your Measurements",
                                desc: "Enter your measurements once and they're saved to your profile for every future order — no measuring tape required on repeat visits.",
                            },
                            {
                                step: "03",
                                title: "Receive Your Order",
                                desc: "Your tailor crafts your outfit and it's delivered straight to your door. Track every step of the process in real time.",
                            },
                        ].map((item) => (
                            <div key={item.step} className="flex flex-col gap-4">
                                <span className="text-[42px] font-bold text-gray-100 leading-none">{item.step}</span>
                                <h3 className="text-[17px] font-semibold text-gray-900">{item.title}</h3>
                                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-[#F7F7F7]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">Our Values</p>
                    <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900 mb-12">What we stand for</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { title: "Quality", desc: "Every order is crafted by a vetted, skilled tailor." },
                            { title: "Transparency", desc: "Clear pricing, real-time tracking, no hidden fees." },
                            { title: "Empowerment", desc: "We help tailors grow their business beyond their local area." },
                            { title: "Accessibility", desc: "Custom clothing shouldn't be a luxury — we make it available to all." },
                        ].map((v) => (
                            <div key={v.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <h4 className="text-[15px] font-semibold text-gray-900 mb-2">{v.title}</h4>
                                <p className="text-[13px] text-gray-500 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <h2 className="text-[28px] md:text-[40px] font-semibold text-white mb-4">Ready to get started?</h2>
                    <p className="text-gray-400 text-[15px] mb-8 max-w-md mx-auto">Join thousands of customers already getting clothes made just for them.</p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-white text-black text-[14px] font-medium px-8 py-3 rounded hover:bg-gray-100 transition-colors"
                    >
                        Create an Account <span>›</span>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
