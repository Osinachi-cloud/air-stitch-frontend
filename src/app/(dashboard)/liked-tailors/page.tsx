"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { errorToast, successToast } from "@/hooks/UseToast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type PageRequest = {
    page: number;
    size: number;
};

type LikedTailor = {
    emailAddress: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    phoneNumber?: string;
    shortBio?: string;
};

export default function LikedTailorsPage() {
    const router = useRouter();
    const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, size: 8 });
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { value, getUserDetails } = useLocalStorage("customerDetails", null);
    const token = getUserDetails()?.accessToken;

    const likesUrl = useMemo(() =>
        `${baseUrL}/get-all-tailor-likes?page=${pageRequest.page}&size=${pageRequest.size}`,
        [pageRequest.page, pageRequest.size]
    );

    const {
        data: likedTailorsData,
        isLoading: likedTailorsLoading,
        callApi: fetchLikes
    } = useFetch("GET", null, likesUrl);

    useEffect(() => {
        if (!likedTailorsLoading) {
            setIsInitialLoading(false);
        }
    }, [likedTailorsLoading]);

    const likedTailors = React.useMemo(() => {
        return likedTailorsData?.data || [];
    }, [likedTailorsData]);

    const paginationInfo = React.useMemo(() => {
        if (!likedTailorsData) {
            return { totalPages: 1, currentPage: 0, totalElements: 0 };
        }
        const totalElements = likedTailorsData?.total || 0;
        const totalPages = Math.ceil(totalElements / pageRequest.size) || 1;
        const currentPage = likedTailorsData?.page || 0;
        return { totalPages: Math.max(totalPages, 1), currentPage, totalElements };
    }, [likedTailorsData, pageRequest.size]);

    const handlePageChange = (newPage: number) => {
        setPageRequest(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemoveLike = async (emailAddress: string) => {
        try {
            setDeletingId(emailAddress);
            const response = await fetch(`${baseUrL}/delete-tailor-like/${emailAddress}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to remove like');
            successToast("Tailor removed from likes");
            await fetchLikes();
        } catch (err) {
            console.error('Error removing like:', err);
            errorToast("Failed to remove tailor from likes");
        } finally {
            setDeletingId(null);
        }
    };

    const showPagination = paginationInfo.totalElements > pageRequest.size;

    if (isInitialLoading || likedTailorsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-surface-500 text-sm">Loading liked tailors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 w-full">
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="08109876543" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <h1 className="text-lg font-display font-bold text-surface-800">My Liked Tailors</h1>
                </div>
                <p className="text-sm text-surface-500 mt-1 sm:mt-1">
                    {paginationInfo.totalElements} {paginationInfo.totalElements === 1 ? 'tailor' : 'tailors'} liked
                </p>
            </div>

            {likedTailors.length > 0 ? (
                <>
                    <div className="bg-surface-50 p-3 sm:p-4 rounded-2xl border border-surface-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {likedTailors.map((tailor: LikedTailor) => {
                                const isDeleting = deletingId === tailor.emailAddress;
                                const fullName = `${tailor.firstName || ""} ${tailor.lastName || ""}`.trim() || "Tailor";

                                return (
                                    <div
                                        key={tailor.emailAddress}
                                        className="bg-white border border-surface-100 p-3 sm:p-4 rounded-2xl shadow-card hover:shadow-card-hover transition-all"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-100 flex-shrink-0 rounded-xl overflow-hidden">
                                                {tailor.profileImage ? (
                                                    <Image
                                                        src={tailor.profileImage}
                                                        alt={fullName}
                                                        width={80}
                                                        height={80}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-surface-400 text-xs sm:text-sm font-bold">
                                                        {fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-surface-800 mb-1 line-clamp-1">
                                                    {fullName}
                                                </h3>
                                                <p className="text-xs text-surface-500 line-clamp-2">
                                                    {tailor.shortBio || tailor.phoneNumber || ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                                            <button
                                                onClick={() => router.push(`/tailors/${encodeURIComponent(tailor.emailAddress)}`)}
                                                className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap rounded-xl"
                                            >
                                                VIEW PROFILE
                                            </button>
                                            <button
                                                onClick={() => handleRemoveLike(tailor.emailAddress)}
                                                className="relative text-[20px] sm:text-[22px] text-surface-700 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Remove"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <span className="block w-5 h-5 border-2 border-surface-300 border-t-red-500 rounded-full animate-spin" />
                                                ) : (
                                                    '🗑'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {showPagination && paginationInfo.totalPages > 1 && (
                        <div className="flex flex-col items-center mt-6">
                            <p className="text-sm text-surface-500 mb-3">
                                Page {pageRequest.page + 1} of {paginationInfo.totalPages}
                            </p>
                            <div className="flex justify-center items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => handlePageChange(pageRequest.page - 1)}
                                    disabled={pageRequest.page === 0 || deletingId !== null}
                                    className="px-3 py-2 border border-surface-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 text-xs font-semibold min-w-[70px] sm:min-w-[90px]"
                                >
                                    <span className="hidden sm:inline">Previous</span>
                                    <span className="sm:hidden">← Prev</span>
                                </button>
                                <div className="flex items-center gap-1 sm:gap-2 mx-2">
                                    {paginationInfo.totalPages > 0 &&
                                        Array.from({ length: paginationInfo.totalPages }, (_, i) => {
                                            const showOnMobile =
                                                paginationInfo.totalPages <= 7 ||
                                                i === 0 ||
                                                i === paginationInfo.totalPages - 1 ||
                                                Math.abs(i - pageRequest.page) <= 1;
                                            if (!showOnMobile) {
                                                if (i === 1 && pageRequest.page > 3) {
                                                    return <span key="ellipsis-start" className="px-2 text-surface-500">...</span>;
                                                }
                                                if (i === paginationInfo.totalPages - 2 && pageRequest.page < paginationInfo.totalPages - 4) {
                                                    return <span key="ellipsis-end" className="px-2 text-surface-500">...</span>;
                                                }
                                                return null;
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i)}
                                                    disabled={deletingId !== null}
                                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors ${pageRequest.page === i
                                                        ? 'bg-brand-gradient text-white'
                                                        : 'border border-surface-200 hover:bg-surface-50'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        })
                                    }
                                </div>
                                <button
                                    onClick={() => handlePageChange(pageRequest.page + 1)}
                                    disabled={pageRequest.page === paginationInfo.totalPages - 1 || deletingId !== null}
                                    className="px-3 py-2 border border-surface-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-50 text-xs font-semibold min-w-[70px] sm:min-w-[90px]"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <span className="sm:hidden">Next →</span>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 sm:py-16 bg-surface-50 rounded-2xl border border-surface-100">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-surface-400" fill="none" viewBox="08109876543" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 08109876543L12 20.364l7.682-7.682a4.5 4.5 08109876543L12 7.636l-1.318-1.318a4.5 4.5 08109876543z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-display font-bold text-surface-800 mb-2">No liked tailors yet</h3>
                    <p className="text-sm text-surface-500 mb-4 sm:mb-6">Start exploring and like tailors</p>
                    <button
                        onClick={() => router.push('/tailors')}
                        className="bg-brand-gradient hover:bg-brand-gradient-hover text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    >
                        Browse Tailors
                    </button>
                </div>
            )}
        </div>
    );
}
