"use client"

import React from "react";
import Image from "next/image";
import { Product } from "./Product";
import { ProductSectionHeader } from "./ProductsectionHeader";
import { ProductCategory } from "./ProductCategory";
import { Tailor } from "./Tailor";

const categories = [
    {
        id: 1,
        name: "Ed Johnson",
        description: "Short Bio",
        price: "₦40,000",
        image: "/images/single-product-big.png",
    },
    {
        id: 2,
        name: "Ed Johnson",
        description: "Short description of tailor",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 3,
        name: "Ed Johnson",
        description: "Short description of tailor",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 4,
        name: "Ed Johnson",
        description: "Short description of tailor",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 5,
        name: "Ed Johnson",
        description: "Short description of tailor",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 4,
        name: "Ed Johnson",
        description: "Short description of tailor",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
];



export const Tailors: React.FC = () => {
    return (
        <>
            <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
                <ProductSectionHeader
                    title={"Tailors"}
                    url={"/tailor"}
                />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-[3rem]">
                    {categories.map((category, index) => (
                        <Tailor
                            key={index}
                            image={category.image}
                            name={category.name}
                            description={category.description}
                            price={category.price}
                            buttonText={"View Profile"}
                            url={""}

                        />
                    ))}
                </div>

            </section>
        </>

    );
};

