import { Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback, useRef } from "react";
import { usePost, usePostWithoutRouting } from "@/hooks/usePost";

export const Product = ({id, image, title, description, price, productId, getLikeUrl, isLiked = false}: any) => {
    const [liked, setLiked] = useState(isLiked);
    const [isProcessing, setIsProcessing] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    
    // Store scroll position before any state updates
    const scrollPositionRef = useRef(0);

    // Get the URL for this specific product
    const likeUrl = getLikeUrl(productId);
    
    const { callApi } = usePostWithoutRouting("POST", null, likeUrl);

    useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent multiple clicks while processing
        if (isProcessing) return;
        
        // Store current scroll position BEFORE any state changes
        scrollPositionRef.current = window.scrollY;
        
        setIsProcessing(true);
        
        try {
            await callApi();
            
            // Optimistically update the UI
            setLiked(!liked);
            
            // Use a combination of techniques to ensure scroll position is maintained
            // First, use requestAnimationFrame to ensure DOM updates are complete
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollPositionRef.current);
                
                // Double-check after a short delay (for any async layout shifts)
                setTimeout(() => {
                    window.scrollTo(0, scrollPositionRef.current);
                }, 50);
            });
            
        } catch (error) {
            console.error('Error liking product:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Prevent any unwanted scroll behavior on mount/unmount
    useEffect(() => {
        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <div className="bg-[#eff2f9] rounded-[4px] overflow-hidden h-[300px] md:h-[500px]">
            <div className="relative w-full h-[70%] md:h-[78%] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div 
                    ref={buttonRef}
                    onClick={handleLikeClick} 
                    className={`absolute right-2 top-2 md:right-5 md:top-5 z-10 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Heart 
                        className="transition-colors duration-200" 
                        color={liked ? "#ff0000" : "orange"} 
                        fill={liked ? "#ff0000" : "none"}
                        size={18}
                    />
                </div>
            </div>
            <div className="px-[0.5rem] pt-[1rem] pb-[0rem] md:pb-[1rem]">
                <h3 className="text-[12px] md:text-lg font-semibold leading-snug">
                    {title}
                </h3>
                <p className="md:text-sm text-[8px] text-gray-500 mb-2">{description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[12px] md:text-lg font-bold">{price}</span>
                    <Link 
                        href={`/product-details/${productId}`} 
                        className="text-[12px] md:text-sm text-gray-600">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}