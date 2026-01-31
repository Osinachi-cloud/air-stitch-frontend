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
    isDefault: boolean;
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

export default function CheckoutPage() {
    const router = useRouter();
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [showNewAddress, setShowNewAddress] = useState<boolean>(false);
    const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
    const [shippingMethod, setShippingMethod] = useState<string>("standard");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartProduct[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    
    // New address form state
    const [newAddress, setNewAddress] = useState({
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        state: "",
        country: "Nigeria",
        postalCode: "",
        phoneNumber: "",
        isDefault: false
    });

    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken;

    // Fetch addresses
    const {
        data: addressesData,
        isLoading: addressesLoading,
        callApi: fetchAddresses
    } = useFetch("GET", null, `${baseUrL}/addresses`);

    // Fetch cart data
    const {
        data: cartData,
        isLoading: cartLoading,
        callApi: fetchCart
    } = useFetch("GET", null, `${baseUrL}/get-cart?page=0&size=30`);

    // Fetch cart summary
    const {
        data: summaryData,
        isLoading: summaryLoading,
        callApi: fetchSummary
    } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

    useEffect(() => {
        fetchAddresses();
        fetchCart();
        fetchSummary();
    }, []);

    useEffect(() => {
        if (cartData) {
            const items = 
                cartData.data?.items || 
                cartData.items || 
                cartData.data || 
                cartData || 
                [];
            
            setCartItems(items);
        }
        
        if (summaryData) {
            const total = 
                summaryData.total ||
                summaryData.sum ||
                summaryData.data?.total ||
                summaryData.data?.sum ||
                summaryData?.data ||
                0;
            
            setTotalAmount(total);
        }
    }, [cartData, summaryData]);

    const addresses: Address[] = addressesData?.data || addressesData || [];

    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setNewAddress({
                ...newAddress,
                [name]: (e.target as HTMLInputElement).checked
            });
        } else {
            setNewAddress({
                ...newAddress,
                [name]: value
            });
        }
    };

    const handleCreateAddress = async (): Promise<string | null> => {
        try {
            const response = await fetch(`${baseUrL}/addresses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            });

            const data = await response.json();
            if (response.ok) {
                successToast("Address created successfully");
                return data.id || data.data?.id;
            } else {
                errorToast(data.message || "Failed to create address");
                return null;
            }
        } catch (error) {
            console.error("Error creating address:", error);
            errorToast("Error creating address");
            return null;
        }
    };

    const handleProceedToReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let addressId = selectedAddress;

            // If no existing address selected and new address is shown, create new address
            if (!selectedAddress && showNewAddress) {
                // Validate new address fields
                const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
                const missingFields = requiredFields.filter(field => !newAddress[field as keyof typeof newAddress]);
                
                if (missingFields.length > 0) {
                    errorToast(`Please fill in all required fields: ${missingFields.join(', ')}`);
                    setIsLoading(false);
                    return;
                }

                const newAddressId = await handleCreateAddress();
                if (!newAddressId) {
                    setIsLoading(false);
                    return;
                }
                addressId = newAddressId;
            }

            if (!addressId) {
                errorToast("Please select or create an address");
                setIsLoading(false);
                return;
            }

            // Create order request object with all necessary data
            const orderRequest: OrderRequest = {
                addressId,
                shippingMethod,
                deliveryInstructions,
                cartItems,
                totalAmount: calculateTotalFromItems()
            };

            // Store order request in localStorage for order summary page
            localStorage.setItem('orderRequest', JSON.stringify(orderRequest));
            
            // Navigate to order summary
            router.push('/order-summary');

        } catch (error) {
            console.error("Error processing order:", error);
            errorToast("Error processing order");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectExistingAddress = (addressId: string) => {
        console.log("address id ===>", addressId )
        setSelectedAddress(addressId);
        setShowNewAddress(false);
    };

    const handleUseNewAddress = () => {
        setShowNewAddress(true);
        setSelectedAddress("");
    };

    // Function to handle quantity changes
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

    const handleClearCart = async () => {
        try {
            const response = await fetch(`${baseUrL}/clear-cart`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                await fetchCart();
                await fetchSummary();
                successToast("Cart cleared successfully");
            }
        } catch (err) {
            console.error('Error clearing cart:', err);
            errorToast("Failed to clear cart");
        }
    };

    const calculateItemTotal = (item: CartProduct) => {
        return item.amountByQuantity || (item.amount * item.quantity);
    };

    const calculateTotalFromItems = () => {
        if (totalAmount > 0) return totalAmount;
        
        const calculated = cartItems.reduce((sum, item) => {
            return sum + calculateItemTotal(item);
        }, 0);
        
        return calculated;
    };

    const isLoadingOverall = addressesLoading || cartLoading || summaryLoading;

    return (
        <div className="min-h-screen bg-[#f4f6f8] px-4 py-6 md:px-10">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-center text-2xl font-semibold">Checkout</h1>

                {isLoadingOverall ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* LEFT COLUMN - Address Section */}
                        <div className="lg:col-span-2 rounded-lg py-6">
                            <h2 className="mb-6 text-sm font-semibold">Shipping Address</h2>

                            {/* Existing Addresses */}
                            {addressesLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin" />
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-sm font-medium mb-3">Select an existing address:</h3>
                                    {addresses.map((address) => (
                                        <label 
                                            key={address.id}
                                            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                                selectedAddress === address.id ? 'border-black bg-gray-50' : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={selectedAddress === address.id}
                                                onChange={() => handleSelectExistingAddress(address.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-sm">{address.firstName} {address.lastName}</p>
                                                        <p className="text-xs text-gray-600">{address.street}</p>
                                                        <p className="text-xs text-gray-600">{address.city}, {address.state}</p>
                                                        <p className="text-xs text-gray-600">{address.country} - {address.postalCode}</p>
                                                        <p className="text-xs text-gray-600">{address.phoneNumber}</p>
                                                    </div>
                                                    {address.isDefault && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleUseNewAddress}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            + Use a new address
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <p className="text-gray-500 text-sm mb-4">No saved addresses found</p>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAddress(true)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add a new address
                                    </button>
                                </div>
                            )}

                            {/* New Address Form */}
                            {showNewAddress && (
                                <div className="space-y-4 border-t pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="First Name *"
                                            name="firstName"
                                            value={newAddress.firstName}
                                            onChange={handleNewAddressChange}
                                            required
                                        />
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="Last Name *"
                                            name="lastName"
                                            value={newAddress.lastName}
                                            onChange={handleNewAddressChange}
                                            required
                                        />
                                    </div>
                                    
                                    <input 
                                        className="input bg-transparent" 
                                        placeholder="Street Address *"
                                        name="street"
                                        value={newAddress.street}
                                        onChange={handleNewAddressChange}
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="City *"
                                            name="city"
                                            value={newAddress.city}
                                            onChange={handleNewAddressChange}
                                            required
                                        />
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="State *"
                                            name="state"
                                            value={newAddress.state}
                                            onChange={handleNewAddressChange}
                                            required
                                        />
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="Postal Code"
                                            name="postalCode"
                                            value={newAddress.postalCode}
                                            onChange={handleNewAddressChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <select 
                                            className="input bg-transparent"
                                            name="country"
                                            value={newAddress.country}
                                            onChange={handleNewAddressChange}
                                        >
                                            <option>Nigeria</option>
                                        </select>
                                        
                                        <input 
                                            className="input bg-transparent" 
                                            placeholder="Phone Number *"
                                            name="phoneNumber"
                                            value={newAddress.phoneNumber}
                                            onChange={handleNewAddressChange}
                                            required
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={newAddress.isDefault}
                                            onChange={handleNewAddressChange}
                                            className="w-4 h-4"
                                        />
                                        Set as default address
                                    </label>

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowNewAddress(false)}
                                            className="text-sm text-gray-600 hover:text-black"
                                        >
                                            ← Back to address selection
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Method */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium mb-3">Shipping Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="standard"
                                            checked={shippingMethod === "standard"}
                                            onChange={(e) => setShippingMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <div>
                                            <p className="font-medium">Standard Shipping</p>
                                            <p className="text-sm text-gray-600">5-7 business days - ₦2,000</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="express"
                                            checked={shippingMethod === "express"}
                                            onChange={(e) => setShippingMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <div>
                                            <p className="font-medium">Express Shipping</p>
                                            <p className="text-sm text-gray-600">2-3 business days - ₦5,000</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Delivery Instructions */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium mb-3">Delivery Instructions (Optional)</h3>
                                <textarea
                                    rows={3}
                                    className="input resize-none bg-transparent w-full"
                                    placeholder="Any special instructions for delivery?"
                                    value={deliveryInstructions}
                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Dynamic Order Summary */}
                        <section className="col-span-3 rounded-lg bg-[#f9f9f9] p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-semibold">Order Summary</h2>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Your cart is empty</p>
                                    <button
                                        onClick={() => router.push("/")}
                                        className="mt-4 px-4 py-2 bg-black text-white rounded text-sm"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Table Header (Desktop only) */}
                                    <div className="mb-3 hidden grid-cols-4 text-xs font-semibold text-gray-500 md:grid">
                                        <span className="col-span-2">PRODUCT</span>
                                        <span>PRICE</span>
                                        <span>QUANTITY</span>
                                    </div>

                                    {/* Cart Items */}
                                    {cartItems.map((product) => (
                                        <div key={`${product.productId}-${product.measurementTag}-${product.sleeveType}-${product.color}`} 
                                             className="mb-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-4 md:items-center">
                                            <div className="flex gap-3 md:col-span-2">
                                                <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
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
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {product.name}
                                                    </p>
                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                                        <div 
                                                            className="h-5 w-5 rounded border"
                                                            style={{ backgroundColor: product.color }}
                                                            title={product.color}
                                                        />
                                                        <span className="tag">{product.sleeveType}</span>
                                                        <span className="tag">{product.measurementTag}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm">{formatNumberToNaira(product.price || product.amount)}</p>

                                            {/* Quantity */}
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => handleRemoveCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm">{product.quantity}</span>
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => handleAddCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="text-right text-sm font-semibold md:col-span-4">
                                                Total {formatNumberToNaira(calculateItemTotal(product))}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Order Total Summary */}
                                    <div className="mt-6 pt-4 border-t">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Subtotal:</span>
                                                <span className="font-semibold">{formatNumberToNaira(calculateTotalFromItems())}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Shipping:</span>
                                                <span className="font-semibold">
                                                    {shippingMethod === "express" ? "₦5,000" : "₦2,000"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t">
                                                <span className="text-sm font-medium">Total:</span>
                                                <span className="text-lg font-bold">
                                                    {formatNumberToNaira(calculateTotalFromItems() + (shippingMethod === "express" ? 5000 : 2000))}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Items:</span>
                                                <span className="text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => router.push("/")}
                                            className="btn-secondary"
                                        >
                                            CONTINUE SHOPPING
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-secondary"
                                            onClick={handleClearCart}
                                        >
                                            CLEAR SHOPPING CART
                                        </button>
                                    </div>

                                    {/* Proceed Button */}
                                    <button
                                        type="button"
                                        onClick={handleProceedToReview}
                                        disabled={isLoading || (!selectedAddress && !showNewAddress) || cartItems.length === 0}
                                        className="w-full mt-6 py-3 bg-black text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "PROCEED TO ORDER REVIEW"
                                        )}
                                    </button>
                                </>
                            )}
                        </section>
                    </div>
                )}
            </div>
            <style jsx global>{`
                .input {
                    width: 100%;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    padding: 12px;
                    font-size: 14px;
                }
                .input:focus {
                    outline: none;
                    border-color: #000;
                }
                .tag {
                    background: #f1f5f9;
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                .qty-btn {
                    border: 1px solid #d1d5db;
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .qty-btn:hover {
                    background: #f9fafb;
                }
                .btn-secondary {
                    border: 1px solid #d1d5db;
                    padding: 10px 14px;
                    border-radius: 6px;
                    font-size: 12px;
                    background: white;
                    cursor: pointer;
                }
                .btn-secondary:hover {
                    background: #f9fafb;
                }
            `}</style>
        </div>
    );
}