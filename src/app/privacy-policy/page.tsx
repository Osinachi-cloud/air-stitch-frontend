import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const sections = [
    {
        title: "1. Introduction",
        body: `AirStitch ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and share your data when you use the AirStitch platform — including our website, mobile application, and related services. By using AirStitch, you agree to the practices described in this policy.`,
    },
    {
        title: "2. Information We Collect",
        body: `We collect the following categories of information:\n\n• Account Information: Your name, email address, phone number, and password when you register.\n• Profile Information: Profile photos, body measurements, style preferences, and any other information you choose to provide.\n• Business Information (Tailors): Business name, business address, portfolio images, skills, and turnaround time estimates.\n• Order Information: Details of orders placed or received, including specifications, communications, and transaction history.\n• Payment Information: Billing details processed securely through our payment partners. We do not store full card numbers on our servers.\n• Device & Usage Data: IP address, browser type, operating system, pages visited, and actions taken on the platform.\n• Communications: Messages sent between customers and tailors through our platform, and correspondence with our support team.`,
    },
    {
        title: "3. How We Use Your Information",
        body: `We use your information to:\n\n• Create and manage your account.\n• Facilitate orders and transactions between customers and tailors.\n• Process payments and issue refunds.\n• Send order confirmations, updates, and support responses.\n• Personalise your experience and show relevant products or tailors.\n• Send newsletters and promotional content (only with your consent).\n• Detect and prevent fraud, abuse, and other harmful activity.\n• Comply with legal obligations.\n• Improve our platform through analytics and user research.`,
    },
    {
        title: "4. Legal Basis for Processing",
        body: `We process your personal data on the following legal grounds:\n\n• Contract: Processing necessary to fulfil an order or provide our services.\n• Legitimate Interests: Improving our platform, preventing fraud, and communicating with users in ways you would reasonably expect.\n• Consent: For optional communications such as newsletters. You may withdraw consent at any time.\n• Legal Obligation: Where we are required to process data to comply with Nigerian law or a court order.`,
    },
    {
        title: "5. Sharing Your Information",
        body: `We do not sell your personal data. We may share it with:\n\n• Tailors and Customers: As necessary to fulfil orders — for example, sharing a customer's measurements with the assigned tailor.\n• Payment Processors: To securely process transactions (e.g., Paystack, Flutterwave).\n• Service Providers: Third parties who assist us with hosting, analytics, email delivery, and customer support — bound by confidentiality agreements.\n• Legal Authorities: Where required by law, regulation, or valid legal process.\n• Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.`,
    },
    {
        title: "6. Cookies and Tracking",
        body: `AirStitch uses cookies and similar tracking technologies to:\n\n• Keep you logged in across sessions.\n• Remember your preferences.\n• Analyse platform usage and performance.\n• Deliver relevant content.\n\nYou can control cookies through your browser settings. Disabling certain cookies may affect platform functionality. We do not currently respond to "Do Not Track" signals.`,
    },
    {
        title: "7. Data Retention",
        body: `We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will remove your personal data within 30 days, except where we are required to retain it for legal, regulatory, or fraud-prevention purposes. Order records may be retained for up to 7 years in accordance with Nigerian financial regulations.`,
    },
    {
        title: "8. Your Rights",
        body: `You have the following rights regarding your personal data:\n\n• Access: Request a copy of the personal data we hold about you.\n• Correction: Ask us to correct inaccurate or incomplete data.\n• Deletion: Request that we delete your account and associated data.\n• Restriction: Ask us to limit how we process your data in certain circumstances.\n• Portability: Receive your data in a structured, machine-readable format.\n• Objection: Object to processing based on legitimate interests, including for direct marketing.\n\nTo exercise any of these rights, contact us at help@stitch.com. We will respond within 30 days.`,
    },
    {
        title: "9. Data Security",
        body: `We implement industry-standard security measures to protect your personal data, including:\n\n• Encrypted data transmission (HTTPS/TLS).\n• Secure password storage using hashing.\n• Access controls limiting who can view personal data internally.\n• Regular security reviews of our systems.\n\nWhile we take all reasonable precautions, no system is completely secure. Please notify us immediately at help@stitch.com if you believe your account has been compromised.`,
    },
    {
        title: "10. Children's Privacy",
        body: `AirStitch is not intended for users under the age of 18. We do not knowingly collect personal data from children. If we become aware that a child has provided us with personal information, we will delete it promptly. If you believe a child has created an account, please contact us at help@stitch.com.`,
    },
    {
        title: "11. Third-Party Links",
        body: `Our platform may contain links to third-party websites or services. This Privacy Policy does not apply to those sites, and we are not responsible for their privacy practices. We encourage you to read the privacy policies of any third-party sites you visit.`,
    },
    {
        title: "12. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we do, we will update the "Last updated" date at the top of this page and, where appropriate, notify you by email or through the platform. Your continued use of AirStitch after any changes constitutes your acceptance of the revised policy.`,
    },
    {
        title: "13. Contact Us",
        body: `If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out to us:\n\nEmail: help@stitch.com\nPhone: +234 801 010 1010\n\nWe aim to respond to all privacy-related enquiries within 5 business days.`,
    },
]

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-[64px] bg-black">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Legal</p>
                    <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
                        Your privacy matters to us. This policy explains what data we collect, why we collect it, and how we keep it safe.
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
                            Have questions about how we handle your data? We&apos;re here to help.
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
