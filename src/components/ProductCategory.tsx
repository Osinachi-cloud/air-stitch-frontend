

export const ProductCategory = ({id,image, name, url, buttonText}: any) => {
    return (
        <>

            <div key={id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] h-[260px] md:h-[360px]">
                <div className="relative w-full h-[65%] md:h-[72%] bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                </div>
                <div className="px-3 pt-3 pb-3 flex justify-center items-center flex-col gap-2">
                    <h3 className="text-xs md:text-sm font-semibold leading-snug text-surface-800 text-center">
                        {name}
                    </h3>
                    <a href={url} className="bg-brand-gradient text-white text-[10px] md:text-xs font-semibold px-4 py-2 rounded-md text-center hover:opacity-90 transition-opacity shadow-card">
                        {buttonText}
                        </a>
                </div>
            </div>
        </>
    )
}