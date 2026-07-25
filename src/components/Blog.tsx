import Image from "next/image"

export const Blog = ({ id, image, header, body, price, buttonText}: any) => {

    const showBlogDetails = (productId: any) => {

    }
    return (
        <>
            <div
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer">
                <Image src={image} alt="Blog Image" width={400} height={220} 
                    className="w-full h-[180px] md:h-[220px] object-cover" />
                <div className="p-4">
                    <p className="font-display text-sm md:text-base font-semibold text-surface-800 mb-2 line-clamp-2">How to style your dress to fit your taste!</p>
                    <p className="text-xs text-surface-500 line-clamp-3 leading-relaxed mb-3">How to style your dress to fit your taste! How to style your dress to fit your taste! How to style your dress to fit your taste!</p>
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] text-surface-400">07/09/2023</p>
                        <div onClick={()=> showBlogDetails(id)}
                            className="bg-brand-gradient text-white px-4 py-2 rounded-md text-xs font-semibold flex justify-center items-center gap-2 hover:opacity-90 transition-opacity">
                        <span>Read more</span>
                        <div>
                            <Image src="/icons/Arrow-right.png" alt="" width={16} height={16} className="w-4 h-4 invert" />
                        </div>
                    </div>


                </div>

            </div>
        </div >
        </>
    )
}