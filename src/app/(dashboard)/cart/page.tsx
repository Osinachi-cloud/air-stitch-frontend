"use client";
import React, { useEffect, useState } from "react";
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

type PaymentRequest = {
    amount: number;
    channel: string[];
    quantity?: number;
    productId?: string;
    vendorId?: string;
    email?: string;
    narration?: string;
    productCategoryName?: string;
};

export default function CartPage() {
    const router = useRouter();
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [sumCartAmount, setSumCartAmount] = useState<number>(0);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [pageRequest] = useState<PageRequest>({ page: 0, size: 30 });

    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken;

    const {
        data: cartData,
        isLoading: cartLoading,
        error: cartError,
        callApi: fetchCart
    } = useFetch("GET", null, `${baseUrL}/get-cart?page=${pageRequest.page}&size=${pageRequest.size}`);

    const {
        data: summaryData,
        isLoading: summaryLoading,
        callApi: fetchSummary
    } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

    const {
        callApi: clearCart,
        isLoading: clearCartLoading
    } = usePost("PUT", null, `${baseUrL}/clear-cart`, 'cart');

    useEffect(() => {
        fetchCart();
        fetchSummary();
    }, []);

    useEffect(() => {
        console.log("cart data from useFetch ====> ", cartData);
        if (summaryData) {
            const total = summaryData?.total ?? summaryData?.data?.total ?? 0;
            setSumCartAmount(total);
        }
    }, [cartData, summaryData]);

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

    const goToOrderPage = async () => {
        if (!selectedChannel) {
            errorToast("You have not selected any payment channel");
            return;
        }

        if (cartItems.length === 0) {
            errorToast("Your cart is empty");
            return;
        }

        const firstProduct = cartItems[0];
        const paymentRequest: PaymentRequest = {
            amount: summaryData?.sum,
            channel: [selectedChannel],
            quantity: firstProduct?.quantity,
            productId: firstProduct?.productId,
            vendorId: firstProduct?.vendorId,
            email: firstProduct?.vendorId,
            narration: "Great Product",
            productCategoryName: firstProduct?.category,
        };

        try {
            setIsLoadingOrder(true);
            const apiResponse = await fetch(`${baseUrL}/initialize-payment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify(paymentRequest)
            })

            let res: any = await apiResponse.json();
            const redirect = res?.data?.authorization_url;
            successToast(res.status && "Order initialized successfully");
            if (redirect) {
                window.location.href = redirect;
                router.push(redirect);
            } else {
                console.warn("No authorizationUrl returned", res);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to initialize payment");
        } finally {
            setIsLoadingOrder(false);
        }
    };

    return (
        <div className="p-3 md:p-6 lg:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8">Shopping Cart</h1>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Cart Items - Mobile optimized */}
                    <div className="lg:col-span-2 bg-white shadow-sm rounded-lg overflow-hidden">
                        {/* Desktop Table */}
                        <table className="hidden md:table w-full text-sm text-gray-600">
                            <thead className="uppercase text-xs text-gray-500 border-b">
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
                                    <tr key={product.productId + product.measurementTag + product.sleeveType + product.color} className="hover:bg-gray-50 border-b">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                                                {product.productImage ? (
                                                    <img
                                                        src={product.productImage === null ? "/images/placeholder-product.png" : product.productImage}
                                                        alt={product.name}
                                                        className="object-contain h-full"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-gray-400">No image</div>
                                                )}
                                            </div>
                                            <div className="text-sm md:text-base">{product.name}</div>
                                        </td>
                                        <td className="p-2 text-center">{formatNumberToNaira(product.price)}</td>
                                        <td className="p-2 text-center">
                                            <div className="inline-flex border rounded items-center">
                                                <button
                                                    onClick={() => handleRemoveCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-1 md:p-2 w-8 h-8 flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                <div className="px-2 md:px-4 text-sm md:text-base">{product.quantity}</div>
                                                <button
                                                    onClick={() => handleAddCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-1 md:p-2 w-8 h-8 flex items-center justify-center"
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
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                    title="Remove item"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2 text-center text-xs md:text-sm">{product.measurementTag}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            Your cart is empty
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 p-4">
                            {cartItems.length > 0 ? cartItems.map((product: CartProduct) => (
                                <div key={product.productId + product.measurementTag + product.sleeveType + product.color} className="bg-white border rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                                                {product.productImage ? (
                                                    <img
                                                        src={product.productImage === null ? "/images/placeholder-product.png" : product.productImage}
                                                        alt={product.name}
                                                        className="object-contain h-full"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-gray-400">No image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                                                <p className="text-green-600 font-semibold text-sm mt-1">
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
                                        <span className="text-xs text-gray-500">Quantity:</span>
                                        <div className="inline-flex border rounded items-center">
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
                                        <span className="text-xs text-gray-500">Total:</span>
                                        <span className="font-semibold text-sm">
                                            {formatNumberToNaira(product.amountByQuantity ?? product.amount * product.quantity)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">Tag:</span>
                                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
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
                                <div className="text-center text-gray-500 py-8">
                                    Your cart is empty
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between p-4 border-t gap-3">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-4 py-3 bg-gray-100 rounded uppercase text-xs font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Continue shopping
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="px-4 py-3 bg-gray-100 rounded uppercase text-xs font-medium hover:bg-gray-200 transition-colors"
                                    disabled={clearCartLoading}
                                >
                                    {clearCartLoading ? "Clearing..." : "Clear shopping cart"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary - Mobile optimized */}
                    <aside className="space-y-6">
                        <div className="p-4 bg-gray-50 border rounded-lg">
                            <h2 className="text-lg font-semibold mb-3">Apply Discount Code</h2>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 p-3 border rounded text-sm" 
                                    placeholder="Enter discount code" 
                                />
                                <button className="px-2 py-3 bg-black text-white rounded text-[12px] font-medium hover:bg-gray-800 transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-600">Subtotal</div>
                                    <div className="font-semibold">{formatNumberToNaira(summaryData?.sum)}</div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="text-gray-500">Tax</div>
                                    <div className="text-gray-500">0.00</div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <div className="text-lg font-semibold">Order Total</div>
                                    <div className="text-lg font-semibold text-green-600">
                                        {formatNumberToNaira(sumCartAmount)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-semibold mb-3">Payment Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="channel"
                                            value="card"
                                            checked={selectedChannel === "card"}
                                            onChange={(e) => setSelectedChannel(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span>Credit/Debit Card</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="channel"
                                            value="ussd"
                                            checked={selectedChannel === "ussd"}
                                            onChange={(e) => setSelectedChannel(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span>USSD</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="channel"
                                            value="transfer"
                                            checked={selectedChannel === "transfer"}
                                            onChange={(e) => setSelectedChannel(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span>Bank Transfer</span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-center text-xs uppercase text-gray-400 border-t pt-4 mt-4">
                                Check out with a different address
                            </div>

                            <button
                                type="button"
                                disabled={isLoadingOrder || cartItems.length === 0}
                                onClick={goToOrderPage}
                                className="w-full mt-4 py-4 bg-black text-white rounded-lg flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium"
                            >
                                <span>Proceed to checkout</span>
                                {isLoadingOrder && <span className="w-4 h-4 border-2 border-white rounded-full animate-spin" />}
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}