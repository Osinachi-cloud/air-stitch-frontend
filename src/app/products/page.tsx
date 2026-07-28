"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import {
  Heart,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Filter,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isTokenExpired } from "@/hooks/jwtHooks";

const CATEGORIES = [
  { value: "MEN", label: "Men's Wear" },
  { value: "WOMEN", label: "Women's Wear" },
  { value: "KIDS", label: "Kids Wear" },
  { value: "CHILDREN", label: "Children's Wear" },
  { value: "COUPLE", label: "Couple" },
  { value: "FAMILY", label: "Family" },
  { value: "ASOEBI", label: "Aso Ebi" },
];

const PRICE_RANGES = [
  { label: "Under ₦5,000", min: 0, max: 5000 },
  { label: "₦5,000 - ₦15,000", min: 5000, max: 15000 },
  { label: "₦15,000 - ₦30,000", min: 15000, max: 30000 },
  { label: "₦30,000 - ₦50,000", min: 30000, max: 50000 },
  { label: "₦50,000 - ₦100,000", min: 50000, max: 100000 },
  { label: "Above ₦100,000", min: 100000, max: 999999999 },
];

interface Vendor {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
}

interface ProductItem {
  productId: string;
  name: string;
  shortDescription: string;
  price: number;
  productImage?: string;
  outOfStock: boolean;
  category?: string;
  vendor?: Vendor;
}

interface PaginatedResponse {
  data: ProductItem[];
  page: number;
  size: number;
  total: number;
}

function buildProductsUrl(
  base: string,
  page: number,
  size: number,
  filters: {
    search?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
  }
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("publishStatus", "PUBLISHED");

  if (filters.search?.trim()) {
    params.set("name", filters.search.trim());
  }
  filters.categories?.forEach((c) => params.append("categories", c));
  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  return `${base}?${params.toString()}`;
}

