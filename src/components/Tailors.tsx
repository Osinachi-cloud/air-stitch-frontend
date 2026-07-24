"use client"

import React, { useEffect, useState } from "react";
import { ProductSectionHeader } from "./ProductsectionHeader";
import { Tailor } from "./Tailor";
import { baseUrL } from "@/env/URLs";

interface Vendor {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  profileImage: string | null;
  shortBio: string | null;
}

const mockCategories = [
  {
    id: 1,
    name: "Ed Johnson",
    description: "Short Bio",
    image: "/images/single-product-big.png",
    url: "",
  },
  {
    id: 2,
    name: "Ed Johnson",
    description: "Short description of tailor",
    image: "/images/Agbada.png",
    url: "",
  },
  {
    id: 3,
    name: "Ed Johnson",
    description: "Short description of tailor",
    image: "/images/Agbada.png",
    url: "",
  },
  {
    id: 4,
    name: "Ed Johnson",
    description: "Short description of tailor",
    image: "/images/Agbada.png",
    url: "",
  },
  {
    id: 5,
    name: "Ed Johnson",
    description: "Short description of tailor",
    image: "/images/Agbada.png",
    url: "",
  },
  {
    id: 6,
    name: "Ed Johnson",
    description: "Short description of tailor",
    image: "/images/Agbada.png",
    url: "",
  },
];

export const Tailors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${baseUrL}/vendors?page=0&size=6`);
        if (!res.ok) throw new Error("Failed to fetch vendors");
        const data = await res.json();
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setVendors(data.data);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const displayList = vendors.length > 0 ? vendors.slice(0, 6) : mockCategories.slice(0, 6);

  return (
    <>
      <section className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <ProductSectionHeader title={"Tailors"} url={"/tailors"} />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-[3rem]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-[4px] h-[300px] md:h-[500px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-[3rem]">
            {displayList.map((item, index) => {
              const isVendor = "emailAddress" in item;
              const vendor = isVendor ? (item as Vendor) : null;
              const mock = isVendor ? null : (item as typeof mockCategories[0]);

              const name = vendor
                ? `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim()
                : mock!.name;
              const description = vendor?.shortBio || vendor?.phoneNumber || mock!.description;
              const image = vendor?.profileImage || mock!.image;
              const url = vendor
                ? `/tailors/${encodeURIComponent(vendor.emailAddress)}`
                : mock!.url;

              return (
                <Tailor
                  key={index}
                  image={image}
                  name={name}
                  description={description}
                  buttonText={"View Profile"}
                  url={url}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};
