import { Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback, useRef } from "react";
import { usePost, usePostWithoutRouting } from "@/hooks/usePost";

export const Product = ({ 
  image, 
  title, 
  description, 
  price, 
  productId, 
  onLike,  // Changed from getLikeUrl
  isLiked = false,
  isLiking = false // Optional
}: any) => {
  const [liked, setLiked] = useState(isLiked);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollPositionRef = useRef(0);
  const buttonRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing || isLiking) return;
    
    scrollPositionRef.current = window.scrollY;
    setIsProcessing(true);
    
    try {
      await onLike(productId); // Call the parent's like function
      setLiked(!liked);
      
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
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