// "use client"

// import React from "react";
// import Image from "next/image";
// import { Product } from "./Product";
// import { ProductSectionHeader } from "./ProductsectionHeader";

// const products = [
//   {
//     id: 1,
//     title: "Men Black Kaftan Fitted Style",
//     description: "Plain Kaftan Style for Men",
//     price: "₦40,000",
//     image: "/images/single-product-big.png",
//   },
//   ...Array(7).fill({
//     id: 2,
//     title: "Pattern Agbada 3-Piece",
//     description: "Short description of product",
//     price: "₦140,000",
//     image: "/images/Agbada.png", // Replace with actual path
//   }),
// ];

// export const Products: React.FC = () => {
//   return (
//     <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="md:text-3xl font-bold">See what is trending</h2>
//         <a href="#" className="flex justify-center gap-[1rem] items-center text-[12px] md:text-[20px] text-blue-600 font-medium">
//           <span>Browse all categories</span>
//           <Image src="/icons/Arrow-dark-right.png" alt="Product Image" className=" h-auto " width={20} height={40}/>
//         </a>
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
//         {products.map((product, index) => (
//           <Product
//             key={index}
//             image={product.image}
//             title={product.title}
//             description={product.description}
//             price={product.price}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };






"use client"

import React from "react";
import Image from "next/image";
import { Product } from "./Product";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { useAppSelector } from "@/redux/store";


export const Products: React.FC = () => {
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    page: '0',
    size: '8',
    publishStatus: 'PUBLISHED',
 
  }).toString();
  
  const url = `${baseUrL}/get-all-products-by-auth?${queryParams}`;

  const { data, isLoading, error } = useFetch("GET", null, url);

  // Show loading state
  if (isLoading) {
    return (
      <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-10">
          <div className="text-lg">Loading products...</div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-10">
          <div className="text-lg text-red-600">
            Error: {typeof error === 'string' ? error : 'Failed to load products'}
          </div>
        </div>
      </section>
    );
  }

  // Extract products from paginated response
  const productsData = data?.data || [];
  
  // Map products to the format expected by Product component
  const displayProducts = productsData.map((product: any) => ({
    id: product.productId,
    title: product.name,
    description: product.shortDescription,
    price: `₦${(product.sellingPrice || product.price)?.toLocaleString() || '0'}`,
    image: product.productImage || "/images/placeholder-product.png",
    productId: product.productId,
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
          {displayProducts.map((product:any, index:any) => (
            <Product
              key={product.id || index}
              image={product.image}
              title={product.title}
              description={product.description}
              price={product.price}
              productId={product.productId}
            />
          ))}
        </div>
      )}
    </section>
  );
};