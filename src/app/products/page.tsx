"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import { Heart, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isTokenExpired } from "@/hooks/jwtHooks";

interface ProductItem {
  productId: string;
  name: string;
  shortDescription: string;
  price: number;
  productImage?: string;
  outOfStock: boolean;
}

interface PaginatedResponse {
  data: ProductItem[];
  page: number;
  size: number;
  total: number;
}

export default function ProductsListingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const { getUserDetails } = useLocalStorage("customerDetails", null);
  const token = getUserDetails()?.accessToken;

  const size = 12;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const productsUrl = `${baseUrL}/get-all-products?page=${page}&size=${size}&publishStatus=PUBLISHED`;
  const authProductsUrl = `${baseUrL}/get-all-products-by-auth?page=${page}&size=${size}&publishStatus=PUBLISHED`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = token && !isTokenExpired(token) ? authProductsUrl : productsUrl;
        const res = await fetch(url, {
          headers: token && !isTokenExpired(token) ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: PaginatedResponse = await res.json();
        setProducts(data?.data || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // Fetch liked products
  useEffect(() => {
    if (!token) return;
    fetch(`${baseUrL}/get-all-product-likes?page=0&size=1000`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.data) {
          setLikedIds(new Set(data.data.map((item: any) => item.productId)));
        }
      })
      .catch(() => {});
  }, [token]);

  const handleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProcessing[productId]) return;
    setIsProcessing((prev) => ({ ...prev, [productId]: true }));
    try {
      const url = `${baseUrL}/add-product-likes/${productId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Failed");
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    } catch (_) {
    } finally {
      setIsProcessing((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.shortDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Store</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Our Products</h1>
              <p className="mt-2 text-gray-300 text-sm md:text-base max-w-lg">
                Explore our collection of custom-tailored clothing crafted for your style.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="px-3 py-1 rounded-full bg-white/10">
                {total} product{total !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-[320px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {search ? "Try a different search term." : "Check back later for new arrivals."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => router.push(`/product-details/${product.productId}`)}
                  className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="relative w-full h-[65%] bg-cover bg-top bg-no-repeat aspect-[3/4]"
                    style={{ backgroundImage: `url(${product.productImage || "/images/placeholder-product.png"})` }}
                  >
                    <div
                      onClick={(e) => handleLike(product.productId, e)}
                      className="absolute right-2 top-2 z-10 p-1 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer"
                    >
                      <Heart
                        className="transition-colors duration-200"
                        color={likedIds.has(product.productId) ? "#f43f5e" : "#f59e0b"}
                        fill={likedIds.has(product.productId) ? "#f43f5e" : "none"}
                        size={16}
                      />
                    </div>
                  </div>
                  <div className="px-3 pt-3 pb-3">
                    <h3 className="text-xs md:text-sm font-semibold leading-snug text-surface-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-surface-500 mt-0.5 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs md:text-sm font-bold text-primary-700">
                        ₦{(product.price || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-surface-500">
                        {product.outOfStock ? "Out of stock" : "In stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500">
                  Page <span className="font-medium text-gray-800">{page + 1}</span> of{" "}
                  <span className="font-medium text-gray-800">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          p === page
                            ? "bg-brand-gradient text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {p + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
