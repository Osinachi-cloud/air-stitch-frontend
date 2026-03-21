// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from 'next/navigation';
// import { useLocalStorage } from "@/hooks/useLocalStorage";
// import { useFetch } from "@/hooks/useFetch";
// import { baseUrL } from "@/env/URLs";
// import { errorToast, successToast } from "@/hooks/UseToast";
// import { formatNumberToNaira } from "@/app/utils/moneyUtils";
// import { usePost } from "@/hooks/usePost";

// type Address = {
//     id: string;
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     postalCode: string;
//     phoneNumber: string;
//     firstName: string;
//     lastName: string;
// };

// type CartProduct = {
//     productId: string;
//     vendorId?: string;
//     name: string;
//     productImage?: string;
//     amount: number;
//     quantity: number;
//     amountByQuantity?: number;
//     category?: string;
//     color: string;
//     sleeveType: string;
//     measurementTag: string;
//     price: number;
// };

// type OrderRequest = {
//     addressId: string;
//     shippingMethod: string;
//     deliveryInstructions?: string;
//     cartItems: CartProduct[];
//     totalAmount: number;
// };

// type PaymentRequest = {
//     amount: number;
//     channel: string[];
//     quantity?: number;
//     productId?: string;
//     vendorId?: string;
//     email?: string;
//     narration?: string;
//     productCategoryName?: string;
//     addressId: string | undefined;
//     shippingMethod: string | undefined;
// };

// export default function OrderSummaryPage() {
//     const router = useRouter();
//     const [orderRequest, setOrderRequest] = useState<OrderRequest | null>(null);
//     const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
//     const [selectedChannel, setSelectedChannel] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);

//     const { getUserDetails } = useLocalStorage("userDetails", null);
//     const token = getUserDetails()?.accessToken;
//     const user = getUserDetails();

//     // Fetch addresses
//     const {
//         data: addressesData,
//         isLoading: addressesLoading,
//         callApi: fetchAddresses
//     } = useFetch("GET", null, `${baseUrL}/addresses`);

//     const {
//         data: cartData,
//         isLoading: cartLoading,
//         callApi: fetchCart
//     } = useFetch("GET", null, `${baseUrL}/get-cart?page=0&size=30`);

//     const {
//         data: summaryData,
//         isLoading: summaryLoading,
//         callApi: fetchSummary
//     } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

//     useEffect(() => {
//         if (addressesData && orderRequest?.addressId) {
//             const addresses: Address[] = addressesData?.data || addressesData || [];
//             const address = addresses.find(addr => addr.id === orderRequest.addressId);
//             if (address) {
//                 setSelectedAddress(address);
//             } else {
//                 console.log("Address not found for ID:", orderRequest.addressId);
//             }
//         }
//     }, [addressesData, orderRequest]);

//     const cartItems = cartData?.data || [];
//     const shippingCost = orderRequest?.shippingMethod === "express" ? 5000 : 2000;
//     const subtotal = summaryData?.sum || 0;
//     const grandTotal = subtotal + shippingCost;

//     const handleInitializePayment = async () => {
//         // if (!selectedChannel) {
//         //     errorToast("Please select a payment method");
//         //     return;
//         // }

//         // if (!orderRequest?.addressId) {
//         //     errorToast("No address selected");
//         //     return;
//         // }

//         if (cartItems.length === 0) {
//             errorToast("Your cart is empty");
//             return;
//         }

//         const firstProduct = cartItems[0];
//         const paymentRequest: PaymentRequest = {
//             amount: grandTotal,
//             channel: [selectedChannel],
//             quantity: firstProduct?.quantity,
//             productId: firstProduct?.productId,
//             vendorId: firstProduct?.vendorId,
//             email: user?.emailAddress || firstProduct?.vendorId,
//             narration: "Order Payment",
//             productCategoryName: firstProduct?.category,
//             addressId: orderRequest?.addressId,
//             shippingMethod: orderRequest?.shippingMethod
//         };

//         try {
//             setIsLoadingPayment(true);
//             const apiResponse = await fetch(`${baseUrL}/initialize-payment`, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 credentials: "include",
//                 body: JSON.stringify(paymentRequest)
//             });

//             let res: any = await apiResponse.json();
//             const redirect = res?.data?.authorization_url;

