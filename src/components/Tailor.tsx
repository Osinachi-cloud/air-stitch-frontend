import { Heart } from "lucide-react"
import Link from "next/link"

export const Tailor = ({ id, image, name, description, url, buttonText }: any) => {
    return (
        <>
            <div key={id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] h-[260px] md:h-[360px]">
                <div className="relative w-full h-[60%] md:h-[68%] bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div className="absolute right-2 top-2">
                        <Heart color="#f59e0b" size={16} />
                    </div>
                </div>
                <div className="px-3 pt-3 pb-3 flex justify-center items-center flex-col gap-1">
                    <h3 className="text-xs md:text-sm font-semibold leading-snug text-surface-800 text-center line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-[10px] md:text-xs font-medium text-surface-500 text-center line-clamp-2">
                        {description}
                    </p>
                    <Link href={url} className="bg-brand-gradient text-white text-[10px] md:text-xs font-semibold px-4 py-2 rounded-md text-center mt-1 hover:opacity-90 transition-opacity shadow-card">
                        {buttonText}
                    </Link>
                </div>
            </div>
        </>
    )
}