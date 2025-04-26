import { Heart } from "lucide-react"

export const Product = ({id, image, title, description, price}: any) => {
    return (
        <>

            <div key={id} className="bg-[#eff2f9] rounded-[4px] overflow-hidden h-[300px] md:h-[500px]">
                <div className="relative w-full h-[70%] md:h-[78%] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div className="absolute right-2 top-2 md:right-5 md:top-5">
                        <Heart color="orange" size={18} />
                    </div>
                </div>
                <div className="px-[0.5rem] pt-[1rem] pb-[0rem] md:pb-[1rem]">
                    <h3 className="text-[12px] md:text-lg font-semibold leading-snug">
                        {title}
                    </h3>
                    <p className="md:text-sm text-[8px] text-gray-500 mb-2">{description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-[12px] md:text-lg font-bold">{price}</span>
                        <a href="#" className="text-[12px] md:text-sm text-gray-600">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}


