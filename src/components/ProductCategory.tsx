

export const ProductCategory = ({id,image, name, url, buttonText}: any) => {
    return (
        <>

            <div key={id} className="bg-[#eff2f9] rounded-[4px] overflow-hidden h-[300px] md:h-[500px]">
                <div className="relative w-full h-[70%] md:h-[78%] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                </div>
                <div className="px-[0.5rem] pt-[1rem] gap-[10px] pb-[0rem] md:pb-[1rem] flex justify-center items-center flex-col">
                    <h3 className="text-[12px] md:text-lg font-semibold leading-snug">
                        {name}
                    </h3>
                    <a href={url} className="bg-[#373636] w-[150px] p-[10px] text-center px-[14px] md:text-sm text-[8px] text-gray-500 mb-2">
                        {buttonText}
                        </a>
                </div>
            </div>
        </>
    )
}