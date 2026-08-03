"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { baseUrL } from "@/env/URLs";
import { useFetch } from "@/hooks/useFetch";

interface CustomerOverview {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  country?: string;
}

interface AddressData {
  fullAddress?: string;
  apartmentNumber?: string | null;
  houseNumber?: string | null;
  street?: string | null;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string | null;
}

export default function AccountOverviewPage() {
  const router = useRouter();

  // Check all storage keys to find the logged-in user (vendor, customer, or generic user)
  function getUserFromStorage(): any {
    if (typeof window === "undefined") return null;
    const keys = ["tailorDetails", "customerDetails", "userDetails"];
    for (const key of keys) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.emailAddress || parsed?.accessToken) return parsed;
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  function isVendor(user: any): boolean {
    if (!user) return false;
    const roleVal =
      user?.role ||
      user?.roleDto?.name ||
      user?.data?.role ||
      user?.data?.roleDto?.name;
    if (typeof roleVal === "string") {
      const normalized = roleVal.toUpperCase().replace("ROLE_", "");
      if (normalized === "VENDOR" || normalized === "TAILOR") return true;
    }
    if (user?.vendorId) return true;
    return false;
  }

  const stored = getUserFromStorage();
  console.log("Stored user details:", stored);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const email = stored?.emailAddress;
  const token = stored?.accessToken;
  const userIsVendor = isVendor(stored);

  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const fetchDetailsUrl = useMemo(() => {
    if (!email) return "";
    const endpoint = userIsVendor ? "vendor-details" : "customer-details";
    return `${baseUrL}/${endpoint}?emailAddress=${encodeURIComponent(email)}`;
  }, [email, userIsVendor]);

  const {
    data: customer,
    isLoading: loading,
    error,
    callApi: fetchCustomerData,
  } = useFetch("GET", null, fetchDetailsUrl);

  useEffect(() => {
    const fetchAddressData = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${baseUrL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const addressItem = Array.isArray(data) ? data[0] : data;
          setAddressData(addressItem);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    if (token) fetchAddressData();

    const handleUpdate = () => fetchAddressData();
    if (typeof window !== "undefined") {
      window.addEventListener("userDetailsUpdated", handleUpdate);
      return () =>
        window.removeEventListener("userDetailsUpdated", handleUpdate);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-surface-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 flex justify-center items-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => fetchCustomerData()}
            className="px-3 py-2 bg-[#164377] hover:bg-[#123661] text-white rounded-xl text-xs font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim() || "—";
  const emailAddress = customer?.emailAddress || "—";
  const phone = customer?.phoneNumber ? `+234 ${customer?.phoneNumber}` : "—";
  // Role may come as flat string from login or nested in roleDto from details endpoint
  const role = (stored as any)?.role || (customer as any)?.role || stored?.roleDto?.name || (customer as any)?.roleDto?.name || "—";
  const address = addressData
    ? [
        addressData.fullAddress,
        addressData.city,
        addressData.state,
        addressData.country
      ]
        .filter(Boolean)
        .join(", ") || "—"
    : "—";

  return (
    <div className="py-6">
      <div className="w-full rounded-2xl border border-surface-100 bg-white p-4 md:p-6 shadow-card">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-300 text-surface-600 hover:border-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-lg font-display font-bold text-surface-800">Account Overview</h1>
        </div>

        {/* Row 1: Profile + Contact Info + Newsletters */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr_1fr]">
          {/* Profile Image */}
          <div className="flex items-start justify-center md:justify-start">
            <Image
              src={customer?.profileImage || "/images/Men.png"}
              alt="Profile"
              width={160}
              height={160}
              className="h-32 w-32 rounded-full object-cover border-4 border-surface-100"
              unoptimized={customer?.profileImage?.startsWith("data:image")}
            />
          </div>

          {/* Contact Information */}
          <section>
            <h2 className="text-sm font-display font-bold text-surface-800">
              Contact Information
            </h2>
            <div className="mt-2 text-sm text-surface-700 leading-6">
              <div className="font-medium text-surface-800">{fullName}</div>
              <div className="text-surface-600">{emailAddress}</div>
              <div className="text-surface-600">{phone}</div>
              {mounted && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#164377] text-white">
                    {role}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => router.push("/list/settings")}
                className="inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push("/change-password")}
                className="inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors"
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Newsletters */}
          <section>
            <h2 className="text-sm font-display font-bold text-surface-800">
              Newsletters
            </h2>
            <p className="mt-2 text-sm text-surface-600">
              You don&apos;t subscribe to our newsletter.
            </p>
            <button className="mt-3 inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors">
              Edit
            </button>
          </section>
        </div>

        {/* Row 2: Address Book + Default Shipping Address */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr_1fr] mt-8">
          {/* Empty — aligns under profile image */}
          <div />

          {/* Address Book */}
          <section>
            <h2 className="text-sm font-display font-bold text-surface-800">
              Address Book
            </h2>
            <div className="mt-3">
              <h3 className="text-xs font-semibold text-surface-800">
                Default Billing Address
              </h3>
              <p className="mt-1 text-sm text-surface-600">{address}</p>
              <button
                onClick={() => router.push("/list/settings")}
                className="mt-2 inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors"
              >
                Edit Address
              </button>
            </div>
          </section>

          {/* Default Shipping Address */}
          <section>
            <h2 className="text-sm font-display font-bold text-surface-800">
              Default Shipping Address
            </h2>
            <p className="mt-2 text-sm text-surface-600">
              You have not set a default shipping address.
            </p>
            <button className="mt-3 inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors">
              Edit Address
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}


