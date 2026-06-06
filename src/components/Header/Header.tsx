import Link from "next/link"
import { LandingNavbar } from "./LandingNavbar"

export const Header = () => {
    return (
        <>
            <div
                className="bg-cover bg-center min-h-screen flex flex-col pt-[64px]"
                style={{ backgroundImage: "url('/images/stitch-backg.png')" }}
            >
                <LandingNavbar />

                <div className="flex flex-col gap-5 w-[88%] mx-auto mt-auto pb-20 pt-10 max-w-[500px] self-start ml-[7%]">
                    <h1 className="text-[40px] md:text-[56px] font-semibold leading-tight tracking-tight text-black">
                        First made to measure online clothing tailor market platform
                    </h1>
                    <p className="text-[14px] md:text-[16px] leading-relaxed font-normal text-gray-800 max-w-[360px]">
                        Browse from our different styles that suits your everyday needs, doesn&apos;t leave your pocket empty and saves time spent visiting tailor shops.
                    </p>
                    <Link
                        href="/email-verification"
                        className="flex items-center gap-2 bg-white text-black text-[14px] font-medium px-6 py-2.5 rounded w-fit border border-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        Get Started
                        <span>›</span>
                    </Link>
                </div>
            </div>
        </>
    )
}
