"use client"

import { Blogs } from "@/components/Blogs"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header/Header"
import { LandingBanner } from "@/components/landingBanner"
import { ProductCategories } from "@/components/ProductCategories"
import { Products } from "@/components/Products"
import { Tailors } from "@/components/Tailors"
// import { Products } from "@/components/Products"

export const HomePage = () => {

    return (
        <>
            <Header/>
            <Products/>
            <LandingBanner/>
            <ProductCategories/>
            <LandingBanner/>
            <Tailors/>
            <Blogs/>
            <Footer/>
        </>
    )
}