"use client"

import React, { useEffect, useState } from "react";
import { ProductSectionHeader } from "./ProductsectionHeader";
import { Tailor } from "./Tailor";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
  const { getUserDetails } = useLocalStorage("customerDetails", null);
  const token = getUserDetails()?.accessToken;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${baseUrL}/vendors?page=0&size=8`);
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

  // Fetch user's liked tailors if logged in
  const { data: likedTailorsData, isLoading: likedLoading } = useFetch(
    "GET",
    null,
    `${baseUrL}/get-all-vendor-likes?page=0&size=100`
  );

  const likedTailorIds = React.useMemo(() => {
    if (!likedTailorsData?.data) return new Set();
    return new Set(likedTailorsData.data.map((item: any) => item.emailAddress || item.vendorId || item.tailorId));
  }, [likedTailorsData]);

  const handleLike = async (tailorId: string) => {
    if (!token) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return;
    }
    const url = `${baseUrL}/add-vendor-likes`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vendorEmail: tailorId }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Like tailor failed:', res.status, text);
      throw new Error(`Failed to like tailor (${res.status})`);
    }
  };

  const displayList = vendors.length > 0 ? vendors.slice(0, 8) : mockCategories.slice(0, 8);

  return (
    <>
      <section className="px-4 md:px-6 py-8 w-[95%] mx-auto">
        <ProductSectionHeader title={"Tailors"} url={"/tailors"} />
        {loading || (token && likedLoading) ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface-200 rounded-lg h-[260px] md:h-[360px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {displayList.map((item, index) => {
              const isVendor = "emailAddress" in item;
              const vendor = isVendor ? (item as Vendor) : null;
              const mock = isVendor ? null : (item as typeof mockCategories[0]);

              const name = vendor
                ? `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim()
                : mock?.name || "Tailor";
              const description = vendor?.shortBio || vendor?.phoneNumber || mock?.description || "";
              const image = vendor?.profileImage || mock?.image || "/images/single-product-big.png";
              const url = vendor && vendor.emailAddress
                ? `/tailors/${encodeURIComponent(vendor.emailAddress)}`
                : "#";
              const tailorId = vendor?.emailAddress || mock?.id || index;

              return (
                <Tailor
                  key={index}
                  image={image}
                  name={name}
                  description={description}
                  buttonText={"View Profile"}
                  url={url}
                  tailorId={tailorId}
                  onLike={handleLike}
                  isLiked={likedTailorIds.has(tailorId)}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};
