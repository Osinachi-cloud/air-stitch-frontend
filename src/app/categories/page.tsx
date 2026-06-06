import { LandingNavbar } from "@/components/Header/LandingNavbar"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"

const styles = [
    {
        name: "Corporate",
        description: "Sharp, professional outfits crafted for the modern workplace. Suits, blazers, and tailored office wear that command respect.",
        image: "/images/single-product-big.png",
        tag: "Work & Office",
    },
    {
        name: "Natives",
        description: "Celebrate your heritage in beautifully crafted Agbada, Kaftan, Dashiki, and more — made to measure for every occasion.",
        image: "/images/Agbada.png",
        tag: "Traditional",
    },
    {
        name: "Casuals",
        description: "Everyday comfort meets custom fit. Relaxed cuts and breathable fabrics tailored precisely to your measurements.",
        image: "/images/single-product-big.png",
        tag: "Everyday Wear",
    },
]

const categories = [
    {
        name: "Guys",
        description: "Custom-fitted menswear for every style — from classic native wear to sharp corporate fits.",
        image: "/images/single-product-big.png",
        count: "120+ styles",
    },
    {
        name: "Gals",
        description: "Elegant and expressive womenswear tailored to celebrate every body shape and personal taste.",
        image: "/images/Agbada.png",
        count: "200+ styles",
    },
    {
        name: "Couples",
        description: "Matching outfits for couples that make a statement — from Aso ebi to coordinated casual sets.",
        image: "/images/Agbada.png",
        count: "60+ styles",
    },
    {
        name: "Kids",
        description: "Adorable, durable, and perfectly fitted clothing for children of all ages.",
        image: "/images/Agbada.png",
        count: "80+ styles",
    },
    {
        name: "Family",
        description: "Dress the whole family in matching or coordinated looks crafted by a single tailor.",
        image: "/images/Agbada.png",
        count: "40+ styles",
    },
    {
        name: "Aso Ebi",
        description: "Coordinated group fabric outfits for weddings, parties, and celebrations done right.",
        image: "/images/Agbada.png",
        count: "90+ styles",
    },
]

export default function CategoriesPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <LandingNavbar />

            {/* Hero */}
            <section
                className="pt-[64px] bg-cover bg-center"
                style={{ backgroundImage: "url('/images/stitch-backg.png')" }}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-3">Explore</p>
                    <h1 className="text-[40px] md:text-[58px] font-semibold leading-tight text-black max-w-2xl">
                        Find your style, your way
                    </h1>
                    <p className="mt-5 text-[15px] text-gray-700 max-w-md leading-relaxed">
                        Browse our full range of custom clothing styles and categories. Every piece is made to measure by a skilled tailor.
                    </p>
                </div>
            </section>

            {/* Styles Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">By Style</p>
                            <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900">Shop by style</h2>
                        </div>
                        <Link href="/products" className="hidden md:flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                            Browse all <span>›</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {styles.map((style) => (
                            <Link href="/products" key={style.name} className="group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
                                <div className="relative h-[260px] w-full overflow-hidden">
                                    <Image
                                        src={style.image}
                                        alt={style.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-white text-gray-700 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
                                        {style.tag}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-[17px] font-semibold text-gray-900 mb-1">{style.name}</h3>
                                    <p className="text-[13px] text-gray-500 leading-relaxed">{style.description}</p>
                                    <p className="mt-4 text-[13px] font-medium text-gray-800 flex items-center gap-1">
                                        Shop {style.name} <span className="text-base">›</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <hr className="border-gray-100" />
            </div>

            {/* Categories Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">By Category</p>
                            <h2 className="text-[28px] md:text-[36px] font-semibold text-gray-900">Shop by category</h2>
                        </div>
                        <Link href="/products" className="hidden md:flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                            Browse all <span>›</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {categories.map((cat) => (
                            <Link href="/products" key={cat.name} className="group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-[#F7F7F7]">
                                <div className="relative h-[200px] md:h-[240px] w-full overflow-hidden">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 md:p-5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-[15px] md:text-[17px] font-semibold text-gray-900">{cat.name}</h3>
                                        <span className="text-[11px] text-gray-400 font-medium">{cat.count}</span>
                                    </div>
                                    <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed">{cat.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 md:hidden text-center">
                        <Link href="/products" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 px-5 py-2.5 rounded hover:bg-gray-50 transition-colors">
                            Browse all <span>›</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-[24px] md:text-[32px] font-semibold text-white mb-2">Not sure where to start?</h2>
                        <p className="text-gray-400 text-[14px]">Browse all products and filter by what suits you.</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                        <Link
                            href="/products"
                            className="bg-white text-black text-[14px] font-medium px-6 py-3 rounded hover:bg-gray-100 transition-colors"
                        >
                            Browse Products
                        </Link>
                        <Link
                            href="/signup"
                            className="border border-white text-white text-[14px] font-medium px-6 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
