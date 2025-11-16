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

// Custom hook for cart operations
// const useCartOperations = () => {
//   const { callApi: addToCart } = usePost("POST", null, `${baseUrL}/add-to-cart`);
//   const { callApi: removeOneFromCart } = usePost("PUT", null, `${baseUrL}/delete-product-cart`);
//   const { callApi: removeAllFromCart } = usePost("DELETE", null, `${baseUrL}/remove-all-product-from-cart`);
//   const { callApi: addProductLike } = usePost("POST", null, `${baseUrL}/add-product-likes`);

//   return {
//     addToCart: (productId: string) => addToCart(), // Note: This won't work with current hook design
//     removeOneFromCart: (productId: string) => removeOneFromCart(),
//     removeAllFromCart: (productId: string) => removeAllFromCart(),
//     addProductLike: (productId: string) => addProductLike(),
//   };
// };

// === React / Next.js page component ===
export default function CartPage() {
    const router = useRouter();
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [sumCartAmount, setSumCartAmount] = useState<number>(0);
    const [selectedChannel, setSelectedChannel] = useState<string>("");
    const [pageRequest] = useState<PageRequest>({ page: 0, size: 30 });


    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

    const token = getUserDetails()?.accessToken



    // Use useFetch for cart data
    const {
        data: cartData,
        isLoading: cartLoading,
        error: cartError,
        callApi: fetchCart
    } = useFetch("GET", null, `${baseUrL}/get-cart?page=${pageRequest.page}&size=${pageRequest.size}`);

    // Use useFetch for cart summary
    const {
        data: summaryData,
        isLoading: summaryLoading,
        callApi: fetchSummary
    } = useFetch("GET", null, `${baseUrL}/sum-amount-by-quantity-by-customerId`);

    // For clear cart and payment - these don't need dynamic parameters
    const {
        callApi: clearCart,
        isLoading: clearCartLoading
    } = usePost("PUT", null, `${baseUrL}/clear-cart`, 'cart');

    // const {
    //     callApi: initializePayment,
    //     isLoading: paymentLoading
    // } = usePost("POST", null, `${baseUrL}/payments/initialize`);

    // Refetch cart and summary when component mounts
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

    // Extract cart items with proper typing
    const cartItems: CartProduct[] = React.useMemo(() => {
        if (!cartData) return [];
        return cartData.data?.items || cartData.items || cartData.data || [];
    }, [cartData]);

    const isLoading = cartLoading || summaryLoading;

    // Since we can't use hooks in handlers, let's use direct fetch for dynamic operations

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
          amount: summaryData?.sum ,
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
        //   const res = await initializePayment(paymentRequest);

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
            // successToast(res?.status || "Order initialized successfully");
          }
        } catch (err) {
          console.error(err);
          alert("Failed to initialize payment");
        } finally {
          setIsLoadingOrder(false);
        }
      };

    return (
        <div className="p-6 md:p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white shadow-sm rounded">
                        <table className="w-full text-sm text-gray-600">
                            <thead className="uppercase text-xs text-gray-500 border-b">
                                <tr>
                                    <th className="p-4 text-left">Product</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Quantity</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Action</th>
                                    <th className="p-4">Tag</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.length > 0 ? cartItems.map((product: CartProduct) => (
                                    <tr key={product.productId + product.measurementTag + product.sleeveType + product.color} className="hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {product.productImage ? (
                                                    <img
                                                        src={product.productImage === null ? "/images/placeholder-product.png" : product.productImage}
                                                        alt={product.name}
                                                        className="object-contain h-full rounded-4"
                                                    />
                                                ) : (
                                                    <div className="text-xs text-gray-400">No image</div>
                                                )}
                                            </div>
                                            <div>{product.name}</div>
                                        </td>
                                        <td className="p-2">{formatNumberToNaira(product.price)}</td>
                                        <td className="p-2">
                                            <div className="inline-flex border rounded items-center">
                                                <button
                                                    onClick={() => handleRemoveCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-2"
                                                >
                                                    -
                                                </button>
                                                <div className="px-4">{product.quantity}</div>
                                                <button
                                                    onClick={() => handleAddCount(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-2"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2">{formatNumberToNaira(product.amountByQuantity ?? product.amount * product.quantity)}</td>
                                        <td className="p-2">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAddProductLikes(product.productId)}
                                                    className={`p-2 text-[white] rounded-[4px] h-50px w-50px`}
                                                    style={{ backgroundColor: product.color }}
                                                >
                                                    {/* ❤️ */}
                                                    {product.sleeveType}
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveProduct(product.productId, product.color, product.sleeveType, product.measurementTag)}
                                                    className="p-2"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2">{product.measurementTag}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center">
                                            Your cart is empty
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {cartItems.length > 0 && (
                            <div className="flex justify-between p-4 border-t">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-4 py-2 bg-gray-100 rounded uppercase text-xs font-medium"
                                >
                                    Continue shopping
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="px-4 py-2 bg-gray-100 rounded uppercase text-xs font-medium"
                                    disabled={clearCartLoading}
                                >
                                    {clearCartLoading ? "Clearing..." : "Clear shopping cart"}
                                </button>
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6">
                        <div className="p-4 bg-gray-50 border rounded">
                            <h2 className="text-lg font-semibold mb-2">Apply Discount Code</h2>
                            <input className="w-full p-2 border rounded" placeholder="Enter discount code" />
                        </div>

                        <div className="p-4 bg-gray-50 border rounded">
                            <div className="flex justify-between text-lg font-semibold">
                                <div>Subtotal</div>
                                {/* <div>{summaryData?.sum}</div> */}
                                {formatNumberToNaira(summaryData?.sum)}
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <div>Tax</div>
                                <div>0.00</div>
                            </div>
                            <div className="flex justify-between text-lg font-semibold mt-2">
                                <div>Order Total</div>
                                <div>{sumCartAmount}</div>
                            </div>

                            <form className="mt-4 space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="channel"
                                        value="card"
                                        checked={selectedChannel === "card"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                    />
                                    <span className="ml-1">CARD</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="channel"
                                        value="ussd"
                                        checked={selectedChannel === "ussd"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                    />
                                    <span className="ml-1">USSD</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="channel"
                                        value="transfer"
                                        checked={selectedChannel === "transfer"}
                                        onChange={(e) => setSelectedChannel(e.target.value)}
                                    />
                                    <span className="ml-1">Transfer</span>
                                </label>

                                <div className="text-center text-xs uppercase text-gray-400 border-t pt-4">
                                    Check out with a different address
                                </div>

                                <button
                                    type="button"
                                    disabled={isLoadingOrder || cartItems.length === 0}
                                      onClick={goToOrderPage} 
                                    className="w-full mt-4 py-3 bg-black text-white rounded flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    <span>Proceed to checkout</span>
                                    {isLoadingOrder && <span className="w-4 h-4 border-2 border-white rounded-full animate-spin" />}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}