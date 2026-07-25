"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { baseUrL } from "@/env/URLs";
import { User } from "@/types/user";
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
  const { getUserDetails } = useLocalStorage<User>("customerDetails");
  const stored = getUserDetails();
  console.log("Stored user details:", stored);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const email = stored?.emailAddress;
  const token = stored?.accessToken;

  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const fetchCustomerUrl = useMemo(
    () =>
      `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email === undefined ? "" : email)}`,
    [email]
  );

  const {
    data: customer,
    isLoading: loading,
    error,
    callApi: fetchCustomerData
  } = useFetch("GET", null, fetchCustomerUrl);

  useEffect(() => {
    const fetchAddressData = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${baseUrL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
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
  }, [token]);

  useEffect(() => {
    const fetchAddressData = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${baseUrL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
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
            className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors"
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-600 text-white">
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


