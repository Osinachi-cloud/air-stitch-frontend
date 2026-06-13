import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"

const steps = [
    {
        step: "01",
        title: "Raise a Complaint",
        body: "Contact our support team at help@stitch.com with your order ID, a description of the issue, and any supporting evidence (photos, screenshots of conversations).",
    },
    {
        step: "02",
        title: "Investigation",
        body: "Our team will review your complaint within 2 business days. We may contact both parties to gather additional information before making a determination.",
    },
    {
        step: "03",
        title: "Resolution",
        body: "We will communicate the outcome to all parties within 5–7 business days. Resolutions may include refunds, order remakes, or account actions where a policy violation is confirmed.",
    },
    {
        step: "04",
        title: "Appeal",
        body: "If you are unsatisfied with the resolution, you may appeal within 7 days of the decision. Appeals are reviewed by a senior member of our team and are final.",
    },
]

const faqs = [
    {
        q: "What counts as a valid complaint?",
        a: "Valid complaints include: orders that significantly differ from agreed specifications, defective garments, non-delivery, or confirmed misconduct by a tailor or customer.",
    },
    {
        q: "How long do I have to raise a complaint?",
        a: "Complaints must be raised within 14 days of delivery (or the expected delivery date if the item was not delivered). After this window, we may not be able to assist.",
    },
    {
        q: "Can I complain about a tailor's communication?",
        a: "Yes. Unprofessional conduct, harassment, or off-platform solicitation by a tailor is a serious violation and should be reported immediately.",
    },
    {
        q: "What happens to the payment while a complaint is open?",
        a: "If payment has not yet been released from escrow, it will be held until the complaint is resolved. If it has been released, resolution may involve a partial or full refund depending on the outcome.",
    },
    {
        q: "Can a tailor complain about a customer?",
        a: "Yes. Tailors can raise complaints about abusive behaviour, false disputes, or customers who attempt to transact off-platform. We protect both parties.",
    },
]

export default function ComplaintsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section className="pt-[64px] bg-black">
                <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Support</p>
                    <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight mb-4">
                        Complaints &amp; Disputes
                    </h1>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl">
                        We take every complaint seriously. If something went wrong with your order or your experience on the platform, here&apos;s how to get it resolved quickly and fairly.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="mailto:help@stitch.com"
                            className="inline-flex items-center gap-2 bg-white text-black text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            Email us now
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 text-[13px] font-medium px-5 py-2.5 rounded-lg hover:border-gray-400 hover:text-white transition-colors"
                        >
                            Contact page
                        </Link>
                    </div>
                </div>
            </section>

            <section className="flex-1 bg-white py-16">
                <div className="max-w-4xl mx-auto px-6 md:px-12">

                    {/* Process */}
                    <div className="mb-16">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">How it works</p>
                        <h2 className="text-[22px] font-semibold text-gray-900 mb-10">Our resolution process</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {steps.map((s) => (
                                <div key={s.step} className="border border-gray-100 rounded-2xl p-6">
                                    <span className="text-[11px] font-bold text-gray-400 tracking-widest">{s.step}</span>
                                    <h3 className="text-[15px] font-semibold text-gray-900 mt-2 mb-2">{s.title}</h3>
                                    <p className="text-[13px] text-gray-600 leading-relaxed">{s.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* What to include */}
                    <div className="mb-16 bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-[18px] font-semibold text-gray-900 mb-4">What to include in your complaint</h2>
                        <ul className="space-y-3">
                            {[
                                "Your order ID (found in your Orders page)",
                                "A clear description of the issue",
                                "Photos of the garment if the complaint is about quality",
                                "Screenshots of any relevant messages",
                                "Your preferred resolution (refund, remake, etc.)",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[14px] text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div className="mb-16">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">FAQs</p>
                        <h2 className="text-[22px] font-semibold text-gray-900 mb-8">Common questions</h2>
                        <div className="space-y-4">
                            {faqs.map((f) => (
                                <div key={f.q} className="border border-gray-100 rounded-2xl p-6">
                                    <p className="text-[14px] font-semibold text-gray-900 mb-2">{f.q}</p>
                                    <p className="text-[13px] text-gray-600 leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-black rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-[20px] font-semibold text-white mb-2">Ready to raise a complaint?</h3>
                        <p className="text-gray-400 text-[14px] mb-6">Our team is available Monday – Friday, 9am – 6pm WAT.</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <a
                                href="mailto:help@stitch.com"
                                className="inline-flex items-center gap-2 bg-white text-black text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                help@stitch.com
                            </a>
                            <a
                                href="tel:+2348010101010"
                                className="inline-flex items-center gap-2 border border-gray-700 text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:border-gray-500 transition-colors"
                            >
                                +234 801 010 1010
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    )
}
