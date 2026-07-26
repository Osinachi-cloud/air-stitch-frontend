"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import { ProductDto } from "@/types/product";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
} from "lucide-react";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  size: number;
}

function getVendorIdFromStorage(): { vendorId: string; token: string } | null {
  if (typeof window === "undefined") return null;
  for (const key of ["tailorDetails", "customerDetails", "userDetails"]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      // Backend expects userId (customerId), not emailAddress
      const vendorId = data?.customerId || data?.userId || data?.data?.customerId || data?.data?.userId;
      const token = data?.accessToken || data?.access_token || data?.data?.accessToken;
      if (vendorId && token) {
        console.log(`[Inventory] Found vendorId='${vendorId}' in '${key}'`);
        return { vendorId: vendorId as string, token };
      }
    } catch {
      /* ignore */
    }
  }
  console.log("[Inventory] No user found in any storage key");
  return null;
}

export default function InventoryPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [auth, setAuth] = useState<{ vendorId: string; token: string } | null>(null);

  // Read auth from localStorage once on mount
  useEffect(() => {
    const a = getVendorIdFromStorage();
    setAuth(a);
  }, []);

  const fetchProducts = async (currentPage: number) => {
    if (!auth?.vendorId) return;
    setLoading(true);
    setError(null);

    const url = `${baseUrL}/get-products-by-vendor?vendorId=${encodeURIComponent(
      auth.vendorId
    )}&page=${currentPage}&size=${size}`;

    console.log(`[Inventory] Fetching: ${url}`);

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`[Inventory] Response status: ${res.status}`);

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[Inventory] Error body:`, errText.substring(0, 500));
        throw new Error(`HTTP ${res.status}`);
      }

      const data: PaginatedResponse<ProductDto> = await res.json();
      console.log(`[Inventory] Data received:`, data);
      setProducts(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: any) {
      console.error(`[Inventory] Fetch error:`, err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchProducts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.productId?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    if (!auth?.token) return;
    try {
      const res = await fetch(`${baseUrL}/delete-product/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Error deleting product");
    }
  };

  // If not logged in yet, show a message
  if (!auth) {
    return (
      <div className="py-6 w-full flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-surface-600 mb-2">Session not found. Please log in.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-surface-900 text-white rounded-lg hover:bg-surface-800 text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-display font-bold text-surface-800">
              Inventory
            </h2>
            <p className="text-sm text-surface-500">
              Manage your products and stock
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => fetchProducts(page)}
            className="flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4 text-surface-600" />
            <span className="text-surface-600">Refresh</span>
          </button>
          <button
            onClick={() => router.push("/inventory/add-product")}
            className="flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white px-3 py-2 rounded-xl transition-all text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 p-3 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
            placeholder="Search by name, code or product ID..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Products", value: total },
          {
            label: "In Stock",
            value: products.filter((p) => !p.outOfStock).length,
          },
          {
            label: "Out of Stock",
            value: products.filter((p) => p.outOfStock).length,
          },
          {
            label: "Published",
            value: products.filter(
              (p) =>
                p.publishStatus?.toUpperCase() === "PUBLISHED" ||
                p.publishStatus?.toUpperCase() === "ACTIVE"
            ).length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-card p-4 border border-surface-100"
          >
            <p className="text-xs font-medium text-surface-500">{stat.label}</p>
            <p className="text-xl font-display font-bold mt-1 text-surface-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-500">
            <p>Error loading products: {error}</p>
            <button
              onClick={() => fetchProducts(page)}
              className="mt-4 px-3 py-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl text-xs font-semibold transition-all"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-8">
            <Package className="w-10 h-10 text-surface-300 mx-auto mb-3" />
            <p className="text-sm text-surface-500">
              {search
                ? "No products match your search"
                : "No products in inventory yet"}
            </p>
            <button
              onClick={() => router.push("/inventory/add-product")}
              className="mt-4 px-3 py-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl text-xs font-semibold transition-all"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-surface-100">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-100">
                  {filtered.map((product) => (
                    <tr
                      key={product.productId}
                      className="hover:bg-primary-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center overflow-hidden">
                            {product.productImage ? (
                              <Image
                                src={product.productImage}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-surface-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-800">
                              {product.name || "Unnamed Product"}
                            </p>
                            <p className="text-xs text-surface-500">
                              {product.productId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-600">
                        {product.code || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-surface-800">
                        ₦{product.price?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.outOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.outOfStock ? "Out of Stock" : "In Stock"}
                        </span>
                        <p className="text-xs text-surface-500 mt-0.5">
                          Qty: {product.quantity ?? 0}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.publishStatus?.toUpperCase() ===
                              "PUBLISHED" ||
                            product.publishStatus?.toUpperCase() === "ACTIVE"
                              ? "bg-primary-100 text-primary-700"
                              : "bg-surface-100 text-surface-700"
                          }`}
                        >
                          {product.publishStatus || "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/product-details/${product.productId}`
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-600"
                            title="View"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.productId)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-surface-100">
              {filtered.map((product) => (
                <div key={product.productId} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-surface-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.productImage ? (
                        <Image
                          src={product.productImage}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-surface-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-xs text-surface-500">{product.code}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-surface-800">
                          ₦{product.price?.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            product.outOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {product.outOfStock ? "Out" : "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        router.push(`/product-details/${product.productId}`)
                      }
                      className="flex-1 py-2 text-sm border border-surface-200 rounded-xl hover:bg-surface-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-2.5 border-t border-surface-100 bg-surface-50 flex items-center justify-between">
                <span className="text-xs text-surface-600">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded-lg border border-surface-200 disabled:opacity-50 hover:bg-white"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg border border-surface-200 disabled:opacity-50 hover:bg-white"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page + 1 >= totalPages}
                  >
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
