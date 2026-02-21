import Image from "next/image"

export const Header = () => {
    return (
        <>
            <div className="bg-cover bg-center min-h-screen" 
            style={{ backgroundImage: "url('/images/stitch-backg.png')" }}>
                <div>
                    
                    {/* <app-navbar></app-navbar> */}
                </div>
                <div className="text-black py-[130px] font-medium font-sans w-[86%] mx-auto grid gap-[2rem]">
                    <p className="text-[32px] md:text-[70px] leading-tight ">
                        First made to measure
                        <br />
                        online clothing tailor
                        <br />
                        market platform
                    </p>
                    <p className="text-[16px] md:text-[25px] leading-normal">
                        Browse from our different styles that suits your
                        <br />
                        everyday needs, does not leave your pocket empty and
                        <br />
                        saves time spent visiting tailor shops.
                    </p>
                    <div className="bg-[#373636] flex justify-center items-center rounded w-[162px] md:w-[240px] mt-[1rem]">
                        <button className="text-white text-[13px] md:text-[1.5rem] px-[1rem] py-[1rem] md:py-[2rem] rounded-[8px] ">Get Started</button>
                        <Image src="/icons/Arrow 1.png" alt="Product Image" className=" h-auto" width={30} height={30} />
                    </div>
                </div>
            </div>
        </>
    )
}