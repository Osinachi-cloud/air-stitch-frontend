
export const LandingBanner = () => {
    return (
        <>
            <div className="bg-cover bg-center" 
            style={{ backgroundImage: "url('/images/landing-bg.png')" }}>
                <div>
                    
                    {/* <app-navbar></app-navbar> */}
                </div>
                <div className="text-[#fff] py-[130px] font-medium font-sans w-[86%] mx-auto grid gap-[2rem]">
                    <p className="text-[32px] md:text-[48px] leading-tight ">
                        First made to measure
                        <br />
                        online clothing tailor
                        <br />
                        market platform
                    </p>
                    <div className="bg-[#fff] p-[1rem] text-[#000] flex justify-center items-center rounded w-[162px] md:w-[200px] mt-[1rem]">
                        Get Started
                    </div>
                </div>
            </div>
        </>
    )
}