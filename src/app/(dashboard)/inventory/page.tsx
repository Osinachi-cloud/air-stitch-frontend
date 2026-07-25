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
          <p className="text-gray-600 mb-2">Session not found. Please log in.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
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
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all"
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
            <h2 className="text-[#15192C] font-semibold text-xl md:text-2xl leading-8">
              Inventory
            </h2>
            <p className="text-sm text-gray-500">
              Manage your products and stock
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => fetchProducts(page)}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">Refresh</span>
          </button>
          <button
            onClick={() => router.push("/inventory/add-product")}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <p>Error loading products: {error}</p>
            <button
              onClick={() => fetchProducts(page)}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {search
                ? "No products match your search"
                : "No products in inventory yet"}
            </p>
            <button
              onClick={() => router.push("/inventory/add-product")}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((product) => (
                    <tr
                      key={product.productId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.productImage ? (
                              <Image
                                src={product.productImage}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name || "Unnamed Product"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.productId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.code || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₦{product.price?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.outOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.outOfStock ? "Out of Stock" : "In Stock"}
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Qty: {product.quantity ?? 0}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.publishStatus?.toUpperCase() ===
                              "PUBLISHED" ||
                            product.publishStatus?.toUpperCase() === "ACTIVE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {product.publishStatus || "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/product-details/${product.productId}`
                              )
                            }
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                            title="View"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.productId)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
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
            <div className="md:hidden divide-y divide-gray-200">
              {filtered.map((product) => (
                <div key={product.productId} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.productImage ? (
                        <Image
                          src={product.productImage}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-xs text-gray-500">{product.code}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold">
                          ₦{product.price?.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            product.outOfStock
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
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
                      className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-white"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-white"
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
