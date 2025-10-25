"use client"

import React from "react";
import Image from "next/image";
import { Product } from "./Product";
import { ProductSectionHeader } from "./ProductsectionHeader";

const products = [
  {
    id: 1,
    title: "Men Black Kaftan Fitted Style",
    description: "Plain Kaftan Style for Men",
    price: "₦40,000",
    image: "/images/single-product-big.png",
  },
  ...Array(7).fill({
    id: 2,
    title: "Pattern Agbada 3-Piece",
    description: "Short description of product",
    price: "₦140,000",
    image: "/images/Agbada.png", // Replace with actual path
  }),
];

export const Products: React.FC = () => {
  return (
    <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-3xl font-bold">See what is trending</h2>
        <a href="#" className="flex justify-center gap-[1rem] items-center text-[12px] md:text-[20px] text-blue-600 font-medium">
          <span>Browse all categories</span>
          <Image src="/icons/Arrow-dark-right.png" alt="Product Image" className=" h-auto " width={20} height={40}/>
        </a>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
        {products.map((product, index) => (
          <Product
            key={index}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};




