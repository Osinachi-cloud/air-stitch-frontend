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
    if (typeof onLike !== 'function') {
      console.warn('onLike is not a function');
      return;
    }
    
    scrollPositionRef.current = window.scrollY;
    setIsProcessing(true);
    
    try {
      await onLike(productId);
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
        <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] h-[260px] md:h-[360px]">
            <div className="relative w-full h-[65%] md:h-[72%] bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
            >
                <div 
                    ref={buttonRef}
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
            <div className="px-3 pt-3 pb-2">
                <h3 className="text-xs md:text-sm font-semibold leading-snug text-surface-800 line-clamp-1">
                    {title}
                </h3>
                <p className="text-[10px] md:text-xs text-surface-500 mb-1 line-clamp-1">{description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-bold text-primary-700">{price}</span>
                    <Link 
                        href={`/product-details/${productId}`} 
                        className="text-[10px] md:text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}