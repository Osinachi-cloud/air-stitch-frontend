"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrL } from "@/env/URLs";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Package,
  ImageIcon,
} from "lucide-react";

interface ProductVariation {
  color?: string;
  sleeveType?: string;
}

interface ProductForm {
  name: string;
  code: string;
  productImage: string;
  price: string;
  quantity: string;
  category: string;
  fixedPrice: boolean;
  country: string;
  publishStatus: string;
  shortDescription: string;
  longDescription: string;
  discount: string;
  materialUsed: string;
  readyIn: string;
  productVariation: ProductVariation[];
}

const CATEGORIES = [
  { value: "MEN", label: "Men's wear" },
  { value: "WOMEN", label: "Women's Wear" },
  { value: "KIDS", label: "Kids wear" },
  { value: "CHILDREN", label: "Children's wear" },
  { value: "COUPLE", label: "Couple" },
  { value: "FAMILY", label: "Family" },
  { value: "ASOEBI", label: "Aso Ebi" },
];

const PUBLISH_STATUSES = [
  { value: "PUBLISHED", label: "Published" },
  { value: "UNPUBLISHED", label: "Unpublished" },
];

function getAuthFromStorage() {
  if (typeof window === "undefined") return null;
  for (const key of ["tailorDetails", "customerDetails", "userDetails"]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const token =
        data?.accessToken || data?.access_token || data?.data?.accessToken;
      if (token) return { token };
    } catch {
      /* ignore */
    }
  }
  return null;
}

const initialForm: ProductForm = {
  name: "",
  code: "",
  productImage: "",
  price: "",
  quantity: "",
  category: "MEN",
  fixedPrice: false,
  country: "Nigeria",
  publishStatus: "PUBLISHED",
  shortDescription: "",
  longDescription: "",
  discount: "0",
  materialUsed: "",
  readyIn: "",
  productVariation: [],
};

export default function AddProductPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ token: string } | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const a = getAuthFromStorage();
    if (a) setAuth(a);
  }, []);

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addVariation = () => {
    setForm((prev) => ({
      ...prev,
      productVariation: [...prev.productVariation, { color: "", sleeveType: "" }],
    }));
  };

  const removeVariation = (index: number) => {
    setForm((prev) => ({
      ...prev,
      productVariation: prev.productVariation.filter((_, i) => i !== index),
    }));
  };

  const updateVariation = (
    index: number,
    field: keyof ProductVariation,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.productVariation];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, productVariation: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth?.token) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: any = {
        productId: form.code || `PROD-${Date.now()}`,
        provider: "STITCH",
        name: form.name,
        code: form.code,
        productImage: form.productImage || "",
        price: form.price ? Number(form.price) : 0,
        quantity: form.quantity ? Number(form.quantity) : 0,
        category: form.category,
        fixedPrice: form.fixedPrice,
        country: form.country,
        publishStatus: form.publishStatus,
        shortDescription: form.shortDescription,
        longDescription: form.longDescription,
        discount: form.discount ? Number(form.discount) : 0,
        materialUsed: form.materialUsed,
        readyIn: form.readyIn,
        productVariation: form.productVariation.filter(
          (v) => v.color?.trim() || v.sleeveType?.trim()
        ),
      };

      const res = await fetch(`${baseUrL}/create-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
      }

      setSuccess(true);
      setTimeout(() => router.push("/inventory"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="py-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-[#15192C] font-bold text-xl md:text-2xl">
            Add New Product
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details to add a new product to your inventory
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          <span className="font-medium">Product created successfully! Redirecting to inventory...</span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="e.g. Premium Black Kaftan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code (SKU) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={form.code}
                onChange={(e) => updateField("code", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="e.g. KFT-001"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.productImage}
                  onChange={(e) => updateField("productImage", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {form.productImage && (
                <div className="relative mt-2 w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={form.productImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <ImageIcon className="w-6 h-6 text-gray-400 absolute" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Pricing & Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (₦)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.discount}
                onChange={(e) => updateField("discount", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Price
              </label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => updateField("fixedPrice", !form.fixedPrice)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.fixedPrice ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.fixedPrice ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {form.fixedPrice ? "Yes" : "No"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish Status
              </label>
              <select
                value={form.publishStatus}
                onChange={(e) => updateField("publishStatus", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white"
              >
                {PUBLISH_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="e.g. Nigeria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Used
              </label>
              <input
                type="text"
                value={form.materialUsed}
                onChange={(e) => updateField("materialUsed", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="e.g. Cotton, Silk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ready In
              </label>
              <input
                type="text"
                value={form.readyIn}
                onChange={(e) => updateField("readyIn", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="e.g. 3 days, 1 week"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => updateField("shortDescription", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                placeholder="Brief description for listings..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long Description
              </label>
              <textarea
                rows={4}
                value={form.longDescription}
                onChange={(e) => updateField("longDescription", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all resize-none"
                placeholder="Detailed product description..."
              />
            </div>
          </div>
        </div>

        {/* Variations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Product Variations
            </h3>
            <button
              type="button"
              onClick={addVariation}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Variation
            </button>
          </div>

          {form.productVariation.length === 0 ? (
            <p className="text-sm text-gray-500">
              No variations added. Click "Add Variation" to include color and sleeve type options.
            </p>
          ) : (
            <div className="space-y-3">
              {form.productVariation.map((v, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">
                      Color
                    </label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) =>
                        updateVariation(index, "color", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                      placeholder="e.g. Red"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">
                      Sleeve Type
                    </label>
                    <input
                      type="text"
                      value={v.sleeveType}
                      onChange={(e) =>
                        updateVariation(index, "sleeveType", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none"
                      placeholder="e.g. Long Sleeve"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariation(index)}
                    className="mt-5 p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="Remove variation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.push("/inventory")}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
