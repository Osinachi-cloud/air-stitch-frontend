import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const sections = [
    {
        title: "1. Acceptance of Terms",
        body: `By accessing or using the AirStitch platform — including our website, mobile application, and any related services — you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform after changes constitutes your acceptance of the revised terms.`,
    },
    {
        title: "2. Who We Are",
        body: `AirStitch is an online marketplace that connects customers with skilled, vetted tailors for made-to-measure clothing. We facilitate the connection between both parties but are not a party to any transaction between customers and tailors unless explicitly stated.`,
    },
    {
        title: "3. Eligibility",
        body: `You must be at least 18 years old to create an account and use our services. By using AirStitch, you represent and warrant that you meet this requirement and that all information you provide is accurate, current, and complete. AirStitch reserves the right to suspend or terminate accounts that provide false information.`,
    },
    {
        title: "4. Account Registration",
        body: `To access certain features of the platform, you are required to register an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at help@stitch.com if you suspect unauthorised access to your account. You may not transfer your account to another person.`,
    },
    {
        title: "5. Customer Responsibilities",
        body: `As a customer, you agree to:\n• Provide accurate body measurements for orders.\n• Pay for orders in full before production begins.\n• Communicate respectfully with tailors through our platform.\n• Not attempt to conduct transactions outside of AirStitch to circumvent our payment system.\n• Review and approve designs or specifications before confirming an order.`,
    },
    {
        title: "6. Tailor Responsibilities",
        body: `As a tailor registered on AirStitch, you agree to:\n• Provide accurate information about your skills, experience, and turnaround times.\n• Deliver orders to the standard and specifications agreed upon.\n• Maintain professional conduct with customers at all times.\n• Notify customers and AirStitch promptly of any delays or issues.\n• Not accept payments outside of the AirStitch platform for orders placed through the platform.`,
    },
    {
        title: "7. Orders and Payments",
        body: `All orders placed through AirStitch are subject to acceptance by the tailor. Payments are processed securely through our payment partners. AirStitch holds payment in escrow and releases it to the tailor upon confirmed delivery. Prices are displayed in Nigerian Naira (₦) unless stated otherwise. AirStitch charges a service fee on each transaction, which is disclosed at checkout.`,
    },
    {
        title: "8. Cancellations and Refunds",
        body: `Cancellations may be requested before a tailor begins production. Once production has started, cancellations are subject to our Refund Policy. Refunds are processed within 5–10 business days. Custom-made garments cannot be returned unless they are significantly different from the agreed specifications or are defective. Disputes between customers and tailors are handled through our resolution process — contact help@stitch.com to raise a dispute.`,
    },
    {
        title: "9. Intellectual Property",
        body: `All content on the AirStitch platform — including logos, design elements, text, and software — is owned by or licensed to AirStitch and is protected under Nigerian and international intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission. Tailors retain ownership of their original designs but grant AirStitch a non-exclusive licence to display them on the platform.`,
    },
    {
        title: "10. Prohibited Conduct",
        body: `You agree not to:\n• Use the platform for any unlawful purpose.\n• Post false, misleading, or fraudulent content.\n• Harass, abuse, or threaten other users.\n• Attempt to gain unauthorised access to any part of the platform.\n• Use automated tools (bots, scrapers) to access platform data.\n• Engage in any activity that disrupts or interferes with the platform's functionality.`,
    },
    {
        title: "11. Limitation of Liability",
        body: `AirStitch acts as an intermediary marketplace and is not liable for the quality, safety, or legality of items listed, the accuracy of tailor listings, the ability of tailors to complete orders, or the ability of customers to pay. To the maximum extent permitted by law, AirStitch's total liability to you for any claim arising from use of the platform shall not exceed the amount you paid for the specific order giving rise to the claim.`,
    },
    {
        title: "12. Termination",
        body: `AirStitch reserves the right to suspend or permanently terminate your account at any time, with or without notice, if we determine that you have violated these Terms of Use or engaged in conduct harmful to other users or the platform. Upon termination, your right to use the platform ceases immediately.`,
    },
    {
        title: "13. Governing Law",
        body: `These Terms of Use are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
    },
    {
        title: "14. Contact Us",
        body: `If you have any questions about these Terms of Use, please contact us at:\n\nEmail: help@stitch.com\nPhone: +234 801 010 1010`,
    },
]

export default function TermsOfUsePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-[64px] bg-black">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight mb-4">
                        Terms of Use
                    </h1>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
                        Please read these terms carefully before using the AirStitch platform. By using our services, you agree to be bound by the following terms and conditions.
                    </p>
                    <p className="text-gray-600 text-sm mt-6">Last updated: April 2026</p>
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

                    {/* Footer note */}
                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 text-[14px] mb-4">
                            Have questions about our terms? We&apos;re happy to help.
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
