import Link from "next/link";

export const LandingBanner = () => {
    return (
        <>
            <div 
                className="relative rounded-lg shadow-elegant w-[91%] mx-auto overflow-hidden min-h-[200px] md:min-h-[260px]"
                style={{ backgroundImage: "url('/images/landing-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Subtle purple overlay for elegance */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent" />
                <div className="relative text-white py-12 md:py-16 font-medium font-body w-full px-4 md:px-6 grid gap-4">
                    <p className="font-display text-xl md:text-2xl leading-tight max-w-md drop-shadow-lg">
                        First made to measure online clothing tailor market platform
                    </p>
                    <Link href="/email-verification" className="bg-[#164377] text-white text-xs font-semibold px-5 py-2.5 rounded-md flex justify-center items-center w-fit hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    )
}
