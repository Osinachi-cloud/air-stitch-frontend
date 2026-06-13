import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const sections = [
    {
        title: "Eligibility for a Refund",
        body: `You may be eligible for a full or partial refund in the following situations:\n\n• The order was cancelled before the tailor began production.\n• The completed garment is significantly different from the agreed specifications.\n• The garment has a manufacturing defect or the wrong fabric was used.\n• The tailor failed to deliver within the agreed timeframe and no resolution was reached.\n• The tailor cancelled the order without completing it.\n\nRefund eligibility is determined on a case-by-case basis after our review team assesses the complaint.`,
    },
    {
        title: "Non-Refundable Situations",
        body: `Refunds will not be issued in the following cases:\n\n• The garment was made to the agreed specifications but does not fit due to inaccurate measurements provided by the customer.\n• The customer changes their mind after production has started.\n• Minor variations in fabric shade, texture, or pattern that are within acceptable manufacturing tolerance.\n• Damage caused by the customer after delivery.\n• Orders cancelled after production is more than 50% complete, unless a defect is confirmed.`,
    },
    {
        title: "Cancellation Before Production",
        body: `If you cancel your order before the tailor begins production, you are entitled to a full refund of the amount paid, minus any non-refundable payment processing fees charged by our payment partners (typically 1–2%). Cancellations must be requested through the AirStitch platform — contact our support team at help@stitch.com with your order ID.`,
    },
    {
        title: "Cancellation After Production Begins",
        body: `Once a tailor has started work on your order, cancellations are subject to a partial refund. The refund amount will reflect the stage of production:\n\n• Less than 25% complete — up to 75% refund\n• 25–50% complete — up to 50% refund\n• More than 50% complete — no refund unless a defect or policy violation is confirmed\n\nOur team will confirm the production stage with the tailor before processing.`,
    },
    {
        title: "How to Request a Refund",
        body: `To request a refund:\n\n1. Log in to your AirStitch account and go to your Orders page.\n2. Select the relevant order and tap "Report an Issue".\n3. Describe the issue and attach supporting photos or evidence.\n4. Our support team will review and respond within 2 business days.\n\nAlternatively, you can email help@stitch.com with your order ID and a description of the issue.`,
    },
    {
        title: "Refund Processing Time",
        body: `Approved refunds are processed within 5–10 business days from the date of approval. The time it takes for funds to appear in your account depends on your bank or payment method:\n\n• Bank transfers — 3–5 business days\n• Card payments — 5–10 business days\n\nAirStitch will notify you by email once your refund has been processed. If you have not received your refund after 10 business days, please contact us.`,
    },
    {
        title: "Disputes and Appeals",
        body: `If you disagree with a refund decision, you may appeal within 7 days of being notified. Appeals are reviewed by a senior member of our team. Our decision on appeal is final. For complex disputes, we may request additional documentation or arrange mediation between both parties.`,
    },
    {
        title: "Contact Us",
        body: `For all refund enquiries, please contact:\n\nEmail: help@stitch.com\nPhone: +234 801 010 1010\nHours: Monday – Friday, 9am – 6pm WAT\n\nPlease have your order ID ready when contacting us — this helps us resolve your issue faster.`,
    },
]

export default function RefundPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-[64px] bg-black">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Support</p>
                    <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight mb-4">
                        Refund Policy
                    </h1>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
                        We want every order on AirStitch to meet your expectations. This policy explains when and how refunds are issued.
                    </p>
                    <p className="text-gray-600 text-sm mt-6">Last updated: April 2026</p>
                </div>
            </section>

            {/* Quick summary cards */}
            <section className="bg-[#f9f9f9] border-b border-gray-200 py-8">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                    </svg>
                                ),
                                label: "Full refund before production",
                                sub: "Cancel before work starts",
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                ),
                                label: "5–10 business days",
                                sub: "Processing time after approval",
                            },
                            {
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                ),
                                label: "Email help@stitch.com",
                                sub: "To start a refund request",
                            },
                        ].map((c) => (
                            <div key={c.label} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-700">
                                    {c.icon}
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-gray-900">{c.label}</p>
                                    <p className="text-[12px] text-gray-500 mt-0.5">{c.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="flex-1 bg-white py-16">
                <div className="max-w-4xl mx-auto px-6 md:px-12">

                    {/* Quick nav */}
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12">
                        <p className="text-[13px] font-semibold text-gray-700 mb-3 uppercase tracking-wide">Contents</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {sections.map((s) => (
                                <a
                                    key={s.title}
                                    href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                                    className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors py-0.5"
                                >
                                    {s.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-12">
                        {sections.map((s) => (
                            <div key={s.title} id={s.title.replace(/\s+/g, "-").toLowerCase()}>
                                <h2 className="text-[18px] font-semibold text-gray-900 mb-3">{s.title}</h2>
                                <div className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                                    {s.body}
                                </div>
                                <div className="mt-8 border-b border-gray-100" />
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 text-[14px] mb-4">
                            Need help with a refund? We&apos;re here to make it right.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/complaints"
                                className="inline-flex items-center gap-2 bg-black text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Raise a complaint
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Contact support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
