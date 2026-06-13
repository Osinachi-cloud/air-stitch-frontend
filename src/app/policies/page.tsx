import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const policies = [
    {
        title: "Quality Guarantee",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
        ),
        body: "Every tailor on AirStitch is vetted before being listed on our platform. We review their portfolio, work history, and craftsmanship standards. If your order is significantly different from what was agreed — wrong specifications, poor finishing, or defective materials — we will work with you to resolve it through our dispute process.",
    },
    {
        title: "Order Fulfilment Policy",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        body: "Once an order is placed and payment is received, the assigned tailor is notified and expected to begin production within the agreed timeline. AirStitch holds payment in escrow and releases it to the tailor only upon confirmed delivery or customer acceptance. Tailors are required to provide production updates and communicate any delays immediately.",
    },
    {
        title: "Measurement Policy",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
            </svg>
        ),
        body: "Customers are responsible for providing accurate body measurements. AirStitch provides measurement guides to help customers measure correctly. If a garment does not fit due to inaccurate measurements provided by the customer, alterations may be charged separately. Where measurements are taken by an AirStitch-affiliated tailor, fitting guarantees apply.",
    },
    {
        title: "Communication Policy",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
        ),
        body: "All communication between customers and tailors must take place through the AirStitch platform. Off-platform transactions are prohibited and void our buyer protections. AirStitch may monitor communications to ensure compliance with our community standards and to resolve disputes fairly.",
    },
    {
        title: "Pricing and Fees Policy",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
        ),
        body: "All prices are displayed in Nigerian Naira (₦). AirStitch charges a service fee on each transaction, which is clearly disclosed at checkout before payment is made. Tailors set their own base prices; AirStitch does not inflate listed prices. Price changes after order confirmation are not permitted unless both parties explicitly agree.",
    },
    {
        title: "Privacy and Data Policy",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
        ),
        body: "AirStitch takes your privacy seriously. We do not sell your personal data to third parties. Your measurements, payment details, and order history are stored securely and used only to provide our services. For full details on how we handle your data, please read our Privacy Policy.",
        link: { label: "Read our Privacy Policy", href: "/privacy-policy" },
    },
]

export default function PoliciesPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-[64px] bg-black">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Platform</p>
                    <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight mb-4">
                        Our Policies
                    </h1>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
                        We believe in transparency. These policies govern how AirStitch operates and what you can expect from us as a customer or tailor on our platform.
                    </p>
                    <p className="text-gray-600 text-sm mt-6">Last updated: April 2026</p>
                </div>
            </section>

            {/* Related Docs */}
            <section className="bg-[#111] border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-5 flex flex-wrap gap-6">
                    {[
                        { label: "Terms of Use", href: "/terms-of-use" },
                        { label: "Privacy Policy", href: "/privacy-policy" },
                        { label: "Refund Policy", href: "/refund" },
                        { label: "Complaints", href: "/complaints" },
                    ].map((l) => (
                        <Link key={l.label} href={l.href} className="text-[13px] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                            {l.label}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Content */}
            <section className="flex-1 bg-white py-16">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="space-y-6">
                        {policies.map((p) => (
                            <div key={p.title} className="border border-gray-100 rounded-2xl p-6 md:p-8 hover:border-gray-200 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-700">
                                        {p.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-[16px] font-semibold text-gray-900 mb-2">{p.title}</h2>
                                        <p className="text-[14px] text-gray-600 leading-relaxed">{p.body}</p>
                                        {p.link && (
                                            <Link href={p.link.href} className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-medium text-gray-900 hover:underline underline-offset-2">
                                                {p.link.label}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-14 bg-gray-50 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 text-[14px] mb-4">
                            Have questions about our policies? Our team is happy to clarify.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-black text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