//             if (res.status) {
//                 successToast("Payment initialized successfully");
//                 if (redirect) {
//                     window.location.href = redirect;
//                     handleClearCart();
//                 } else {
//                     console.warn("No authorizationUrl returned", res);
//                     errorToast("Payment initialization failed");
//                 }
//             } else {
//                 errorToast(res.message || "Failed to initialize payment");
//             }
//         } catch (err) {
//             console.error(err);
//             errorToast("Failed to initialize payment");
//         } finally {
//             setIsLoadingPayment(false);
//         }
//     };

//     const {
//         callApi: clearCart,
//         isLoading: clearCartLoading
//     } = usePost("PUT", null, `${baseUrL}/clear-cart`, null);

//     const handleClearCart = async () => {
//         try {
//             await clearCart();
//         } catch (err) {
//             console.error('Error clearing cart:', err);
//         }
//     };

//     const handleEditOrder = () => {
//         router.push('/order-request');
//     };

//     const calculateItemTotal = (item: CartProduct) => {
//         return item.amountByQuantity || (item.amount * item.quantity);
//     };

//     if (cartLoading && addressesLoading) {
//         return (
//             <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin mx-auto mb-4" />
//                     <p>Loading order details...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#f4f6f8] px-4 py-6 md:px-10">
//             <div className="mx-auto max-w-7xl">
//                 <h1 className="mb-8 text-center text-2xl font-semibold">Order Summary</h1>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Left Column - Order Details */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Shipping Address */}
//                         <section className="rounded-lg bg-white p-6 shadow-sm">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-lg font-semibold">Shipping Address</h2>
//                                 <button
//                                     onClick={handleEditOrder}
//                                     className="text-sm text-gray-500 hover:text-black"
//                                 >
//                                     ✎ Edit
//                                 </button>
//                             </div>
//                             {addressesData ? (
//                                 <div>
//                                     <p className="font-medium">{addressesData[0]?.firstName} {addressesData[0]?.lastName}</p>
//                                     <p className="text-gray-600">{addressesData[0]?.street}</p>
//                                     <p className="text-gray-600">{addressesData[0]?.city}, {addressesData[0]?.state}</p>
//                                     <p className="text-gray-600">{addressesData[0]?.country} - {addressesData[0]?.postalCode}</p>
//                                     <p className="text-gray-600">{addressesData[0]?.phoneNumber}</p>
//                                     {orderRequest?.deliveryInstructions && (
//                                         <div className="mt-3 pt-3 border-t">
//                                             <p className="text-sm font-medium">Delivery Instructions:</p>
//                                             <p className="text-sm text-gray-600">{orderRequest.deliveryInstructions}</p>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : addressesLoading ? (
//                                 <div className="flex justify-center py-4">
//                                     <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin" />
//                                 </div>
//                             ) : (
//                                 <p className="text-gray-500">Address not found</p>
//                             )}
//                         </section>

//                         {/* Shipping Method */}
//                         <section className="rounded-lg bg-white p-6 shadow-sm">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h2 className="text-lg font-semibold">Shipping Method</h2>
//                                 <button
//                                     onClick={handleEditOrder}
//                                     className="text-sm text-gray-500 hover:text-black"
//                                 >
//                                     ✎ Edit
//                                 </button>
//                             </div>
//                             <p className="capitalize font-medium">
//                                 {orderRequest?.shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"}
//                             </p>
//                             <p className="text-gray-600 text-sm mt-1">
//                                 {orderRequest?.shippingMethod === "express"
//                                     ? "Delivery in 2-3 business days"
//                                     : "Delivery in 5-7 business days"}
//                             </p>
//                             <p className="font-semibold mt-2">
//                                 {orderRequest?.shippingMethod === "express" ? "₦5,000" : "₦2,000"}
//                             </p>
//                         </section>

//                         {/* Order Items */}
//                         <section className="rounded-lg bg-white p-6 shadow-sm">
//                             <h2 className="text-lg font-semibold mb-6">Order Items</h2>

