"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import { errorToast, successToast } from "@/hooks/UseToast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type PageRequest = {
    page: number;
    size: number;
};

type LikedProduct = {
    productId: string;
    name: string;
    productImage?: string;
    price: number;
    inStock?: boolean;
};

export default function LikesPage() {
    const router = useRouter();
    const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, size: 5 });
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { value, getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken;

    const {
        data: likedProductsData,
        isLoading: likedProductsLoading,
        callApi: fetchLikes
    } = useFetch("GET", null, `${baseUrL}/get-all-product-likes?page=${pageRequest.page}&size=${pageRequest.size}`);

    // Set initial loading to false once we have data or if there's an error
    useEffect(() => {
        if (!likedProductsLoading) {
            setIsInitialLoading(false);
        }
    }, [likedProductsLoading]);

    const likedProducts = React.useMemo(() => {
        return likedProductsData?.data || [];
    }, [likedProductsData]);


    const paginationInfo = React.useMemo(() => {
        if (!likedProductsData) {
            return {
                totalPages: 1,
                currentPage: 0,
                totalElements: 0
            };
        }
        
        const totalElements = likedProductsData?.total || 0;
        const totalPages = Math.ceil(totalElements / pageRequest.size) || 1;
        const currentPage = likedProductsData?.page || 0;
        
        return {
            totalPages: Math.max(totalPages, 1),
            currentPage: currentPage,
            totalElements: totalElements
        };
    }, [likedProductsData, pageRequest.size]);

    const handlePageChange = (newPage: number) => {
        setPageRequest(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBuyNow = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    // Add to cart function
    const handleAddToCart = async (productId: string) => {
        try {
            setAddingToCartId(productId);
            router.push(`product-details/${productId}`);
        } catch (err) {
            console.error('Error adding to cart:', err);
            errorToast("Failed to add item to cart");
        } finally {
            setAddingToCartId(null);
        }
    };

    // Delete like function
    const handleRemoveLike = async (productId: string) => {
        try {
            setDeletingId(productId);
            
            const response = await fetch(`${baseUrL}/delete-product-like/${productId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove like');
            }

            // Show success message
            successToast("Item removed from likes");
            
            // Refresh the likes list
            await fetchLikes();
            
        } catch (err) {
            console.error('Error removing like:', err);
            errorToast("Failed to remove item from likes");
        } finally {
            setDeletingId(null);
        }
    };

    // Calculate if we should show pagination
    const showPagination = paginationInfo.totalElements > pageRequest.size;

    // Show loading state while fetching initial data
    if (isInitialLoading || likedProductsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Loading your liked items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Likes</h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                    {paginationInfo.totalElements} {paginationInfo.totalElements === 1 ? 'item' : 'items'} liked
                </p>
            </div>

            {/* Products Grid */}
            {likedProducts.length > 0 ? (
                <>
                    <div className="bg-gray-100 p-3 sm:p-6 rounded-lg">
                        <div className="space-y-3 sm:space-y-4">
                            {likedProducts.map((product: LikedProduct) => {
                                const isDeleting = deletingId === product.productId;
                                const isAddingToCart = addingToCartId === product.productId;
                                const isDisabled = isDeleting || isAddingToCart;

                                return (
                                    <div
                                        key={product.productId}
                                        className="bg-white border border-gray-200 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Mobile Layout */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                            
                                            {/* LEFT: Image + Info */}
                                            <div className="flex items-center gap-3 sm:gap-6 flex-1">
                                                {/* Product Image */}
                                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                                    {product.productImage ? (
                                                        <img
                                                            src={product.productImage}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Name + Price */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2 line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm sm:text-base font-semibold text-gray-700">
                                                        {formatNumberToNaira(product.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* RIGHT: Actions */}
                                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0 border-t sm:border-0 pt-2 sm:pt-0">
                                                {/* Buy Button */}
                                                {product.inStock !== false ? (
                                                    <button
                                                        onClick={() => handleBuyNow(product.productId)}
                                                        className="bg-gray-700 text-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap rounded-md"
                                                        disabled={isDisabled}
                                                    >
                                                        BUY NOW
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="bg-gray-400 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium cursor-not-allowed whitespace-nowrap rounded-md"
                                                    >
                                                        OUT OF STOCK
                                                    </button>
                                                )}

                                                {/* Action Icons */}
                                                <div className="flex gap-4">
                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => handleAddToCart(product.productId)}
                                                        className="relative text-[20px] sm:text-[25px] text-gray-700 hover:text-black p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label="Add to cart"
                                                        disabled={isDisabled || product.inStock === false}
                                                    >
                                                        {isAddingToCart ? (
                                                            <span className="block w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                                                        ) : (
                                                            '🛒'
                                                        )}
                                                    </button>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => handleRemoveLike(product.productId)}
                                                        className="relative text-[20px] sm:text-[25px] text-gray-700 hover:text-red-500 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label="Remove"
                                                        disabled={isDisabled}
                                                    >
                                                        {isDeleting ? (
                                                            <span className="block w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                                                        ) : (
                                                            '🗑'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pagination - Show when total elements > page size */}
                    {showPagination && paginationInfo.totalPages > 1 && (
                        <div className="flex flex-col items-center mt-6 sm:mt-8">
                            {/* Page info */}
                            <p className="text-sm text-gray-500 mb-3">
                                Page {pageRequest.page + 1} of {paginationInfo.totalPages}
                            </p>
                            
                            {/* Pagination controls */}
                            <div className="flex justify-center items-center gap-1 sm:gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(pageRequest.page - 1)}
                                    disabled={pageRequest.page === 0 || deletingId !== null || addingToCartId !== null}
                                    className="px-3 sm:px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base font-medium min-w-[70px] sm:min-w-[90px]"
                                >
                                    <span className="hidden sm:inline">Previous</span>
                                    <span className="sm:hidden">← Prev</span>
                                </button>

                                {/* Page Numbers - Responsive */}
                                <div className="flex items-center gap-1 sm:gap-2 mx-2">
                                    {paginationInfo.totalPages > 0 && 
                                        Array.from({ length: paginationInfo.totalPages }, (_, i) => {
                                            // Show limited page numbers on mobile
                                            const showOnMobile = 
                                                paginationInfo.totalPages <= 7 || 
                                                i === 0 || 
                                                i === paginationInfo.totalPages - 1 || 
                                                Math.abs(i - pageRequest.page) <= 1;
                                            
                                            if (!showOnMobile) {
                                                // Show ellipsis
                                                if (i === 1 && pageRequest.page > 3) {
                                                    return <span key="ellipsis-start" className="px-2 text-gray-500">...</span>;
                                                }
                                                if (i === paginationInfo.totalPages - 2 && pageRequest.page < paginationInfo.totalPages - 4) {
                                                    return <span key="ellipsis-end" className="px-2 text-gray-500">...</span>;
                                                }
                                                return null;
                                            }
                                            
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i)}
                                                    disabled={deletingId !== null || addingToCartId !== null}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                                                        pageRequest.page === i
                                                            ? 'bg-black text-white'
                                                            : 'border border-gray-300 hover:bg-gray-50'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    aria-label={`Go to page ${i + 1}`}
                                                    aria-current={pageRequest.page === i ? 'page' : undefined}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        })
                                    }
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(pageRequest.page + 1)}
                                    disabled={pageRequest.page === paginationInfo.totalPages - 1 || deletingId !== null || addingToCartId !== null}
                                    className="px-3 sm:px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm sm:text-base font-medium min-w-[70px] sm:min-w-[90px]"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <span className="sm:hidden">Next →</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // Empty state - only shown when not loading and no products
                <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No liked items yet</h3>
                    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Start exploring and like products you're interested in</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
                    >
                        Browse Products
                    </button>
                </div>
            )}
        </div>
    );
}