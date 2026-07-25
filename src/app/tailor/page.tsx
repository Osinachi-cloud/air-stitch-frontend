"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { baseUrL } from "@/env/URLs";
import { User } from "@/types/user";

interface AddressData {
  fullAddress?: string;
  city?: string;
  state?: string;
  country?: string;
}

export default function TailorAccountOverviewPage() {
  const router = useRouter();
  const { getUserDetails } = useLocalStorage<User>("tailorDetails");
  const stored = getUserDetails();

  const email = stored?.emailAddress;
  const token = stored?.accessToken;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  useEffect(() => {
    if (!email || !token) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrL}/customer-details?emailAddress=${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data");
      } finally {
        setLoading(false);
      }

      try {
        const res = await fetch(`${baseUrL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAddressData(Array.isArray(data) ? data[0] : data);
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    fetchAll();

    const handleUpdate = () => fetchAll();
    window.addEventListener("userDetailsUpdated", handleUpdate);
    return () => window.removeEventListener("userDetailsUpdated", handleUpdate);
  }, [email, token]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
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
  const address = addressData
    ? [addressData.fullAddress, addressData.city, addressData.state, addressData.country]
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

        {/* Row 1 */}
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

          {/* Personal Information */}
          <section>
            <h2 className="text-sm font-display font-bold text-surface-800">
              Personal Information
            </h2>
            <div className="mt-2 text-sm text-surface-700 leading-6">
              <div className="font-medium text-surface-800">{fullName}</div>
              <div className="text-surface-600">{emailAddress}</div>
              <div className="text-surface-600">{phone}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => router.push("/tailor/account-settings")}
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

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px_1fr_1fr] mt-8">
          <div />

          {/* Business Information */}
          <section className="md:col-span-2">
            <h2 className="text-sm font-display font-bold text-surface-800 flex items-center gap-2">
              Business Information
              <button
                onClick={() => router.push("/tailor/account-settings")}
                className="text-surface-500 hover:text-surface-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-surface-800">Business Name</h3>
                <p className="mt-1 text-sm text-surface-600">{fullName}</p>
                <p className="text-sm text-surface-600">{emailAddress}</p>
                <button
                  onClick={() => router.push("/tailor/account-settings")}
                  className="mt-3 inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors"
                >
                  Edit Address
                </button>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-surface-800">Business Address</h3>
                <p className="mt-1 text-sm text-surface-600">{address}</p>
                <button
                  onClick={() => router.push("/tailor/account-settings")}
                  className="mt-3 inline-flex items-center rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-surface-50 transition-colors"
                >
                  Edit Address
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
