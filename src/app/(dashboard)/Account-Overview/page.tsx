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
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Account Overview</h1>
        </div>

        {/* Row 1: Profile + Contact Info + Newsletters */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[190px_1fr_1fr]">
          {/* Profile Image */}
          <div className="flex items-start justify-center md:justify-start">
            <Image
              src={customer?.profileImage || "/images/Men.png"}
              alt="Profile"
              width={160}
              height={160}
              className="h-40 w-40 rounded-full object-cover border-4 border-gray-200"
              unoptimized={customer?.profileImage?.startsWith("data:image")}
            />
          </div>

          {/* Contact Information */}
          <section>
            <h2 className="text-base font-semibold text-gray-900">
              Contact Information
            </h2>
            <div className="mt-2 text-sm text-gray-700 leading-6">
              <div className="font-medium">{fullName}</div>
              <div className="text-gray-600">{emailAddress}</div>
              <div className="text-gray-600">{phone}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => router.push("/list/settings")}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push("/change-password")}
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Change Password
              </button>
            </div>
          </section>

          {/* Newsletters */}
          <section>
            <h2 className="text-base font-semibold text-gray-900">
              Newsletters
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You don&apos;t subscribe to our newsletter.
            </p>
            <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
              Edit
            </button>
          </section>
        </div>

        {/* Row 2: Address Book + Default Shipping Address */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[190px_1fr_1fr] mt-10">
          {/* Empty — aligns under profile image */}
          <div />

          {/* Address Book */}
          <section>
            <h2 className="text-base font-semibold text-gray-900">
              Address Book
            </h2>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Default Billing Address
              </h3>
              <p className="mt-1 text-sm text-gray-600">{address}</p>
              <button
                onClick={() => router.push("/list/settings")}
                className="mt-2 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Edit Address
              </button>
            </div>
          </section>

          {/* Default Shipping Address */}
          <section>
            <h2 className="text-base font-semibold text-gray-900">
              Default Shipping Address
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You have not set a default shipping address.
            </p>
            <button className="mt-3 inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50 transition-colors">
              Edit Address
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}