//                             {cartItems.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <p className="text-gray-500">No items in order</p>
//                                     <button
//                                         onClick={() => router.push("/cart")}
//                                         className="mt-4 px-4 py-2 bg-black text-white rounded text-sm"
//                                     >
//                                         Go to Cart
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-6">
//                                     {cartItems && cartItems?.map((item: any) => (
//                                         <div key={`${item.productId}-${item.measurementTag}-${item.sleeveType}-${item.color}`}
//                                             className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b">
//                                             <div className="flex-1 flex gap-4">
//                                                 <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
//                                                     {item.productImage ? (
//                                                         <img
//                                                             src={item.productImage === null ? "/images/placeholder-product.png" : item.productImage}
//                                                             alt={item.name}
//                                                             className="object-contain h-full"
//                                                         />
//                                                     ) : (
//                                                         <div className="text-xs text-gray-400">No image</div>
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="font-medium">{item.name}</p>
//                                                     <div className="flex items-center gap-3 mt-2">
//                                                         <div className="flex items-center gap-1">
//                                                             <span className="text-sm text-gray-600">Color:</span>
//                                                             <div
//                                                                 className="w-4 h-4 rounded border"
//                                                                 style={{ backgroundColor: item.color }}
//                                                             />
//                                                         </div>
//                                                         <span className="text-sm text-gray-600">Size: {item.measurementTag}</span>
//                                                         <span className="text-sm text-gray-600">Sleeve: {item.sleeveType}</span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex justify-between md:justify-end items-center gap-8">
//                                                 <div className="text-right">
//                                                     <p className="font-semibold">{formatNumberToNaira(item.price || item.amount)}</p>
//                                                     <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <p className="font-semibold">{formatNumberToNaira(calculateItemTotal(item))}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </section>

//                         {/* Payment Method Selection */}
//                         {/* <section className="rounded-lg bg-white p-6 shadow-sm">
//                             <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
//                             <div className="space-y-3">
//                                 <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                     <input
//                                         type="radio"
//                                         name="paymentMethod"
//                                         value="card"
//                                         checked={selectedChannel === "card"}
//                                         onChange={(e) => setSelectedChannel(e.target.value)}
//                                         className="w-5 h-5"
//                                     />
//                                     <div>
//                                         <p className="font-medium">Credit/Debit Card</p>
//                                         <p className="text-sm text-gray-600">Pay with your card</p>
//                                     </div>
//                                 </label>
//                                 <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                     <input
//                                         type="radio"
//                                         name="paymentMethod"
//                                         value="ussd"
//                                         checked={selectedChannel === "ussd"}
//                                         onChange={(e) => setSelectedChannel(e.target.value)}
//                                         className="w-5 h-5"
//                                     />
//                                     <div>
//                                         <p className="font-medium">USSD</p>
//                                         <p className="text-sm text-gray-600">Pay via USSD code</p>
//                                     </div>
//                                 </label>
//                                 <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                     <input
//                                         type="radio"
//                                         name="paymentMethod"
//                                         value="transfer"
//                                         checked={selectedChannel === "transfer"}
//                                         onChange={(e) => setSelectedChannel(e.target.value)}
//                                         className="w-5 h-5"
//                                     />
//                                     <div>
//                                         <p className="font-medium">Bank Transfer</p>
//                                         <p className="text-sm text-gray-600">Transfer directly to our bank account</p>
//                                     </div>
//                                 </label>
//                             </div>
//                         </section> */}
//                     </div>

//                     {/* Right Column - Order Summary & Payment */}
//                     <aside className="space-y-6">
//                         <div className="rounded-lg bg-white p-6 shadow-sm">
//                             <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

//                             <div className="space-y-3">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Subtotal</span>
//                                     <span className="font-semibold">{formatNumberToNaira(subtotal)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Shipping</span>
//                                     <span className="font-semibold">
//                                         {formatNumberToNaira(shippingCost)}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between pt-3 border-t text-lg font-bold">
//                                     <span>Total</span>
//                                     <span>{formatNumberToNaira(grandTotal)}</span>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleInitializePayment}
//                                 disabled={isLoadingPayment || cartItems.length === 0}
//                                 className="w-full mt-6 py-4 bg-black text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-3"
//                             >
//                                 {isLoadingPayment ? (
//                                     <>
//                                         <div className="w-5 h-5 border-2 border-white rounded-full animate-spin" />
//                                         Initializing Payment...
//                                     </>
//                                 ) : (
//                                     "Pay with PayStack"
//                                 )}
//                             </button>

//                             <button
//                                 onClick={handleEditOrder}
//                                 className="w-full mt-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                             >
//                                 Edit Order
//                             </button>
//                         </div>
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// }












"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFetch } from "@/hooks/useFetch";
import { baseUrL, NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY } from "@/env/URLs";
import { errorToast, successToast } from "@/hooks/UseToast";
import { formatNumberToNaira } from "@/app/utils/moneyUtils";
import { usePost } from "@/hooks/usePost";

// Add Paystack type declaration
declare global {
  interface Window {
    PaystackPop: any;
  }
}

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
    email?: string;
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
    email?: string | number | boolean;
    narration?: string;
    productCategoryName?: string;
    addressId: string | undefined;
    shippingMethod: string | undefined;
};

