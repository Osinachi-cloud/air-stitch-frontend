import { Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";

export const Tailor = ({ id, image, name, description, url, buttonText, tailorId, onLike, isLiked = false }: any) => {
    const [liked, setLiked] = useState(isLiked);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProcessing) return;
        if (typeof onLike !== 'function') {
            console.warn('onLike is not a function');
            return;
        }
        setIsProcessing(true);
        try {
            await onLike(tailorId);
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking tailor:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div key={id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] h-[260px] md:h-[360px]">
                <div className="relative w-full h-[60%] md:h-[68%] bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: `url(${image})` }}
                >
                    <div
                        onClick={handleLikeClick}
                        className={`absolute right-2 top-2 z-10 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <Heart
                            className="transition-colors duration-200"
                            color={liked ? "#f43f5e" : "#f59e0b"}
                            fill={liked ? "#f43f5e" : "none"}
                            size={16}
                        />
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