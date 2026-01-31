"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFetch } from "@/hooks/useFetch";
import { baseUrL } from "@/env/URLs";
import { errorToast, successToast } from "@/hooks/UseToast";
import { formatNumberToNaira } from "@/app/utils/moneyUtils";

type Address = {
    id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
};

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

type OrderRequest = {
    addressId: string;
    shippingMethod: string;
    deliveryInstructions?: string;
    cartItems: CartProduct[];
    totalAmount: number;
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
    addressId: string;
    shippingMethod: string;
};

export default function OrderSummaryPage() {
    const router = useRouter();
    const [orderRequest, setOrderRequest] = useState<OrderRequest | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);

    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken;
    const user = getUserDetails();

    // Fetch addresses
    const {
        data: addressesData,
        isLoading: addressesLoading,
        callApi: fetchAddresses
    } = useFetch("GET", null, `${baseUrL}/addresses`);

    useEffect(() => {
        // Get order request from localStorage
        const storedOrderRequest = localStorage.getItem('orderRequest');
        if (storedOrderRequest) {
            const parsedRequest = JSON.parse(storedOrderRequest);
            console.log("Parsed Order Request:", parsedRequest);
            setOrderRequest(parsedRequest);
        } else {
            console.log("No order request found in localStorage");
            // If no order request, redirect to cart
            errorToast("No order found. Please start again.");
            router.push('/cart');
        }

        fetchAddresses();
    }, []);

    useEffect(() => {
        if (addressesData && orderRequest?.addressId) {
            const addresses: Address[] = addressesData?.data || addressesData || [];
            const address = addresses.find(addr => addr.id === orderRequest.addressId);
            if (address) {
                setSelectedAddress(address);
            } else {
                console.log("Address not found for ID:", orderRequest.addressId);
            }
        }
    }, [addressesData, orderRequest]);

    const cartItems = orderRequest?.cartItems || [];
    const shippingCost = orderRequest?.shippingMethod === "express" ? 5000 : 2000;
    const subtotal = orderRequest?.totalAmount || 0;
    const grandTotal = subtotal + shippingCost;

    const handleInitializePayment = async () => {
        // if (!selectedChannel) {
        //     errorToast("Please select a payment method");
        //     return;
        // }

        if (!orderRequest?.addressId) {
            errorToast("No address selected");
            return;
        }

        if (cartItems.length === 0) {
            errorToast("Your cart is empty");
            return;
        }

        const firstProduct = cartItems[0];
        const paymentRequest: PaymentRequest = {
            amount: grandTotal,
            channel: [selectedChannel],
            quantity: firstProduct?.quantity,
            productId: firstProduct?.productId,
            vendorId: firstProduct?.vendorId,
            email: user?.emailAddress || firstProduct?.vendorId,
            narration: "Order Payment",
            productCategoryName: firstProduct?.category,
            addressId: orderRequest.addressId,
            shippingMethod: orderRequest.shippingMethod
        };

        try {
            setIsLoadingPayment(true);
            const apiResponse = await fetch(`${baseUrL}/initialize-payment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify(paymentRequest)
            });

            let res: any = await apiResponse.json();
            const redirect = res?.data?.authorization_url;
            
            if (res.status) {
                successToast("Payment initialized successfully");
                if (redirect) {
                    window.location.href = redirect;
                } else {
                    console.warn("No authorizationUrl returned", res);
                    errorToast("Payment initialization failed");
                }
            } else {
                errorToast(res.message || "Failed to initialize payment");
            }
        } catch (err) {
            console.error(err);
            errorToast("Failed to initialize payment");
        } finally {
            setIsLoadingPayment(false);
        }
    };

    const handleEditOrder = () => {
        router.push('/order-request');
    };

    const calculateItemTotal = (item: CartProduct) => {
        return item.amountByQuantity || (item.amount * item.quantity);
    };

    if (!orderRequest) {
        return (
            <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin mx-auto mb-4" />
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-center text-2xl font-semibold">Order Summary</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <section className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Shipping Address</h2>
                                <button 
                                    onClick={handleEditOrder}
                                    className="text-sm text-gray-500 hover:text-black"
                                >
                                    ✎ Edit
                                </button>
                            </div>
                            {selectedAddress ? (
                                <div>
                                    <p className="font-medium">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                    <p className="text-gray-600">{selectedAddress.street}</p>
                                    <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state}</p>
                                    <p className="text-gray-600">{selectedAddress.country} - {selectedAddress.postalCode}</p>
                                    <p className="text-gray-600">{selectedAddress.phoneNumber}</p>
                                    {orderRequest.deliveryInstructions && (
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm font-medium">Delivery Instructions:</p>
                                            <p className="text-sm text-gray-600">{orderRequest.deliveryInstructions}</p>
                                        </div>
                                    )}
                                </div>
                            ) : addressesLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin" />
                                </div>
                            ) : (
                                <p className="text-gray-500">Address not found</p>
                            )}
                        </section>

                        {/* Shipping Method */}
                        <section className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Shipping Method</h2>
                                <button 
                                    onClick={handleEditOrder}
                                    className="text-sm text-gray-500 hover:text-black"
                                >
                                    ✎ Edit
                                </button>
                            </div>
                            <p className="capitalize font-medium">
                                {orderRequest.shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                {orderRequest.shippingMethod === "express" 
                                    ? "Delivery in 2-3 business days" 
                                    : "Delivery in 5-7 business days"}
                            </p>
                            <p className="font-semibold mt-2">
                                {orderRequest.shippingMethod === "express" ? "₦5,000" : "₦2,000"}
                            </p>
                        </section>

                        {/* Order Items */}
                        <section className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-6">Order Items</h2>
                            
                            {cartItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No items in order</p>
                                    <button
                                        onClick={() => router.push("/cart")}
                                        className="mt-4 px-4 py-2 bg-black text-white rounded text-sm"
                                    >
                                        Go to Cart
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <div key={`${item.productId}-${item.measurementTag}-${item.sleeveType}-${item.color}`} 
                                             className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b">
                                            <div className="flex-1 flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                                                    {item.productImage ? (
                                                        <img
                                                            src={item.productImage === null ? "/images/placeholder-product.png" : item.productImage}
                                                            alt={item.name}
                                                            className="object-contain h-full"
                                                        />
                                                    ) : (
                                                        <div className="text-xs text-gray-400">No image</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600">Color:</span>
                                                            <div 
                                                                className="w-4 h-4 rounded border"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-gray-600">Size: {item.measurementTag}</span>
                                                        <span className="text-sm text-gray-600">Sleeve: {item.sleeveType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between md:justify-end items-center gap-8">
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatNumberToNaira(item.price || item.amount)}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatNumberToNaira(calculateItemTotal(item))}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Payment Method Selection */}
                        {/* <section className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={selectedChannel === "card"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <p className="font-medium">Credit/Debit Card</p>
                                        <p className="text-sm text-gray-600">Pay with your card</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="ussd"
                                        checked={selectedChannel === "ussd"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <p className="font-medium">USSD</p>
                                        <p className="text-sm text-gray-600">Pay via USSD code</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="transfer"
                                        checked={selectedChannel === "transfer"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5"
                                    />
                                    <div>
                                        <p className="font-medium">Bank Transfer</p>
                                        <p className="text-sm text-gray-600">Transfer directly to our bank account</p>
                                    </div>
                                </label>
                            </div>
                        </section> */}
                    </div>

                    {/* Right Column - Order Summary & Payment */}
                    <aside className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{formatNumberToNaira(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">
                                        {formatNumberToNaira(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatNumberToNaira(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleInitializePayment}
                                disabled={isLoadingPayment || cartItems.length === 0 }
                                className="w-full mt-6 py-4 bg-black text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-3"
                            >
                                {isLoadingPayment ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white rounded-full animate-spin" />
                                        Initializing Payment...
                                    </>
                                ) : (
                                    "Pay with PayStack"
                                )}
                            </button>

                            <button
                                onClick={handleEditOrder}
                                className="w-full mt-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Edit Order
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}