export default function OrderSummaryPage() {
    const router = useRouter();
    const [orderRequest, setOrderRequest] = useState<OrderRequest | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<string>("card");
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

    const {
        data: cartData,
        isLoading: cartLoading,
        callApi: fetchCart
    } = useFetch("GET", null, `${baseUrL}/get-cart?page=0&size=30`);

    const {
        data: summaryData,
        isLoading: summaryLoading,
        callApi: fetchSummary
    } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

    // Load Paystack script
    useEffect(() => {
        // Check if script already exists
        if (!document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.body.appendChild(script);
        }
        
        return () => {
            // Don't remove the script as it might be needed for other pages
        };
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

    // Load order request from localStorage
    useEffect(() => {
        const storedOrderRequest = localStorage.getItem('orderRequest');
        if (storedOrderRequest) {
            try {
                const parsed = JSON.parse(storedOrderRequest);
                setOrderRequest(parsed);
            } catch (err) {
                console.error('Error parsing order request:', err);
            }
        } else {
            // Redirect to order request page if no order data
            router.push('/order-request');
        }
    }, [router]);

    const cartItems = cartData?.data || [];
    const shippingCost = orderRequest?.shippingMethod === "express" ? 5000 : 2000;
    const subtotal = summaryData?.sum || 0;
    const grandTotal = subtotal + shippingCost;

    // Handle Paystack popup payment
    const handlePaystackPayment = async () => {
        // Check if Paystack is loaded
        if (typeof window === 'undefined') {
            errorToast("Payment system is loading. Please try again.");
            return;
        }

        // Wait for Paystack to be available
        if (!window.PaystackPop) {
            errorToast("Payment system is loading. Please wait and try again.");
            return;
        }

        // Check for public key
        const publicKey = NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            errorToast("Payment configuration error. Please contact support.");
            console.error("Paystack public key is missing or invalid");
            return;
        }

        if (cartItems.length === 0) {
            errorToast("Your cart is empty");
            return;
        }

        if (!orderRequest?.addressId) {
            errorToast("No address selected");
            return;
        }

        // Get user email
        const email = user?.emailAddress || selectedAddress?.email;
        if (!email) {
            errorToast("Email address is required for payment");
            return;
        }

        setIsLoadingPayment(true);
        
        try {
            // Initialize payment on your backend to get the reference
            const firstProduct = cartItems[0];
            const paymentRequest: PaymentRequest = {
                amount: grandTotal,
                channel: [selectedChannel],
                quantity: firstProduct?.quantity,
                productId: firstProduct?.productId,
                vendorId: firstProduct?.vendorId,
                email: email,
                narration: "Order Payment",
                productCategoryName: firstProduct?.category,
                addressId: orderRequest?.addressId,
                shippingMethod: orderRequest?.shippingMethod
            };

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
            
            if (!res.status) {
                errorToast(res.message || "Failed to initialize payment");
                setIsLoadingPayment(false);
                return;
            }

            // Get the reference from your backend response
            const reference = res.data?.reference;
            
            if (!reference) {
                errorToast("Payment reference not found");
                setIsLoadingPayment(false);
                return;
            }

            // Open Paystack popup with the reference from your backend
            const handler = window.PaystackPop.setup({
                key: publicKey,
                email: email,
                amount: grandTotal * 100, // Paystack expects amount in kobo
                currency: 'NGN',
                ref: reference,
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: `${selectedAddress?.firstName || ''} ${selectedAddress?.lastName || ''}`
                        },
                        {
                            display_name: "Cart Items Count",
                            variable_name: "cart_items_count",
                            value: cartItems.length.toString()
                        },
                        {
                            display_name: "Shipping Method",
                            variable_name: "shipping_method",
                            value: orderRequest?.shippingMethod || ""
                        },
                        {
                            display_name: "Address ID",
                            variable_name: "address_id",
                            value: orderRequest?.addressId || ""
                        }
                    ]
                },
                callback: function(response: any) {
                    console.log('Payment callback received:', response);
                    // Payment successful - your backend already has the webhook
                    successToast("Payment successful! Your order has been placed.");
                    
                    // Clear cart
                    handleClearCart();
                    
                    // Clear order request from localStorage
                    localStorage.removeItem('orderRequest');
                    
                    // Redirect to success page
                    router.push(`/payment-success?reference=${response.reference}`);
                    setIsLoadingPayment(false);
                },
                onClose: function() {
                    console.log('Payment onClose triggered');
                    errorToast("Payment cancelled");
                    setIsLoadingPayment(false);
                }
            });
            
            handler.openIframe();
        } catch (err) {
            console.error('Payment initialization error:', err);
            errorToast("Failed to initialize payment");
            setIsLoadingPayment(false);
        }
    };

    const {
        callApi: clearCart,
        isLoading: clearCartLoading
    } = usePost("PUT", null, `${baseUrL}/clear-cart`, null);

    const handleClearCart = async () => {
        try {
            await clearCart();
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const handleEditOrder = () => {
        router.push('/order-request');
    };

    const calculateItemTotal = (item: CartProduct) => {
        return item.amountByQuantity || (item.amount * item.quantity);
    };

    if (cartLoading || addressesLoading || summaryLoading) {
        return (
            <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-center text-2xl font-semibold text-gray-800">Order Summary</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
                                <button
                                    onClick={handleEditOrder}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    ✎ Edit
                                </button>
                            </div>
                            {selectedAddress ? (
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-800">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                    <p className="text-gray-600">{selectedAddress.street}</p>
                                    <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state}</p>
                                    <p className="text-gray-600">{selectedAddress.country} - {selectedAddress.postalCode}</p>
                                    <p className="text-gray-600">{selectedAddress.phoneNumber}</p>
                                    {orderRequest?.deliveryInstructions && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <p className="text-sm font-medium text-gray-700">Delivery Instructions:</p>
                                            <p className="text-sm text-gray-600">{orderRequest.deliveryInstructions}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">No address selected</p>
                            )}
                        </section>

                        {/* Shipping Method */}
                        <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Shipping Method</h2>
                                <button
                                    onClick={handleEditOrder}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    ✎ Edit
                                </button>
                            </div>
                            <p className="capitalize font-medium text-gray-800">
                                {orderRequest?.shippingMethod === "express" ? "Express Shipping" : "Standard Shipping"}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                {orderRequest?.shippingMethod === "express"
                                    ? "Delivery in 2-3 business days"
                                    : "Delivery in 5-7 business days"}
                            </p>
                            <p className="font-semibold text-gray-800 mt-2">
                                {orderRequest?.shippingMethod === "express" ? "₦5,000" : "₦2,000"}
                            </p>
                        </section>

                        {/* Order Items */}
                        <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Items</h2>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No items in order</p>
                                    <button
                                        onClick={() => router.push("/cart")}
                                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                                    >
                                        Go to Cart
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item: any) => (
                                        <div key={`${item.productId}-${item.measurementTag}-${item.sleeveType}-${item.color}`}
                                            className="flex flex-col md:flex-row md:items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                            <div className="flex-1 flex gap-4">
                                                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden border border-gray-100">
                                                    {item.productImage ? (
                                                        <img
                                                            src={item.productImage === null ? "/images/placeholder-product.png" : item.productImage}
                                                            alt={item.name}
                                                            className="object-contain h-full w-full"
                                                        />
                                                    ) : (
                                                        <div className="text-xs text-gray-400">No image</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600">Color:</span>
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
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
                                                    <p className="font-semibold text-gray-800">{formatNumberToNaira(item.price || item.amount)}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-800">{formatNumberToNaira(calculateItemTotal(item))}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Payment Method Selection */}
                        <section className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={selectedChannel === "card"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5 text-black"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Credit/Debit Card</p>
                                        <p className="text-sm text-gray-600">Pay with your card</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="ussd"
                                        checked={selectedChannel === "ussd"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5 text-black"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">USSD</p>
                                        <p className="text-sm text-gray-600">Pay via USSD code</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="transfer"
                                        checked={selectedChannel === "transfer"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                        className="w-5 h-5 text-black"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Bank Transfer</p>
                                        <p className="text-sm text-gray-600">Transfer directly to our bank account</p>
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Order Summary & Payment */}
                    <aside className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">{formatNumberToNaira(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-gray-800">
                                        {formatNumberToNaira(shippingCost)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold">
                                    <span className="text-gray-800">Total</span>
                                    <span className="text-gray-900">{formatNumberToNaira(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePaystackPayment}
                                disabled={isLoadingPayment || cartItems.length === 0 || !selectedAddress}
                                className="w-full mt-6 py-4 bg-black text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-3"
                            >
                                {isLoadingPayment ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Pay with PayStack"
                                )}
                            </button>

                            <button
                                onClick={handleEditOrder}
                                className="w-full mt-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                            >
                                Edit Order
                            </button>

                            {!selectedAddress && (
                                <p className="text-sm text-red-500 mt-3 text-center">
                                    Please select an address to continue
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}