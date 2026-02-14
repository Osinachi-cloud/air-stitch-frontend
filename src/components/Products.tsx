"use client"

import React from "react";
import Image from "next/image";
import { Product } from "./Product";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { useAppSelector } from "@/redux/store";
import { usePost } from "@/hooks/usePost";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Products: React.FC = () => {
  const { getUserDetails } = useLocalStorage("userDetails", null);
  const token = getUserDetails()?.accessToken;

  // Build query parameters for products
  const queryParams = new URLSearchParams({
    page: '0',
    size: '8',
    publishStatus: 'PUBLISHED',
  }).toString();
  
  const productsUrl = `${baseUrL}/get-all-products-by-auth?${queryParams}`;
  const { data: productsData, isLoading: productsLoading, error: productsError } = useFetch("GET", null, productsUrl);

  // Fetch user's liked products if user is logged in
  const { data: likedProductsData, isLoading: likedLoading } = useFetch(
    "GET", 
    null, 
    `${baseUrL}/get-all-product-likes?page=0&size=100`
  );

  // Create a Set of liked product IDs for quick lookup
  const likedProductIds = React.useMemo(() => {
    if (!likedProductsData?.data) return new Set();
    return new Set(likedProductsData.data.map((item: any) => item.productId));
  }, [likedProductsData]);

  // Function to get like URL - now it's a function that returns the URL string
  const getLikeUrl = (productId: string) => {
    return `${baseUrL}/add-product-likes/${productId}`;
  };

  // Show loading state
  if (productsLoading || (token && likedLoading)) {
    return (
      <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-10">
          <div className="text-lg">Loading products...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (productsError) {
    return (
      <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-10">
          <div className="text-lg text-red-600">
            Error: {typeof productsError === 'string' ? productsError : 'Failed to load products'}
          </div>
        </div>
      </section>
    );
  }

  // Extract products from paginated response
  const products = productsData?.data || [];
  
  // Map products to the format expected by Product component
  const displayProducts = products.map((product: any) => ({
    id: product.productId,
    title: product.name,
    description: product.shortDescription,
    price: `₦${(product.price || product.price)?.toLocaleString() || '0'}`,
    image: product.productImage || "/images/placeholder-product.png",
    productId: product.productId,
    isLiked: likedProductIds.has(product.productId), // Check if product is liked
  }));

  return (
    <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-bold">See what is trending</h2>
        <a href="#" className="flex justify-center gap-[1rem] items-center text-[12px] md:text-[20px] text-blue-600 font-medium">
          <span>Browse all categories</span>
          <Image 
            src="/icons/Arrow-dark-right.png" 
            alt="Browse categories" 
            className="h-auto" 
            width={20} 
            height={40}
          />
        </a>
      </div>
      
      {displayProducts.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-lg">No products available</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {displayProducts.map((product: any, index: any) => (
            <Product
              key={product.id || index}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              productId={product.productId}
              getLikeUrl={getLikeUrl} // Pass the function instead of handleClick
              isLiked={product.isLiked}
            />
          ))}
        </div>
      )}
    </section>
  );
};