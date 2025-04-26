"use client"

import React from "react";
import Image from "next/image";
import { Product } from "./Product";
import { ProductSectionHeader } from "./ProductsectionHeader";
import { ProductCategory } from "./ProductCategory";

const categories = [
    {
        id: 1,
        name: "Guys",
        description: "Plain Kaftan Style for Men",
        price: "₦40,000",
        image: "/images/single-product-big.png",
    },
    {
        id: 2,
        name: "Gals",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 3,
        name: "Couples",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 4,
        name: "Kids",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 5,
        name: "Family",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 4,
        name: "Aso ebi",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
];


const styles = [
    {
        id: 1,
        name: "Coporate",
        description: "Plain Kaftan Style for Men",
        price: "₦40,000",
        image: "/images/single-product-big.png",
    },
    {
        id: 2,
        name: "Natives",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 3,
        name: "Casuals",
        description: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    }
];

export const ProductCategories: React.FC = () => {
    return (
        <>

            <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
                <ProductSectionHeader
                    title={"Styles"}
                    url={"/styles"}
                />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-[3rem] ">
                    {styles.map((category, index) => (
                        <ProductCategory
                            key={index}
                            image={category.image}
                            name={category.name}
                            description={category.description}
                            price={category.price}
                            buttonText={"View more"}

                        />
                    ))}
                </div>

            </section>

            <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
                <ProductSectionHeader
                    title={"Categories"}
                    url={"/categories"}
                />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-[3rem]">
                    {categories.map((category, index) => (
                        <ProductCategory
                            key={index}
                            image={category.image}
                            name={category.name}
                            description={category.description}
                            price={category.price}
                            buttonText={"View Categories"}

                        />
                    ))}
                </div>

            </section>
        </>

    );
};