export default function ProductsListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ─── UI state ───
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ─── Filter state ───
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const { getUserDetails } = useLocalStorage("customerDetails", null);
  const token = getUserDetails()?.accessToken;
  const size = 16;
  const totalPages = Math.max(1, Math.ceil(total / size));

  // ─── Sync URL -> state on mount ───
  useEffect(() => {
    if (!searchParams) return;
    const q = searchParams.get("search") || "";
    const cats = searchParams.getAll("categories");
    const min = searchParams.get("minPrice") || "";
    const max = searchParams.get("maxPrice") || "";

    setSearch(q);
    setSelectedCategories(cats);
    setMinPrice(min);
    setMaxPrice(max);
    if (min && max) {
      const match = PRICE_RANGES.find(
        (r) => String(r.min) === min && String(r.max) === max
      );
      setSelectedPriceRange(match ? `${min}-${max}` : null);
    }
    const p = parseInt(searchParams.get("page") || "0", 10);
    if (!isNaN(p)) setPage(p);
  }, [searchParams]);

  // ─── Fetch products ───
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        categories: selectedCategories,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      };

      const base = token && !isTokenExpired(token)
        ? `${baseUrL}/get-all-products-by-auth`
        : `${baseUrL}/get-all-products`;

      const url = buildProductsUrl(base, page, size, filters);

      const res = await fetch(url, {
        headers: token && !isTokenExpired(token)
          ? { Authorization: `Bearer ${token}` }
          : {},
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
  }, [page, size, search, selectedCategories, minPrice, maxPrice, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Fetch liked products ───
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

  // ─── Apply filters -> update URL ───
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    selectedCategories.forEach((c) => params.append("categories", c));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (page > 0) params.set("page", String(page));
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [search, selectedCategories, minPrice, maxPrice, page, router]);

  useEffect(() => {
    // debounce filter application
    const t = setTimeout(() => applyFilters(), 400);
    return () => clearTimeout(t);
  }, [applyFilters]);

  // ─── Handlers ───
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(0);
  };

  const handlePriceRange = (range: { label: string; min: number; max: number }) => {
    const key = `${range.min}-${range.max}`;
    if (selectedPriceRange === key) {
      setSelectedPriceRange(null);
      setMinPrice("");
      setMaxPrice("");
    } else {
      setSelectedPriceRange(key);
      setMinPrice(String(range.min));
      setMaxPrice(String(range.max));
    }
    setPage(0);
  };

  const handleCustomPrice = () => {
    setSelectedPriceRange(null);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedPriceRange(null);
    setPage(0);
    router.push("/products", { scroll: false });
  };

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
      /* ignore */
    } finally {
      setIsProcessing((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // ─── Active filter chips ───
  const activeFilters = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (search.trim())
      chips.push({ label: `Search: "${search.trim()}"`, onRemove: () => setSearch("") });
    selectedCategories.forEach((c) => {
      const cat = CATEGORIES.find((x) => x.value === c);
      chips.push({
        label: cat?.label || c,
        onRemove: () => toggleCategory(c),
      });
    });
    if (minPrice || maxPrice) {
      const min = minPrice ? `₦${Number(minPrice).toLocaleString()}` : "₦0";
      const max = maxPrice ? `₦${Number(maxPrice).toLocaleString()}` : "+";
      chips.push({ label: `Price: ${min} - ${max}`, onRemove: () => { setMinPrice(""); setMaxPrice(""); setSelectedPriceRange(null); } });
    }
    return chips;
  }, [search, selectedCategories, minPrice, maxPrice]);

  // ─── Render ───
  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors mb-5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Store</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold">Our Products</h1>
              <p className="mt-1.5 text-gray-300 text-sm max-w-lg">
                Discover custom-tailored fashion for every occasion.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm">
              {total} product{total !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 bg-white border border-surface-200 px-4 py-2 rounded-xl text-sm font-semibold text-surface-700 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <span className="bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-surface-100 text-surface-800" : "text-surface-400"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-surface-100 text-surface-800" : "text-surface-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── Sidebar Filters ─── */}
          <aside
            className={`${
              showMobileFilters
                ? "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                : "hidden lg:block lg:w-64 lg:flex-shrink-0"
            }`}
          >
            <div
              className={`${
                showMobileFilters
                  ? "absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
                  : "bg-white rounded-2xl border border-surface-200 shadow-sm p-5 sticky top-6"
              }`}
            >
              {showMobileFilters && (
                <div className="flex items-center justify-between p-4 border-b border-surface-100">
                  <h2 className="font-display font-bold text-surface-800">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-5 h-5 text-surface-500" />
                  </button>
                </div>
              )}

              <div className={`space-y-6 ${showMobileFilters ? "p-4" : ""}`}>
                {/* Search */}
                <div>
                  <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-2">
                    Search
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-surface-400 w-3.5 h-3.5" />
                    <input
                      type="text"
                      placeholder="Product name, tailor..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                      className="w-full pl-8 pr-3 py-2 border border-surface-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-2">
                    Category
                  </h3>
                  <div className="space-y-1.5">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.value)}
                          onChange={() => toggleCategory(cat.value)}
                          className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-xs text-surface-600 group-hover:text-surface-800 transition-colors">
                          {cat.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-xs font-bold text-surface-800 uppercase tracking-wider mb-2">
                    Price Range
                  </h3>
                  <div className="space-y-1.5">
                    {PRICE_RANGES.map((range) => {
                      const key = `${range.min}-${range.max}`;
                      const active = selectedPriceRange === key;
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg transition-colors ${
                            active ? "bg-primary-50" : "hover:bg-surface-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            checked={active}
                            onChange={() => handlePriceRange(range)}
                            className="w-4 h-4 border-surface-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className={`text-xs ${active ? "text-primary-700 font-semibold" : "text-surface-600"}`}>
                            {range.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Custom price */}
                  <div className="mt-3 pt-3 border-t border-surface-100">
                    <p className="text-[11px] font-semibold text-surface-500 mb-2">Custom Price</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => { setMinPrice(e.target.value); setSelectedPriceRange(null); handleCustomPrice(); }}
                        className="w-full px-2 py-1.5 border border-surface-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                      <span className="text-surface-400 text-xs">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setSelectedPriceRange(null); handleCustomPrice(); }}
                        className="w-full px-2 py-1.5 border border-surface-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear */}
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 border border-surface-200 rounded-lg text-xs font-semibold text-surface-600 hover:bg-surface-50 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ─── Product Grid ─── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {activeFilters.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  >
                    {chip.label}
                    <button onClick={chip.onRemove} className="hover:text-primary-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {activeFilters.length === 0 && (
                  <span className="text-xs text-surface-500">Showing all products</span>
                )}
              </div>
              <div className="hidden lg:flex items-center gap-1 bg-white border border-surface-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-surface-100 text-surface-800" : "text-surface-400 hover:text-surface-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-surface-100 text-surface-800" : "text-surface-400 hover:text-surface-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-surface-100 h-[320px] animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-surface-100 h-28 animate-pulse" />
                  ))}
                </div>
              )
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-100 p-12 text-center">
                <Package className="w-14 h-14 text-surface-200 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-surface-800">No products found</h3>
                <p className="text-sm text-surface-500 mt-1">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      onClick={() => router.push(`/product-details/${product.productId}`)}
                      className="bg-white rounded-xl border border-surface-100 overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
                    >
                      <div
                        className="relative w-full aspect-[3/4] bg-cover bg-top bg-no-repeat"
                        style={{
                          backgroundImage: `url(${product.productImage || "/images/placeholder-product.png"})`,
                        }}
                      >
                        {product.outOfStock && (
                          <span className="absolute top-2 left-2 bg-surface-800/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Out of Stock
                          </span>
                        )}
                        <div
                          onClick={(e) => handleLike(product.productId, e)}
                          className="absolute right-2 top-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Heart
                            className="transition-colors duration-200"
                            color={likedIds.has(product.productId) ? "#f43f5e" : "#9ca3af"}
                            fill={likedIds.has(product.productId) ? "#f43f5e" : "none"}
                            size={16}
                          />
                        </div>
                      </div>
                      <div className="px-3 pt-3 pb-3">
                        <p className="text-[10px] text-primary-600 font-semibold uppercase tracking-wide">
                          {product.category?.replace(/_/g, " ") || "Fashion"}
                        </p>
                        <h3 className="text-xs md:text-sm font-semibold text-surface-800 line-clamp-1 mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-[10px] md:text-xs text-surface-500 mt-0.5 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-surface-900">
                            ₦{(product.price || 0).toLocaleString()}
                          </span>
                          {product.vendor && (
                            <span className="text-[10px] text-surface-400 truncate max-w-[80px]">
                              {product.vendor.firstName} {product.vendor.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-100 pt-6">
                    <p className="text-sm text-surface-500">
                      Page <span className="font-medium text-surface-800">{page + 1}</span> of{" "}
                      <span className="font-medium text-surface-800">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </button>
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                              p === page
                                ? "bg-brand-gradient text-white shadow-sm"
                                : "text-surface-600 hover:bg-surface-100"
                            }`}
                          >
                            {p + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* List view */
              <>
                <div className="space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.productId}
                      onClick={() => router.push(`/product-details/${product.productId}`)}
                      className="bg-white rounded-xl border border-surface-100 p-3 flex gap-4 hover:shadow-card-hover transition-all cursor-pointer group"
                    >
                      <div
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-cover bg-top bg-no-repeat flex-shrink-0"
                        style={{
                          backgroundImage: `url(${product.productImage || "/images/placeholder-product.png"})`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-primary-600 font-semibold uppercase tracking-wide">
                          {product.category?.replace(/_/g, " ") || "Fashion"}
                        </p>
                        <h3 className="text-sm font-semibold text-surface-800 line-clamp-1 mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-base font-bold text-surface-900">
                            ₦{(product.price || 0).toLocaleString()}
                          </span>
                          {product.outOfStock && (
                            <span className="text-[10px] bg-surface-100 text-surface-500 px-2 py-0.5 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div
                          onClick={(e) => handleLike(product.productId, e)}
                          className="p-1.5 rounded-full bg-surface-50 hover:bg-surface-100 transition-colors cursor-pointer"
                        >
                          <Heart
                            className="transition-colors duration-200"
                            color={likedIds.has(product.productId) ? "#f43f5e" : "#9ca3af"}
                            fill={likedIds.has(product.productId) ? "#f43f5e" : "none"}
                            size={16}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-100 pt-6">
                    <p className="text-sm text-surface-500">
                      Page <span className="font-medium text-surface-800">{page + 1}</span> of{" "}
                      <span className="font-medium text-surface-800">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </button>
                      <div className="hidden sm:flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                              p === page
                                ? "bg-brand-gradient text-white shadow-sm"
                                : "text-surface-600 hover:bg-surface-100"
                            }`}
                          >
                            {p + 1}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
      </div>
    </div>
  );
}
