"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tailor } from "@/components/Tailor";
import { baseUrL } from "@/env/URLs";
import { ChevronLeft, ChevronRight, Users, Search } from "lucide-react";

interface Vendor {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  profileImage: string | null;
  shortBio: string | null;
}

interface PaginatedResponse {
  data: Vendor[];
  page: number;
  size: number;
  total: number;
}

export default function TailorsListingPage() {
  const router = useRouter();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const size = 20;
  const totalPages = Math.max(1, Math.ceil(total / size));

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrL}/vendors?page=${page}&size=${size}`);
        if (!res.ok) throw new Error("Failed to fetch vendors");
        const data: PaginatedResponse = await res.json();
        setVendors(data?.data || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [page]);

  const filtered = vendors.filter((v) => {
    const term = search.toLowerCase();
    const name = `${v.firstName} ${v.lastName}`.toLowerCase();
    return name.includes(term) || v.emailAddress.toLowerCase().includes(term);
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
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Directory</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Our Tailors</h1>
              <p className="mt-2 text-gray-300 text-sm md:text-base max-w-lg">
                Discover skilled and verified tailors ready to bring your style to life.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="px-3 py-1 rounded-full bg-white/10">
                {total} tailor{total !== 1 ? "s" : ""}
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
              placeholder="Search tailors by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-[420px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">No tailors found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {search ? "Try a different search term." : "Check back later for new tailors."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((vendor, index) => {
                const fullName = `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim();
                const desc = vendor.shortBio || vendor.phoneNumber || "Verified tailor";
                const image = vendor.profileImage || "/images/single-product-big.png";
                const url = `/tailors/${encodeURIComponent(vendor.emailAddress)}`;

                return (
                  <Tailor
                    key={index}
                    image={image}
                    name={fullName}
                    description={desc}
                    buttonText="View Profile"
                    url={url}
                  />
                );
              })}
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
                            ? "bg-gray-900 text-white shadow-md"
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
