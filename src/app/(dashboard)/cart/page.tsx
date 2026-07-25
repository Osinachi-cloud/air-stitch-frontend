"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation'
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { usePost } from "@/hooks/usePost";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import { errorToast, successToast } from "@/hooks/UseToast";

type PageRequest = { page: number; size: number };

type CartProduct = {
    productId: string;
    vendorId?: string;
    name: string;
    productImage?: string;
    amount: number;
    quantity: number;
    amountByQuantity?: number;
    category?: string;
    color: string;
    sleeveType: string;
    measurementTag: string;
    price: number;
};

export default function CartPage() {
    const router = useRouter();
    // const [pageRequest] = useState<PageRequest>({ page: 0, size: 30 });

    const { value, getUserDetails } = useLocalStorage("customerDetails", null);
    const token = getUserDetails()?.accessToken;

    // const {
    //     data: cartData,
    //     isLoading: cartLoading,
    //     error: cartError,
    //     callApi: fetchCart
    // } = useFetch("GET", null, `${baseUrL}/get-cart?page=${pageRequest.page}&size=${pageRequest.size}`);

    // const {
    //     data: summaryData,
    //     isLoading: summaryLoading,
    //     callApi: fetchSummary
    // } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

    // const {
    //     callApi: clearCart,
    //     isLoading: clearCartLoading
    // } = usePost("PUT", null, `${baseUrL}/clear-cart`, null);


    // For cart data with pagination
    const [pageRequest, setPageRequest] = useState<PageRequest>({ page: 0, size: 5 });


    const cartUrl = useMemo(() =>
        `${baseUrL}/get-cart?page=${pageRequest.page}&size=${pageRequest.size}`,
        [pageRequest.page, pageRequest.size] 
    );

    const {
        data: cartData,
        isLoading: cartLoading,
        error: cartError,
        callApi: fetchCart
    } = useFetch("GET", null, cartUrl);

    const summaryUrl = useMemo(() =>
        `${baseUrL}/sum-amount-by-quantity-by-customerId`,
        [] 
    );

    const {
        data: summaryData,
        isLoading: summaryLoading,
        callApi: fetchSummary
    } = useFetch("GET", null, summaryUrl);

    const clearCartUrl = useMemo(() =>
        `${baseUrL}/clear-cart`,
        []
    );

    const {
        callApi: clearCart,
        isLoading: clearCartLoading
    } = usePost("PUT", null, clearCartUrl, null);

    useEffect(() => {
        if (cartData) {
            fetchSummary();
        }
    }, [cartData]);



    const cartItems: CartProduct[] = React.useMemo(() => {
        if (!cartData) return [];
        return cartData.data?.items || cartData.items || cartData.data || [];
    }, [cartData]);

    const isLoading = cartLoading || summaryLoading;

    const handleAddCount = async (productId: string, color: string, sleeveType: string, measurementTag: string) => {
        try {
            await fetch(`${baseUrL}/add-product-cart-with-variation?productId=${productId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({ color, sleeveType, measurementTag })
            })
            await fetchCart();
            await fetchSummary();
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const handleRemoveCount = async (productId: string, color: string, sleeveType: string, measurementTag: string) => {
        try {
            await fetch(`${baseUrL}/delete-product-cart?productId=${productId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({ color, sleeveType, measurementTag })
            });
            await fetchCart();
            await fetchSummary();
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };

    const handleRemoveProduct = async (productId: string, color: string, sleeveType: string, measurementTag: string) => {
        try {
            await fetch(`${baseUrL}/remove-all-product-from-cart?productId=${productId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({ color, sleeveType, measurementTag })
            });
            await fetchCart();
            await fetchSummary();
        } catch (err) {
            console.error('Error removing product:', err);
        }
    };

    const handleAddProductLikes = async (productId: string) => {
        console.log("Adding like to productId:", productId);
        try {
            await fetch(`${baseUrL}/add-product-likes/${productId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include"
            });
        } catch (err) {
            console.error('Error adding like:', err);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            await fetchCart();
            await fetchSummary();
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            errorToast("Your cart is empty");
            return;
        }

        // Navigate to order request page
        router.push("/order-request");
    };

    return (
        <div className="py-6 w-full">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h1 className="text-lg font-display font-bold text-surface-800">Shopping Cart</h1>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-6 h-6 border-4 border-dashed border-primary-600 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Cart Items - Mobile optimized */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
                        {/* Desktop Table */}
                        <table className="hidden md:table w-full text-sm text-surface-600">
                            <thead className="uppercase text-[11px] font-semibold text-surface-500 border-b border-surface-100">
                                <tr>
                                    <th className="p-4 text-left">Product</th>
                                    <th className="p-4 text-center">Price</th>
                                    <th className="p-4 text-center">Quantity</th>
                                    <th className="p-4 text-center">Total</th>
                                    <th className="p-4 text-center">Action</th>
                                    <th className="p-4 text-center">Tag</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.length > 0 ? cartItems.map((product: CartProduct) => (
                                    <tr key={product.productId + product.measurementTag + product.sleeveType + product.color} className="hover:bg-primary-50/50 border-b border-surface-100">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-surface-100 flex items-center justify-center overflow-hidden rounded-xl">
                                                {product.productImage ? (
                                                    <img
                                                        src={product.productImage === null ? "/images/placeholder-product.png" : product.productImage}
                                                        alt={product.name}
                                                        className="object-contain h-full"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-surface-400">No image</div>
                                                )}
                                            </div>
                                            <div className="text-sm md:text-base text-surface-800">{product.name}</div>
                                        </td>
                                        <td className="p-2 text-center">{formatNumberToNaira(product.price)}</td>
                                        <td className="p-2 text-center">
                                            <div className="inline-flex border border-surface-200 rounded-xl items-center">
                                                <button
                                                    onClick={() => handleRemoveCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-1 md:p-2 w-8 h-8 flex items-center justify-center hover:bg-surface-50 rounded-l-xl"
                                                >
                                                    -
                                                </button>
                                                <div className="px-2 md:px-4 text-sm md:text-base text-surface-800">{product.quantity}</div>
                                                <button
                                                    onClick={() => handleAddCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-1 md:p-2 w-8 h-8 flex items-center justify-center hover:bg-surface-50 rounded-l-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-center">{formatNumberToNaira(product.amountByQuantity ?? product.amount * product.quantity)}</td>
                                        <td className="p-2 text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => handleAddProductLikes(product.productId)}
                                                    className={`p-2 text-white rounded text-xs h-8 w-8 flex items-center justify-center`}
                                                    style={{ backgroundColor: product.color }}
                                                    title="Add to favorites"
                                                >
                                                    ❤️
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveProduct(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Remove item"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-center text-xs md:text-sm text-surface-600">{product.measurementTag}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-surface-500">
                                            Your cart is empty
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3 p-4">
                            {cartItems.length > 0 ? cartItems.map((product: CartProduct) => (
                                <div key={product.productId + product.measurementTag + product.sleeveType + product.color} className="bg-white border border-surface-100 rounded-2xl p-4 shadow-card">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-16 h-16 bg-surface-100 flex items-center justify-center overflow-hidden rounded-xl">
                                                {product.productImage ? (
                                                    <img
                                                        src={product.productImage === null ? "/images/placeholder-product.png" : product.productImage}
                                                        alt={product.name}
                                                        className="object-contain h-full"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-surface-400">No image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm line-clamp-2 text-surface-800">{product.name}</h3>
                                                <p className="text-primary-600 font-semibold text-sm mt-1">
                                                    {formatNumberToNaira(product.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveProduct(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                            className="text-red-500 p-1"
                                        >
                                            ✖
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-surface-500">Quantity:</span>
                                        <div className="inline-flex border border-surface-200 rounded-xl items-center">
                                            <button
                                                onClick={() => handleRemoveCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                className="p-2 w-8 h-8 flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <div className="px-3 text-sm font-medium">{product.quantity}</div>
                                            <button
                                                onClick={() => handleAddCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                className="p-2 w-8 h-8 flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs text-surface-500">Total:</span>
                                        <span className="font-semibold text-sm">
                                            {formatNumberToNaira(product.amountByQuantity ?? product.amount * product.quantity)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-surface-500">Tag:</span>
                                            <span className="text-xs font-medium bg-surface-100 px-2 py-1 rounded-lg">
                                                {product.measurementTag}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleAddProductLikes(product.productId)}
                                            className={`p-2 text-white rounded text-xs h-8 w-8 flex items-center justify-center`}
                                            style={{ backgroundColor: product.color }}
                                            title="Add to favorites"
                                        >
                                            ❤️
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-surface-500 py-8">
                                    Your cart is empty
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between p-4 border-t border-surface-100 gap-3">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-4 py-2.5 bg-surface-100 rounded-xl uppercase text-xs font-semibold hover:bg-surface-200 transition-colors"
                                >
                                    Continue shopping
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="px-4 py-2.5 bg-surface-100 rounded-xl uppercase text-xs font-semibold hover:bg-surface-200 transition-colors"
                                    disabled={clearCartLoading}
                                >
                                    {clearCartLoading ? "Clearing..." : "Clear shopping cart"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary - Mobile optimized */}
                    <aside className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl shadow-card border border-surface-100">
                            <h2 className="text-sm font-display font-bold text-surface-800 mb-3">Apply Discount Code</h2>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-2 w-[70%] sm:p-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                                    placeholder="Enter discount code"
                                />
                                <button className="px-3 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl shadow-card border border-surface-100">
                            <h2 className="text-sm font-display font-bold text-surface-800 mb-3">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="text-surface-600">Subtotal</div>
                                    <div className="font-semibold text-surface-800">{formatNumberToNaira(summaryData?.sum)}</div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-surface-500">Tax</div>
                                    <div className="text-surface-500">0.00</div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <div className="text-sm font-semibold text-surface-800">Order Total</div>
                                    <div className="text-sm font-semibold text-primary-600">
                                        {/* {formatNumberToNaira(sumCartAmount)} */}
                                        {formatNumberToNaira(summaryData?.sum)}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={cartItems.length === 0}
                                onClick={handleProceedToCheckout}
                                className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center gap-3 disabled:bg-surface-300 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                            >
                                <span>Proceed to checkout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

