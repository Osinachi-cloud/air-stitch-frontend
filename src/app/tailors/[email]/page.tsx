"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

interface VendorDetail {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  profileImage: string | null;
  shortBio: string | null;
  role: string;
}

export default function TailorDetailPage({ params }: { params: { email: string } }) {
  const router = useRouter();
  const email = decodeURIComponent(params.email);

  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`${baseUrL}/vendor-details?emailAddress=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to fetch vendor details");
        const data = await res.json();
        setVendor(data);
      } catch (err: any) {
        setError(err?.message || "Error loading vendor details");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tailor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4">{error || "Tailor not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || "Tailor";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="[PHONE NUMBER_REDACTED]" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-200">
              {vendor.profileImage ? (
                <Image
                  src={vendor.profileImage}
                  alt={fullName}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  unoptimized={vendor.profileImage.startsWith("data:image")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">{vendor.role?.toLowerCase() || "Tailor"}</p>

            {vendor.shortBio && (
              <p className="mt-4 text-gray-700 leading-relaxed">{vendor.shortBio}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-4">
              {vendor.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{vendor.phoneNumber}</span>
                </div>
              )}
              {vendor.emailAddress && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{vendor.emailAddress}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
                Contact Tailor
              </button>
              <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
